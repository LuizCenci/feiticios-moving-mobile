import { useRouter } from 'expo-router';
import { Truck  } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput } from 'react-native';
import HotbarMudanceiro from './components/hotbarMudanceiro';

export default function DashboardCliente() {
  const router = useRouter();
  const [cep, setCep] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ ...styles.container, flexGrow: 1 }}>
        <Image source={require('../assets/images/cauldron.png')} style={styles.logo} />
        <Text style={styles.title}>Olá, cliente!</Text>
        <Text style={styles.subtitle}>Para onde você quer se mudar?</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o CEP"
          placeholderTextColor="#999"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('CEP digitado:', cep);
            // router.push('/rota-para-mudar-ou-agendar');
          }}
        >
          <Truck size={24} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>Iniciar mudança</Text>
        </TouchableOpacity>
      </ScrollView>
      <HotbarMudanceiro />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BF5AF2',
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
