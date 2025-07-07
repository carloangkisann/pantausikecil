import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const RekomendasiAktivitas = () => {
  // Mock data rekomendasi aktivitas
  const recommendedActivities = [
    {
      id: 1,
      name: 'Senam Irama',
      calories: 200,
      duration: 30,
      level: 'Beginner',
      image: require('../../../assets/images/olahraga-contoh.png')
    },
    {
      id: 2,
      name: 'Yoga Prenatal',
      calories: 150,
      duration: 45,
      level: 'Beginner',
      image: require('../../../assets/images/olahraga-contoh.png')
    },
    {
      id: 3,
      name: 'Jalan Santai',
      calories: 180,
      duration: 20,
      level: 'Beginner',
      image: require('../../../assets/images/olahraga-contoh.png')
    },
    {
      id: 4,
      name: 'Berenang',
      calories: 250,
      duration: 30,
      level: 'Intermediate',
      image: require('../../../assets/images/olahraga-contoh.png')
    },
    {
      id: 5,
      name: 'Pilates',
      calories: 200,
      duration: 40,
      level: 'Beginner',
      image: require('../../../assets/images/olahraga-contoh.png')
    },
    {
      id: 6,
      name: 'Aerobik Ringan',
      calories: 220,
      duration: 35,
      level: 'Beginner',
      image: require('../../../assets/images/olahraga-contoh.png')
    }
  ];

  const handleActivityPress = (activity: any) => {
    router.push({
      pathname: '/aktivitas/detail-rekomendasi',
      params: { 
        activityId: activity.id,
        name: activity.name,
        calories: activity.calories,
        duration: activity.duration,
        level: activity.level
      }
    });
  };

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
          <Image 
            source={require('../../../assets/images/back-arrow.png')}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-4">
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
          {recommendedActivities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              className="bg-pink-medium rounded-2xl p-4 mb-4 flex-row items-center"
              onPress={() => handleActivityPress(activity)}
            >
              {/* Activity Image */}
              <View className="mr-4">
                <Image 
                  source={activity.image}
                  className="w-16 h-16 rounded-xl"
                  resizeMode="cover"
                />
              </View>
              
              {/* Activity Info */}
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold mb-2">
                  {activity.name}
                </Text>
                
                <View className="flex-row items-center mb-2">
                  <Image 
                    source={require('../../../assets/images/dumbbell.svg')}
                    className="w-4 h-4 mr-2"
                    resizeMode="contain"
                  />
                  <Text className="text-white text-sm opacity-90 mr-4">
                    {activity.calories} Kalori
                  </Text>
                  
                  <Image 
                    source={require('../../../assets/images/clock.svg')}
                    className="w-4 h-4 mr-2"
                    resizeMode="contain"
                  />
                  <Text className="text-white text-sm opacity-90">
                    {activity.duration} min
                  </Text>
                </View>
                
                <View className="bg-white rounded-full px-3 py-1 self-start flex flex-row justify-between">
                    <Image source={require('../../../assets/images/chart.png')}></Image>
                  <Text className="text-black ml-2   text-xs font-semibold">
                    {activity.level}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default RekomendasiAktivitas;