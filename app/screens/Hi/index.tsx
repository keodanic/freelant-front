import Logo from "@/app/components/Logo";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {useRouter} from "expo-router"


const Hello = () => {
    const router=useRouter()

const navigateToFreela=()=>{
    router.push("/screens/Freela/Login")
}
const navigateToUser=()=>{
    router.push("/screens/User/Login")
}
    return (
        <LinearGradient colors={['#5d5d5d', '#777777', '#5d5d5d']} >
            <View className="flex h-full p-6 gap-8" >
                <View>
                    <Logo/>
                </View>
                <View className="flex gap-4">
                    <View className="flex items-center  ">
                        <Text className="text-4xl text-white mb-5">Bem Vindo ao FREELANT!</Text>
                        <Text className="text-2xl text-white text-center">Conecte-se com oportunidades na sua cidade</Text>
                        <Text className="text-xl text-white">ou</Text>
                        <Text className="text-2xl text-center text-white">Encontre profissionais qualificados perto de você</Text>
                    </View>
                    <View className="flex gap-6">
                        <Text className="text-xl text-white">Escolha como você quer usar o app:</Text>
                        <TouchableOpacity onPress={navigateToFreela} style={{ backgroundColor: '#B9B9B9' }} className="p-5 flex items-center justify-center rounded-2xl">
                            <Text className="text-2xl font-bold">Sou Freelancer</Text>
                            <Text className="text-xl">Oferecer meus serviços</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigateToUser}  style={{ backgroundColor: '#252525' }} className="p-5 flex items-center justify-center rounded-2xl">
                            <Text className="text-white text-2xl font-bold">Sou Cliente</Text>
                            <Text className="text-white text-xl">Buscar Profissionais</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
}

export default Hello;
