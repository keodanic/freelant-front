import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { api } from '@/app/services/api'; // ajuste o caminho conforme seu projeto

export default function Teste() {
const [userData, setUserData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function testarAPI() {
      try {
        const response = await api.get('/freelancers'); // ajuste para a rota que realmente existe
        console.log('Resposta da API:', response.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro ao conectar com o backend:', error.message);
        } else {
          console.error('Erro desconhecido:', error);
        }
      }
    }

    testarAPI();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dados do Usuário</Text>

      {errorMsg && <Text style={styles.error}>Erro: {errorMsg}</Text>}

      {userData ? (
        <View style={styles.card}>
          {Object.entries(userData).map(([key, value]) => (
            <Text key={key} style={styles.item}>
              <Text style={styles.label}>{key}: </Text>
              {String(value)}
            </Text>
          ))}
        </View>
      ) : !errorMsg ? (
        <Text>Carregando...</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      alignItems: 'flex-start',
    },
    title: {
      fontSize: 20,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    card: {
      backgroundColor: '#f0f0f0',
      padding: 15,
      borderRadius: 10,
      width: '100%',
    },
    item: {
      fontSize: 16,
      marginBottom: 5,
    },
    label: {
      fontWeight: 'bold',
    },
    error: {
      color: 'red',
      marginTop: 10,
    },
  });