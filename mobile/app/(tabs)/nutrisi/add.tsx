import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { FoodItem } from '../../../types';

const AddFood = () => {
  // Ambil meal type dari parameter URL
  const { mealType } = useLocalSearchParams();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [allFoods, setAllFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingFood, setAddingFood] = useState<number | null>(null);

  // Function untuk mendapatkan nama meal type dalam bahasa Indonesia
  const getMealTypeName = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Sarapan';
      case 'lunch': return 'Makan Siang';
      case 'dinner': return 'Makan Malam';
      case 'snack': return 'Cemilan';
      default: return 'Makanan';
    }
  };

  // Function untuk mendapatkan meal type dalam format API
  const getMealTypeForAPI = (type: string): 'Sarapan' | 'Makan Siang' | 'Makan Malam' | 'Cemilan' => {
    switch (type) {
      case 'breakfast': return 'Sarapan';
      case 'lunch': return 'Makan Siang';
      case 'dinner': return 'Makan Malam';
      case 'snack': return 'Cemilan';
      default: return 'Sarapan';
    }
  };

  // Load semua makanan dari API saat component mount
  useEffect(() => {
    loadAllFoods();
  }, []);

  const loadAllFoods = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllFood();
      
      if (response.success && response.data) {
        // ✅ Fix: Type guard to ensure data is valid
        const validFoods = response.data.filter(food => 
          food && food.id && food.foodName && typeof food.foodName === 'string'
        );
        
        setAllFoods(validFoods);
        setSearchResults(validFoods);
      } else {
        Alert.alert('Error', 'Gagal memuat data makanan');
      }
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter results based on search query - FIX: use foodName instead of name
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(allFoods);
    } else {
      const filtered = allFoods.filter(food =>
        food.foodName.toLowerCase().includes(searchQuery.toLowerCase())  // ✅ Fix: foodName bukan name
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, allFoods]);

  const handleAddFood = async (food: FoodItem) => {
    if (!user) {
      Alert.alert('Error', 'User tidak ditemukan');
      return;
    }

    try {
      setAddingFood(food.id);
      
      // ✅ Fix: Remove 'portion' field karena tidak ada di AddMealRequest
      const mealData = {
        foodId: food.id,
        mealCategory: getMealTypeForAPI(mealType as string),
        consumptionDate: new Date().toISOString().split('T')[0]
      };

      const response = await apiService.addMeal(user.id, mealData);

      if (response.success) {
        Alert.alert(
          'Berhasil!', 
          `${food.foodName} berhasil ditambahkan ke ${getMealTypeName(mealType as string)}`,  // ✅ Fix: foodName bukan name
          [
            {
              text: 'OK',
              onPress: () => router.push('/nutrisi')
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Gagal menambahkan makanan');
      }
    } catch (error) {
      console.error('Error adding meal:', error);
      Alert.alert('Error', `Terjadi kesalahan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setAddingFood(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(allFoods);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#FF9EBD', '#F2789F']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white mt-4">Memuat data makanan...</Text>
        </View>
      </LinearGradient>
    );
  }
  
  const width = Dimensions.get('window').width;

  return (
    <LinearGradient
      colors={['#FF9EBD', '#F2789F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-6">
        <TouchableOpacity onPress={() => router.push('/nutrisi')}>
          <FontAwesome5 name='arrow-circle-left' color='white' size={0.074*width} />  {/* ✅ Fix: self-closing */}
        </TouchableOpacity>
  
        <Text className="text-white mx-auto text-xl font-semibold font-poppins">
          Tambah Makanan
        </Text>
      </View>

      <ScrollView 
        className="bg-pink-low rounded-3xl"
      >
        {/* Meal Type Indicator */}
        <View className="px-4 pt-4">
          <View className="bg-pink-medium/20 rounded-lg px-3 py-2 self-start">
            <Text className="text-pink-hard font-medium font-poppins">
              Menambah ke {getMealTypeName(mealType as string)}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-6">
          <View className="flex-row items-center bg-white rounded-2xl px-4 py-3">
            <Image 
              source={require('../../../assets/images/search.png')}
              className="w-5 h-5 mr-3"
              resizeMode="contain"
            />
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder="Cari makanan"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Image 
                  source={require('../../../assets/images/close.png')}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results / Food List */}
        {searchResults.length > 0 && (
          <View className="px-4">
            {searchResults.map((food) => {
              // ✅ Skip invalid items
              if (!food || !food.id || !food.foodName) return null;
              
              return (
                <TouchableOpacity
                  key={food.id}
                  className="bg-pink-medium rounded-2xl p-4 mb-3 flex-row items-center"
                  onPress={() => handleAddFood(food)}
                  disabled={addingFood === food.id}
                  style={{ opacity: addingFood === food.id ? 0.7 : 1 }}
                >
                  <View className="mr-3">
                    <AntDesign name='plus' size={width*0.074} color="white" />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-white text-sm font-semibold mb-1 font-poppins">
                      {String(food.foodName || 'Nama tidak tersedia')}
                    </Text>
                    <Text className="text-white text-sm opacity-90 font-poppins">
                      Protein: {String(food.protein || 0)}g | Lemak: {String(food.fat || 0)}g
                    </Text>
                    <Text className="text-white text-xs opacity-75 mt-1 font-poppins">
                      Besi: {String(food.iron || 0)}mg | Kalsium: {String(food.calcium || 0)}mg
                    </Text>
                    {food.description && (
                      <Text className="text-white text-xs opacity-75 mt-1 font-poppins">
                        {String(food.description)}
                      </Text>
                    )}
                  </View>

                  <View className="bg-white/20 rounded-full px-3 py-1">
                    <Text className="text-white text-xs font-poppins">
                      {String(food.priceCategory || 'Standar')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* No Results State */}
        {searchQuery.length > 0 && searchResults.length === 0 && (
          <View className="px-4 py-12 items-center">
            <Text className="text-gray-500 text-base text-center font-poppins">
              Tidak ada makanan yang ditemukan untuk &quot;{searchQuery}&quot;
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2 font-poppins">
              Coba kata kunci lain atau input makanan custom
            </Text>
          </View>
        )}

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default AddFood;