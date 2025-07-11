import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const FoodDetail = () => {
  const { foodId } = useLocalSearchParams();

  // Mock data - nanti dari API berdasarkan foodId
  const foodDetail = {
    id: 1,
    name: 'Bubur Kacang Hijau',
    image: '../../../assets/images/buburkacangijo.png', // Real image URL
    emoji: '🥣',
    description: 'Bubur kacang hijau adalah makanan tradisional Indonesia yang kaya akan nutrisi penting untuk ibu hamil. Mengandung protein nabati, serat, dan berbagai vitamin yang mendukung perkembangan janin yang sehat.',
    nutrition: {
      kalori: 180,
      zat_besi: 3,
      protein: 7,
      folat: 90
    },
    tips: 'Tambahkan sedikit gula kelapa, hindari susu kental manis berlebihan'
  };

  return (
    <LinearGradient
      colors={['#FF9EBD', '#F2789F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-6 pt-4">
        <TouchableOpacity onPress={() => router.push('/nutrisi/recommendation')}>
          <Image 
            source={require('../../../assets/images/back-arrow.png')}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-4">
          {foodDetail.name}
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
        {/* Food Image */}
        <View className=" mt-4 mb-6">
          <View className="w-screen h-full bg-pink-mediumrounded-2xl overflow-hidden items-center justify-center">
            {foodDetail.image ? (
            // buat implementasi asku anti
            //   <Image 
            //     source={{ uri: foodDetail.image }}
            //     className='w-full h-full'
            //     resizeMode="cover"
            //     onError={() => console.log('Image failed to load')}
            //   />
             <Image 
                source={require('../../../assets/images/buburkacangijo.png')}
                className='w-full h-full'
                resizeMode="cover"
                onError={() => console.log('Image failed to load')}
              />
            ) : (
              <Text className="text-8xl">{foodDetail.emoji}</Text>
            )}
          </View>
        </View>

        {/* Description Section */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-medium  -medium rounded-2xl p-4">
            <Text className="text-white text-base font-semibold mb-3">
              Deskripsi
            </Text>
            <Text className="text-white text-sm leading-6">
              {foodDetail.description}
            </Text>
          </View>
        </View>

        {/* Nutrition Section */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-medium rounded-2xl p-4">
            <Text className="text-white text-base font-semibold mb-4">
              Gizi per porsi
            </Text>
            
            <View className="space-y-1">
              {Object.entries(foodDetail.nutrition).map(([key, value]) => (
                <View key={key} className="flex-row items-center ">
                  <View className="w-1 h-1 bg-white rounded-full mr-3" />
                  <Text className="text-white text-sm flex-1">
                    <Text className="font-medium capitalize">
                      {key.replace('_', ' ')}:
                    </Text>
                    <Text className="font-normal"> {value} {getUnit(key)}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-semi-medium rounded-2xl p-4">
            <View className="flex-row items-center mb-3">
                <Image 
                    source={require('../../../assets/images/like.png')}
                    className="w-6 h-6 mr-3"
                    resizeMode="contain"
                />
            <Text className="text-white text-lg font-semibold">
                Tips
              </Text>
            </View>
            <Text className="text-white text-base leading-6">
              {foodDetail.tips}
            </Text>
          </View>
        </View>

        {/* Add to Food Log Button */}
        <View className="mx-4 mb-6 w-1/2 mx-auto">
          <TouchableOpacity 
            className="bg-pink-medium rounded-2xl py-4  "
            onPress={() => {
              // Add to food log logic
              console.log('Added to food log:', foodDetail.name);
              router.back();
            }}
          >
            <Text className="text-white text-center text-xs font-semibold">
              Tambah ke Catatan Makanan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

// Helper function untuk unit nutrisi
const getUnit = (nutrient: string) => {
  switch (nutrient) {
    case 'kalori':
      return 'kcal';
    case 'protein':
    case 'lemak':
    case 'karbohidrat':
      return 'g';
    case 'zat_besi':
    case 'kalsium':
      return 'mg';
    case 'folat':
      return 'mcg';
    default:
      return 'g';
  }
};

export default FoodDetail;