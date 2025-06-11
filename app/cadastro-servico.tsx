import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { push, ref } from 'firebase/database';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { database } from '../src/config/firebaseconfig';

export default function CadastroServico() {
  const [tipoServico, setTipoServico] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cep, setCep] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [preco, setPreco] = useState('');
  const [contato, setContato] = useState('');
  const router = useRouter();


  const handleCadastro = async () => {
    if (!tipoServico || !descricao || !cep || !veiculo || !preco || !contato) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const servicosRef = ref(database, 'servicos');
      await push(servicosRef, {
        tipoServico,
        descricao,
        cep,
        veiculo,
        preco,
        contato,
        criadoEm: new Date().toISOString(),
      });

      Alert.alert('Sucesso', 'Serviço cadastrado com sucesso!')
      router.replace('/dashboardMudanceiro');
      setTipoServico('');
      setDescricao('');
      setCep('');
      setVeiculo('');
      setPreco('');
      setContato('');
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o serviço.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Serviço</Text>

      <Text style={styles.label}>Tipo de serviço</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tipoServico}
          onValueChange={(itemValue) => setTipoServico(itemValue)}
        >
          <Picker.Item label="Selecione um tipo" value="" />
          <Picker.Item label="Montagem/Desmontagem" value="Montagem/Desmontagem" />
          <Picker.Item label="Mudança Comercial" value="Mudança Comercial" />
          <Picker.Item label="Mudança Residencial" value="Mudança Residencial" />
          <Picker.Item label="Pequenos Fretes" value="Pequenos Fretes" />
        </Picker>
      </View>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Área de serviço, disponibilidade, informações adicionais..."
        placeholderTextColor="#bfbfbf"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <Text style={styles.label}>CEP</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 85560000"
        placeholderTextColor="#bfbfbf"
        keyboardType="numeric"
        maxLength={8} 
        value={cep}
        onChangeText={(text) => {
        const sanitized = text.replace(/[^0-9]/g, '');
        setCep(sanitized);
        }}
      />

      <Text style={styles.label}>Tipo de veículo</Text>
      <TextInput
        style={styles.input}
        placeholder="Caminhão Pequeno"
        placeholderTextColor="#bfbfbf"
        value={veiculo}
        onChangeText={setVeiculo}
      />

      <View style={{ marginTop: 16 }}>
      <Text style={styles.label}>Preço base</Text>
      <View style={{ position: 'relative', width: '100%' }}>
        <Text style={styles.currency}>R$</Text>
        <TextInput
          style={[styles.input, { paddingLeft: 30 }]}
          placeholder="250,00"
          placeholderTextColor="#bfbfbf"
          keyboardType="numeric"
          value={preco}
          onChangeText={(text) => {
          const sanitized = text.replace(/[^0-9.,]/g, '');
          setPreco(sanitized);
          }}
          maxLength={10}
        />
      </View>
      </View>


      <Text style={styles.label}>Meio de contato</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: joao@gmail.com, 57 992143984"
        placeholderTextColor="#bfbfbf"
        value={contato}
        onChangeText={setContato}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar serviço</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FEF7FF',
    flexGrow: 1,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6C47A3',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#6C47A3',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#BF5AF2',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  currency: {
  position: 'absolute',
  left: 10,
  top: '50%',
  transform: [{ translateY: -10 }],
  color: '#8e8f91',
  fontSize: 16,
  fontWeight: '600',
  zIndex: 1,
},

});
