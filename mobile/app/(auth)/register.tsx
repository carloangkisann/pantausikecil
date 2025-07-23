import  { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
      <LinearGradient
        colors={['#F99AB6', '#F278A0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
       <View className="flex-row items-center justify-center pt-8 pb-4 mx-auto">
          <Image 
            source={require('../../assets/images/pantausikecil.png')} 
            style={{ width: 100, height: 100 }}
            className="mx-auto"
            resizeMode="contain"
          />
          <Text 
            className="text-white text-lg font-medium text-center mr-12 font-poppins leading-5"
          >
            Selamat datang,{'\n'}calon Bunda hebat!
          </Text>
        </View>


        {/* Register Card */}
        <View 
          className="bg-pink-low rounded-t-2xl w-full h-full p-4 " 
        >
          <Text className="text-xl font-bold text-black text-center mb-4 font-poppins" >
            Registrasi
          </Text>

   
          {/* Email Input */}
          <Text className="text-black font-semibold font-poppins text-sm" >
            Email
          </Text>
          <TextInput
            className="bg-white rounded-lg px-3 py-1 text-gray-1 mt-2 font-poppins text-sm min-h-8"
            placeholder="Masukkan email kamu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          {/* Password Input */}
          <Text className="text-black font-semibold  mt-2 font-poppins" >
            Password
          </Text>
          <View 
            className="bg-white rounded-lg flex-row px-1  mt-2 justify-between items-center"
          >
            <TextInput
              className="bg-white rounded-lg text-gray-1 py-2 font-poppins text-sm flex-1"
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
                className="w-6 h-6"
                resizeMode="contain"
              /> */}
                <Feather name={showPassword?'eye':'eye-off'} size = {width*0.04}></Feather>
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <Text className="text-black font-semibold mt-2 font-poppins " >
            Konfirmasi Password 
          </Text>
          <View 
            className="bg-white rounded-lg px-1  mt-2 flex-row justify-between items-center"
          >
            <TextInput
              className="bg-white rounded-lg text-gray-1 py-2 font-poppins text-sm flex-1"
              placeholder="Masukkan kembali password kamu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {/* <Image 
                source={require('../../assets/images/eye.png')} 
                className="w-6 h-6"
                resizeMode="contain"
              /> */}
              <Feather name={showConfirmPassword?'eye':'eye-off'} size = {width*0.04}></Feather>
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            className="bg-pink-medium rounded-2xl justify-center items-center mt-12 py-2"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text 
                className="text-white font-semibold text-lg font-poppins"
              >
                Registrasi
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center items-center mt-3">
            <Text 
              className="text-gray-600 font-poppins text-xs"
            >
              Sudah punya akun? 
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/login')}
              disabled={loading}
            >
              <Text 
                className="font-semibold ml-1 text-[#F789AC] text-xs font-poppins "
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