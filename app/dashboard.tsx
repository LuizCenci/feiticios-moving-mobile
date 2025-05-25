import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useRouter} from 'expo-router'

export default function Home() {
    const router = useRouter(); 
    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../assets/images/cauldron.png')} style={{ width: 70, height: 70, marginBottom: 10, marginLeft: 150 }} />
        <Text style={styles.title}>Feitiços moving</Text>

        <Text style={styles.label}>Para onde você quer se mudar?</Text>
        <TextInput style={styles.input} placeholder="Digite a Cidade ou Bairro" />

        <TouchableOpacity style={styles.button} onPress={()=> router.push('/agendamento')}>
            <Text style={styles.buttonText}>Iniciar Mudança</Text>
        </TouchableOpacity>

        <Text style={styles.subTitle}>Tipo de Mudança</Text>

        <View style={styles.tagsContainer}>
            <TouchableOpacity style={styles.tag}><Ionicons name="home" size={16} /> <Text>Residencial</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tag}><Ionicons name="business" size={16} /> <Text>Empresarial</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tag}><Ionicons name="construct" size={16} /> <Text>Desmontagem</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tag}><Ionicons name="cube" size={16} /> <Text>Apenas Entrega</Text></TouchableOpacity>
        </View>

        <Text style={styles.subTitle}>Mudanceiros em Destaque</Text>
        <View style={styles.card}>
            <Text style={styles.company}>Empresa X</Text>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF7FF',
    padding: 20,
    paddingBottom: 50,
    flexGrow: 1,
  },
  logo: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6C47A3',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#BF5AF2',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: '#fff',
    borderColor: '#6C47A3',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  company: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  stars: {
    fontSize: 18,
    marginTop: 4,
  },
});