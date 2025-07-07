import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const AddFood = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock data untuk search results
  const mockFoodData = [
    {
      id: 1,
      name: 'Bubur Kacang Hijau',
      calories: 141,
      portion: '1 mangkok',
      category: 'bubur'
    },
    {
      id: 2,
      name: 'Bubur Ayam',
      calories: 141,
      portion: '1 mangkok',
      category: 'bubur'
    },
    {
      id: 3,
      name: 'Bubur Sumsum',
      calories: 141,
      portion: '1 mangkok',
      category: 'bubur'
    },
    {
      id: 4,
      name: 'Bubur Beras Merah',
      calories: 120,
      portion: '1 mangkok',
      category: 'bubur'
    },
    {
      id: 5,
      name: 'Bubur Jagung',
      calories: 110,
      portion: '1 mangkok',
      category: 'bubur'
    }
  ];

  // Initialize with all foods on component mount
  React.useEffect(() => {
    setSearchResults(mockFoodData);
  }, []);

  // Filter results based on search query
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(mockFoodData); // Tampilkan semua makanan kalau tidak ada search
    } else {
      const filtered = mockFoodData.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery]);

  const handleAddFood = (food: any) => {
    // Logic untuk menambah makanan dari database ke catatan harian
    console.log('Menambah makanan ke catatan hari ini:', food);
    // Nanti simpan ke state management / local storage untuk catatan harian
    // Misalnya: tambahkan ke food log untuk tanggal hari ini
    router.push('/nutrisi'); // Kembali ke dashboard
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(mockFoodData);
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
        <TouchableOpacity onPress={() => router.push('/nutrisi')}>
          <Image 
            source={require('../../../assets/images/back-arrow.png')}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-4">
          Tambah Makanan
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
              placeholder="Cari makanan"
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

        {/* Search Results / Food List */}
        {searchResults.length > 0 && (
          <View className="px-4">
            {searchResults.map((food) => (
              <TouchableOpacity
                key={food.id}
                className="bg-pink-medium rounded-2xl p-4 mb-3 flex-row items-center"
                onPress={() => handleAddFood(food)}
              >
                {/* Plus Icon */}
                <View className="mr-4">
                    <Image   
                    source={require('../../../assets/images/plus.svg')}
                    className="w-5 h-5 "
                    resizeMode="contain">

                    </Image>
                  {/* <Text className="text-white text-4xl">+</Text> */}
                </View>
                
                {/* Food Info */}
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-1">
                    {food.name}
                  </Text>
                  <Text className="text-white text-sm opacity-90">
                    {food.calories} Kalori, {food.portion}
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
              Tidak ada makanan yang ditemukan untuk &quot;{searchQuery}&quot;
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Coba kata kunci lain atau input makanan custom
            </Text>
          </View>
        )}

        {/* Add Custom Food Button */}
        {/* <View className="px-4 py-6">
          <TouchableOpacity 
            className="bg-pink-medium rounded-2xl py-4 px-6 border-2 border-pink-hard"
            onPress={() => {
              // Navigate to form untuk input makanan custom yang belum ada di database
              console.log('Input makanan custom');
            }}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white text-xl mr-2">+</Text>
              <Text className="text-white text-center text-lg font-semibold">
                Input Makanan Custom
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default AddFood;