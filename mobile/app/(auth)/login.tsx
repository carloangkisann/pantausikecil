import  { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
// import {apiService} from '../../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');
  
  const { login, loading } = useAuth();

  // useEffect(() => {
  //   checkConnection();
  // }, []);

  // const checkConnection = async () => {
  //   try {
  //     const isConnected = await apiService.testConnection();
  //     setConnectionStatus(isConnected ? 'Connected' : 'Disconnected');
  //   } catch (error) {
  //     setConnectionStatus('Error');
  //   }
  // };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Mohon isi email dan password');
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        Alert.alert('Success', 'Login berhasil!');
        
        // Beri sedikit delay untuk AuthContext update
        setTimeout(() => {
          // if (isProfileComplete) {
          //   router.push('/(tabs)'); // Ke main app jika profil sudah lengkap
          // } else {
          //   router.push('/isidata'); // Ke isidata jika profil belum lengkap
          // }
           router.push('/beranda'); 
        }, 100);
      } else {
        Alert.alert('Login Gagal', `${result.message}\n\nCoba daftar terlebih dahulu jika belum punya akun.`);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat login');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

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
            className="text-white text-lg font-medium text-center mr-12"
            style={{ 
              lineHeight: 18,
              fontFamily: 'Poppins-Medium'
            }}
          >
            Selamat datang kembali,{'\n'}calon Bunda hebat!
          </Text>
        </View>

        {/* Connection Status */}
        {/* <View className="mx-4 mb-2">
          <Text className="text-white text-xs text-center">
            Backend: {connectionStatus}
          </Text>
        </View> */}

        {/* Login Card */}
        <View 
          className="rounded-[30px] mx-4 px-6 pt-8 pb-6 mt-2"
          style={{ backgroundColor: '#FFF0F5' }}
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
            editable={!loading}
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
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Image 
                source={require('../../assets/images/eye.png')} 
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            className="rounded-xl py-4 mb-4 flex-row items-center justify-center"
            style={{ 
              backgroundColor: loading ? '#F99AB6' : '#F278A0',
              opacity: loading ? 0.7 : 1 
            }}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white text-base font-bold text-center">
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-xs">
              Belum punya akun? 
            </Text>
            <TouchableOpacity 
              onPress={handleRegister}
              disabled={loading}
            >
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