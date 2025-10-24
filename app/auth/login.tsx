import logo from '@/assets/images/sharingan.png';
import { FormTextField } from '@/components/forms/FormTextField';
import { ThemedText } from '@/components/themedText';
import { LoginCredentials, loginSchema, useAuth } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import {
    Button,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
    const { login } = useAuth();
    const router = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (credentials: LoginCredentials) => {
        console.debug("submitting form", credentials);
        
        const response = await login(credentials);
        console.debug("response:", response);

        // router.replace("/dashboard");
    };

    // const form = useForm({
    //     defaultValues: {
    //         email: '',
    //         password: ''
    //     },
    //     validators: {
    //         onChange: loginSchema,
    //     },
    //     onSubmit: async ({ value }) => {
    //         console.debug("login submitting", value);
    //         try {
    //             const result = await login(value);
    //             console.debug("login result:", result);
    //             router.replace('/dashboard');
    //         } catch (error) {
    //             console.debug("login error:", error);
    //         }
    //     },
    // });
    
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
                        <FormTextField
                            name="email"
                            label="Email address"
                            control={control}
                            error={errors.email} />
                        {/* Password */}
                        <FormTextField
                            name="password"
                            label="Password"
                            control={control}
                            error={errors.password}
                            secureTextEntry={true}
                            />
                        {/* <form.Field name="email">
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
                                    errorMessages={field.state.meta.errors as any}
                                />
                            )}
                        </form.Field> */}
                        {/* Password */}
                        {/* <form.Field name="password">
                            {(field) => (
                                <FormField
                                    label="Password"
                                    secureTextEntry
                                    value={field.state.value}
                                    onChangeText={field.handleChange}
                                    placeholder="Enter your password"
                                    textContentType="password"
                                    errorMessages={field.state.meta.errors as any}
                                />
                            )}
                        </form.Field> */}
                        {/* Submit */}
                        <Button 
                            title="Sign in" 
                            onPress={handleSubmit(onSubmit)}
                            />
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

export default LoginScreen;

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
