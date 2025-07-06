import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';

export default function BerandaIndex() {
  const router = useRouter();

  const handleBuatKehamilan = () => {
    router.push('/beranda/buat-kehamilan');
  };

  const handlePilihKehamilan = () => {
    router.push('/beranda/pilih-kehamilan');
  };

  return (
    <View className="flex-1 bg-pink-low">
      <StatusBar barStyle="light-content" backgroundColor="#F789AC" />
      
      {/* Header */}
      <Header 
      />
      
      {/* Main Content */}
      <View className="flex-1 bg-pink-low">

        {/* Main Content Container */}
        <View className="items-center justify-center flex-1">
          
          {/* Text Header */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-gray-600 text-center leading-tight">
              PantauSiKecil butuh
            </Text>
            <Text className="text-2xl font-bold text-gray-600 text-center leading-tight">
              informasi kehamilanmu!
            </Text>
          </View>

          {/* Illustration */}
          <View className="items-center ml-12">
            <Image 
              source={require('../../assets/images/ibuhamil.png')}
              className="w-72 h-72"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Action Buttons - Fixed at bottom */}
        <View className="px-6 pb-8">
          {/* Buat Data Kehamilan Baru */}
          <TouchableOpacity
            onPress={handleBuatKehamilan}
            className="bg-pink-medium rounded-3xl py-4 px-6 shadow-sm mb-4"
            style={{ height: 56 }}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-base font-semibold">
              Buat Data Kehamilan Baru
            </Text>
          </TouchableOpacity>

          {/* Pakai Data Kehamilan yang Sudah Ada */}
          <TouchableOpacity
            onPress={handlePilihKehamilan}
            className="bg-white rounded-3xl py-4 px-6 shadow-sm border border-pink-semi-medium"
            style={{ height: 56 }}
            activeOpacity={0.8}
          >
            <Text className="text-gray-800 text-center text-base font-semibold">
              Pakai Data Kehamilan yang Sudah Ada
            </Text>
          </TouchableOpacity>
      </View>
    </View>
    </View>
  );
}