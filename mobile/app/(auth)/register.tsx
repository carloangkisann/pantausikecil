import  { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    // Validasi input
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Mohon isi semua field yang diperlukan');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    try {
      const result = await register(email, password);
      
      if (result.success) {
        router.push('/isidata') 
    
      } else {
        Alert.alert('Registrasi Gagal', result.message);
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat registrasi');
    }
  };

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
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ position: 'absolute', left: width * 0.05, zIndex: 1 }}
          >
            <Image 
              source={require('../../assets/images/back-arrow.png')} 
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
          
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
            height: height,
            top: height * 0.18,
            backgroundColor: '#FFE3EC',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            paddingHorizontal: width * 0.06,
            paddingTop: height * 0.05,
          }}
        >
          <Text className="text-xl font-bold text-black text-center mb-4">
            Registrasi
          </Text>

   
          {/* Email Input */}
          <Text className="text-black font-semibold mb-1" style={{ fontSize: width * 0.04 }}>
            Email *
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
            editable={!loading}
          />

          {/* Password Input */}
          <Text className="text-black font-semibold mb-1" style={{ fontSize: width * 0.04 }}>
            Password *
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
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Image 
                source={require('../../assets/images/eye.png')} 
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <Text className="text-black font-semibold mb-1" style={{ fontSize: width * 0.04 }}>
            Konfirmasi Password *
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
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
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
              backgroundColor: loading ? '#F99AB6' : '#F789AC',
              marginBottom: height * 0.025,
              opacity: loading ? 0.7 : 1
            }}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text 
                className="text-white font-bold"
                style={{ fontSize: width * 0.045 }}
              >
                Registrasi
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center items-center">
            <Text 
              className="text-gray-600"
              style={{ fontSize: width * 0.035 }}
            >
              Sudah punya akun? 
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/login')}
              disabled={loading}
            >
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