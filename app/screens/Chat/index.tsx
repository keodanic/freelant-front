// app/screens/Chat/index.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import io, { Socket } from "socket.io-client";
import { api } from "@/app/services/api";
import { useAuth } from "@/app/hooks/Auth";

// Tipo bruto que o servidor retorna (com campos Prisma)
type RawMessage = {
  id: string;
  content: string;
  createdAt: string;
  senderUserId?: string | null;
  senderFreelaId?: string | null;
  receiverUserId?: string | null;
  receiverFreelaId?: string | null;
};

// Tipo que o componente precisa
type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

const SOCKET_URL = "http://192.168.3.236:3000";

// Converte RawMessage → Message
function normalize(raw: RawMessage): Message {
  const senderId = raw.senderUserId ?? raw.senderFreelaId!;
  const receiverId = raw.receiverUserId ?? raw.receiverFreelaId!;
  return {
    id: raw.id,
    content: raw.content,
    createdAt: raw.createdAt,
    senderId,
    receiverId,
  };
}

const ChatScreen = () => {
  const params = useLocalSearchParams<{ senderId: string; receiverId: string }>();
  const senderId = params.senderId;
  const receiverId = params.receiverId;

  const { user } = useAuth();
  const isFreela = user?.type === "freelancer";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList<Message>>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!senderId || !receiverId) {
      Alert.alert("Erro", "Parâmetros de chat não informados.");
      setLoading(false);
      return;
    }

    // 1) Configure os parâmetros de rota para o GET, sempre passando userId primeiro
    const userIdParam = isFreela ? receiverId : senderId;
    const freelaIdParam = isFreela ? senderId : receiverId;

    // Carrega histórico do banco usando a ordem correta
    setLoading(true);
    api
      .get<RawMessage[]>(`/chat/${userIdParam}/${freelaIdParam}`)
      .then((res) => {
        const normalized = res.data.map(normalize);
        setMessages(normalized);
      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possível carregar as mensagens.");
      })
      .finally(() => {
        setLoading(false);
      });

    // 2) Conecta ao Socket.IO
    const socket = io(SOCKET_URL, {
      auth: { token: user?.token },
    });
    socketRef.current = socket;

    socket.on("receive_message", (rawMsg: RawMessage) => {
      const msg = normalize(rawMsg);
      // Adiciona somente se fizer parte desta conversa
      if (
        (msg.senderId === senderId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === senderId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [senderId, receiverId, user?.token, isFreela]);

  useEffect(() => {
    if (!loading && messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!message.trim() || !socketRef.current) return;

    socketRef.current.emit("send_message", {
      content: message.trim(),
      senderId,
      receiverId,
      senderIsFreela: isFreela,
    });

    setMessage("");
  };

  // 3) Função para o usuário solicitar/abrir um novo serviço
  const handleRequestService = async () => {
    if (!user || !receiverId) return;
    try {
      await api.post("/services", {
        user_id: user.id,
        freelancer_id: receiverId,
      });
      Alert.alert("Sucesso", "Serviço solicitado com sucesso!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível solicitar o serviço.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#777" />
        <Text className="mt-2 text-gray-600">Carregando conversas...</Text>
      </View>
    );
  }

  if (!senderId || !receiverId) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-700">Parâmetros de chat não informados</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isSender = item.senderId === senderId;
          return (
            <View
              className={`p-3 rounded-xl mb-2 max-w-[75%] ${
                isSender ? "bg-blue-500 self-end" : "bg-gray-200 self-start"
              }`}
            >
              <Text className={`${isSender ? "text-white" : "text-black"}`}>
                {item.content}
              </Text>
            </View>
          );
        }}
      />

      {/* Botão “Solicitar Serviço” só aparece para o cliente (user.type === 'user') */}
      {user?.type === "user" && (
        <TouchableOpacity
          onPress={handleRequestService}
          className="bg-green-600 rounded-xl py-3 mx-4 mb-2 items-center"
        >
          <Text className="text-white font-semibold">Solicitar Serviço</Text>
        </TouchableOpacity>
      )}

      <View className="flex-row items-center px-4 py-2 border-t border-gray-300 bg-white">
        <TextInput
          placeholder="Digite sua mensagem..."
          value={message}
          onChangeText={setMessage}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
        />
        <Button title="Enviar" onPress={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
