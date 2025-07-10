import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

interface WorkCategory {
  id: string;
  name: string;
  icon?: string;
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
  hourly_rate?: number;
}

const HomeUserScreen = () => {
  const router = useRouter();
  const [works, setWorks] = useState<WorkCategory[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [allFreelancers, setAllFreelancers] = useState<Freelancer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState({
    works: false,
    freelancers: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorks = async () => {
    setLoading(prev => ({ ...prev, works: true }));
    try {
      const res = await api.get<WorkCategory[]>("/work");
      setWorks(res.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      Alert.alert("Erro", "Não foi possível carregar as categorias");
    } finally {
      setLoading(prev => ({ ...prev, works: false }));
    }
  };

  const fetchFreelancers = async () => {
    if (!selectedWorkId) {
      setFreelancers([]);
      setAllFreelancers([]);
      return;
    }

    setLoading(prev => ({ ...prev, freelancers: true }));
    try {
      const res = await api.get<Freelancer[]>(
        `/freelancers/work?workId=${selectedWorkId}`
      );
      setFreelancers(res.data);
      setAllFreelancers(res.data);
    } catch (err) {
      console.error("Erro ao buscar freelancers:", err);
      Alert.alert("Erro", "Não foi possível carregar os profissionais");
    } finally {
      setLoading(prev => ({ ...prev, freelancers: false }));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === '') {
      setFreelancers(allFreelancers);
    } else {
      const filtered = allFreelancers.filter(freelancer =>
        freelancer.name.toLowerCase().includes(query.toLowerCase())
      );
      setFreelancers(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setSearchQuery('');
    await Promise.all([fetchWorks(), fetchFreelancers()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  useEffect(() => {
    fetchFreelancers();
    setSearchQuery('');
  }, [selectedWorkId]);

  const calculateRating = (ratings: { rating: number }[]) => {
    if (!ratings?.length) return null;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const renderCategory = ({ item }: { item: WorkCategory }) => (
    <TouchableOpacity
      onPress={() => setSelectedWorkId(item.id)}
      className={`px-5 py-3 rounded-xl mr-3 mb-3 ${
        selectedWorkId === item.id ? "bg-blue-500" : "bg-gray-200"
      }`}
    >
      <Text
        className={`font-medium ${
          selectedWorkId === item.id ? "text-white" : "text-gray-800"
        }`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderFreelancer = ({ item }: { item: Freelancer }) => {
    const rating = calculateRating(item.ratings || []);
    
    return (
      <TouchableOpacity
        onPress={() => router.push(`/(user)/freelaProfile/${item.id}`)}
        className="bg-white rounded-xl p-4 mb-4 shadow-sm"
      >
        <View className="flex-row items-center">
          <Image
            source={{
              uri: item.profile_picture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            className="w-16 h-16 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="font-bold text-gray-800 text-lg">{item.name}</Text>
            <Text className="text-gray-500 text-sm">
              {item.workCategory?.name}
            </Text>
            
            <View className="flex-row items-center mt-1">
              {rating ? (
                <>
                  <FontAwesome name="star" size={16} color="#F59E0B" />
                  <Text className="text-gray-700 ml-1 mr-3">{rating}</Text>
                </>
              ) : null}
              {item.hourly_rate ? (
                <Text className="text-gray-700">
                  R$ {item.hourly_rate.toFixed(2)}/hora
                </Text>
              ) : null}
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="p-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
          />
        }
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800">
            Encontre Profissionais
          </Text>
          <Text className="text-gray-500 mt-1">
            Contrate os melhores freelancers para seu projeto
          </Text>
        </View>

        {/* Barra de Pesquisa */}
        <View className="mb-6">
          <View className="bg-white rounded-xl px-4 py-2 flex-row items-center shadow-sm">
            <FontAwesome name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Pesquisar freelancer por nome..."
              className="flex-1 ml-3 text-gray-700"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <MaterialIcons name="close" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categorias */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-700 mb-3">
            Categorias
          </Text>
          
          {loading.works ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <FlatList
              data={works}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            />
          )}
        </View>

        {/* Resultados */}
        <View>
          <Text className="text-lg font-semibold text-gray-700 mb-3">
            {selectedWorkId ? "Profissionais" : "Selecione uma categoria"}
          </Text>

          {loading.freelancers ? (
            <View className="py-10">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          ) : selectedWorkId ? (
            freelancers.length > 0 ? (
              <FlatList
                data={freelancers}
                renderItem={renderFreelancer}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ListFooterComponent={<View className="h-20" />}
              />
            ) : (
              <View className="bg-white rounded-xl p-8 items-center">
                <MaterialIcons name="search-off" size={48} color="#D1D5DB" />
                <Text className="text-gray-500 mt-4 text-center">
                  {searchQuery ? 
                    "Nenhum profissional encontrado com esse nome" : 
                    "Nenhum profissional encontrado"}
                </Text>
                <Text className="text-gray-400 mt-1 text-center">
                  Tente selecionar outra categoria ou alterar sua busca
                </Text>
              </View>
            )
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <FontAwesome name="hand-pointer" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-center">
                Selecione uma categoria para ver os profissionais
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeUserScreen;