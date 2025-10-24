// CustomDrawer.tsx
import { useAuth } from '@/lib';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {

    const { user } = useAuth();

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logging out...');
        // Example: props.navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.scrollView}
            >
                {/* Custom Header Section */}
                <View style={styles.drawerHeader}>
                    <Ionicons name="person-circle" size={60} color="#fff" />
                    <Text style={styles.userName}>{user?.name ?? "John Doe"}</Text>
                    <Text style={styles.userEmail}>{user?.email ?? "-"}</Text>
                </View>

                {/* Drawer Items */}
                <View style={styles.drawerItems}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            {/* Logout Button at Bottom */}
            <View style={{ padding: 12 }}>
                <DrawerItem 
                    label="Logout" 
                    labelStyle={{ color: "#ff4444" }}
                    icon={() => <MaterialIcons name="exit-to-app" size={16} color="#ff4444" />}
                    style={{ borderRadius: 5 }}
                    onPress={handleLogout} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    drawerHeader: {
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userEmail: {
        color: '#e0e0e0',
        fontSize: 14,
        marginTop: 4,
    },
    drawerItems: {
        flex: 1,
        paddingTop: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    logoutText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#ff4444',
        fontWeight: '600',
    },
});

export default CustomDrawerContent;