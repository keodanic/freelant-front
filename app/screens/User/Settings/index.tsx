// app/screens/SettingsUser.tsx
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useAuth } from '@/app/hooks/Auth';
import { router } from 'expo-router';

const SettingsUser = () => {
  const { user, logout } = useAuth();
  const [image, setImage] = useState<string | null>(user?.profile_picture || null);
  const [uploading, setUploading] = useState(false);

  const pickAndUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const imageFile = result.assets[0];
    const formData = new FormData();

    formData.append(
      'file',
      {
        uri: imageFile.uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any
    );
    formData.append('upload_preset', 'freelant_upload');
    formData.append('cloud_name', 'dt5jto02v');

    setUploading(true);
    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dt5jto02v/image/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      const imageUrl = res.data.secure_url;
      setImage(imageUrl);

      await axios.put(`/user/${user?.id}`, {
        profile_picture: imageUrl,
      });

      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível enviar a imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const handleEditProfile = () => {
    router.push('/screens/User/EditUserProfile'); // ajuste se necessário
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <LinearGradient
        colors={['#5d5d5d', '#777777']}
        className="min-h-screen flex items-center py-12 px-4"
      >
        {/* Título */}
        <Text className="text-3xl font-bold text-white mb-10">Configurações</Text>

        {/* Cartão de informações */}
        <View className="w-full max-w-md bg-black bg-opacity-40 rounded-lg px-6 py-5 mb-8">
          <View className="mb-4">
            <Text className="text-gray-300 text-sm font-medium">Nome:</Text>
            <Text className="text-white text-lg font-semibold">{user?.name}</Text>
          </View>
          <View>
            <Text className="text-gray-300 text-sm font-medium">E-mail:</Text>
            <Text className="text-white text-lg font-semibold">{user?.email}</Text>
          </View>
        </View>

        {/* Avatar */}
        <View className="items-center mb-8">
          <Image
            source={{
              uri: image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            className="w-32 h-32 rounded-full bg-gray-400"
          />
        </View>

        {/* Botões */}
        <View className="w-full max-w-md space-y-4">
          <TouchableOpacity
            onPress={pickAndUploadImage}
            className={`bg-black rounded-xl py-3 items-center ${
              uploading ? 'opacity-60' : ''
            }`}
            disabled={uploading}
          >
            <Text className="text-white text-base font-semibold">
              {uploading ? 'Enviando...' : 'Alterar foto de perfil'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleEditProfile}
            className="bg-black rounded-xl py-3 items-center"
          >
            <Text className="text-white text-base font-semibold">Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-600 rounded-xl py-3 items-center"
          >
            <Text className="text-white text-base font-semibold">Sair</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default SettingsUser;
