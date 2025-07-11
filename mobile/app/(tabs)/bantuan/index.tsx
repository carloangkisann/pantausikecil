import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { apiService } from '../../../services/api';
import { extractApiArrayData } from '../../../utils/apiHelpers';
import Header from '../../components/Header';

const BantuanIndex = () => {
  const { user } = useAuth();
  const [userConnections, setUserConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [sendingEmergency, setSendingEmergency] = useState(false);

  // Fetch user connections
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.id) return;

      try {
        const response = await apiService.getUserConnections(user.id);
        const connectionsData = extractApiArrayData(response);
        setUserConnections(connectionsData);
      } catch (error) {
        console.error('Error fetching connections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [user?.id]);

  // Send emergency notification - MAIN FEATURE
  const handleSendEmergency = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User tidak ditemukan');
      return;
    }

    if (userConnections.length === 0) {
      Alert.alert(
        'Tidak Ada Kontak Darurat',
        'Anda belum menambahkan kontak keluarga. Tambahkan kontak darurat di menu Profile terlebih dahulu.',
        [
          { text: 'OK' },
          { text: 'Tambah Sekarang', onPress: () => router.push('/profile/add-koneksi') }
        ]
      );
      return;
    }

    // Confirmation before sending
    Alert.alert(
      'Kirim Notifikasi Darurat?',
      `Notifikasi akan dikirim ke ${userConnections.length} kontak keluarga Anda.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Kirim',
          style: 'destructive',
          onPress: async () => {
            try {
              setSendingEmergency(true);

              const emergencyData = {
                message: emergencyMessage || 'Saya membutuhkan bantuan segera. Mohon hubungi saya.'
              };

              console.log('Sending emergency notification:', emergencyData);
              const response = await apiService.sendEmergencyNotification(user.id, emergencyData);

              if (response.success) {
                Alert.alert(
                  '✅ Notifikasi Terkirim',
                  `Notifikasi darurat telah dikirim ke ${userConnections.length} kontak keluarga Anda.`,
                  [{ text: 'OK' }]
                );
                setEmergencyMessage('');
              } else {
                Alert.alert('Error', response.message || 'Gagal mengirim notifikasi darurat');
              }
            } catch (error) {
              console.error('Error sending emergency:', error);
              Alert.alert('Error', 'Gagal mengirim notifikasi darurat');
            } finally {
              setSendingEmergency(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#FF9EBD', '#F2789F']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ flex: 1 }}
      >
        <Header />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="text-white mt-4">Memuat...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FF9EBD', '#F2789F']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1 }}
    >
      <Header />

      <ScrollView 
        className="bg-pink-low"
        style={{ 
          flex: 1, 
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <View className="flex-1 justify-center px-4 py-12">
          {/* Main Emergency Section */}
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-center mb-4">
              🚨 Bantuan Darurat
            </Text>
            <Text className="text-gray-600 text-center text-base leading-6">
              Kirim notifikasi darurat ke keluarga Anda jika membutuhkan bantuan segera
            </Text>
          </View>

          {/* Connection Status */}
          <View className="bg-white rounded-2xl p-4 mb-6">
            <Text className="text-gray-700 font-semibold mb-2">
              Status Kontak Darurat:
            </Text>
            {userConnections.length > 0 ? (
              <View>
                <Text className="text-green-600 font-semibold">
                  ✅ {userConnections.length} kontak tersedia
                </Text>
                {userConnections.map((connection, index) => (
                  <Text key={index} className="text-gray-600 text-sm">
                    • {connection.connectionName} ({connection.relationshipType})
                  </Text>
                ))}
              </View>
            ) : (
              <View>
                <Text className="text-red-600 font-semibold mb-2">
                   Belum ada kontak darurat
                </Text>
                <TouchableOpacity
                  className="bg-blue-500 rounded-xl py-2 px-4"
                  onPress={() => router.push('/profile/add-koneksi')}
                >
                  <Text className="text-white text-center font-semibold">
                    Tambah Kontak Darurat
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Emergency Message Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-2">
              Pesan Darurat (Opsional):
            </Text>
            <TextInput
              className="bg-white rounded-2xl px-4 py-4 text-base border border-gray-200"
              placeholder="Tulis pesan khusus atau biarkan kosong untuk pesan default"
              placeholderTextColor="#9CA3AF"
              value={emergencyMessage}
              onChangeText={setEmergencyMessage}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Emergency Button */}
          <TouchableOpacity
            className={`rounded-2xl py-6 px-6 ${
              userConnections.length > 0 && !sendingEmergency
                ? 'bg-red-500' 
                : 'bg-gray-400'
            }`}
            onPress={handleSendEmergency}
            disabled={userConnections.length === 0 || sendingEmergency}
          >
            {sendingEmergency ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text className="text-white font-bold text-lg ml-3">
                  Mengirim Notifikasi...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg text-center">
                 KIRIM NOTIFIKASI DARURAT
              </Text>
            )}
          </TouchableOpacity>


        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default BantuanIndex;