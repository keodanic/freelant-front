import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Freela/Login";
import Cadastro from "../screens/Freela/Cadastro";
import Home from '../screens/Freela/Home'
import Hello from "../screens/Hi";
import Work from "../screens/Freela/WorkClient";
import Teste from "../screens/Teste";
import ChatScreen from "../screens/Chat";

export type PublicStackParamList = {
    Chat: {
      senderId: string;
      receiverId: string;
    };
    Home: undefined;
    Teste: undefined;
    Hello: undefined;
    Work: undefined;
    Cadastro: undefined;
    Login: undefined;
  };

const Stack = createNativeStackNavigator<PublicStackParamList>();

const PublicRoutes =()=> {

    return(
        <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
                <Stack.Screen name="Chat" component={ChatScreen} options={{headerShown:false}}/>
                <Stack.Screen name="Teste" component={Teste} options={{headerShown:false}}/>
                <Stack.Screen name="Hello" component={Hello} options={{headerShown:false}}/>
                <Stack.Screen name="Work" component={Work} options={{headerShown:false}}/>
                <Stack.Screen name="Cadastro" component={Cadastro} options={{headerShown:false}}/>
                <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
}

export default PublicRoutes