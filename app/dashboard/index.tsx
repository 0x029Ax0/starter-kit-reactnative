import { ThemedText, ThemedView } from "@/components";
import { useAuth } from "@/lib";
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "@/assets/images/sharingan.png";

const DashboardScreen = () => {
    const { user } = useAuth();
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ThemedView style={styles.wrapper}>
                <Image style={styles.logo} source={Logo} contentFit="contain" transition={300} />
                <ThemedText style={styles.title}>
                    Hello, {user?.name ?? "you"}!
                </ThemedText>
                <ThemedText style={styles.text}>
                    You are looking gewd.
                </ThemedText>
            </ThemedView>
        </SafeAreaView>
    );
};

export default DashboardScreen;

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