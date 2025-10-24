import { forwardRef, type MutableRefObject, type Ref } from 'react';
import {
    Controller,
    type Control,
    type FieldValues,
    type RegisterOptions,
} from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    useColorScheme
} from 'react-native';

type FormFieldProps = TextInputProps & {
    label: string;
    errorMessages?: string | string[];
    control?: Control<FieldValues>;
    name?: string;
    rules?: RegisterOptions;
};

export const FormField = forwardRef<TextInput, FormFieldProps>(({
    label,
    errorMessages,
    control,
    name,
    rules,
    style,
    ...inputProps
}, ref) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const palette = isDark ? darkPalette : lightPalette;

    const externalErrors = normalizeErrors(errorMessages);

    if (control && name) {
        return (
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { onChange, onBlur, value, ref: fieldRef }, fieldState: { error } }) => {
                    const controlledErrors = error?.message ? [...externalErrors, error.message] : externalErrors;
                    const hasError = controlledErrors.length > 0;
                    const mergedRef = mergeRefs(ref, fieldRef);
                    const inputValue = typeof value === 'string' ? value : value == null ? '' : String(value);

                    return (
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.container}>
                            <View style={styles.wrapper}>
                                <Text style={[styles.label, { color: palette.label }]}>{label}</Text>
                                <TextInput
                                    ref={mergedRef}
                                    value={inputValue}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholderTextColor={palette.placeholder}
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: palette.inputBackground,
                                            borderColor: palette.border,
                                            color: palette.text,
                                        },
                                        hasError ? { borderColor: palette.errorBorder } : null,
                                        style,
                                    ]}
                                    {...inputProps}
                                />
                                {controlledErrors.map((errorMessage, index) => (
                                    <Text key={index} style={[styles.error, { color: palette.error }]}>{errorMessage}</Text>
                                ))}
                            </View>
                        </KeyboardAvoidingView>
                    );
                }}
            />
        );
    }

    const hasExternalError = externalErrors.length > 0;

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
                        hasExternalError ? { borderColor: palette.errorBorder } : null,
                        style,
                    ]}
                    {...inputProps}
                />
                {externalErrors.map((error, i) => (
                    <Text key={i} style={[styles.error, { color: palette.error }]}>{error}</Text>
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

function normalizeErrors(errors?: string | string[]) {
    if (!errors) {
        return [];
    }

    return Array.isArray(errors) ? errors.filter(Boolean) : [errors];
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
    return (value: T) => {
        refs.forEach((ref) => {
            if (!ref) {
                return;
            }

            if (typeof ref === 'function') {
                ref(value);
                return;
            }

            (ref as MutableRefObject<T | null>).current = value;
        });
    };
}
