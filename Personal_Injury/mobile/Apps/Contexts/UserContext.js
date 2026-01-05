import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import React, { useEffect, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebase";
import axios from "axios";
import { API_URL, GOOGLE_WEB_CLIENT_ID } from "@env";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ReminderSyncService from "../Services/ReminderSyncService";

const fetchUserWithRetry = async (email, attempt = 0) => {
  try {
    return await axios.get(`${API_URL}/api/v1/users/getUserId`, {
      params: { email },
    });
  } catch (error) {
    if (error.response?.status === 404 && attempt < 3) {
      const delay = 400 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchUserWithRetry(email, attempt + 1);
    }
    throw error;
  }
};

// Create the context
const UserContext = React.createContext();

// Helper to set Axios default header
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Axios auth header set");
  } else {
    delete axios.defaults.headers.common["Authorization"];
    console.log("Axios auth header cleared");
  }
};

// Define the provider component
export const UserContextProvider = ({ children }) => {
  const [gUser, gSetUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [navigation, setNavigation] = useState(null);

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  // ... (rest of the file remains unchanged until loadUserFromStorage)

  // Load user data from AsyncStorage (at first run)
  const loadUserFromStorage = async () => {
    try {
      console.log("Loading user data from AsyncStorage...");
      const storedUser = await AsyncStorage.getItem("userInfo");
      const storedToken = await AsyncStorage.getItem("userToken");
      console.log("[UserContext] Token loaded from storage:", storedToken ? "YES" : "NO");

      if (storedToken) {
        setAuthToken(storedToken);
        console.log("[UserContext] Token set on axios from storage");
      } else {
        console.warn("[UserContext] ⚠️ No token in storage!");
      }

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log("User data loaded from AsyncStorage:", userData);

        // Update UserContext state
        gSetUser(userData);
      } else {
        console.log("No user data found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error loading user from AsyncStorage:", error);
    }
  };

  // Listen for Firebase Auth state changes
  useEffect(() => {
    console.log("Setting up Firebase Auth state listener...");
    setIsLoading(true);

    // First, try to load user data from AsyncStorage
    loadUserFromStorage();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(
        "Firebase Auth state changed:",
        user ? "user logged in" : "no user"
      );

      if (user) {
        setIsLoading(true);
        try {
          // Fetch user data from backend
          console.log("Fetching user data from backend...");
          let response;
          try {
            response = await fetchUserWithRetry(user.email);
          } catch (err) {
            response = err?.response?.status === 404 ? null : undefined;
            if (response === undefined) throw err; // rethrow non-404
          }

          if (response && response.data && response.data.data) {
            const userId = response.data.data.id;
            const token = response.data.token; // Get token from response

            // Prepare complete user data
            const completeUserData = {
              email: user.email,
              uid: user.uid,
              firstName: response.data.data.firstName,
              lastName: response.data.data.lastName,
              _id: response.data.data.id,
              id: response.data.data.id,
              profilePicture: response.data.data.profilePicture,
            };

            // Save user data to AsyncStorage
            await AsyncStorage.setItem(
              "userInfo",
              JSON.stringify(completeUserData)
            );
            console.log("User data saved to AsyncStorage:", completeUserData);

            // Save user ID separately
            await AsyncStorage.setItem("userId", String(userId));

            // Save and set Token
            console.log("[UserContext] Token received from backend:", token ? "YES" : "NO");
            console.log("[UserContext] Token value:", token ? `${token.substring(0, 20)}...` : "null");
            if (token) {
              await AsyncStorage.setItem("userToken", token);
              setAuthToken(token);
              console.log("JWT Token saved and set via Axios");
            } else {
              console.error("[UserContext] ❌ NO TOKEN RECEIVED FROM BACKEND!");
            }

            // Update UserContext state
            gSetUser(completeUserData);
            console.log("User context state updated:", completeUserData);

            // Sync reminders from backend and schedule notifications
            try {
              await ReminderSyncService.syncReminders(userId);
            } catch (reminderErr) {
              console.error("Error syncing reminders:", reminderErr);
              // Don't block login if reminder sync fails
            }

            console.log("User is present:");
            console.log(`Email: ${user.email}`);
            console.log(`UID: ${user.uid}`);
            console.log(`_id: ${userId}`);
          } else {
            // If user is verified but not present in backend, create on first verified login
            console.log(
              "User not found in backend. Creating new user record..."
            );
            try {
              const pendingRaw = await AsyncStorage.getItem("pendingProfile");
              const pending = pendingRaw ? JSON.parse(pendingRaw) : {};

              // Get onboardingId from AsyncStorage
              const onboardingId = await AsyncStorage.getItem("onboardingId");
              console.log("[UserContext] Found onboardingId for creation:", onboardingId);

              // Extract names from Google Profile if pending is empty
              let finalFirstName = pending.firstName || "";
              let finalLastName = pending.lastName || "";

              if ((!finalFirstName || !finalLastName) && user.displayName) {
                const names = user.displayName.split(" ");
                finalFirstName = names[0] || "";
                finalLastName = names.length > 1 ? names.slice(1).join(" ") : "";
              }

              const payload = {
                firstName: finalFirstName,
                lastName: finalLastName,
                email: user.email,
                uid: user.uid,
                dateOfBirth: pending.dateOfBirth || "",
                onboardingId: onboardingId || null, // Include Onboarding ID
              };

              console.log("[UserContext] Creating backend user with payload:", payload);

              // If new user created
              const backendResponse = await axios.post(
                `${API_URL}/api/v1/users/`,
                payload
              );
              const newUser = backendResponse.data?.data?.user;
              const newToken = backendResponse.data?.token; // Get token from create response

              const completeUserData = {
                email: user.email,
                uid: user.uid,
                firstName: newUser?.firstName || payload.firstName,
                lastName: newUser?.lastName || payload.lastName,
                _id: newUser?._id,
                id: newUser?._id,
              };

              // Save user data and token
              await AsyncStorage.setItem(
                "userInfo",
                JSON.stringify(completeUserData)
              );
              console.log("[UserContext] NEW USER - Token received:", newToken ? "YES" : "NO");
              if (newToken) {
                await AsyncStorage.setItem("userToken", newToken);
                setAuthToken(newToken);
                console.log("[UserContext] NEW USER - Token saved and set");
              } else {
                console.error("[UserContext] ❌ NEW USER - NO TOKEN FROM CREATE!");
              }

              await AsyncStorage.setItem("userId", String(completeUserData.id));
              await AsyncStorage.removeItem("pendingProfile");

              // Also clear onboarding data if successful
              if (onboardingId) {
                await AsyncStorage.removeItem("onboardingId");
              }

              gSetUser(completeUserData);
              console.log("New backend user created and context updated.");
            } catch (createErr) {
              console.error(
                "Failed to create backend user on first verified login:",
                createErr
              );
            }
          }
        } catch (error) {
          console.error("Error fetching user data from backend:", error);

          // Keep basic user data if backend fetch fails
          const basicUserData = {
            email: user.email,
            uid: user.uid,
            id: user.uid, // Use UID as ID for now
          };

          await AsyncStorage.setItem("userInfo", JSON.stringify(basicUserData));
          gSetUser(basicUserData);
        } finally {
          setIsLoading(false);
          console.log("Finished auth state handling - isLoading set to false");
        }
      } else {
        // No user logged in
        console.log("No user logged in, clearing user data");
        try {
          await AsyncStorage.removeItem("userInfo");
          await AsyncStorage.removeItem("userId");
          await AsyncStorage.removeItem("userToken"); // Clear token
          await AsyncStorage.removeItem("firstLoginDone");
          await AsyncStorage.removeItem("isNewSignup");
          setAuthToken(null); // Clear header
        } catch (storageError) {
          console.error("Error clearing AsyncStorage:", storageError);
        }

        gSetUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log("Unsubscribing from Firebase Auth state changes");
      unsubscribe();
    };
  }, []);

  // Login fonksiyonu
  const login = async (email, password) => {
    console.log("Login attempt for:", email);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential.user.emailVerified) {
        console.log("User email not verified. Signing out.");
        await signOut(auth);
        return { success: false, error: "A verification email has been sent to your address. Please verify your email before logging in." };
      }

      console.log("Login successful for:", email);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Google Login Function
  const googleLogin = async () => {
    try {
      console.log("Starting Google Sign-In...");
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log("Play Services verified. Requesting sign-in...");
      const userInfo = await GoogleSignin.signIn();
      console.log("Google userInfo success:", userInfo);

      // Handle response format change across library versions
      // The user requested checking userInfo.idToken directly
      const idToken = userInfo.idToken || (userInfo.data && userInfo.data.idToken);

      if (!idToken) {
        throw new Error("Google Sign-In failed: No ID Token returned");
      }

      const credential = GoogleAuthProvider.credential(idToken);
      console.log("Google credential created, signing in to Firebase...");

      return await signInWithCredential(auth, credential);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  // Logout fonksiyonu
  const logOut = async () => {
    console.log("Logout attempt");
    try {
      await signOut(auth);
      await GoogleSignin.signOut(); // Sign out from Google as well
      await AsyncStorage.removeItem("userInfo");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("userToken");
      setAuthToken(null);
      gSetUser(null);
      console.log("Logout successful");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        gUser,
        gSetUser,
        logOut,
        isLoading,
        setNavigation,
        navigation,
        login,
        googleLogin, // Export new function
        user: gUser, // Add user for backward compatibility
        // Access user ID directly for HomeScreen
        userId: gUser?.id || gUser?._id,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserData = () => {
  return useContext(UserContext);
};
