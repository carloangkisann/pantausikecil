import  { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator,Dimensions} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import {apiService} from '../../services/api';
import { PregnancyData } from '../../types';
import Header from '../components/Header';
import { FontAwesome5 } from "@expo/vector-icons";


export default function PilihKehamilan() {
  const router = useRouter();
  const { user } = useAuth();
  const [kehamilanList, setKehamilanList] = useState<PregnancyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPregnancies();
  },[]);

  const loadPregnancies = async () => {
    if (!user) {
      Alert.alert('Error', 'User tidak ditemukan. Silakan login kembali.');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getUserPregnancies(user.id);
      
      if (response.success && response.data) {
        setKehamilanList(response.data);
      } else {
        console.error('Failed to load pregnancies:', response.message);
        setKehamilanList([]);
      }
    } catch (error) {
      console.error('Error loading pregnancies:', error);
      Alert.alert('Error', 'Gagal memuat data kehamilan');
      setKehamilanList([]);
    } finally {
      setLoading(false);
    }
  };

  const selectKehamilan = async (kehamilan: PregnancyData) => {
    try {

      console.log('Selected pregnancy:', kehamilan);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih data kehamilan');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateWeeksPregnant = (startDate: string, endDate?: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const getPeriodeKehamilan = (startDate: string, endDate?: string | null) => {
    if (endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    
    const weeks = calculateWeeksPregnant(startDate);
    let trimester = 'Trimester 1';
    if (weeks > 12 && weeks <= 27) trimester = 'Trimester 2';
    else if (weeks > 27) trimester = 'Trimester 3';
    
    return `${formatDate(startDate)} (${trimester})`;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-pink-low justify-center items-center">
        <ActivityIndicator size="large" color="#F789AC" />
        <Text className="text-gray-600 mt-4">Memuat data kehamilan...</Text>
      </View>
    );
  }

  const width = Dimensions.get('window').width;
  return (
    <View className="flex-1 bg-pink-medium">
      <Header />
      
      <ScrollView className="flex-1 px-6 py-4 bg-pink-low rounded-3xl" showsVerticalScrollIndicator={false}>
    
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="min-w-10 min-h-10  items-center justify-center"
          >
              <FontAwesome5 name ='arrow-circle-left' color='#656565' size={0.083*width}></FontAwesome5>
          </TouchableOpacity>
          
          <Text className="text-black-low text-lg font-semibold flex-1 text-center mx-8 pl-1 pb-1 font-poppins">
            Data Kehamilan yang Sudah Ada
          </Text>
        </View>
        
        {kehamilanList.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center text-lg mb-4 font-poppins">
              Belum ada data kehamilan tersimpan
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/beranda/buat-kehamilan')}
              className="bg-pink-medium rounded-2xl py-3 px-6"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold font-poppins">
                Buat Data Kehamilan Baru
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Header Table */}
            <View className="bg-pink-medium rounded-xl px-4 py-4 mb-2">
              <View className="flex-row justify-between">
                <Text className="text-white font-light flex-1 text-center text-base font-poppins">
                  Kehamilan
                </Text>
                <Text className="text-white font-light flex-1 text-center text-base font-poppins">
                  Periode Kehamilan
                </Text>
                <Text className="text-white font-light flex-1 text-center text-base font-poppins">
                  Jenis Kelamin
                </Text>
              </View>
            </View>

            {/* Data Kehamilan */}
            {kehamilanList.map((kehamilan, index) => (
              <TouchableOpacity
                key={kehamilan.id}
                onPress={() => selectKehamilan(kehamilan)}
                className="bg-white rounded-xl px-4 py-4 mb-3 shadow-sm border border-pink-semi-low"
                activeOpacity={0.8}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-gray-800 flex-1 text-center text-base font-poppins">
                    {kehamilan.pregnancyNumber}
                  </Text>
                  <Text className="text-gray-600 flex-1 text-center text-sm font-poppins">
                    {getPeriodeKehamilan(kehamilan.startDate, kehamilan.endDate)}
                  </Text>
                  <Text className="text-gray-600 flex-1 text-center text-sm font-poppins">
                    {kehamilan.babyGender || 'Tidak Diketahui'}
                  </Text>
                </View>
                
                {/* Additional Info */}
                <View className="mt-2 pt-2 border-t border-pink-semi-low">
                  <Text className="text-xs text-gray-500 text-center font-poppins">
                    Dibuat: {formatDate(kehamilan.createdAt?.toString() || '')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* Tambah Data Baru Button */}
            <TouchableOpacity
              onPress={() => router.push('/beranda/buat-kehamilan')}
              className="bg-pink-medium rounded-3xl px-6 shadow-sm pt-3 mx-auto w-7/8 h-12"
           
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-base font-semibold font-poppins">
                Tambah Data Kehamilan Baru
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}