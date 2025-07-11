import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiService } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
const ChatBot = () => {
  const { user } = useAuth(); // untuk dapatkan token jika dibutuhkan
  const [messages, setMessages] = useState<Message[]>([
    /* ...default */
  ]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    try {
      const response = await apiService.chatWithBot(trimmed);
      const replyText =
        response?.data?.reply ?? "Bot tidak bisa menjawab saat ini.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error chatting with bot:", error);

      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Maaf, terjadi kesalahan saat menghubungi bot.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-pink-medium">
      {/* Header */}
      <View className="bg-pink-medium px-4 py-3 flex-row items-center">
        <TouchableOpacity className="mr-3">
          <Image
            source={require("../../../assets/images/back-arrow.png")}
            className="w-6 h-6"
            style={{ tintColor: "white" }}
          />
        </TouchableOpacity>

        <View className="flex-row items-center flex-1 ml-4">
          <Image
            source={require("../../../assets/images/medibot-icon.png")}
            className="mr-2"
            style={{ width: 75, height: 75 }}
            resizeMode="contain"
          />
          <Text className="font-bold font-poppins text-white text-lg">
            MediRobot
          </Text>
        </View>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-pink-low px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.isUser ? "items-end" : "items-start"}`}
            >
              <View
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser ? "bg-pink-medium" : "bg-white shadow-sm"
                }`}
              >
                <Text
                  className={`text-base leading-6 ${
                    message.isUser
                      ? "text-white font-poppins-medium"
                      : "text-black-low font-poppins"
                  }`}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
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
              source={require("../../../assets/images/pesawat.png")}
              className="w-6 h-6"
              style={{ tintColor: "white" }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBot;
