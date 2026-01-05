import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CenteredModalCard from "../../designSystem/components/CenteredModalCard";
import PrimaryButton from "../../designSystem/components/PrimaryButton";
import BaseText from "../../designSystem/components/BaseText";
import { colors, spacing, typography, radius } from "../../designSystem/theme";

export default function TriageCourtesyModal({ visible, onPrimaryPress, reason }) {
    return (
        <CenteredModalCard
            visible={visible}
            title="You’re Already Supported"
            subtitle="Great to hear you have legal representation."
            footer={
                <PrimaryButton
                    title="Access My Recovery Tools"
                    onPress={onPrimaryPress}
                    style={{ backgroundColor: colors.secondary }} // Navy override
                />
            }
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.bgCourtesy }]}>
                <MaterialCommunityIcons name="handshake-outline" size={64} color={colors.secondary} />
            </View>

            <View style={styles.infoContainer}>
                <BaseText style={styles.infoText}>
                    We will skip the legal consultation offers and take you straight to your recovery tools.
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