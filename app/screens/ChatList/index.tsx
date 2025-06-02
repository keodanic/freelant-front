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
import { useAuth } from "@/app/hooks/Auth";
import { api } from "@/app/services/api";

type ChatItem = {
  id: string;             // ID da última mensagem (usamos como key)
  receiverId: string;     // ID do outro participante da conversa
  userName: string;       // nome desse outro participante
  profile_picture?: string;
};

const ChatList = () => {
  const { user } = useAuth();      // pega o tipo (user ou freelancer) e o próprio ID
  const router = useRouter();

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Se ainda não tivermos o user carregado, nada a buscar
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchChats = async () => {
      setLoading(true);
      try {
        // 2) Monta a query string dependendo do tipo:
        //    - usuário:   listForUser=true
        //    - freelancer: listForUser=false
        const listForUserFlag = user.type === "user" ? "true" : "false";
        //    Ajuste abaixo caso seu backend use "listForFreela" em vez de inverter o booleano:
        //    Exemplo: `/chat/list?userId=${user.id}&listForFreela=true`
        const endpoint = `/chat/list?userId=${user.id}&listForUser=${listForUserFlag}`;

        const response = await api.get<ChatItem[]>(endpoint);
        setChats(response.data);
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
    // 3) Ao clicar em uma conversa, navegamos para a tela de chat, passando os params:
    //    - senderId = ID de quem está clicando (pode ser user ou freela)
    //    - receiverId = ID do destinatário
    router.push({
      pathname: "/screens/Chat",
      params: {
        senderId: user.id,
        receiverId,
      },
    });
  };

  // 4) Spinner enquanto carrega
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFCB05" />
        <Text style={styles.loadingText}>Carregando conversas...</Text>
      </View>
    );
  }

  // 5) Se não houver conversas, mostramos texto de “nenhuma conversa”
  if (chats.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Você ainda não tem conversas.</Text>
      </View>
    );
  }

  // 6) Lista de conversas
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

// ====== Estilos ======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#555",
  },
  emptyText: {
    color: "#555",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatName: {
    fontSize: 18,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});
