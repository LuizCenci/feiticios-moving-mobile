import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { app, auth } from '../src/config/firebaseconfig';

const db = getFirestore(app);

const Avaliacao = () => {
  const router = useRouter();
  const [avaliacoes, setAvaliacoes] = useState({
    tempo: 0,
    itens: 0,
    atendimento: 0,
  });
  const [feedback, setFeedback] = useState('');

  const renderStars = (category: keyof typeof avaliacoes) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setAvaliacoes({ ...avaliacoes, [category]: i })}>
          <FontAwesome
            name="star"
            size={30}
            color={i <= avaliacoes[category] ? '#BF5AF2' : '#ccc'}
            style={{ marginHorizontal: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.stars}>{stars}</View>;
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    const novaAvaliacao = {
      ...avaliacoes,
      feedback,
      data: Timestamp.now(),
      usuarioId: user.uid,
    };

    try {
      await addDoc(collection(db, 'avaliacoes'), novaAvaliacao);
      Alert.alert('Sucesso', 'Avaliação enviada com sucesso!');
      setAvaliacoes({ tempo: 0, itens: 0, atendimento: 0 });
      setFeedback('');
      router.push('/');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      Alert.alert('Erro', 'Erro ao enviar avaliação. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Avalie sua experiência:</Text>

        <Text style={styles.label}>Tempo de entrega:</Text>
        {renderStars('tempo')}

        <Text style={styles.label}>Condição dos itens:</Text>
        {renderStars('itens')}

        <Text style={styles.label}>Atendimento:</Text>
        {renderStars('atendimento')}

        <Text style={styles.label}>Feedback:</Text>
        <TextInput
          style={styles.input}
          placeholder="Escreva aqui..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar Avaliação</Text>
        </TouchableOpacity>

        {/* Imagem centralizada no final */}
        <View style={styles.logoWrapper}>
          <Image source={require('../assets/images/cauldron.png')} style={styles.logo} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FEF7FF',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6C47A3',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BF5AF2',
    padding: 10,
    marginTop: 10,
    borderRadius: 25,
    minHeight: 80,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#BF5AF2',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stars: {
    flexDirection: 'row',
    marginTop: 10,
  },
  logoWrapper: {
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 125,
    height: 125,
  },
});

export default Avaliacao;
