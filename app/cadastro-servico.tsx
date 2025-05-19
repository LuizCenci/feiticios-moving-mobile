import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function CadastroServico() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Serviço</Text>

      <Text style={styles.label}>Tipo de serviço</Text>
      <TextInput style={styles.input} placeholder="Frete, montagem, desmontagem..." />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Área de serviço, disponibilidade, informações adicionais..."
        multiline
      />

      <Text style={styles.label}>CEP</Text>
      <TextInput style={styles.input} placeholder="Ex: 85560000" keyboardType="numeric" />

      <Text style={styles.label}>Tipo de veículo</Text>
      <TextInput style={styles.input} placeholder="Caminhão Pequeno" />

      <Text style={styles.label}>Preço base</Text>
      <TextInput style={styles.input} placeholder="R$ 250,00" keyboardType="numeric" />

      <Text style={styles.label}>Meio de contato</Text>
      <TextInput style={styles.input} placeholder="Ex: joao@gmail.com, 57 992143984" />

      <TouchableOpacity style={styles.button}>
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
});
