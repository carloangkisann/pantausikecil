import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import {apiService} from '../../services/api';
import Header from '../components/Header';

export default function BerandaIndex() {
  const router = useRouter();
  const { user } = useAuth();
  const [hasPregnancies, setHasPregnancies] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingPregnancies();
  },[]);

  const checkExistingPregnancies = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.getUserPregnancies(user.id);
      
      if (response.success && response.data) {
        setHasPregnancies(response.data.length > 0);
      } else {
        setHasPregnancies(false);
      }
    } catch (error) {
      console.error('Error checking pregnancies:', error);
      setHasPregnancies(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBuatKehamilan = () => {
    router.push('/beranda/buat-kehamilan');
  };

  const handlePilihKehamilan = () => {
    if (hasPregnancies) {
      router.push('/beranda/pilih-kehamilan');
    }
   
  };

  return (
    <View className="flex-1 bg-pink-low">
      <Header />
      
      {/* Main Content */}
      <View className="flex-1">

        {/* Main Content Container */}
        <View className="items-center justify-center" style={{ flex: 0.8 }}>
          
          {/* Text Header */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold font-poppins text-gray-600 text-center leading-tight">
              PantauSiKecil butuh
            </Text>
            <Text className="text-2xl font-bold font-poppins text-gray-600 text-center leading-tight">
              informasi kehamilanmu!
            </Text>
            
            {/* Status indicator */}
            {!loading && (
              <View className="mt-4 px-4 py-2 bg-transparant rounded-xl">
                <Text className="text-sm text-gray-600 text-center">
                  {hasPregnancies 
                    ? "" 
                    : "Belum ada data kehamilan"
                  }
                </Text>
              </View>
            )}
          </View>

          {/* Illustration */}
          <View className="items-center ml-12">
            <Image 
              source={require('../../assets/images/ibuhamil.png')}
              className="w-1/2 h-1/2"
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
            <Text className="text-white text-center text-sm font-semibold font-poppins">
              Buat Data Kehamilan Baru
            </Text>
          </TouchableOpacity>

    
          <TouchableOpacity
            onPress={handlePilihKehamilan}
            className={`rounded-3xl py-4 px-6 shadow-sm border ${
              loading 
                ? 'bg-gray-100 border-gray-200' 
                : hasPregnancies 
                  ? 'bg-white border-pink-semi-medium' 
                  : 'bg-gray-100 border-gray-200'
            }`}
            style={{ 
              height: 56,
              opacity: loading ? 0.5 : hasPregnancies ? 1 : 0.5
            }}
            activeOpacity={hasPregnancies ? 0.8 : 1}
            disabled={loading || !hasPregnancies}
          >
            <View className="flex-row items-center justify-center">
              <Text className={`text-center text-sm font-semibold font-poppins ${
                loading 
                  ? 'text-gray-400'
                  : hasPregnancies 
                    ? 'text-black-low' 
                    : 'text-gray-400'
              }`}>
                Pakai Data Kehamilan yang Sudah Ada
              </Text>
              
            </View>
            
      
            {!loading && !hasPregnancies && (
              <Text className="text-xs text-gray-400 text-center mt-1">
                Buat data kehamilan dulu ya
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}