import { PropsWithChildren } from "react";

import { AuthProvider, AxiosProvider, useColorScheme } from '@/lib';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const Providers = ({ children }: PropsWithChildren) => {
    const colorScheme = useColorScheme();
    const queryClient = new QueryClient();

    return (
        <AxiosProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <SafeAreaProvider>
                            <AuthProvider>
                                {children}
                            </AuthProvider>
                        </SafeAreaProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </GestureHandlerRootView>
        </AxiosProvider>
    );
};