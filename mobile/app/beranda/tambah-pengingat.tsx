import  { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image,Platform, TextInput, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useAuth } from '../../context/AuthContext';
import {apiService} from '../../services/api';
import { CreateReminderRequest } from '../../types';


export default function TambahPengingat() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    tanggal: new Date(),
    waktu: new Date()
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({...formData, tanggal: selectedDate});
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData({...formData, waktu: selectedTime});
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
    // Format: HH:MM
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
        startTime: formatTimeForAPI(formData.waktu),
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

  return (
    <View className="flex-1 bg-pink-medium">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
        <TouchableOpacity 
          onPress={handleGoBack}
          className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          disabled={loading}
        >
          <Image source={require('../../assets/images/back-arrow.png')} />
        </TouchableOpacity>
        
        <Text className="text-white text-xl font-semibold">Tambah Pengingat</Text>
        
        <View className="w-10 h-10" />
      </View>

      {/* Content Area */}
      <View className="flex-1 bg-pink-low rounded-t-3xl px-4 pt-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Nama */}
          <View className="mb-6">
            <Text className="text-black-low font-semibold mb-3 text-lg">
              Nama *
            </Text>
            <TextInput
              value={formData.nama}
              onChangeText={(text) => setFormData({...formData, nama: text})}
              className="bg-white rounded-xl px-4 py-4 shadow-sm"
              placeholder="Contoh: Konsultasi Kehamilan Ketiga"
              placeholderTextColor="#999999"
              style={{ fontSize: 14, color: '#666666' }}
              editable={!loading}
            />
          </View>

          {/* Deskripsi */}
          <View className="mb-6">
            <Text className="text-black-low font-semibold mb-3 text-lg">
              Deskripsi *
            </Text>
            <TextInput
              value={formData.deskripsi}
              onChangeText={(text) => setFormData({...formData, deskripsi: text})}
              className="bg-white rounded-xl px-4 py-4 shadow-sm"
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
            <Text className="text-black-low font-semibold mb-3 text-lg">
              Tanggal *
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-white rounded-xl px-4 py-4 shadow-sm flex-row items-center justify-between"
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <Text style={{ fontSize: 14, color: formData.tanggal ? '#666666' : '#999999' }}>
                {formData.tanggal ? formatDate(formData.tanggal) : 'Pilih tanggal'}
              </Text>
              <Image 
                source={require('../../assets/images/calendar-search.png')} 
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

          {/* Waktu */}
          <View className="mb-8">
            <Text className="text-black-low font-semibold mb-3 text-lg">
              Waktu *
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="bg-white rounded-xl px-4 py-4 shadow-sm"
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <Text style={{ fontSize: 14, color: '#666666' }}>
                {formatTime(formData.waktu)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Simpan Button */}
          <TouchableOpacity 
            onPress={handleSimpan}
            className="bg-pink-medium rounded-2xl py-4 items-center shadow-sm mb-8"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white font-semibold text-lg">
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

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={formData.waktu}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}