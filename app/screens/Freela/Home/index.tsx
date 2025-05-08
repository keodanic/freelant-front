import { LinearGradient } from "expo-linear-gradient";
import { Text, View, Button, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type PublicStackParamList = {
  Chat: {
    senderId: string;
    receiverId: string;
  };
  Home: undefined;
};
type NavigationProp = NativeStackNavigationProp<PublicStackParamList, 'Chat'>;
const HomeFreelancer = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <ScrollView className="flex-1">
      <LinearGradient colors={['#5d5d5d','#777777']} className="min-h-screen p-4">
      <Text className="text-2xl font-bold mb-6">Home Trabalhador</Text>

      <View className="flex-row justify-between mb-8">
        <View className="w-[48%] bg-gray-100 rounded-xl p-4 items-center">
          <Text className="text-xl font-bold">10</Text>
          <Text className="text-sm text-gray-500 mt-2">Serviços Feitos</Text>
        </View>
        <View className="w-[48%] bg-gray-100 rounded-xl p-4 items-center">
          <Text className="text-xl font-bold">4.8</Text>
          <Text className="text-sm text-gray-500 mt-2">Nota Média</Text>
        </View>
      </View>

      <Text className="text-xl font-bold mb-3">Serviços Pendentes</Text>
      <View className="mb-6">
        <View className="bg-gray-200 rounded-xl p-4 mb-4">
          <Text className="text-base mb-2">Cliente: João Silva</Text>
          <Button title="Confirmar Serviço" onPress={() => {}} />
        </View>
        <View className="bg-gray-200 rounded-xl p-4 mb-4">
          <Text className="text-base mb-2">Cliente: Maria Souza</Text>
          <Button title="Confirmar Serviço" onPress={() => {}} />
        </View>
      </View>

      <TouchableOpacity  onPress={() =>
    navigation.navigate("Chat", {
      senderId: "b2d78785-c960-4c36-9e42-7f7b1e8c9ed7",
      receiverId: "6f7064df-a511-4bda-a4f9-43336aa96e0d",
    })
  } className="bg-blue-600 rounded-xl p-4 items-center">
        <Text className="text-white text-base font-bold">Editar Perfil</Text>
      </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

export default HomeFreelancer;
