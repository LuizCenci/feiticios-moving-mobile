import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../src/config/firebaseconfig';
import Hotbar from './components/hotbar';

export default function Agendamento() {
    const router = useRouter(); 
    const { nome, valorBase, mudanceiroId } = useLocalSearchParams();

    const [origem, setOrigem] = useState('');
    const [destino, setDestino] = useState('');
    const [itens, setItens] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');
    const [distancia, setDistancia] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                console.log("Nenhum usuário logado.");
            }
        });
        return () => unsubscribe();
    }, []);
    
    const valorEstimado = useMemo(() => {
        const base = parseFloat(valorBase as string) || 0;
        const km = parseFloat(distancia) || 0;
        const PRECO_POR_KM = 6;
        if (km === 0) return base;
        return base + (km * PRECO_POR_KM);
    }, [distancia, valorBase]);

    const formatDate = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const cleanedLength = cleaned.length;

        if (cleanedLength > 4) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
        } else if (cleanedLength > 2) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        }
        
        return cleaned;
    };

    const formatTime = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const cleanedLength = cleaned.length;

        if (cleanedLength > 2) {
            return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
        }

        return cleaned;
    };

    const handleAgendar = async () => {
        if (!user) {
            Alert.alert('Erro', 'Você precisa estar logado para agendar uma mudança.');
            return;
        }
        if (!origem || !destino || !distancia || !data || !hora) {
            Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos para continuar.');
            return;
        }
        setLoading(true);
        try {
            const agendamentosCollectionRef = collection(db, 'usuarios', user.uid, 'agendamentos');
            await addDoc(agendamentosCollectionRef, {
                mudanceiroNome: nome,
                mudanceiroId: mudanceiroId,
                clienteId: user.uid,
                clienteNome: user.email,
                enderecoOrigem: origem,
                enderecoDestino: destino,
                itens: itens.split(',').map(item => item.trim()).filter(item => item),
                dataAgendamento: data,
                horaAgendamento: hora,
                distanciaKm: parseFloat(distancia),
                valorEstimado: valorEstimado,
                status: 'agendado',
                dataCriacao: new Date(),
            });
            const agendamentosCollectionRef1 = collection(db, 'usuarios', mudanceiroId, 'agendamentos');
            await addDoc(agendamentosCollectionRef1, {
                mudanceiroNome: nome,
                mudanceiroId: mudanceiroId,
                clienteId: user.uid,
                clienteNome: user.email,
                enderecoOrigem: origem,
                enderecoDestino: destino,
                itens: itens.split(',').map(item => item.trim()).filter(item => item),
                dataAgendamento: data,
                horaAgendamento: hora,
                distanciaKm: parseFloat(distancia),
                valorEstimado: valorEstimado,
                status: 'agendado',
                dataCriacao: new Date(),
            });
            Alert.alert('Sucesso!', 'Sua mudança foi agendada.');
            router.push('/dashboard');
        } catch (error) {
            console.error("Erro ao agendar mudança: ", error);
            Alert.alert('Erro', 'Ocorreu um erro ao agendar sua mudança. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: '#FEF7FF'}}>
            <ScrollView contentContainerStyle={styles.container}>
                <Image
                    source={require('../assets/images/cauldron.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Agende sua Mudança</Text>

                <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={`Mudanceiro: ${nome as string || 'Não especificado'}`}
                    editable={false} 
                />
                <TextInput
                    style={styles.input}
                    placeholder="Endereço de origem"
                    value={origem}
                    onChangeText={setOrigem}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Endereço de destino"
                    value={destino}
                    onChangeText={setDestino}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Distância da Viagem (KM)"
                    value={distancia}
                    onChangeText={setDistancia}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Itens (ex: sofá, geladeira, 10 caixas)"
                    value={itens}
                    onChangeText={setItens}
                />

                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginRight: 8 }]}
                        placeholder="Data (dd/mm/aaaa)"
                        value={data}
                        
                        onChangeText={(text) => setData(formatDate(text))}
                        keyboardType="numeric"
                        maxLength={10} 
                    />
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Horário (hh:mm)"
                        value={hora}
                    
                        onChangeText={(text) => setHora(formatTime(text))}
                        keyboardType="numeric"
                        maxLength={5} 
                    />
                </View>
                
                <View style={styles.resumo}>
                    <Text style={styles.resumoTitle}>Resumo do Agendamento</Text>
                    <Text style={styles.resumoItem}>• Distância: {distancia ? `${distancia} km` : 'Aguardando...'}</Text>
                    <Text style={styles.resumoItem}>• Itens: {itens || 'Nenhum'}</Text>
                    <Text style={styles.valorFinal}>
                        • Valor estimado: {valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </Text>
                </View>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleAgendar}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                    </Text>
                </TouchableOpacity>
                
            </ScrollView>
            <Hotbar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FEF7FF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#6C47A3',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 12,
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#f0eafc',
        color: '#6C47A3',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#BF5AF2',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resumo: {
        width: '100%',
        marginVertical: 16,
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    resumoTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
        fontSize: 16,
        color: '#343a40',
    },
    resumoItem: {
      marginBottom: 5,
      fontSize: 14,
      color: '#495057',
    },
    valorFinal: {
        fontWeight: 'bold',
        marginTop: 8,
        fontSize: 16,
        color: '#16a34a',
    },
});
