import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useContext, useState } from "react";
import { SignUpContext } from "../../Contexts/SignUpContext";
import { Entypo } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

export default function SignUp({ navigation }) {
  const { setEmail, setPassword, setFirstName, setLastName, register } =
    useContext(SignUpContext);
  const [localfn, setLocalfn] = useState("");
  const [localln, setLocalln] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [confirmEmail, setconfirmEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Added color to add the text of the data is invalid
  const [validDataColor, setValidDataColor] = useState({
    checkfn: "",
    colorfn: "black",
    checkln: "",
    colorln: "black",
    checkem: "",
    colorem: "black",
    checkcem: "",
    colorcem: "black",
    checkpwd: "",
    colorpwd: "black",
    checkcpwd: "",
    colorcpwd: "black",
  });

  //function for change first name and checking if the user input valid firstname

  const firstnameChange = function (text) {
    setLocalfn(text);

    if (!/^[A-Za-z]+(?:[-\s][A-Za-z]+)*$/.test(text)) {
      setValidDataColor({
        ...validDataColor,
        checkfn: "Invalid firstname",
        colorfn: "red",
      });
      return false;
    } else {
      setValidDataColor({
        ...validDataColor,
        checkfn: "Firstname is valid",
        colorfn: "green",
      });
      setFirstName(text);
      return true;
    }
  };
  //function for change  lastname and checking if the user input valid lastname
  const lastnameChange = function (text) {
    setLocalln(text);

    if (!/^[A-Za-z]+(?:[-\s][A-Za-z]+)*$/.test(text)) {
      setValidDataColor({
        ...validDataColor,
        checkln: "Invalid lastname",
        colorln: "red",
      });
      return false;
    } else {
      setValidDataColor({
        ...validDataColor,
        checkln: "Lastname is valid",
        colorln: "green",
      });
      setLastName(text);
      return true;
    }
  };
  //function to check the email and check if the user provide valid email

  const emailChangeData = function (text) {
    setLocalEmail(text);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localEmail)) {
      setValidDataColor({
        ...validDataColor,
        checkem: "Invalid email",
        colorem: "red",
      });
      return false;
    } else {
      setValidDataColor({
        ...validDataColor,
        checkem: "Email is valid",
        colorem: "green",
      });
      setEmail(text);
      return true;
    }
  };

  //function for confirm email to check if it is correct email

  const changeConfirmEmail = function (text) {
    setconfirmEmail(text);

    if (localEmail !== text) {
      setValidDataColor({
        ...validDataColor,
        checkcem: "Email doesn't match",
        colorcem: "red",
      });
      return false;
    } else {
      setValidDataColor({
        ...validDataColor,
        checkcem: "Email matched",
        colorcem: "green",
      });
      setEmail(text);
      return true;
    }
  };

  //Checking valid Password and Printing error on the basis of that

  const changePassowrdCheck = function (text) {
    setLocalPassword(text);
    const isValidPassword = (password) => {
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>\[\]]/;
      const upperCaseRegex = /[A-Z]/;
      const lowerCaseRegex = /[a-z]/;
      return (
        specialCharRegex.test(password) &&
        upperCaseRegex.test(password) &&
        lowerCaseRegex.test(password)
      );
    };
    if (text.length < 6) {
      setValidDataColor({
        ...validDataColor,
        checkpwd: "Password should be longer than 6 characters",
        colorpwd: "red",
      });
      return false;
    } else if (!isValidPassword(text)) {
      setValidDataColor({
        ...validDataColor,
        checkpwd:
          "Password should have at least one special character, one uppercase letter, and one lowercase letter",
        colorpwd: "red",
      });
      return false;
    } else {
      setValidDataColor({
        ...validDataColor,
        checkpwd: "Valid Password",
        colorpwd: "green",
      });
      setPassword(text);
      return true;
    }
  };
  //Checking Confirm Password

  const confirmChangePassowrdCheck = function (text) {
    setConfirmPassword(text);

    if (localPassword !== text) {
      setValidDataColor({
        ...validDataColor,
        checkcpwd: "Password doesn't match",
        colorcpwd: "red",
      });
      return false;
    } else {
      setValidDataColor({
        ...validDataColor,
        checkcpwd: "Password matched",
        colorcpwd: "green",
      });
      setPassword(text);
      return true;
    }
  };

  const handleRegister = () => {
    // TODO uncomment this
    if (!firstnameChange(localfn)) {
      Alert.alert("Invalid Firstname", validDataColor.checkfn);
    } else if (!lastnameChange(localln)) {
      Alert.alert("Invalid Lastname", validDataColor.checkln);
    } else if (!emailChangeData(localEmail)) {
      Alert.alert("Invalid Email", validDataColor.checkem);
    } else if (!changeConfirmEmail(confirmEmail)) {
      Alert.alert("Invalid Confirm Email", validDataColor.checkcem);
    } else if (!changePassowrdCheck(localPassword)) {
      Alert.alert("Invalid Password", validDataColor.checkpwd);
    } else if (!confirmChangePassowrdCheck(confirmPassword)) {
      Alert.alert("Invalid Confirm Password", validDataColor.checkcpwd);
    } else {
      // Dont remove this console log line
      console.log("signup", localfn, localln, localEmail, localPassword);
      setFirstName(localfn);
      setLastName(localln);
      setEmail(localEmail);
      setPassword(localPassword);
      console.log("handleRegister");
      register(navigation);
    }
  };
  /////
  /////
  // const handleRegister = () => {
  //   console.log("handleRegister");
  //   setFirstName("ett");
  //   setLastName("asdf");
  //   setEmail("test11@test.com");
  //   setPassword("123456.Qq");
  //   register(navigation);
  // };
  /////
  /////

  return (
    // <SafeAreaView className="flex-1">
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <View className="flex-1 bg-white px-4 pb-28">
          <Text className="font-raleway text-left text-3xl mb-2 font-medium mt-8 text-blue-900">
            Sign Up
          </Text>

          <Text className="font-raleway font-medium text-base mb-2 text-blue-950">
            Firstname
          </Text>
          <TextInput
            className=" font-raleway  w-full p-3 pl-5  border border-gray-300 rounded-xl mb-4 text-base"
            placeholder="Enter your firstname"
            onChangeText={firstnameChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text
            className="font-raleway font-medium text-base mb-2 text-blue-950"
            style={{ color: validDataColor.colorfn }}
          >
            {validDataColor.checkfn}
          </Text>

          <Text className="font-raleway font-medium text-base mb-3">
            Lastname
          </Text>
          <TextInput
            className="font-raleway  w-full p-3 pl-5  border border-gray-300 rounded-xl mb-4 text-base"
            placeholder="Enter your lastname"
            onChangeText={lastnameChange}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text
            className="font-raleway font-medium text-base mb-2 text-blue-950"
            style={{ color: validDataColor.colorln }}
          >
            {validDataColor.checkln}
          </Text>

          <Text className="font-raleway font-medium text-base mb-3">Email</Text>
          <TextInput
            className="font-raleway w-full p-3 pl-5  border border-gray-300 rounded-xl mb-4 text-base"
            value={localEmail}
            placeholder={"Email"}
            onChangeText={emailChangeData}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text
            className="font-raleway font-medium text-base mb-2 text-blue-950"
            style={{ color: validDataColor.colorem }}
          >
            {validDataColor.checkem}
          </Text>

          <Text className="font-raleway font-medium text-base mb-3">
            Confirm Email
          </Text>
          <TextInput
            className="font-raleway w-full p-3 pl-5  border border-gray-300 rounded-xl mb-4 text-base"
            value={confirmEmail}
            placeholder={"Confirm Email"}
            onChangeText={changeConfirmEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text
            className="font-raleway font-medium text-base mb-2 text-blue-950"
            style={{ color: validDataColor.colorcem }}
          >
            {validDataColor.checkcem}
          </Text>

          <Text className=" font-raleway font-medium text-base mb-3">
            New Password
          </Text>
          <View>
            <TextInput
              className="font-raleway w-full p-3 pl-5  border border-gray-300 rounded-xl mb-4 text-base"
              placeholder="New Password"
              value={localPassword}
              onChangeText={changePassowrdCheck}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 10, top: 20 }}
            >
              <Entypo
                name={showPassword ? "eye-with-line" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <Text
            className="font-raleway font-medium text-base mb-2 text-blue-950"
            style={{ color: validDataColor.colorpwd }}
          >
            {validDataColor.checkpwd}
          </Text>

          <Text className="font-raleway  font-medium text-base mb-3">
            Confirm Password
          </Text>
          <View>
            <TextInput
              className="font-raleway w-full p-3 pl-5  border border-gray-300 rounded-xl mb-4 text-lg"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={confirmChangePassowrdCheck}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: "absolute", right: 10, top: 20 }}
            >
              <Entypo
                name={showConfirmPassword ? "eye-with-line" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <Text
            className="font-raleway font-medium text-base mb-2 text-blue-950"
            style={{ color: validDataColor.colorcpwd }}
          >
            {validDataColor.checkcpwd}
          </Text>

          <TouchableOpacity
            className="w-full p-3 bg-cyan-500 rounded-3xl"
            onPress={handleRegister}
          >
            <Text className="text-white text-center text-lg rounded-xl">
              Sign Up
            </Text>
          </TouchableOpacity>
          <View className="mt-2 items-center">
            <Text>
              Already have an account?{" "}
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-blue-500">Login</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    // </SafeAreaView>
  );
}
