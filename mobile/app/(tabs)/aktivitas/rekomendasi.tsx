import  { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { extractApiArrayData } from '../../../utils/apiHelpers';
import { ActivityItem } from '../../../types';
import { FontAwesome5 } from '@expo/vector-icons';

const RekomendasiAktivitas = () => {
  const { user } = useAuth();
  const [recommendedActivities, setRecommendedActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recommended activities
  const fetchRecommendedActivities = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Try to get user-specific recommendations first
      const recommendedResponse = await apiService.getAllActivities(); 
      const recommendedData = extractApiArrayData(recommendedResponse);
      
      if (recommendedData.length > 0) {
        setRecommendedActivities(recommendedData);
      } else {
    
        const allActivitiesResponse = await apiService.getAllActivities();
        const allActivitiesData = extractApiArrayData(allActivitiesResponse);
        
        // Filter activities suitable for pregnancy (level: Ringan or Sedang)
        // const pregnancySafeActivities = allActivitiesData.filter(
        //   activity => activity.level === 'Ringan' || activity.level === 'Sedang'
        // );
        setRecommendedActivities(allActivitiesData);
      }
    } catch (error) {
      console.error('Error fetching recommended activities:', error);
      Alert.alert('Error', 'Gagal memuat rekomendasi aktivitas');
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // Dependencies: hanya re-create jika user.id berubah

  useEffect(() => {
    fetchRecommendedActivities();
  }, [fetchRecommendedActivities]); // Include fetchRecommendedActivities dependency

  const handleActivityPress = (activity: ActivityItem) => {
    router.push({
      pathname: '/aktivitas/detail-rekomendasi',
      params: { 
        activityId: activity.id,
        name: activity.activityName,
        calories: activity.caloriesPerHour,
        duration: activity.estimatedDuration,
        level: activity.level,
        description: activity.description || '',
        tips: activity.tips || '',
        videoUrl: activity.videoUrl || '',
        thumbnailUrl: activity.thumbnailUrl || ''
      }
    });
  };

  // Get level display text and color
  const getLevelDisplay = (level: string) => {
    const levelConfig = {
      'Ringan': { text: 'Beginner', color: 'bg-green-500' },
      'Sedang': { text: 'Intermediate', color: 'bg-yellow-500' },
      'Berat': { text: 'Advanced', color: 'bg-red-500' }
    };
    return levelConfig[level as keyof typeof levelConfig] || { text: level, color: 'bg-gray-500' };
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
        {/* Header */}
        <View className="flex-row items-center px-4 py-6 pt-12">
          <TouchableOpacity onPress={() => router.back()}>

            <FontAwesome5 name ='arrow-circle-left' color='white' size={0.1*width}></FontAwesome5>
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold ml-4 font-poppins">
            Rekomendasi Aktivitas
          </Text>
        </View>

        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white mt-4 font-poppins">Memuat rekomendasi aktivitas...</Text>
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
      <View className="flex-row items-center px-4 py-6 ">
        <TouchableOpacity onPress={() => router.back()}>
          {/* <Image 
            source={require('../../../assets/images/back-arrow.png')}
            className="w-6 h-6"
            resizeMode="contain"
          /> */}
           <FontAwesome5 name ='arrow-circle-left' color='white' size={0.1*width}></FontAwesome5>
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-4 font-poppins">
          Rekomendasi Aktivitas
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
        {/* Activity Cards */}
        <View className="px-4 py-6">
          {recommendedActivities.length > 0 ? (
            recommendedActivities.map((activity) => {
              const levelDisplay = getLevelDisplay(activity.level);
              
              return (
                <TouchableOpacity
                  key={activity.id}
                  className="bg-pink-medium rounded-2xl p-4 mb-4 flex-row items-center"
                  onPress={() => handleActivityPress(activity)}
                >
                  {/* Activity Image */}
                  <View className="mr-4 ">
                    {/* <Image 
                      source={
                        activity.thumbnailUrl 
                          ? { uri: activity.thumbnailUrl }
                          : require('../../../assets/images/olahraga-contoh.png')
                      }
                      className="w-16 h-16 rounded-xl"
                      resizeMode="cover
                      "
                    /> */}
                    <Image source ={require('../../../assets/images/default-olahraga.png')}  resizeMode='cover'  style={{width:100,height:75,borderRadius:10}}></Image>
                  </View>
                  
                  {/* Activity Info */}
                  <View className="flex-1">
                    <Text className="text-white text-base font-semibold mb-2  ml-6 font-poppins">
                      {activity.activityName}
                    </Text>
                    
                    <View className="flex-row items-center mb-2">
                      <Image 
                        source={require('../../../assets/images/dumbbell.svg')}
                        className="w-4 h-4 mr-2"
                        resizeMode="contain"
                      />
                      <Text className="text-white text-sm opacity-90 mr-4 font-poppins">
                        {activity.caloriesPerHour} Kalori/jam
                      </Text>
                      
                      <Image 
                        source={require('../../../assets/images/clock.svg')}
                        className="w-4 h-4 mr-2"
                        resizeMode="contain"
                      />
                      <Text className="text-white text-sm opacity-90 font-poppins">
                        {activity.estimatedDuration} min
                      </Text>
                    </View>
                    
                    <View className="bg-white rounded-full px-3 py-1 self-start ml-6 flex-row items-center">
                      <Image 
                        source={require('../../../assets/images/chart.png')}
                        className="w-3 h-3"
                        resizeMode="contain"
                      />
                      <Text className="text-black ml-2 text-xs font-semibold font-poppins">
                        {levelDisplay.text}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="bg-pink-medium rounded-2xl p-6 items-center">
              <Text className="text-white text-lg font-semibold mb-2 font-poppins">
                Tidak ada rekomendasi aktivitas
              </Text>
              <Text className="text-white text-sm opacity-90 text-center font-poppins">
                Silakan lengkapi profil Anda untuk mendapatkan rekomendasi yang lebih personal
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

export default RekomendasiAktivitas;