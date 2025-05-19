import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
            color={i <= avaliacoes[category] ? '#8A2BE2' : '#ccc'}
            style={{ marginHorizontal: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.stars}>{stars}</View>;
  };

  const handleSubmit = () => {
    console.log('Avaliação enviada:', avaliacoes, feedback);
    alert('Obrigado pela avaliação!');
    router.back(); // volta para a tela anterior
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avalie sua mudança</Text>
      <Text style={styles.subtitle}>Como foi o processo de mudança?</Text>

      <Text style={styles.label}>Tempo</Text>
      {renderStars('tempo')}

      <Text style={styles.label}>Itens em bom estado</Text>
      {renderStars('itens')}

      <Text style={styles.label}>Atendimento</Text>
      {renderStars('atendimento')}

      <Text style={styles.label}>Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu feedback"
        multiline
        value={feedback}
        onChangeText={setFeedback}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f1ff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subtitle: { fontSize: 16, marginBottom: 20, fontWeight: 'bold' },
  label: { fontSize: 16, marginTop: 10 },
  stars: { flexDirection: 'row', marginVertical: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    height: 100,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#8A2BE2',
    padding: 14,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});

export default Avaliacao;
