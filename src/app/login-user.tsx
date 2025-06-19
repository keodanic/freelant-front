// app/login-user.tsx
import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/Auth";

const LoginUser = () => {
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
      // Aqui passamos "user" e não "freelancer"
      await login(email, password, "user");
      // Após o login bem-sucedido, navegamos para a rota raiz
      //router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao fazer login.");
    } finally {
      setLocalLoading(false);
    }
  };

  // Se o contexto de autenticação ainda estiver carregando (token persistido etc.)
  if (authLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#777" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#5d5d5d", "#777777"]} className="flex-1">
      <View className="flex-1 p-10 justify-center space-y-8">
        {/* Logo */}
        <View className="items-center">
          <Image
            source={require("@/assets/images/LOGO+TEXTO-cortado.png")}
            style={{ width: 80, height: 100 }}
            resizeMode="contain"
          />
        </View>

        {/* Campos de Email e Senha */}
        <View className="space-y-4">
          <View>
            <Text className="text-white mb-1">Email</Text>
            <TextInput
              className="bg-slate-600 rounded-xl px-4 py-2 text-white"
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-white mb-1">Senha</Text>
            <TextInput
              className="bg-slate-600 rounded-xl px-4 py-2 text-white"
              placeholder="Senha"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Mensagem de erro */}
        {errorMessage !== "" && (
          <Text className="text-red-400 text-center">{errorMessage}</Text>
        )}

        {/* Botão Entrar */}
        <TouchableOpacity
          className="bg-black rounded-xl py-3 items-center"
          onPress={handleLogin}
          disabled={localLoading}
        >
          {localLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Link para Cadastro de Usuário */}
        <View className="items-center mt-4 space-y-1">
          <Text className="text-sm text-white">Não tem conta na FREELANT?</Text>
          <TouchableOpacity onPress={() => router.push("/register-user")}>
            <Text className="text-blue-300 font-medium">
              Cadastre-se como usuário
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LoginUser;
