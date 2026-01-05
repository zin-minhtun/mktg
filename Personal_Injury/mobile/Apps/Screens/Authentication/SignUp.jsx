import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SignUpContext } from "../../Contexts/SignUpContext";
import { useUserData } from "../../Contexts/UserContext";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ScreenLayout from "../../Components/Layout/ScreenLayout";

export default function SignUp({ navigation }) {
  const { setEmail, setPassword, setFirstName, setLastName, register } =
    useContext(SignUpContext);
  const { googleLogin } = useUserData();
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

      //conflict section code added
      setEmail(text);
      // end conflict changes

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

      //conflict section code added
      setEmail(text);
      //end conflict section code added

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

      //conflict section code added
      setPassword(text);
      //end conflict section code added

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

      //conflict section code added
      setPassword(text);
      //end conflict section code added

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

  return (
    <ScreenLayout scroll={true} contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="flex-1 bg-white p-4">
        {/* Header */}
        <Text className="font-raleway text-left text-3xl mb-2 font-medium mt-8 text-blue-900" allowFontScaling={false}>
          Sign Up
        </Text>

        {/* First Name */}
        <Text className="font-raleway font-medium text-base mb-2 text-blue-950" allowFontScaling={false}>First name</Text>
        <TextInput
          className="font-raleway w-full p-3 pl-5 border border-gray-300 rounded-xl mb-4 text-base"
          placeholder="First name"
          placeholderTextColor="#9CA3AF"
          onChangeText={firstnameChange}
          autoCapitalize="words"
          autoCorrect={false}
          allowFontScaling={false}
        />
        {validDataColor.checkfn ? (
          <Text style={{ color: validDataColor.colorfn, fontSize: 12, marginLeft: 20, marginBottom: 8, marginTop: -10 }} allowFontScaling={false}>{validDataColor.checkfn}</Text>
        ) : null}

        {/* Last Name */}
        <Text className="font-raleway font-medium text-base mb-2 text-blue-950" allowFontScaling={false}>Last name</Text>
        <TextInput
          className="font-raleway w-full p-3 pl-5 border border-gray-300 rounded-xl mb-4 text-base"
          placeholder="Last name"
          placeholderTextColor="#9CA3AF"
          onChangeText={lastnameChange}
          autoCapitalize="words"
          autoCorrect={false}
          allowFontScaling={false}
        />
        {validDataColor.checkln ? (
          <Text style={{ color: validDataColor.colorln, fontSize: 12, marginLeft: 20, marginBottom: 8, marginTop: -10 }} allowFontScaling={false}>{validDataColor.checkln}</Text>
        ) : null}

        {/* Email */}
        <Text className="font-raleway font-medium text-base mb-2 text-blue-950" allowFontScaling={false}>Email</Text>
        <TextInput
          className="font-raleway w-full p-3 pl-5 border border-gray-300 rounded-xl mb-4 text-base"
          value={localEmail}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          onChangeText={emailChangeData}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          allowFontScaling={false}
        />
        {validDataColor.checkem ? (
          <Text style={{ color: validDataColor.colorem, fontSize: 12, marginLeft: 20, marginBottom: 8, marginTop: -10 }} allowFontScaling={false}>{validDataColor.checkem}</Text>
        ) : null}

        {/* Confirm Email */}
        <Text className="font-raleway font-medium text-base mb-2 text-blue-950" allowFontScaling={false}>Confirm Email</Text>
        <TextInput
          className="font-raleway w-full p-3 pl-5 border border-gray-300 rounded-xl mb-4 text-base"
          value={confirmEmail}
          placeholder="Confirm Email"
          placeholderTextColor="#9CA3AF"
          onChangeText={changeConfirmEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          allowFontScaling={false}
        />
        {validDataColor.checkcem ? (
          <Text style={{ color: validDataColor.colorcem, fontSize: 12, marginLeft: 20, marginBottom: 8, marginTop: -10 }} allowFontScaling={false}>{validDataColor.checkcem}</Text>
        ) : null}

        {/* Password */}
        <Text className="font-raleway font-medium text-base mb-2 text-blue-950" allowFontScaling={false}>Password</Text>
        <View>
          <TextInput
            className="font-raleway w-full p-3 pl-5 border border-gray-300 rounded-xl mb-4 text-base"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={localPassword}
            onChangeText={changePassowrdCheck}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            allowFontScaling={false}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 10, top: 15 }}
          >
            <Entypo
              name={showPassword ? "eye-with-line" : "eye"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        {validDataColor.checkpwd ? (
          <Text style={{ color: validDataColor.colorpwd, fontSize: 12, marginLeft: 20, marginBottom: 8, marginTop: -10 }} allowFontScaling={false}>{validDataColor.checkpwd}</Text>
        ) : null}

        {/* Confirm Password */}
        <Text className="font-raleway font-medium text-base mb-2 text-blue-950" allowFontScaling={false}>Confirm Password</Text>
        <View>
          <TextInput
            className="font-raleway w-full p-3 pl-5 border border-gray-300 rounded-xl mb-4 text-base"
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={confirmChangePassowrdCheck}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            allowFontScaling={false}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: "absolute", right: 10, top: 15 }}
          >
            <Entypo
              name={showConfirmPassword ? "eye-with-line" : "eye"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        {validDataColor.checkcpwd ? (
          <Text style={{ color: validDataColor.colorcpwd, fontSize: 12, marginLeft: 20, marginBottom: 8, marginTop: -10 }} allowFontScaling={false}>{validDataColor.checkcpwd}</Text>
        ) : null}

        {/* Sign Up Button */}
        <TouchableOpacity
          className="w-full p-3 bg-cyan-500 rounded-3xl mt-6"
          onPress={handleRegister}
        >
          <Text className="text-white text-center text-lg rounded-xl" allowFontScaling={false}>
            Sign Up
          </Text>
        </TouchableOpacity>

        {/* Social Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 font-raleway text-gray-500" allowFontScaling={false}>OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Social Buttons */}
        <View className="flex-row justify-center mb-6">
          <TouchableOpacity
            className="mx-4"
            onPress={() => Alert.alert("Social sign up", "Apple sign up is not configured yet.")}
          >
            <Ionicons name="logo-apple" size={32} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            className="mx-4"
            onPress={async () => {
              try {
                await googleLogin();
                navigation.reset({ index: 0, routes: [{ name: "AuthLoading" }] });
              } catch (error) {
                if (error.code === '4001' || error.message.includes('Canceled')) {
                  console.log('Google sign up canceled');
                } else {
                  Alert.alert("Google Sign Up Error", error.message);
                }
              }
            }}
          >
            <Ionicons name="logo-google" size={32} color="#DB4437" />
          </TouchableOpacity>

          <TouchableOpacity
            className="mx-4"
            onPress={() => Alert.alert("Social sign up", "Facebook sign up is not configured yet.")}
          >
            <Ionicons name="logo-facebook" size={32} color="#1877F2" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mt-4 mb-8">
          <Text className="text-base text-gray-500" allowFontScaling={false}>
            Already have an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-base text-cyan-500 underline p-0.5" allowFontScaling={false}>Log in here</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </ScreenLayout>
  );
}
