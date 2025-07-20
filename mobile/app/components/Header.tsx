// app/(tabs)/nutrisi/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { UserProfile } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  greeting?: string;
  customUserName?: string;
  customAvatarUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  greeting = "Selamat datang", 
  customUserName,
  customAvatarUrl,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.getUserProfile(user.id);
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (customUserName) return customUserName;
    if (profile?.fullName) return `Bunda ${profile.fullName}`;
    if (user?.email) {
      // Extract name from email before @ symbol
      const emailName = user.email.split('@')[0];
      return `Bunda ${emailName}`;
    }
    return "Bunda";
  };

  const getAvatarSource = () => {
    if (customAvatarUrl) return { uri: customAvatarUrl };
    if (profile?.profileImage) return { uri: profile.profileImage };
    return require('../../assets/images/default-profile.png');
  };

  const getGreetingByTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat pagi";
    if (hour < 15) return "Selamat siang"; 
    if (hour < 18) return "Selamat sore";
    return "Selamat malam";
  };
  const insets = useSafeAreaInsets();
  return ( 
    
    <View className="px-4 pb-4 bg-pink-medium mt-1" style= {{paddingTop:insets.top}}>
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-lg font-medium font-poppins">
          {greeting === "Selamat datang" ? getGreetingByTime() : greeting}, {getDisplayName()}!
        </Text>
        
        <TouchableOpacity 
          className="w-12 h-12 bg-white rounded-full items-center justify-center overflow-hidden"
          onPress={() => router.push('../profile')}
        >
          <Image 
            source={getAvatarSource()}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;