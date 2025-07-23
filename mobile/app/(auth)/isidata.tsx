import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Modal, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { UpdateProfileRequest } from '../../types';
import { AntDesign } from '@expo/vector-icons';
import CustomPicker from '../components/CustomPicker';// Import CustomPicker

interface MultiSelectModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selected: string[];
  onSelect: (item: string) => void;
  customValue: string;
  setCustomValue: (value: string) => void;
  onAddCustom: () => void;
}
const width = Dimensions.get('window').width;

// Data options untuk CustomPicker
const kondisiFinansialOptions = [
  { label: 'Rendah', value: 'Rendah' },
  { label: 'Menengah', value: 'Menengah' },
  { label: 'Tinggi', value: 'Tinggi' },
];

const MultiSelectModal: React.FC<MultiSelectModalProps> = ({ 
  visible, 
  onClose, 
  title, 
  options, 
  selected, 
  onSelect, 
  customValue, 
  setCustomValue, 
  onAddCustom
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 bg-black/50 justify-center items-center">
      <View className="bg-pink-low w-[90%] max-h-[70%] rounded-xl p-5">
        <Text className="text-xl sm:text-2xl lg:text-3xl font-poppins-bold text-center mb-5 text-black-3">
          {title}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((item: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelect(item)}
              className={`flex-row items-center py-3 px-4 mb-2 rounded-xl ${
                selected.includes(item) ? 'bg-pink-medium' : 'bg-white'
              }`}
            >
              <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                selected.includes(item) 
                  ? 'bg-white border-white' 
                  : 'bg-transparent border-pink-medium'
              }`}>
                {selected.includes(item) && (
                  <Text className="text-pink-medium text-xs font-bold">✓</Text>
                )}
              </View>
              <Text className={`text-sm sm:text-base lg:text-lg font-poppins ${
                selected.includes(item) 
                  ? 'text-white font-poppins-bold' 
                  : 'text-black-3 font-poppins'
              }`}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Custom Input */}
          <View className="mt-4">
            <Text className="text-sm sm:text-base lg:text-lg font-poppins-bold mb-2 text-black-3">
              Tambah Manual:
            </Text>
            <View className="flex-row">
              <TextInput
                className="flex-1 bg-white rounded-xl px-3 py-2.5 text-sm sm:text-base lg:text-lg mr-2 font-poppins"
                placeholder="Ketik manual..."
                value={customValue}
                onChangeText={setCustomValue}
              />
              <TouchableOpacity
                onPress={onAddCustom}
                className="bg-pink-medium p-2 rounded-2xl justify-center"
              >
                <AntDesign name='plus' size={width*0.048} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        <TouchableOpacity
          onPress={onClose}
          className="bg-pink-medium py-3 rounded-xl mt-5 items-center"
        >
          <Text className="text-white font-poppins-bold text-sm sm:text-base lg:text-lg">
            Selesai
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default function IsidataScreen() {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [usia, setUsia] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [kondisiFinansial, setKondisiFinansial] = useState('');
  const [alergi, setAlergi] = useState<string[]>([]);
  const [kondisiMedis, setKondisiMedis] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showAlergiModal, setShowAlergiModal] = useState(false);
  const [showMedisModal, setShowMedisModal] = useState(false);
  const [customAlergi, setCustomAlergi] = useState('');
  const [customMedis, setCustomMedis] = useState('');

  // Get user from auth context
  const { user, updateUserProfile } = useAuth();

  // Options data
  const alergiOptions = ['Tidak Ada', 'Kacang', 'Susu', 'Seafood', 'Telur', 'Gandum'];
  const medisOptions = ['Tidak Ada', 'Anemia', 'Asma', 'Diabetes', 'Hipertensi', 'Kolesterol'];

  const handleAlergiSelect = useCallback((item: string) => {
    if (item === 'Tidak Ada') {
      setAlergi(['Tidak Ada']);
    } else {
      setAlergi(prev => {
        const filteredAlergi = prev.filter(a => a !== 'Tidak Ada');
        if (filteredAlergi.includes(item)) {
          return filteredAlergi.filter(a => a !== item);
        } else {
          return [...filteredAlergi, item];
        }
      });
    }
  }, []);

  const handleMedisSelect = useCallback((item: string) => {
    if (item === 'Tidak Ada') {
      setKondisiMedis(['Tidak Ada']);
    } else {
      setKondisiMedis(prev => {
        const filteredMedis = prev.filter(m => m !== 'Tidak Ada');
        if (filteredMedis.includes(item)) {
          return filteredMedis.filter(m => m !== item);
        } else {
          return [...filteredMedis, item];
        }
      });
    }
  }, []);

  const addCustomAlergi = useCallback(() => {
    if (customAlergi.trim() && !alergi.includes(customAlergi.trim())) {
      setAlergi(prev => {
        const filteredAlergi = prev.filter(a => a !== 'Tidak Ada');
        return [...filteredAlergi, customAlergi.trim()];
      });
      setCustomAlergi('');
    }
  }, [customAlergi, alergi]);

  const addCustomMedis = useCallback(() => {
    if (customMedis.trim() && !kondisiMedis.includes(customMedis.trim())) {
      setKondisiMedis(prev => {
        const filteredMedis = prev.filter(m => m !== 'Tidak Ada');
        return [...filteredMedis, customMedis.trim()];
      });
      setCustomMedis('');
    }
  }, [customMedis, kondisiMedis]);

  // Handler untuk kondisi finansial
  const handleKondisiFinansialChange = (value: string | number) => {
    setKondisiFinansial(value as string);
  };

  const handleSubmit = async () => {
    // Validasi input
    if (!namaLengkap.trim()) {
      Alert.alert('Error', 'Nama lengkap harus diisi');
      return;
    }

    if (!usia.trim()) {
      Alert.alert('Error', 'Usia harus diisi');
      return;
    }

    if (!kondisiFinansial) {
      Alert.alert('Error', 'Kondisi finansial harus dipilih');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User tidak ditemukan. Silakan login kembali.');
      return;
    }

    setLoading(true);

    try {
      // Debug: Cek apakah ada token
      const hasToken = await apiService.isLoggedIn();
      console.log('User has token:', hasToken);
      
      // Prepare data untuk API dengan types yang benar
      const profileData: UpdateProfileRequest = {
        fullName: namaLengkap.trim(),
        age: parseInt(usia),
        isVegetarian: isVegetarian,
        financialStatus: kondisiFinansial as 'Rendah' | 'Menengah' | 'Tinggi',
        allergy: alergi.length > 0 ? alergi.join(', ') : undefined,
        medicalCondition: kondisiMedis.length > 0 ? kondisiMedis.join(', ') : undefined,
      };

      console.log('Sending profile data:', profileData);
      console.log('User ID:', user.id);

      // Call API untuk update profile
      const response = await apiService.updateUserProfile(user.id, profileData);

      if (response.success) {
        // Update user context dengan data baru
        updateUserProfile(profileData);
        
        // Langsung redirect ke beranda
        router.push('/beranda');
      } else {
        Alert.alert('Error', response.message || 'Gagal menyimpan data profil');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LinearGradient
        colors={['#FF9EBD', '#F2789F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <View className="flex-row items-center justify-center items-center pt-8 pb-4 mx-auto">
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

        {/* Data Form Card */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="bg-pink-low rounded-t-3xl w-full h-full p-4"
        >
          <Text className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-poppins-bold text-black-3 text-center mb-4">
            Lengkapi Data Diri Anda
          </Text>

          {/* Nama Lengkap Input */}
          <Text className="text-sm sm:text-base lg:text-lg font-poppins-semibold text-black-3">
            Nama Lengkap *
          </Text>
          <TextInput
            className={`w-full bg-white rounded-lg px-3 py-1 text-sm sm:text-base lg:text-lg text-gray-600 mt-2 font-poppins ${
              loading ? 'opacity-50' : 'opacity-100'
            }`}
            placeholder="Masukkan nama lengkap kamu"
            placeholderTextColor="#999"
            value={namaLengkap}
            onChangeText={setNamaLengkap}
            editable={!loading}
          />

          {/* Usia Input */}
          <Text className="text-sm sm:text-base lg:text-lg font-poppins-semibold text-black-3 mt-2">
            Usia *
          </Text>
          <TextInput
            className={`w-full bg-white rounded-lg px-3 py-1 text-sm sm:text-base lg:text-lg text-gray-600 mt-2 font-poppins ${
              loading ? 'opacity-50' : 'opacity-100'
            }`}
            placeholder="Masukkan usia kamu"
            placeholderTextColor="#999"
            value={usia}
            onChangeText={setUsia}
            keyboardType="numeric"
            editable={!loading}
          />

          {/* Vegetarian Toggle */}
          <Text className="text-sm sm:text-base lg:text-lg font-poppins-semibold text-black-3 mt-2">
            Vegetarian?
          </Text>
          <View className="flex-row items-center mt-2 mb-2">
            <TouchableOpacity
              onPress={() => setIsVegetarian(!isVegetarian)}
              disabled={loading}
              className={`w-12 h-7 sm:w-14 sm:h-8 lg:w-16 lg:h-9 rounded-full justify-center px-1 ${
                isVegetarian ? 'bg-pink-medium' : 'bg-gray-300'
              } ${loading ? 'opacity-50' : 'opacity-100'}`}
            >
              <View className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full bg-white shadow-md justify-center items-center ${
                isVegetarian ? 'self-end' : 'self-start'
              }`}>
                {isVegetarian && (
                  <Text className="text-pink-medium text-xs sm:text-sm lg:text-base font-poppins-bold">
                    ✓
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Kondisi Finansial - menggunakan CustomPicker */}
          <Text className="text-sm sm:text-base lg:text-lg font-poppins-semibold text-black-3 mt-2">
            Kondisi Finansial *
          </Text>
            <CustomPicker
              value={kondisiFinansial}
              onValueChange={handleKondisiFinansialChange}
              items={kondisiFinansialOptions}
              placeholder="Pilih kondisi finansial"
              disabled={loading}
              modalTitle="Kondisi Finansial"
              containerStyle={{
                backgroundColor: 'white',
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 8,
              }}
              textStyle={{
                fontSize: 12,
                fontFamily: 'Poppins',
              }}
            />
      
          {/* Alergi Multi Select */}
          <Text className="text-sm sm:text-base lg:text-lg font-poppins-semibold text-black-3 mt-2">
            Alergi
          </Text>
          <TouchableOpacity
            onPress={() => setShowAlergiModal(true)}
            disabled={loading}
            className={`w-full bg-white rounded-lg px-3 py-1 mt-2 justify-center ${
              loading ? 'opacity-50' : 'opacity-100'
            }`}
          >
            <Text className={`text-sm sm:text-base lg:text-lg font-poppins text-gray-1`}>
              {alergi.length > 0 ? alergi.join(', ') : 'Pilih alergi (bisa lebih dari 1)'}
            </Text>
          </TouchableOpacity>

          {/* Kondisi Medis Multi Select */}
          <Text className="text-sm sm:text-base lg:text-lg font-poppins-semibold text-black-3 mt-2">
            Kondisi Medis
          </Text>
          <TouchableOpacity
            onPress={() => setShowMedisModal(true)}
            disabled={loading}
            className={`w-full bg-white rounded-lg px-3 py-1 mt-2 justify-center ${
              loading ? 'opacity-50' : 'opacity-100'
            }`}
          >
            <Text className={`text-sm sm:text-base lg:text-lg font-poppins text-gray-1`}>
              {kondisiMedis.length > 0 ? kondisiMedis.join(', ') : 'Pilih kondisi medis (bisa lebih dari 1)'}
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity 
            className={`w-full rounded-2xl justify-center items-center mt-12 py-2 ${
              loading 
                ? 'bg-pink-faint-low opacity-70' 
                : 'bg-pink-medium opacity-100'
            }`}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white text-base sm:text-lg lg:text-xl xl:text-2xl font-poppins-semibold">
                Simpan
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Alergi Modal */}
        <MultiSelectModal
          visible={showAlergiModal}
          onClose={() => setShowAlergiModal(false)}
          title="Pilih Alergi"
          options={alergiOptions}
          selected={alergi}
          onSelect={handleAlergiSelect}
          customValue={customAlergi}
          setCustomValue={setCustomAlergi}
          onAddCustom={addCustomAlergi}
        />

        {/* Kondisi Medis Modal */}
        <MultiSelectModal
          visible={showMedisModal}
          onClose={() => setShowMedisModal(false)}
          title="Pilih Kondisi Medis"
          options={medisOptions}
          selected={kondisiMedis}
          onSelect={handleMedisSelect}
          customValue={customMedis}
          setCustomValue={setCustomMedis}
          onAddCustom={addCustomMedis}
        />
      </LinearGradient>
    </>
  );
}