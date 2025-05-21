import InputBirthDate from "@/app/components/inputDate";
import InputPhoneNumber from "@/app/components/inputPhone";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useAuth } from "@/app/hooks/Auth";
import { api } from "@/app/services/api";

const CadastroUser = () => {
  const [name, setName] = useState('');
  const [adress, setAdress] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageError, setmessageError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleRegister = async () => {
  if (!name) return setmessageError('Por favor, insira seu nome.');
  if (name.length < 10) return setmessageError('Insira seu nome completo.');
  if (!adress) return setmessageError('Por favor, insira seu endereço.');
  if (!birthDay) return setmessageError('Por favor, insira sua Data de Nascimento.');
  if (!email) return setmessageError('Por favor, insira seu endereço de e-mail.');
  if (!email.includes('@')) return setmessageError('Por favor, insira um e-mail válido.');
  if (!password) return setmessageError('Por favor, insira sua senha.');
  if (password.length < 8) return setmessageError('A senha deve ter no mínimo 8 caracteres.');
  if (password !== repeatPassword) return setmessageError('As senhas não coincidem.');

  setIsLoading(true);
  setmessageError('');

  try {
   
    router.push({
      pathname: "/screens/Freela/WorkClient",
      params: {
        name,
        email,
        password,
        phone: phone,
        birthDay,
        adress,
      },
    });
  } catch (error:any) {
    const message = error?.response?.data?.message || 'Erro ao registrar. Tente novamente.';
    setmessageError(message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <KeyboardAvoidingView behavior="height" className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 bg-[#b9b9b9]">
            <StatusBar barStyle="light-content" />
            <TouchableOpacity className="w-10 h-10 ml-4 mt-2 rounded-xl bg-[#b9b9b9] items-center justify-center">
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View className="px-6 mt-4">
              <Text className="text-black text-3xl font-bold">Register</Text>
              <Text className="text-[#413f3f] mt-1 mb-8">Crie sua conta como Freelancer</Text>

              <View className="space-y-4">
                {/* Nome */}
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

                {/* Endereço */}
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

                <InputBirthDate value={birthDay} onChange={setBirthDay} onError={setmessageError} />
                <InputPhoneNumber value={phone} onChange={setPhone} onError={setmessageError} />

                {/* Email */}
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

                {/* Senha */}
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
                    <TouchableOpacity className="pr-4" onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Repetir senha */}
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
                    <TouchableOpacity className="pr-4" onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
                      <Ionicons name={showRepeatPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {messageError ? (
                <Text className="text-[#FF5238] text-sm mb-4 text-center">{messageError}</Text>
              ) : null}

              <TouchableOpacity
                className="bg-[#252525] rounded-xl py-4 items-center mt-4 justify-center"
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text className="text-[#fff] font-semibold text-lg">
                  {isLoading ? 'Criando conta...' : 'Criar Conta Freelancer'}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center mt-6">
                <Text className="text-[#252525]">Já tem uma conta FreeLant? </Text>
                <TouchableOpacity onPress={() => router.push('/screens/Freela/Login')}>
                  <Text className="text-[#034DB5]">Log in</Text>
                </TouchableOpacity>
              </View>

              {isLoading && <ActivityIndicator color="#FF5238" style={{ marginTop: 20 }} />}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CadastroUser;
