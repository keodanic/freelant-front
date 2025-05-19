import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Freelancers
import FreelaLogin from "../screens/Freela/Login";
import FreelaCadastro from "../screens/Freela/Cadastro";
import FreelaHome from "../screens/Freela/Home";
import Work from "../screens/Freela/WorkClient";

// Usuários
import UserLogin from "../screens/User/Login";
import UserCadastro from "../screens/User/Cadastro";
import UserHome from "../screens/User/Home";

// Extras
import Hello from "../screens/Hi";
import Teste from "../screens/Teste";
import ChatScreen from "../screens/Chat";

export type PublicStackParamList = {
  // Chat
  Chat: {
    senderId: string;
    receiverId: string;
  };

  // Freelancers
  FreelaLogin: undefined;
  FreelaCadastro: undefined;
  FreelaHome: undefined;
  Work: undefined;

  // Usuários
  UserLogin: undefined;
  UserCadastro: undefined;
  UserHome: undefined;

  // Extras
  Hello: undefined;
  Teste: undefined;
};

const Stack = createNativeStackNavigator<PublicStackParamList>();

const PublicRoutes = () => {
  return (
    <Stack.Navigator initialRouteName="Hello" screenOptions={{ headerShown: false }}>
      {/* Freelancers */}
      <Stack.Screen name="FreelaLogin" component={FreelaLogin} />
      <Stack.Screen name="FreelaCadastro" component={FreelaCadastro} />
      <Stack.Screen name="FreelaHome" component={FreelaHome} />
      <Stack.Screen name="Work" component={Work} />

      {/* Usuários */}
      <Stack.Screen name="UserLogin" component={UserLogin} />
      <Stack.Screen name="UserCadastro" component={UserCadastro} />
      <Stack.Screen name="UserHome" component={UserHome} />

      {/* Extras */}
      <Stack.Screen name="Hello" component={Hello} />
      <Stack.Screen name="Teste" component={Teste} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default PublicRoutes;
