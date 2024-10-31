import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebase"; // Ensure this is the correct path
import axios from "axios";
import { API_URL } from "@env";
// Create the context
const UserContext = React.createContext();

// Define the provider component
export const UserContextProvider = ({ children }) => {
  const [gUser, gSetUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [navigation, setNavigation] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const response = await axios.get(
          // TODO change the usl with env
          `${API_URL}/api/v1/users/getUserId`,
          {
            params: {
              email: user.email,
            },
          }
        );
        const userId = response.data.data.id;
        const completeUserData = {
          email: user.email,
          uid: user.uid,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          _id: response.data.data.id,
        };
        gSetUser(completeUserData);
        console.log("User is present:");
        console.log(`Email: ${user.email}`);
        console.log(`UID: ${user.uid}`);
        console.log(`_id: ${userId}`);
        // // Navigate to Dashboard if navigation is set
        // if (navigation) {
        //   console.log("navigating from user context");
        //   navigation.navigate("TabNavigator", {
        //     screen: "Tabs",
        //   });
        // }
      } else {
        gSetUser(null);
        console.log("User is not logged in.");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [navigation]);

  // this function is going to be used to logout the user
  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <UserContext.Provider
      value={{ gUser, gSetUser, logOut, isLoading, setNavigation }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserData = () => {
  return useContext(UserContext);
};
