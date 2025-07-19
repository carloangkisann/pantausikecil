import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { apiService } from '../../../services/api';
import { extractApiData } from '../../../utils/apiHelpers';
import { FoodItem } from '../../../types';
import { FontAwesome5 } from '@expo/vector-icons';

const FoodDetail = () => {
  const { foodId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [food, setFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    if (foodId) {
      fetchFoodDetail();
    }
  }, [foodId]);

  const fetchFoodDetail = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFoodDetails(Number(foodId));
      const foodData = extractApiData<FoodItem>(response);
      
      if (foodData) {
        setFood(foodData);
      } else {
        Alert.alert('Error', 'Makanan tidak ditemukan');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching food detail:', error);
      Alert.alert('Error', 'Gagal memuat detail makanan');
      router.back();
    } finally {
      setLoading(false);
    }
  };



  // Helper function untuk unit nutrisi
  const getUnit = (nutrient: string) => {
    switch (nutrient) {
      case 'protein':
      case 'fat':
      case 'fiber':
      case 'omega3':
        return 'g';
      case 'folicAcid':
        return 'mcg';
      case 'iron':
      case 'calcium':
        return 'mg';
      case 'vitaminD':
        return 'IU';
      case 'iodine':
        return 'mcg';
      case 'vitaminB':
        return 'mg';
      default:
        return 'g';
    }
  };

  const formatNutrientName = (key: string) => {
    const names: { [key: string]: string } = {
      protein: 'Protein',
      folicAcid: 'Folat',
      iron: 'Zat Besi',
      calcium: 'Kalsium',
      vitaminD: 'Vitamin D',
      omega3: 'Omega 3',
      fiber: 'Serat',
      fat: 'Lemak',
      vitaminB: 'Vitamin B'
    };
    return names[key] || key;
  };

  // Estimasi kalori
  const estimateCalories = (food: FoodItem) => {
    return Math.round((food.protein * 4) + (food.fat * 9) + 100);
  };

  // Dapatkan nutrisi untuk ditampilkan
  const getNutritionEntries = (food: FoodItem) => {
    const nutritionKeys = ['protein', 'folicAcid', 'iron', 'calcium'];
    const calories = estimateCalories(food);
    
    const entries = [
      { key: 'kalori', name: 'Kalori', value: calories, unit: 'kcal' }
    ];
    
    nutritionKeys.forEach(key => {
      const value = food[key as keyof FoodItem] as number;
      if (value > 0) {
        entries.push({
          key,
          name: formatNutrientName(key),
          value,
          unit: getUnit(key)
        });
      }
    });
    
    return entries;
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
            Detail Makanan
          </Text>
        </View>

        <View className="flex-1 bg-pink-low rounded-t-2xl items-center justify-center">
          <ActivityIndicator size="large" color="#F2789F" />
          <Text className="text-gray-600 mt-4">Memuat detail makanan...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!food) {
    return (
      <LinearGradient
        colors={['#FF9EBD', '#F2789F']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ flex: 1 }}
      >
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Makanan tidak ditemukan</Text>
        </View>
      </LinearGradient>
    );
  }

  const nutritionEntries = getNutritionEntries(food);

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
        <Text className="text-white text-xl font-semibold ml-4" numberOfLines={1}>
          {food.foodName}
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
        <View className="mt-4 mb-6">
          <View className="w-full h-48 bg-pink-medium rounded-2xl overflow-hidden items-center justify-center mx-4" style={{ width: '92%' }}>
            <Text className="text-8xl">🥣</Text>
          </View>
        </View>

        {/* Description Section */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-medium rounded-2xl p-4">
            <Text className="text-white text-base font-semibold mb-3">
              Deskripsi
            </Text>
            <Text className="text-white text-sm leading-6">
              {food.description || `${food.foodName} adalah makanan bergizi yang baik untuk ibu hamil dengan kandungan nutrisi penting untuk mendukung perkembangan janin yang sehat.`}
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
              {nutritionEntries.map((nutrient) => (
                <View key={nutrient.key} className="flex-row items-center">
                  <View className="w-1 h-1 bg-white rounded-full mr-3" />
                  <Text className="text-white text-sm flex-1">
                    <Text className="font-medium capitalize">
                      {nutrient.name}:
                    </Text>
                    <Text className="font-normal"> {nutrient.value} {nutrient.unit}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Tips Section */}
        {food.tips && (
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
                {food.tips}
              </Text>
            </View>
          </View>
        )}


        {/* Bottom Navigation Spacer */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default FoodDetail;