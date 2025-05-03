import { Text, View, TextInput, Button, ScrollView, TouchableOpacity } from "react-native";

const Home = () => {
  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Home</Text>

      <View className="mb-6">
        <TextInput
          placeholder="Buscar trabalhador ou serviço"
          className="border border-gray-300 rounded-lg p-2 mb-2"
        />
        <Button title="Buscar" onPress={() => {}} />
      </View>

      <Text className="text-xl font-bold mt-6 mb-3">Categorias</Text>
      <View className="flex-row justify-between">
        <TouchableOpacity className="w-[48%] h-24 bg-gray-200 rounded-lg" />
        <TouchableOpacity className="w-[48%] h-24 bg-gray-200 rounded-lg" />
      </View>

      <Text className="text-xl font-bold mt-6 mb-3">Trabalhadores em destaque</Text>
      <View className="mt-4">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 bg-gray-400 rounded-full mr-3" />
          <View className="flex-1">
            <Text className="font-bold text-base">Nome do Trabalhador</Text>
            <Text className="text-gray-600">Serviço / Avaliação</Text>
          </View>
        </View>
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 bg-gray-400 rounded-full mr-3" />
          <View className="flex-1">
            <Text className="font-bold text-base">Nome do Trabalhador</Text>
            <Text className="text-gray-600">Serviço / Avaliação</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
