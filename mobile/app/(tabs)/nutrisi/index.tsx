import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Platform, Image, ActivityIndicator, Alert,Dimensions, RefreshControl} from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Header from '../../components/Header';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { extractApiData } from '../../../utils/apiHelpers';
import { NutritionalNeeds, DailyNutritionSummary } from '../../../types';
import { AntDesign,Entypo } from '@expo/vector-icons';

interface NutritionItem {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface MealType {
  name: string;
  calories: number;
  category: 'Sarapan' | 'Makan Siang' | 'Makan Malam' | 'Cemilan';
  routeParam: string; 
}

const NutritionDashboard = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [waterLoading, setWaterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  
  // Nutrition data states
  const [nutritionData, setNutritionData] = useState<NutritionItem[]>([]);
  const [waterIntake, setWaterIntake] = useState({ current: 0, target: 2000 });
  const [mealTypes, setMealTypes] = useState<MealType[]>([
    { name: 'Sarapan', calories: 0, category: 'Sarapan', routeParam: 'breakfast' },
    { name: 'Makan Siang', calories: 0, category: 'Makan Siang', routeParam: 'lunch' },
    { name: 'Makan Malam', calories: 0, category: 'Makan Malam', routeParam: 'dinner' },
    { name: 'Cemilan Pagi', calories: 0, category: 'Cemilan', routeParam: 'snack' },
    { name: 'Cemilan Sore', calories: 0, category: 'Cemilan', routeParam: 'snack' }
  ]);

  useEffect(() => {
    if (user?.id) {
      fetchNutritionData();
    }
  }, [user, selectedDate]);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNutritionData();
    setRefreshing(false);
  };

