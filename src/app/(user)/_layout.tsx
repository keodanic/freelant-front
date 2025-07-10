// app/(user)/_layout.tsx
import { Stack } from "expo-router";
import { useAuth } from "@/hooks/Auth";
import { ActivityIndicator, View } from "react-native";


export default function UserLayout() {
  const { user, loading } = useAuth();
  // Se você tiver um contexto de tema

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    // Redirecionar para login se não estiver autenticado
    // Isso pode ser tratado pelo middleware também
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#fff", // Adapte conforme seu tema
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        contentStyle: {
          backgroundColor: "#000",
        },
      }}
    >
      {/* Telas principais com tabs */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      
      {/* Telas secundárias */}
      <Stack.Screen
        name="freelaProfile/[id]"
        options={{
          title: "Perfil do Freelancer",
          presentation: "modal", // Ou "card" dependendo do fluxo
        }}
      />
      
      {/* Outras telas podem ser adicionadas aqui */}
    </Stack>
  );
}