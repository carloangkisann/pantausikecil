import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';
import Header from '../components/Header';

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs

        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          animation: 'none', 
          lazy: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
          }}
        />
        
        <Tabs.Screen
          name="nutrisi"
          options={{
            title: 'Nutrisi',
          }}
        />
        
        <Tabs.Screen
          name="chatbot"
          options={{
            title: 'Chatbot',
          }}
        />
        
        <Tabs.Screen
          name="aktivitas"
          options={{
            title: 'Aktivitas',
          }}
        />
        
        <Tabs.Screen
          name="bantuan"
          options={{
            title: 'Bantuan',
          }}
        />
      </Tabs>
      
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});