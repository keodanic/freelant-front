import Logo from "@/components/logo";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const Hello = () => {
    const router = useRouter();

    const navigateToFreela = () => {
        router.push("/login-freelancer");
    };
    const navigateToUser = () => {
        router.push("/login-user");
    };

    return (
        <LinearGradient 
            colors={['#E5E5E5', '#A0A0A0', '#6B6B6B']} // Gradiente claro → médio
            start={{ x: 0, y: 0 }} // Começa claro no topo
            end={{ x: 0, y: 1 }}   // Escurece na base
            className="flex-1"
        >
            <View className="flex h-full p-8 gap-10 justify-center">
                {/* Logo com fundo claro */}
                <View className="items-center mb-4">
                    <Logo />
                </View>

                {/* Textos com cores adaptadas ao novo gradiente */}
                <View className="gap-5">
                    <Text className="text-4xl text-gray-800 font-bold text-center">
                        Bem-vindo ao <Text className="text-[#686767]">FREELANT</Text>
                    </Text>
                    
                    <View className="gap-3">
                        <Text className="text-xl text-gray-700 text-center">
                            Conecte-se com oportunidades na sua cidade
                        </Text>
                        <Text className="text-lg text-gray-600 text-center">ou</Text>
                        <Text className="text-xl text-gray-700 text-center">
                            Encontre profissionais qualificados perto de você
                        </Text>
                    </View>
                </View>

                {/* Botões com nova paleta */}
                <View className="gap-4 mt-6">
                    <Text className="text-lg text-gray-700 text-center">
                        Como você quer usar o app?
                    </Text>

                    <TouchableOpacity 
                        onPress={navigateToFreela} 
                        className="py-4 px-6 bg-blue-600 rounded-xl items-center active:opacity-80 shadow-md"
                    >
                        <Text className="text-2xl font-bold text-white">Sou Freelancer</Text>
                        <Text className="text-lg text-blue-100">Oferecer meus serviços</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={navigateToUser} 
                        className="py-4 px-6 bg-white rounded-xl items-center border border-blue-600 active:opacity-80 shadow-md"
                    >
                        <Text className="text-2xl font-bold text-blue-600">Sou Cliente</Text>
                        <Text className="text-lg text-gray-700">Buscar Profissionais</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default Hello;