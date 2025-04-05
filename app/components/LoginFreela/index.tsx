import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, Text, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
    image: {
        height: 100,
        width: 80,

    }
})

const LoginFreela = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setpassword] = useState<string>('');
    return (
    <LinearGradient colors={["#777777","#5d5d5d"]}
    style={{ borderRadius: 24, overflow: "hidden"}}>
        <View className="h-full w-full p-10 flex gap-10 rounded-3xl">
            <View className="flex items-center">
                <Image
                    source={require("@/assets/images/LOGO+TEXTO-cortado.png")}
                    style={styles.image}
                />

            </View>

            <View>
                <Text>Email:</Text>
                <TextInput
                    className="bg-slate-600 opacity-50 rounded-xl"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail} />
            </View>

            <View>
                <Text>Senha:</Text>
                <TextInput
                    className="bg-slate-600 opacity-50 rounded-xl"
                    placeholder="Senha"
                    value={password}
                    onChangeText={setpassword} />

            </View>
            <View className="flex items-center">
                <Text className="text-sm">Não tem conta na FREELANT?</Text>
                <TouchableOpacity >
                    <Text className="text-blue-300 ">Venha trabalhar conosco</Text>
                </TouchableOpacity>

            </View>
        </View>
        </LinearGradient>
    );
}

export default LoginFreela;