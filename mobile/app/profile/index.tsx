import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { UserProfile, UserConnection, PregnancyData } from '../../types';

export default function ProfileIndex() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [connections, setConnections] = useState<UserConnection[]>([]);
  const [pregnancies, setPregnancies] = useState<PregnancyData[]>([]);
  const [loading, setLoading] = useState(true);

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
        setProfile(profileResponse.data);
      }

      // Load connections
      const connectionsResponse = await apiService.getUserConnections(user.id);
      if (connectionsResponse.success) {
        setConnections(connectionsResponse.data || []);
      }

      // Load pregnancies
      const pregnanciesResponse = await apiService.getUserPregnancies(user.id);
      if (pregnanciesResponse.success) {
        setPregnancies(pregnanciesResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePregnancyWeeks = () => {
    if (!pregnancies.length) return 'Belum ada data kehamilan';
    
    const activePregnancy = pregnancies.find(p => !p.endDate);
    if (!activePregnancy) return 'Belum Melahirkan';
    
    const startDate = new Date(activePregnancy.startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return `${diffWeeks} Minggu`;
  };

  const getPregnancyStatus = () => {
    if (!pregnancies.length) return 'Belum ada data kehamilan';
    
    const activePregnancy = pregnancies.find(p => !p.endDate);
    return activePregnancy ? 'Sedang Hamil' : 'Sudah Melahirkan';
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.logout();
              await logout();
              router.replace('/login');
            } catch (error) {
              console.error('Logout error:', error);
              // Force logout even if API call fails
              await logout();
              router.replace('/login');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-pink-medium items-center justify-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-2">Memuat profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-pink-medium">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
        <TouchableOpacity 
          onPress={handleGoBack}
          className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
        >
        <Image source={require('../../assets/images/back-arrow.png')}></Image>
        </TouchableOpacity>
        
        <Text className="text-white text-xl font-semibold">Profil Saya</Text>
        
        <View className="w-10" />
      </View>

      {/* Profile Card */}
      <View className="mx-4 mb-4 bg-pink-low rounded-2xl p-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <View className="w-16 h-16 bg-pink-semi-medium rounded-full mr-4 overflow-hidden">
            <Image 
              source={
                profile?.profileImage 
                  ? { uri: profile.profileImage }
                  : require('../../assets/images/default-profile.png')
              } 
              className="w-full h-full mx-auto my-auto"
              resizeMode="cover"
            />
          </View>
          
          <View className="flex-1">
            <Text className="text-black-low text-lg font-semibold mb-1">
              {profile?.fullName || user?.email || 'Nama tidak tersedia'}
            </Text>
            <Text className="text-gray-600 text-sm mb-2">
              {user?.email || 'Email tidak tersedia'}
            </Text>
            <Text className="text-pink-hard text-sm font-medium">
              {getPregnancyStatus()}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={handleEditProfile}
          className="bg-pink-medium rounded-3xl w-1/2 h-1/4 mx-auto p-1 items-center"
        >
          <Text className="text-white font-semibold text-base ">
            Ubah Profil
          </Text>
        </TouchableOpacity>
      </View>

      {/* Detail Informasi */}
      <View className="mx-4 mb-4 bg-pink-low rounded-2xl p-4 shadow-sm">
        <Text className="text-black-low text-lg text-center font-semibold mb-4">
          Detail Informasi
        </Text>
        
        <View className="space-y-4">
          {/* Usia */}
          <View className="border-b border-gray-400 pb-3">
            <Text className="text-black-low font-medium mb-1">Usia</Text>
            <Text className="text-gray-1">{profile?.age ? `${profile.age} tahun` : 'Belum diisi'}</Text>
          </View>
          
          {/* Usia Kehamilan */}
          <View className="border-b border-gray-400 pb-3">
            <Text className="text-black-low font-medium mb-1">Usia kehamilan</Text>
            <Text className="text-gray-1">{calculatePregnancyWeeks()}</Text>
          </View>
          
          {/* Vegetarian */}
          <View className="border-b border-gray-400 pb-3">
            <Text className="text-black-low font-medium mb-1">Vegetarian</Text>
            <Text className="text-gray-1">{profile?.isVegetarian ? 'Ya' : 'Tidak'}</Text>
          </View>
          
          {/* Kondisi Finansial */}
          <View className="border-b border-gray-400 pb-3">
            <Text className="text-black-low font-medium mb-1">Kondisi Finansial</Text>
            <Text className="text-gray-1">{profile?.financialStatus || 'Belum diisi'}</Text>
          </View>
          
          {/* Alergi */}
          <View className="border-b border-gray-400 pb-3">
            <Text className="text-black-low font-medium mb-1">Alergi</Text>
            <Text className="text-gray-1">{profile?.allergy || 'Tidak ada'}</Text>
          </View>
          
          {/* Kondisi Medis */}
          <View>
            <Text className="text-black-low font-medium mb-1">Kondisi Medis</Text>
            <Text className="text-gray-1">{profile?.medicalCondition || 'Tidak ada'}</Text>
          </View>
        </View>
      </View>

      {/* Koneksi */}
      <View className="mx-4 mb-4 bg-pink-low rounded-2xl p-4 shadow-sm">
        <Text className="text-black-low text-lg font-semibold mb-4">
          Koneksi
        </Text>
        
        {connections.length > 0 ? (
          <View className="space-y-3">
            {connections.map((connection, index) => (
              <View key={connection.id} className="flex-row items-center">
                <Text className="text-pink-hard font-medium mr-2">{index + 1}.</Text>
                <Text className="text-gray-1 underline">
                  {connection.connectionEmail}
                </Text>
                <Text className="text-gray-1 ml-2">
                  ({connection.relationshipType})
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-1 text-center italic">
            Belum ada koneksi
          </Text>
        )}
      </View>

      {/* Logout Button */}
      <View className="mx-4 mb-6">
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-hard rounded-2xl py-4 w-1/2 w-3/4 mx-auto items-center shadow-sm"
        >
          <Text className="text-white font-semibold text-lg">
            Keluar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}