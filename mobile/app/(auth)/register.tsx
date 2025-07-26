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
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
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

    // Validasi persetujuan
    if (!agreeToTerms) {
      Alert.alert('Error', 'Mohon setujui syarat dan ketentuan penggunaan data');
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

  const handleTermsPress = () => {
    Alert.alert(
      'Syarat dan Ketentuan',
      'Dengan mendaftar, Anda menyetujui penggunaan data pribadi sesuai dengan kebijakan privasi kami untuk memberikan layanan terbaik.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPress = () => {
    Alert.alert(
      'Kebijakan Privasi',
      `Tanggal berlaku: 26 Juli 2025

Aplikasi PantauSiKecil berkomitmen untuk melindungi privasi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan mengungkapkan informasi Anda saat Anda menggunakan layanan kami.

1. Pengumpulan dan Penggunaan Informasi

1.1 Informasi Pribadi
Kami dapat mengumpulkan informasi pribadi yang Anda berikan secara sukarela, seperti nama lengkap, alamat email, serta informasi kehamilan dan kesehatan yang Anda isi secara manual. Informasi ini digunakan semata-mata untuk menyediakan layanan aplikasi sesuai kebutuhan Anda, menyesuaikan fitur berbasis AI sesuai kondisi pengguna, serta meningkatkan kualitas dan pengalaman pengguna secara keseluruhan.

1.2 Informasi Perangkat
Kami juga dapat mengumpulkan informasi tertentu secara otomatis dari perangkat Anda, termasuk namun tidak terbatas pada jenis dan model perangkat, versi sistem operasi, alamat IP dan ID perangkat unik, dan informasi jaringan. Informasi ini digunakan untuk memastikan kinerja aplikasi yang optimal, serta meningkatkan keamanan dan stabilitas sistem.

2. Berbagi dan Pengungkapan Informasi

2.1 Penyedia Layanan Pihak Ketiga
Kami dapat bekerja sama dengan pihak ketiga terpercaya untuk membantu dalam pengembangan, pengoperasian, atau analisis aplikasi. Pihak ketiga ini dapat mengakses informasi pribadi Anda hanya untuk tujuan yang ditentukan dan wajib menjaga kerahasiaannya sesuai dengan perjanjian kerahasiaan (NDA) dan peraturan perlindungan data yang berlaku.

2.2 Kewajiban Hukum
Kami dapat mengungkapkan informasi pribadi Anda jika diminta oleh hukum atau sebagai bagian dari proses hukum yang sah, seperti perintah pengadilan atau permintaan resmi dari penegak hukum.

3. Keamanan Data

Kami menerapkan langkah-langkah keamanan teknis dan administratif yang sesuai standar industri untuk melindungi informasi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.

Namun, perlu diingat bahwa tidak ada metode transmisi data melalui internet atau penyimpanan elektronik yang sepenuhnya aman. Oleh karena itu, meskipun kami berupaya maksimal, kami tidak dapat menjamin keamanan absolut dari data Anda.`,
      [{ text: 'OK' }]
    )
  }

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
              <Feather name={showConfirmPassword?'eye':'eye-off'} size = {width*0.04}></Feather>
            </TouchableOpacity>
          </View>

          {/* Agreement Checkbox */}
          <View className="flex-row items-start mt-4 px-1">
            <TouchableOpacity 
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              disabled={loading}
              className="mr-3 mt-1"
            >
              <View 
                className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  agreeToTerms 
                    ? 'bg-pink-medium border-pink-medium' 
                    : 'bg-white border-gray-300'
                }`}
              >
                {agreeToTerms && (
                  <Feather name="check" size={12} color="white" />
                )}
              </View>
            </TouchableOpacity>
            
            <View className="flex-1">
              <Text className="text-gray-600 font-poppins text-xs leading-4">
                Saya menyetujui{' '}
                <Text 
                  className="text-[#F789AC] font-semibold"
                  onPress={handleTermsPress}
                >
                  syarat dan ketentuan
                </Text>
                {' '}serta{' '}
                <Text 
                  className="text-[#F789AC] font-semibold"
                  onPress={handlePrivacyPress}
                >
                  kebijakan privasi
                </Text>
                {' '}penggunaan data pribadi untuk memberikan layanan yang optimal.
              </Text>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            className={`rounded-2xl justify-center items-center mt-8 py-2 ${
              agreeToTerms && !loading 
                ? 'bg-pink-medium' 
                : 'bg-gray-300'
            }`}
            onPress={handleRegister}
            disabled={loading || !agreeToTerms}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text 
                className={`font-semibold text-lg font-poppins ${
                  agreeToTerms ? 'text-white' : 'text-gray-500'
                }`}
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