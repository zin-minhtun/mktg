import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import { typography, colors, scaleFont } from '../theme';

const BaseText = ({ style, children, ...props }) => {
    return (
        <Text
            {...props}
            allowFontScaling={false}
            style={[styles.text, style]}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        ...typography.body,
        includeFontPadding: false,
        textAlignVertical: 'center',
        // Ensure consistent rendering across platforms
        ...Platform.select({
            android: {
                // Android sometimes ignores lineHeight in calculation if includesFontPadding is true (default)
                // We corrected it above, but explicit ensuring doesn't hurt.
            }
        }),
        color: colors.textDark, // Default color
    },
});

export default BaseText;
