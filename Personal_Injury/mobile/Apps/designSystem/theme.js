import { Platform } from 'react-native';
import {
    scale,
    verticalScale,
    moderateScale,
    scaleFont,
    scaleSpacing,
    scaleRadius,
    screenWidth,
    screenHeight,
    isTablet
} from './scale';

export const metrics = {
    screenWidth,
    screenHeight,
    isSmallDevice: screenWidth < 375,
    isTablet,
};

export const colors = {
    primary: '#00AEEF',
    secondary: '#003A5D', // Navy
    background: 'rgba(0, 58, 93, 0.65)', // Navy Transparent Overlay
    white: '#FFFFFF',
    textDark: '#4A4A4A',
    textGray: '#7E7E7E',
    textLight: '#FFFFFF',
    success: '#8BC34A',
    warning: '#FF9800',
    error: '#F44336',
    message: '#E91E63',
    // Backgrounds for icons
    bgHigh: '#E0F7FA',
    bgMedium: '#FFF3E0',
    bgLow: '#F1F8E9',
    bgCourtesy: '#E3F2FD',
    bgMessage: '#FCE4EC',
    reasonBg: '#F5F5F5',
};

export const spacing = {
    xs: scaleSpacing(4),
    s: scaleSpacing(8),
    m: scaleSpacing(16),
    l: scaleSpacing(24),
    xl: scaleSpacing(32),
    xxl: scaleSpacing(40),
};

export const radius = {
    s: scaleRadius(4),
    m: scaleRadius(8),
    l: scaleRadius(12),
    xl: scaleRadius(16),
    circle: scaleRadius(50),
};

export const fonts = {
    regular: 'Raleway',
    bold: 'Raleway-Bold',
    semiBold: 'Raleway-SemiBold',
};

export const typography = {
    h1: {
        fontFamily: fonts.bold,
        fontSize: scaleFont(22),
        lineHeight: scaleFont(28),
        color: colors.secondary,
        textAlign: 'center',
    },
    h2: {
        fontFamily: fonts.bold,
        fontSize: scaleFont(18),
        lineHeight: scaleFont(24),
        color: colors.secondary,
        textAlign: 'center',
    },
    body: {
        fontFamily: fonts.regular,
        fontSize: scaleFont(14),
        lineHeight: scaleFont(22),
        color: colors.textDark,
        textAlign: 'center',
    },
    button: {
        fontFamily: fonts.bold,
        fontSize: scaleFont(16),
        lineHeight: scaleFont(20),
        color: colors.white,
    },
    subtitle: {
        fontFamily: fonts.regular,
        fontSize: scaleFont(16),
        color: colors.textGray,
        textAlign: 'center',
    },
    caption: {
        fontFamily: fonts.regular,
        fontSize: scaleFont(12),
        color: colors.textGray,
        textAlign: 'center',
    }
};

export const shadow = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    android: {
        elevation: 6,
    },
});

export const layout = {
    maxCardWidth: scale(420),
    modalPadding: spacing.l,
};

export { scale, verticalScale, moderateScale, scaleFont, scaleSpacing, scaleRadius };
