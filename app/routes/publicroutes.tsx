import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Home from '../screens/Home'
import Hello from "../screens/Hi";

const PublicRoutes =()=> {
    const {Navigator, Screen}= createNativeStackNavigator()
    return(
        <Navigator>
                <Screen name="Hello" component={Hello} options={{headerShown:false}}/>
                <Screen name="Login" component={Login} options={{headerShown:false}}/>
                <Screen name="Cadastro" component={Cadastro} options={{headerShown:false}}/>
                <Screen name="Home" component={Home} options={{headerShown:false}}/>
        </Navigator>
    )
}

export default PublicRoutes