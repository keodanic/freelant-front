import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '@/app/hooks/Auth';
import { api } from '@/app/services/api';
import { useNavigation } from '@react-navigation/native';

type ChatItem = {
  id: string;
  userName: string;
  receiverId: string;
};

const ChatList = () => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get(`/chat/list?userId=${user?.id}`);
        setChats(response.data);
      } catch (error) {
        console.error('Erro ao buscar chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handlePress = (receiverId: string) => {
    navigation.navigate('Chat', {
      senderId: user?.id,
      receiverId,
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" className="mt-10" />;
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Suas Conversas</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.receiverId)}
            className="border-b border-gray-300 py-3"
          >
            <Text className="text-lg">{item.userName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatList;
