import { Providers } from '@/components/app';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

const RootLayout = () => {
    return (
        <Providers>
            <Stack>
                <Stack.Screen name="index" options={{ title: "Dashboard" }} />
            </Stack>        
            <StatusBar style="auto" />
        </Providers>
    );
}

export default RootLayout