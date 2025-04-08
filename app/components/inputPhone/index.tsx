import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

interface InputPhoneNumberProps {
  value: string;
  onChange: (phone: string) => void;
  onError?: (message: string) => void;
}

const InputPhoneNumber = ({ value, onChange, onError }: InputPhoneNumberProps) => {
  const [error, setError] = useState('');

  const validatePhone = (phone: string) => {
    const raw = phone.replace(/\D/g, '');
    if (raw.length !== 11) {
      const msg = 'Número de telefone inválido.';
      setError(msg);
      onError?.(msg);
      return false;
    }

    setError('');
    onError?.('');
    return true;
  };

  return (
    <View className="mb-4">
    <View className="absolute top-0 left-4 z-10 bg-[#b9b9b9] px-2">
      <Text className="text-[#252525] text-xs">Telefone</Text>
      </View>

      <TextInputMask
        type={'cel-phone'}
        options={{
          maskType: 'BRL',
          withDDD: true,
          dddMask: '(99) '
        }}
        placeholder="(99) 99999-9999"
        placeholderTextColor="#777"
        keyboardType="phone-pad"
        value={value}
        onChangeText={(text) => {
          onChange(text);
          validatePhone(text);
        }}
        style={styles.input}
      />

    </View>
  );
};

const styles = StyleSheet.create({
    input: {
      marginTop: 8,
      backgroundColor: 'transparent',
      color: '#252525',
      borderWidth: 1,
      borderColor: '#333',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    }
  });

export default InputPhoneNumber;
