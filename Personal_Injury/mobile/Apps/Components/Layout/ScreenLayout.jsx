import React from 'react';
import { View, ScrollView, Platform, KeyboardAvoidingView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenLayout = ({
    children,
    scroll = true,
    backgroundColor = '#FFFFFF',
    contentContainerStyle = {},
    statusBarColor = 'dark-content'
}) => {
    const Wrapper = scroll ? ScrollView : View;

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor }}
            edges={['top', 'right', 'left', 'bottom']} // Ensure standard full protection
        >
            <StatusBar barStyle={statusBarColor} backgroundColor={backgroundColor} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Wrapper
                    style={{ flex: 1 }}
                    contentContainerStyle={
                        scroll
                            ? { flexGrow: 1, ...contentContainerStyle }
                            : undefined
                    }
                    showsVerticalScrollIndicator={false}
                    bounces={false} // Often preferred for "app-like" feel in fixed layouts
                >
                    {children}
                </Wrapper>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ScreenLayout;
