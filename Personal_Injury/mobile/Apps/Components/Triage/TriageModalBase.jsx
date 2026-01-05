import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { COLORS } from "../../Screens/Authentication/Onboarding/OnboardingTheme";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function TriageModalBase({
    visible,
    title,
    subtitle,
    children,
    footer,
    onRequestClose
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onRequestClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header / Icon Area handled by children if unique, or standard below */}

                    <View style={styles.content}>
                        {title && <Text style={styles.title}>{title}</Text>}
                        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

                        {children}
                    </View>

                    {/* Footer / Buttons */}
                    <View style={styles.footer}>
                        {footer}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 58, 93, 0.7)", // Navy transparent
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    container: {
        width: width - 40,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    content: {
        alignItems: "center",
        marginBottom: 24,
        width: "100%",
    },
    title: {
        fontFamily: "Raleway",
        fontSize: 22,
        fontWeight: "700",
        color: COLORS.navy,
        textAlign: "center",
        marginBottom: 8,
        marginTop: 16,
    },
    subtitle: {
        fontFamily: "Raleway",
        fontSize: 16,
        color: COLORS.textGray,
        textAlign: "center",
        marginBottom: 16,
        lineHeight: 22,
    },
    footer: {
        width: "100%",
        alignItems: "center",
    }
});
