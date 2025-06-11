import { useRouter } from 'expo-router';
import { Calendar, ClipboardList } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardMudanceiro() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/cauldron.png')} style={styles.logo} />
      <Text style={styles.title}>Olá, Mudanceiro!</Text>
      <Text style={styles.subtitle}>O que deseja fazer?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/cadastro-servico')}
      >
        <ClipboardList size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>Cadastrar novo serviço</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/agenda')}
      >
        <Calendar size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.buttonText}>Ver minha agenda</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF7FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6C47A3',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#BF5AF2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
