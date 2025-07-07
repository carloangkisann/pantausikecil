import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const DetailRekomendasiAktivitas = () => {
  const params = useLocalSearchParams();
  const { activityId, name, calories, duration, level } = params;

  // Mock video placeholder
  const VideoPlaceholder = () => (
    <View className="bg-black rounded-2xl h-48 justify-center items-center mb-6">
      {/* <Image 
        source={require('../../../assets/images/buburkacangijo.png')}
        className="w-full h-full rounded-2xl"
        resizeMode="cover"
      />
       */}
      {/* Video Controls Overlay */}
      <View className="absolute bottom-4 left-4 right-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-sm">38:56</Text>
          <Text className="text-white text-sm">1:56:30</Text>
        </View>
        
        <View className="bg-white h-1 rounded-full mt-2 mb-3">
          <View className="bg-pink-medium h-1 rounded-full" style={{ width: '35%' }} />
        </View>
        
        <View className="flex-row items-center justify-center space-x-4">
          <TouchableOpacity className="bg-white bg-opacity-20 rounded-full p-2">
            <Image 
              source={require('../../../assets/images/back-arrow.png')}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-white bg-opacity-20 rounded-full p-2">
            <Text className="text-white text-lg">⏮</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-white rounded-full p-3">
            <Text className="text-pink-medium text-xl">▶</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-white bg-opacity-20 rounded-full p-2">
            <Text className="text-white text-lg">⏭</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-white bg-opacity-20 rounded-full p-2">
            <Text className="text-white text-lg">⚙</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleStartActivity = () => {
    router.push({
      pathname: '/aktivitas/set-timer',
      params: { 
        name,
        calories,
        duration
      }
    });
  };

  return (
    <LinearGradient
      colors={['#FF9EBD', '#F2789F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-6 pt-12">
        <TouchableOpacity onPress={() => router.back()}>
          <Image 
            source={require('../../../assets/images/back-arrow.png')}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-4">
          {name}
        </Text>
      </View>

      <ScrollView 
        className="bg-pink-low"
        style={{ 
          flex: 1, 
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <View className="px-4 py-6">
          {/* Video Section */}
          <VideoPlaceholder />

          {/* Description Section */}
          <View className="bg-pink-medium rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-semibold mb-2">
              Deskripsi
            </Text>
            <Text className="text-white text-sm opacity-90 leading-5">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </Text>
          </View>

          {/* Calories Info */}
          <View className="bg-pink-medium rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-semibold">
              Kalori: {calories} kal/jam
            </Text>
          </View>

          {/* Tips Section */}
          <View className="bg-pink-semi-medium rounded-2xl p-4 mb-6">
            <View className="flex-row items-center mb-2">
              <Image 
                source={require('../../../assets/images/like.png')}
                className="w-5 h-5 mr-2"
                resizeMode="contain"
              />
              <Text className="text-white text-lg font-semibold">
                Tips
              </Text>
            </View>
            <Text className="text-white text-sm opacity-90 leading-5">
              Tambahkan sedikit gula kelapa, hindari susu kental manis berlebihan
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            className="bg-pink-medium rounded-2xl w-1/2 mx-auto py-4 px-6 mb-6"
            onPress={handleStartActivity}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Lakukan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default DetailRekomendasiAktivitas;