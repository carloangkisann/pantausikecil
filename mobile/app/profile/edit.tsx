import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

export default function ProfileEdit() {
  const [formData, setFormData] = useState({
    nama: 'Lala Matchaciz',
    usia: '21',
    usiaKehamilan: '12',
    vegetarian: true,
    kondisiFinansial: 'Menengah',
    alergi: 'Bulu kucing',
    kondisiMedis: 'Anemia'
  });

  const [koneksi, setKoneksi] = useState([
    'Fawwas69@gmail.com',
    'Dzaky77@gmail.com'
  ]);

  const handleGoBack = () => {
    router.back();
  };

  const handleEditAvatar = () => {
    Alert.alert('Edit Avatar', 'Fitur ganti avatar akan segera tersedia');
  };

  const handleTambahKoneksi = () => {
    Alert.prompt(
      'Tambah Koneksi',
      'Masukkan email koneksi baru:',
      (email) => {
        if (email && email.includes('@')) {
          setKoneksi([...koneksi, email]);
        }
      }
    );
  };

  const handleHapusKoneksi = (index: number) => {
    Alert.alert(
      'Hapus Koneksi',
      'Yakin ingin menghapus koneksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => {
            const newKoneksi = koneksi.filter((_, i) => i !== index);
            setKoneksi(newKoneksi);
          }
        }
      ]
    );
  };

  const handleSelesaiKehamilan = () => {
    Alert.alert(
      'Selesai Kehamilan',
      'Apakah Anda yakin ingin menandai kehamilan sebagai selesai?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya', onPress: () => {
          Alert.alert('Berhasil', 'Status kehamilan berhasil diubah');
        }}
      ]
    );
  };

  const handleSaveProfile = () => {
    Alert.alert('Berhasil', 'Profile berhasil disimpan');
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-pink-medium" showsVerticalScrollIndicator={false}>
      {/* Header - diperkecil */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-2">
        <TouchableOpacity 
          onPress={handleGoBack}
          className="w-8 h-8 bg-white/20 rounded-full items-center justify-center"
        >
          <Image source={require('../../assets/images/back-arrow.png')} />
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-semibold">Edit Profile</Text>
        
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
      <View className="mx-4 mb-3 bg-pink-low rounded-xl p-3 shadow-sm">
        <Text className="text-black-low text-base font-semibold text-center mb-3">
          Detail Profile
        </Text>
        
        <View>
          {/* Form fields dengan spacing yang lebih kecil */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs">
              Nama
            </Text>
            <TextInput
              value={formData.nama}
              onChangeText={(text) => setFormData({...formData, nama: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border text-gray-1"
              placeholder="Masukkan nama"
              style={{ fontSize: 12, height: 32 }}
            />
          </View>

          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs">
              Usia
            </Text>
            <TextInput
              value={formData.usia}
              onChangeText={(text) => setFormData({...formData, usia: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-black text-gray-1"
              placeholder="Masukkan usia"
              keyboardType="numeric"
              style={{ fontSize: 12, height: 32 }}
            />
          </View>

          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs">
              Usia Kehamilan
            </Text>
            <TextInput
              value={formData.usiaKehamilan}
              onChangeText={(text) => setFormData({...formData, usiaKehamilan: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-black text-gray-1"
              placeholder="Masukkan usia kehamilan"
              keyboardType="numeric"
              style={{ fontSize: 12, height: 32 }}
            />
          </View>

          {/* Vegetarian Toggle - diperkecil */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs">
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
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Kondisi Finansial - diperkecil */}
          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs">
              Kondisi Finansial
            </Text>
            <View className="bg-pink-low rounded-lg border border-black overflow-hidden shadow-sm" style={{ height: 32 }}>
              <Picker
                selectedValue={formData.kondisiFinansial}
                onValueChange={(itemValue) => setFormData({...formData, kondisiFinansial: itemValue})}
                style={{ height: 32, fontSize: 12 }}
                className='bg-pink-low text-gray-1'
              >
                <Picker.Item label="Rendah" value="Rendah" />
                <Picker.Item label="Menengah" value="Menengah" />
                <Picker.Item label="Tinggi" value="Tinggi" />
              </Picker>
            </View>
          </View>

          <View className="mb-2">
            <Text className="text-black-low font-medium mb-1 text-xs">
              Alergi
            </Text>
            <TextInput
              value={formData.alergi}
              onChangeText={(text) => setFormData({...formData, alergi: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border  text-gray-1 border-black shadow-sm"
              placeholder="Masukkan alergi"
              placeholderTextColor="#666666"
              style={{ fontSize: 12, height: 32, color: '#666666' }}
            />
          </View>

          <View className="mb-3">
            <Text className="text-black-low font-medium mb-1 text-xs">
              Kondisi Medis
            </Text>
            <TextInput
              value={formData.kondisiMedis}
              onChangeText={(text) => setFormData({...formData, kondisiMedis: text})}
              className="bg-pink-low rounded-lg px-3 py-1 border border-black shadow-sm"
              placeholder="Masukkan kondisi medis"
              placeholderTextColor="#666666"
              style={{ fontSize: 12, height: 32, color: '#666666' }}
            />
          </View>

          {/* Simpan Profile Button */}
          <View className="mt-3 items-center justify-center">
            <TouchableOpacity 
              onPress={handleSaveProfile}
              className="rounded-lg items-center justify-center bg-pink-medium"
              style={{ 
                width: width * 0.4,
                height: 36,
              }}
            >
              <Text className="font-medium text-sm text-white">
                Simpan Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selesai Kehamilan Button */}
          <View className="mt-2 items-center justify-center">
            <TouchableOpacity 
              onPress={handleSelesaiKehamilan}
              className="rounded-lg items-center justify-center"
              style={{ 
                width: width * 0.4,
                height: 36,
                backgroundColor: '#FA5353',
                borderWidth: 1,
                borderColor: '#CC0000'
              }}
            >
              <Text className="font-medium text-sm text-white">
                Selesai Kehamilan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Koneksi - diperkecil */}
      <View className="mx-4 mb-4 bg-pink-low rounded-xl p-3 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-black-low text-base font-semibold">
            Koneksi
          </Text>
          <TouchableOpacity 
            onPress={handleTambahKoneksi}
            className="flex-row items-center"
          >
            <Ionicons name="add-circle" size={16} color="#F789AC" />
            <Text className="text-pink-hard font-medium ml-1 text-xs">Tambah</Text>
          </TouchableOpacity>
        </View>
        
        <View className="space-y-2">
          {koneksi.map((email, index) => (
            <View key={index} className="flex-row items-center justify-between py-1">
              <View className="flex-row items-center flex-1">
                <Text className="text-gray-1 font-medium mr-2 text-xs">{index + 1}.</Text>
                <Text className="text-gray-1 underline flex-1 text-xs">{email}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleHapusKoneksi(index)}
                className="bg-pink-medium rounded-lg px-2 py-1"
              >
                <Text className="text-white text-xs">Hapus</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}