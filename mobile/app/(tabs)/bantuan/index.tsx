import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import Header from '../../components/Header';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { EmergencyRequest, LocationData } from '../../../types';

export default function Bantuan() {
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Izin Lokasi Diperlukan',
          'Aplikasi memerlukan akses lokasi untuk mengirim informasi darurat yang akurat.',
          [
            { text: 'Batal', style: 'cancel' },
            { 
              text: 'Buka Pengaturan', 
              onPress: () => Location.requestForegroundPermissionsAsync()
            }
          ]
        );
        setLocationPermission(false);
        return;
      }

      setLocationPermission(true);
      
      if (isLocationEnabled) {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermission(false);
    }
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      console.log('Location permission not granted');
      return;
    }

    try {
      // ✅ Expo Location - much cleaner API
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      const { latitude, longitude } = location.coords;
      
      // ✅ Expo Location - built-in reverse geocoding
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const addressString = address 
        ? `${address.street || ''} ${address.streetNumber || ''}, ${address.district || ''}, ${address.city || ''}, ${address.region || ''}`.trim().replace(/,\s*,/g, ',').replace(/^,|,$/g, '')
        : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      const locationData: LocationData = {
        latitude,
        longitude,
        address: addressString,
        timestamp: new Date()
      };

      setCurrentLocation(locationData);
      console.log('Location updated:', locationData);

    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Error Lokasi', 
        'Tidak dapat mengambil lokasi saat ini. Pastikan GPS aktif dan coba lagi.',
        [
          { text: 'Coba Lagi', onPress: getCurrentLocation },
          { text: 'Batal', style: 'cancel' }
        ]
      );
    }
  };



  const handleSOSPress = async () => {
    if (isLocationEnabled && !currentLocation) {
      // Try to get location before sending
      await getCurrentLocation();
      // Give it a moment to get location
      setTimeout(() => {
        sendEmergencyAlert();
      }, 1000);
    } else {
      sendEmergencyAlert();
    }
  };

  const sendEmergencyAlert = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User tidak ditemukan. Silakan login ulang.');
      return;
    }

    setIsLoading(true);
    
    try {
      let emergencyMessage = 'DARURAT: Ibu hamil memerlukan bantuan medis segera!';
      
      // Add location info to message if available
      if (isLocationEnabled && currentLocation) {
        emergencyMessage += `\n\nLokasi: ${currentLocation.address || `${currentLocation.latitude}, ${currentLocation.longitude}`}`;
        emergencyMessage += `\nWaktu: ${new Date().toLocaleString('id-ID')}`;
      }

      const emergencyData: EmergencyRequest = {
        message: emergencyMessage,
        location: isLocationEnabled ? currentLocation || undefined : undefined
      };

      console.log('Sending emergency data:', emergencyData);

      const response = await apiService.sendEmergencyNotification(user.id, emergencyData);
      
      if (response.success) {
        Alert.alert(
          'SOS Terkirim!', 
          isLocationEnabled && currentLocation 
            ? 'Bantuan darurat telah dihubungi dengan informasi lokasi. Tim medis akan segera menghubungi Anda.'
            : 'Bantuan darurat telah dihubungi. Tim medis akan segera menghubungi Anda.',
          [
            {
              text: 'OK',
              style: 'default'
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Gagal mengirim notifikasi darurat');
      }
    } catch (error) {
      console.error('Emergency notification error:', error);
      Alert.alert(
        'Error', 
        'Gagal mengirim notifikasi darurat. Pastikan Anda terhubung ke internet dan coba lagi.',
        [
          {
            text: 'Coba Lagi',
            onPress: () => sendEmergencyAlert()
          },
          {
            text: 'Batal',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLocation = async () => {
    const newValue = !isLocationEnabled;
    setIsLocationEnabled(newValue);
    
    if (newValue) {
      if (locationPermission) {
        await getCurrentLocation();
        Alert.alert(
          'Lokasi Diaktifkan', 
          'Informasi lokasi akan disertakan saat mengirim notifikasi darurat.'
        );
      } else {
        // Request permission again
        await checkLocationPermission();
      }
    } else {
      setCurrentLocation(null);
      Alert.alert(
        'Lokasi Dinonaktifkan', 
        'Informasi lokasi tidak akan disertakan dalam notifikasi darurat.'
      );
    }
  };

  return (
    <View className="flex-1 bg-pink-medium">
      {/* Header area */}
      <View>
        <Header />
      </View>
      
      {/* Main content container with rounded corners */}
      <View className="flex-1 mt-4 rounded-t-3xl bg-pink-low">
        <View className="flex-1 px-6 pt-8">
          {/* Title */}
          <Text className="text-lg text-center mb-6 font-poppins text-[#424B5A] font-semibold">
            Notifikasi Darurat
          </Text>
          
          {/* Subtitle */}
          <Text className="text-xl font-bold text-black text-center font-poppins">
            Klik Tombol <Text className="text-[#E02323]">SOS</Text> untuk{'\n'}
            Segera Mendapatkan{'\n'}
            Pertolongan!
          </Text>
          
          {/* Location Status */}
          {isLocationEnabled && (
            <View className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Text className="text-blue-800 text-sm text-center font-poppins">
                {currentLocation 
                  ? `📍 Lokasi: ${currentLocation.address ? 
                      (currentLocation.address.length > 50 
                        ? currentLocation.address.substring(0, 50) + '...'
                        : currentLocation.address
                      ) 
                      : 'Koordinat tersimpan'}`
                  : '📍 Sedang mengambil lokasi...'
                }
              </Text>
            </View>
          )}
          
          {/* SOS Button Container */}
          <View className="justify-center items-center h-2/5 pt-20">
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
                  width: 190,
                  height: 190,
                  backgroundColor: isLoading ? '#FF8888' : '#FF4444',
                }}
              >
                {isLoading ? (
                  <View className="items-center">
                    <ActivityIndicator size="large" color="white" />
                    <Text className="text-white text-sm mt-2 font-poppins">
                      Mengirim...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-4xl font-bold font-poppins">SOS</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Location Toggle */}
          <View className="mx-4 mb-8 rounded-xl flex-row justify-between items-center bg-white -bottom-24 max-h-16 px-6 py-4">
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold text-base font-poppins">
                Aktifkan Lokasi
              </Text>
              <Text className="text-gray-500 text-xs font-poppins">
                {isLocationEnabled 
                  ? 'Lokasi akan disertakan dalam notifikasi'
                  : 'Lokasi tidak akan disertakan'
                }
              </Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#F472B6' }}
              thumbColor={isLocationEnabled ? '#EC4899' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
              onValueChange={toggleLocation}
              value={isLocationEnabled}
              disabled={isLoading}
            />
          </View>
          
    
        </View>
      </View>
    </View>
  );
}