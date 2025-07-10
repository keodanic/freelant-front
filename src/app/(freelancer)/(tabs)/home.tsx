import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/Auth";
import { api } from "@/services/api";
import { FontAwesome } from '@expo/vector-icons';

type Service = {
  id: string;
  clientId: string;
  clientName: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED";
  serviceName?: string;
};

export default function HomeFreelancer() {
  const router = useRouter();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [svcRes, ratingRes] = await Promise.all([
          api.get<Service[]>(`/freelancers/${user?.id}/services`),
          api.get<{ average: number }>(`/freelancers/${user?.id}/average-rating`)
        ]);
        setServices(svcRes.data);
        setAvgRating(ratingRes.data.average);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const confirmService = async (id: string) => {
    try {
      await api.patch(`/services/${id}/confirm`);
      setServices(prev => prev.map(s => 
        s.id === id ? { ...s, status: "CONFIRMED" } : s
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = services.filter(s => s.status === "COMPLETED").length;
  const pendingServices = services.filter(s => s.status === "PENDING");

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#F8FAFC', '#E2E8F0', '#CBD5E1']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center mb-8">
            {user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                className="w-16 h-16 rounded-full mr-4"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center mr-4">
                <FontAwesome name="user" size={24} color="#6B7280" />
              </View>
            )}
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                Olá, Victor
              </Text>
              <Text className="text-gray-600">Bem-vindo de volta</Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View className="flex-row justify-between mb-8">
            <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-3xl font-bold text-gray-800 text-center">
                {completedCount}
              </Text>
              <Text className="text-gray-500 text-center mt-1">
                Serviços concluídos
              </Text>
            </View>
            <View className="w-[48%] bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-3xl font-bold text-gray-800 text-center">
                {avgRating ? avgRating.toFixed(1) : '--'}
              </Text>
              <Text className="text-gray-500 text-center mt-1">
                Avaliação média
              </Text>
            </View>
          </View>

          {/* Pending Services */}
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Serviços pendentes
          </Text>

          {pendingServices.length > 0 ? (
            pendingServices.map(service => (
              <View key={service.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <Text className="font-medium text-gray-800 mb-1">
                  Cliente: {service.clientName}
                </Text>
                
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    onPress={() => confirmService(service.id)}
                    className="flex-1 bg-green-500 rounded-lg py-3 items-center justify-center"
                  >
                    <Text className="text-white font-medium">Confirmar</Text>
                  </TouchableOpacity>
                   <TouchableOpacity
                    onPress={() => confirmService(service.id)}
                    className="flex-1 bg-red-500 rounded-lg py-3 items-center justify-center"
                  >
                    <Text className="text-white font-medium">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push({
                      pathname: "/chat/[senderId]/[receiverId]",
                      params: {
                        senderId: user!.id,
                        receiverId: service.clientId,
                      },
                    })}
                    className="flex-1 bg-blue-500 rounded-lg py-3 items-center justify-center"
                  >
                    <Text className="text-white font-medium">Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center justify-center">
              <FontAwesome name="check-circle" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-center">
                Nenhum serviço pendente no momento
              </Text>
            </View>
          )}

          {/* Completed Services CTA */}
          <TouchableOpacity 
            onPress={() => router.push("/freelancer/completed-services")}
            className="mt-6 bg-gray-100 rounded-lg py-3 items-center"
          >
            <Text className="text-gray-700 font-medium">
              Ver serviços concluídos
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}