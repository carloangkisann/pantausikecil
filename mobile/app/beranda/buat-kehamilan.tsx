import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import {apiService} from '../../services/api';
import { CreatePregnancyRequest } from '../../types';
import Header from '../components/Header';


export default function BuatKehamilan() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    kehamilanKe: '',
    usiaKehamilan: '',
    jenisKelaminBayi: '',
    komplikasiKehamilan: '',
    jenisKomplikasi: ''
  });

  useEffect(() => {

    if (!isAuthenticated) {
        router.push('/(auth)/login')
    }
  }, [isAuthenticated, router, user]);

  const saveKehamilan = async () => {
    try {

      if (!formData.kehamilanKe || !formData.usiaKehamilan || !formData.jenisKelaminBayi) {
        Alert.alert('Error', 'Mohon lengkapi field yang diperlukan (Kehamilan ke, Usia kehamilan, Jenis kelamin bayi)');
        return;
      }

      if (!user || !isAuthenticated) {
        router.push('/login')
        return;
      }

      const hasToken = await apiService.isLoggedIn();
      
      if (!hasToken) {
        router.push('/login')

        return;
      }

      setLoading(true);

  
      const startDate = convertUsiaKehamilanToStartDate(formData.usiaKehamilan);
      const pregnancyData: CreatePregnancyRequest = {
        pregnancyNumber: parseInt(formData.kehamilanKe),
        startDate: startDate, // Format: YYYY-MM-DD
        babyGender: mapJenisKelamin(formData.jenisKelaminBayi),
      };

      const response = await apiService.createPregnancy(user.id, pregnancyData);

      if (response.success) {
        router.replace('/beranda/pilih-kehamilan')
      } else {
        Alert.alert('Error', response.message || 'Gagal menyimpan data kehamilan');
      }
    } catch (error) {
      Alert.alert('Error', `Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };


  const mapJenisKelamin = (jenis: string): 'Laki-laki' | 'Perempuan' | 'Tidak Diketahui' => {
    switch (jenis) {
      case 'Laki-laki':
        return 'Laki-laki';
      case 'Perempuan':
        return 'Perempuan';
      case 'Belum diketahui':
        return 'Tidak Diketahui';
      default:
        return 'Tidak Diketahui';
    }
  };

  const convertUsiaKehamilanToStartDate = (usiaKehamilan: string): string => {
    console.log('Converting usia kehamilan:', usiaKehamilan);
    

    if (usiaKehamilan.includes('/')) {
      const parts = usiaKehamilan.split('/');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        const convertedDate = `${year}-${month}-${day}`;
        console.log('Date format detected, converted to:', convertedDate);
        return convertedDate;
      }
    }
    
    // Jika user input dalam format minggu (contoh: "12 minggu")
    const weekMatch = usiaKehamilan.match(/(\d+)\s*(minggu|week)/i);
    if (weekMatch) {
      const weeks = parseInt(weekMatch[1]);
      console.log('Week format detected, weeks:', weeks);
      
      // Hitung start date berdasarkan minggu kehamilan
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - (weeks * 7));
      
      const convertedDate = startDate.toISOString().split('T')[0];
      console.log('Calculated start date from weeks:', convertedDate);
      return convertedDate;
    }
    
    // Jika input tidak dikenali, gunakan tanggal hari ini
    console.log('Unknown format, using today as default');
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <View className="flex-1 bg-pink-low">
      <StatusBar barStyle="light-content" backgroundColor="#F789AC" />
      
      <Header />
      
      <ScrollView 
        className="flex-1 px-6 py-4" 
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
            
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-1"
            activeOpacity={0.8}
            disabled={loading}
          >
            <Image 
              source={require('../../assets/images/back-arrow-black.png')}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          <Text className="text-black-low text-xl font-semibold flex-1 text-center mx-auto font-poppins">
            Data Kehamilan Baru
          </Text>
        </View>
        
        {/* Kehamilan ke */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Kehamilan ke *
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-4 shadow-sm border border-pink-semi-low text-sm font-poppins text-gray-1" 
            style={{ width: 350, height: 52 }}
            placeholder="Masukkan ini kehamilan ke berapa kamu"
            value={formData.kehamilanKe}
            onChangeText={(text) => setFormData({...formData, kehamilanKe: text})}
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        {/* Usia Kehamilan */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Usia Kehamilan atau Tanggal Mulai *
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-4 text-gray-1 shadow-sm border border-pink-semi-low text-sm"
            style={{ width: 350, height: 52 }}
            placeholder="Contoh: 12 minggu atau 15/01/2024"
            value={formData.usiaKehamilan}
            onChangeText={(text) => setFormData({...formData, usiaKehamilan: text})}
            editable={!loading}
          />
          {/* <Text className="text-xs text-gray-500 mt-1 text-center">
            Format: '12 minggu' atau 'DD/MM/YYYY'
          </Text> */}
        </View>

        {/* Jenis Kelamin Bayi */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Jenis Kelamin Bayi *
          </Text>
          <View className="bg-white rounded-xl shadow-sm border border-pink-semi-low" style={{ width: 350, height: 52 }}>
            <Picker
              selectedValue={formData.jenisKelaminBayi}
              onValueChange={(itemValue) => setFormData({...formData, jenisKelaminBayi: itemValue})}
              style={{ height: 52 }}
              className='rounded-xl text-sm font-poppins text-gray-1 px-4'
              enabled={!loading}
            >
              <Picker.Item label="Masukkan jenis kelamin bayi kamu" value="" />
              <Picker.Item label="Laki-laki" value="Laki-laki" />
              <Picker.Item label="Perempuan" value="Perempuan" />
              <Picker.Item label="Belum diketahui" value="Belum diketahui" />
            </Picker>
          </View>
        </View>

        {/* Komplikasi Kehamilan (Optional) */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Komplikasi Kehamilan (Opsional)
          </Text>
          <View className="bg-white rounded-xl shadow-sm border border-pink-semi-low" style={{ width: 350, height: 52 }}>
            <Picker
              selectedValue={formData.komplikasiKehamilan}
              onValueChange={(itemValue) => setFormData({...formData, komplikasiKehamilan: itemValue})}
              style={{ height: 52 }}
              className='rounded-xl text-sm font-poppins text-gray-1 px-4'
              enabled={!loading}
            >
              <Picker.Item label="Masukkan ada atau tidaknya komplikasi" value="" />
              <Picker.Item label="Ada komplikasi" value="Ada komplikasi" />
              <Picker.Item label="Tidak ada komplikasi" value="Tidak ada komplikasi" />
            </Picker>
          </View>
        </View>

        {/* Jenis Komplikasi (jika ada) */}
        {formData.komplikasiKehamilan === 'Ada komplikasi' && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Jenis Komplikasi (jika ada)
            </Text>
            <View className="bg-white rounded-xl shadow-sm border border-pink-semi-low" style={{ width: 350, height: 52 }}>
              <Picker
                selectedValue={formData.jenisKomplikasi}
                onValueChange={(itemValue) => setFormData({...formData, jenisKomplikasi: itemValue})}
                style={{ height: 52 }}
                className='rounded-xl font-poppins text-gray-1 px-4'
                enabled={!loading}
              >
                <Picker.Item label="Masukkan jenis komplikasi yang dialami" value="" />
                <Picker.Item label="Diabetes gestasional" value="Diabetes gestasional" />
                <Picker.Item label="Preeklamsia" value="Preeklamsia" />
                <Picker.Item label="Hipertensi" value="Hipertensi" />
                <Picker.Item label="Anemia" value="Anemia" />
                <Picker.Item label="Lainnya" value="Lainnya" />
              </Picker>
            </View>
          </View>
        )}

        {/* Simpan Button */}
        <TouchableOpacity
          onPress={saveKehamilan}
          className="bg-pink-medium rounded-3xl py-4 px-6 shadow-sm mb-8 mx-auto"
          style={{ 
            width: 350, 
            height: 56,
            opacity: loading ? 0.7 : 1
          }}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Simpan
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}