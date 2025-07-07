import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StatusBar, Dimensions, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

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
  
  // Modal states
  const [showAlergiModal, setShowAlergiModal] = useState(false);
  const [showMedisModal, setShowMedisModal] = useState(false);
  const [customAlergi, setCustomAlergi] = useState('');
  const [customMedis, setCustomMedis] = useState('');

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

  const handleSubmit = () => {
    console.log('Data submitted:', {
      namaLengkap,
      usia,
      isVegetarian,
      kondisiFinansial,
      alergi,
      kondisiMedis
    });
    router.push('/(tabs)');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#F99AB6" className='font-poppins' />
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

        {/* Data Form Card */}
        <View 
          className="absolute bg-pink-low"
          style={{
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
              className="text-xl font-bold text-black text-center mb-6"
              style={{ fontSize: width * 0.055 }}
            >
              Lengkapi Data Diri Anda
            </Text>

            {/* Nama Lengkap Input */}
            <Text className="text-black font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Nama Lengkap
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 text-gray-600 mb-4"
              style={{
                width: width * 0.88,
                height: height * 0.05,
                fontSize: width * 0.04,
              }}
              placeholder="Masukkan nama lengkap kamu"
              placeholderTextColor="#999"
              value={namaLengkap}
              onChangeText={setNamaLengkap}
            />

            {/* Usia Input */}
            <Text className="text-black font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Usia
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 text-gray-600 mb-4"
              style={{
                width: width * 0.88,
                height: height * 0.05,
                fontSize: width * 0.04,
              }}
              placeholder="Masukkan usia kamu"
              placeholderTextColor="#999"
              value={usia}
              onChangeText={setUsia}
              keyboardType="numeric"
            />

            {/* Vegetarian Toggle */}
            <Text className="text-black font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Vegetarian?
            </Text>
            <View className="flex-row items-center justify-between mb-6">
  
              <TouchableOpacity
                onPress={() => setIsVegetarian(!isVegetarian)}
                style={{
                  width: width * 0.13,
                  height: height * 0.035,
                  borderRadius: height * 0.0175,
                  backgroundColor: isVegetarian ? '#F789AC' : '#E5E5E5',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
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
            <Text className="text-black font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Kondisi Finansial
            </Text>
            <View 
              className="bg-white rounded-xl mb-4"
              style={{
                width: width * 0.88,
                height: height * 0.05,
              }}
            >
              <Picker
                selectedValue={kondisiFinansial}
                onValueChange={(itemValue) => setKondisiFinansial(itemValue)}
                style={{
                  height: height * 0.05,
                  width: width * 0.88,
                }}
                itemStyle={{
                  fontSize: width * 0.04,
                  height: height * 0.05,
                }}
                className='rounded-2xl pl-2'
              >
                <Picker.Item label="Pilih kondisi finansial" value="" color="#999" enabled= {false} />
                <Picker.Item label="Rendah" value="Rendah" />
                <Picker.Item label="Menengah" value="Menengah" />
                <Picker.Item label="Tinggi" value="Tinggi" />
              </Picker>
            </View>

            {/* Alergi Multi Select */}
            <Text className="text-black font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Alergi
            </Text>
            <TouchableOpacity
              onPress={() => setShowAlergiModal(true)}
              style={{
                width: width * 0.88,
                minHeight: height * 0.05,
                backgroundColor: '#fff',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: 16,
                justifyContent: 'center'
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
            <Text className="text-black font-semibold mb-2" style={{ fontSize: width * 0.04 }}>
              Kondisi Medis
            </Text>
            <TouchableOpacity
              onPress={() => setShowMedisModal(true)}
              style={{
                width: width * 0.88,
                minHeight: height * 0.05,
                backgroundColor: '#fff',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: 32,
                justifyContent: 'center'
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
              className="bg-pink-medium rounded-2xl justify-center items-center self-center"
              style={{
                width: width * 0.88,
                height: height * 0.06,
                backgroundColor: '#F789AC',
              }}
              onPress={handleSubmit}
            >
              <Text 
                className="text-white font-bold"
                style={{ fontSize: width * 0.045 }}
              >
                Simpan
              </Text>
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