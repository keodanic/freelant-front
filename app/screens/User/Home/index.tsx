import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/app/services/api";

interface WorkCategory {
  id: string;
  name: string;
}

interface Freelancer {
  id: string;
  name: string;
  profile_picture?: string;
  workCategory: {
    name: string;
  };
  ratings: {
    rating: number;
  }[];
}

const HomeUser = () => {
  const router = useRouter();

  // Lista de WorkCategories carregada do backend
  const [works, setWorks] = useState<WorkCategory[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);

  // Freelancers filtrados pelo work selecionado
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);

  const [isLoadingWorks, setIsLoadingWorks] = useState(false);
  const [isLoadingFreelas, setIsLoadingFreelas] = useState(false);

  // 1) Buscar todas as categorias de trabalho assim que a tela monta
  useEffect(() => {
    const fetchWorks = async () => {
      setIsLoadingWorks(true);
      try {
        const res = await api.get<WorkCategory[]>("/work");
        setWorks(res.data);
      } catch (err) {
        console.error("Erro ao buscar categorias de trabalho:", err);
      } finally {
        setIsLoadingWorks(false);
      }
    };
    fetchWorks();
  }, []);

  // 2) Buscar freelancers sempre que o usuário selecionar uma nova categoria
  useEffect(() => {
    if (!selectedWorkId) {
      setFreelancers([]); // limpa lista se nenhum work estiver selecionado
      return;
    }

    const fetchFreelancersByWork = async () => {
      setIsLoadingFreelas(true);
      try {
        // Supondo que o backend aceite /freelancers?workId=<id>
        const res = await api.get<Freelancer[]>(`/freelancers?workId=${selectedWorkId}`);
        setFreelancers(res.data);
      } catch (err) {
        console.error("Erro ao buscar freelancers por work:", err);
      } finally {
        setIsLoadingFreelas(false);
      }
    };
    fetchFreelancersByWork();
  }, [selectedWorkId]);

  // 3) Função para calcular média de ratings
  const calculateAverage = (ratings: { rating: number }[]) => {
    if (!ratings.length) return "N/A";
    const sum = ratings.reduce((acc, curr) => acc + Number(curr.rating), 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <ScrollView className="flex-1 bg-[#777777] p-4">
      <Text className="text-2xl font-bold text-white mb-4">Buscar Trabalhadores</Text>

      {/* 4) Se ainda estiver carregando as categorias */}
      {isLoadingWorks ? (
        <ActivityIndicator size="large" color="#FF5238" className="mb-6" />
      ) : (
        <View className="mb-6">
          <Text className="text-base text-white mb-2">Escolha uma categoria:</Text>
          <View className="flex-row flex-wrap justify-start">
            {works.map((work) => (
              <TouchableOpacity
                key={work.id}
                onPress={() => setSelectedWorkId(work.id)}
                className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                  selectedWorkId === work.id
                    ? "bg-[#FF5238]"     // destaque na categoria selecionada
                    : "bg-[#2c2c2c]"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedWorkId === work.id ? "text-white" : "text-gray-300"
                  }`}
                >
                  {work.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 5) Se nenhuma categoria estiver selecionada, mostramos texto orientando */}
      {!selectedWorkId && !isLoadingWorks && (
        <Text className="text-white text-center mb-4">
          Selecione uma categoria acima para ver os freelancers.
        </Text>
      )}

      {/* 6) Se a categoria estiver selecionada, exibimos os freelancers */}
      {selectedWorkId && (
        <>
          <Text className="text-xl font-bold text-white mb-3">Resultados</Text>

          {isLoadingFreelas ? (
            <ActivityIndicator size="large" color="#FF5238" className="mt-4" />
          ) : freelancers.length === 0 ? (
            <Text className="text-white text-center mt-4">
              Nenhum trabalhador encontrado para esta categoria.
            </Text>
          ) : (
            freelancers.map((freela) => (
              <TouchableOpacity
                key={freela.id}
                onPress={() =>
                  router.push({
                    pathname: "/screens/Freela/FreelancerProfile",
                    params: { id: freela.id },
                  })
                }
                className="flex-row items-center bg-[#2c2c2c] rounded-xl p-4 mb-4"
              >
                <Image
                  source={
                    freela.profile_picture
                      ? { uri: freela.profile_picture }
                      : require("@/assets/images/default-profile.jpg")
                  }
                  className="w-12 h-12 rounded-full mr-4"
                />
                <View className="flex-1">
                  <Text className="font-bold text-white text-base">{freela.name}</Text>
                  <Text className="text-gray-300 text-sm">
                    {freela.workCategory?.name || "Sem categoria"} /{" "}
                    {calculateAverage(freela.ratings ?? [])}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
};

export default HomeUser;
