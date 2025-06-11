import { CalendarDays } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HotbarMudanceiro from './components/hotbarMudanceiro';

const servicosAgendados = [
  {
    id: '1',
    data: '12/06/2025',
    cliente: 'João Silva',
    endereco: 'Rua das Flores, 123',
    horario: '09:00',
  },
  {
    id: '2',
    data: '14/06/2025',
    cliente: 'Maria Oliveira',
    endereco: 'Av. Brasil, 456',
    horario: '14:30',
  },
];

const Agenda = () => {
  return (
    <View style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Agenda de Serviços</Text>

        {servicosAgendados.map((servico) => (
          <View key={servico.id} style={styles.card}>
            <View style={styles.row}>
              <CalendarDays color="#6C47A3" size={20} />
              <Text style={styles.data}>{servico.data}</Text>
            </View>
            <Text style={styles.texto}><Text style={styles.label}>Cliente:</Text> {servico.cliente}</Text>
            <Text style={styles.texto}><Text style={styles.label}>Endereço:</Text> {servico.endereco}</Text>
            <Text style={styles.texto}><Text style={styles.label}>Horário:</Text> {servico.horario}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.botaoTexto}>Ver calendário completo</Text>
        </TouchableOpacity>
      </ScrollView>
      <HotbarMudanceiro></HotbarMudanceiro>
    </View>
  );
};

export default Agenda;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF7FF',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C47A3',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  data: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#6C47A3',
    fontSize: 16,
  },
  texto: {
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#BF5AF2',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
