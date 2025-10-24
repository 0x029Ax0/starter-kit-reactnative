import { Stack } from "expo-router";
import 'react-native-reanimated';

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="register" options={{ title: "Register" }} />
            <Stack.Screen name="recoverAccount" options={{ title: "Recover account" }} />
        </Stack>
    );
}

export default RootLayout