  import  { useState, useEffect } from 'react';
  import { View, Text, TouchableOpacity, Image, Alert, AppState } from 'react-native';
  import { LinearGradient } from 'expo-linear-gradient';
  import { router, useLocalSearchParams } from 'expo-router';
  import { useAuth } from '../../../context/AuthContext';
  import { apiService } from '../../../services/api';
  import { Ionicons } from '@expo/vector-icons';

  const AktivitasBerjalan = () => {
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const { activityId, name, calories, targetDuration } = params;
    
    const [currentTime, setCurrentTime] = useState(parseInt(targetDuration as string) || 1800);
    const [isRunning, setIsRunning] = useState(false);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [isPaused, setIsPaused] = useState(false);


    const caloriesPerSecond = (parseInt(calories as string) || 100) / 3600;
    const targetTimeInSeconds = parseInt(targetDuration as string) || 1800;


    useEffect(() => {
      const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'background' && isRunning) {

        } else if (nextAppState === 'active' && isRunning) {
      
        }
      };

      const subscription = AppState.addEventListener('change', handleAppStateChange);
      return () => subscription?.remove();
    }, [isRunning]);

    // Timer effect
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
      if (!isRunning && !startTime) {
        setStartTime(new Date());
      }
      setIsRunning(!isRunning);
      setIsPaused(!isRunning ? false : true);
    };


    const saveActivity = async (durationCompleted: number, caloriesEarned: number) => {
      if (!user?.id || !activityId) return;

      try {
        const activityData = {
          activityId: parseInt(activityId as string),
          activityDate: new Date().toISOString().split('T')[0], // Today's date
          durationMinutes: Math.round(durationCompleted / 60),
          totalCalories: caloriesEarned
        };

        const response = await apiService.addActivity(user.id, activityData);
        
        if (response.success) {
          console.log('Activity saved successfully');
          return true;
        } else {
          console.error('Failed to save activity:', response.message);
          return false;
        }
      } catch (error) {
        console.error('Error saving activity:', error);
        return false;
      }
    };

    const handleActivityComplete = async () => {
      const durationCompleted = targetTimeInSeconds - currentTime;
      const finalCalories = Math.round(caloriesPerSecond * durationCompleted);
      
      const saved = await saveActivity(durationCompleted, finalCalories);
      
      if (saved) {
        router.push('/aktivitas')
      } else {
        Alert.alert(
          'Aktivitas Selesai',
          'Aktivitas telah selesai tetapi gagal disimpan. Silakan coba lagi.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/aktivitas')
            }
          ]
        );
      }
    };

    const handleFinish = async () => {
      if (currentTime === targetTimeInSeconds) {
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

      const durationCompleted = targetTimeInSeconds - currentTime;
      const finalCalories = Math.round(caloriesPerSecond * durationCompleted);

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
                  [{ text: 'OK', onPress: () => router.push('/aktivitas') }]
                );
              }
            }
          }
        ]
      );
    };

    const handleContinue = () => {
      setIsRunning(true);
      setIsPaused(false);
    };

    // Calculate progress percentage
    const progressPercentage = ((targetTimeInSeconds - currentTime) / targetTimeInSeconds) * 100;

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
          <View className="flex-3/4 justify-center mt-2 px-4 ">
            {/* Progress Bar */}
            <View className="bg-gray-200 h-2 rounded-full mb-4 mx-4">
              <View 
                className="bg-pink-medium h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </View>
            
            <Text className="text-gray-600 text-center mb-6">
              Progress: {Math.round(progressPercentage)}%
            </Text>

            {/* Timer Display */}
            <View className="bg-pink-semi-medium rounded-2xl p-8 mb-6 items-center">
              <Text className="text-white text-lg font-semibold mb-4">
                {currentTime === targetTimeInSeconds ? 'Durasi Target' : 'Waktu Tersisa'}
              </Text>
              <Text className="text-white text-5xl font-bold mb-6">
                {formatTime(currentTime)}
              </Text>
              
          
              
              {/* Timer Control */}
            <TouchableOpacity 
              className={`rounded-full w-20 h-20 items-center justify-center ${
                isRunning ? 'bg-red-500' : 'bg-pink-hard'
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

            {/* Calories Burned */}
            <View className="bg-pink-semi-medium rounded-2xl p-6 mb-6">
              <Text className="text-white text-lg font-semibold text-center mb-2">
                Kalori Terbakar
              </Text>
              <Text className="text-white text-3xl font-bold text-center">
                {Math.round(caloriesBurned)} Cal
              </Text>
              <Text className="text-white text-sm text-center opacity-75 mt-1">
                Target: {Math.round(caloriesPerSecond * targetTimeInSeconds)} Cal
              </Text>
            </View>

        
            {/* Action Buttons */}
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                className="bg-pink-semi-medium rounded-2xl py-4 px-6 flex-1"
                onPress={handleToggleTimer}
                disabled={isRunning}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {isRunning ? 'Berjalan' : 'Lanjut'}
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