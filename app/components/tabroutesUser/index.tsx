import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeUser from '@/app/screens/User/Home';
import ChatList from '@/app/screens/ChatList';
import Settings from '@/app/screens/User/Settings';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabRoutesUser=()=> {
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
      <Tab.Screen name="Início" component={HomeUser} />
      <Tab.Screen name="Chat" component={ChatList} />
      <Tab.Screen name="Configurações" component={Settings} />
    </Tab.Navigator>
  );
}

export default TabRoutesUser
