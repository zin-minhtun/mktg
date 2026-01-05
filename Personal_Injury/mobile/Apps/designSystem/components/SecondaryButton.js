import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography, scaleSpacing } from '../theme';
import BaseText from './BaseText';

const SecondaryButton = ({ title, onPress, style, textStyle }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <BaseText style={[styles.text, textStyle]}>{title}</BaseText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.white,
        borderRadius: radius.l,
        borderWidth: 1,
        borderColor: colors.primary,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: scaleSpacing(48), // Touchable target size
    },
    text: {
        ...typography.button,
        color: colors.primary,
    }
});

export default SecondaryButton;
