import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { useTheme } from "../../Contexts/ThemeContext";
import { useSignUpUserData } from "../../Contexts/SignUpContext";
import { useUserData } from "../../Contexts/UserContext";

export default function ResetPassword({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { theme } = useTheme();

  const { updateUserPassword } = useSignUpUserData();
  const { logOut } = useUserData();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "AuthenticationNavigator" }],
      });
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const checkResetPwd = () => {
    if (newPassword === "" || confirmPassword === "") {
      Alert.alert("Invalid Input", "Please enter all the fields!");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Invalid Input", "Password should be longer than 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please make sure both passwords are the same!");
      setConfirmPassword("");
      return;
    }
    setModalVisible(true);
  };

  const handleResetPwd = async () => {
    try {
      if (newPassword === currentPassword) {
        Alert.alert("Invalid Input", "New password must be different from current one!");
        setCurrentPassword("");
        setModalVisible(false);
        return;
      }
      const result = await updateUserPassword(currentPassword, newPassword);
      if (result) {
        Alert.alert("Success", "Password has been reset successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setModalVisible(false);
        handleLogOut();
      } else {
        throw new Error("Invalid password!");
      }
    } catch (error) {
      console.error("Error updating password: ", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.contentWrap}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textColor }]}>Reset Password</Text>
                <Text style={[styles.subtitle, { color: theme.textColor }]}>
                  Your new password must be unique from those previously used
                </Text>
              </View>

              {/* Inputs */}
              <View style={styles.inputsBlock}>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }]}
                    placeholder="New Password"
                    placeholderTextColor={theme.darkGrey}
                    value={newPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Entypo name={showPassword ? "eye-with-line" : "eye"} size={24} color={theme.darkGrey} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputWrap}>
                  <TextInput
                    style={[styles.textInput, { backgroundColor: theme.textFieldBG, borderColor: theme.borderColor, color: theme.textColor }]}
                    placeholder="Confirm Password"
                    placeholderTextColor={theme.darkGrey}
                    value={confirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    <Entypo name={showConfirmPassword ? "eye-with-line" : "eye"} size={24} color={theme.darkGrey} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* CTA (single button) */}
              <View style={styles.ctaWrap}>
                <TouchableOpacity style={styles.cta} onPress={checkResetPwd} activeOpacity={0.8}>
                  <Text style={styles.ctaText}>Reset Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOuter}>
            <View style={[styles.modalCard, { backgroundColor: theme.textFieldBG }]}>
              <Text style={[styles.modalText, { color: theme.textColor }]}>Please enter your current password.</Text>

              <View style={styles.modalInputWrap}>
                <TextInput
                  style={[styles.textInput, { marginTop: 6, backgroundColor: theme.background, borderColor: theme.borderColor, color: theme.textColor }]}
                  placeholder="Current Password"
                  placeholderTextColor={theme.darkGrey}
                  value={currentPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.modalEyeIcon}>
                  <Entypo name={showPassword ? "eye-with-line" : "eye"} size={24} color={theme.darkGrey} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnDanger]} onPress={handleResetPwd}>
                  <Text style={styles.modalBtnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 16 },
  contentWrap: { width: "100%", maxWidth: 420, alignSelf: "center" },
  header: { marginTop: 8, marginBottom: 8, alignItems: "center" },
  title: { fontSize: 30, fontWeight: "700", textAlign: "center" },
  subtitle: { fontSize: 16, marginTop: 8, textAlign: "center", opacity: 0.8 },
  inputsBlock: { marginTop: 24 },
  inputWrap: { position: "relative", marginTop: 12 },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    height: 70,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    fontSize: 18,
  },
  eyeIcon: { position: "absolute", right: 20, top: 23 },
  ctaWrap: { marginTop: 32 },
  cta: {
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0ea5e9",
    backgroundColor: "#38bdf8",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "white", fontWeight: "700", fontSize: 20 },
  modalOuter: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.25)" },
  modalCard: { width: "95%", maxWidth: 420, borderRadius: 12, backgroundColor: "white", padding: 12, alignItems: "center" },
  modalText: { fontSize: 18, marginVertical: 10, color: "#1F2937" },
  modalInputWrap: { width: "100%", position: "relative" },
  modalEyeIcon: { position: "absolute", right: 20, top: 23 },
  modalActions: { flexDirection: "row", marginTop: 6, width: "100%", justifyContent: "space-between" },
  modalBtn: { width: 100, height: 40, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  modalBtnPrimary: { backgroundColor: "#0b8fc4" },
  modalBtnDanger: { backgroundColor: "#c40b74" },
  modalBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
