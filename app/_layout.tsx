import { useColorScheme } from '@/hooks/colorSchema/useColorScheme';
import { AxiosProvider } from '@/lib/http';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout = () => {
    const colorScheme = useColorScheme();

    const queryClient = new QueryClient();

    return (
        <AxiosProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <SafeAreaProvider>
                            <Stack>
                                {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
                                <Stack.Screen name="index" options={{ headerShown: false }} />
                                <Stack.Screen name="register" options={{ title: 'Register' }} />
                            </Stack>        
                            <StatusBar style="auto" />
                        </SafeAreaProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </GestureHandlerRootView>
        </AxiosProvider>
    );
}

export default RootLayout