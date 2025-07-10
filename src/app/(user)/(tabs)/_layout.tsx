import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: '#3B82F6', // Azul mais profissional
        tabBarInactiveTintColor: '#6B7280', // Cinza para itens inativos
        
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
         name="home"
        options={{
          headerShown: false,
          title: 'Início',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatList"
        options={{
          headerShown: false,
          title: 'Chats',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="comments" color={color} />
          ),
          tabBarBadge: 1, // Exemplo de notificação
          
        }}
      />
      <Tabs.Screen
       name="settings"
        options={{
          headerShown: false,
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}