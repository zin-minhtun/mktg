import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Linking,
  Share,
  Image
} from "react-native";
import React, { useState } from "react";
import ArrowRight from "../../Components/Icons/ArrowRight";
import ArrowDown from "../../Components/Icons/ArrowDown";
import UserIcon from "./svg/UserIcon";
import { User as LucideUserIcon } from 'lucide-react-native';
import LockIcon from "./svg/LockIcon";
import FileAddIcon from "./svg/FileAddIcon";
import AlarmClockIcon from "./svg/AlarmClockIcon";
import ExportIcon from "./svg/ExportIcon";
import ExportOutIcon from "./svg/ExportOutIcon";
import FavoriteFillIcon from "./svg/FavoriteFillIcon";
import HappyIcon from "./svg/HappyIcon";
import PaperFill from "./svg/PaperFill";
import StarFillIcon from "./svg/StartFillIcon";
import SendFillIcon from "./svg/SendFillIcon";
import ChatFillIcon from "./svg/ChatFillIcon";
import MoonIcon from "./svg/MoonIcon";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../Contexts/ThemeContext";
import { useUserData } from "../../Contexts/UserContext";
import ScreenLayout from "../../Components/Layout/ScreenLayout";

const Settings = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.background === "#00192F";

  const { gUser } = useUserData();

  const displayName = gUser
    ? `${gUser.firstName || ""}${gUser.lastName ? ` ${gUser.lastName}` : ""
      }`.trim()
    : null;

  const handlePress = (screen) => {
    navigation.push("SettingsNavigatorV1", {
      screen,
    });
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: "Check out this app!",
      });
    } catch (e) { }
  };

  const openCommunity = () => {
    Linking.openURL("https://www.facebook.com/groups/230392641374560/?rdid=MhFFE57DlcWuniaI&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F1C4mRvLRz5%2F#");
  };

  const openRateApp = () => {
    // Replace with the actual store link
    Linking.openURL("https://example.com/rate");
  };

  return (
    <ScreenLayout
      backgroundColor={theme.background}
      scroll={true}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={{ marginHorizontal: 16 }}>
        <View style={{ paddingTop: 32, paddingBottom: 20 }}>
          <Text
            style={{
              fontFamily: "Raleway-Bold",
              fontSize: 32,
              color: theme.textColor,
            }}
          >
            Settings
          </Text>
        </View>
        {/* ... remainder ... */}

        <View>
          <Text
            style={{
              marginBottom: 12,
              fontFamily: "Raleway-SemiBold",
              color: theme.textColor,
              fontSize: 16,
            }}
          >
            Account
          </Text>
          <View
            style={{
              paddingHorizontal: 20,
              borderWidth: 1,
              borderColor: theme.borderColor,
              borderRadius: 8,
              backgroundColor: theme.textFieldBG,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.borderColor,
              }}
            >
              <TouchableOpacity onPress={() => handlePress("Profile")}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <View style={{ width: 24, height: 24, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginRight: 0 }}>
                      {gUser?.profilePicture ? (
                        <Image
                          source={{ uri: gUser.profilePicture }}
                          style={{ width: 24, height: 24 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <LucideUserIcon size={20} color={theme.textColor} />
                      )}
                    </View>
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      {displayName || gUser?.email || "Account"}
                    </Text>
                  </View>

                  <ArrowRight color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => handlePress("ResetPassword")}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <LockIcon color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Security
                    </Text>
                  </View>

                  <ArrowRight color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Health Record Section */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              marginBottom: 12,
              fontFamily: "Raleway-SemiBold",
              color: theme.textColor,
              fontSize: 16,
            }}
          >
            Health Record
          </Text>
          <View
            style={{
              paddingHorizontal: 20,
              borderWidth: 1,
              borderColor: theme.borderColor,
              borderRadius: 8,
              backgroundColor: theme.textFieldBG,
            }}
          >
            <View>
              <TouchableOpacity onPress={() => handlePress("MyHealthRecord")}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <FileAddIcon color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      My Health Record
                    </Text>
                  </View>

                  <ArrowRight color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* App Preferences Section with Dark Mode Toggle */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              marginBottom: 12,
              fontFamily: "Raleway-SemiBold",
              color: theme.textColor,
              fontSize: 16,
            }}
          >
            App Preferences
          </Text>
          <View
            style={{
              paddingHorizontal: 20,
              borderWidth: 1,
              borderColor: theme.borderColor,
              borderRadius: 8,
              backgroundColor: theme.textFieldBG,
            }}
          >
            {/* Dark Mode Toggle */}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.borderColor,
                paddingVertical: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MoonIcon color={theme.textColor} />
                <Text
                  style={{
                    fontFamily: "Raleway-SemiBold",
                    color: theme.textColor,
                    fontSize: 16,
                    marginLeft: 8,
                  }}
                >
                  Dark Mode
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#00B8DF" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleTheme}
                value={isDarkMode}
              />
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.borderColor,
              }}
            >
              <TouchableOpacity
                onPress={() => handlePress("RemindersNavigator")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <AlarmClockIcon color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Reminders
                    </Text>
                  </View>

                  <ArrowRight color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.borderColor,
              }}
            >
              <TouchableOpacity
                onPress={() => handlePress("NotificationSettings")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Ionicons name="notifications-outline" size={24} color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Notifications
                    </Text>
                  </View>

                  <ArrowRight color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => handlePress("DataShare")}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <ExportIcon color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Data Share
                    </Text>
                  </View>

                  <ArrowRight color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Resources Section */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              marginBottom: 12,
              fontFamily: "Raleway-SemiBold",
              color: theme.textColor,
              fontSize: 16,
            }}
          >
            Resources
          </Text>
          <View
            style={{
              paddingHorizontal: 20,
              borderWidth: 1,
              borderColor: theme.borderColor,
              borderRadius: 8,
              backgroundColor: theme.textFieldBG,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.borderColor,
              }}
            >
              <TouchableOpacity onPress={openCommunity}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <FavoriteFillIcon color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Join the Community
                    </Text>
                  </View>

                  <ExportOutIcon color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.borderColor,
              }}
            >
              <TouchableOpacity onPress={() => handlePress("Legal")}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <PaperFill color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Legal
                    </Text>
                  </View>

                  <ArrowRight color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Support the App Section */}
        <View style={{ marginTop: 24 }}>
          <Text
            style={{
              marginBottom: 12,
              fontFamily: "Raleway-SemiBold",
              color: theme.textColor,
              fontSize: 16,
            }}
          >
            Support the App
          </Text>
          <View
            style={{
              paddingHorizontal: 20,
              borderWidth: 1,
              borderColor: theme.borderColor,
              borderRadius: 8,
              backgroundColor: theme.textFieldBG,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.borderColor,
              }}
            >
              <TouchableOpacity onPress={openRateApp}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <StarFillIcon color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Rate the App
                    </Text>
                  </View>

                  <ExportOutIcon color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: theme.borderColor,
              }}
            >
              <TouchableOpacity onPress={shareApp}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <SendFillIcon color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Share the App
                    </Text>
                  </View>

                  <ExportOutIcon color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => handlePress("Feedback")}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                  }}
                >
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <ChatFillIcon color={theme.textColor} />
                    <Text
                      style={{
                        fontFamily: "Raleway-SemiBold",
                        color: theme.textColor,
                        fontSize: 16,
                        marginLeft: 8,
                      }}
                    >
                      Make a Suggestion
                    </Text>
                  </View>

                  <ArrowRight color={theme.darkGrey} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScreenLayout>
  );
};

export default Settings;
