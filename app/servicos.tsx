import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../src/config/firebaseconfig';

export default function ServicosDoMudanceiro() {
    type Servico = {
        id: string;
        tipoServico: string;
        cep: string;
        preco: number;
        };
  const [servicos, setServicos] = useState<Servico[]>([]);

  const fetchServicos = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        console.log("Usuário logado:", user);

        if (!user) {
        console.warn("Nenhum usuário logado");
        return;
        }

        const q = query(collection(db, 'servicos'), where('mudanceiroId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        console.log("Serviços encontrados:", querySnapshot.size);

        const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        }));

        setServicos(lista);
    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
    }
};


  const deletarServico = async (id: string) => {
    try {
        await deleteDoc(doc(db, 'servicos', id));
        console.log('Serviço deletado com sucesso!');

        setServicos(prev => prev.filter(servico => servico.id !== id));
    } catch (error) {
        console.error('Erro ao deletar serviço:', error);
    }
    };

  useEffect(() => {
    fetchServicos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Serviços</Text>

      {servicos.length === 0 ? (
        <Text style={styles.msg}>Nenhum serviço encontrado.</Text>
      ) : (
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.info}><Text style={styles.label}>Tipo:</Text> {item.tipoServico}</Text>
              <Text style={styles.info}><Text style={styles.label}>CEP:</Text> {item.cep}</Text>
              <Text style={styles.info}><Text style={styles.label}>Preço:</Text> R$ {item.preco}</Text>
              <TouchableOpacity style={styles.btnDelete} onPress={() => deletarServico(item.id)}>
                <Text style={styles.btnDeleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FEF7FF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  msg: {
    fontSize: 16,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#6C47A3',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  btnDelete: {
    marginTop: 10,
    backgroundColor: '#BF5AF2',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDeleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
