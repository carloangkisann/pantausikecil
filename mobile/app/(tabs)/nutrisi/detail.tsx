import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const DetailNutrisi = () => {
  const nutritionData = [
    { 
      name: 'Asam Folat', 
      current: 0, 
      target: 100, 
      unit: 'g',
      percentage: 56
    },
    { 
      name: 'Zat Besi', 
      current: 0, 
      target: 100, 
      unit: 'mg',
      percentage: 53 // 8 dari 45 + 8 = sekitar 53%
    },
    { 
      name: 'Kalsium', 
      current: 0, 
      target: 100, 
      unit: 'g',
      percentage: 20
    },
    { 
      name: 'Vitamin D', 
      current: 0, 
      target: 100, 
      unit: 'g',
      percentage: 56
    },
    { 
      name: 'Protein', 
      current: 0, 
      target: 100, 
      unit: 'g',
      percentage: 56
    },
    { 
      name: 'Sodium', 
      current: 0, 
      target: 100, 
      unit: 'g',
      percentage: 56
    }
  ];
  const width = Dimensions.get('window').width;

  return (
    <LinearGradient
      colors={['#FF9EBD', '#F2789F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            {/* <Image 
              source={require('../../../assets/images/back-arrow.png')} 
              className="w-6 h-6"
            /> */}
              <FontAwesome5 name ='arrow-circle-left' color='white' size={0.1*width}></FontAwesome5>
          </TouchableOpacity>
          
          <Text className="text-white text-xl font-semibold">
            Info Nutrisi
          </Text>
          
          <View className="w-10 h-10" />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 bg-pink-low rounded-t-3xl"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-6">
          {nutritionData.map((item, index) => (
            <View key={index} className="mb-4">
              <View className="bg-pink-semi-medium rounded-2xl p-4">
                {/* Header with name and value */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-white text-lg font-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-white text-lg font-semibold">
                    {item.current} {item.unit}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="mb-2">
                  <View className="h-8 bg-pink-hard rounded-full overflow-hidden flex-row">
                    {/* Filled portion */}
                    <View 
                      className="h-full bg-pink-medium rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                    {/* Empty portion - white */}
                    <View 
                      className="h-full bg-white"
                      style={{ width: `${100 - item.percentage}%` }}
                    />
                  </View>
                </View>

                {/* Progress indicator */}
                <View className="items-center">
                  <Text className="text-white text-base font-medium">
                    {item.percentage}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
};

export default DetailNutrisi;