import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';

interface KehamilanData {
  id: string;
  kehamilanKe: string;
  usiaKehamilan: string;
  jenisKelaminBayi: string;
  komplikasiKehamilan: string;
  jenisKomplikasi: string;
  createdAt: string;
}

export default function PilihKehamilan() {
  const router = useRouter();
  

  const mockKehamilanList: KehamilanData[] = [
    {
      id: '1',
      kehamilanKe: '2',
      usiaKehamilan: 'Mei 2023 - Jan 2024',
      jenisKelaminBayi: 'Laki-Laki',
      komplikasiKehamilan: 'Tidak ada komplikasi',
      jenisKomplikasi: '',
      createdAt: '2023-05-01T00:00:00.000Z'
    },
    {
      id: '2',
      kehamilanKe: '3',
      usiaKehamilan: 'Juni 2024 - Feb 2025',
      jenisKelaminBayi: 'Perempuan',
      komplikasiKehamilan: 'Ada komplikasi',
      jenisKomplikasi: 'Diabetes gestasional',
      createdAt: '2024-06-01T00:00:00.000Z'
    }
  ];

  const [kehamilanList, setKehamilanList] = useState<KehamilanData[]>(mockKehamilanList);
  const [loading, setLoading] = useState(false);

  const selectKehamilan = async (kehamilan: KehamilanData) => {
    try {
      // Mock selection - langsung redirect ke tabs
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

  const getPeriodeKehamilan = (usiaKehamilan: string) => {
    // Contoh logika untuk menentukan periode berdasarkan usia kehamilan
    const usia = parseInt(usiaKehamilan.split(' ')[0]);
    if (usia <= 12) return 'Trimester 1';
    if (usia <= 24) return 'Trimester 2';
    return 'Trimester 3';
  };

  if (loading) {
    return (
      <View className="flex-1 bg-pink-low justify-center items-center">
        <Text className="text-gray-600">Memuat data kehamilan...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-pink-low">
      <Header></Header>
      
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
    
        <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity 
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-1"
                activeOpacity={0.8}
            >
                <Image 
                source={require('../../assets/images/back-arrow-black.png')}
                className="w-5 h-5"
                resizeMode="contain"
                />
            </TouchableOpacity>
            
            <Text className="text-black-low text-xl font-semibold flex-1 text-center mx-auto">
                Data Kehamilan yang Sudah Ada
            </Text>
        </View>
  
        
        {kehamilanList.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-center text-lg mb-4">
              Belum ada data kehamilan tersimpan
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/beranda/buat-kehamilan')}
              className="bg-pink-medium rounded-2xl py-3 px-6"
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold">
                Buat Data Kehamilan Baru
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Header Table */}
            <View className="bg-pink-medium rounded-t-xl px-4 py-4 mb-2">
              <View className="flex-row justify-between">
                <Text className="text-white font-semibold flex-1 text-center text-base">
                  Kehamilan
                </Text>
                <Text className="text-white font-semibold flex-1 text-center text-base">
                  Periode Kehamilan
                </Text>
                <Text className="text-white font-semibold flex-1 text-center text-base">
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
                  <Text className="font-semibold text-gray-800 flex-1 text-center text-base">
                    {kehamilan.kehamilanKe}
                  </Text>
                  <Text className="text-gray-600 flex-1 text-center text-sm">
                    {kehamilan.usiaKehamilan}
                  </Text>
                  <Text className="text-gray-600 flex-1 text-center text-sm">
                    {kehamilan.jenisKelaminBayi}
                  </Text>
                </View>
                {/* {kehamilan.komplikasiKehamilan === 'Ada komplikasi' && (
                  <View className="mt-2 pt-2 border-t border-pink-semi-low">
                    <Text className="text-sm text-red-500 text-center">
                      Komplikasi: {kehamilan.jenisKomplikasi}
                    </Text>
                  </View>
                )} */}
              </TouchableOpacity>
            ))}

            {/* Simpan Button */}
            <TouchableOpacity
              onPress={() => router.push('/beranda/buat-kehamilan')}
              className="bg-pink-medium rounded-3xl py-4 px-6 shadow-sm mb-8 mt-4 mx-auto"
              style={{ width: 350, height: 56 }}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Tambah Data Kehamilan Baru
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}