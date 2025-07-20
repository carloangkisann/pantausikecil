import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, Dimensions} from 'react-native';
import { useRouter } from 'expo-router';
import { CircularProgress } from 'react-native-circular-progress';
import Header from '../components/Header';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


interface KehamilanData {
  id: string;
  kehamilanKe: string;
  usiaKehamilan: string;
  jenisKelaminBayi: string;
  komplikasiKehamilan: string;
  jenisKomplikasi: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  
  // Mock data kehamilan aktif
  const mockActiveKehamilan: KehamilanData = {
    id: '1',
    kehamilanKe: '2',
    usiaKehamilan: '12 minggu',
    jenisKelaminBayi: 'Perempuan',
    komplikasiKehamilan: 'Tidak ada komplikasi',
    jenisKomplikasi: '',
    createdAt: '2024-06-01T00:00:00.000Z'
  };

  const [activeKehamilan, setActiveKehamilan] = useState<KehamilanData | null>(mockActiveKehamilan);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update date every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getWeekOfPregnancy = (usiaKehamilan: string) => {
    // Extract number from usia kehamilan string
    const match = usiaKehamilan.match(/\d+/);
    return match ? parseInt(match[0]) : 12;
  };


  if (!activeKehamilan) {
    return (
      <View className="flex-1 bg-pink-low justify-center items-center">
        <Text className="text-gray-600">Memuat data kehamilan...</Text>
      </View>
    );
  }
  const width = Dimensions.get('window').width;
  return (
    <View className="flex-1 bg-pink-medium">
      <StatusBar barStyle="light-content" backgroundColor="#F789AC" />
      
      {/* Header */}
      <Header />
      
      {/* Content */}
      <View className="flex-1 bg-pink-low rounded-3xl">
        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        
          {/* Insight Banner */}

          <View className="flex-row items-center mb-4 ">
             <LinearGradient
                colors={['#F9C5D5', '#F2789F']} 
                start={{x: 0.5, y: 0}} 
                end={{x: 0.5, y: 1}}   
                locations={[0.0033, 0.8923]} 
                style ={{borderTopRightRadius:20,borderTopLeftRadius:20,borderBottomLeftRadius:20,borderBottomRightRadius:20}}
                className="pl-4 pr-2 py-3 flex-row items-center flex-1 mr-2" 
              >
                <Image 
                  source={require('../../assets/images/envelope.png')}
                  className="w-8 h-8 mr-3"
                  resizeMode="contain"
                />
                <Text className="text-white text-base font-poppins font-medium flex-1 ">
                  Hai Bunda, ini insight tentang harimu!
                </Text>
              </LinearGradient>

            <TouchableOpacity 
              onPress={()=> {router.push('/beranda/tambah-pengingat')}} 
              className="bg-pink-faint-low rounded-full items-center justify-center w-16 h-16"
            >
              <AntDesign  name='plus' size={width*0.074} color="white"></AntDesign>
            </TouchableOpacity>
          </View>

          {/* Konsultasi Card */}
          <View className="bg-pink-faint-low rounded-t-2xl px-6 py-4 ">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white text-lg font-semibold">
                  {formatDate(currentDate)}
                </Text>
                <Text className="text-white text-sm opacity-90">
                  Minggu ke-{getWeekOfPregnancy(activeKehamilan.usiaKehamilan)}
                </Text>
              </View>
              <Text className="text-white text-2xl font-bold">
                {currentDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>

       
          <View className="bg-white rounded-b-2xl px-4 py-4 mb-4 ">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-pink-medium rounded-full mr-3"></View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-lg">
                  Konsultasi Trisemester Kedua
                </Text>
                <Text className="text-gray-600 text-sm mt-1=">
                  Senin, 23 Juni 2025
                </Text>
                <Text className="text-gray-600 text-sm">
                  10.00-11.50
                </Text>
              </View>
            </View>
          </View>

          {/* Water & Nutrition Tracking */}
          <View className="bg-pink-medium rounded-2xl py-2 px-2 mb-4 flex-row items-center">
            <Text className="text-black font-semibold font-poppins text-lg mb-4 flex-1 text-center">
              Pemenuhan Air & Gizi
            </Text>
            
            <View className="flex-row justify-between">
              {/* Water */}
              <View className="items-center mr-4">
                <View className="relative">
                  <CircularProgress
                    size={width*0.2}
                    width= {width*0.02}
                    fill={75}
                    tintColor="#3B82F6"
                    backgroundColor="#FBB1C6"
                    rotation={0}
                  >
                    {() => (
                      <View className="items-center justify-center">
                        <Image 
                          source={require('../../assets/images/water.png')}
                          className="min-w-4 min-h-4"
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </CircularProgress>
                </View>
                <Text className="text-white font-semibold mt-2">75%</Text>
              </View>

              {/* Nutrition */}
              <View className="items-center">
                <View className="relative">
                  <CircularProgress
                    size={width*0.2}
                    width={width*0.02}
                    fill={50}
                    tintColor="#EAB308"
                    backgroundColor="#FBB1C6"
                    rotation={0}
                  >
                    {() => (
                      <View className="items-center justify-center">
                        <Image 
                          source={require('../../assets/images/nutrition.png')}
                          className="min-w-4 min-h-4"
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </CircularProgress>
                </View>
                <Text className="text-white font-semibold mt-2">50%</Text>
              </View>
            </View>
          </View>

          {/* Activities Card */}
          <View className="bg-pink-faint rounded-2xl px-4 py-4 mb-6 ">
            <Text className="text-gray-800 font-semibold text-center text-lg mb-3">
              Aktivitas
            </Text>
            
            <View className="flex-row">
              {/* Minutes & Activities */}
              <View className="flex-row mr-6">
                <View className="bg-white rounded-2xl px-4 py-3 mr-4 min-w-[80px] items-center">
                  <Text className="text-gray-800  text-2xl">30</Text>
                  <Text className="text-gray-600 text-sm">Menit</Text>
                </View>
                
                <View className="bg-white rounded-2xl px-4 py-3 min-w-[80px] items-center">
                  <Text className="text-gray-800  text-2xl">3</Text>
                  <Text className="text-gray-600 text-sm">Aktivitas</Text>
                </View>
              </View>

              {/* Activity List */}
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <View className="w-1 h-1 bg-black rounded-full mr-2"></View>
                  <Text className="text-gray-600 text-sm">Berenang</Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <View className="w-1 h-1 bg-black rounded-full mr-2"></View>
                  <Text className="text-gray-600 text-sm">Senam hamil</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-1 h-1 bg-black rounded-full mr-2"></View>
                  <Text className="text-gray-600 text-sm">Jalan</Text>
                </View>
              </View>
            </View>
          </View>


        </ScrollView>
      </View>

    </View>
  );
}