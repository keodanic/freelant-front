import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { ScrollView, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useAuth } from '@/app/hooks/Auth'; 

const SettingsUser = () => {
  const { user } = useAuth(); // usuário logado (freelancer ou user)
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

    formData.append('file', {
      uri: imageFile.uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    formData.append('upload_preset', 'freelant_upload'); // seu preset do Cloudinary
    formData.append('cloud_name', 'dt5jto02v'); // seu cloud name

    setUploading(true);

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dt5jto02v/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const imageUrl = res.data.secure_url;
      setImage(imageUrl);

      // Envia pro backend para atualizar o usuário
      if (user?.type === 'freelancer') {
        await axios.put(`/freelancers/${user.id}`, {
          profile_picture: imageUrl,
        });
      } else {
        await axios.put(`/user/${user?.id}`, {
          profile_picture: imageUrl,
        });
      }

      Alert.alert("Sucesso", "Foto de perfil atualizada!");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1">
      <LinearGradient colors={['#5d5d5d', '#777777']} className="min-h-screen p-4 items-center">
        <Text className="text-3xl text-white font-bold mb-6">Configurações</Text>

        {/* Foto de perfil */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            className="w-40 h-40 rounded-full"
          />
        </View>

        {/* Botão para escolher imagem */}
        <TouchableOpacity
          onPress={pickAndUploadImage}
          className="bg-black px-6 py-3 rounded-xl"
          disabled={uploading}
        >
          <Text className="text-white font-semibold">
            {uploading ? "Enviando..." : "Alterar foto de perfil"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

export default SettingsUser;
