import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BantuanScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View>
            <Text>Bantuan</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}