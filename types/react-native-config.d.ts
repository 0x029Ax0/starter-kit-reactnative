declare module 'react-native-config' {
    interface Env {
        API_BASE_URL?: string;
    }
    const Config: Env;
    export default Config;
}
