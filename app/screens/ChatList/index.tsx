// ChatList.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '@/app/hooks/Auth';
import { api } from '@/app/services/api';
import { useRouter } from 'expo-router';

type ChatItemBackend = {
  id: string;               // id da última mensagem (usamos como key)
  receiverId: string;       // o “outro usuário” (quem bate papo com você)
  userName: string;         // nome desse outro usuário
  profile_picture?: string; // URL da foto, se houver
};

const ChatList = () => {
  const [chats, setChats] = useState<ChatItemBackend[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      console.warn('[ChatList] Usuário não autenticado ou user.id indefinido');
      setLoading(false);
      return;
    }

    const fetchChats = async () => {
      setLoading(true);
      try {
        // Atenção: remova o '}' extra no final da query
        const response = await api.get<ChatItemBackend[]>(
          `/chat/list?userId=${user.id}&listForUser=false`
        );
        setChats(response.data);
      } catch (error) {
        console.error('[ChatList] Erro ao buscar chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [authLoading, user?.id]);

  const handlePress = (receiverId: string) => {
    if (!user?.id) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }
    // Navega para a tela de chat, passando senderId e receiverId como params
    router.push({
      pathname: '/screens/Chat',
      params: {
        senderId: user.id,
        receiverId,
      },
    });
  };

  if (authLoading || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF5238" />
        <Text style={{ marginTop: 8, color: '#555' }}>Carregando conversas...</Text>
      </View>
    );
  }

  if (!chats.length) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#555' }}>Você ainda não tem conversas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suas Conversas</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => handlePress(item.receiverId)}
          >
            {item.profile_picture ? (
              <Image source={{ uri: item.profile_picture }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarPlaceholderText}>
                  {item.userName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.chatName}>{item.userName}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatName: {
    fontSize: 18,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});
