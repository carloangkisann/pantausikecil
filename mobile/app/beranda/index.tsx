import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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

  const [showKondisiDropdown, setShowKondisiDropdown] = useState(false);
  const kondisiOptions = ['Rendah', 'Menengah', 'Tinggi'];

  const handleGoBack = () => {
    router.back();
  };

  const handleEditAvatar = () => {
    // Implementasi untuk ganti avatar
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
          // Implementasi logic selesai kehamilan
          Alert.alert('Berhasil', 'Status kehamilan berhasil diubah');
        }}
      ]
    );
  };

  const handleSaveProfile = () => {
    // Implementasi save profile
    Alert.alert('Berhasil', 'Profile berhasil disimpan');
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-pink-medium">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <TouchableOpacity 
          onPress={handleGoBack}
          className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
        >
          <Image source={require('../../assets/images/back-arrow.png')} />
        </TouchableOpacity>
        
        <Text className="text-white text-xl font-semibold">Edit Profile</Text>
        
        <TouchableOpacity onPress={handleSaveProfile}>
          <Text className="text-white font-medium">Simpan</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <View className="items-center mb-6">
        <View className="relative">
          <View className="w-24 h-24 bg-pink-hard rounded-full overflow-hidden">
            <Image 
              source={require('../../assets/images/default-profile.png')} 
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity 
            onPress={handleEditAvatar}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name="pencil" size={16} color="#F789AC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Detail Profile */}
      <View className="mx-4 mb-4 bg-pink-low rounded-2xl p-4 shadow-sm">
        <Text className="text-black-low text-lg font-semibold mb-4 text-center">
          Detail Profile
        </Text>
        
        <View>
          {/* Nama */}
          <View className="mb-4">
            <Text className="text-black-low font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Nama
            </Text>
            <TextInput
              value={formData.nama}
              onChangeText={(text) => setFormData({...formData, nama: text})}
              className="bg-white/80 rounded-xl px-4 py-4 text-gray-700 border border-gray-200 shadow-sm"
              placeholder="Masukkan nama"
              style={{ fontSize: width * 0.035 }}
            />
          </View>

          {/* Usia */}
          <View className="mb-4">
            <Text className="text-black-low font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Usia
            </Text>
            <TextInput
              value={formData.usia}
              onChangeText={(text) => setFormData({...formData, usia: text})}
              className="bg-white/80 rounded-xl px-4 py-4 text-gray-700 border border-gray-200 shadow-sm"
              placeholder="Masukkan usia"
              keyboardType="numeric"
              style={{ fontSize: width * 0.035 }}
            />
          </View>

          {/* Usia Kehamilan */}
          <View className="mb-4">
            <Text className="text-black-low font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Usia Kehamilan
            </Text>
            <TextInput
              value={formData.usiaKehamilan}
              onChangeText={(text) => setFormData({...formData, usiaKehamilan: text})}
              className="bg-white/80 rounded-xl px-4 py-4 text-gray-700 border border-gray-200 shadow-sm"
              placeholder="Masukkan usia kehamilan"
              keyboardType="numeric"
              style={{ fontSize: width * 0.035 }}
            />
          </View>

          {/* Vegetarian Toggle */}
          <View>
            <Text className="text-black-low font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Vegetarian?
            </Text>
            <View className="flex-row items-center justify-between mb-2">
              <TouchableOpacity
                onPress={() => setFormData({...formData, vegetarian: !formData.vegetarian})}
                style={{
                  width: width * 0.13,
                  height: height * 0.035,
                  borderRadius: height * 0.0175,
                  backgroundColor: formData.vegetarian ? '#F789AC' : '#E5E5E5',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <View
                  style={{
                    width: height * 0.029,
                    height: height * 0.029,
                    borderRadius: height * 0.0145,
                    backgroundColor: '#fff',
                    alignSelf: formData.vegetarian ? 'flex-end' : 'flex-start',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {formData.vegetarian && (
                    <Text
                      style={{
                        color: '#F789AC',
                        fontSize: width * 0.025,
                        fontWeight: 'bold',
                        lineHeight: width * 0.025
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Kondisi Finansial */}
          <View className="mb-4">
            <Text className="text-black-low font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Kondisi Finansial
            </Text>
            <TouchableOpacity
              onPress={() => setShowKondisiDropdown(!showKondisiDropdown)}
              className="bg-white/80 rounded-xl px-4 py-4 border border-gray-200 flex-row items-center justify-between shadow-sm"
            >
              <Text className="text-gray-700" style={{ fontSize: width * 0.035 }}>
                {formData.kondisiFinansial}
              </Text>
              <Ionicons 
                name={showKondisiDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
            
            {showKondisiDropdown && (
              <View className="bg-white rounded-xl mt-2 border border-gray-200 overflow-hidden shadow-sm">
                {kondisiOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setFormData({...formData, kondisiFinansial: option});
                      setShowKondisiDropdown(false);
                    }}
                    className="px-4 py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <Text className="text-gray-700" style={{ fontSize: width * 0.035 }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Alergi */}
          <View className="mb-4">
            <Text className="text-black-low font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Alergi
            </Text>
            <TextInput
              value={formData.alergi}
              onChangeText={(text) => setFormData({...formData, alergi: text})}
              className="bg-white/80 rounded-xl px-4 py-4 text-gray-700 border border-gray-200 shadow-sm"
              placeholder="Masukkan alergi"
              style={{ fontSize: width * 0.035 }}
            />
          </View>

          {/* Kondisi Medis */}
          <View className="mb-4">
            <Text className="text-black-low font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Kondisi Medis
            </Text>
            <TextInput
              value={formData.kondisiMedis}
              onChangeText={(text) => setFormData({...formData, kondisiMedis: text})}
              className="bg-white/80 rounded-xl px-4 py-4 text-gray-700 border border-gray-200 shadow-sm"
              placeholder="Masukkan kondisi medis"
              style={{ fontSize: width * 0.035 }}
            />
          </View>

          {/* Selesai Kehamilan Button */}
          <View 
            className="mt-6 p-1 rounded-2xl"
            style={{ backgroundColor: '#F9D2D2' }}
          >
            <TouchableOpacity 
              onPress={handleSelesaiKehamilan}
              className="rounded-xl py-4 items-center"
              style={{ 
                backgroundColor: '#FFFFFF',
                borderWidth: 2,
                borderColor: '#F2A6A6'
              }}
            >
              <Text className="font-semibold text-base" style={{ color: '#F789AC' }}>
                Selesai Kehamilan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Koneksi */}
      <View className="mx-4 mb-6 bg-pink-low rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-black-low text-lg font-semibold">
            Koneksi
          </Text>
          <TouchableOpacity 
            onPress={handleTambahKoneksi}
            className="flex-row items-center"
          >
            <Ionicons name="add-circle" size={20} color="#F789AC" />
            <Text className="text-pink-hard font-medium ml-1">Tambah Koneksi</Text>
          </TouchableOpacity>
        </View>
        
        <View className="space-y-3">
          {koneksi.map((email, index) => (
            <View key={index} className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Text className="text-pink-hard font-medium mr-2">{index + 1}.</Text>
                <Text className="text-gray-700 underline flex-1">{email}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleHapusKoneksi(index)}
                className="bg-pink-medium rounded-lg px-3 py-1"
              >
                <Text className="text-white text-sm">Hapus Koneksi</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}