import { useLocalSearchParams, useRouter } from 'expo-router';
// 1. Importações necessárias do Firebase para autenticação e escrita no banco
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Provider as PaperProvider, TextInput } from 'react-native-paper';
import { db } from '../src/config/firebaseconfig';
import Hotbar from './components/hotbar';

export default function Agendamento() {
    const router = useRouter(); 
    const { localizacao, avaliacao, residencial, comercial, fretes, montagem, nome, valorBase, mudanceiroId } = useLocalSearchParams();

    // Estados do formulário e de controle
    const [origem, setOrigem] = useState('');
    const [destino, setDestino] = useState('');
    const [itens, setItens] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');
    const [distancia, setDistancia] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // 2. Efeito para obter o usuário autenticado
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                console.log("Nenhum usuário logado.");
                // Opcional: redirecionar para a tela de login se não houver usuário
                // router.push('/login'); 
            }
        });

        // Limpa a inscrição ao desmontar o componente
        return () => unsubscribe();
    }, []);
    
    // Lógica de cálculo do valor estimado (permanece a mesma)
    const valorEstimado = useMemo(() => {
        const base = parseFloat(valorBase as string) || 0;
        const km = parseFloat(distancia) || 0;
        const PRECO_POR_KM = 6;

        if (km === 0) return base;
        return base + (km * PRECO_POR_KM);
    }, [distancia, valorBase]);

    // 3. Função para lidar com o agendamento e salvar no Firestore
    const handleAgendar = async () => {
        // Valida se o usuário está logado
        if (!user) {
            Alert.alert('Erro', 'Você precisa estar logado para agendar uma mudança.');
            return;
        }
        // Valida se os campos obrigatórios foram preenchidos
        if (!origem || !destino || !distancia || !data || !hora) {
            Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos para continuar.');
            return;
        }

        setLoading(true);

        try {
            // Cria uma referência para a subcoleção 'agendamentos' do usuário logado
            const agendamentosCollectionRef = collection(db, 'usuarios', user.uid, 'agendamentos');
            
            // Adiciona um novo documento com os dados do agendamento
            await addDoc(agendamentosCollectionRef, {
                mudanceiroNome: nome,
                mudanceiroId: mudanceiroId, // Salva também o ID do mudanceiro
                clienteId: user.uid,
                enderecoOrigem: origem,
                enderecoDestino: destino,
                // Salva os itens como um array para facilitar a manipulação futura
                itens: itens.split(',').map(item => item.trim()).filter(item => item),
                dataAgendamento: data,
                horaAgendamento: hora,
                distanciaKm: parseFloat(distancia),
                valorEstimado: valorEstimado,
                status: 'agendado', // Define um status inicial
                dataCriacao: new Date(), // Adiciona um timestamp de quando foi criado
            });

            Alert.alert('Sucesso!', 'Sua mudança foi agendada.');
            router.push('/dashboard'); // Redireciona para a home após o sucesso

        } catch (error) {
            console.error("Erro ao agendar mudança: ", error);
            Alert.alert('Erro', 'Ocorreu um erro ao agendar sua mudança. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaperProvider>
            <ScrollView contentContainerStyle={styles.container}>
                <Image
                    source={require('../assets/images/cauldron.png')}
                    style={{ width: 60, height: 60, marginBottom: 5 }}
                />
                <Text style={styles.title}>Feitiços Moving</Text>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.subtitle}>Agende sua mudança</Text>

                        <TextInput
                            label="Mudanceiro Selecionado"
                            value={nome as string || 'Não especificado'}
                            editable={false} 
                            style={styles.input}
                            theme={{ colors: { primary: '#000', onSurfaceVariant: '#000' } }}
                            textColor='#808080'
                        />
                        <TextInput
                            textColor="#000"
                            label="Endereço de origem"
                            value={origem}
                            onChangeText={setOrigem}
                            style={styles.input}
                            theme={{ colors: { primary: '#000', onSurfaceVariant: '#000' } }}
                        />
                        <TextInput
                            textColor="#000"
                            label="Endereço de destino"
                            value={destino}
                            onChangeText={setDestino}
                            style={styles.input}
                            theme={{ colors: { primary: '#000', onSurfaceVariant: '#000' } }}
                        />
                        <TextInput
                            textColor="#000"
                            label="Distância da Viagem (KM)"
                            value={distancia}
                            onChangeText={setDistancia}
                            style={styles.input}
                            keyboardType="numeric"
                            theme={{ colors: { primary: '#000', onSurfaceVariant: '#000' } }}
                        />
                        <TextInput
                            textColor="#000"
                            label="Itens da mudança (separados por vírgula)"
                            value={itens}
                            onChangeText={setItens}
                            style={styles.input}
                            theme={{ colors: { primary: '#000', onSurfaceVariant: '#000' } }}
                        />

                        <View style={styles.row}>
                            <TextInput
                                textColor="#000"
                                label="Data"
                                value={data}
                                onChangeText={setData}
                                style={[styles.input, { flex: 1, marginRight: 8 }]}
                                placeholder="dd/mm/aaaa"
                                theme={{ colors: { primary: '#000', onSurfaceVariant: '#000' } }}
                            />
                            <TextInput
                                textColor="#000"
                                label="Horário"
                                value={hora}
                                onChangeText={setHora}
                                style={[styles.input, { flex: 1 }]}
                                placeholder="--:--"
                                theme={{ colors: { primary: '#000', onSurfaceVariant: '#000' } }}
                            />
                        </View>
                        
                        <View style={styles.resumo}>
                            <Text style={styles.resumoTitle}>Resumo do Agendamento</Text>
                            <Text style={styles.resumoItem}>• Mudanceiro: {nome || 'N/A'}</Text>
                            <Text style={styles.resumoItem}>• Distância: {distancia ? `${distancia} km` : 'Aguardando informação'}</Text>
                            <Text style={styles.resumoItem}>• Itens: {itens || 'Nenhum item informado'}</Text>
                            <Text style={styles.valorFinal}>
                                • Valor estimado: {valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </Text>
                        </View>

                        {/* 4. Botão atualizado para chamar a função e mostrar estado de loading */}
                        <Button 
                            mode="contained" 
                            style={styles.botao} 
                            textColor="#fff"
                            onPress={handleAgendar}
                            disabled={loading}
                        >
                            {loading ? 'Agendando...' : 'Agendar Mudança'}
                        </Button>
                    </Card.Content>
                </Card>
                
            </ScrollView>
            <Hotbar />
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FEF7FF',
        flexGrow: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginVertical: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    card: {
        width: '100%',
        padding: 12,
        backgroundColor: '#fff',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 12,
        fontWeight: '600',
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    resumo: {
        marginVertical: 16,
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    resumoTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16,
    },
    resumoItem: {
      marginBottom: 4,
    },
    valorFinal: {
        fontWeight: 'bold',
        marginTop: 6,
        color: '#166534' // Cor verde para destacar o valor
    },
    botao: {
        backgroundColor: '#d946ef',
        marginTop: 8,
        paddingVertical: 4,
    },
});