import { AxiosProvider } from '@/api/AxiosProvider';
import { useColorScheme } from '@/hooks/colorSchema/use-color-scheme';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    
    return (
        <AxiosProvider
            baseURL="https://api.example.com"
            headers={{ "x-app-platform": "mobile" }}
            getAuthToken={async () => (await AsyncStorage.getItem("access_token")) || null}
            onAuthError={() => {
                // e.g., navigate to Login, toast, or clear tokens
                console.warn("Unauthorized — redirecting to login");
            }}
        >
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SafeAreaProvider>
                    <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="register" options={{ title: 'Register' }} />
                    </Stack>        
                    <StatusBar style="auto" />
                </SafeAreaProvider>
            </ThemeProvider>
        </AxiosProvider>
    );
}
