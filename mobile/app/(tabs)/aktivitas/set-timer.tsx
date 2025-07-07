import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const MulaiAktivitas = () => {
  const params = useLocalSearchParams();
  const { name, calories, duration } = params;
  
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(parseInt(duration as string) || 30);
  const [selectedSeconds, setSelectedSeconds] = useState(0);

  // Helper function to generate number arrays
  const generateNumbers = (max: number) => Array.from({ length: max + 1 }, (_, i) => i);

  const NumberPicker = ({ 
    value, 
    onChange, 
    max, 
    label 
  }: { 
    value: number; 
    onChange: (val: number) => void; 
    max: number; 
    label: string;
  }) => (
    <View className="items-center flex-1">
      <ScrollView 
        className="h-32"
        showsVerticalScrollIndicator={false}
        snapToInterval={40}
        decelerationRate="fast"
      >
        {generateNumbers(max).map((num) => (
          <TouchableOpacity 
            key={num}
            className="h-10 justify-center items-center"
            onPress={() => onChange(num)}
          >
            <Text 
              className={`text-2xl font-semibold ${
                value === num ? 'text-white' : 'text-white opacity-50'
              }`}
            >
              {num.toString().padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text className="text-white text-sm mt-2 opacity-90">
        {label}
      </Text>
    </View>
  );

  const handleStartTimer = () => {
    const totalSeconds = selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds;
    
    router.push({
      pathname: '/aktivitas/aktivitas-berjalan',
      params: { 
        name,
        calories,
        targetDuration: totalSeconds,
        targetMinutes: selectedMinutes,
        targetHours: selectedHours
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
          {name}
        </Text>
      </View>

      <View 
        className="bg-pink-low"
        style={{ 
          flex: 1, 
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <View className="flex-1 justify-center px-4">
          {/* Timer Section */}
          <View className="bg-pink-semi-medium rounded-2xl p-6 mb-8">
            <Text className="text-white text-xl font-semibold text-center mb-6">
              Target Durasi
            </Text>
            
            {/* Time Picker */}
            <View className="flex-row justify-between items-center mb-4">
              <NumberPicker 
                value={selectedHours}
                onChange={setSelectedHours}
                max={12}
                label="Jam"
              />
              
              <Text className="text-white text-3xl font-bold mx-2">:</Text>
              
              <NumberPicker 
                value={selectedMinutes}
                onChange={setSelectedMinutes}
                max={59}
                label="Menit"
              />
              
              <Text className="text-white text-3xl font-bold mx-2">:</Text>
              
              <NumberPicker 
                value={selectedSeconds}
                onChange={setSelectedSeconds}
                max={59}
                label="Detik"
              />
            </View>

            {/* Current Selection Display */}
            <View className="bg-white bg-opacity-20 rounded-xl p-4 mt-4">
              <Text className="text-white text-center text-2xl font-bold">
                {selectedHours.toString().padStart(2, '0')} : {selectedMinutes.toString().padStart(2, '0')} : {selectedSeconds.toString().padStart(2, '0')}
              </Text>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity 
            className="bg-pink-medium rounded-2xl py-4 px-6"
            onPress={handleStartTimer}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Mulai
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default MulaiAktivitas;