import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow, typography, scaleSpacing } from '../theme';
import BaseText from './BaseText';

const PrimaryButton = ({ title, onPress, style, textStyle }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <BaseText style={[styles.text, textStyle]}>{title}</BaseText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: radius.l,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: scaleSpacing(48), // Touchable target size
        ...shadow,
    },
    text: {
        ...typography.button,
        color: colors.white,
    }
});

export default PrimaryButton;
