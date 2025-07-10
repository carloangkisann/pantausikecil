import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#F99AB6" />
      <LinearGradient
        colors={['#FF9EBD', '#F2789F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View 
          className="absolute flex-row items-center w-full"
          style={{
            top: height * 0.06,
            left: 0,
            width: width,
            paddingLeft: width * 0.025,
            paddingRight: width * 0.025,
          }}
        >
          <Image 
            source={require('../../assets/images/pantausikecil.png')} 
            style={{
              width: width * 0.25,
              height: height * 0.1
            }}
            resizeMode="contain"
          />
          <Text 
            className="text-white text-8xl font-bold text-center flex-1"
            style={{
              fontSize: width * 0.05,
              fontWeight: '500'
            }}
          >
            Selamat datang,{'\n'}calon Bunda hebat!
          </Text>
        </View>

        {/* Register Card */}
        <View 
          className="absolute bg-pink-low"
          style={{
            width: width,
            height: height, // full height instead of 0.91
            top: height * 0.18, // slightly higher
            backgroundColor: '#FFE3EC',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            borderBottomLeftRadius: 0, // no bottom radius
            borderBottomRightRadius: 0, // no bottom radius
            paddingHorizontal: width * 0.06,
            paddingTop: height * 0.05,
          }}
        >
          <Text className="text-xl font-bold text-black text-center mb-4">
            Registrasi
          </Text>

          {/* Username Input */}
          <Text className="text-black font-semibold mb-1" style={{ fontSize: width * 0.04 }}>
            Username
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 text-gray-600"
            style={{
              width: width * 0.82,
              height: height * 0.045,
              fontSize: width * 0.04,
              marginBottom: 15
            }}
            placeholder="Masukkan username kamu"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          {/* Email Input */}
          <Text className="text-black font-semibold mb-1" style={{ fontSize: width * 0.04 }}>
            Email
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 text-gray-600"
            style={{
              width: width * 0.82,
              height: height * 0.045,
              fontSize: width * 0.04,
              marginBottom: 15
            }}
            placeholder="Masukkan email kamu"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <Text className="text-black font-semibold mb-1" style={{ fontSize: width * 0.04 }}>
            Password
          </Text>
          <View 
            className="bg-white rounded-xl px-4 flex-row items-center"
            style={{
              width: width * 0.82,
              height: height * 0.045,
              marginBottom: 15
            }}
          >
            <TextInput
              className="flex-1 text-gray-600"
              style={{ fontSize: width * 0.04 }}
              placeholder="Masukkan password kamu"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image 
                source={require('../../assets/images/eye.png')} 
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <Text className="text-black font-semibold mb-1" style={{ fontSize: width * 0.04 }}>
            Konfirmasi Password
          </Text>
          <View 
            className="bg-white rounded-xl px-4 flex-row items-center"
            style={{
              width: width * 0.82,
              height: height * 0.045,
              marginBottom: height * 0.05
            }}
          >
            <TextInput
              className="flex-1 text-gray-600"
              style={{ fontSize: width * 0.04 }}
              placeholder="Masukkan kembali password kamu"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Image 
                source={require('../../assets/images/eye.png')} 
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            className="bg-pink-400 rounded-2xl justify-center items-center"
            style={{
              width: width * 0.8,
              height: height * 0.06,
              backgroundColor: '#F789AC',
              marginBottom: height * 0.025
            }}
            onPress={() => router.push('/login')}
          >
            <Text 
              className="text-white font-bold"
              style={{ fontSize: width * 0.045 }}
            >
              Registrasi
            </Text>
          </TouchableOpacity>

          {/* Google Register Button */}
          {/* <TouchableOpacity 
            className="bg-white rounded-2xl flex-row items-center justify-center"
            style={{
              width: width * 0.8,
              height: height * 0.06,
              marginBottom: height * 0.025
            }}
          >
            <Image 
              source={require('../../assets/images/google.png')} 
              className="w-5 h-5 mr-3"
              resizeMode="contain"
            />
            <Text 
              className="text-black font-medium"
              style={{ fontSize: width * 0.04 }}
            >
              Masuk dengan Google
            </Text>
          </TouchableOpacity> */}

          {/* Login Link */}
          <View className="flex-row justify-center items-center">
            <Text 
              className="text-gray-600"
              style={{ fontSize: width * 0.035 }}
            >
              Sudah punya akun? 
            </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text 
                className="font-semibold ml-1"
                style={{ 
                  color: '#F789AC',
                  fontSize: width * 0.035 
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}