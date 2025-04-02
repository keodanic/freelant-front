import LoginFreela from "@/app/components/LoginFreela";
import { Text, View,SafeAreaView,TextInput } from "react-native"


const Login=()=>{
    return(
        <View className="bg-zinc-400 h-full flex justify-center items-center p-20 pt-32 pb-32">
            <LoginFreela/>
        </View>
    )
}

export default Login;