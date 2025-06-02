// app/routes/userRoutes.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabRoutesUser from '../components/tabroutesUser';
import ChatScreen from '@/app/screens/Chat'; // a tela de conversa em si

export type UserStackParamList = {
  Tabs: undefined;
  Chat: {
    senderId: string;
    receiverId: string;
  };
};

const Stack = createNativeStackNavigator<UserStackParamList>();

const UserRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 
        1) A tela “Threads” (as abas definidas em TabRoutesUser) fica em Tabs 
      */}
      <Stack.Screen name="Tabs" component={TabRoutesUser} />
      
      {/* 
        2) Abaixo, a rota “Chat” que recebe os params { senderId, receiverId } 
      */}
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default UserRoutes;
