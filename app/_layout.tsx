import { Providers } from '@/components/app';
import { Slot } from 'expo-router';
import 'react-native-reanimated';

const RootLayout = () => {
    return (
        <Providers>
            <Slot />
        </Providers>
    );
}

export default RootLayout