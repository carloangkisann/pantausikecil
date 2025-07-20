import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { UserConnection, PregnancyData } from '../../types';
import CustomPicker from '../components/CustomPicker';

const { width } = Dimensions.get('window');

// Data options untuk picker
const kondisiFinansialOptions = [
  { label: 'Rendah', value: 'Rendah' },
  { label: 'Menengah', value: 'Menengah' },
  { label: 'Tinggi', value: 'Tinggi' },
];

export default function ProfileEdit() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    vegetarian: false,
    kondisiFinansial: 'Menengah' as 'Rendah' | 'Menengah' | 'Tinggi',
    alergi: '',
    kondisiMedis: ''
  });

  const [koneksi, setKoneksi] = useState<UserConnection[]>([]);
  const [pregnancies, setPregnancies] = useState<PregnancyData[]>([]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Load profile data
      const profileResponse = await apiService.getUserProfile(user.id);
      if (profileResponse.success && profileResponse.data) {
        const profile = profileResponse.data;
        setFormData({
          nama: profile.fullName || '',
          usia: profile.age?.toString() || '',
          vegetarian: profile.isVegetarian || false,
          kondisiFinansial: profile.financialStatus || 'Menengah',
          alergi: profile.allergy || '',
          kondisiMedis: profile.medicalCondition || ''
        });
      }

      // Load connections
      const connectionsResponse = await apiService.getUserConnections(user.id);
      if (connectionsResponse.success) {
        setKoneksi(connectionsResponse.data || []);
      }

      // Load pregnancies
      const pregnanciesResponse = await apiService.getUserPregnancies(user.id);
      if (pregnanciesResponse.success) {
        setPregnancies(pregnanciesResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert('Error', 'Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleEditAvatar = () => {
    Alert.alert('Edit Avatar', 'Fitur ganti avatar akan segera tersedia');
  };

  const handleTambahKoneksi = () => {
    router.push('/profile/add-koneksi');
  };

  const handleHapusKoneksi = async (connection: UserConnection) => {
    Alert.alert(
      'Hapus Koneksi',
      `Yakin ingin menghapus koneksi ${connection.connectionName}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user?.id) return;
              
              const response = await apiService.deleteConnection(user.id, connection.id);
              if (response.success) {
                setKoneksi(koneksi.filter(k => k.id !== connection.id));
                Alert.alert('Berhasil', 'Koneksi berhasil dihapus');
              } else {
                Alert.alert('Error', response.message || 'Gagal menghapus koneksi');
              }
            } catch (error) {
              console.error('Error deleting connection:', error);
              Alert.alert('Error', 'Gagal menghapus koneksi');
            }
          }
        }
      ]
    );
  };

  const handleSelesaiKehamilan = async () => {
    const activePregnancy = pregnancies.find(p => !p.endDate);
    if (!activePregnancy) {
      Alert.alert('Info', 'Tidak ada kehamilan aktif');
      return;
    }

    Alert.alert(
      'Selesai Kehamilan',
      'Apakah Anda yakin ingin menandai kehamilan sebagai selesai?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Ya', 
          onPress: async () => {
            try {
              if (!user?.id) return;
              
              const response = await apiService.updatePregnancy(
                user.id, 
                activePregnancy.id, 
                { endDate: new Date().toISOString().split('T')[0] }
              );
              
              if (response.success) {
                Alert.alert('Berhasil', 'Status kehamilan berhasil diubah');
                loadProfileData(); // Reload data
              } else {
                Alert.alert('Error', response.message || 'Gagal mengubah status kehamilan');
              }
            } catch (error) {
              console.error('Error updating pregnancy:', error);
              Alert.alert('Error', 'Gagal mengubah status kehamilan');
            }
          }
        }
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    // Validation
    if (!formData.nama.trim()) {
      Alert.alert('Error', 'Nama harus diisi');
      return;
    }

    if (formData.usia && isNaN(Number(formData.usia))) {
      Alert.alert('Error', 'Usia harus berupa angka');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        fullName: formData.nama,
        age: formData.usia ? Number(formData.usia) : undefined,
        isVegetarian: formData.vegetarian,
        financialStatus: formData.kondisiFinansial,
        allergy: formData.alergi || undefined,
        medicalCondition: formData.kondisiMedis || undefined
      };

      const response = await apiService.updateUserProfile(user.id, updateData);
      
      if (response.success) {
        Alert.alert('Berhasil', 'Profile berhasil disimpan');
        router.back();
      } else {
        Alert.alert('Error', response.message || 'Gagal menyimpan profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Gagal menyimpan profile');
    } finally {
      setSaving(false);
    }
  };

  // Handler untuk kondisi finansial
  const handleKondisiFinansialChange = (value: string | number) => {
    setFormData({...formData, kondisiFinansial: value as 'Rendah' | 'Menengah' | 'Tinggi'});
  };

  if (loading) {
    return (
      <View className="flex-1 bg-pink-medium items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-2 font-poppins">Memuat data...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-pink-medium" showsVerticalScrollIndicator={false}>
      {/* Header - diperkecil */}
      <View className="flex-row  items-center justify-between px-4  pb-2">
        <TouchableOpacity 
          onPress={handleGoBack}
          className=" rounded-full items-center justify-center"
        >
          <FontAwesome5 name='arrow-circle-left' color='white' size={0.08*width} />
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-bold font-poppins ">Edit Profile</Text>
        
        <View className="w-8 h-8" />
      </View>

      {/* Avatar Section - diperkecil */}
      <View className="items-center mb-3">
        <View className="relative">
          <View className="w-16 h-16 bg-pink-hard rounded-full overflow-hidden">
            <Image 
              source={require('../../assets/images/default-profile.png')} 
              className="w-full h-full mx-auto my-auto"
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity 
            onPress={handleEditAvatar}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="pencil" size={12} color="#F789AC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Detail Profile - margin dan padding diperkecil */}
      <View className="mx-4 mb-3 bg-pink-low rounded-xl p-3 ">
        <Text className="text-black-low text-base font-semibold text-center mb-3 font-poppins">
          Detail Profile
        </Text>
        
        <View>
          {/* Form fields dengan spacing yang lebih kecil */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs font-poppins">
              Nama
            </Text>
            <TextInput
              value={formData.nama}
              onChangeText={(text) => setFormData({...formData, nama: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-gray-1 text-gray-1 font-poppins text-xs" 
              placeholder="Masukkan nama"
            />
          </View>

          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs font-poppins">
              Usia
            </Text>
            <TextInput
              value={formData.usia}
              onChangeText={(text) => setFormData({...formData, usia: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-gray-1 text-gray-1 font-poppins text-xs"
              placeholder="Masukkan usia"
              keyboardType="numeric"
            />
          </View>

          {/* Vegetarian Toggle - diperkecil */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs font-poppins">
              Vegetarian?
            </Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setFormData({...formData, vegetarian: !formData.vegetarian})}
                style={{
                  width: width * 0.1,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: formData.vegetarian ? '#F789AC' : '#E5E5E5',
                  justifyContent: 'center',
                  paddingHorizontal: 2,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    alignSelf: formData.vegetarian ? 'flex-end' : 'flex-start',
                    elevation: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Kondisi Finansial - menggunakan CustomPicker */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs font-poppins">
              Kondisi Finansial
            </Text>
            <CustomPicker
              value={formData.kondisiFinansial}
              onValueChange={handleKondisiFinansialChange}
              items={kondisiFinansialOptions}
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

          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs font-poppins">
              Alergi
            </Text>
            <TextInput
              value={formData.alergi}
              onChangeText={(text) => setFormData({...formData, alergi: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-gray-1 text-gray-1 font-poppins text-xs"
              placeholder="Masukkan alergi"
            />
          </View>

          <View className="mb-3">
            <Text className="text-black-low font-medium mb-1 text-xs font-poppins">
              Kondisi Medis
            </Text>
            <TextInput
              value={formData.kondisiMedis}
              onChangeText={(text) => setFormData({...formData, kondisiMedis: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-gray-1 text-gray-1 font-poppins text-xs"
              placeholder="Masukkan kondisi medis"
            />
          </View>

          {/* Simpan Profile Button */}
          <View className="mt-3 items-center justify-center">
            <TouchableOpacity 
              onPress={handleSaveProfile}
              disabled={saving}
              className="rounded-lg items-center justify-center bg-pink-medium px-7 disabled:opacity-75 min-h-8"
            >
              {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="font-medium text-sm text-white font-poppins">
                  Simpan Profile
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Selesai Kehamilan Button */}
          <View className="mt-2 items-center justify-center">
            <TouchableOpacity 
              onPress={handleSelesaiKehamilan}
              className="rounded-lg items-center justify-center px-3 min-h-9 bg-[#FA5353] border border-[#CC0000]"
            >
              <Text className="font-medium text-sm text-white font-poppins">
                Selesai Kehamilan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Koneksi - diperkecil */}
      <View className="mx-4 mb-4 bg-pink-low rounded-xl p-3 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-black-low text-base font-semibold font-poppins">
            Koneksi
          </Text>
          <TouchableOpacity 
            onPress={handleTambahKoneksi}
            className="flex-row items-center"
          >
            <Ionicons name="add-circle" size={16} color="#F789AC" />
            <Text className="text-pink-hard font-medium ml-1 text-xs font-poppins">Tambah</Text>
          </TouchableOpacity>
        </View>
        
        <View className="space-y-2">
          {koneksi.length > 0 ? (
            koneksi.map((connection, index) => (
              <View key={connection.id} className="flex-row items-center justify-between py-1">
                <View className="flex-row items-center flex-1">
                  <Text className="text-gray-1 font-medium mr-2 text-xs font-poppins">{index + 1}.</Text>
                  <View className="flex-1">
                    <Text className="text-gray-1 underline text-xs font-poppins">{connection.connectionEmail}</Text>
                    <Text className="text-gray-1 text-xs font-poppins">({connection.relationshipType})</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => handleHapusKoneksi(connection)}
                  className="bg-pink-medium rounded-lg px-2 py-1"
                >
                  <Text className="text-white text-xs font-poppins">Hapus</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-gray-1 text-center italic text-xs font-poppins">
              Belum ada koneksi
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}