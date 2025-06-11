// app/filtros.tsx (ou qualquer nome de tela)
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function FiltrosScreen() {
  const router = useRouter();
  const { cep } = useLocalSearchParams();
  const [localizacao, setLocalizacao] = useState('');
  type mudancasType = {
    residencial:boolean;
    comercial: boolean;
    fretes: boolean;
    montagem: boolean;
  }
  const [mudancas, setMudancas] = useState<mudancasType>({
    residencial: false,
    comercial: false,
    fretes: false,
    montagem: false,
  });
  const limparFiltros = () => {
    setMudancas({
      residencial: false,
      comercial: false,
      fretes: false,
      montagem: false,
    });
    setAvaliacao(0);
  };

  const opcoesMudanca: [keyof mudancasType, string][] = [
        ['residencial', 'Mudança Residencial'],
        ['comercial', 'Mudança Comercial'],
        ['fretes', 'Pequenos Fretes'],
        ['montagem', 'Montagem/Desmontagem'],
    ];
  
  const [avaliacao, setAvaliacao] = useState(0);
  
  const toggleCheckbox = (key: keyof mudancasType) => {
    setMudancas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Filtros</Text>

      <Text style={styles.label}>Tipo de Mudança</Text>
      
      {opcoesMudanca.map(([key, label]) => (
        <TouchableOpacity
          key={key}
          style={styles.checkboxContainer}
          onPress={() => toggleCheckbox(key)}
        >
        <Ionicons
        name={mudancas[key] ? 'checkbox' : 'square-outline'}
        size={24}
        color="black"
        />
        <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Avaliação Mínima</Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setAvaliacao(num)}>
            <FontAwesome
              name="star"
              size={30} 
              color={num <= avaliacao ? '#8A2BE2' : '#ccc'}
              style={{ marginHorizontal: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.applyButton} 
        onPress={() => router.push({pathname: '/mudanceiros', params:{cep:cep, 
                                                                      residencial:String(mudancas.residencial), 
                                                                      comercial:String(mudancas.comercial),
                                                                      fretes:String(mudancas.fretes),
                                                                      montagem:String(mudancas.montagem),}})}>
        <Text style={styles.buttonText}>Aplicar Filtros</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={limparFiltros}>
        <Text style={[styles.buttonText, { color: '#000' }]}>Limpar Filtros</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FEF7FF',
    flexGrow: 1,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#6C47A3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  applyButton: {
    backgroundColor: '#b84ce6',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 80,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 16,
  },
});
