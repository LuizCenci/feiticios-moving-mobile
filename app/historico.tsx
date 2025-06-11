import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseconfig';

export default function HistoricoMudancas() {
  const [mudancas, setMudancas] = useState([]);

  useEffect(() => {
    const fetchMudancas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, 'mudancas'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const mudancasList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMudancas(mudancasList);
    };

    fetchMudancas();
  }, []);

  return (
    <View>
      {mudancas.length === 0 ? (
        <Text>Você ainda não tem mudanças registradas.</Text>
      ) : (
        mudancas.map(mudanca => (
          <View key={mudanca.id} style={{ marginBottom: 15 }}>
            <Text>Origem: {mudanca.origem}</Text>
            <Text>Destino: {mudanca.destino}</Text>
            <Text>Data: {new Date(mudanca.data).toLocaleDateString()}</Text>
            <Text>Status: {mudanca.status}</Text>
          </View>
        ))
      )}
    </View>
  );
};


