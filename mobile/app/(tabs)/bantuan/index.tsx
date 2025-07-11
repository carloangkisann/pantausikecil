import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch } from 'react-native';
import Header from '../../components/Header';

export default function Bantuan() {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const handleSOSPress = () => {
    Alert.alert(
      'Emergency SOS',
      'Apakah Anda yakin ingin mengirim sinyal darurat?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Kirim SOS',
          style: 'destructive',
          onPress: () => {
            // Logic untuk mengirim SOS
            Alert.alert('SOS Terkirim!', 'Bantuan darurat telah dihubungi.');
          },
        },
      ]
    );
  };

  const toggleNotification = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
    if (!isNotificationEnabled) {
      Alert.alert('Notifikasi Diaktifkan', 'Anda akan menerima notifikasi darurat.');
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
                className="rounded-full items-center justify-center"
                style={{
                  width: 180,
                  height: 180,
                  backgroundColor: '#FF4444',
                }}
              >
                <Text className="text-white text-4xl font-bold">SOS</Text>
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
            />
          </View>
        </View>
      </View>
    </View>
  );
}