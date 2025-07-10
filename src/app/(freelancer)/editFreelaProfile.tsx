import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import { useUser } from '@/context/usercontext';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

interface WorkCategory {
  id: string;
  name: string;
}

const EditFreelancerProfile = () => {
  const { freelancer, updateFreelancer } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    phone: '',
    profession: '',
    portfolio: '',
    description: '',
    hourlyRate: ''
  });
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (freelancer) {
      setForm({
        phone: freelancer.phone_number || '',
        profession: freelancer.workCategory?.name || '',
        portfolio: freelancer.portfolio_link || '',
        description: freelancer.description || '',
        hourlyRate: freelancer.hourly_rate?.toString() || ''
      });
    }
  }, [freelancer]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/work-categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        Alert.alert('Erro', 'Não foi possível carregar as categorias');
      }
    };
    
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!form.profession.trim()) {
      return Alert.alert('Atenção', 'Informe sua profissão principal');
    }

    setIsSubmitting(true);
    try {
      await api.patch(`/freelancers/${freelancer?.id}`, {
        phone_number: form.phone,
        profession: form.profession,
        portfolio_link: form.portfolio,
        description: form.description,
        hourly_rate: parseFloat(form.hourlyRate) || null
      });

      await updateFreelancer();
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.back();
    } catch (error: any) {
      Alert.alert(
        'Erro', 
        error?.response?.data?.message || 'Não foi possível atualizar o perfil'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient
        colors={['#F8FAFC', '#E2E8F0', '#CBD5E1']}
        className="flex-1"
      >
        <ScrollView 
          className="p-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#4B5563" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800 ml-4">
              Editar Perfil
            </Text>
          </View>

          {/* Formulário */}
          <View className="space-y-5">
            {/* Profissão */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Profissão Principal *
              </Text>
              <TouchableOpacity
                className="bg-white border border-gray-300 rounded-lg p-3 flex-row justify-between items-center"
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text className={form.profession ? "text-gray-800" : "text-gray-400"}>
                  {form.profession || 'Selecione sua profissão'}
                </Text>
                <MaterialIcons 
                  name={showDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={24} 
                  color="#6B7280" 
                />
              </TouchableOpacity>

              {showDropdown && (
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id}
                  className="bg-white border border-gray-200 rounded-lg mt-1 max-h-40"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        handleChange('profession', item.name);
                        setShowDropdown(false);
                      }}
                      className="px-4 py-3 border-b border-gray-100"
                    >
                      <Text className="text-gray-800">{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View className="p-4 items-center">
                      <Text className="text-gray-500">Nenhuma categoria encontrada</Text>
                    </View>
                  }
                />
              )}
            </View>

            {/* Descrição */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Sobre você
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg p-3 h-24 text-gray-800"
                placeholder="Descreva suas habilidades e experiência"
                multiline
                value={form.description}
                onChangeText={(text) => handleChange('description', text)}
              />
            </View>

            {/* Portfólio */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Link do Portfólio
              </Text>
              <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4">
                <FontAwesome name="link" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
                <TextInput
                  className="flex-1 py-3 text-gray-800"
                  placeholder="https://meuportfolio.com"
                  keyboardType="url"
                  value={form.portfolio}
                  onChangeText={(text) => handleChange('portfolio', text)}
                />
              </View>
            </View>

            {/* Valor por hora */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Valor por hora (R$)
              </Text>
              <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-4">
                <Text className="text-gray-500">R$</Text>
                <TextInput
                  className="flex-1 py-3 pl-2 text-gray-800"
                  placeholder="00,00"
                  keyboardType="numeric"
                  value={form.hourlyRate}
                  onChangeText={(text) => handleChange('hourlyRate', text.replace(/[^0-9]/g, ''))}
                />
              </View>
            </View>

            {/* Telefone */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Telefone para contato
              </Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg p-3 text-gray-800"
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(text) => handleChange('phone', text)}
              />
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              className="bg-blue-600 rounded-lg py-4 items-center justify-center mt-6 shadow-sm"
              onPress={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Salvar Alterações
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default EditFreelancerProfile;