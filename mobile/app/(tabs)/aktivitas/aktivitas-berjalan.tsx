import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const AktivitasBerjalan = () => {
  const params = useLocalSearchParams();
  const { name, calories, targetDuration, targetMinutes, targetHours } = params;
  
  const [currentTime, setCurrentTime] = useState(parseInt(targetDuration as string) || 1800); // Default 30 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  // Calculate calories per second based on activity calories per hour
  const caloriesPerSecond = (parseInt(calories as string) || 100) / 3600;

  useEffect(() => {
    let interval: any;
    
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime - 1;
          
          // Update calories burned
          setCaloriesBurned((prevCalories) => 
            Math.round(prevCalories + caloriesPerSecond)
          );
          
          // Auto finish when time reaches 0
          if (newTime <= 0) {
            setIsRunning(false);
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, currentTime, caloriesPerSecond]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleFinish = () => {
    // Save activity to log
    console.log('Activity finished:', {
      name,
      duration: (parseInt(targetDuration as string) - currentTime),
      caloriesBurned
    });
    
    router.push('/aktivitas');
  };

  const handleContinue = () => {
    setIsRunning(true);
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
          {/* Timer Display */}
          <View className="bg-pink-semi-medium rounded-2xl p-8 mb-6 items-center">
            <Text className="text-white text-lg font-semibold mb-4">
              Durasi
            </Text>
            <Text className="text-white text-5xl font-bold mb-6">
              {formatTime(currentTime)}
            </Text>
            
            {/* Timer Control */}
            <TouchableOpacity 
              className={`rounded-full w-1/4 p-4 ${isRunning ? 'bg-red-500' : 'bg-pink-hard'}`}
              onPress={handleToggleTimer}
            >
              <Text className="text-white text-2xl">
                {isRunning ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Calories Burned */}
          <View className="bg-pink-semi-medium rounded-2xl p-6 mb-6">
            <Text className="text-white text-lg font-semibold text-center mb-2">
              Kalori
            </Text>
            <Text className="text-white text-3xl font-bold text-center">
              {caloriesBurned} Cal
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              className="bg-pink-semi-medium rounded-2xl py-4 px-6 flex-1"
              onPress={handleContinue}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Lanjut
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-pink-medium rounded-2xl py-4 px-6 flex-1"
              onPress={handleFinish}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Selesai
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default AktivitasBerjalan;