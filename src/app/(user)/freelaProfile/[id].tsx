import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  FlatList,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@/hooks/Auth";
import { api } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

interface Comment {
  id: string;
  author: string;
  comment: string;
  rating: number;
  createdAt: string;
}

interface FreelancerProfileData {
  id: string;
  name: string;
  profile_picture?: string;
  workCategory?: {
    name: string;
  };
  description?: string;
  totalServices: number;
  link_portfolio?: string;
  average_rating: number;
  hourly_rate?: number;
  comments: Comment[];
  skills?: string[];
}

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View className="flex-row">
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesome key={`full-${i}`} name="star" size={16} color="#F59E0B" />
      ))}
      {hasHalfStar && (
        <FontAwesome key="half" name="star-half-full" size={16} color="#F59E0B" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FontAwesome key={`empty-${i}`} name="star-o" size={16} color="#F59E0B" />
      ))}
    </View>
  );
};

const FreelancerProfileScreen = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<FreelancerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get<FreelancerProfileData>(`/freelancers/profile/${id}`);
        setProfile(response.data);
        
        if (user) {
          const favResponse = await api.get(`/users/${user.id}/favorites/${id}`);
          setIsFavorite(favResponse.data.isFavorite);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        Alert.alert("Erro", "Não foi possível carregar o perfil");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, user?.id]);

  const handleSendMessage = () => {
    if (!user?.id) {
      Alert.alert("Atenção", "Você precisa estar logado para enviar mensagens");
      return;
    }
    router.push(`/chat/${user.id}/${profile?.id}`);
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Confira o perfil do freelancer ${profile?.name} no Freelant: ${profile?.link_portfolio || 'Perfil premium no app Freelant'}`,
        url: profile?.link_portfolio,
        title: `Perfil de ${profile?.name}`
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível compartilhar o perfil");
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para favoritar");
      return;
    }
    try {
      if (isFavorite) {
        await api.delete(`/users/${user.id}/favorites/${profile?.id}`);
      } else {
        await api.post(`/users/${user.id}/favorites`, { freelancerId: profile?.id });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Erro ao atualizar favoritos:", err);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View className="bg-white bg-opacity-10 rounded-xl p-4 mb-3">
      <View className="flex-row justify-between mb-2">
        <Text className="font-semibold text-white">{item.author}</Text>
        <StarRating rating={item.rating} />
      </View>
      <Text className="text-gray-200 text-sm">{item.comment}</Text>
      <Text className="text-gray-400 text-xs mt-2">
        {new Date(item.createdAt).toLocaleDateString('pt-BR')}
      </Text>
    </View>
  );

  if (loading || !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-3">Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1F2937', '#111827']}
      className="flex-1"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header com foto e ações */}
        <View className="p-6">
          <View className="flex-row justify-between items-start mb-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View className="flex-row space-x-4">
              <TouchableOpacity onPress={toggleFavorite}>
                <FontAwesome 
                  name={isFavorite ? "heart" : "heart-o"} 
                  size={24} 
                  color={isFavorite ? "#EF4444" : "white"} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShareProfile}>
                <FontAwesome name="share-alt" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Foto e informações básicas */}
          <View className="items-center mb-6">
            <Image
              source={{ uri: profile.profile_picture || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <Text className="text-2xl font-bold text-white mt-4">{profile.name}</Text>
            <Text className="text-gray-300">{profile.workCategory?.name}</Text>
            
            <View className="flex-row items-center mt-2">
              <StarRating rating={profile.average_rating || 0} />
              <Text className="text-white ml-2">
                ({profile.average_rating?.toFixed(1) || 'Novo'})
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row justify-around bg-gray-800 bg-opacity-50 rounded-xl p-4 mb-6">
            <View className="items-center">
              <Text className="text-white font-bold text-xl">{profile.totalServices}</Text>
              <Text className="text-gray-300 text-sm">Serviços</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-xl">
                {profile.hourly_rate ? `R$ ${profile.hourly_rate}` : '---'}
              </Text>
              <Text className="text-gray-300 text-sm">Por hora</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-xl">
                {profile.comments.length}
              </Text>
              <Text className="text-gray-300 text-sm">Avaliações</Text>
            </View>
          </View>

          {/* Descrição */}
          {profile.description && (
            <View className="mb-6">
              <Text className="text-white font-semibold mb-2">Sobre</Text>
              <Text className="text-gray-300">{profile.description}</Text>
            </View>
          )}

          {/* Habilidades */}
          {profile.skills?.length ? (
            <View className="mb-6">
              <Text className="text-white font-semibold mb-2">Habilidades</Text>
              <View className="flex-row flex-wrap">
                {profile.skills.map((skill, index) => (
                  <View key={index} className="bg-blue-500 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-white text-sm">{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Portfólio */}
          {profile.link_portfolio && (
            <TouchableOpacity 
              className="flex-row items-center bg-gray-800 rounded-lg p-3 mb-6"
              onPress={() => Linking.openURL(profile.link_portfolio)}
            >
              <FontAwesome name="link" size={18} color="#3B82F6" />
              <Text className="text-blue-400 ml-3">Ver portfólio</Text>
            </TouchableOpacity>
          )}

          {/* Avaliações */}
          <Text className="text-white font-semibold text-lg mb-3">Avaliações</Text>
          
          {profile.comments.length ? (
            <FlatList
              data={profile.comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text className="text-gray-400 text-center py-4">
                  Nenhuma avaliação ainda
                </Text>
              }
            />
          ) : (
            <Text className="text-gray-400 mb-4">Nenhuma avaliação disponível</Text>
          )}

          {/* Botão de ação */}
          <TouchableOpacity
            className="bg-blue-600 rounded-xl py-4 items-center justify-center mt-6 mb-10 shadow-lg"
            onPress={handleSendMessage}
          >
            <Text className="text-white font-bold text-lg">Enviar Mensagem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default FreelancerProfileScreen;