import { useRouter } from 'expo-router';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../src/config/firebaseconfig';
import Hotbar from './components/hotbar';

export default function HistoricoMudancas() {
  const router = useRouter();
  const [mudancas, setMudancas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');


  useEffect(() => {
    const fetchMudancas = async () => {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        setMensagem('Usuário não autenticado.');
        setLoading(false);
        return;
      }
      
      try {
        const agendamentosRef = collection(doc(db, 'usuarios', user.uid), 'agendamentos');
        const querySnapshot = await getDocs(agendamentosRef);

        if (querySnapshot.empty) {
          setMensagem('Você ainda não tem mudanças registradas.');
        } else {
          const mudancasList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMudancas(mudancasList);
        }
      } catch (error) {
        console.error("Erro ao buscar agendamentos: ", error);
        setMensagem("Ocorreu um erro ao buscar seu histórico.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchMudancas();
      } else {
        setLoading(false);
        setMensagem('Por favor, faça login para ver seu histórico.');
      }
    });

    return () => unsubscribe();
  }, []);
  
  const handleFinalizarMudanca = async (itemParaAtualizar) => {
    try {
      const agendamentoRef = doc(db, 'usuarios', auth.currentUser.uid, 'agendamentos', itemParaAtualizar.id);

      await updateDoc(agendamentoRef, {
        status: 'Finalizado'
      });

      setMudancas(currentMudancas => 
        currentMudancas.map(m => 
          m.id === itemParaAtualizar.id ? { ...m, status: 'Finalizado' } : m
        )
      );

      router.push({ 
        pathname: '/avaliacao', 
        params: { 
          mudanceiroId: itemParaAtualizar.mudanceiroId, 
          agendamentoId: itemParaAtualizar.id 
        } 
      });

    } catch (error) {
      console.error("Erro ao finalizar a mudança:", error);
      Alert.alert("Erro", "Não foi possível atualizar o status da mudança. Tente novamente.");
    }
  };


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}><Text style={styles.label}>Origem:</Text> {item.enderecoOrigem || 'Não informado'}</Text>
      <Text style={styles.cardText}><Text style={styles.label}>Destino:</Text> {item.enderecoDestino || 'Não informado'}</Text>
      <Text style={styles.cardText}><Text style={styles.label}>Data:</Text> {item.dataAgendamento} </Text>
      <Text style={styles.cardText}><Text style={styles.label}>Status:</Text> {item.status || 'Não informado'}</Text>
      <Text style={styles.cardText}><Text style={styles.label}>Mudanceiro:</Text> {item.mudanceiroNome}</Text>
      <Text style={styles.cardText}><Text style={styles.label}>Valor:</Text> R$ {item.valorEstimado || '0,00'}</Text>
      <View style={styles.itemsContainer}>
        <Text style={styles.label}>Itens da Mudança:</Text>
        {item.itens.map((item, index) =>
        <Text key={index} style={styles.itemText}>
          -{item}
        </Text>
        )}
      </View>
      
      {item.status !== 'Finalizado' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleFinalizarMudanca(item)}
        >
          <Text style={styles.buttonText}>Finalizar Mudança</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C47A3" />
        <Text>Buscando seu histórico...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FEF7FF' }}>
      {mudancas.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text>{mensagem}</Text>
        </View>
      ) : (
        <FlatList
          data={mudancas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.container}
          extraData={mudancas}
        />
      )}
      <Hotbar></Hotbar>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF7FF',
    padding: 20,
    paddingBottom: 50,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF7FF', 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    backgroundColor: '#BF5AF2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  itemText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 10,
    marginTop: 5,
  },
});