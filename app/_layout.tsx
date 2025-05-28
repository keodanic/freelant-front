import { Stack } from "expo-router";
import { AuthProvider } from "@/app/context/authcontext"; // ajuste esse caminho se necessário
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
