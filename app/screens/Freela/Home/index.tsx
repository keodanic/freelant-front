// app/screens/HomeFreelancer.tsx
import { LinearGradient } from "expo-linear-gradient";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/Auth";
import { api } from "@/app/services/api";
import { useRouter } from "expo-router";

type Service = {
  id: string;
  clientId: string;
  clientName: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED";
};

const HomeFreelancer = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Chama o endpoint que criamos: GET /freelancers/:id/services
        const serviceRes = await api.get<Service[]>(
          `/freelancers/${user?.id}/services`
        );
        setServices(serviceRes.data);

        const ratingRes = await api.get<{ average: number }>(
          `/freelancers/${user?.id}/average-rating`
        );
        setAverageRating(ratingRes.data.average);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchData();
  }, [user?.id]);

  const handleConfirmService = async (serviceId: string) => {
    try {
      await api.patch(`/services/${serviceId}/confirm`);
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceId ? { ...s, status: "CONFIRMED" } : s
        )
      );
    } catch (err) {
      console.error("Erro ao confirmar serviço", err);
    }
  };

  // Contar quantos serviços já foram COMPLETED
  const completedCount = services.filter((s) => s.status === "COMPLETED")
    .length;

  // Filtrar apenas os PENDING
  const pendingServices = services.filter((s) => s.status === "PENDING");

  return (
    <ScrollView className="flex-1">
      <LinearGradient colors={["#5d5d5d", "#777777"]} className="min-h-screen p-4">
        <Text className="text-2xl font-bold mb-4 text-white">
          Bem-vindo, {user?.name?.split(" ")[0]}!
        </Text>

        {/* Foto de perfil */}
        {user?.profile_picture && (
          <View className="items-center mb-6">
            <Image
              source={{ uri: user.profile_picture }}
              className="w-24 h-24 rounded-full mb-2"
            />
          </View>
        )}

        <View className="flex-row justify-between mb-6">
          <View className="w-[48%] bg-gray-100 rounded-md p-4 items-center">
            <Text className="text-xl font-bold">{completedCount}</Text>
            <Text className="text-sm text-gray-500 mt-1">Serviços Feitos</Text>
          </View>
          <View className="w-[48%] bg-gray-100 rounded-md p-4 items-center">
            <Text className="text-xl font-bold">
              {averageRating?.toFixed(1) ?? "N/A"}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">Nota Média</Text>
          </View>
        </View>

        <Text className="text-xl font-bold mb-3 text-white">Serviços Pendentes</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : pendingServices.length > 0 ? (
          pendingServices.map((service) => (
            <View
              key={service.id}
              className="bg-gray-200 rounded-md p-4 mb-4"
            >
              <Text className="text-base mb-2">
                Cliente: {service.clientName}
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => handleConfirmService(service.id)}
                  className="bg-green-600 rounded-lg px-4 py-2"
                >
                  <Text className="text-white text-center">Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/screens/Chat",
                      params: {
                        senderId: user!.id,
                        receiverId: service.clientId,
                      },
                    })
                  }
                  className="bg-blue-600 rounded-lg px-4 py-2"
                >
                  <Text className="text-white text-center">Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View className="items-center mt-8">
            <Text className="text-gray-300 text-lg">
              Nenhum serviço pendente.
            </Text>
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  );
};

export default HomeFreelancer;
