import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { extractApiArrayData } from '../../../utils/apiHelpers';
import { ActivityItem } from '../../../types';

const AddAktivitas = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const convertToMockFormat = (activities: ActivityItem[]) => {
    return activities.map(activity => ({
      id: activity.id,
      name: activity.activityName,
      calories: activity.caloriesPerHour,
      duration: `${activity.estimatedDuration} menit`,
      category: activity.level.toLowerCase()
    }));
  };

  useEffect(() => {
    const fetchAllActivities = async () => {
      if (!user?.id) return; 
      
      try {
        setLoading(true);

        
        const response = await apiService.getAllActivities();
        const activitiesData = extractApiArrayData(response);
        
        if (activitiesData.length > 0) {

          const pregnancySafeActivities = activitiesData.filter(
            activity => activity.level === 'Ringan' || activity.level === 'Sedang'
          );
          

          const mockFormattedActivities = convertToMockFormat(pregnancySafeActivities);
          setAllActivities(mockFormattedActivities);
          setSearchResults(mockFormattedActivities);
          console.log('Activities loaded:', mockFormattedActivities.length);
        } 
      } catch (error) {
        console.error('Error fetching activities:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchAllActivities();
  }, [user?.id]); 

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(allActivities);
    } else {
      const filtered = allActivities.filter(activity =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, allActivities]);

  const handleAddActivity = (activity: any) => {

    router.push({
      pathname: '/aktivitas/set-timer',
      params: {
        activityId: activity.id,
        name: activity.name,
        calories: activity.calories,
        duration: parseInt(activity.duration) || 30 
      }
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(allActivities);
  };

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
          <TouchableOpacity onPress={() => router.push('/aktivitas')}>
            <Image 
              source={require('../../../assets/images/back-arrow.png')}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold ml-4">
            Tambah Aktivitas
          </Text>
        </View>

        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white mt-4">Memuat daftar aktivitas...</Text>
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
      <View className="flex-row items-center px-4 py-6 pt-12">
        <TouchableOpacity onPress={() => router.push('/aktivitas')}>
          <Image 
            source={require('../../../assets/images/back-arrow.png')}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-4">
          Tambah Aktivitas
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
        {/* Search Bar */}
        <View className="px-4 py-6">
          {/* Instructions */}
          <View className="bg-blue-100 rounded-2xl p-4 mb-4">
            <Text className="text-blue-800 text-sm font-semibold mb-1">
              💡 Cara Menambah Aktivitas
            </Text>
            <Text className="text-blue-700 text-xs leading-4">
              Pilih aktivitas → Set timer → Lakukan aktivitas → Otomatis tersimpan
            </Text>
          </View>
          
          <View className="flex-row items-center bg-white rounded-2xl px-4 py-3">
            <Image 
              source={require('../../../assets/images/search.png')}
              className="w-5 h-5 mr-3"
              resizeMode="contain"
            />
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder="Cari aktivitas"
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

        {/* Search Results / Activity List */}
        {searchResults.length > 0 && (
          <View className="px-4">
            {searchResults.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                className="bg-pink-medium rounded-2xl p-4 mb-3 flex-row items-center"
                onPress={() => handleAddActivity(activity)}
              >
                {/* Plus Icon */}
                <View className="mr-4">
                  <Image   
                    source={require('../../../assets/images/plus.png')}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                </View>
                
                {/* Activity Info */}
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-1">
                    {activity.name}
                  </Text>
                  <Text className="text-white text-sm opacity-90">
                    {activity.calories} Kalori/jam, {activity.duration}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No Results State */}
        {searchQuery.length > 0 && searchResults.length === 0 && (
          <View className="px-4 py-12 items-center">
            <Text className="text-gray-500 text-base text-center">
              Tidak ada aktivitas yang ditemukan untuk &quot;{searchQuery}&quot;
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Coba kata kunci lain atau input aktivitas custom
            </Text>
          </View>
        )}

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default AddAktivitas;