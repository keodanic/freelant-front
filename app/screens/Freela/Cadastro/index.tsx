import InputBirthDate from "@/app/components/inputDate";
import InputPhoneNumber from "@/app/components/inputPhone";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform, 
  ActivityIndicator, 
  StatusBar, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View } from "react-native"

const CadastroUser = () => {

  const [name, setName] = useState('');
  const [adress, setAdress] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDay, setBirthDay] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [messageError, setmessageError] = useState('')
  const router = useRouter()

  const handleRegister = async () => {
    if (!name) {
      setmessageError('Por favor, insira seu nome.');
      return;
    } else if (name.length < 10) {
      setmessageError('Insira seu nome completo.');
      return;
    }
    if (!adress) {
      setmessageError('Por favor, insira seu endereço.');
      return;
    }

    if (!birthDay) {
      setmessageError('Por favor, insira sua Data de Nascimento.');
      return;
    }else if (birthDay.length !== 11) {
      setmessageError('Numero de telefone inválido.');
      return;
    }

    if (!email) {
      setmessageError('Por favor, insira seu endereço de e-mail.');
      return;
    } else if (!email.includes('@')) {
      setmessageError('Por favor, insira um e-mail válido.');
      return;
    }

    if (!password) {
      setmessageError('Por favor, insira sua senha.');
      return;
    } else if (password.length < 8) {
      setmessageError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (password !== repeatPassword) {
      setmessageError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    setmessageError('');
  }
  return (
    <KeyboardAvoidingView
      behavior="height"
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
      <View className="flex-1 bg-[#b9b9b9]">
        <StatusBar barStyle="light-content" />
        {/* Back button */}
        <TouchableOpacity
          className="w-10 h-10 ml-4 mt-2 rounded-xl bg-[#b9b9b9] items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View className="px-6 mt-4">
          {/* Header */}
          <Text className="text-black text-3xl font-bold">Register</Text>
          <Text className="text-[#413f3f] mt-1 mb-8">Crie sua conta como Freelancer</Text>

          {/* Form */}
          <View className="space-y-4">
            {/* Full Name Input with label on border */}
            <View className="mb-4">
              <View className="absolute top-0 left-4 z-10 bg-[#b9b9b9] px-2">
                <Text className="text-[#252525] text-xs">Nome Completo</Text>
              </View>
              <TextInput
                className="bg-transparent text-[#252525] rounded-xl px-4 py-3 border border-[#333333] mt-2"
                placeholder="Nome Completo"
                placeholderTextColor="#777"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mb-4">
              <View className="absolute top-0 left-4 z-10 bg-[#b9b9b9] px-2">
                <Text className="text-[#252525] text-xs">Endereço</Text>
              </View>
              <TextInput
                className="bg-transparent text-[#252525] rounded-xl px-4 py-3 border border-[#333333] mt-2"
                placeholder="Endereço"
                placeholderTextColor="#777"
                value={adress}
                onChangeText={setAdress}
              />
            </View>

            <InputBirthDate
              value={birthDay}
              onChange={setBirthDay}
              onError={setmessageError}
            />

            <InputPhoneNumber
              value={phone}
              onChange={setPhone}
              onError={setmessageError}
            />



            {/* Email Input with label on border */}
            <View className="mb-4">
              <View className="absolute top-0 left-4 z-10 bg-[#b9b9b9] px-2">
                <Text className="text-[#252525] text-xs">Email</Text>
              </View>
              <TextInput
                className="bg-transparent text-[#252525] rounded-xl px-4 py-3 border border-[#333333] mt-2"
                placeholder="exemplo@gmail.com"
                placeholderTextColor="#777"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password Input with label on border */}
            <View className="mb-4">
              <View className="absolute top-0 left-4 z-10 bg-[#b9b9b9] px-2">
                <Text className="text-[#252525] text-xs">Password</Text>
              </View>
              <View className="flex-row items-center bg-transparent rounded-xl border border-[#333333] mt-2">
                <TextInput
                  className="flex-1 text-[#252525] px-4 py-3"
                  placeholder="••••••••"
                  placeholderTextColor="#777"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  className="pr-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Repeat Password Input with label on border */}
            <View className="mb-4">
              <View className="absolute top-0 left-4 z-10 bg-[#b9b9b9] px-2">
                <Text className="text-[#252525] text-xs">Repeat Password</Text>
              </View>
              <View className="flex-row items-center bg-transparent rounded-xl border border-[#333333] mt-2">
                <TextInput
                  className="flex-1 text-[#252525] px-4 py-3"
                  placeholder="••••••••"
                  placeholderTextColor="#777"
                  secureTextEntry={!showRepeatPassword}
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                />
                <TouchableOpacity
                  className="pr-4"
                  onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                >
                  <Ionicons
                    name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {messageError ? <Text className="text-[#FF5238] font-[14px] mb-[16px] text-center">{messageError}</Text> : null}

          {/* Register Button */}
          <TouchableOpacity
            className="bg-[#252525] rounded-xl py-4 items-center mt-4 justify-center"
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-[#fff] font-semibold text-lg">{isLoading ? <ActivityIndicator className="text-[#FF5238]" /> : 'Criar Conta Freelancer'}</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-[#252525]">Já tem uma conta FreeLant? </Text>
            <TouchableOpacity onPress={() => router.push('/screens/Freela/Login')}>
              <Text className="text-[#034DB5]">Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  )
}

export default CadastroUser;