import React, { useEffect, useState,  } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {  doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../src/config/firebaseconfig';
interface Mudanceiro {
  userID: string;
  nome: string;
  tipoUsuario: string;
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

export default function Mudanceiros()  {
  const [mudanceiros, setMudanceiros] = useState<Mudanceiro[]>([]);
  const [loading, setLoading] = useState(true);

  async function getMudanceiroCompleto(userID: string): Promise<Mudanceiro | null> {
  // Busca o usuário mudanceiro
    const mudanceiroDoc = await getDoc(doc(db, "usuarios", userID));
    if (!mudanceiroDoc.exists()) return null;
    const mudanceiroData = mudanceiroDoc.data();

    // Busca avaliação
    const avalCollection = collection(db, "avaliacoes");
    const avalQuery = query(avalCollection, where("mudanceiroId", "==", userID));
    const avalSnapshot = await getDocs(avalQuery);
    const avalData = avalSnapshot.docs[0]?.data(); // assumindo 1 avaliação por mudanceiro

    // Busca serviços
    const servCollection = collection(db, "servicos");
    const servQuery = query(servCollection, where("mudanceiroId", "==", userID));
    const servSnapshot = await getDocs(servQuery);
    const servData = servSnapshot.docs[0]?.data();
    
  useEffect(() => {
    buscarMudanceiros();
  }, []);

  if (loading) {
    return <div>Carregando mudanceiros...</div>;
  }

  if (mudanceiros.length === 0) {
    return <div>Não há mudanceiros disponíveis no momento.</div>;
  }

  return (
    <div>
      <h1>Lista de Mudanceiros Disponíveis</h1>
      <ul>
        {mudanceiros.map((m) => (
          <li key={m.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <strong>{m.nome}</strong><br />
            Localização: {m.localizacao ?? 'Não informada'}<br />
            Avaliação: {m.avaliacao ?? 'Sem avaliação'}<br />
            Serviços: {m.servicos
              ? Object.entries(m.servicos)
                  .filter(([_, ativo]) => ativo)
                  .map(([servico]) => servico)
                  .join(', ')
              : 'Nenhum serviço informado'}
          </li>
        ))}
      </ul>
    </div>
  );
};

