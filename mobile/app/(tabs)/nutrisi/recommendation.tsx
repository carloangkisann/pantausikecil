import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { apiService } from '../../../services/api';
import { extractApiArrayData } from '../../../utils/apiHelpers';
import { FoodItem } from '../../../types';
import { FontAwesome5 } from '@expo/vector-icons';

const FoodRecommendation = () => {

  const [selectedCategory, setSelectedCategory] = useState<'sarapan' | 'makan-siang' | 'makan-malam' | 'cemilan'>('sarapan');
  const [loading, setLoading] = useState(true);
  const [allFoods, setAllFoods] = useState<FoodItem[]>([]);

  const categories = [
    { id: 'sarapan', name: 'Sarapan' },
    { id: 'makan-siang', name: 'Makan Siang' },
    { id: 'makan-malam', name: 'Makan Malam' },
    { id: 'cemilan', name: 'Cemilan' }
  ];

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllFood();
      const foods = extractApiArrayData<FoodItem>(response);
      setAllFoods(foods);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentFoods = () => {
    return allFoods.filter((food, index) => {
      const categoryIndex = categories.findIndex(cat => cat.id === selectedCategory);
      return index % 4 === categoryIndex;
    }); 
  };

  const currentFoods = getCurrentFoods();

  const handleFoodPress = (foodId: number) => {
    router.push({
      pathname: '/nutrisi/[foodId]',
      params: { foodId: foodId.toString() }
    });
  };


  const estimateCalories = (food: FoodItem) => {
    return Math.round((food.protein * 4) + (food.fat * 9) + 100);
  };


  const getMainNutrition = (food: FoodItem) => {
    if (food.protein > 10) return { name: 'protein', value: food.protein };
    if (food.folicAcid > 50) return { name: 'folat', value: food.folicAcid };
    if (food.iron > 3) return { name: 'zat_besi', value: food.iron };
    if (food.calcium > 100) return { name: 'kalsium', value: food.calcium };
    return { name: 'protein', value: food.protein };
  };

  const width = Dimensions.get('window').width;
  if (loading) {
    return (
      <LinearGradient
        colors={['#FF9EBD', '#F2789F']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ flex: 1 }}
      >
        <View className="flex-row items-center px-4 py-6 pt-4">
          <TouchableOpacity onPress={() => router.back()}>
            {/* <Image 
              source={require('../../../assets/images/back-arrow.png')}
              className="w-6 h-6"
              resizeMode="contain"
            /> */}
               <FontAwesome5 name ='arrow-circle-left' color='white' size={0.1*width}></FontAwesome5>
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold ml-4">
            Rekomendasi Makanan
          </Text>
        </View>

        <View className="flex-1 bg-pink-low rounded-t-2xl items-center justify-center">
          <ActivityIndicator size="large" color="#F2789F" />
          <Text className="text-gray-600 mt-4">Memuat rekomendasi...</Text>
        </View>
      </LinearGradient>
    );
  }

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
          {/* <Image 
            source={require('../../../assets/images/back-arrow.png')}
            className="w-6 h-6"
            resizeMode="contain"
          /> */}

          <FontAwesome5 name ='arrow-circle-left' color='white' size={0.074*width}></FontAwesome5>
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold mx-auto font-poppins">
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
                  <Text className={`font-medium font-poppins ${
                    selectedCategory === category.id 
                      ? 'text-white' 
                      : 'text-white'
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
          <Text className="text-black font-poppins text-base font-semibold mb-4">
            Results
          </Text>

          {/* Food Grid */}
          <View className="flex-row flex-wrap justify-between">
            {currentFoods.map((food) => {
              const calories = estimateCalories(food);
              const mainNutrition = getMainNutrition(food);
              
              return (
                <TouchableOpacity
                  key={food.id}
                  className="w-[48%] bg-pink-medium rounded-2xl p-4 mb-4"
                  onPress={() => handleFoodPress(food.id)}
                >
                  {/* Food Image Placeholder */}
                  <View className="w-full h-24 bg-pink-semi-low rounded-xl mb-3 items-center justify-center overflow-hidden">
                    <Text className="text-4xl">🍲</Text>
                  </View>

                  {/* Food Info */}
                  <Text className="text-white font-semibold text-sm mb-2 text-center mx-auto w-3/4" numberOfLines={2}>
                    {food.foodName}
                  </Text>
                  
                  <View className="border-t border-white/20 pt-2">
                    <View className="flex-row justify-between">   
                      <Text className="text-white text-xs">Kalori</Text>
                      <Text className="text-white text-xs font-medium">{calories} Cal</Text>
                    </View>
                    
                    {/* Nutrition info */}
                    <View className="flex-row justify-between mt-1">
                      <Text className="text-white text-xs capitalize">
                        {mainNutrition.name.replace('_', ' ')}
                      </Text>
                      <Text className="text-white text-xs font-medium">
                        {mainNutrition.value} {mainNutrition.name.includes('kalori') ? 'Cal' : 'g'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
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