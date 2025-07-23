import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { extractApiData } from '../../../utils/apiHelpers';
import { NutritionalNeeds, DailyNutritionSummary } from '../../../types';

interface DetailNutritionItem {
  name: string;
  current: number;
  target: number;
  unit: string;
  percentage: number;
  color: string;
}

const DetailNutrisi = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nutritionData, setNutritionData] = useState<DetailNutritionItem[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchNutritionDetail();
    }
  }, [user, selectedDate]);

  const fetchNutritionDetail = async () => {
    try {
      setLoading(true);
      const dateString = selectedDate.toISOString().split('T')[0];

      // Fetch nutrition data dari API
      const [needsResponse, summaryResponse] = await Promise.all([
        apiService.getNutritionalNeeds(user!.id),
        apiService.getNutritionSummary(user!.id, dateString)
      ]);

      const needs = extractApiData<NutritionalNeeds>(needsResponse);
      const summary = extractApiData<DailyNutritionSummary>(summaryResponse);

      if (needs) {
        // Map semua nutrition data yang tersedia
        const mappedNutrition: DetailNutritionItem[] = [
          {
            name: 'Protein',
            current: summary?.totalProtein || 0,
            target: needs.proteinNeeds,
            unit: 'g',
            percentage: Math.min(((summary?.totalProtein || 0) / needs.proteinNeeds) * 100, 100),
            color: '#3B82F6'
          },
          {
            name: 'Asam Folat',
            current: summary?.totalFolicAcid || 0,
            target: needs.folicAcidNeeds,
            unit: 'mcg',
            percentage: Math.min(((summary?.totalFolicAcid || 0) / needs.folicAcidNeeds) * 100, 100),
            color: '#22C55E'
          },
          {
            name: 'Zat Besi',
            current: summary?.totalIron || 0,
            target: needs.ironNeeds,
            unit: 'mg',
            percentage: Math.min(((summary?.totalIron || 0) / needs.ironNeeds) * 100, 100),
            color: '#87533C'
          },
          {
            name: 'Kalsium',
            current: summary?.totalCalcium || 0,
            target: needs.calciumNeeds,
            unit: 'mg',
            percentage: Math.min(((summary?.totalCalcium || 0) / needs.calciumNeeds) * 100, 100),
            color: '#8851B2'
          },
          {
            name: 'Vitamin D',
            current: summary?.totalVitaminD || 0,
            target: needs.vitaminDNeeds,
            unit: 'IU',
            percentage: Math.min(((summary?.totalVitaminD || 0) / needs.vitaminDNeeds) * 100, 100),
            color: '#E36811'
          },
          {
            name: 'Omega 3',
            current: summary?.totalOmega3 || 0,
            target: needs.omega3Needs,
            unit: 'mg',
            percentage: Math.min(((summary?.totalOmega3 || 0) / needs.omega3Needs) * 100, 100),
            color: '#06B6D4'
          },
          {
            name: 'Serat',
            current: summary?.totalFiber || 0,
            target: needs.fiberNeeds,
            unit: 'g',
            percentage: Math.min(((summary?.totalFiber || 0) / needs.fiberNeeds) * 100, 100),
            color: '#65A30D'
          },
          {
            name: 'Yodium',
            current: summary?.totalIodine || 0,
            target: needs.iodineNeeds,
            unit: 'mcg',
            percentage: Math.min(((summary?.totalIodine || 0) / needs.iodineNeeds) * 100, 100),
            color: '#7C3AED'
          },
          {
            name: 'Lemak',
            current: summary?.totalFat || 0,
            target: needs.fatNeeds,
            unit: 'g',
            percentage: Math.min(((summary?.totalFat || 0) / needs.fatNeeds) * 100, 100),
            color: '#DC2626'
          },
          {
            name: 'Vitamin B',
            current: summary?.totalVitaminB || 0,
            target: needs.vitaminBNeeds,
            unit: 'mg',
            percentage: Math.min(((summary?.totalVitaminB || 0) / needs.vitaminBNeeds) * 100, 100),
            color: '#F59E0B'
          },
          {
            name: 'Air',
            current: summary?.totalWaterMl || 0,
            target: needs.waterNeedsMl,
            unit: 'ml',
            percentage: Math.min(((summary?.totalWaterMl || 0) / needs.waterNeedsMl) * 100, 100),
            color: '#0EA5E9'
          }
        ];

        setNutritionData(mappedNutrition);
      }
    } catch (error) {
      console.error('Error fetching nutrition detail:', error);
      Alert.alert('Error', 'Gagal memuat detail nutrisi');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNutritionDetail();
    setRefreshing(false);
  };

  const formatValue = (value: number): string => {
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
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
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white mt-4 font-poppins">Memuat detail nutrisi...</Text>
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
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <FontAwesome5 name='arrow-circle-left' color='white' size={0.06*width} />
          </TouchableOpacity>
          
          <View className="items-center">
            <Text className="text-white text-xl font-semibold font-poppins">
              Detail Nutrisi
            </Text>
            <Text className="text-white/80 text-sm font-poppins">
              {formatDate(selectedDate)}
            </Text>
          </View>
          
          <View className="w-10 h-10" />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 bg-pink-low rounded-t-3xl"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#F2789F']}
          />
        }
      >
        <View className="px-4 py-6">
          {/* Summary info */}
          <View className="bg-pink-semi-medium rounded-2xl p-4 mb-6">
            <Text className="text-black-medium text-lg font-semibold mb-2 font-poppins">
              Ringkasan Kebutuhan Harian
            </Text>
            <Text className="text-gray-600 text-sm font-poppins">
              Berdasarkan trimester kehamilan Anda. Tarik ke bawah untuk memperbarui data.
            </Text>
          </View>

          {/* Nutrition Details */}
          {nutritionData.map((item, index) => (
            <View key={index} className="mb-4">
              <View className="bg-pink-semi-medium rounded-2xl p-4">
                {/* Header with name and value */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-black-medium text-lg font-semibold font-poppins">
                    {item.name}
                  </Text>
                  <Text className="text-black-medium text-lg font-semibold font-poppins">
                    {formatValue(item.current)} / {formatValue(item.target)} {item.unit}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="mb-3">
                  <View className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    {/* Filled portion */}
                    <View 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </View>
                </View>

                {/* Progress indicator and status */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600 text-sm font-poppins">
                    {formatValue(item.percentage)}% terpenuhi
                  </Text>
                  <View className={`px-2 py-1 rounded-full ${
                    item.percentage >= 100 ? 'bg-green-100' : 
                    item.percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <Text className={`text-xs font-medium font-poppins ${
                      item.percentage >= 100 ? 'text-green-600' : 
                      item.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.percentage >= 100 ? 'Tercukupi' : 
                       item.percentage >= 50 ? 'Cukup' : 'Kurang'}
                    </Text>
                  </View>
                </View>

                {/* Additional info for critical nutrients */}
                {/* {(item.name === 'Asam Folat' || item.name === 'Zat Besi' || item.name === 'Kalsium') && item.percentage < 80 && (
                  <View className="mt-2 p-2 bg-orange-50 rounded-lg">
                    <Text className="text-orange-600 text-xs font-poppins">
                      💡 {item.name} sangat penting untuk perkembangan janin. Konsultasikan dengan dokter jika asupan kurang.
                    </Text>
                  </View>
                )} */}
              </View>
            </View>
          ))}

          {/* Action button */}
          <TouchableOpacity 
            className="bg-pink-medium rounded-2xl p-4 mb-6"
            onPress={() => router.push('/nutrisi/recommendation')}
          >
            <Text className="text-white text-center font-semibold font-poppins">
              Lihat Rekomendasi Makanan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default DetailNutrisi;