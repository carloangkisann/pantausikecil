import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Platform,Image } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Header from '../../components/Header';


const NutritionDashboard = () => {
  const [selectedTab, setSelectedTab] = useState<'harian' | 'pilih'>('harian');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nutritionData = [
    { 
      name: 'Asam Folat', 
      current: 420, 
      target: 600, 
      unit: 'mg',
      color: '#22C55E'
    },
    { 
      name: 'Zat Besi', 
      current: 420, 
      target: 600, 
      unit: 'mg',
      color: '#A855F7' 
    },
    { 
      name: 'Kalsium', 
      current: 420, 
      target: 600, 
      unit: 'mg',
      color: '#3B82F6' 
    },
    { 
      name: 'Vitamin D', 
      current: 420, 
      target: 600, 
      unit: 'mg',
      color: '#F59E0B' 
    }
  ];

  const mealTypes = [
    { name: 'Sarapan', calories: 0 },
    { name: 'Makan Siang', calories: 0 },
    { name: 'Makan Malam', calories: 0 },
    { name: 'Cemilan Pagi', calories: 0 },
    { name: 'Cemilan Sore', calories: 0 }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setSelectedDate(selectedDate);
      if (Platform.OS === 'ios') {
        // iOS handling if needed
      }
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100); // Cap at 100%
  };

  return (
    <LinearGradient
      colors={['#FF9EBD', '#F2789F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
      
    >
      <Header 
          greeting="Selamat datang"
          userName="Bunda Matchaciz"
          onAvatarPress={() => console.log('Avatar pressed')}
        />
      <ScrollView style={{ flex: 1 }} className='bg-pink-low rounded-t-2xl'>
  

        {/* Date Tabs */}
        <View className="px-4 py-4">
          <View className="flex-row bg-pink-semi-low rounded-full p-1">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-full ${
                selectedTab === 'harian' ? 'bg-pink-medium' : 'bg-transparent'
              }`}
              onPress={() => setSelectedTab('harian')}
            >
              <Text className={`text-center font-medium ${
                selectedTab === 'harian' ? 'text-white' : 'text-pink-600'
              }`}>
                Harian
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className={`flex-1 py-3 rounded-full ${
                selectedTab === 'pilih' ? 'bg-pink-medium' : 'bg-transparent'
              }`}
              onPress={() => {
                setSelectedTab('pilih');
                setShowDatePicker(true);
              }}
            >
              <Text className={`text-center font-medium ${
                selectedTab === 'pilih' ? 'text-white' : 'text-pink-600'
              }`}>
                Pilih Tanggal
              </Text>
            </TouchableOpacity>
          </View>

          {/* Current Date */}
          <Text className="text-center text-gray-700 text-lg font-medium mt-4">
            {formatDate(selectedDate)}
          </Text>
        </View>

        {/* Water Intake */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-semi-medium rounded-2xl p-4 border-l-8 border-pink-medium">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image source={require('../../../assets/images/water.png')}></Image>
                <View>
                  <Text className="text-gray-800 text-xl font-bold">600 / 2,000 ml</Text>
                  <Text className="text-gray-600">600ml air (3 Gelas)</Text>
                </View>
              </View>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-full">
                <Text className="text-gray-700 font-medium">Minum</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Nutrition Info */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-semi-medium rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-800 text-lg font-semibold">Info Nutrisi</Text>
              <TouchableOpacity>
                <Text className="text-gray-600 text-2xl">›</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-between">
              {nutritionData.map((item, index) => (
                <View key={index} className="w-[48%] items-center mb-4">
                  <Text className="text-gray-800 font-medium mb-2">{item.name}</Text>
                  
                  <View className="relative items-center justify-center">
                    <CircularProgress
                      size={120}
                      width={10}
                      fill={getProgressPercentage(item.current, item.target)}
                      tintColor={item.color}
                      backgroundColor="#FFE3EC"
                      rotation={0}
                      lineCap="round"
                    />
                    <View className="absolute items-center">
                      <Text className="text-gray-800 font-bold text-lg">{item.current}</Text>
                      <Text className="text-gray-600 text-xs">dari {item.target} {item.unit}</Text>
                      <Text className="text-gray-600 text-xs">kebutuhan</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              className="bg-white rounded-full py-3 mt-4"
              onPress={() => router.push('/nutrisi/recommendation')}
            >
              <Text className="text-center text-gray-700 font-medium">
                Rekomendasi Makanan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Food Log */}
        <View className="mx-4 mb-6">
          <View className="bg-pink-semi-medium rounded-2xl p-4">
            <Text className="text-gray-800 text-lg font-semibold mb-4">
              Catatan Makanan
            </Text>

            {mealTypes.map((meal, index) => (
              <TouchableOpacity key={index} className="flex-row items-center justify-between py-3 border-b border-pink-300/50">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-pink-medium rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-xs font-medium">{meal.calories}</Text>
                    <Text className="text-white text-xs">Cal</Text>
                  </View>
                  <Text className="text-gray-800 font-medium">{meal.name}</Text>
                </View>
                <Image 
                      source={require('../../../assets/images/plus.svg')} 
                      style={{width: 24, height: 24}} 
                    />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Navigation Spacer */}
        <View className="h-20" />

        {/* Date Picker Modal */}
        {showDatePicker && (
          <>
            {Platform.OS === 'ios' ? (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View className="flex-1 justify-end bg-black/50">
                  <View className="bg-white rounded-t-2xl p-4">
                    <View className="flex-row justify-between items-center mb-4">
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        className="px-4 py-2"
                      >
                        <Text className="text-pink-500 font-medium">Batal</Text>
                      </TouchableOpacity>
                      <Text className="text-lg font-semibold text-gray-800">
                        Pilih Tanggal
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                        className="px-4 py-2"
                      >
                        <Text className="text-pink-500 font-medium">Selesai</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={onDateChange}
                    />
                  </View>
                </View>
              </Modal>
            ) : (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="calendar"
                onChange={onDateChange}
              />
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default NutritionDashboard;