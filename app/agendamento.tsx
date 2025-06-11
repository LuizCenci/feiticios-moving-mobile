import React, { useState, useRef, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../src/config/firebaseconfig';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Menu, Provider as PaperProvider, TextInput } from 'react-native-paper';

export default function Agendamento() {
    const router = useRouter();
    const { localizacao, avaliacao, residencial, comercial, fretes, montagem } = useLocalSearchParams();

    const [resultados, setResultados] = useState<any[]>([]);
    const [mudanceiros, setMudanceiros] = useState<string[]>([]);

    const buscarMudanceiros = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'mudanceiro'));
            const mudanceirosArray: any[] = [];
            querySnapshot.forEach((doc) => {
                mudanceirosArray.push({ id: doc.id, ...doc.data() });
            });

            setResultados(mudanceirosArray);
            setMudanceiros(mudanceirosArray.map((m) => m.nome));
        } catch (error) {
            console.error('Erro ao buscar mudanceiros:', error);
            setResultados([]);
            setMudanceiros([]);
        }
    };

    const filtrarMudanceiros = () => {
        let filtrados = resultados;

        if (localizacao) {
            filtrados = filtrados.filter((m) => m.localizacao?.toLowerCase() === localizacao.toLowerCase());
        }

        if (avaliacao) {
            const minAvaliacao = parseFloat(avaliacao as string);
            filtrados = filtrados.filter((m) => parseFloat(m.avaliacao) >= minAvaliacao);
        }

        const filtrosServicos = {
            residencial: residencial === 'true',
            comercial: comercial === 'true',
            fretes: fretes === 'true',
            montagem: montagem === 'true',
        };

        Object.entries(filtrosServicos).forEach(([tipo, ativo]) => {
            if (ativo) {
                filtrados = filtrados.filter((m) => m.servicos?.[tipo]);
            }
        });

        const nomesFiltrados = filtrados.map((m) => m.nome);
        setMudanceiros(nomesFiltrados);
    };

    useEffect(() => {
        buscarMudanceiros();
    }, []);

    useEffect(() => {
        if (resultados.length > 0) {
            filtrarMudanceiros();
        }
    }, [resultados, localizacao, avaliacao, residencial, comercial, fretes, montagem]);

    const [origem, setOrigem] = useState('');
    const [destino, setDestino] = useState('');
    const [itens, setItens] = useState('');
    const [data, setData] = useState('');
    const [hora, setHora] = useState('');

    const [mudanceiro, setMudanceiro] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [anchor, setAnchor] = useState(null);

    const buttonRef = useRef(null);

    const openMenu = () => {
        if (buttonRef.current) {
            buttonRef.current.measure((fx, fy, width, height, px, py) => {
                setAnchor({ x: px, y: py + height - 50 });
                setMenuVisible(true);
            });
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
                            label="Itens da mudança"
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

                        <View style={styles.menuContainer}>
                            <View style={styles.labelRow}>
                                <Text style={styles.pickerLabel}>Escolha um mudanceiro</Text>
                                <TouchableOpacity style={styles.filterIcon} onPress={() => router.push('/filter')}>
                                    <MaterialCommunityIcons name="filter-variant" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <Button
                                mode="outlined"
                                onPress={openMenu}
                                style={styles.dropdownButton}
                                labelStyle={{ color: '#000' }}
                                contentStyle={{ justifyContent: 'space-between' }}
                                ref={buttonRef}
                            >
                                {mudanceiro || 'Selecione...'}
                            </Button>

                            <Menu
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                anchor={anchor}
                                style={styles.dropdownMenu}
                            >
                                {mudanceiros.length === 0 ? (
                                    <Menu.Item title="Nenhum disponível" disabled />
                                ) : (
                                    mudanceiros.map((option, index) => (
                                        <Menu.Item
                                            key={index}
                                            onPress={() => {
                                                setMudanceiro(option);
                                                setMenuVisible(false);
                                            }}
                                            title={option}
                                            titleStyle={{ color: '#000' }}
                                        />
                                    ))
                                )}
                            </Menu>
                        </View>

                        <View style={styles.resumo}>
                            <Text style={styles.resumoTitle}>Resumo</Text>
                            <Text>• Distância: 12km</Text>
                            <Text>• Itens: sofá, geladeira, 10 caixas</Text>
                            <Text>• Valor estimado: R$180</Text>
                        </View>

                        <Button mode="contained" style={styles.botao} textColor="#000">
                            Agendar Mudança
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
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
    menuContainer: {
        marginVertical: 12,
    },
    pickerLabel: {
        marginBottom: 4,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    dropdownButton: {
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: '#fff',
        height: 50,
        justifyContent: 'center',
    },
    dropdownMenu: {
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    resumo: {
        marginVertical: 16,
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
    },
    resumoTitle: {
        fontWeight: 'bold',
        marginBottom: 6,
    },
    botao: {
        color: '#fff',
        backgroundColor: '#d946ef',
        marginTop: 8,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    filterIcon: {
        backgroundColor: '#9b59b6',
        borderRadius: 16,
        padding: 6,
        marginLeft: 10,
    },
});
