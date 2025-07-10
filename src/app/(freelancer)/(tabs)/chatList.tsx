import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/Auth";
import { api } from "@/services/api";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

type ChatItem = {
  id: string;
  receiverId: string;
  userName: string;
  profile_picture?: string;
  lastMessage?: string;
  unreadCount?: number;
  timestamp?: string;
};

const ChatListScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = async () => {
    try {
      const listForUser = user?.type === "user";
      const resp = await api.get<ChatItem[]>(
        `/chat/list?userId=${user?.id}&listForUser=${listForUser}`
      );
      setChats(resp.data);
    } catch (err) {
      console.error("Erro ao buscar chats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchChats();
  }, [user?.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const handlePress = (receiverId: string) => {
    router.push(`/chat/${user?.id}/${receiverId}`);
  };

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 bg-white rounded-lg my-1 mx-2 shadow-sm"
      onPress={() => handlePress(item.receiverId)}
    >
      {item.profile_picture ? (
        <Image
          source={{ uri: item.profile_picture }}
          className="w-12 h-12 rounded-full mr-3"
        />
      ) : (
        <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
          <Text className="text-gray-500 font-bold text-lg">
            {item.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-gray-800">{item.userName}</Text>
          {item.timestamp && (
            <Text className="text-xs text-gray-400">
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>
        
        <View className="flex-row justify-between items-center mt-1">
          
          
          {item.unreadCount ? (
            <View className="bg-blue-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs">{item.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-2">Carregando conversas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="py-4 px-2">
        <Text className="text-2xl font-bold text-gray-800 px-4 mb-2">Conversas</Text>
        
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <MaterialIcons name="chat" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-center">
                Nenhuma conversa encontrada
              </Text>
              <Text className="text-gray-400 mt-1 text-center">
                Inicie uma nova conversa com um profissional
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
            />
          }
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>

      {/* Botão flutuante para nova conversa */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push('/search-professionals')}
      >
        <FontAwesome name="pencil" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatListScreen;