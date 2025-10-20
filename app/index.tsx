import logo from '@/assets/images/sharingan.png';
import { ThemedText } from '@/components/themed-text';
import { FormField } from '@/components/ui/form-field';
import { useHeaderHeight } from '@react-navigation/elements';
import { Link } from '@react-navigation/native';
import { useForm } from '@tanstack/react-form';
import { Image } from 'expo-image';
import React from 'react';
import {
    Button,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Min 8 characters'),
});

export default function LoginScreen() {
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight(); // 0 if there’s no header

    const form = useForm({
        defaultValues: { email: '', password: '' },
        validators: { onChange: loginSchema },
        onSubmit: async ({ value }) => {
            console.debug('value submitted:', value);
            alert('submitting');
        },
    });

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <SafeAreaView style={styles.safeAreaContainer}>
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets>
                    {/* Header */}
                    <View style={styles.header}>
                        {/* Logo */}
                        <View style={styles.logoWrapper}>
                            <Image style={styles.logo} source={logo} contentFit="contain" transition={300} />
                        </View>
                        {/* Intro */}
                        <View style={styles.intro}>
                            <ThemedText type="title" style={{ textAlign: 'center' }}>
                                Welcome back
                            </ThemedText>
                            <ThemedText type="default" style={{ textAlign: 'center' }}>
                                Sign in to access your Floppie AI dashboard.
                            </ThemedText>
                        </View>
                    </View>
                    {/* Form */}
                    <View style={styles.form}>
                        {/* Email address */}
                        <form.Field name="email">
                            {(field) => (
                                <FormField
                                    label="Email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={field.state.value}
                                    onChangeText={field.handleChange}
                                    placeholder="you@example.com"
                                    textContentType="emailAddress"
                                    errorMessages={field.state.meta.errors}
                                />
                            )}
                        </form.Field>
                        {/* Password */}
                        <form.Field name="password">
                            {(field) => (
                                <FormField
                                    label="Password"
                                    secureTextEntry
                                    value={field.state.value}
                                    onChangeText={field.handleChange}
                                    placeholder="Enter your password"
                                    textContentType="password"
                                    errorMessages={field.state.meta.errors}
                                />
                            )}
                        </form.Field>

                        <View style={{ color: "black" }}>
                            <Button 
                                title="Sign in" 
                                onPress={() => form.handleSubmit()} 
                                color="#ffffff"
                                />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <ThemedText style={styles.footerText}>
                            <Link screen="register" params={{}}>
                                No account yet?
                            </Link>
                        </ThemedText>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // Wrappers
    container: {
        flex: 1,
    },
    safeAreaContainer: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        gap: 24,
    },
    // Header 
    header: {
        flex: 1,
        justifyContent: "center",
    },
    logoWrapper: {
        gap: 8,
        height: 150,
        marginBottom: 24,
    },
    logo: {
        height: '100%'
    },
    intro: { 
        gap: 8,
    },
    // Form
    form: { 
        gap: 12,
        width: '100%', 
    },
    // Footer
    footer: {
        marginTop: 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        fontSize: 14
    },
});
