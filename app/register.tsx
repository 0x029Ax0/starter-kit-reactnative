import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FormField } from '@/components/ui/form-field';
import { useRegister } from '@/hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { useForm } from '@tanstack/react-form';
import { Button, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

const registerSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Enter a valid email'),
        password: z.string().min(8, 'Min 8 characters'),
        passwordConfirmation: z.string().min(8, 'Min 8 characters'),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match.',
        path: ['passwordConfirmation'],
    });

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const register = useRegister();

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
        },
        validators: {
            onChange: registerSchema, // validate as the user types; use onBlur if you prefer
        },
        onSubmit: async ({ value }) => {
            console.debug('value submitted:', value);
            const res = await register.mutateAsync({
                name: value.name,
                email: value.email,
                password: value.password,
                password_confirmation: value.passwordConfirmation,
            });
            console.debug('register response:', res);
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
                    <ThemedView>
                        <View style={styles.header}>
                            <ThemedText type="title">Welcome back</ThemedText>
                            <ThemedText type="default">Sign in to access your Floppie AI dashboard.</ThemedText>
                        </View>

                        <View style={styles.form}>
                            {/* Name */}
                            <form.Field name="name">
                                {(field) => (
                                    <FormField
                                        label="Name"
                                        value={field.state.value}
                                        onChangeText={(text) => field.handleChange(text)}
                                        placeholder="Your name"
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </form.Field>

                            {/* Email */}
                            <form.Field name="email">
                                {(field) => (
                                    <FormField
                                        label="Email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        value={field.state.value}
                                        onChangeText={(text) => field.handleChange(text)}
                                        placeholder="you@example.com"
                                        textContentType="emailAddress"
                                        errors={field.state.meta.errors}
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
                                        onChangeText={(text) => field.handleChange(text)}
                                        placeholder="Enter your password"
                                        textContentType="password"
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </form.Field>

                            {/* Confirm Password */}
                            <form.Field name="passwordConfirmation">
                                {(field) => (
                                    <FormField
                                        label="Confirm Password"
                                        secureTextEntry
                                        value={field.state.value}
                                        onChangeText={(text) => field.handleChange(text)}
                                        placeholder="Re-enter your password"
                                        textContentType="password"
                                        errors={field.state.meta.errors}
                                    />
                                )}
                            </form.Field>

                            {/* Submit button */}
                            <Button
                                title={form.state.isSubmitting ? 'Submitting…' : 'Sign in'}
                                onPress={() => form.handleSubmit()}
                                disabled={!form.state.canSubmit || form.state.isSubmitting}
                            />
                        </View>

                        <View style={styles.footer}>
                            <ThemedText style={styles.footerText} onPress={() => navigation.goBack()}>
                                Already have an account?
                            </ThemedText>
                        </View>
                    </ThemedView>
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
    header: {
        gap: 8,
    },
    form: {
        width: '100%',
        gap: 12,
    },
    footer: {
        marginTop: 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    footerText: {
        fontSize: 14,
    },
});
