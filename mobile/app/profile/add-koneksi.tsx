import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

export default function AddKoneksi() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    hubungan: 'Suami' as 'Suami' | 'Lainnya',
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
              onPress: () => router.back()
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

  return (
    <ScrollView className="flex-1 bg-pink-medium" showsVerticalScrollIndicator={false}>
      {/* Header - diperkecil sama seperti ProfileEdit */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <TouchableOpacity 
          onPress={handleGoBack}
          className="w-8 h-8 bg-white/20 rounded-full items-center justify-center"
        >
          <Image source={require('../../assets/images/back-arrow.png')} />
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-semibold">Tambah Koneksi</Text>
        
        <View className="w-8 h-8" />
      </View>

      {/* Detail Koneksi Form - styling konsisten dengan ProfileEdit */}
      <View className="mx-4 mb-3 bg-pink-low rounded-xl p-3 shadow-sm">
        <Text className="text-black-low text-base font-semibold mb-3 text-center">
          Detail Koneksi
        </Text>
        
        <View>
          {/* Nama */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs">
              Nama
            </Text>
            <TextInput
              value={formData.nama}
              onChangeText={(text) => setFormData({...formData, nama: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-black shadow-sm"
              placeholder="Masukkan nama koneksi"
              placeholderTextColor="#666666"
              style={{ fontSize: 12, height: 32, color: '#666666' }}
            />
          </View>

          {/* Hubungan dengan Ibu */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs">
              Hubungan dengan Ibu
            </Text>
            <View className="bg-pink-low rounded-lg border border-black overflow-hidden shadow-sm" style={{ height: 32 }}>
              <Picker
                selectedValue={formData.hubungan}
                onValueChange={(itemValue) => setFormData({...formData, hubungan: itemValue})}
                style={{ height: 32, fontSize: 12 }}
                className='bg-pink-low'
              >
                <Picker.Item label="Suami" value="Suami" />
                <Picker.Item label="Lainnya" value="Lainnya" />
              </Picker>
            </View>
          </View>

          {/* Alamat Email */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs">
              Alamat Email
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-black shadow-sm"
              placeholder="Contoh: example@gmail.com"
              placeholderTextColor="#666666"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ fontSize: 12, height: 32, color: '#666666' }}
            />
          </View>
        </View>
      </View>

      {/* Simpan Button - terpisah seperti desain asli */}
      <View className="mx-4 mb-4">
        <TouchableOpacity 
          onPress={handleSimpan}
          disabled={saving}
          className="bg-pink-low rounded-xl py-3 items-center shadow-sm"
          style={{ opacity: saving ? 0.7 : 1 }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Text className="text-black-low font-medium text-base">
              Simpan
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}