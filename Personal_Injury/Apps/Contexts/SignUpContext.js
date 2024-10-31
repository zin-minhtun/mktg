import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updatePassword,
} from "firebase/auth";
import React, { createContext, useState, useContext } from "react";
import { auth } from "../../firebase";
import { useUserData } from "./UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

export const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [id, setId] = useState("");
	const { setNavigation } = useUserData(); // Properly call useUserData to get the context value

	const register = async (navigation) => {
		try {
			// Log the start of the registration process
			console.log("Starting user registration...");
			//TODO remove this next line
			console.log("user details", email, password, firstName, lastName);
			// Create user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			// Log the UID of the newly created user
			console.log("User created with UID:", userCredential.user.uid);

			// Make a request to your backend
			console.log(`${API_URL}/api/v1/users/`);
			const backendResponse = await axios.post(`${API_URL}/api/v1/users/`, {
				firstName,
				lastName,
				email,
				uid: userCredential.user.uid,
				dateOfBirth,
			});
			console.log("backendResponse", backendResponse.data.data.user._id);
			setId(backendResponse.data.data.user._id);
			console.log("user registered in the backend");
			// setNavigation(navigation);
			navigation.navigate("AuthenticationNavigator", { screen: "SignUpInfo" });

			// navigation.navigate("TabNavigator", { screen: "HomeScreenTabs" });
		} catch (error) {
			// Log the error details
			console.error("Error during registration:", error.message);

			if (error.code === "auth/email-already-in-use") {
				console.log("This email is already in use.");
				alert("This email is already in use.");
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
			// Retrieve stored email and UID
			const storedEmail = await AsyncStorage.getItem("userEmail");
			const storedUid = await AsyncStorage.getItem("storedUid");

			if (!storedEmail || !storedUid) {
				throw new Error("Stored user data not found");
				// TODO: handle user data of AsyncStorage
			}

			// Re-authenticate the user
			const userCrendential = await signInWithEmailAndPassword(
				auth,
				storedEmail,
				currentPassword
			);
			const user = userCrendential.user;

			if (user.uid === storedUid) {
				// Update the password
				await updatePassword(user, newPassword);
				console.log("Password updated successfully");
				return true;
			} else {
				console.log("UID mismatch: re-authentication failed");
				return false;
			}
		} catch (error) {
			console.error(`Error [${error.code}]: ${error.message}`);
			return false;
		}
	};

	const deleteAuthUser = async (currentPassword) => {
		try {
			// Retrieve stored email
			const storedEmail = await AsyncStorage.getItem("userEmail");

			if (!storedEmail) {
				throw new Error("Stored user data not found");
				// TODO: handle user data of AsyncStorage
			}

			// Re-authenticate the user
			const userCredential = await signInWithEmailAndPassword(
				auth,
				storedEmail,
				currentPassword
			);
			const currentUser = userCredential.user;
			const userIdToDelete = await AsyncStorage.getItem("userId");

			if (currentUser) {
				// delete User data from DB
				const deleteResult = await deleteDbUser(userIdToDelete);

				// User deleted
				if (deleteResult.status === 200) {
					// delete User from Firebase
					await currentUser.delete();
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
			} else {
				console.log("User not found!");
				return { status: 401, message: "Wrong Password!" };
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
	return useContext(SignUpContext);
};
