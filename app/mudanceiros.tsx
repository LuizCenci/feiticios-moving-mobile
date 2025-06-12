import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../src/config/firebaseconfig';
import FiltroBotao from './components/filtroBotao';
import Hotbar from './components/hotbar';
interface Mudanceiro {
  userID: string;
  nome: string;
  tipoUsuario: string;
  avaliacao?: number;
  servicos?: { tipo: string; preco: string }[];
  cep: string;
}

export default function Mudanceiros() {

  const router = useRouter();
  const { cep, residencial, comercial, fretes, montagem } = useLocalSearchParams();
  const servicosSelecionados = [];
  if (residencial === 'true') servicosSelecionados.push('Mudança Residencial');
  if (comercial === 'true') servicosSelecionados.push('Mudança Comercial');
  if (fretes === 'true') servicosSelecionados.push('Pequenos Fretes');
  if (montagem === 'true') servicosSelecionados.push('Montagem/Desmontagem');

  const [mudanceiros, setMudanceiros] = useState<Mudanceiro[]>([]);
  const [loading, setLoading] = useState(true);

  async function getMudanceiroCompleto(userID: string): Promise<Mudanceiro | null> {
    const mudanceiroDoc = await getDoc(doc(db, "usuarios", userID));
    if (!mudanceiroDoc.exists()) return null;

    const mudanceiroData = mudanceiroDoc.data();
    if (mudanceiroData.tipoUsuario !== "mudanceiro") return null;

    const avalCollection = collection(db, "avaliacoes");
    const avalQuery = query(avalCollection, where("userID", "==", userID));
    const avalSnapshot = await getDocs(avalQuery);
    const avalData = avalSnapshot.docs[0]?.data();

    const servCollection = collection(db, "servicos");
    const servQuery = query(servCollection, where("mudanceiroId", "==", userID));
    const servSnapshot = await getDocs(servQuery);
    const cepList = servSnapshot.docs[0]?.data()?.cep;
    if(cepList !== cep ) return null;
    const servicosList = servSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        tipo: data.tipoServico,
        preco: data.preco ?? 'Preço não especificado'
      };
      
    });
    const tiposServico = servicosList.map(servico => servico.tipo);
    
    const mudanceiroCompleto: Mudanceiro = {
      userID,
      nome: mudanceiroData.nome,
      tipoUsuario: mudanceiroData.tipoUsuario,
      avaliacao: avalData?.avaliacao ?? 0,
      servicos: servicosList.length > 0 ? servicosList : [{ tipo: 'Serviço não especificado', preco: 'Preço não especificado' }],
      cep: cepList,
    };
    
    return mudanceiroCompleto;
  }

  async function getTodosMudanceirosCompletos(servicosSelecionados: string[]): Promise<Mudanceiro[]> {
    const mudanceirosSnapshot = await getDocs(collection(db, "usuarios"));
    const mudanceirosData = mudanceirosSnapshot.docs;

    const mudanceirosFiltrados = mudanceirosData.filter(doc => doc.data().tipoUsuario === "mudanceiro");

    const promises = mudanceirosFiltrados.map(doc => getMudanceiroCompleto(doc.id));
    const completos = await Promise.all(promises);

    if (servicosSelecionados.length === 0) {
        return completos.filter(Boolean) as Mudanceiro[];
    }

    const mudanceirosFiltradosPorServico = completos.filter(mudanceiro =>
        mudanceiro && mudanceiro.servicos.some(servico =>
            servicosSelecionados.includes(servico.tipo)
        )
    );

    return mudanceirosFiltradosPorServico;
  }

  useEffect(() => {
    getTodosMudanceirosCompletos(servicosSelecionados)
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
    <View style={{flex:1, backgroundColor:'#FEF7FF'}}>
      <FiltroBotao onPress={() => router.push({ pathname: '/filter', params: { cep:cep } })}></FiltroBotao>
      <ScrollView contentContainerStyle={styles.container}>
        
        <FlatList
          data={mudanceiros}
          keyExtractor={(item) => item.userID}
          
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.company}>{item.nome}</Text>
                <Text style={[styles.company, { marginLeft: 10 }]}>CEP: {item.cep}</Text>
              </View>

              <Text style={styles.stars}>⭐ {item.avaliacao ?? "Sem avaliação"}</Text>

              <View style={styles.tagsContainer}>
                {item.servicos?.map((servico, index) => (
                  <View key={index} style={styles.tag}>
                    <Text>{servico.tipo} - R$ {servico.preco}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push({ pathname: '/agendamento', params: { mudanceiroId: item.userID, nome:item.nome, valorBase: item.servicos[0].preco } })}
              >
                <Text style={styles.buttonText}>Selecionar</Text>
              </TouchableOpacity>
            </View>
          )}
        /> 
      </ScrollView>
      <Hotbar></Hotbar>
    </View>
    

  );
}

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
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  company: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  stars: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8,
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
  row: {
  flexDirection: 'row',
  alignItems: 'center', 
  },
  filterIcon: {
    width: '100%', 
    alignItems: 'center', 
    backgroundColor: '#9b59b6',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center', 
    marginRight: 0, 
  },

  labelRow: {
    width: '100%', 
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent:'flex-end',
  },


});
  