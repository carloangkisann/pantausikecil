import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

type AppRoutes = '/' | '/nutrisi' | '/chatbot' | '/aktivitas' | '/bantuan';

interface TabItem {
  name: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  route: AppRoutes;
}

const tabs: TabItem[] = [
  { name: 'beranda', title: 'Beranda', iconName: 'home', route: '/' },
  { name: 'nutrisi', title: 'Nutrisi', iconName: 'nutrition', route: '/nutrisi' },
  { name: 'medibot', title: 'MediBot', iconName: 'medical', route: '/chatbot' }, 
  { name: 'aktivitas', title: 'Aktivitas', iconName: 'fitness', route: '/aktivitas' },
  { name: 'bantuan', title: 'Bantuan', iconName: 'radio', route: '/bantuan' },
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveRoute = () => {
    if (pathname === '/' || pathname === '/(tabs)/' || pathname === '/(tabs)') return 'beranda';
    if (pathname.includes('/nutrisi') || pathname.includes('/(tabs)/nutrisi')) return 'nutrisi';
    if (pathname.includes('/chatbot') || pathname.includes('/(tabs)/chatbot')) return 'medibot';
    if (pathname.includes('/aktivitas') || pathname.includes('/(tabs)/aktivitas')) return 'aktivitas';
    if (pathname.includes('/bantuan') || pathname.includes('/(tabs)/bantuan')) return 'bantuan';
    return 'beranda';
  };

  const activeRoute = getActiveRoute();

  if (activeRoute === 'medibot') {
    return null;
  }

  const handlePress = (route: AppRoutes) => {
    try {
      router.replace(route);
    } catch (error) {
      console.log('Navigation error:', error);
      router.push(route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navigationBar}>
        {tabs.map((tab) => {
          const isActive = activeRoute === tab.name;
          
          if (tab.name === 'medibot') {
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.mediBotContainer}
                onPress={() => handlePress(tab.route)}
                activeOpacity={0.7}
              >
                <View style={styles.mediBotButton}>
                  <Image 
                    source={require('../../assets/images/medibot-icon.png')}
                    style={styles.mediBotIcon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handlePress(tab.route)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={tab.iconName}
                  size={24} 
                  color={isActive ? '#FC96B7' : '#9CA3AF'}
                />
              </View>
              <Text style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navigationBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#FC96B7',
  },
  mediBotContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -25,
    flex: 1,
  },
  mediBotButton: {
    backgroundColor: '#FC96B7',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 4,
    borderColor: 'white',
  },
  mediBotIcon: {
    width: 40,
    height: 40,
  },
});