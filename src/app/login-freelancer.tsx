import { Text, View, TextInput, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/Auth";

const LoginFreela = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const router = useRouter();
  const { login, loading: authLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    setLocalLoading(true);
    setErrorMessage("");

    try {
      await login(email, password, "freelancer");
      router.push("/(freelancer)/(tabs)/home");
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao fazer login.");
    } finally {
      setLocalLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <LinearGradient 
      colors={['#F8FAFC', '#E2E8F0', '#CBD5E1']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1 px-8 justify-center">
        {/* Header */}
        <View className="items-center mb-12">
          <Image
            source={require("@/assets/images/LOGO+TEXTO-cortado.png")}
            style={{ width: 120, height: 150 }}
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-gray-800 mt-4">
            Acesse sua conta
          </Text>
        </View>

        {/* Formulário */}
        <View className="space-y-6">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              placeholder="seu@email.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Senha</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {errorMessage && (
            <Text className="text-red-500 text-center text-sm">{errorMessage}</Text>
          )}

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-4 items-center justify-center shadow-sm"
            onPress={handleLogin}
            disabled={localLoading}
          >
            {localLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-bold text-lg">Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View className="items-center mt-8">
          <Text className="text-gray-600 text-sm">
            Não tem conta na FREELANT?
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/register-freelancer")}
            className="mt-2"
          >
            <Text className="text-blue-600 font-semibold">
              Cadastre-se como freelancer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LoginFreela;