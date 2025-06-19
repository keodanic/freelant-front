import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

interface InputBirthDateProps {
  value: string;
  onChange: (date: string) => void;
  onError?: (message: string) => void;
}

const InputBirthDate = ({ value, onChange, onError }: InputBirthDateProps) => {
  const [error, setError] = useState('');

  const validateDate = (dateString: string) => {
    if (!dateString) {
      const msg = 'Por favor, insira sua data de nascimento.';
      setError(msg);
      onError?.(msg);
      return false;
    }

    const [day, month, year] = dateString.split('/').map(Number);
    if (!day || !month || !year) {
      const msg = 'Data inválida.';
      setError(msg);
      onError?.(msg);
      return false;
    }

    if (
      day < 1 || day > 31 ||
      month < 1 || month > 12 ||
      year < 1900 || year > new Date().getFullYear()
    ) {
      const msg = 'Data inválida.';
      setError(msg);
      onError?.(msg);
      return false;
    }

    const date = new Date(year, month - 1, day);
    const isValid =
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year;

    if (!isValid) {
      const msg = 'Data inválida.';
      setError(msg);
      onError?.(msg);
      return false;
    }

    const isOver18 = () => {
      const today = new Date();
      let age = today.getFullYear() - year;
      const m = today.getMonth() - (month - 1);

      if (m < 0 || (m === 0 && today.getDate() < day)) {
        age--;
      }

      return age >= 18;
    };

    if (!isOver18()) {
      const msg = 'Você precisa ter pelo menos 18 anos.';
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
        <Text className="text-[#252525] text-xs">Data de Nascimento</Text>
      </View>

      <TextInputMask
      style={styles.input}
        type={'datetime'}
        options={{ format: 'DD/MM/YYYY' }}
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={value}
        onChangeText={(text) => {
          onChange(text);
          validateDate(text);
        }}
        
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

export default InputBirthDate;
