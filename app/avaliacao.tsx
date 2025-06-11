import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Hotbar from './components/hotbar';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseconfig';

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
    const rating = avaliacoes[category];

    for (let i = 1; i <= 5; i++) {
      let iconName: 'star' | 'star-half-full' | 'star-o' = 'star-o';

      if (rating >= i) {
        iconName = 'star';
      } else if (rating >= i - 0.5) {
        iconName = 'star-half-full';
      }

      stars.push(
        <View key={i} style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => setAvaliacoes({ ...avaliacoes, [category]: i - 0.5 })}
            style={{ width: 15, alignItems: 'flex-end' }}
          >
            <FontAwesome
              name={iconName}
              size={30}
              color="#8A2BE2"
              style={{ marginHorizontal: 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAvaliacoes({ ...avaliacoes, [category]: i })}
            style={{ width: 15 }}
          />
        </View>
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
      userId: user.uid,
      data: new Date().toISOString()
    };

    try {
      const avaliacaoRef = collection(db, 'avaliacoes');
      await addDoc(avaliacaoRef, novaAvaliacao);

      Alert.alert('Sucesso', 'Avaliação enviada com sucesso!');
      setAvaliacoes({ tempo: 0, itens: 0, atendimento: 0 });
      setFeedback('');
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      Alert.alert('Erro', 'Erro ao enviar avaliação. Tente novamente.');
    }
  };

  return (
    
      <View style={{flex:1}}>
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
        </ScrollView>
        <Hotbar></Hotbar>
      </View>
    
    
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 10, borderRadius: 5, minHeight: 80 },
  button: { backgroundColor: '#8A2BE2', padding: 15, borderRadius: 8, marginTop: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  stars: { flexDirection: 'row', marginTop: 10 },
});

export default Avaliacao;
