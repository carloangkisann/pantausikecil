import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#F99AB6" />
      <LinearGradient
        colors={['#F99AB6', '#F278A0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-center pt-12 pb-4 px-5">
            <Image 
            source={require('../../assets/images/pantausikecil.png')} 
            style={{ width: 100, height: 100 }}
            className="mx-auto"
            resizeMode="contain"
            />
          <Text 
            className="text-white text-lg font-medium font-poppins text-center mr-12"
            style={{
              fontFamily: 'Poppins',
              lineHeight: 18,
              letterSpacing: 0,
            }}
          >
            Selamat datang kembali,{'\n'}calon Bunda hebat!
          </Text>
        </View>

        {/* Login Card */}
        <View 
          className="rounded-[30px] mx-4 px-6 pt-8 pb-6"
          style={{
            backgroundColor: '#FBB1C6', // Same color as nutrition cards
            height: height * 0.52,
            marginTop: height * 0.02,
          }}
        >
          <Text className="text-black text-2xl font-bold text-center mb-6">
            Login
          </Text>

          {/* Email Input */}
          <Text className="text-black text-sm font-semibold mb-2">
            Email
          </Text>
          <TextInput
            className="rounded-xl px-4 py-3 text-sm mb-4"
            style={{ backgroundColor: '#FFFFFF' }}
            placeholder="Masukkan email kamu"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <Text className="text-black text-sm font-semibold mb-2">
            Password
          </Text>
          <View className="rounded-xl px-4 py-3 mb-6 flex-row items-center" style={{ backgroundColor: '#FFFFFF' }}>
            <TextInput
              className="flex-1 text-sm"
              placeholder="Masukkan password kamu"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={{ color: '#666' }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image 
                source={require('../../assets/images/eye.png')} 
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            className="rounded-xl py-4 mb-4"
            style={{ backgroundColor: '#F278A0' }}
            onPress={() => router.push('/beranda')}
          >
            <Text className="text-white text-base font-bold text-center">
              Login
            </Text>
          </TouchableOpacity>

          {/* Google Login Button */}
          <TouchableOpacity className="rounded-xl py-3 mb-4 flex-row items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
            <Image 
              source={require('../../assets/images/google.png')} 
              className="w-5 h-5 mr-2"
              resizeMode="contain"
            />
            <Text className="text-black text-sm font-medium">
              Masuk dengan Google
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-xs">
              Belum punya akun? 
            </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-xs font-semibold ml-1" style={{ color: '#F278A0' }}>
                Registrasi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}