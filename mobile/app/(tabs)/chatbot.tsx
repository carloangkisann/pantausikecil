import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ChatbotScreen() {
  const router = useRouter();

  const handleBackPress = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={handleBackPress}
          className="p-2 -ml-2"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-semibold text-gray-800 ml-2">
          Balik Bos
        </Text>
      </View>

    </SafeAreaView>
  );
}