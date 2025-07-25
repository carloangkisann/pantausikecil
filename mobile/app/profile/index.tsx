import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, SafeAreaView ,Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { UserProfile, UserConnection, PregnancyData } from '../../types';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileIndex() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [connections, setConnections] = useState<UserConnection[]>([]);
  const [pregnancies, setPregnancies] = useState<PregnancyData[]>([]);
  const [loading, setLoading] = useState(true);



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

   useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [user?.id])
  );
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
  const width = Dimensions.get('window').width;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-pink-medium">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white mt-2 font-poppins">Memuat profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-pink-medium">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 40,
          flexGrow: 1 
        }}
        bounces={false}
      >
        {/* Header */}
        <View className='h-12'></View>
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <TouchableOpacity 
            onPress={handleGoBack}
            className="rounded-full items-center justify-center"
          >
            {/* <Image source={require('../../assets/images/back-arrow.png')} /> */}
                <FontAwesome5 name ='arrow-circle-left' color='white' size={0.08*width}></FontAwesome5>
          </TouchableOpacity>
          
          <Text className="text-white text-xl font-semibold font-poppins">Profil Saya</Text>
           
          <View className="w-10" />
        </View>

        {/* Profile Card */}
        <View className="mx-4 mb-4 bg-pink-low rounded-2xl p-4 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 bg-pink-hard rounded-full overflow-hidden">
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
            
            <View className="flex-1 ml-4">
              <Text className="text-black-low text-base font-semibold mb-1 font-poppins">
                {profile?.fullName ||  'Anonymous'}
              </Text>
              <Text className="text-gray-600 text-sm mb-2 font-poppins">
                {user?.email || 'Email tidak tersedia'}
              </Text>
              <Text className="text-pink-hard text-sm font-medium font-poppins">
                {getPregnancyStatus()}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={handleEditProfile}
            className="bg-pink-medium rounded-xl py-2 px-2 self-center w-1/2"
          >
            <Text className="text-white font-semibold text-sm font-poppins mx-auto">
              Ubah Profil
            </Text>
          </TouchableOpacity>
        </View>

        {/* Detail Informasi */}
        <View className="mx-4 mb-4 bg-pink-low rounded-2xl p-4 shadow-sm">
          <Text className="text-black-low text-base text-center font-semibold font-poppins">
            Detail Informasi
          </Text>
          
          <View className="space-y-4">
            {/* Usia */}
            <View className="border-b border-gray-400 pb-1">
              <Text className="text-black-low font-medium mb-1 font-poppins">Usia</Text>
              <Text className="text-gray-1 font-poppins">{profile?.age ? `${profile.age} tahun` : 'Belum diisi'}</Text>
            </View>
            
            {/* Usia Kehamilan */}
            <View className="border-b border-gray-400 pb-1">
              <Text className="text-black-low font-medium mb-1 font-poppins">Usia kehamilan</Text>
              <Text className="text-gray-1 font-poppins">{calculatePregnancyWeeks()}</Text>
            </View>
            
            {/* Vegetarian */}
            <View className="border-b border-gray-400 pb-1">
              <Text className="text-black-low font-medium mb-1 font-poppins">Vegetarian</Text>
              <Text className="text-gray-1 font-poppins">{profile?.isVegetarian ? 'Ya' : 'Tidak'}</Text>
            </View>
            
            {/* Kondisi Finansial */}
            <View className="border-b border-gray-400 pb-1">
              <Text className="text-black-low font-medium mb-1 font-poppins">Kondisi Finansial</Text>
              <Text className="text-gray-1 font-poppins">{profile?.financialStatus || 'Belum diisi'}</Text>
            </View>
            
            {/* Alergi */}
            <View className="border-b border-gray-400 pb-1">
              <Text className="text-black-low font-medium mb-1 font-poppins">Alergi</Text>
              <Text className="text-gray-1 font-poppins">{profile?.allergy || 'Tidak ada'}</Text>
            </View>
            
            {/* Kondisi Medis */}
            <View>
              <Text className="text-black-low font-medium mb-1 font-poppins">Kondisi Medis</Text>
              <Text className="text-gray-1 font-poppins">{profile?.medicalCondition || 'Tidak ada'}</Text>
            </View>
          </View>
        </View>

        {/* Koneksi */}
        <View className="mx-4 mb-4 bg-pink-low rounded-2xl p-4 shadow-sm">
          <Text className="text-black-low text-base font-semibold mb-4 font-poppins">
            Koneksi
          </Text>
          
          {connections.length > 0 ? (
            <View className="space-y-3">
              {connections.map((connection, index) => (
                <View key={connection.id} className="flex-row items-center">
                  <Text className="text-pink-hard font-medium mr-2 font-poppins">{index + 1}.</Text>
                  <Text className="text-gray-1 underline font-poppins">
                    {connection.connectionEmail}
                  </Text>
                  <Text className="text-gray-1 ml-2 font-poppins">
                    ({connection.relationshipType})
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-1 text-center italic font-poppins">
              Belum ada koneksi
            </Text>
          )}
        </View>

        {/* Logout Button */}
        <View className="mx-4 ">
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-red-hard rounded-2xl py-2 px-8 self-center shadow-sm"
          >
            <Text className="text-white font-semibold text-lg font-poppins">
              Keluar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}