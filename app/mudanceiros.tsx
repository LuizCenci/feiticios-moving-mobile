import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../src/config/firebaseconfig';

interface Mudanceiro {
  userID: string;
  nome: string;
}
interface Avaliacao {
  userID: string; // referência para o Mudanceiro
  avaliacao: number;
}

interface Servicos {
  userID: string; // referência para o Mudanceiro
  residencial?: boolean;
  comercial?: boolean;
  fretes?: boolean;
  montagem?: boolean;
}

export default function Mudanceiros() {
  const [mudanceiros, setMudanceiros] = useState<Mudanceiro[]>([]);
  const [loading, setLoading] = useState(true);

  async function getMudanceiroCompleto(userID: string): Promise<Mudanceiro | null> {
    const mudanceiroDoc = await getDoc(doc(db, "usuarios", userID));
    if (!mudanceiroDoc.exists()) return null;
    const mudanceiroData = mudanceiroDoc.data();

    const avalCollection = collection(db, "avaliacoes");
    const avalQuery = query(avalCollection, where("mudanceiroId", "==", userID));
    const avalSnapshot = await getDocs(avalQuery);
    const avalData = avalSnapshot.docs[0]?.data();

    const servCollection = collection(db, "servicos");
    const servQuery = query(servCollection, where("mudanceiroId", "==", userID));
    const servSnapshot = await getDocs(servQuery);
    const servData = servSnapshot.docs[0]?.data();

    const mudanceiroCompleto: Mudanceiro = {
      userID,
      nome: mudanceiroData.nome,
      avaliacao: avalData?.avaliacao,
      servicos: servData
        ? {
            residencial: servData.residencial,
            comercial: servData.comercial,
            fretes: servData.fretes,
            montagem: servData.montagem,
          }
        : undefined,
    };

    return mudanceiroCompleto;
  }

  async function getTodosMudanceirosCompletos(): Promise<Mudanceiro[]> {
    const mudanceirosSnapshot = await getDocs(collection(db, "usuarios"));
    const mudanceirosData = mudanceirosSnapshot.docs;

    const promises = mudanceirosData.map((doc) => getMudanceiroCompleto(doc.id));
    const completos = await Promise.all(promises);

    return completos.filter(Boolean) as Mudanceiro[];
  }

  useEffect(() => {
    getTodosMudanceirosCompletos()
      .then((data) => setMudanceiros(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1c81e7" />
      </View>
    );
  }

  return (
    <FlatList
      data={mudanceiros}
      keyExtractor={(item) => item.userID}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text>Avaliação: {item.avaliacao ?? "Sem avaliação"}</Text>
          <Text>Serviços:</Text>
          <View style={styles.servicosList}>
            {item.servicos?.residencial && <Text style={styles.servicoItem}>• Residencial</Text>}
            {item.servicos?.comercial && <Text style={styles.servicoItem}>• Comercial</Text>}
            {item.servicos?.fretes && <Text style={styles.servicoItem}>• Fretes</Text>}
            {item.servicos?.montagem && <Text style={styles.servicoItem}>• Montagem</Text>}
            {!item.servicos && <Text style={styles.servicoItem}>Nenhum serviço listado</Text>}
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  servicosList: {
    marginTop: 4,
  },
  servicoItem: {
    marginLeft: 8,
    fontSize: 14,
  },
});



