import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import {apiService} from '../../services/api';
import { UpdateProfileRequest } from '../../types';

const { width, height } = Dimensions.get('window');

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
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        backgroundColor: '#FFE3EC',
        width: width * 0.9,
        maxHeight: height * 0.7,
        borderRadius: 20,
        padding: 20
      }}>
        <Text style={{ fontSize: width * 0.05, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#333' }}>
          {title}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((item: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelect(item)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: selected.includes(item) ? '#F789AC' : '#fff',
                marginBottom: 8,
                borderRadius: 12,
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: selected.includes(item) ? '#fff' : 'transparent',
                borderWidth: 2,
                borderColor: selected.includes(item) ? '#fff' : '#F789AC',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                {selected.includes(item) && (
                  <Text style={{ color: '#F789AC', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                )}
              </View>
              <Text style={{ 
                color: selected.includes(item) ? '#fff' : '#333',
                fontSize: width * 0.04,
                fontWeight: selected.includes(item) ? 'bold' : 'normal'
              }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Custom Input */}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: width * 0.04, fontWeight: 'bold', marginBottom: 8, color: '#333' }}>
              Tambah Manual:
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: width * 0.04,
                  marginRight: 8
                }}
                placeholder="Ketik manual..."
                value={customValue}
                onChangeText={setCustomValue}
              />
              <TouchableOpacity
                onPress={onAddCustom}
                style={{
                  backgroundColor: '#F789AC',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                  justifyContent: 'center'
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: '#F789AC',
            paddingVertical: 12,
            borderRadius: 12,
            marginTop: 20,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: width * 0.04 }}>
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
      <StatusBar barStyle="light-content" backgroundColor="#F99AB6" />
      <LinearGradient
        colors={['#FF9EBD', '#F2789F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View 
          style={{
            position: 'absolute',
            top: height * 0.06,
            left: 0,
            width: width,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: width * 0.025,
          }}
        >
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ position: 'absolute', left: width * 0.05, zIndex: 1 }}
            disabled={loading}
          >
            <Image 
              source={require('../../assets/images/back-arrow.png')} 
              style={{ width: 24, height: 24 }}
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
            style={{
              flex: 1,
              color: '#fff',
              fontSize: width * 0.05,
              fontWeight: '500',
              textAlign: 'center',
              lineHeight: width * 0.06
            }}
          >
            Selamat datang,{'\n'}calon Bunda hebat!
          </Text>
        </View>

        {/* Data Form Card */}
        <View 
          style={{
            position: 'absolute',
            width: width,
            height: height,
            top: height * 0.18,
            backgroundColor: '#FFE3EC',
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            paddingHorizontal: width * 0.06,
            paddingTop: height * 0.03,
          }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: height * 0.15 }}
          >
            <Text 
              style={{
                fontSize: width * 0.055,
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                marginBottom: 24
              }}
            >
              Lengkapi Data Diri Anda
            </Text>

            {/* Nama Lengkap Input */}
            <Text style={{ fontSize: width * 0.04, fontWeight: '600', color: '#333', marginBottom: 8 }}>
              Nama Lengkap *
            </Text>
            <TextInput
              style={{
                width: width * 0.88,
                height: height * 0.05,
                backgroundColor: '#fff',
                borderRadius: 12,
                paddingHorizontal: 16,
                fontSize: width * 0.04,
                color: '#666',
                marginBottom: 16
              }}
              placeholder="Masukkan nama lengkap kamu"
              placeholderTextColor="#999"
              value={namaLengkap}
              onChangeText={setNamaLengkap}
              editable={!loading}
            />

            {/* Usia Input */}
            <Text style={{ fontSize: width * 0.04, fontWeight: '600', color: '#333', marginBottom: 8 }}>
              Usia *
            </Text>
            <TextInput
              style={{
                width: width * 0.88,
                height: height * 0.05,
                backgroundColor: '#fff',
                borderRadius: 12,
                paddingHorizontal: 16,
                fontSize: width * 0.04,
                color: '#666',
                marginBottom: 16
              }}
              placeholder="Masukkan usia kamu"
              placeholderTextColor="#999"
              value={usia}
              onChangeText={setUsia}
              keyboardType="numeric"
              editable={!loading}
            />

            {/* Vegetarian Toggle */}
            <Text style={{ fontSize: width * 0.04, fontWeight: '600', color: '#333', marginBottom: 8 }}>
              Vegetarian?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
              <TouchableOpacity
                onPress={() => setIsVegetarian(!isVegetarian)}
                disabled={loading}
                style={{
                  width: width * 0.13,
                  height: height * 0.035,
                  borderRadius: height * 0.0175,
                  backgroundColor: isVegetarian ? '#F789AC' : '#E5E5E5',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <View
                  style={{
                    width: height * 0.029,
                    height: height * 0.029,
                    borderRadius: height * 0.0145,
                    backgroundColor: '#fff',
                    alignSelf: isVegetarian ? 'flex-end' : 'flex-start',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3,
                    elevation: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {isVegetarian && (
                    <Text 
                      style={{ 
                        color: '#F789AC', 
                        fontSize: width * 0.025, 
                        fontWeight: 'bold',
                        lineHeight: width * 0.025
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Kondisi Finansial Picker */}
            <Text style={{ fontSize: width * 0.04, fontWeight: '600', color: '#333', marginBottom: 8 }}>
              Kondisi Finansial *
            </Text>
            <View 
              style={{
                width: width * 0.88,
                height: height * 0.05,
                backgroundColor: '#fff',
                borderRadius: 12,
                marginBottom: 16,
                opacity: loading ? 0.5 : 1,
              }}
            >
              <Picker
                selectedValue={kondisiFinansial}
                onValueChange={(itemValue) => setKondisiFinansial(itemValue)}
                enabled={!loading}
                style={{
                  height: height * 0.05,
                  width: width * 0.88,
                }}
              >
                <Picker.Item label="Pilih kondisi finansial" value="" color="#999" enabled={false} />
                <Picker.Item label="Rendah" value="Rendah" />
                <Picker.Item label="Menengah" value="Menengah" />
                <Picker.Item label="Tinggi" value="Tinggi" />
              </Picker>
            </View>

            {/* Alergi Multi Select */}
            <Text style={{ fontSize: width * 0.04, fontWeight: '600', color: '#333', marginBottom: 8 }}>
              Alergi
            </Text>
            <TouchableOpacity
              onPress={() => setShowAlergiModal(true)}
              disabled={loading}
              style={{
                width: width * 0.88,
                minHeight: height * 0.05,
                backgroundColor: '#fff',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 12,
                marginBottom: 16,
                justifyContent: 'center',
                opacity: loading ? 0.5 : 1,
              }}
            >
              <Text style={{ 
                color: alergi.length > 0 ? '#333' : '#999',
                fontSize: width * 0.04 
              }}>
                {alergi.length > 0 ? alergi.join(', ') : 'Pilih alergi (bisa lebih dari 1)'}
              </Text>
            </TouchableOpacity>

            {/* Kondisi Medis Multi Select */}
            <Text style={{ fontSize: width * 0.04, fontWeight: '600', color: '#333', marginBottom: 8 }}>
              Kondisi Medis
            </Text>
            <TouchableOpacity
              onPress={() => setShowMedisModal(true)}
              disabled={loading}
              style={{
                width: width * 0.88,
                minHeight: height * 0.05,
                backgroundColor: '#fff',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 12,
                marginBottom: 32,
                justifyContent: 'center',
                opacity: loading ? 0.5 : 1,
              }}
            >
              <Text style={{ 
                color: kondisiMedis.length > 0 ? '#333' : '#999',
                fontSize: width * 0.04 
              }}>
                {kondisiMedis.length > 0 ? kondisiMedis.join(', ') : 'Pilih kondisi medis (bisa lebih dari 1)'}
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
              style={{
                width: width * 0.88,
                height: height * 0.06,
                backgroundColor: loading ? '#F99AB6' : '#F789AC',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text 
                  style={{
                    color: '#fff',
                    fontSize: width * 0.045,
                    fontWeight: 'bold'
                  }}
                >
                  Simpan
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>

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