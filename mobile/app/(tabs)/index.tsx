import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, Dimensions, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { CircularProgress } from 'react-native-circular-progress';
import Header from '../components/Header';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { extractApiData } from '../../utils/apiHelpers';
import { UserReminder } from '../../types';

// State untuk menyimpan dashboard data dari API
interface DashboardApiData {
  pregnancyInfo?: {
    trimester: number;
    week: number;
    trimesterName: string;
    startDate: string;
  };
  nutritionalNeeds?: any;
  todayNutrition: any;
  todayActivity: any;
  upcomingReminders: UserReminder[];
}

interface DashboardData {
  nutritionProgress: number;
  waterProgress: number;
  todayActivities: {
    totalMinutes: number;
    totalActivities: number;
    activities: string[];
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  
  // States
  const [dashboardApiData, setDashboardApiData] = useState<DashboardApiData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [upcomingReminders, setUpcomingReminders] = useState<UserReminder[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Update date every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Auto-refresh dashboard when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchDashboardData();
      }
    }, [user])
  );

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ Use dedicated dashboard API - single call untuk semua data
      const dashboardResponse = await apiService.getDashboardData(user!.id);
      const apiData = extractApiData(dashboardResponse);

      if (apiData) {
        // Store dashboard API data
        setDashboardApiData(apiData);

        // Set upcoming reminders - ambil semua, bukan cuma yang pertama
        setUpcomingReminders(apiData.upcomingReminders || []);

        // Calculate progress dari dashboard data
        if (apiData.nutritionalNeeds && apiData.todayNutrition) {
          const nutritionNeeds = apiData.nutritionalNeeds;
          const todayNutrition = apiData.todayNutrition;

          // Water progress
          const waterProgress = Math.min(
            (todayNutrition.totalWaterMl / nutritionNeeds.waterNeedsMl) * 100, 
            100
          );

          // Overall nutrition progress (average of key nutrients)
          const keyNutrients = [
            (todayNutrition.totalProtein / nutritionNeeds.proteinNeeds) * 100,
            (todayNutrition.totalFolicAcid / nutritionNeeds.folicAcidNeeds) * 100,
            (todayNutrition.totalIron / nutritionNeeds.ironNeeds) * 100,
            (todayNutrition.totalCalcium / nutritionNeeds.calciumNeeds) * 100
          ];
          const nutritionProgress = Math.min(
            keyNutrients.reduce((sum, val) => sum + val, 0) / keyNutrients.length,
            100
          );

          // Activity data
          const todayActivities = {
            totalMinutes: apiData.todayActivity?.totalDurationMinutes || 0,
            totalActivities: apiData.todayActivity?.activities?.length || 0,
            activities: apiData.todayActivity?.activities?.slice(0, 3).map((activity: any) => activity.activityName) || []
          };

          setDashboardData({
            nutritionProgress: Math.round(nutritionProgress),
            waterProgress: Math.round(waterProgress),
            todayActivities
          });
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const formatDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatReminderDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getWeekOfPregnancy = (pregnancyInfo?: any) => {
    if (pregnancyInfo?.week) {
      return pregnancyInfo.week;
    }
    // Fallback calculation if week not provided
    if (pregnancyInfo?.startDate) {
      const start = new Date(pregnancyInfo.startDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      return Math.min(diffWeeks, 40);
    }
    return 1;
  };

  const getTrimesterName = (pregnancyInfo?: any) => {
    if (pregnancyInfo?.trimesterName) {
      return pregnancyInfo.trimesterName;
    }
    if (pregnancyInfo?.trimester) {
      const trimesterNames = ['', 'Pertama', 'Kedua', 'Ketiga'];
      return `Trimester ${trimesterNames[pregnancyInfo.trimester] || pregnancyInfo.trimester}`;
    }
    return 'Trimester Pertama';
  };

  const getPregnancyNumber = (pregnancyNumber: number) => {
    const numbers = ['', 'Pertama', 'Kedua', 'Ketiga', 'Keempat', 'Kelima'];
    return numbers[pregnancyNumber] || `Ke-${pregnancyNumber}`;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-pink-medium">
        <StatusBar barStyle="light-content" backgroundColor="#F789AC" />
        <Header />
        <View className="flex-1 bg-pink-low rounded-3xl justify-center items-center">
          <ActivityIndicator size="large" color="#F2789F" />
          <Text className="text-gray-600 mt-4 font-poppins">Memuat dashboard...</Text>
        </View>
      </View>
    );
  }

  const width = Dimensions.get('window').width;

  return (
    <View className="flex-1 bg-pink-medium">
      <StatusBar barStyle="light-content" backgroundColor="#F789AC" />
      
      {/* Header */}
      <Header />
      
      {/* Content */}
      <View className="flex-1 bg-pink-low rounded-3xl">
        <ScrollView 
          className="flex-1 px-6 py-4" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#F2789F']}
            />
          }
        >
        
          {/* Insight Banner */}
          <View className="flex-row items-center mb-4">
            <LinearGradient
              colors={['#F9C5D5', '#F2789F']} 
              start={{x: 0.5, y: 0}} 
              end={{x: 0.5, y: 1}}   
              locations={[0.0033, 0.8923]} 
              style={{borderTopRightRadius:20,borderTopLeftRadius:20,borderBottomLeftRadius:20,borderBottomRightRadius:20}}
              className="pl-4 pr-2 py-3 flex-row items-center flex-1 mr-2" 
            >
              <Image 
                source={require('../../assets/images/envelope.png')}
                className="w-8 h-8 mr-3"
                resizeMode="contain"
              />
              <Text className="text-white text-base font-poppins font-medium flex-1">
                {dashboardApiData?.pregnancyInfo 
                  ? `Hai Bunda, ${getTrimesterName(dashboardApiData.pregnancyInfo)} minggu ke-${getWeekOfPregnancy(dashboardApiData.pregnancyInfo)}!`
                  : 'Hai Bunda, ini insight tentang harimu!'
                }
              </Text>
            </LinearGradient>

            <TouchableOpacity 
              onPress={() => router.push('/beranda/tambah-pengingat')} 
              className="bg-pink-faint-low rounded-full items-center justify-center w-16 h-16"
            >
              <AntDesign name='plus' size={width*0.074} color="white" />
            </TouchableOpacity>
          </View>

          {/* Current Date & Pregnancy Info Card */}
          <View className="bg-pink-faint-low rounded-t-2xl px-6 py-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white text-lg font-semibold font-poppins">
                  {formatDate(currentDate)}
                </Text>
                <Text className="text-white text-sm opacity-90 font-poppins">
                  {dashboardApiData?.pregnancyInfo 
                    ? `Minggu ke-${getWeekOfPregnancy(dashboardApiData.pregnancyInfo)}`
                    : 'Belum ada data kehamilan'
                  }
                </Text>
              </View>
              <Text className="text-white text-2xl font-bold font-poppins">
                {currentDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>

          {/* Upcoming Reminders Card */}
          <View className="bg-white rounded-b-2xl px-4 py-4 mb-4">
            {upcomingReminders.length > 0 ? (
              <View>
                {upcomingReminders.map((reminder, index) => (
                  <View 
                    key={reminder.id} 
                    className={`flex-row items-center ${index > 0 ? 'mt-4' : ''}`}
                  >
                    <View className="w-2 h-2 bg-pink-medium rounded-full mr-3"></View>
                    <View className="flex-1">
                      <Text className="text-gray-800 font-semibold text-lg font-poppins">
                        {reminder.title}
                      </Text>
                      <Text className="text-gray-600 text-sm mt-1 font-poppins">
                        {formatReminderDate(reminder.reminderDate)}
                      </Text>
                      <Text className="text-gray-600 text-sm font-poppins">
                        {reminder.startTime && reminder.endTime 
                          ? `${reminder.startTime} - ${reminder.endTime}`
                          : 'Waktu belum ditentukan'
                        }
                      </Text>
                      {reminder.description && (
                        <Text className="text-gray-500 text-xs mt-1 font-poppins">
                          {reminder.description}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-pink-medium rounded-full mr-3"></View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold text-lg font-poppins">
                    Tidak ada pengingat mendatang
                  </Text>
                  <Text className="text-gray-600 text-sm mt-1 font-poppins">
                    Tambahkan pengingat untuk konsultasi atau aktivitas penting
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Water & Nutrition Tracking */}
          <View className="bg-pink-medium rounded-2xl py-4 px-4 mb-4">
            <Text className="text-black font-semibold font-poppins text-lg mb-4 text-center">
              Pemenuhan Air & Gizi
            </Text>
            
            <View className="flex-row justify-around">
              {/* Water */}
              <View className="items-center">
                <View className="relative">
                  <CircularProgress
                    size={width*0.2}
                    width={width*0.02}
                    fill={dashboardData?.waterProgress || 0}
                    tintColor="#3B82F6"
                    backgroundColor="#FBB1C6"
                    rotation={0}
                  >
                    {() => (
                      <View className="items-center justify-center">
                        <Image 
                          source={require('../../assets/images/water.png')}
                          className="min-w-4 min-h-4"
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </CircularProgress>
                </View>
                <Text className="text-white font-semibold mt-2 font-poppins">
                  {dashboardData?.waterProgress || 0}%
                </Text>
                <Text className="text-white text-xs opacity-80 font-poppins">Air</Text>
              </View>

              {/* Nutrition */}
              <View className="items-center">
                <View className="relative">
                  <CircularProgress
                    size={width*0.2}
                    width={width*0.02}
                    fill={dashboardData?.nutritionProgress || 0}
                    tintColor="#EAB308"
                    backgroundColor="#FBB1C6"
                    rotation={0}
                  >
                    {() => (
                      <View className="items-center justify-center">
                        <Image 
                          source={require('../../assets/images/nutrition.png')}
                          className="min-w-4 min-h-4"
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </CircularProgress>
                </View>
                <Text className="text-white font-semibold mt-2 font-poppins">
                  {dashboardData?.nutritionProgress || 0}%
                </Text>
                <Text className="text-white text-xs opacity-80 font-poppins">Nutrisi</Text>
              </View>
            </View>
          </View>

          {/* Activities Card */}
          <View className="bg-pink-faint rounded-2xl px-4 py-4 mb-6">
            <Text className="text-gray-800 font-semibold text-center text-lg mb-3 font-poppins">
              Aktivitas Hari Ini
            </Text>
            
            <View className="flex-row">
              {/* Minutes & Activities */}
              <View className="flex-row mr-6">
                <View className="bg-white rounded-2xl px-4 py-3 mr-4 min-w-[80px] items-center">
                  <Text className="text-gray-800 text-2xl font-bold font-poppins">
                    {dashboardData?.todayActivities.totalMinutes || 0}
                  </Text>
                  <Text className="text-gray-600 text-sm font-poppins">Menit</Text>
                </View>
                
                <View className="bg-white rounded-2xl px-4 py-3 min-w-[80px] items-center">
                  <Text className="text-gray-800 text-2xl font-bold font-poppins">
                    {dashboardData?.todayActivities.totalActivities || 0}
                  </Text>
                  <Text className="text-gray-600 text-sm font-poppins">Aktivitas</Text>
                </View>
              </View>

              {/* Activity List */}
              <View className="flex-1">
                {dashboardData?.todayActivities.activities.length ? (
                  dashboardData.todayActivities.activities.map((activity, index) => (
                    <View key={index} className="flex-row items-center mb-1">
                      <View className="w-1 h-1 bg-black rounded-full mr-2"></View>
                      <Text className="text-gray-600 text-sm font-poppins">{activity}</Text>
                    </View>
                  ))
                ) : (
                  <View className="flex-1 justify-center">
                    <Text className="text-gray-500 text-sm font-poppins">
                      Belum ada aktivitas hari ini
                    </Text>
                  </View>
                )}
              </View>
            </View>


          </View>

       

          {/* Bottom Navigation Spacer - ✅ Add proper spacing */}
          <View className="h-24" />

        </ScrollView>
      </View>
    </View>
  );
}