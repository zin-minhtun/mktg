import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import React, { createContext, useState, useContext } from "react";
import { auth } from "../../firebase";
import { useUserData } from "./UserContext";
import { useOnboarding } from "./OnboardingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

export const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
  //conflict section
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [firstName, setFirstName] = useState("");
  //   const [lastName, setLastName] = useState("");
  //   const [dateOfBirth, setDateOfBirth] = useState("");
  //   const [id, setId] = useState("");
  //   const { setNavigation } = useUserData(); // Properly call useUserData to get the context value

  //   const register = async (navigation) => {
  //     try {
  //       // Log the start of the registration process
  //       console.log("Starting user registration...");
  //       //TODO remove this next line
  //       console.log("user details", email, password, firstName, lastName);
  //       // Create user with email and password
  //       const userCredential = await createUserWithEmailAndPassword(
  //         auth,
  //         email,
  //         password
  //       );

  //       // Log the UID of the newly created user
  //       // console.log("User created with UID:", userCredential.user.uid);

  //       // Make a request to your backend
  //       // console.log(`${API_URL}/api/v1/users/`);
  //       const backendResponse = await axios.post(`${API_URL}/api/v1/users/`, {
  //         firstName,
  //         lastName,
  //         email,
  //         uid: userCredential.user.uid,
  //         dateOfBirth,
  //       });
  //       console.log("backendResponse", backendResponse.data.data.user._id);
  //       setId(backendResponse.data.data.user._id);
  //       console.log("user registered in the backend");
  //       // setNavigation(navigation);
  //       navigation.navigate("AuthenticationNavigator", { screen: "SignUpInfo" });

  //       // navigation.navigate("TabNavigator", { screen: "HomeScreenTabs" });
  //     } catch (error) {
  //       // Log the error details
  //       console.error("Error during registration:", error.message);
  //     }
  //   };
  //   /////
  //   /////
  //   // const register = async (navigation) => {
  //   //   console.log("register");
  //   //   setNavigation(navigation);
  //   //   // navigation.navigate("TabNavigator");
  //   //   navigation.navigate("AuthenticationNavigator", { screen: "SignUpInfo" });
  //   // };
  //   //////
  //   /////

  //   const updateUserPassword = async (currentPassword, newPassword) => {
  //     try {
  //       // Retrieve stored email and UID
  //       const storedEmail = await AsyncStorage.getItem("userEmail");
  //       const storedUid = await AsyncStorage.getItem("storedUid");

  //       if (!storedEmail || !storedUid) {
  //         throw new Error("Stored user data not found");
  //         // TODO: handle user data of AsyncStorage
  //       }

  //       // Re-authenticate the user
  //       const userCrendential = await signInWithEmailAndPassword(
  //         auth,
  //         storedEmail,
  //         currentPassword
  //       );
  //       const user = userCrendential.user;

  //       if (user.uid === storedUid) {
  //         // Update the password
  //         await updatePassword(user, newPassword);
  //         console.log("Password updated successfully");
  //         return true;
  //       } else {
  //         console.log("UID mismatch: re-authentication failed");
  //         return false;
  //       }
  //     } catch (error) {
  //       console.error(`Error [${error.code}]: ${error.message}`);
  //       return false;
  //     }
  //   };

  //   const deleteAuthUser = async (currentPassword) => {
  //     try {
  //       // Retrieve stored email
  //       const storedEmail = await AsyncStorage.getItem("userEmail");

  //       if (!storedEmail) {
  //         throw new Error("Stored user data not found");
  //         // TODO: handle user data of AsyncStorage
  //       }

  //       // Re-authenticate the user
  //       const userCredential = await signInWithEmailAndPassword(
  //         auth,
  //         storedEmail,
  //         currentPassword
  //       );
  //       const currentUser = userCredential.user;
  //       const userIdToDelete = await AsyncStorage.getItem("userId");

  //       if (currentUser) {
  //         // delete User data from DB
  //         const deleteResult = await deleteDbUser(userIdToDelete);

  //         // User deleted
  //         if (deleteResult.status === 200) {
  //           // delete User from Firebase
  //           await currentUser.delete();
  //           console.log("User Deleted from Firebase.");

  //           console.log("User Account_DB Deleted succesfully!");
  //           return deleteResult;
  //         } else {
  //           console.error(
  //             "Error occurred while deleting user account DB : ",
  //             deleteResult.message
  //           );
  //           return deleteResult;
  //         }
  //       } else {
  //         console.log("User not found!");
  //         return { status: 401, message: "Wrong Password!" };
  //       }
  //     } catch (error) {
  //       console.error(`Error - [${error.code}]: ${error.message}`);
  //       return { status: 500, message: error.message };
  //     }
  //   };

  //   // Delete User data from IHP Database
  //   const deleteDbUser = async (userIdToDelete) => {
  //     try {
  //       const response = await axios.delete(
  //         `${API_URL}/api/v1/users/deleteUser`,
  //         { params: { userId: userIdToDelete } }
  //       );

  //       if (response.status === 200) {
  //         console.log("User DB deleted succesfully!!");
  //         return { status: response.status, message: response.data.message };
  //       } else {
  //         console.error(
  //           "Error occurred while deleting user from DB : ",
  //           response.data.message
  //         );
  //         return { status: response.status, message: response.data.message };
  //       }
  //     } catch (error) {
  //       console.error("Error while deleting User from DB : ", error);
  //       return error.response
  //         ? {
  //             status: error.response.status,
  //             message: error.response.data.message,
  //           }
  //         : { status: 500, message: "Internal Server Error" };
  //     }
  //   };

  //   return (
  //     <SignUpContext.Provider
  //       value={{
  //         email,
  //         setEmail,
  //         password,
  //         setPassword,
  //         firstName,
  //         setFirstName,
  //         lastName,
  //         setLastName,
  //         dateOfBirth,
  //         setDateOfBirth,
  //         register,
  //         updateUserPassword,
  //         deleteAuthUser,
  //         id,
  //         setId,
  //       }}
  //     >
  //       {children}
  //     </SignUpContext.Provider>
  //   );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [id, setId] = useState("");
  const { setNavigation, gSetUser } = useUserData();
  const { resetOnboarding } = useOnboarding();

  const register = async (navigation) => {
    try {
      console.log("[SignUp] ========== Starting user registration ==========");
      if (!email || !password) {
        console.log("[SignUp] ❌ Missing email or password");
        alert("Please enter email and password");
        return;
      }

      // DEBUG: Show all AsyncStorage keys
      const allKeys = await AsyncStorage.getAllKeys();
      console.log("[SignUp] ALL STORAGE KEYS:", JSON.stringify(allKeys));

      // Get onboardingId from AsyncStorage BEFORE creating the user
      const onboardingId = await AsyncStorage.getItem("onboardingId");
      console.log("[SignUp] Loaded onboardingId from AsyncStorage before signup:", onboardingId);

      if (!onboardingId) {
        console.warn("[SignUp] ⚠️  WARNING: No onboardingId found! User may not have completed onboarding.");
      } else {
        console.log("[SignUp] ✓ Found onboardingId:", onboardingId);
      }

      console.log("[SignUp] Creating Firebase user...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const createdUser = userCredential.user;
      console.log("[SignUp] ✓ Firebase user created with UID =", createdUser.uid);

      // Create user in backend with onboardingId
      try {
        console.log("[SignUp] Creating user in backend...");
        console.log("[SignUp] Sending onboardingId to backend:", onboardingId || "null");

        const requestPayload = {
          firstName,
          lastName,
          email,
          uid: createdUser.uid,
          dateOfBirth,
          onboardingId: onboardingId || null, // Always include, even if null
        };

        console.log("[SignUp] Request payload:", JSON.stringify(requestPayload, null, 2));

        const backendResponse = await axios.post(`${API_URL}/api/v1/users/`, requestPayload);

        console.log("[SignUp] ✓ Backend user created successfully!");
        console.log("[SignUp] User ID:", backendResponse.data.data.user._id);

        // Clear onboarding data after successful signup
        if (onboardingId) {
          console.log("[SignUp] Clearing onboarding data...");

          // Clear from AsyncStorage
          await AsyncStorage.removeItem("onboardingId");
          console.log("[SignUp] ✓ Onboarding data cleared from AsyncStorage");

          // Verify it was cleared
          const verification = await AsyncStorage.getItem("onboardingId");
          console.log("[SignUp] Verification - onboardingId after clear:", verification);

          // Reset onboarding context state
          await resetOnboarding();
          console.log("[SignUp] ✓ Onboarding context reset complete");
        }
      } catch (backendError) {
        console.error("[SignUp] ❌ Backend error:", backendError.message);
        if (backendError.response) {
          console.error("[SignUp] Response data:", JSON.stringify(backendError.response.data));
          console.error("[SignUp] Response status:", backendError.response.status);
        }
        // Don't block the signup flow if backend fails
      }

      // Persist minimal profile so backend creation can use it on first login
      const pendingProfile = { firstName, lastName, dateOfBirth };
      await AsyncStorage.setItem(
        "pendingProfile",
        JSON.stringify(pendingProfile)
      );

      // Send verification email
      console.log("[SignUp] Sending verification email...");
      await sendEmailVerification(createdUser);
      console.log("[SignUp] ✓ Verification email sent.");

      // Sign out immediately so they are forced to login after verification
      await signOut(auth);

      alert("A verification email has been sent to your address. Please verify your email before logging in.");

      console.log("[Register] ========== Registration complete (awaiting verification) ==========");
      navigation.navigate("Login");
    } catch (error) {
      console.error("[Register] ❌ Error during registration:", error.message);
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already in use.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak.");
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };
  /////
  /////
  // const register = async (navigation) => {
  //   console.log("register");
  //   setNavigation(navigation);
  //   // navigation.navigate("TabNavigator");
  //   navigation.navigate("AuthenticationNavigator", { screen: "SignUpInfo" });
  // };
  //////
  /////

  const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No user logged in");
      }

      // Re-authenticate the user
      await signInWithEmailAndPassword(
        auth,
        user.email,
        currentPassword
      );

      // Update the password
      await updatePassword(user, newPassword);
      console.log("Password updated successfully");
      return true;
    } catch (error) {
      console.error(`Error [${error.code}]: ${error.message}`);
      return false;
    }
  };

  const deleteAuthUser = async (currentPassword) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No user logged in");
      }

      // Re-authenticate the user
      await signInWithEmailAndPassword(
        auth,
        user.email,
        currentPassword
      );

      const userIdToDelete = await AsyncStorage.getItem("userId");

      // delete User data from DB
      const deleteResult = await deleteDbUser(userIdToDelete);

      // User deleted
      if (deleteResult.status === 200) {
        // delete User from Firebase
        await user.delete();
        console.log("User Deleted from Firebase.");

        console.log("User Account_DB Deleted succesfully!");
        return deleteResult;
      } else {
        console.error(
          "Error occurred while deleting user account DB : ",
          deleteResult.message
        );
        return deleteResult;
      }
    } catch (error) {
      console.error(`Error - [${error.code}]: ${error.message}`);
      return { status: 500, message: error.message };
    }
  };

  // Delete User data from IHP Database
  const deleteDbUser = async (userIdToDelete) => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/v1/users/deleteUser`,
        { params: { userId: userIdToDelete } }
      );

      if (response.status === 200) {
        console.log("User DB deleted succesfully!!");
        return { status: response.status, message: response.data.message };
      } else {
        console.error(
          "Error occurred while deleting user from DB : ",
          response.data.message
        );
        return { status: response.status, message: response.data.message };
      }
    } catch (error) {
      console.error("Error while deleting User from DB : ", error);
      return error.response
        ? {
          status: error.response.status,
          message: error.response.data.message,
        }
        : { status: 500, message: "Internal Server Error" };
    }
  };

  return (
    <SignUpContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        dateOfBirth,
        setDateOfBirth,
        register,
        updateUserPassword,
        deleteAuthUser,
        id,
        setId,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

// Custom hook to use the SignUpContext
export const useSignUpUserData = () => {
  // conflict section
  //return useContext(SignUpContext);

  return useContext(SignUpContext);
};
