import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
// standard iPhone 11/12/13/14 Pro width
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Detect Tablet or Foldable
// A naive but effective check: if width is > 600, treat as tablet-like or wide screen
const isTablet = width >= 600;

// Base Scalse
const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;

// Balanced Scaling
// use factor = 0.5 (default) to moderate the scaling, so it's not linearly aggressive on large screens
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Text Scaling
 * Android text often renders larger due to density bucket handling.
 * We reduce the moderateScale slightly for Android to match iOS visual weight.
 */
const scaleFont = (size, factor = 0.5) => {
    const scaled = moderateScale(size, factor);
    if (Platform.OS === 'android') {
        // Reduce by ~10-12% on Android to counteract OS inflation
        return Math.round(PixelRatio.roundToNearestPixel(scaled * 0.9));
    }
    return Math.round(PixelRatio.roundToNearestPixel(scaled));
};

/**
 * Spacing Scaling
 * Vertical spacing sometimes feels too large on tall Androids.
 * We apply a slight damper on Android vertical spacing.
 */
const scaleSpacing = (size) => {
    // If tablet, we actually might want MORE spacing, or Standard spacing.
    // For now, standard behavior:
    const scaled = verticalScale(size);
    if (Platform.OS === 'android' && !isTablet) {
        // Subtle reduction
        return Math.round(scaled * 0.95);
    }
    return Math.round(scaled);
};

/**
 * Radius Scaling
 */
const scaleRadius = (size) => {
    return Math.round(moderateScale(size));
};

export {
    scale,
    verticalScale,
    moderateScale,
    scaleFont,
    scaleSpacing,
    scaleRadius,
    width as screenWidth,
    height as screenHeight,
    isTablet
};
