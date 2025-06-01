import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/app/services/api';
import { useUser } from '@/app/context/usercontext';
import { LinearGradient } from 'expo-linear-gradient';
import HeaderBack from '@/app/components/GoBack';

interface WorkCategory {
  id: string;
  name: string;
}

const EditFreelancerProfile = () => {
  const { freelancer, updateFreelancer } = useUser();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [profession, setProfession] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (freelancer) {
      setPhone(freelancer.phone_number || '');
      setProfession(freelancer.workCategory?.name || '');
      setPortfolio(freelancer.portfolio_link || '');
    }
  }, [freelancer]);

  useEffect(() => {
    api.get('/work-categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Erro ao buscar categorias:', err));
  }, []);

  const handleSave = async () => {
    if (!profession.trim()) {
      return Alert.alert('Erro', 'Informe sua profissão.');
    }

    setLoading(true);
    try {
      await api.patch(`/freelancers/${freelancer?.id}`, {
        phone_number: phone,
        profession,
        portfolio_link: portfolio,
      });

      await updateFreelancer();
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.message || 'Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1">
      <LinearGradient colors={['#5d5d5d', '#777777']} className="min-h-screen p-4">
        <HeaderBack onBackPress={() => router.back()} />
        <Text className="text-3xl text-white font-bold mb-6 text-center">Editar Perfil</Text>

        {/* Profissão com Dropdown */}
        <View className="mb-4">
          <TouchableOpacity
            className="bg-white rounded-lg p-3"
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text>{profession || 'Selecione sua profissão'}</Text>
          </TouchableOpacity>

          {showDropdown && (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              className="bg-white mt-2 rounded-lg max-h-48"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setProfession(item.name);
                    setShowDropdown(false);
                  }}
                  className="px-4 py-3 border-b border-gray-200"
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Portfólio */}
        <View className="mb-4">
          <Text className="text-white mb-1">Link do Portfólio / Rede Social</Text>
          <TextInput
            className="bg-white rounded-lg p-3"
            placeholder="https://..."
            value={portfolio}
            onChangeText={setPortfolio}
          />
        </View>

        {/* Telefone */}
        <View className="mb-6">
          <Text className="text-white mb-1">Telefone</Text>
          <TextInput
            className="bg-white rounded-lg p-3"
            placeholder="(xx) xxxxx-xxxx"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          className="bg-black rounded-lg py-4 items-center mt-4"
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

export default EditFreelancerProfile;
