import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const AddAktivitas = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock data untuk search results aktivitas
  const mockActivityData = [
    {
      id: 1,
      name: 'Jogging',
      calories: 440,
      duration: '1 jam',
      category: 'cardio'
    },
    {
      id: 2,
      name: 'Yoga',
      calories: 180,
      duration: '1 jam',
      category: 'flexibility'
    },
    {
      id: 3,
      name: 'Berenang',
      calories: 400,
      duration: '1 jam',
      category: 'cardio'
    },
    {
      id: 4,
      name: 'Bersepeda',
      calories: 300,
      duration: '1 jam',
      category: 'cardio'
    },
    {
      id: 5,
      name: 'Pilates',
      calories: 250,
      duration: '1 jam',
      category: 'strength'
    },
    {
      id: 6,
      name: 'Jalan Santai',
      calories: 200,
      duration: '1 jam',
      category: 'cardio'
    },
    {
      id: 7,
      name: 'Senam Aerobik',
      calories: 350,
      duration: '1 jam',
      category: 'cardio'
    },
    {
      id: 8,
      name: 'Tai Chi',
      calories: 150,
      duration: '1 jam',
      category: 'flexibility'
    }
  ];

  // Initialize with all activities on component mount
  React.useEffect(() => {
    setSearchResults(mockActivityData);
  }, []);

  // Filter results based on search query
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(mockActivityData);
    } else {
      const filtered = mockActivityData.filter(activity =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  const handleAddActivity = (activity: any) => {
    // Logic untuk menambah aktivitas ke catatan harian
    console.log('Menambah aktivitas ke catatan hari ini:', activity);
    // Nanti simpan ke state management / local storage untuk catatan harian
    router.push('/aktivitas'); // Kembali ke dashboard aktivitas
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(mockActivityData);
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
                    source={require('../../../assets/images/plus.svg')}
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
                    {activity.calories} Kalori, {activity.duration}
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