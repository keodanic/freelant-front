import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeFreelancer from '@/app/screens/Freela/Home';
import ChatList from '@/app/screens/Freela/ChatList';
import Settings from '@/app/screens/Freela/Settings';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabRoutesFreela=()=> {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#252525', height: 70, paddingBottom: 10, paddingTop: 10 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: '#FFCB05',
        tabBarInactiveTintColor: '#ccc',
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';

          if (route.name === 'Início') iconName = 'home';
          else if (route.name === 'Chat') iconName = 'chatbubble-ellipses';
          else if (route.name === 'Configurações') iconName = 'settings';

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeFreelancer} />
      <Tab.Screen name="Chat" component={ChatList} />
      <Tab.Screen name="Configurações" component={Settings} />
    </Tab.Navigator>
  );
}

export default TabRoutesFreela
