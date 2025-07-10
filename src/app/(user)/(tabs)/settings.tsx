import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/Auth';
import { router } from 'expo-router';
import { api } from '@/services/api';

const UserSettingsScreen = () => {
  const { user, logout } = useAuth();
  const [image, setImage] = useState(user?.profile_picture || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Precisamos acessar sua galeria para alterar a foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);
      formData.append('upload_preset', 'freelant_upload');
      formData.append('cloud_name', 'dt5jto02v');

      const uploadResponse = await api.post('/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = uploadResponse.data.secure_url;
      setImage(imageUrl);

      await api.patch(`/users/${user?.id}`, { profile_picture: imageUrl });
      

      Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          onPress: async () => {
            setIsLoading(true);
            await logout();
            router.replace('/hi');
          }
        }
      ]
    );
  };

  const navigateTo = (screen: string) => {
    
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#E2E8F0', '#CBD5E1']}
      className="flex-1"
    >
      <ScrollView 
        className="p-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800">Configurações</Text>
          <Text className="text-gray-600 mt-1">Gerencie sua conta</Text>
        </View>

        {/* Perfil */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={{ uri: image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <TouchableOpacity
              onPress={handleImageUpload}
              disabled={isUploading}
              className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full"
            >
              {isUploading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <FontAwesome name="camera" size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-semibold text-gray-800 mt-4">
            Exemplo 1
          </Text>
          <Text className="text-gray-500">{user?.email}</Text>
        </View>

        {/* Opções */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <TouchableOpacity
            className="flex-row items-center py-4 px-2"
            onPress={() => navigateTo('/(user)/edit-profile')}
          >
            <View className="bg-gray-100 p-3 rounded-full mr-4">
              <FontAwesome name="user" size={18} color="#4B5563" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">Editar perfil</Text>
              <Text className="text-gray-500 text-sm">Atualize suas informações</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <View className="h-px bg-gray-100 my-1" />

          <TouchableOpacity
            className="flex-row items-center py-4 px-2"
            onPress={() => navigateTo('/(user)/notifications')}
          >
            <View className="bg-gray-100 p-3 rounded-full mr-4">
              <FontAwesome name="bell" size={18} color="#4B5563" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">Notificações</Text>
              <Text className="text-gray-500 text-sm">Preferências de notificação</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <View className="h-px bg-gray-100 my-1" />

          <TouchableOpacity
            className="flex-row items-center py-4 px-2"
            onPress={() => navigateTo('/(user)/security')}
          >
            <View className="bg-gray-100 p-3 rounded-full mr-4">
              <FontAwesome name="lock" size={18} color="#4B5563" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">Segurança</Text>
              <Text className="text-gray-500 text-sm">Alterar senha e mais</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Sessão de conta */}
        <View className="bg-white rounded-xl shadow-sm p-4">
          <Text className="font-medium text-gray-500 mb-4">CONTA</Text>
          
          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={handleLogout}
          >
            <View className="bg-red-100 p-3 rounded-full mr-4">
              <MaterialIcons name="logout" size={18} color="#EF4444" />
            </View>
            <Text className="text-red-600 font-medium flex-1">Sair da conta</Text>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Versão do app */}
        <Text className="text-center text-gray-400 mt-8">
          Freelant v1.0.0
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

export default UserSettingsScreen;