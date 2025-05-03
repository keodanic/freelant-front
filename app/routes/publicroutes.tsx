import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Freela/Login";
import Cadastro from "../screens/Freela/Cadastro";
import Home from '../screens/Freela/Home'
import Hello from "../screens/Hi";
import Work from "../screens/Freela/WorkClient";
import Teste from "../screens/Teste";
import ChatScreen from "../screens/Chat";

const PublicRoutes =()=> {
    const {Navigator, Screen}= createNativeStackNavigator()
    return(
        <Navigator>
                <Screen name="Chat" component={ChatScreen} options={{headerShown:false}}/>
                <Screen name="Home" component={Home} options={{headerShown:false}}/>
                <Screen name="Teste" component={Teste} options={{headerShown:false}}/>
                <Screen name="Hello" component={Hello} options={{headerShown:false}}/>
                <Screen name="Work" component={Work} options={{headerShown:false}}/>
                <Screen name="Cadastro" component={Cadastro} options={{headerShown:false}}/>
                <Screen name="Login" component={Login} options={{headerShown:false}}/>
        </Navigator>
    )
}

export default PublicRoutes