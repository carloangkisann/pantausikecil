import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const FoodRecommendation = () => {
  const [selectedCategory, setSelectedCategory] = useState<'sarapan' | 'makan-siang' | 'makan-malam' | 'cemilan'>('sarapan');

  const categories = [
    { id: 'sarapan', name: 'Sarapan' },
    { id: 'makan-siang', name: 'Makan Siang' },
    { id: 'makan-malam', name: 'Makan Malam' },
    { id: 'cemilan', name: 'Cemilan' }
  ];

  // Mock data - nanti dari API
  const foodData = {
    sarapan: [
      { 
        id: 1, 
        name: 'Bubur Kacang Hijau', 
        calories: 500, 
        nutrition: { kalsium: 5 },
        image: require('../../../assets/images/default.png') // placeholder
      },
      { 
        id: 2, 
        name: 'Roti Gandum dengan Alpukat', 
        calories: 350, 
        nutrition: { folat: 80 },
        image: require('../../../assets/images/default.png') // placeholder
      },
      { 
        id: 3, 
        name: 'Smoothie Pisang Bayam', 
        calories: 280, 
        nutrition: { zat_besi: 3 },
        image: require('../../../assets/images/default.png') // placeholder
      },
      { 
        id: 4, 
        name: 'Oatmeal dengan Kacang', 
        calories: 420, 
        nutrition: { protein: 15 },
        image: require('../../../assets/images/default.png') // placeholder
      },
      { 
        id: 5, 
        name: 'Telur Rebus dengan Roti', 
        calories: 380, 
        nutrition: { protein: 20 },
        image: require('../../../assets/images/default.png') // placeholder
      },
      { 
        id: 6, 
        name: 'Yogurt dengan Granola', 
        calories: 320, 
        nutrition: { kalsium: 8 },
        image: require('../../../assets/images/default.png') // placeholder
      }
    ],
    'makan-siang': [
      { 
        id: 7, 
        name: 'Nasi Merah dengan Ayam', 
        calories: 650, 
        nutrition: { protein: 35 },
        image: require('../../../assets/images/default.png') // placeholder
      },
      { 
        id: 8, 
        name: 'Salmon Panggang', 
        calories: 580, 
        nutrition: { omega3: 2 },
        image: require('../../../assets/images/default.png') // placeholder
      }
    ],
    'makan-malam': [
      { 
        id: 9, 
        name: 'Sup Bayam Jagung', 
        calories: 320, 
        nutrition: { folat: 120 },
        image: require('../../../assets/images/default.png') // placeholder
      }
    ],
    cemilan: [
      { 
        id: 10, 
        name: 'Kacang Almond', 
        calories: 200, 
        nutrition: { kalsium: 4 },
        image: require('../../../assets/images/default.png') // placeholder
      }
    ]
  };

  const currentFoods = foodData[selectedCategory] || [];
    const handleFoodPress = (foodId: number) => {
    router.push({
        pathname: '/nutrisi/[foodId]',
        params: { foodId: foodId.toString() }
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
      <View className="flex-row items-center px-4 py-6 pt-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Image 
            source={require('../../../assets/images/back-arrow.png')}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-4">
          Rekomendasi Makanan
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
        {/* Category Filter */}
        <View className="px-4 py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category.id 
                      ? 'bg-pink-medium' 
                      : 'bg-pink-semi-low'
                  }`}
                  onPress={() => setSelectedCategory(category.id as any)}
                >
                  <Text className={`font-medium ${
                    selectedCategory === category.id 
                      ? 'text-white' 
                      : 'text-pink-600'
                  }`}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Results */}
        <View className="px-4">
          <Text className="text-gray-800 text-lg font-semibold mb-4">
            Results
          </Text>

          {/* Food Grid */}
          <View className="flex-row flex-wrap justify-between">
            {currentFoods.map((food) => (
              <TouchableOpacity
                key={food.id}
                className="w-[48%] bg-pink-medium rounded-2xl p-4 mb-4"
                onPress={() => handleFoodPress(food.id)}
              >
                {/* Food Image Placeholder */}
                <View className="w-full h-24 bg-pink-semi-low rounded-xl mb-3 items-center justify-center overflow-hidden">
                    {food.image ? (
                        <Image 
                        source={{ uri: food.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                        onError={() => {
                            // Kalau image gagal load, akan fallback ke emoji
                            console.log('Image failed to load, using emoji fallback');
                        }}
                        />
                    ) : (
                        <Text className="text-4xl">🍲</Text>
                    )}
                    </View>
                {/* Food Info */}
                <Text className="text-white font-semibold text-sm mb-2 text-center mx-auto w-3/4" numberOfLines={2}>
                  {food.name}
                </Text>
                
                <View className="border-t border-white/20 pt-2">
                  <View className="flex-row justify-between">   
                    <Text className="text-white text-xs">Kalori</Text>
                    <Text className="text-white text-xs font-medoum">{food.calories} Cal</Text>
                  </View>
                  
                  {/* Nutrition info */}
                  {Object.entries(food.nutrition).map(([key, value]) => (
                    <View key={key} className="flex-row justify-between mt-1">
                      <Text className="text-white text-xs capitalize">
                        {key.replace('_', ' ')}
                      </Text>
                      <Text className="text-white text-xs font-medium">
                        {value} {key.includes('kalori') ? 'Cal' : 'g'}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Empty State */}
          {currentFoods.length === 0 && (
            <View className="items-center py-12">
              <Text className="text-gray-500 text-base">
                Belum ada rekomendasi untuk kategori ini
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default FoodRecommendation;