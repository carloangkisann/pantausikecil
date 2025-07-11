import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch, ActivityIndicator } from 'react-native';
import Header from '../../components/Header';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';

interface EmergencyRequest {
  message?: string;
}

export default function Bantuan() {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Assuming you have user context


  const handleSOSPress = async () => {
     sendEmergencyAlert()
  };

  const sendEmergencyAlert = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User tidak ditemukan. Silakan login ulang.');
      return;
    }

    setIsLoading(true);
    
    try {
      const emergencyData: EmergencyRequest = {
        message: 'DARURAT: Ibu hamil memerlukan bantuan medis segera!'
      };

      const response = await apiService.sendEmergencyNotification(user.id, emergencyData);
      
      if (response.success) {
        Alert.alert(
          'SOS Terkirim!', 
          'Bantuan darurat telah dihubungi. Tim medis akan segera menghubungi Anda.'
        );
      } else {
        throw new Error(response.message || 'Gagal mengirim notifikasi darurat');
      }
    } catch (error) {
      console.error('Emergency notification error:', error);

    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
    if (!isNotificationEnabled) {
      Alert.alert('Notifikasi Diaktifkan', 'Keluarga akan diberitahu saat tombol SOS ditekan.');
    } else {
      Alert.alert('Notifikasi Dinonaktifkan', 'Keluarga tidak akan diberitahu saat tombol SOS ditekan.');
    }
  };

  return (
    <View className="flex-1 bg-pink-medium">
      {/* Header area */}
      <View>
        <Header />
      </View>
      
      {/* Main content container with rounded corners */}
      <View 
        className="flex-1 mt-4"
        style={{
          backgroundColor: '#FFE3EC',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <View className="flex-1 px-6 pt-8">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-800 text-center mb-6">
            Notifikasi Darurat ke Rumah Sakit
          </Text>
          
          {/* Subtitle */}
          <Text className="text-lg font-semibold text-gray-700 text-center ">
            Klik Tombol <Text className="text-red-600">SOS</Text> untuk{'\n'}
            Segera Mendapatkan{'\n'}
            Pertolongan!
          </Text>
          
          {/* SOS Button Container */}
          <View className="justify-center items-center" style={{ height: 300 }}>
            {/* SOS Button with rings */}
            <View className="items-center justify-center">
              {/* Outer ring */}
              <View 
                className="rounded-full absolute"
                style={{
                  width: 250,
                  height: 250,
                  backgroundColor: 'rgba(255, 68, 68, 0.1)',
                }}
              />
              {/* Middle ring */}
              <View 
                className="rounded-full absolute"
                style={{
                  width: 220,
                  height: 220,
                  backgroundColor: 'rgba(255, 68, 68, 0.2)',
                }}
              />
              {/* Inner SOS Button */}
              <TouchableOpacity
                onPress={handleSOSPress}
                disabled={isLoading}
                className="rounded-full items-center justify-center"
                style={{
                  width: 180,
                  height: 180,
                  backgroundColor: isLoading ? '#FF8888' : '#FF4444',
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text className="text-white text-4xl font-bold">SOS</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Notification Toggle */}
          <View 
            className="mx-4 mb-8 p-4 rounded-xl flex-row justify-between items-center shadow-sm"
            style={{ backgroundColor: 'white', elevation: 2 }}
          >
            <Text className="text-gray-800 font-semibold text-base">
              Kabari Keluarga
            </Text>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#F472B6' }}
              thumbColor={isNotificationEnabled ? '#EC4899' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
              onValueChange={toggleNotification}
              value={isNotificationEnabled}
              disabled={isLoading}
            />
          </View>
          
          {/* Emergency Contact Info */}
          <View className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
  
            <Text className="text-red-900 font-bold text-center mt-1">
              Ambulans: 119 | Polisi: 110 | Pemadam: 113
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}