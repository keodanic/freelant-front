// app/work.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/Auth";

function parseDate(dateStr: string): string {
  // espera "DD/MM/YYYY" e retorna ISO
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
}

const Work = () => {
  const router = useRouter();
  const {
    name,
    address,
    phone,
    birthDay,
    email,
    password,
  } = useLocalSearchParams<{
    name: string;
    address: string;
    phone: string;
    birthDay: string;
    email: string;
    password: string;
  }>();

  const { login } = useAuth();
  const [works, setWorks] = useState<{ id: string; name: string }[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<{ id: string; name: string }[]>("/work");
        setWorks(res.data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar as categorias.");
      } finally {
        setLoadingWorks(false);
      }
    })();
  }, []);

  const handleRegister = async () => {
    if (!selectedWorkId) {
      Alert.alert("Aviso", "Por favor, selecione uma profissão.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/freelancers", {
        name,
        email,
        password,
        phone_number: phone,
        date_birth: parseDate(birthDay),
        address,
        work_id: selectedWorkId,
      });
      // Autentica e redireciona para as tabs
      await login(email, password, "freelancer");
      //router.push("/"); // rota raiz controla qual tabs exibir
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err.response?.data?.message || "Erro ao finalizar o cadastro."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingWorks) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#777" />
        <Text className="mt-2 text-gray-600">Carregando profissões...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#5d5d5d", "#777777"]} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 p-6">
          <Text className="text-3xl text-white font-bold mb-2">
            Olá, {name}!
          </Text>
          <Text className="text-lg text-gray-200 mb-6 text-center">
            Selecione sua profissão na Freelant:
          </Text>

          <FlatList
            data={works}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedWorkId(item.id)}
                className={`p-4 mb-3 rounded-xl ${
                  selectedWorkId === item.id
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              >
                <Text
                  className={`text-center text-lg ${
                    selectedWorkId === item.id ? "text-white" : "text-black"
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={submitting}
            className="bg-black rounded-xl py-4 items-center mt-4"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-semibold">
                Finalizar Cadastro
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default Work;
