// app/_layout.tsx
import { Stack } from 'expo-router';
import '../../global.css';
import { AuthProvider } from '@/context/authcontext'; // ajuste o caminho se necessário

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="hi" options={{ headerShown: false }} />
        <Stack.Screen name="(freelancer)/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(user)/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login-freelancer" options={{ headerShown: false }} />
        <Stack.Screen name="work" options={{ headerShown: false }} />
        <Stack.Screen name="login-user" options={{ headerShown: false }} />
        <Stack.Screen name="register-freelancer" options={{ headerShown: false }} />
        <Stack.Screen name="register-user" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[senderId]/[receiverId]" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
