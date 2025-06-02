// app/screens/RateFreelancer/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@/app/hooks/Auth";
import { api } from "@/app/services/api";

const RateFreelancer = () => {
  // Recebe serviceId e freelancerId via query params na rota
  const params = useLocalSearchParams<{ serviceId: string; freelancerId: string }>();
  const serviceId = params.serviceId;
  const freelancerId = params.freelancerId;

  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0); // nota de 0.0 a 5.0
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Validações básicas
  const isValid = () => {
    return rating >= 0.5 && rating <= 5 && comment.trim().length > 0;
  };

  const handleSubmit = async () => {
    if (!user || !isValid()) {
      Alert.alert("Atenção", "Insira nota (0.5–5) e comentário.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/ratings", {
        user_id: user.id,
        service_id: serviceId,
        rating,
        comment: comment.trim(),
      });
      Alert.alert("Avaliação enviada!", "Obrigado por avaliar o freelancer.", [
        {
          text: "OK",
          onPress: () => {
            // Volta para a tela anterior (por ex., HomeUser)
            router.back();
          },
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível enviar a avaliação.");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId || !freelancerId) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-gray-700">Parâmetros não informados.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-4">Avaliar Freelancer</Text>
      <Text className="mb-2">Nota (0.5 a 5.0):</Text>
      <TextInput
        keyboardType="decimal-pad"
        placeholder="Ex: 4.5"
        value={rating ? rating.toString() : ""}
        onChangeText={(txt) => setRating(parseFloat(txt) || 0)}
        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
      />

      <Text className="mb-2">Comentário:</Text>
      <TextInput
        multiline
        numberOfLines={4}
        placeholder="Como foi a experiência?"
        value={comment}
        onChangeText={setComment}
        className="border border-gray-300 rounded-md px-3 py-2 mb-6 h-24 text-base"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        className={`${
          isValid() ? "bg-blue-600" : "bg-gray-400"
        } rounded-md py-3 items-center`}
        disabled={!isValid() || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">Enviar Avaliação</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RateFreelancer;
