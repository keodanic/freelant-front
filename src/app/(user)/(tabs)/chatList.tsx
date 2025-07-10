// app/screens/ChatList.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/Auth";
import { api } from "@/services/api";

type ChatItem = {
  id: string;             // ID da última mensagem
  receiverId: string;     // ID do outro participante
  userName: string;       // nome desse outro participante
  profile_picture?: string;
};

const ChatList = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchChats = async () => {
      setLoading(true);
      try {
        // true se for user, false se for freelancer
        const listForUser = user.type === "user";
        const resp = await api.get<ChatItem[]>(
          `/chat/list?userId=${user.id}&listForUser=${listForUser}`
        );
        setChats(resp.data);
      } catch (err) {
        console.error("Erro ao buscar chats:", err);
        Alert.alert("Erro", "Não foi possível carregar suas conversas.");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user?.id, user?.type]);

  const handlePress = (receiverId: string) => {
    if (!user?.id) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    // dispara para a rota dinâmica de chat
    const senderId = user.id
    router.push(`/chat/${senderId}/${receiverId}`);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFCB05" />
        <Text style={styles.loadingText}>Carregando conversas...</Text>
      </View>
    );
  }

  if (chats.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Você ainda não tem conversas.</Text>
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
              <Image
                source={{ uri: item.profile_picture }}
                style={styles.avatar}
              />
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
  container: { flex: 1, backgroundColor: "#fff", padding: 16, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12, color: "#333" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, color: "#555" },
  emptyText: { color: "#555" },
  chatItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  avatarPlaceholder: { backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" },
  avatarPlaceholderText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  chatName: { fontSize: 18, color: "#333" },
  separator: { height: 1, backgroundColor: "#eee" },
});
