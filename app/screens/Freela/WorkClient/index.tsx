import DropdownSelect from "@/app/components/inputWork";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Text, View } from "react-native";

const Work = () => {
    const [user, setUser] = useState('Victor')
    return (
        <LinearGradient colors={['#5d5d5d', '#777777', '#5d5d5d']}
            className="flex-1">
            <View className="flex-1 p-7 gap-8">
                <View className="flex flex-row flex-wrap justify-center">
                    <Text className="text-4xl text-[#eee]">Estamos quase lá,</Text>
                    <Text className="text-4xl text-[#252525] font-bold">{user}!</Text>
                </View>
                <View className="flex justify-center items-center">
                    <Text className="text-2xl">Agora você tem que escolher qual profissão você quer exercer aqui na Freelant!</Text>
                    <DropdownSelect/>
                </View>
            </View>
        </LinearGradient>
    );
}

export default Work;