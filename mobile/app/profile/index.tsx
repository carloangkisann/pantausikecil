
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
export default function ProfileIndex() {
  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleGoBack = () => {
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
              source={require('../../assets/images/default-profile.png')} 
              className="w-full h-full mx-auto my-auto"
              resizeMode="cover"
            />
          </View>
          
          <View className="flex-1">
            <Text className="text-black-low text-lg font-semibold mb-1">
              Lala Matchaciz
            </Text>
            <Text className="text-gray-600 text-sm mb-2">
              lalamatchaciz21@gmail.com
            </Text>
            <Text className="text-pink-hard text-sm font-medium">
              Belum Melahirkan
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
            <Text className="text-gray-1">21 tahun</Text>
          </View>
          
          {/* Usia Kehamilan */}
          <View className="border-b border-gray-400 pb-3">
            <Text className="text-black-low font-medium mb-1">Usia kehamilan</Text>
            <Text className="text-gray-1">12 Minggu</Text>
          </View>
          
          {/* Vegetarian */}
          <View className="border-b border-gray-400 pb-3">
            <Text className="text-black-low font-medium mb-1">Vegetarian</Text>
            <Text className="text-gray-1">Ya</Text>
          </View>
          
          {/* Kondisi Finansial */}
          <View className="border-b border-gray-400 pb-3">
            <Text className="text-black-low font-medium mb-1">Kondisi Finansial</Text>
            <Text className="text-gray-1">Menengah</Text>
          </View>
          
          {/* Alergi */}
          <View className="border-b border-gray-400 pb-3">
            <Text className="text-black-low font-medium mb-1">Alergi</Text>
            <Text className="text-gray-1">Bulu kucing</Text>
          </View>
          
          {/* Kondisi Medis */}
          <View>
            <Text className="text-black-low font-medium mb-1">Kondisi Medis</Text>
            <Text className="text-gray-1">Anemia</Text>
          </View>
        </View>
      </View>

      {/* Koneksi */}
      <View className="mx-4 mb-6 bg-pink-low rounded-2xl p-4 shadow-sm">
        <Text className="text-black-low text-lg font-semibold mb-4">
          Koneksi
        </Text>
        
        <View className="space-y-3">
          <View className="flex-row items-center">
            <Text className="text-pink-hard font-medium mr-2">1.</Text>
            <Text className="text-gray-1 underline">
              Fawwas59@gmail.com
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-pink-hard font-medium mr-2">2.</Text>
            <Text className="text-gray-1 underline">
              Dzaky77@gmail.com
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}