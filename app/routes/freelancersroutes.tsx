import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabRoutesFreela from '../components/tabroutesFreela';
import ChatScreen from '@/app/screens/Chat'; // ou ajuste o caminho

export type FreelancerStackParamList = {
  Tabs: undefined;
  Chat: {
    senderId: string;
    receiverId: string;
  };
};

const Stack = createNativeStackNavigator<FreelancerStackParamList>();

const FreelancerRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Rota principal com as abas */}
      <Stack.Screen name="Tabs" component={TabRoutesFreela} />

      {/* Telas fora das abas fixas */}
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default FreelancerRoutes;
