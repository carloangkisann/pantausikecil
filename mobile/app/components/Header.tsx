// app/(tabs)/nutrisi/components/Header.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface HeaderProps {
  greeting?: string;
  userName?: string;
  avatarUrl?: string;
  onAvatarPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  greeting = "Selamat datang", 
  userName = "Bunda Matchaciz",
  avatarUrl,
  onAvatarPress 
}) => {
  return (
    <View className="px-4 py-6 pb-4 bg-pink-medium">
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-lg font-medium">
          {greeting}, {userName}!
        </Text>
        
        <TouchableOpacity 
          className="w-12 h-12 bg-white rounded-full items-center justify-center"
          onPress={onAvatarPress}
        >
          {avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }} 
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-2xl">👩</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;