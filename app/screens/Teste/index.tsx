import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { api } from '@/app/services/api';

export default function Teste() {
  const [users, setUsers] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function testarAPI() {
      try {
        const response = await api.get('/freelancers');
        setUsers(response.data);
        setErrorMsg(null);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg('Erro desconhecido');
        }
      }
    }

    testarAPI();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>

      {errorMsg && <Text style={styles.error}>Erro: {errorMsg}</Text>}

      {users.length > 0 ? (
        users.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.item}><Text style={styles.label}>Nome:</Text> {user.name}</Text>
            <Text style={styles.item}><Text style={styles.label}>Email:</Text> {user.email}</Text>
            <Text style={styles.item}><Text style={styles.label}>Categoria:</Text> {user.workCategory?.name}</Text>
          </View>
        ))
      ) : !errorMsg ? (
        <Text>Carregando...</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'stretch',
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
    marginBottom: 10,
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
