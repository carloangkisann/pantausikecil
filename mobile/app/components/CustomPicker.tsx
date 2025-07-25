import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  Dimensions,
  ViewStyle,
  TextStyle 
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

// Type definitions
interface PickerItem {
  label: string;
  value: string | number;
}

interface CustomPickerProps {
  value?: string | number | null;
  onValueChange: (value: string | number) => void;
  items: PickerItem[];
  placeholder?: string;
  disabled?: boolean;
  error?: string | boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  modalTitle?: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  value,
  onValueChange,
  items = [],
  placeholder = "Pilih opsi",
  disabled = false,
  error = false,
  containerStyle = {},
  textStyle = {},
  modalTitle = "Pilih Opsi"
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedItem = items.find(item => item.value === value);
  
  const handleSelect = (itemValue : string | number) => {
    onValueChange(itemValue);
    setModalVisible(false);
  };

  return (
    <>
      {/* Picker Button */}
      <TouchableOpacity 
        className={`w-full bg-pink-low rounded-lg border mt-1 max-h-7 ${
          error 
            ? 'border-red-400' 
            : 'border-gray-1'
        }`}
        style={containerStyle}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View className="flex-row justify-between -top-2 min-h-5 ">
          <Text 
            className={`font-poppins text-base flex-1 ${
              selectedItem ? 'text-gray-1' : 'text-gray-1'
            }`}
            style={textStyle}
          >
            {selectedItem ? selectedItem.label : placeholder}
          </Text>
          
          {/* Dropdown Arrow */}
          <Text className={`text-gray-400 ml-2 ${disabled ? 'opacity-50' : ''}`}>
            ▼
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* Error Message */}
      {error && typeof error === 'string' && (
        <Text className="text-red-500 text-sm mt-1 font-poppins">
          {error}
        </Text>
      )}
      
      {/* Modal */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center ">
          <View 
            className="bg-white mx-4 rounded-lg overflow-hidden"
            style={{ maxHeight: screenHeight * 0.6 }}
          >
            {/* Header */}
            <View className="p-4 bg-pink-hard">
              <Text className="font-poppins font-semibold text-lg text-center text-white">
                {modalTitle}
              </Text>
            </View>
            
            {/* Options List */}
            <FlatList
              data={items}
              keyExtractor={(item: PickerItem) => item.value?.toString() || ''}
              showsVerticalScrollIndicator={true}
              renderItem={({ item, index }: { item: PickerItem; index: number }) => (
                <TouchableOpacity
                  className={`p-4 border-b border-pink-hard bg-pink-low border-x-2`}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.6}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className={`font-poppins text-base flex-1 ${
                      value === item.value 
                        ? 'text-pink-hard font-bold ' 
                        : 'text-gray-700'
                    }`}>
                      {item.label}
                    </Text>
                    
                   
                    {value === item.value && (
                      <Text className="text-pink-hard ml-2 font-bold">✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="p-8">
                  <Text className="text-center text-gray-500 font-poppins">
                    Tidak ada opsi tersedia
                  </Text>
                </View>
              }
            />
            
            {/* Cancel Button */}
            <TouchableOpacity
              className="p-4 bg-pink-hard border-t border-gray-200"
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text className="font-poppins text-center text-white font-medium ">
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CustomPicker;