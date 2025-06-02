// app/screens/MyServices.tsx  (ou dentro de HomeUser, como aba)
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "@/app/hooks/Auth";
import { api } from "@/app/services/api";
import { useRouter } from "expo-router";

type PendingRatingService = {
  serviceId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar?: string;
};

const MyServices = () => {
  const { user } = useAuth();
  const [list, setList] = useState<PendingRatingService[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPending = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await api.get<PendingRatingService[]>(
          `/services/${user.id}/completed-pending-rating`
        );
        setList(res.data);
      } catch (err) {
        console.error("Erro ao buscar serviços pendentes de avaliação:", err);
        Alert.alert("Erro", "Não foi possível buscar serviços para avaliação.");
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, [user?.id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#777" />
      </View>
    );
  }

  if (list.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-gray-600">Nenhum serviço para avaliar.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.serviceId}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View className="bg-gray-100 rounded-md p-4 mb-4 flex-row items-center">
          <View className="flex-1">
            <Text className="text-base font-semibold">
              {item.freelancerName}
            </Text>
            <Text className="text-sm text-gray-500">Avaliar agora</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/screens/RateFreelancer",
                params: {
                  serviceId: item.serviceId,
                  freelancerId: item.freelancerId,
                },
              })
            }
            className="bg-blue-600 rounded-md px-4 py-2"
          >
            <Text className="text-white">Avaliar</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default MyServices;
