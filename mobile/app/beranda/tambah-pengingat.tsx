import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Platform, TextInput, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { CreateReminderRequest } from '../../types';
import { FontAwesome5 } from '@expo/vector-icons';

export default function TambahPengingat() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    tanggal: new Date(),
    waktuMulai: new Date(),
    waktuSelesai: new Date()
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({...formData, tanggal: selectedDate});
    }
  };

  const handleStartTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setFormData({...formData, waktuMulai: selectedTime});
    }
  };

  const handleEndTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setFormData({...formData, waktuSelesai: selectedTime});
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: Date): string => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateForAPI = (date: Date): string => {
    // Format: YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForAPI = (time: Date): string => {
    // ✅ Fix: Format HH:MM:SS (backend expects this format)
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const validateTimeRange = (): boolean => {
    const startTime = formData.waktuMulai.getTime();
    const endTime = formData.waktuSelesai.getTime();
    
    if (endTime <= startTime) {
      Alert.alert('Error', 'Waktu selesai harus lebih besar dari waktu mulai');
      return false;
    }
    
    return true;
  };

  const handleSimpan = async () => {
    // Validation
    if (!formData.nama.trim()) {
      Alert.alert('Error', 'Nama pengingat harus diisi');
      return;
    }
    
    if (!formData.deskripsi.trim()) {
      Alert.alert('Error', 'Deskripsi harus diisi');
      return;
    }

    // Validate time range
    if (!validateTimeRange()) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User tidak ditemukan. Silakan login kembali.');
      return;
    }

    setLoading(true);

    try {
      // Prepare data untuk API
      const reminderData: CreateReminderRequest = {
        title: formData.nama.trim(),
        description: formData.deskripsi.trim(),
        reminderDate: formatDateForAPI(formData.tanggal),
        startTime: formatTimeForAPI(formData.waktuMulai),
        endTime: formatTimeForAPI(formData.waktuSelesai),
      };

      console.log('Creating reminder:', reminderData);

      // Call API untuk create reminder
      const response = await apiService.createReminder(user.id, reminderData);

      if (response.success) {
        Alert.alert(
          'Berhasil', 
          'Pengingat berhasil ditambahkan',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Gagal menambahkan pengingat');
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menambahkan pengingat');
    } finally {
      setLoading(false);
    }
  };
  
  const width = Dimensions.get('window').width;
  
  return (
    <View className="flex-1 bg-pink-medium">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4 mt-2">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="min-w-10 min-h-10 items-center justify-center"
        >
          <FontAwesome5 name='arrow-circle-left' color='white' size={0.083*width} />
        </TouchableOpacity>
        
        <Text className="text-white text-lg font-semibold flex-1 text-center mx-auto font-poppins">
          Tambah Pengingat
        </Text>
      </View>
        
      {/* Content Area */}
      <View className="flex-1 bg-pink-low rounded-t-3xl px-4 pt-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Nama */}
          <View className="mb-6">
            <Text className="text-black-low font-semibold mb-3 text-lg font-poppins">
              Nama *
            </Text>
            <TextInput
              value={formData.nama}
              onChangeText={(text) => setFormData({...formData, nama: text})}
              className="bg-white rounded-xl px-4 py-4 font-poppins"
              placeholder="Contoh: Konsultasi Kehamilan Ketiga"
              placeholderTextColor="#999999"
              style={{ fontSize: 14, color: '#666666' }}
              editable={!loading}
            />
          </View>

          {/* Deskripsi */}
          <View className="mb-6">
            <Text className="text-black-low font-semibold mb-3 text-lg font-poppins">
              Deskripsi *
            </Text>
            <TextInput
              value={formData.deskripsi}
              onChangeText={(text) => setFormData({...formData, deskripsi: text})}
              className="bg-white rounded-xl px-4 py-4 font-poppins"
              placeholder="Contoh: Jangan lupa bawa buku KIA"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={{ fontSize: 14, color: '#666666', minHeight: 80 }}
              editable={!loading}
            />
          </View>

          {/* Tanggal */}
          <View className="mb-6">
            <Text className="text-black-low font-semibold mb-3 text-lg font-poppins">
              Tanggal *
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-white rounded-xl px-4 py-4 flex-row items-center justify-between"
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <Text style={{ fontSize: 14, color: formData.tanggal ? '#666666' : '#999999' }} className='text-gray-1'>
                {formData.tanggal ? formatDate(formData.tanggal) : 'Pilih tanggal'}
              </Text>
              <Image 
                source={require('../../assets/images/calendar-search.png')} 
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

          {/* Waktu Mulai */}
          <View className="mb-6">
            <Text className="text-black-low font-semibold mb-3 text-lg font-poppins">
              Waktu Mulai *
            </Text>
            <TouchableOpacity
              onPress={() => setShowStartTimePicker(true)}
              className="bg-white rounded-xl px-4 py-4 flex-row items-center justify-between"
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <Text className='text-sm text-gray-1'>
                {formatTime(formData.waktuMulai)}
              </Text>
              <FontAwesome5 name="clock" size={16} color="#999999" />
            </TouchableOpacity>
          </View>

          {/* Waktu Selesai */}
          <View className="mb-8">
            <Text className="text-black-low font-semibold mb-3 text-lg font-poppins">
              Waktu Selesai *
            </Text>
            <TouchableOpacity
              onPress={() => setShowEndTimePicker(true)}
              className="bg-white rounded-xl px-4 py-4 flex-row items-center justify-between"
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <Text className='text-sm text-gray-1'>
                {formatTime(formData.waktuSelesai)}
              </Text>
              <FontAwesome5 name="clock" size={16} color="#999999" />
            </TouchableOpacity>
          </View>

          {/* Simpan Button */}
          <TouchableOpacity 
            onPress={handleSimpan}
            className="bg-pink-medium rounded-2xl py-4 items-center mb-8"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white font-semibold text-lg font-poppins">
                Simpan
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.tanggal}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Start Time Picker */}
      {showStartTimePicker && (
        <DateTimePicker
          value={formData.waktuMulai}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartTimeChange}
        />
      )}

      {/* End Time Picker */}
      {showEndTimePicker && (
        <DateTimePicker
          value={formData.waktuSelesai}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndTimeChange}
        />
      )}
    </View>
  );
}