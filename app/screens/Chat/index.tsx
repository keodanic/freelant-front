import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp } from '@react-navigation/native'; 
import io from 'socket.io-client';
import axios from 'axios';
 type PublicStackParamList = {
  Chat: {
    senderId: string;
    receiverId: string;
  };
 }
type Message = {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt?: string;
};

type Props = {
  route: RouteProp<PublicStackParamList, 'Chat'>;
};

const API_URL = 'http://192.168.3.236:3000'; // <-- coloque seu IP local

const socket = io(API_URL);

export default function ChatScreen({ route }: Props) {
  const { senderId, receiverId } = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/chat/${senderId}/${receiverId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error('Erro ao carregar mensagens:', err));

    socket.on('receive_message', (msg: Message) => {
      if (
        (msg.senderId === receiverId && msg.receiverId === senderId) ||
        (msg.senderId === senderId && msg.receiverId === receiverId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const handleSend = () => {
    const newMessage: Message = {
      senderId,
      receiverId,
      content: message,
    };

    socket.emit('send_message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View
            className={`p-3 rounded-xl mb-2 max-w-[75%] ${
              item.senderId === senderId
                ? 'bg-blue-500 self-end'
                : 'bg-gray-200 self-start'
            }`}
          >
            <Text
              className={`${
                item.senderId === senderId ? 'text-white' : 'text-black'
              }`}
            >
              {item.content}
            </Text>
          </View>
        )}
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
}
