import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CenteredModalCard from "../../designSystem/components/CenteredModalCard";
import PrimaryButton from "../../designSystem/components/PrimaryButton";
import BaseText from "../../designSystem/components/BaseText";
import { colors, spacing, typography, radius } from "../../designSystem/theme";

export default function TriageMessageModal({ visible, onPrimaryPress, reason }) {
    return (
        <CenteredModalCard
            visible={visible}
            title="Thank You For Sharing Your Story"
            subtitle="We appreciate you being open with us."
            footer={
                <PrimaryButton
                    title="Get Started"
                    onPress={onPrimaryPress}
                />
            }
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.bgMessage }]}>
                <MaterialCommunityIcons name="heart-outline" size={64} color={colors.message} />
            </View>

            <View style={styles.infoContainer}>
                <BaseText style={styles.infoText}>
                    The app is here to support you in whatever way works best for you.
                </BaseText>
                {reason && (
                    <View style={styles.reasonContainer}>
                        <BaseText style={styles.reasonText}>
                            <BaseText style={styles.reasonLabel}>Assessment: </BaseText>
                            {reason}
                        </BaseText>
                    </View>
                )}
            </View>
        </CenteredModalCard>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        marginBottom: spacing.m,
        padding: spacing.l,
        borderRadius: radius.circle,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainer: {
        paddingHorizontal: spacing.s,
        width: '100%',
        alignItems: 'center',
    },
    infoText: {
        ...typography.body,
        marginBottom: spacing.m,
    },
    reasonContainer: {
        marginTop: spacing.m,
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.s,
        backgroundColor: colors.reasonBg,
        borderRadius: radius.m,
        width: '100%',
    },
    reasonText: {
        ...typography.caption,
        color: colors.textDark,
    },
    reasonLabel: {
        ...typography.caption,
        fontFamily: typography.h1.fontFamily,
        color: colors.secondary,
    },
});