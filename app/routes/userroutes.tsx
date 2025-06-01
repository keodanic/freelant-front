import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabRoutesUser from '../components/tabroutesUser';
import ChatScreen from '@/app/screens/Chat'; // ou ajuste o caminho

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
      {/* Rota principal com as abas */}
      <Stack.Screen name="Tabs" component={TabRoutesUser} />

      {/* Telas fora das abas fixas */}
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default UserRoutes;
