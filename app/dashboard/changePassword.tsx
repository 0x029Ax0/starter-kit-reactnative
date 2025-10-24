import { ThemedText, ThemedView } from "@/components";
import { useAuth } from "@/lib";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


const ChangePasswordScreen = () => {
    const { user } = useAuth();
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ThemedView style={styles.wrapper}>
                <ThemedText style={styles.text}>
                    Change password
                </ThemedText>
            </ThemedView>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        height: 150,
        width: 150,
        marginBottom: 30
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 5,
    },
    text: {
        textAlign: "center",
    }
});