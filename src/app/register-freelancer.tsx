// app/register-freelancer.tsx
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

const RegisterFreela: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleRegister = async () => {
    // validações
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
      // navega para seleção de trabalho, passando os dados
      router.push({
        pathname: '/work',
        params: {
          name,
          address,
          birthDay,
          phone,
          email,
          password,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Não foi possível continuar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={['#5d5d5d', '#777777']} className="flex-1">
          <StatusBar barStyle="light-content" />
          <TouchableOpacity
            className="m-4 w-10 h-10 rounded-xl bg-transparent items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={{ padding: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-3xl font-bold text-white mb-2">
              Crie sua conta
            </Text>
            <Text className="text-gray-200 mb-6">
              Cadastre-se como Freelancer
            </Text>

            {/* Nome */}
            <View className="mb-4">
              <Text className="text-xs text-gray-300 mb-1">Nome Completo</Text>
              <TextInput
                className="bg-gray-200 rounded-xl px-4 py-3"
                placeholder="Nome completo"
                placeholderTextColor="#777"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Endereço */}
            <View className="mb-4">
              <Text className="text-xs text-gray-300 mb-1">Endereço</Text>
              <TextInput
                className="bg-gray-200 rounded-xl px-4 py-3"
                placeholder="Endereço"
                placeholderTextColor="#777"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* Data de Nascimento */}
            <View className="mb-4">
              <InputBirthDate
                value={birthDay}
                onChange={setBirthDay}
                onError={setError}
              />
            </View>

            {/* Telefone */}
            <View className="mb-4">
              <InputPhoneNumber
                value={phone}
                onChange={setPhone}
                onError={setError}
              />
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-xs text-gray-300 mb-1">Email</Text>
              <TextInput
                className="bg-gray-200 rounded-xl px-4 py-3"
                placeholder="exemplo@gmail.com"
                placeholderTextColor="#777"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Senha */}
            <View className="mb-4">
              <Text className="text-xs text-gray-300 mb-1">Senha</Text>
              <View className="flex-row items-center bg-gray-200 rounded-xl">
                <TextInput
                  className="flex-1 px-4 py-3"
                  placeholder="••••••••"
                  placeholderTextColor="#777"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  className="px-4"
                  onPress={() => setShowPassword(v => !v)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Repetir Senha */}
            <View className="mb-4">
              <Text className="text-xs text-gray-300 mb-1">
                Repetir Senha
              </Text>
              <View className="flex-row items-center bg-gray-200 rounded-xl">
                <TextInput
                  className="flex-1 px-4 py-3"
                  placeholder="••••••••"
                  placeholderTextColor="#777"
                  secureTextEntry={!showRepeat}
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                />
                <TouchableOpacity
                  className="px-4"
                  onPress={() => setShowRepeat(v => !v)}
                >
                  <Ionicons
                    name={showRepeat ? 'eye-off' : 'eye'}
                    size={20}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Erro */}
            {error !== '' && (
              <Text className="text-red-400 text-center mb-4">{error}</Text>
            )}

            {/* Botão Registrar */}
            <TouchableOpacity
              className="bg-black rounded-xl py-4 items-center"
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  Criar Conta Freelancer
                </Text>
              )}
            </TouchableOpacity>

            {/* Link para login */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-200 mr-1">
                Já tem uma conta?
              </Text>
              <TouchableOpacity onPress={() => router.push('/login-freelancer')}>
                <Text className="text-blue-300 font-medium">Entrar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterFreela;
