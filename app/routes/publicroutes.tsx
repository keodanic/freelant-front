import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Freelancers
import FreelaLogin from "../screens/Freela/Login";
import FreelaCadastro from "../screens/Freela/Cadastro";

// Usuários
import UserLogin from "../screens/User/Login";
import UserCadastro from "../screens/User/Cadastro";

// Extras
import Hello from "../screens/Hi";
import Teste from "../screens/Teste";

export type PublicStackParamList = {
  FreelaLogin: undefined;
  FreelaCadastro: undefined;
  UserLogin: undefined;
  UserCadastro: undefined;
  Hello: undefined;
  Teste: undefined;
};

const Stack = createNativeStackNavigator<PublicStackParamList>();

const PublicRoutes = () => (
  <Stack.Navigator initialRouteName="Hello" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FreelaLogin" component={FreelaLogin} />
    <Stack.Screen name="FreelaCadastro" component={FreelaCadastro} />
    <Stack.Screen name="UserLogin" component={UserLogin} />
    <Stack.Screen name="UserCadastro" component={UserCadastro} />
    <Stack.Screen name="Hello" component={Hello} />
    <Stack.Screen name="Teste" component={Teste} />
  </Stack.Navigator>
);

export default PublicRoutes;
