import { Alert, Platform } from 'react-native';

// Proxy object to keep Toast API consistent across platforms
const Toast = {
  SHORT: 0,
  LONG: 1,
  show: (message: string, duration: number) => {
    if (Platform.OS === 'web') {
      Alert.alert('Notice', message);
    } else {
      // Only require on native platforms
      const NativeToast = require('react-native-simple-toast').default;
      NativeToast.show(message, duration);
    }
  },
};

export default Toast;
