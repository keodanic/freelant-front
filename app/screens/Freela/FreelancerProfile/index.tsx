import { View, Text, Image, ScrollView, Linking, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { api } from "@/app/services/api";
import { useLocalSearchParams } from "expo-router";

const FreelancerProfile = () => {
  const { id } = useLocalSearchParams(); // `id` do freelancer passado por rota
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await api.get(`/freelancers/profile/${id}`);
      setData(response.data);
    };
    fetchProfile();
  }, []);

  if (!data) return <Text className="text-center mt-10">Carregando perfil...</Text>;

  return (
    <ScrollView className="flex-1 bg-white p-6">
      {/* Foto */}
      <View className="items-center mb-4">
        <Image
          source={require("@/assets/images/avatar-default.png")}
          className="w-32 h-32 rounded-full mb-2"
        />
        <Text className="text-2xl font-bold text-center">{data.name}</Text>
      </View>

      {/* Link do portfólio */}
      {data.link_portfolio && (
        <TouchableOpacity
          onPress={() => Linking.openURL(data.link_portfolio)}
          className="mb-4"
        >
          <Text className="text-blue-600 underline text-center">
            Ver portfólio
          </Text>
        </TouchableOpacity>
      )}

      {/* Avaliação média */}
      <View className="items-center mb-6">
        <Text className="text-lg font-semibold">Avaliação média</Text>
        <Text className="text-3xl text-yellow-500">{data.average_rating} ⭐</Text>
      </View>

      {/* Comentários */}
      <Text className="text-lg font-semibold mb-2">Comentários:</Text>
      {data.comments.length === 0 ? (
        <Text className="text-gray-500">Nenhum comentário ainda.</Text>
      ) : (
        data.comments.map((c: any, idx: number) => (
          <View key={idx} className="mb-4 border-b border-gray-200 pb-2">
            <Text className="font-medium">{c.author} disse:</Text>
            <Text className="text-gray-700">{c.comment}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default FreelancerProfile;
