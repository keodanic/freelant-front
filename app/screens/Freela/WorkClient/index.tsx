import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { api } from "@/app/services/api";
import { useAuth } from "@/app/hooks/Auth";

const Work = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login } = useAuth();

  const [works, setWorks] = useState<any[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const name = params.name as string;
  const email = params.email as string;
  const password = params.password as string;
  const phone = params.phone as string;
  const date_birth = params.birthDay as string;
  const address = params.adress as string;

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await api.get("/work");
        setWorks(response.data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar as categorias.");
      }
    };
    fetchWorks();
  }, []);

  function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}T00:00:00Z`);
}


  const handleRegister = async () => {
    if (!selectedWorkId) {
      Alert.alert("Aviso", "Por favor, selecione uma profissão.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/freelancers", {
        name,
        email,
        password,
        phone_number: phone,
        date_birth:parseDate(date_birth),
        address,
        work_id: selectedWorkId,
      });

      await login(email, password, "freelancer");
      router.push("/screens/Freela/Home");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Erro ao finalizar o cadastro.";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#5d5d5d", "#777777", "#5d5d5d"]} className="flex-1">
      <View className="flex-1 p-7 gap-8">
        <View className="flex items-center justify-center">
          <Text className="text-4xl text-[#eee]">Estamos quase lá,</Text>
          <Text className="text-4xl text-[#252525] font-bold">{name}!</Text>
        </View>

        <View className="flex-1">
          <Text className="text-lg mb-4 text-center text-white">
            Agora selecione qual profissão você quer exercer na Freelant:
          </Text>

          <FlatList
            data={works}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`p-4 mb-3 rounded-xl ${
                  selectedWorkId === item.id ? "bg-blue-600" : "bg-gray-300"
                }`}
                onPress={() => setSelectedWorkId(item.id)}
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
            className="bg-black rounded-xl py-4 items-center mt-6"
            onPress={handleRegister}
            disabled={loading}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? "Finalizando cadastro..." : "Finalizar Cadastro"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Work;
