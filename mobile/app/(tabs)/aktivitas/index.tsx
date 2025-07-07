import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Header from '../../components/Header';

const AktivitasIndex = () => {
  // Mock data aktivitas hari ini
  const todayActivities = [
    {
      id: 1,
      name: 'Berenang',
      duration: '10 menit',
      calories: 50,
      status: 'Hapus', // Sudah selesai
      completed: true
    },
    {
      id: 2,
      name: 'Senam Irama', 
      duration: '10 menit',
      calories: 40,
      status: 'Hapus', // Sudah selesai
      completed: true
    },
    {
      id: 3,
      name: 'Jalan',
      duration: '10 menit',
      calories: 30,
      status: 'Hapus', // Sudah selesai
      completed: true
    },
    {
      id: 4,
      name: 'Yoga',
      duration: '15 menit',
      calories: 45,
      status: 'Mulai', // Belum selesai
      completed: false
    }
  ];

  const weekNumber = 12;
  const totalMinutes = 30;
  const totalActivities = 3;
  const targetAchieved = '4 / 7';

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
                  source={require('../../../assets/images/plus.svg')}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Activity List */}
            {todayActivities.map((activity, index) => (
              <View key={activity.id} className="flex-row items-center mb-3 relative">
                {/* Timeline dot - pink medium for completed, white for pending */}
                <View className={`w-3 h-3 rounded-full mr-4 z-10 ${
                  activity.completed ? 'bg-pink-medium' : 'bg-pink-low'
                }`} />
                
                <View className="bg-pink-low rounded-2xl p-3 flex-1 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-black-low text-base font-semibold mb-1">
                      {activity.name}
                    </Text>
                    <Text className="text-gray-1 text-sm">
                      {activity.duration}
                    </Text>
                  </View>
                  
                  <View className="items-end">
                    <Text className="text-gray-1 text-sm mb-1">
                      {activity.calories} Kalori
                    </Text>
                    <TouchableOpacity className={`rounded-full px-3 py-1 ${
                      activity.completed ? 'bg-pink-medium' : 'bg-green-500'
                    }`}>
                      <Text className="text-white text-xs">
                        {activity.status}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Timeline line */}
            <View className="absolute left-1.5 top-16 bottom-4 w-0.5 bg-white opacity-30" />
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