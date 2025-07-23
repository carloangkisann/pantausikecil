import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { CreatePregnancyRequest } from '../../types';
import Header from '../components/Header';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomPicker from '../components/CustomPicker';

// Data options untuk semua picker
const jenisKelaminBayiOptions = [
  { label: 'Laki-laki', value: 'Laki-laki' },
  { label: 'Perempuan', value: 'Perempuan' },
  { label: 'Belum diketahui', value: 'Belum diketahui' },
];

const komplikasiKehamilanOptions = [
  { label: 'Ada komplikasi', value: 'Ada komplikasi' },
  { label: 'Tidak ada komplikasi', value: 'Tidak ada komplikasi' },
];

const jenisKomplikasiOptions = [
  { label: 'Diabetes gestasional', value: 'Diabetes gestasional' },
  { label: 'Preeklamsia', value: 'Preeklamsia' },
  { label: 'Hipertensi', value: 'Hipertensi' },
  { label: 'Anemia', value: 'Anemia' },
  { label: 'Lainnya', value: 'Lainnya' },
];

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

  // Handlers untuk setiap picker
  const handleJenisKelaminBayiChange = (value: string | number) => {
    setFormData({...formData, jenisKelaminBayi: value as string});
  };

  const handleKomplikasiKehamilanChange = (value: string | number) => {
    const newValue = value as string;
    setFormData({
      ...formData, 
      komplikasiKehamilan: newValue,
      // Reset jenis komplikasi jika tidak ada komplikasi
      jenisKomplikasi: newValue === 'Tidak ada komplikasi' ? '' : formData.jenisKomplikasi
    });
  };

  const handleJenisKomplikasiChange = (value: string | number) => {
    setFormData({...formData, jenisKomplikasi: value as string});
  };

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

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  return (
    <View className="flex-1 bg-pink-medium">
      <StatusBar barStyle="light-content" backgroundColor="#F789AC" />
        
      <Header />
      <View className='rounded-3xl flex-1 bg-pink-low'>
        <ScrollView 
          className="px-6 py-4" 
          contentContainerStyle={{ alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="min-w-10 min-h-10 rounded-full items-center justify-center mr-1 "
              activeOpacity={0.8}
              disabled={loading}
            >
              <FontAwesome5 name='arrow-circle-left' color='#656565' size={0.074*width} />
            </TouchableOpacity>
            
            <Text className="text-black-low text-xl font-semibold flex-1 text-center mx-auto font-poppins">
              Data Kehamilan Baru
            </Text>
          </View>
          
          {/* Kehamilan ke */}
          <View className="mb-6 w-full">
            <Text className="text-base font-semibold text-black font-poppins mb-3">
              Kehamilan ke *
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 p-2 border border-pink-semi-low text-sm font-poppins text-gray-1" 
              placeholder="Masukkan ini kehamilan ke berapa kamu"
              value={formData.kehamilanKe}
              onChangeText={(text) => setFormData({...formData, kehamilanKe: text})}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>

          {/* Usia Kehamilan */}
          <View className="mb-6 w-full">
            <Text className="text-base font-semibold text-black font-poppins mb-3">
              Usia Kehamilan atau Tanggal Mulai *
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 p-2 border border-pink-semi-low text-sm font-poppins text-gray-1"
              placeholder="Contoh: 12 minggu atau 15/01/2024"
              value={formData.usiaKehamilan}
              onChangeText={(text) => setFormData({...formData, usiaKehamilan: text})}
              editable={!loading}
            />
          </View>

          {/* Jenis Kelamin Bayi - menggunakan CustomPicker */}
          <View className="mb-6 w-full">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Jenis Kelamin Bayi *
            </Text>
            <CustomPicker
              value={formData.jenisKelaminBayi}
              onValueChange={handleJenisKelaminBayiChange}
              items={jenisKelaminBayiOptions}
              placeholder="Masukkan jenis kelamin bayi kamu"
              disabled={loading}
              modalTitle="Jenis Kelamin Bayi"
              containerStyle={{
                backgroundColor: 'white',
                paddingVertical: 15,
                paddingHorizontal:12,
                borderRadius: 8,  
                borderWidth: 0.4,
                borderColor: '#F789AC',
              }}
              textStyle={{
                fontSize: 14,
                fontFamily: 'Poppins',
                color: '#666',
              }}
            />
          </View>

          {/* Komplikasi Kehamilan - menggunakan CustomPicker */}
          <View className="mb-6 w-full">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Komplikasi Kehamilan (Opsional)
            </Text>
            <CustomPicker
              value={formData.komplikasiKehamilan}
              onValueChange={handleKomplikasiKehamilanChange}
              items={komplikasiKehamilanOptions}
              placeholder="Masukkan ada atau tidaknya komplikasi"
              disabled={loading}
              modalTitle="Komplikasi Kehamilan"
              containerStyle={{
                backgroundColor: 'white',
                paddingVertical: 15,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 0.4,
                borderColor: '#F789AC',
                width:width*0.88,
                
              }}
              textStyle={{
                fontSize: 14,
                fontFamily: 'Poppins',
                color: '#666',
              }}
            />
          </View>

          {/* Jenis Komplikasi (jika ada) - menggunakan CustomPicker */}
          {formData.komplikasiKehamilan === 'Ada komplikasi' && (
            <View className="mb-6 w-full">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Jenis Komplikasi (jika ada)
              </Text>
              <CustomPicker
                value={formData.jenisKomplikasi}
                onValueChange={handleJenisKomplikasiChange}
                items={jenisKomplikasiOptions}
                placeholder="Masukkan jenis komplikasi yang dialami"
                disabled={loading}
                modalTitle="Jenis Komplikasi"
                containerStyle={{
                  backgroundColor: 'white',
                  paddingVertical: 15,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  borderWidth: 0.4,
                  borderColor: '#F789AC',
                  width:width*0.88,
                }}
                textStyle={{
                  fontSize: 14,
                  fontFamily: 'Poppins',
                  color: '#666',
                }}
              />
            </View>
          )}

          {/* Simpan Button */}
          <TouchableOpacity
            onPress={saveKehamilan}
            className="bg-pink-medium rounded-3xl py-4 px-6 shadow-sm mb-8 mx-auto mt-24"
            style={{ 
              width: width *0.86,
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
    </View>
  );
}