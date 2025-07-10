import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import io, { Socket } from "socket.io-client";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/Auth";
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import dayjs from "dayjs";

type RawMessage = {
  id: string;
  content: string;
  createdAt: string;
  senderUserId?: string | null;
  senderFreelaId?: string | null;
  receiverUserId?: string | null;
  receiverFreelaId?: string | null;
};

type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isSender: boolean;
};

const SOCKET_URL = "http://192.168.3.236:3000";

const ChatScreen = () => {
  const params = useLocalSearchParams<{ senderId: string; receiverId: string }>();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const flatListRef = useRef<FlatList<Message>>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!params.senderId || !params.receiverId) {
      Alert.alert("Erro", "Parâmetros de chat não informados.");
      setIsLoading(false);
      return;
    }

    const loadMessages = async () => {
      try {
        const userIdParam = user?.type === "freelancer" ? params.receiverId : params.senderId;
        const freelaIdParam = user?.type === "freelancer" ? params.senderId : params.receiverId;
        
        const response = await api.get<RawMessage[]>(`/chat/${userIdParam}/${freelaIdParam}`);
        
        const normalized = response.data.map(raw => ({
          id: raw.id,
          content: raw.content,
          createdAt: raw.createdAt,
          isSender: (raw.senderUserId === params.senderId || raw.senderFreelaId === params.senderId)
        }));
        
        setMessages(normalized);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o histórico de mensagens");
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Configuração do Socket.IO
    const socket = io(SOCKET_URL, {
      auth: { token: user?.token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("receive_message", (rawMsg: RawMessage) => {
      const isSender = (rawMsg.senderUserId === params.senderId || rawMsg.senderFreelaId === params.senderId);
      setMessages(prev => [...prev, {
        id: rawMsg.id,
        content: rawMsg.content,
        createdAt: rawMsg.createdAt,
        isSender
      }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [params.senderId, params.receiverId, user?.token, user?.type]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !socketRef.current || isSending) return;

    setIsSending(true);
    try {
      socketRef.current.emit("send_message", {
        content: message.trim(),
        senderId: params.senderId,
        receiverId: params.receiverId,
        senderIsFreela: user?.type === "freelancer",
      });
      setMessage("");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a mensagem");
    } finally {
      setIsSending(false);
    }
  };

  const handleRequestService = async () => {
    if (!user || !params.receiverId) return;
    
    try {
      await api.post("/services", {
        user_id: user.id,
        freelancer_id: params.receiverId,
        status: "PENDING",
      });
      Alert.alert("Sucesso", "Serviço solicitado com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível solicitar o serviço");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Carregando conversa...</Text>
      </View>
    );
  }

  if (!params.senderId || !params.receiverId) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Parâmetros de chat inválidos</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.isSender ? styles.senderBubble : styles.receiverBubble
          ]}>
            <Text style={item.isSender ? styles.senderText : styles.receiverText}>
              {item.content}
            </Text>
            <Text style={[
              styles.timeText,
              item.isSender ? styles.senderTime : styles.receiverTime
            ]}>
              {dayjs(item.createdAt).format('HH:mm')}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="comments" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
            <Text style={styles.emptySubtext}>Envie a primeira mensagem!</Text>
          </View>
        }
      />

      {user?.type === "user" && (
        <TouchableOpacity
          onPress={handleRequestService}
          style={styles.serviceButton}
        >
          <FontAwesome name="handshake-o" size={20} color="white" />
          <Text style={styles.serviceButtonText}>Solicitar Serviço</Text>
        </TouchableOpacity>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite sua mensagem..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim() || isSending}
          style={styles.sendButton}
        >
          {isSending ? (
            <ActivityIndicator color="white" />
          ) : (
            <FontAwesome name="send" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  senderBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB',
    borderBottomLeftRadius: 4,
  },
  senderText: {
    color: 'white',
    fontSize: 16,
  },
  receiverText: {
    color: '#111827',
    fontSize: 16,
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  senderTime: {
    color: '#E5E7EB',
  },
  receiverTime: {
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 18,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  serviceButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 120,
    fontSize: 16,
    color: '#111827',
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;