import { useLogin } from "@/hooks/auth";
import { Button, Text, View } from "react-native";

 const TestScreen = () => {
    
     const { login, errorMessage } = useLogin();

    const handleOnPress = () => {

        const credentials = {
            email: "test@test.nl",
            password: "engeland",
        };

        const data = login(credentials);
        console.debug("login data:", data);
    };

    console.debug("error: ", errorMessage);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#fff" }}>
                Wtf bruh
            </Text>
            <Text style={{ color: "#ddd" }}>
                <Button title="login bruh" onPress={handleOnPress}></Button>
            </Text>
        </View>
    )
};

export default TestScreen;