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
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import io, { Socket } from "socket.io-client";
import { api } from "@/app/services/api";
import { useAuth } from "@/app/hooks/Auth";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

const SOCKET_URL = "http://192.168.3.236:3000";

const ChatScreen = () => {
  // 1) Pega os parâmetros da URL
  const params = useLocalSearchParams<{ senderId: string; receiverId: string }>();
  const senderId = params.senderId;
  const receiverId = params.receiverId;

  // 2) Pega o usuário logado (para passar token ao socket)
  const { user } = useAuth();

  // 3) Estados
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<FlatList<Message>>(null);
  const socketRef = useRef<Socket | null>(null);

  // 4) Efeito principal: buscar histórico e conectar socket
  useEffect(() => {
    console.log("💬 ChatScreen › params recebidos:", { senderId, receiverId });

    // 4.1) Sem parâmetros válidos, mostra aviso e encerra
    if (!senderId || !receiverId) {
      Alert.alert("Erro", "Parâmetros de chat não informados.");
      setLoading(false);
      return;
    }

    // 4.2) Carrega histórico de mensagens
    setLoading(true);
    api
      .get<Message[]>(`/chat/${senderId}/${receiverId}`)
      .then((res) => {
        console.log("✅ ChatScreen › histórico recebido:", res.data); 
        setMessages(res.data);
      })
      .catch((err) => {
        console.error("❌ ChatScreen › erro ao carregar histórico:", err);
        Alert.alert("Erro", "Não foi possível carregar as mensagens.");
      })
      .finally(() => {
        setLoading(false);
      });

    // 4.3) Conecta ao Socket.IO
    const socket = io(SOCKET_URL, {
      auth: { token: user?.token },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 ChatScreen › socket conectado com id", socket.id);
    });

    socket.on("receive_message", (msg: Message) => {
      console.log("📥 ChatScreen › recebeu no socket:", msg);
      if (
        (msg.senderId === senderId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === senderId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      console.log("🧹 ChatScreen › cleanup: desconectando socket");
      socket.off("receive_message");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [senderId, receiverId, user?.token]);

  // 5) Quando “messages” mudar, rola a FlatList para o fim
  useEffect(() => {
    if (!loading && messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, loading]);

  // 6) Função para enviar mensagem
  const handleSend = () => {
    if (!message.trim() || !socketRef.current) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId,
      receiverId,
      content: message.trim(),
      createdAt: new Date().toISOString(),
    };

    console.log("📤 ChatScreen › enviando mensagem via socket:", newMsg);
    socketRef.current.emit("send_message", newMsg);

    setMessages((prev) => [...prev, newMsg]);
    setMessage("");
  };

  // 7) Spinner ou mensagem de erro:
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#777" />
        <Text className="mt-2 text-gray-600">Carregando conversas...</Text>
      </View>
    );
  }

  // 8) Se ainda faltar algum parâmetro, exibe mensagem e não tenta seguir
  if (!senderId || !receiverId) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-700">Parâmetros de chat não informados</Text>
      </View>
    );
  }

  // 9) Finalmente, a UI do chat funcional
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id ?? index.toString()}
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
        inverted={false}
      />

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
