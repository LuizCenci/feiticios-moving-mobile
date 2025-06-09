import React, { useState, useRef, useEffect } from 'react';
//import Icon from 'react-native-vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ref, get, child } from 'firebase/database';
import { database } from '../src/config/firebaseconfig';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    Button,
    Card,
    Menu,
    Provider as PaperProvider,
    TextInput,
} from 'react-native-paper';
import { Router } from 'lucide-react-native';

export default function Agendamento() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { localizacao, avaliacao, residencial, comercial, fretes, montagem } = useLocalSearchParams();
    const [resultados, setResultados] = useState([]);
    const [mudanceiros, setMudanceiros] = useState<string[]>([]);

    const buscarMudanceiros = async () => {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'mudanceiro'));

        if (snapshot.exists()) {
            const data = snapshot.val();
            const mudanceirosArray = Object.values(data) as any[];
            console.log(mudanceirosArray);
            setResultados(mudanceirosArray); // salva os dados completos
            setMudanceiros(mudanceirosArray.map((m) => m.nome)); // exibe só os nomes no menu

        } else {
            console.warn('Nenhum mudanceiro encontrado.');
            setResultados([]);
            setMudanceiros([]);
        }
    } catch (error) {
        console.error('Erro ao buscar mudanceiros:', error);
        setResultados([]);
        setMudanceiros([]);
    }
    };

    useEffect(() =>{
        buscarMudanceiros();
    }, []);

    
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
                <Text style={styles.title}>Feitiços moving</Text>

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
                            <Text style={styles.pickerLabel}>Escolha um mudanceiro</Text>
                            
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
                            <TouchableOpacity style={styles.botao_filter} onPress={() => router.push('/filter')}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>⚙️</Text>
                            </TouchableOpacity>

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
    botao_filter: {
    backgroundColor: '#1c81e7',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
});
