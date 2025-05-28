import Routes from "./routes";
import React from "react";
import { AuthProvider } from "@/app/context/authcontext"; // ajuste esse caminho se necessário

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
