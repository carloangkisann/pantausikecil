import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BerandaScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View>
            <Text>Beranda</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}