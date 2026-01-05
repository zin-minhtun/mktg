import React from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { colors, layout, radius, shadow, spacing, typography } from '../theme';
import BaseText from './BaseText';

const CenteredModalCard = ({ visible, title, subtitle, children, footer, onRequestClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose || (() => { })}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={onRequestClose || (() => { })}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.cardContainer}>
                            <View style={styles.card}>
                                {title && <BaseText style={styles.title}>{title}</BaseText>}
                                {subtitle && <BaseText style={styles.subtitle}>{subtitle}</BaseText>}

                                <View style={styles.content}>
                                    {children}
                                </View>

                                {footer && <View style={styles.footer}>{footer}</View>}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: layout.modalPadding,
    },
    cardContainer: {
        width: '100%',
        maxWidth: layout.maxCardWidth,
        alignItems: 'center',
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: radius.xl,
        padding: spacing.l,
        width: '100%',
        alignItems: 'center',
        ...shadow,
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.s,
    },
    subtitle: {
        ...typography.subtitle,
        marginBottom: spacing.m,
    },
    content: {
        marginVertical: spacing.s,
        width: '100%',
        alignItems: 'center',
    },
    footer: {
        marginTop: spacing.l,
        width: '100%',
        gap: spacing.m,
    }
});

export default CenteredModalCard;
