import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { extractApiData, extractApiArrayData } from '../../../utils/apiHelpers';
import Header from '../../components/Header';
import { UserActivitySummary, PregnancyData } from '../../../types';
import React, { useState } from 'react';


const AktivitasIndex = () => {
  const { user } = useAuth();
  const [todayActivities, setTodayActivities] = useState<UserActivitySummary | null>(null);
  const [pregnancyData, setPregnancyData] = useState<PregnancyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Run both API calls in parallel for faster loading
      const [activitiesResponse, pregnancyResponse] = await Promise.all([
        apiService.getTodayActivities(user.id),
        apiService.getUserPregnancies(user.id)
      ]);

  
      const activitiesData = extractApiData(activitiesResponse);
      setTodayActivities(activitiesData);

      const pregnancyArray = extractApiArrayData(pregnancyResponse);
      
      if (pregnancyArray.length > 0) {
        // Get the most recent pregnancy
        const activePregnancy = pregnancyArray.find(p => !p.endDate) || pregnancyArray[0];
        setPregnancyData(activePregnancy);
      } else {
        setPregnancyData(null);
      }

    } catch (error) {
      console.error('Error fetching activities data:', error);
      Alert.alert('Error', 'Gagal memuat data aktivitas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculatePregnancyWeek = (startDate: string): number => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, Math.ceil(diffDays / 7));
  };


  const calculateWeeklyTarget = (): string => {
    if (!todayActivities) return '0 / 7';

    const daysWithActivity = todayActivities.activities.length > 0 ? 1 : 0;
    return `${daysWithActivity} / 7`;
  };

  // Handle activity removal
  const handleRemoveActivity = async (activityId: number) => {
    if (!user?.id) return;

    try {
      const response = await apiService.removeActivity(user.id, activityId);
      if (response.success) {
        Alert.alert('Berhasil', 'Aktivitas berhasil dihapus');
        fetchData(); // Refresh data
      } else {
        Alert.alert('Error', response.message || 'Gagal menghapus aktivitas');
      }
    } catch (error) {
      console.error('Error removing activity:', error);
      Alert.alert('Error', 'Gagal menghapus aktivitas');
    }
  };




  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [user?.id])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#FF9EBD', '#F2789F']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ flex: 1 }}
      >
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white mt-4">Memuat data aktivitas...</Text>
        </View>
      </LinearGradient>
    );
  }

  const weekNumber = pregnancyData ? calculatePregnancyWeek(pregnancyData.startDate) : 1;
  const totalMinutes = todayActivities?.totalDurationMinutes || 0;
  const totalActivities = todayActivities?.activities.length || 0;
  const targetAchieved = calculateWeeklyTarget();

  return (
    <LinearGradient
      colors={['#FF9EBD', '#F2789F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      <Header />

      <ScrollView 
        className="bg-pink-low"
        style={{ 
          flex: 1, 
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Week Info */}
        <View className="px-4 py-6 items-center">
          <View className="bg-pink-medium rounded-full px-6 py-3">
            <Text className="text-white text-lg font-semibold">
              Minggu ke-{weekNumber} Kehamilan
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between">
            <View className="bg-white rounded-2xl p-4 flex-1 mr-2 items-center">
              <Text className="text-pink-medium text-2xl font-bold">
                {totalMinutes}
              </Text>
              <Text className="text-gray-1 text-sm">
                Menit
              </Text>
            </View>
            
            <View className="bg-white rounded-2xl p-4 flex-1 mx-1 items-center">
              <Text className="text-pink-medium text-2xl font-bold">
                {totalActivities}
              </Text>
              <Text className="text-gray-1 text-sm">
                Aktivitas
              </Text>
            </View>
            
            <View className="bg-white rounded-2xl p-4 flex-1 ml-2 items-center">
              <Text className="text-pink-medium text-2xl font-bold">
                {targetAchieved}
              </Text>
              <Text className="text-gray-1 text-sm">
                Target
              </Text>
            </View>
          </View>
        </View>

        {/* Aktivitas Hari Ini Section */}
        <View className="px-4 mb-6">
          <View className="bg-pink-semi-medium rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-semibold">
                Aktivitas Hari Ini
              </Text>
              <TouchableOpacity onPress={() => router.push('/aktivitas/add')}>
                <Image 
                  source={require('../../../assets/images/plus.png')}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Activity List */}
            {todayActivities && todayActivities.activities.length > 0 ? (
              todayActivities.activities.map((activity, index) => (
                <View key={activity.id} className="flex-row items-center mb-3 relative">
                  {/* Timeline dot */}
                  <View className="w-3 h-3 rounded-full mr-4 z-10 bg-pink-medium" />
                  
                  <View className="bg-pink-low rounded-2xl p-3 flex-1 flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-black-low text-base font-semibold mb-1">
                        {activity.activityName}
                      </Text>
                      <Text className="text-gray-1 text-sm">
                        {activity.durationMinutes} menit
                      </Text>
                    </View>
                    
                    <View className="items-end">
                      <Text className="text-gray-1 text-sm mb-1">
                        {activity.totalCalories} Kalori
                      </Text>
                      <TouchableOpacity 
                        className="bg-pink-medium rounded-full px-3 py-1"
                        onPress={() => handleRemoveActivity(activity.id)}
                      >
                        <Text className="text-white text-xs">
                          Hapus
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="bg-pink-low rounded-2xl p-6 items-center">
                <Text className="text-gray-1 text-base text-center mb-2">
                  Belum ada aktivitas hari ini
                </Text>
                <Text className="text-gray-1 text-sm text-center opacity-75">
                  Tambahkan aktivitas untuk mulai tracking
                </Text>
              </View>
            )}

            {/* Timeline line */}
            {todayActivities && todayActivities.activities.length > 1 && (
              <View className="absolute left-1.5 top-16 bottom-4 w-0.5 bg-white opacity-30" />
            )}
          </View>
        </View>

        {/* Rekomendasi Aktivitas Button */}
        <View className="px-4 mb-8">
          <TouchableOpacity 
            className="bg-pink-medium rounded-2xl py-4 px-6"
            onPress={() => router.push('/aktivitas/rekomendasi')}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Rekomendasi Aktivitas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default AktivitasIndex;