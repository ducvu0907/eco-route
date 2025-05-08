import Toast from 'react-native-toast-message';

export const useToast = () => {
  const showToast = (message: string, type: "success" | "error") => {
    Toast.show({
      type,
      text1: message,
    });
  };

  return { showToast };
}
