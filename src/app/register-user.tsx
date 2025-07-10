import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import InputBirthDate from '@/components/inputDate';
import InputPhoneNumber from '@/components/inputPhone';
import { useAuth } from '@/hooks/Auth';
import { api } from '@/services/api';

export default function RegisterUser() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    birthDay: '',
    email: '',
    password: '',
    repeatPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const convertToISODate = (date: string): string => {
    const [day, month, year] = date.split('/');
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
  };

  const handleRegister = async () => {
    const { name, address, birthDay, email, password, repeatPassword, phone } = form;

    if (!name) return setError('Por favor, insira seu nome.');
    if (name.length < 10) return setError('Insira seu nome completo.');
    if (!address) return setError('Por favor, insira seu endereço.');
    if (!birthDay) return setError('Por favor, insira sua data de nascimento.');
    if (!email) return setError('Por favor, insira seu email.');
    if (!email.includes('@')) return setError('Insira um email válido.');
    if (!password) return setError('Por favor, insira sua senha.');
    if (password.length < 8) return setError('Senha deve ter ao menos 8 caracteres.');
    if (password !== repeatPassword) return setError('Senhas não coincidem.');

    setError('');
    setLoading(true);
    
    try {
      await api.post('/user', {
        name,
        email,
        password,
        phone_number: phone,
        date_birth: convertToISODate(birthDay),
        address,
      });
      await login(email, password, 'user');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Erro ao criar conta. Verifique os campos e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient 
          colors={['#F8FAFC', '#E2E8F0', '#CBD5E1']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="flex-1"
        >
          <StatusBar barStyle="dark-content" />
          
          <ScrollView
            contentContainerStyle={{ padding: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="mb-8">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-4"
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#4B5563" />
              </TouchableOpacity>
              
              <Text className="text-3xl font-bold text-gray-800 mb-1">
                Cadastre-se
              </Text>
              <Text className="text-gray-600">
                Crie sua conta como cliente
              </Text>
            </View>

            {/* Formulário */}
            <View className="space-y-4">
              {/* Nome */}
              <View>
                <Text className="text-gray-700 font-medium mb-1">Nome Completo</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="Digite seu nome completo"
                  placeholderTextColor="#9CA3AF"
                  value={form.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
              </View>

              {/* Endereço */}
              <View>
                <Text className="text-gray-700 font-medium mb-1">Endereço</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="Rua, número - Bairro"
                  placeholderTextColor="#9CA3AF"
                  value={form.address}
                  onChangeText={(text) => handleChange('address', text)}
                />
              </View>

              {/* Data de Nascimento */}
              <View>
                <Text className="text-gray-700 font-medium mb-1">Data de Nascimento</Text>
                <InputBirthDate
                  value={form.birthDay}
                  onChange={(text) => handleChange('birthDay', text)}
                  onError={setError}
                />
              </View>

              {/* Telefone */}
              <View>
                <Text className="text-gray-700 font-medium mb-1">Telefone</Text>
                <InputPhoneNumber
                  value={form.phone}
                  onChange={(text) => handleChange('phone', text)}
                  onError={setError}
                />
              </View>

              {/* Email */}
              <View>
                <Text className="text-gray-700 font-medium mb-1">Email</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="exemplo@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  onChangeText={(text) => handleChange('email', text)}
                />
              </View>

              {/* Senha */}
              <View>
                <Text className="text-gray-700 font-medium mb-1">Senha</Text>
                <View className="flex-row items-center bg-white border border-gray-300 rounded-lg">
                  <TextInput
                    className="flex-1 px-4 py-3 text-gray-800"
                    placeholder="Mínimo 8 caracteres"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    value={form.password}
                    onChangeText={(text) => handleChange('password', text)}
                  />
                  <TouchableOpacity
                    className="px-4"
                    onPress={() => setShowPassword(v => !v)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmar Senha */}
              <View>
                <Text className="text-gray-700 font-medium mb-1">Confirmar Senha</Text>
                <View className="flex-row items-center bg-white border border-gray-300 rounded-lg">
                  <TextInput
                    className="flex-1 px-4 py-3 text-gray-800"
                    placeholder="Digite novamente sua senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showRepeat}
                    value={form.repeatPassword}
                    onChangeText={(text) => handleChange('repeatPassword', text)}
                  />
                  <TouchableOpacity
                    className="px-4"
                    onPress={() => setShowRepeat(v => !v)}
                  >
                    <Ionicons
                      name={showRepeat ? 'eye-off' : 'eye'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Mensagem de erro */}
              {error && (
                <View className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <Text className="text-red-600 text-center">{error}</Text>
                </View>
              )}

              {/* Botão de registro */}
              <TouchableOpacity
                className="bg-blue-600 rounded-lg py-4 items-center justify-center mt-4 shadow-sm"
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    Criar Conta
                  </Text>
                )}
              </TouchableOpacity>

              {/* Link para login */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600 mr-1">
                  Já tem uma conta?
                </Text>
                <TouchableOpacity onPress={() => router.push('/login-user')}>
                  <Text className="text-blue-600 font-semibold">Faça login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}