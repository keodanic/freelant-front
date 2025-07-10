import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onBackPress: () => void;
}

const HeaderBack: React.FC<HeaderProps> = ({ onBackPress }) => {
  return (
    <View className="flex-row items-center mt-5 mb-5 px-2">
      <TouchableOpacity onPress={onBackPress} className="flex-row items-center">
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text className="text-white text-lg ml-2">VOLTAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderBack;
