import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hai Bunda! 😊\nBerdasarkan profilmu, usia kehamilanmu saat ini adalah 14 minggu, dan kamu tidak memiliki riwayat tekanan darah tinggi atau diabetes, ya?\n\nMual dan pusing di trimester pertama hingga awal trimester kedua itu umum terjadi, terutama karena perubahan hormon. Tapi tetap penting untuk:\n\n• Minum cukup air\n• Istirahat yang cukup\n• Makan camilan kecil tapi sering\n\nJika pusing terasa berat atau disertai pandangan kabur, sebaiknya segera konsultasi langsung dengan tenaga medis, ya.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Terima kasih atas pertanyaannya. Saya akan membantu memberikan informasi kesehatan yang tepat untuk Anda.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (message: Message) => {
    return (
      <View key={message.id} className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
        <View className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          message.isUser 
            ? 'bg-pink-medium' 
            : 'bg-white shadow-sm'
        }`}>
          <Text className={`text-base leading-6 ${
            message.isUser 
              ? 'text-white font-poppins-medium' 
              : 'text-black-low font-poppins'
          }`}>
            {message.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-medium">
      {/* Header */}
      <View className="bg-pink-medium px-4 py-3 flex-row items-center">
        <TouchableOpacity className="mr-3">
          <Image 
            source={require('../../../assets/images/back-arrow.png')} 
            className="w-6 h-6"
            style={{ tintColor: 'white' }}
          />
        </TouchableOpacity>
        
        <View className="flex-row items-center flex-1 ml-4">
          <Image 
            source={require('../../../assets/images/medibot-icon.png')} 
            className=" mr-2"
              style={{ width: 75, height: 75}}
            resizeMode='contain'
          />

        <Text className='font-bold font-poppins text-white text-lg '> MediRobot</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 bg-pink-low px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input Area */}
        <View className="bg-white px-4 py-3 flex-row items-center">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3 text-base font-poppins"
            placeholder="Tanyakan apa saja kepada Medi...."
            placeholderTextColor="#989898"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            onPress={sendMessage}
            className="bg-pink-medium rounded-full p-3"
            disabled={!inputText.trim()}
          >
            <Image 
              source={require('../../../assets/images/pesawat.png')} 
              className="w-6 h-6"
              style={{ tintColor: 'white' }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBot;