import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Home from '../screens/Home'

const PublicRoutes =()=> {
    const {Navigator, Screen}= createNativeStackNavigator()
    return(
        <Navigator>
             <Screen name="Login" component={Login}/>
             <Screen name="Cadastro" component={Cadastro}/>
            <Screen name="Home" component={Home}/>
        </Navigator>
    )
}

export default PublicRoutes