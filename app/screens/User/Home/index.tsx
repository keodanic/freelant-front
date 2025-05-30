import { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/app/services/api";

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
  const [search, setSearch] = useState('');
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFreelancers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/freelancers?search=${search}`);
      setFreelancers(res.data);
    } catch (err) {
      console.error("Erro ao buscar freelancers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const calculateAverage = (ratings: { rating: number }[]) => {
    if (!ratings.length) return "N/A";
    const sum = ratings.reduce((acc, curr) => acc + Number(curr.rating), 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Buscar Trabalhadores</Text>

      <View className="mb-6">
        <TextInput
          placeholder="Digite nome ou profissão"
          value={search}
          onChangeText={setSearch}
          className="border border-gray-300 rounded-lg p-2 mb-2"
        />
        <TouchableOpacity
          className="bg-[#252525] rounded-lg py-2 items-center"
          onPress={fetchFreelancers}
        >
          <Text className="text-white font-semibold">Buscar</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-bold mb-3">Resultados</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#252525" />
      ) : (
        freelancers.map((freela) => (
          <TouchableOpacity
            key={freela.id}
            onPress={() => router.push({ pathname: "/screens/Freela/FreelancerProfile", params: { id: freela.id } })}
            className="flex-row items-center mb-4"
          >
            <Image
              source={
                freela.profile_picture
                  ? { uri: freela.profile_picture }
                  : require("@/assets/images/default-profile.jpg")
              }
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="font-bold text-base">{freela.name}</Text>
             <Text className="text-gray-600">
  {freela.workCategory?.name || 'Sem categoria'} / {calculateAverage(freela.ratings ?? [])}
</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default HomeUser;
