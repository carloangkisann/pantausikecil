import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, AppState, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AktivitasBerjalan = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const { activityId, name, calories, targetDuration } = params;
  
  const [currentTime, setCurrentTime] = useState(parseInt(targetDuration as string) || 1800);
  const [isRunning, setIsRunning] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Track actual elapsed time

  const caloriesPerSecond = (parseInt(calories as string) || 100) / 3600;
  const targetTimeInSeconds = parseInt(targetDuration as string) || 1800;

  // Background handling untuk timer
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'background' && isRunning) {
        // Simpan timestamp saat app ke background
        await AsyncStorage.setItem('backgroundTime', Date.now().toString());
        await AsyncStorage.setItem('currentTimeWhenBackground', currentTime.toString());
        console.log('App went to background, saved time:', currentTime);
      } else if (nextAppState === 'active' && isRunning) {
        // Hitung waktu yang terlewat saat app kembali active
        try {
          const backgroundTime = await AsyncStorage.getItem('backgroundTime');
          const savedCurrentTime = await AsyncStorage.getItem('currentTimeWhenBackground');
          
          if (backgroundTime && savedCurrentTime) {
            const timeInBackground = Math.floor((Date.now() - parseInt(backgroundTime)) / 1000);
            const newCurrentTime = Math.max(0, parseInt(savedCurrentTime) - timeInBackground);
            
            console.log('App became active, time in background:', timeInBackground);
            console.log('Updating currentTime from', currentTime, 'to', newCurrentTime);
            
            setCurrentTime(newCurrentTime);
            setElapsedTime(prev => prev + timeInBackground);
            
            // Clear stored values
            await AsyncStorage.removeItem('backgroundTime');
            await AsyncStorage.removeItem('currentTimeWhenBackground');
          }
        } catch (error) {
          console.error('Error handling app state change:', error);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isRunning, currentTime]);

  // Timer effect
  useEffect(() => {
    let interval: any;
    
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime - 1;
          
          // Update elapsed time
          setElapsedTime(prev => prev + 1);
          
          // Update calories burned
          setCaloriesBurned((prevCalories) => 
            Math.round(prevCalories + caloriesPerSecond)
          );
          
          // Debug log setiap 10 detik
          if ((targetTimeInSeconds - newTime) % 10 === 0) {
            console.log('Timer running - Elapsed:', targetTimeInSeconds - newTime, 'seconds');
            console.log('Timer running - Remaining:', newTime, 'seconds');
            console.log('Elapsed time tracked:', elapsedTime + 1);
          }
          
          // Auto finish when time reaches 0
          if (newTime <= 0) {
            console.log('Timer finished automatically');
            setIsRunning(false);
            handleActivityComplete();
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
  }, [isRunning, currentTime, caloriesPerSecond, elapsedTime]);

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
    if (!isRunning && !startTime) {
      setStartTime(new Date());
      console.log('Timer started at:', new Date());
    }
    setIsRunning(!isRunning);
    setIsPaused(!isRunning ? false : true);
    console.log('Timer toggled - isRunning:', !isRunning);
  };

  const saveActivity = async (durationCompletedSeconds: number, caloriesEarned: number) => {
    if (!user?.id || !activityId) {
      console.error('Missing user ID or activity ID');
      Alert.alert('Error', 'Data user atau aktivitas tidak valid');
      return false;
    }

    try {
      // DEBUG: Log semua nilai untuk debugging


      const actualDurationSeconds = Math.max(elapsedTime, durationCompletedSeconds);

      
      // Validasi durasi minimal 10 detik
      if (actualDurationSeconds < 10) {
        Alert.alert('Durasi Terlalu Singkat', 'Aktivitas minimal 10 detik untuk dapat disimpan.');
        return false;
      }
      
      // Pastikan durasi dalam menit minimal 1
      const durationMinutes = Math.max(1, Math.round(actualDurationSeconds / 60));
      const finalCalories = Math.max(1, Math.round(caloriesEarned));


      const activityData = {
        activityId: parseInt(activityId as string),
        activityDate: new Date().toISOString().split('T')[0],
        durationMinutes: durationMinutes,
        totalCalories: finalCalories
      };

      console.log('activityData being sent to API:', activityData);

      const response = await apiService.addActivity(user.id, activityData);
      
      console.log('API Response:', response);
      
      if (response.success) {
        console.log('Activity saved successfully');
        return true;
      } else {
        console.error('Failed to save activity:', response.message);
        Alert.alert('Error', response.message || 'Gagal menyimpan aktivitas');
        return false;
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan aktivitas');
      return false;
    }
  };

  const handleActivityComplete = async () => {

    
    // Gunakan elapsedTime yang lebih akurat
    const durationCompleted = elapsedTime || (targetTimeInSeconds - currentTime);
    // console.log('durationCompleted (calculated):', durationCompleted);
    

    const safeDuration = Math.max(10, durationCompleted);
    const finalCalories = Math.max(1, Math.round(caloriesPerSecond * safeDuration));
    

    const saved = await saveActivity(safeDuration, finalCalories);
    
    if (saved) {
      Alert.alert(
        'Aktivitas Selesai!',
        `Durasi: ${Math.round(safeDuration / 60)} menit\nKalori: ${finalCalories} kal`,
        [{ text: 'OK', onPress: () => router.push('/aktivitas') }]
      );
    } else {
      Alert.alert(
        'Aktivitas Selesai',
        'Aktivitas telah selesai tetapi gagal disimpan. Silakan coba lagi.',
        [
          {
            text: 'Coba Lagi',
            onPress: () => saveActivity(safeDuration, finalCalories)
          },
          {
            text: 'Keluar',
            onPress: () => router.push('/aktivitas')
          }
        ]
      );
    }
  };

  const handleFinish = async () => {

    if (currentTime === targetTimeInSeconds || elapsedTime === 0) {
      // Timer hasn't started yet
      Alert.alert(
        'Konfirmasi',
        'Anda belum memulai aktivitas. Yakin ingin keluar?',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Ya', onPress: () => router.push('/aktivitas') }
        ]
      );
      return;
    }


    const durationCompleted = elapsedTime || (targetTimeInSeconds - currentTime);

    
    // Validasi durasi minimal
    if (durationCompleted < 10) {
      Alert.alert(
        'Durasi Terlalu Singkat',
        'Aktivitas minimal 10 detik untuk dapat disimpan.',
        [
          { text: 'OK' },
          { text: 'Lanjut Timer', onPress: () => setIsRunning(true) }
        ]
      );
      return;
    }

    const finalCalories = Math.max(1, Math.round(caloriesPerSecond * durationCompleted));
    


    Alert.alert(
      'Selesaikan Aktivitas?',
      `Durasi yang telah diselesaikan: ${Math.round(durationCompleted / 60)} menit\nKalori yang dibakar: ${finalCalories} kal\n\nSimpan aktivitas ini?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Simpan',
          onPress: async () => {
            setIsRunning(false);
            const saved = await saveActivity(durationCompleted, finalCalories);
            
            if (saved) {
              Alert.alert(
                'Tersimpan!',
                'Aktivitas berhasil disimpan ke catatan hari ini.',
                [{ text: 'OK', onPress: () => router.push('/aktivitas') }]
              );
            } else {
              Alert.alert(
                'Error',
                'Gagal menyimpan aktivitas. Silakan coba lagi.',
                [
                  { text: 'Coba Lagi', onPress: () => saveActivity(durationCompleted, finalCalories) },
                  { text: 'Keluar', onPress: () => router.push('/aktivitas') }
                ]
              );
            }
          }
        }
      ]
    );
  };

  // Calculate progress percentage
  const progressPercentage = Math.min(100, ((targetTimeInSeconds - currentTime) / targetTimeInSeconds) * 100);
  const width = Dimensions.get('window').width;

  return (
    <LinearGradient
      colors={['#FF9EBD', '#F2789F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-6">
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name='arrow-circle-left' color='white' size={0.1 * width} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-4 font-poppins">
          {name}
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
        <View className="flex-3/4 justify-center mt-2 px-4">
          {/* Progress Bar */}
          <View className="bg-gray-200 h-2 rounded-full mb-4 mx-4">
            <View 
              className="bg-pink-medium h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
          
          <Text className="text-gray-600 text-center mb-6 font-poppins">
            Progress: {Math.round(progressPercentage)}%
          </Text>

          {/* Timer Display */}
          <View className="bg-pink-semi-medium rounded-2xl p-8 mb-6 items-center">
            <Text className="text-white text-lg font-semibold mb-4 font-poppins">
              {currentTime === targetTimeInSeconds ? 'Durasi Target' : 'Waktu Tersisa'}
            </Text>
            <Text className="text-white text-5xl font-bold mb-6 font-poppins">
              {formatTime(currentTime)}
            </Text>
            
            {/* Timer Control */}
            <TouchableOpacity 
              className={`rounded-full w-20 h-20 items-center justify-center ${
                isRunning ? 'bg-pink-hard' : 'bg-pink-hard'
              }`}
              onPress={handleToggleTimer}
            >
              <Ionicons 
                name={isRunning ? 'pause' : 'play'} 
                size={32} 
                color="white" 
              />
            </TouchableOpacity>
          </View>

          {/* Elapsed Time Display */}
          <View className="bg-pink-semi-medium rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-semibold text-center mb-2 font-poppins">
              Waktu Berlalu
            </Text>
            <Text className="text-white text-2xl font-bold text-center font-poppins">
              {formatTime(elapsedTime)}
            </Text>
          </View>

          {/* Calories Burned */}
          <View className="bg-pink-semi-medium rounded-2xl p-6 mb-6">
            <Text className="text-white text-lg font-semibold text-center mb-2 font-poppins">
              Kalori Terbakar
            </Text>
            <Text className="text-white text-3xl font-bold text-center font-poppins">
              {Math.round(caloriesBurned)} Cal
            </Text>
            <Text className="text-white text-sm text-center opacity-75 mt-1 font-poppins">
              Target: {Math.round(caloriesPerSecond * targetTimeInSeconds)} Cal
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              className="bg-pink-medium rounded-3xl py-4 px-6 w-1/2 mx-auto"
              onPress={handleFinish}
            >
              <Text className="text-white text-center text-2xl font-semibold font-poppins">
                Selesai
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AktivitasBerjalan;