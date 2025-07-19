import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const Masuk = () => {
  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <LinearGradient
      colors={['#F99AB6', '#F1789F']}
      start={{ x: 0.5, y: 0}}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#F99AB6" />
      
      <View className="flex-1 justify-center items-center px-3">
        {/* Logo/Icon */}
        <View className="mb-12 w-screen">
          <Image 
            source={require('../../assets/images/pantausikecil.png')} 
            className="mx-auto"
            resizeMode="contain"
          />
        </View>

        {/* Main Title */}
        <Text className="text-white text-2xl font-bold text-center mb-6 leading-8 font-poppins">
          Sedang menantikan kehadiran buah hati tercinta?
        </Text>

        {/* Subtitle */}
        <Text className="text-white text-base text-center mb-16 leading-6 opacity-90 font-poppins">
          Biarkan PantauSiKecil mendampingi setiap langkahmu dalam perjalanan kehamilan yang luar biasa ini.
        </Text>

        {/* Action Buttons */}
        <View className="w-full space-y-4">
          {/* Login Button */}
          <TouchableOpacity 
            className="bg-white rounded-full py-4 px-8 w-full"
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text className="text-black-low text-lg font-semibold text-center font-poppins">
              Login
            </Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity 
            className="border-2 border-white rounded-full py-4 px-8 w-full"
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold text-center font-poppins">
              Registrasi
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View className="h-20" />
      </View>
    </LinearGradient>
  );
};

export default Masuk;