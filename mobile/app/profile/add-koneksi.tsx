import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomPicker from '../components/CustomPicker';
const pilihanHubunganOptions = [
  {label:'Suami', value :'Suami'},
  {label:'Mertua', value :'Mertua'},
  {label:'Saudara Kandung', value : 'Saudara Kandung'},
  {label:'Teman', value :'Teman'},
  {label:'Lainnya',value:'Lainnya'},

];

export default function AddKoneksi() {


  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    hubungan: 'Suami' as 'Suami' | 'Mertua'|'Saudara Kandung'|'Teman'|'Lainnya',
    email: ''
  });

  const handleGoBack = () => {
    router.back();
  };

  const handleSimpan = async () => {
    // Validation
    if (!formData.nama.trim()) {
      Alert.alert('Error', 'Nama koneksi harus diisi');
      return;
    }
    
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email harus diisi');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User tidak ditemukan');
      return;
    }

    try {
      setSaving(true);
      
      const connectionData = {
        connectionEmail: formData.email.trim(),
        connectionName: formData.nama.trim(),
        relationshipType: formData.hubungan
      };

      const response = await apiService.createConnection(user.id, connectionData);
      
      if (response.success) {
        Alert.alert(
          'Berhasil', 
          'Koneksi berhasil ditambahkan',
          [
            {
              text: 'OK',
              onPress: () => router.push('/profile')
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Gagal menambahkan koneksi');
      }
    } catch (error) {
      console.error('Error creating connection:', error);
      Alert.alert('Error', 'Gagal menambahkan koneksi');
    } finally {
      setSaving(false);
    }
  };

  const width = Dimensions.get('window').width;
  const handlePilihanHubunganChange =(value : string |number) => {
    setFormData({...formData,hubungan:value as 'Suami' | 'Mertua'|'Saudara Kandung'|'Teman'|'Lainnya'})
  }
  return (
    <ScrollView className="flex-1 bg-pink-medium" showsVerticalScrollIndicator={false}>

         <View className='h-12'></View>
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <TouchableOpacity 
          onPress={handleGoBack}
          className="w-10 h-12 bg-white/20 rounded-full items-center justify-center"
        >
          {/* <Image source={require('../../assets/images/back-arrow.png')} /> */}
            <FontAwesome5 name ='arrow-circle-left' color='white' size={0.08*width}></FontAwesome5>
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-semibold font-poppins">Tambah Koneksi</Text>
        
        <View className="w-8 h-8" />
      </View>

      {/* Detail Koneksi Form - styling konsisten dengan ProfileEdit */}
      <View className="mx-4 mb-3 bg-pink-low rounded-xl p-3 shadow-sm">
        <Text className="text-black-low text-base font-semibold mb-3 text-center font-poppins">
          Detail Koneksi
        </Text>
        
        <View>
          {/* Nama */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs font-poppins">
              Nama
            </Text>
            <TextInput
              value={formData.nama}
              onChangeText={(text) => setFormData({...formData, nama: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-gray-1 font-poppins text-gray-1 font-poppins  text-xs"
              placeholder="Masukkan nama koneksi"

            />
          </View>

          {/* Hubungan dengan Ibu */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs font-poppins">
              Hubungan dengan Ibu
            </Text>
            <CustomPicker
                 value={formData.hubungan}
                onValueChange={handlePilihanHubunganChange}
                items={pilihanHubunganOptions}
                      placeholder="Pilih kondisi finansial"
                      disabled={saving}
                      modalTitle="Kondisi Finansial"
                      containerStyle={{
                        height: 32, // Height yang lebih kecil
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                  }}
                  textStyle={{
                    fontSize: 12, // Text size yang lebih kecil
                    fontFamily: 'Poppins',
                  }}
                />
          </View>


          {/* Alamat Email */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs font-poppins">
              Alamat Email
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              className="bg-pink-low text-gray-1 rounded-lg px-3 py-1 border border-gray-1  text-gray-1 font-poppins  text-xs"
              placeholder="Contoh: example@gmail.com"
           
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>

      {/* Simpan Button - terpisah seperti desain asli */}
      <View className="mx-4 mb-4">
        <TouchableOpacity 
          onPress={handleSimpan}
          disabled={saving}
          className="bg-pink-low rounded-xl py-3 items-center shadow-sm disabled:opacity-75 " 
        >
          {saving ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Text className="text-black-low font-medium text-base font-poppins font-bold">
              Simpan
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}