import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CenteredModalCard from "../../designSystem/components/CenteredModalCard";
import PrimaryButton from "../../designSystem/components/PrimaryButton";
import SecondaryButton from "../../designSystem/components/SecondaryButton";
import BaseText from "../../designSystem/components/BaseText";
import { colors, spacing, typography, radius } from "../../designSystem/theme";

export default function TriageLowModal({ visible, onPrimaryPress, onSecondaryPress, reason }) {
    return (
        <CenteredModalCard
            visible={visible}
            title="Discovery Session – Free 15 Minutes"
            subtitle="Optional support if you have questions."
            footer={
                <>
                    <PrimaryButton
                        title="Book My FREE 15-Min Discovery Session"
                        onPress={onPrimaryPress}
                    />
                    <SecondaryButton
                        title="Continue Without Consultation"
                        onPress={onSecondaryPress}
                    />
                </>
            }
        >
            <View style={[styles.iconContainer, { backgroundColor: colors.bgLow }]}>
                <MaterialCommunityIcons name="information-outline" size={64} color={colors.success} />
            </View>

            <View style={styles.infoContainer}>
                <BaseText style={styles.infoText}>
                    Your situation seems stable, but we are here if you need guidance.
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