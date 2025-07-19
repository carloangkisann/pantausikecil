import  { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Feather } from '@expo/vector-icons';
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
  const width = Dimensions.get('window').width;

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
            className="text-white text-lg font-medium text-center mr-12 font-poppins leading-5"
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
          className="rounded-[30px] mx-4 px-6 pt-8 pb-6 mt-2 bg-pink-low"
        >
          <Text className="text-black text-2xl font-bold text-center mb-6 font-poppins">
            Login
          </Text>

          {/* Email Input */}
          <Text className="text-black text-sm font-semibold mb-2 font-poppins">
            Email
          </Text>
          <TextInput
            className="rounded-xl px-4 py-3 text-sm mb-4 bg-white text-gray-1 font-poppins"
            placeholder="Masukkan email kamu" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          {/* Password Input */}
          <Text className="text-black text-sm font-semibold mb-2 font-poppins">
            Password
          </Text>
          <View className="rounded-xl px-4 py-3 mb-6 flex-row items-center bg-white " >
            <TextInput
              className="flex-1 text-sm bg-white text-gray-1 font-poppins"
              placeholder="Masukkan password kamu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
 
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {/* <Image 
                source={require('../../assets/images/eye.png')} 
                className="w-5 h-5"
                resizeMode="contain"
              /> */}
              <Feather name={showPassword?'eye':'eye-off'} size = {width*0.04}></Feather>
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
              <Text className="text-white text-base font-bold text-center font-poppins">
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-xs font-poppins">
              Belum punya akun? 
            </Text>
            <TouchableOpacity 
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-xs font-semibold ml-1 font-poppins" style={{ color: '#F278A0' }}>
                Registrasi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}