  const fetchNutritionData = async () => {
    try {
      setLoading(true);
      const dateString = selectedDate.toISOString().split('T')[0];

      // Fetch data berdasarkan tanggal yang dipilih
      const [needsResponse, summaryResponse, mealsResponse] = await Promise.all([
        apiService.getNutritionalNeeds(user!.id),
        apiService.getNutritionSummary(user!.id, dateString),
        apiService.getUserMeals(user!.id, dateString)
      ]);

      const needs = extractApiData<NutritionalNeeds>(needsResponse);
      const summary = extractApiData<DailyNutritionSummary>(summaryResponse);
      const meals = extractApiData(mealsResponse) || [];

      if (needs) {
        // Map nutrition data dengan data real dari API
        const mappedNutrition: NutritionItem[] = [
          {
            name: 'Asam Folat',
            current: summary?.totalFolicAcid || 0,
            target: needs.folicAcidNeeds,
            unit: 'mcg',
            color: '#22C55E'
          },
          {
            name: 'Zat Besi',
            current: summary?.totalIron || 0,
            target: needs.ironNeeds,
            unit: 'mg',
            color: '#87533C'
          },
          {
            name: 'Kalsium',
            current: summary?.totalCalcium || 0,
            target: needs.calciumNeeds,
            unit: 'mg',
            color: '#8851B2'
          },
          {
            name: 'Vitamin D',
            current: summary?.totalVitaminD || 0,
            target: needs.vitaminDNeeds,
            unit: 'IU',
            color: '#E36811'
          }
        ];

        setNutritionData(mappedNutrition);

        // Update water intake
        setWaterIntake({
          current: summary?.totalWaterMl || 0,
          target: needs.waterNeedsMl
        });

        // Calculate calories per meal category dengan data real
        const updatedMealTypes = mealTypes.map(meal => {
          const categoryMeals = meals.filter((m: any) => 
            m.mealCategory === meal.category || m.mealType === meal.category
          );
          
          // Calculate total calories for this meal category
          const totalCalories = categoryMeals.reduce((sum: number, m: any) => {
            return sum + ((m.food?.calories || 0) * (m.portion || 1));
          }, 0);
          
          return {
            ...meal,
            calories: totalCalories
          };
        });

        setMealTypes(updatedMealTypes);
      }
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      Alert.alert('Error', 'Gagal memuat data nutrisi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWater = async () => {
    try {
      setWaterLoading(true);
      
      const waterData = {
        amountMl: 250, 
      };

      const response = await apiService.addWaterIntake(user!.id, waterData);
      
      if (response.success) {
        setWaterIntake(prev => ({
          ...prev,
          current: prev.current + 250
        }));
        // Refresh data untuk update yang akurat
        await fetchNutritionData();
      } else {
        Alert.alert('Error', response.message || 'Gagal menambahkan konsumsi air');
      }
    } catch (error) {
      console.error('Error adding water:', error);
      Alert.alert('Error', 'Gagal menambahkan konsumsi air');
    } finally {
      setWaterLoading(false);
    }
  };


  const navigateToAddFood = (mealType: string) => {
    router.push(`/nutrisi/add?mealType=${mealType}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setSelectedDate(selectedDate);
      if (Platform.OS === 'ios') {
        // iOS handling if needed
      }
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatValue = (value: number): string => {
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  const getWaterGlasses = (ml: number) => {
    return Math.floor(ml / 250); // 1 gelas = 250ml
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#FF9EBD', '#F2789F']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ flex: 1 }}
      >
        <Header 

        />
        <View className="flex-1 bg-pink-low rounded-t-2xl items-center justify-center">
          <ActivityIndicator size="large" color="#F2789F" />
          <Text className="text-gray-600 mt-4">Memuat data nutrisi...</Text>
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
      <Header 

      />
      <ScrollView className='bg-pink-low rounded-t-2xl'
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#F2789F']}
          />
        }
      >
        
        <View className='flex-row justify-end mt-2 mb-2'>
          <Text className='text-sm p-2 mr-4 text-black-3 font-poppins font-semibold'>
            {formatDate(selectedDate)}
          </Text>
          <TouchableOpacity 
            className='rounded-full bg-pink-medium mr-4 p-2' 
            onPress={() => setShowDatePicker(true)}
          >
            <Text className='text-white text-sm font-poppins'>Pilih Tanggal</Text>
          </TouchableOpacity>
        </View>

        {/* Water Intake */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-semi-medium rounded-2xl p-4 border-l-8 border-pink-medium">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image source={require('../../../assets/images/water.png')} />
                <View>
                  <Text className="text-gray-800 text-xl font-bold font-poppins">
                    {waterIntake.current} / {waterIntake.target} ml
                  </Text>
                  <Text className="text-gray-600 font-poppins">
                    {waterIntake.current}ml air ({getWaterGlasses(waterIntake.current)} Gelas)
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                className="bg-white px-4 py-2 rounded-full"
                onPress={handleAddWater}
                disabled={waterLoading}
              >
                {waterLoading ? (
                  <ActivityIndicator size="small" color="#666" />
                ) : (
                  <Text className="text-gray-700 font-medium font-poppins">minum</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Nutrition Info */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-semi-medium rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-black-medium text-lg font-semibold font-poppins">Info Nutrisi</Text>
              <TouchableOpacity onPress={() => router.push('/nutrisi/detail')}>
                {/* <Text className="text-gray-600 text-2xl">›</Text> */}
                <Entypo name='chevron-small-right' size={width*0.08}> </Entypo>
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {nutritionData.map((item, index) => (
                <View key={index} className="w-[48%] items-center mb-4">
                  <Text className="text-gray-800 font-bold mb-2 font-poppins">{item.name}</Text>
                  
                  <View className="relative items-center justify-center">
                    <CircularProgress
                      size={120}
                      width={10}
                      fill={getProgressPercentage(item.current, item.target)}
                      tintColor={item.color}
                      backgroundColor="#FFE3EC"
                      rotation={0}
                      lineCap="round"
                    />
                    <View className="absolute items-center">
                      <Text className="text-gray-800 font-bold text-lg font-poppins">
                        {formatValue(item.current)}
                      </Text>
                      <Text className="text-gray-600 text-xs font-poppins">
                        dari {formatValue(item.target)} {item.unit}
                      </Text>
                      <Text className="text-gray-600 text-xs font-poppins">kebutuhan</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              className="bg-white rounded-full py-3 mt-4"
              onPress={() => router.push('/nutrisi/recommendation')}
            >
              <Text className="text-center text-gray-700 font-medium font-poppins">
                Rekomendasi Makanan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Food Log */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-semi-medium rounded-2xl p-4">
            <Text className="text-gray-800 text-lg font-semibold mb-4 font-poppins">
              Catatan Makanan
            </Text>

            {mealTypes.map((meal, index) => (
              <View key={index} className="flex-row items-center justify-between py-3 border-b-[1px] border-pink-medium ">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-pink-medium rounded-full items-center justify-center mr-3">
                    <Text className="text-black text-xs font-medium font-poppins">{meal.calories}</Text>
                    <Text className="text-black text-xs  font-poppins">Cal</Text>
                  </View>
                  <Text className="text-gray-800 font-medium font-poppins">{meal.name}</Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => navigateToAddFood(meal.routeParam)}
                >           
        
                  <AntDesign  name='plus' size={width*0.074} color="white"/>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />

        {/* Date Picker Modal */}
        {showDatePicker && (
          <>
            {Platform.OS === 'ios' ? (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View className="flex-1 justify-end bg-black/50">
                  <View className="bg-white rounded-t-2xl p-4">
                    <View className="flex-row justify-between items-center mb-4">
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        className="px-4 py-2"
                      >
                        <Text className="text-pink-500 font-medium">Batal</Text>
                      </TouchableOpacity>
                      <Text className="text-lg font-semibold text-gray-1">
                        Pilih Tanggal
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        className="px-4 py-2"
                      >
                        <Text className="text-pink-500 font-medium">Selesai</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={onDateChange}
                    />
                  </View>
                </View>
              </Modal>
            ) : (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="calendar"
                onChange={onDateChange}
              />
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default NutritionDashboard;