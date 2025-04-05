import LoginFreela from "@/app/components/LoginFreela";
import { Text, View,SafeAreaView,TextInput } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';


const Login=()=>{
    return(
        <LinearGradient colors={['#5d5d5d','#777777']} >
        <View className=" h-full flex justify-center items-center p-20 pt-32 pb-32">
            <LoginFreela/>
        </View>

        </LinearGradient>
    )
}

export default Login;