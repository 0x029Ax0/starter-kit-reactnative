import { forwardRef } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    useColorScheme,
} from 'react-native';

type FormError = {
    message: string;
    code: string;
    path: string[];
    validation: string;
};

type FormFieldProps = TextInputProps & {
    label: string;
    errorMessages?: FormError[];
};

export const FormField = forwardRef<TextInput, FormFieldProps>(({ label, errorMessages, style, ...inputProps }, ref) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const palette = isDark ? darkPalette : lightPalette;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.wrapper}>
                <Text style={[styles.label, { color: palette.label }]}>{label}</Text>
                <TextInput
                    ref={ref}
                    placeholderTextColor={palette.placeholder}
                    style={[
                        styles.input,
                        {
                            backgroundColor: palette.inputBackground,
                            borderColor: palette.border,
                            color: palette.text,
                        },
                        errorMessages && errorMessages.length ? { borderColor: palette.errorBorder } : null,
                        style,
                    ]}
                    {...inputProps}
                />
                {errorMessages?.map((error, i) => (
                    <Text key={i} style={[styles.error, { color: palette.error }]}>{error.message}</Text>
                ))}
            </View>
        </KeyboardAvoidingView>
    );
});

FormField.displayName = 'FormField';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
    },
    error: {
        marginTop: 6,
        fontSize: 12,
    },
});

const lightPalette = {
    label: '#0f172a',
    placeholder: '#64748b',
    inputBackground: '#ffffff',
    border: '#cbd5f5',
    text: '#0f172a',
    error: '#b91c1c',
    errorBorder: '#f87171',
};

const darkPalette = {
    label: '#e2e8f0',
    placeholder: '#94a3b8',
    inputBackground: '#060a14ff',
    border: '#8a8a8aff',
    text: '#f8fafc',
    error: '#fca5a5',
    errorBorder: '#f87171',
};

