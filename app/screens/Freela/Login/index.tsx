import { Text, View, TextInput, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/hooks/Auth";

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 80,
  }
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await login(email, password, "freelancer");
      router.push("/components/tabroutesFreela"); // ✅ vai para a stack com as tabs
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#5d5d5d', '#777777']} style={{ flex: 1 }}>
      <View className="h-full w-full p-10 flex gap-10 justify-center rounded-3xl">
        <View className="flex items-center">
          <Image
            source={require("@/assets/images/LOGO+TEXTO-cortado.png")}
            style={styles.image}
          />
        </View>

        <View>
          <Text>Email:</Text>
          <TextInput
            className="bg-slate-600 opacity-50 rounded-xl text-white px-4 py-2"
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text>Senha:</Text>
          <TextInput
            className="bg-slate-600 opacity-50 rounded-xl text-white px-4 py-2"
            placeholder="Senha"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {errorMessage ? (
          <Text className="text-red-400 text-center">{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          className="bg-black rounded-xl py-3 items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Entrar</Text>
          )}
        </TouchableOpacity>

        <View className="flex items-center mt-4">
          <Text className="text-sm text-white">Não tem conta na FREELANT?</Text>
          <TouchableOpacity onPress={() => router.push("/screens/Freela/Cadastro")}>
            <Text className="text-blue-300 font-medium">Venha trabalhar conosco</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;
