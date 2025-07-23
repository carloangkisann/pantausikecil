import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { extractApiData, extractApiArrayData } from '../../../utils/apiHelpers';
import Header from '../../components/Header';
import { UserActivitySummary, PregnancyData } from '../../../types';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

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

  const calculatePregnancyDays = (startDate: string): number => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const getTotalCaloriesToday = (): number => {
    if (!todayActivities?.activities) return 0;
    
    return todayActivities.activities.reduce((total, activity) => {
      return total + (activity.totalCalories || 0);
    }, 0);
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
          <Text className="text-white mt-4 font-poppins">Memuat data aktivitas...</Text>
        </View>
      </LinearGradient>
    );
  }

  const dayNumber = pregnancyData ? calculatePregnancyDays(pregnancyData.startDate) : 1;
  const totalMinutes = todayActivities?.totalDurationMinutes || 0;
  const totalActivities = todayActivities?.activities.length || 0;
  const totalCaloriesToday = getTotalCaloriesToday();
  const width = Dimensions.get('window').width;

  return (
    <LinearGradient
        colors={['#F99AB6', '#F278A0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
    >
      <Header />

      <ScrollView 
        className="bg-pink-low rounded-t-3xl"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Day Info */}
        <View className="px-4 py-6 items-center">
          <View className="bg-pink-medium rounded-full px-6 py-3">
            <Text className="text-white text-base font-semibold font-poppins">
              Hari ke-{dayNumber} Kehamilan
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between">
            <View className="bg-white rounded-2xl p-4 flex-1 mr-2 items-center">
              <Text className="text-pink-medium text-2xl font-bold font-poppins">
                {totalMinutes}
              </Text>
              <Text className="text-pink-medium font-poppins text-sm ">
                Menit
              </Text>
            </View>
            
            <View className="bg-white rounded-2xl p-4 flex-1 mx-1 items-center">
              <Text className="text-pink-medium text-2xl font-bold">
                {totalActivities}
              </Text>
              <Text className="text-pink-medium font-poppins text-sm">
                Aktivitas
              </Text>
            </View>
            
            <View className="bg-white rounded-2xl p-4 flex-1 ml-2 items-center">
              <Text className="text-pink-medium text-2xl font-bold">
                {totalCaloriesToday}
              </Text>
              <Text className="text-pink-medium font-poppins text-sm">
                Kalori
              </Text>
            </View>
          </View>
        </View>

        {/* Aktivitas Hari Ini Section */}
        <View className="px-4 mb-6">
          <View className="bg-pink-semi-medium rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-semibold font-poppins">
                Aktivitas Hari Ini
              </Text>
              <TouchableOpacity onPress={() => router.push('/aktivitas/add')}>
                <AntDesign name='plus' size={width*0.074} color="white"/>
              </TouchableOpacity>
            </View> 

            {/* Activity List */}
            {todayActivities && todayActivities.activities.length > 0 ? (
              todayActivities.activities.map((activity, index) => (
                <View key={activity.id} className="flex-row items-center mb-3 relative">
    
                  {/* <View className="w-3 h-3 rounded-full mr-4 z-10 bg-pink-medium" /> */}
                  
                  <View className="bg-pink-low rounded-2xl p-3 flex-1 flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-black-low text-base font-semibold mb-1 font-poppins">
                        {activity.activityName}
                      </Text>
                      <View className='flex flex-row w-1/2 justify-between '>
                              <Text className="text-black-low text-sm font-poppins">
                        {activity.durationMinutes} menit 
                      </Text>
                                 <Text className="text-black-low text-sm mb-1 font-poppins ">
                        {activity.totalCalories} Kalori
                      </Text>
                      </View>
                      {/* <Text className="text-black-low text-sm font-poppins">
                        {activity.durationMinutes} menit 
                      </Text> */}
                    </View>
                    
                    <View className="items-end">
                      <TouchableOpacity 
                        className="bg-pink-medium rounded-full px-3 py-1"
                        onPress={() => handleRemoveActivity(activity.id)}
                      >
                        <Text className="text-white text-xs font-poppins">
                          Hapus
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="bg-pink-low rounded-2xl p-6 items-center">
                <Text className="text-gray-1 text-base text-center mb-2 font-poppins">
                  Belum ada aktivitas hari ini
                </Text>
                <Text className="text-gray-1 text-sm text-center opacity-75 font-poppins">
                  Tambahkan aktivitas untuk mulai tracking
                </Text>
              </View>
            )}

            {/* Timeline line */}
            {/* {todayActivities && todayActivities.activities.length > 1 && (
              <View className="absolute left-1.5 top-16 bottom-4 w-0.5 bg-white opacity-30" />
            )} */}
          </View>
        </View>

        {/* Rekomendasi Aktivitas Button */}
        <View className="px-4 mb-8">
          <TouchableOpacity 
            className="bg-pink-medium rounded-2xl py-4 px-6"
            onPress={() => router.push('/aktivitas/rekomendasi')}
          >
            <Text className="text-white text-center text-lg font-semimedium font-poppins">
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