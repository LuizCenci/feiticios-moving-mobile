import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseconfig';

const Login = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    const handleLogin = async () => {
        if (!email || !senha) {
            setErro('Preencha todos os campos.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            setErro('');
            router.replace('/dashboard'); // vai para tela de dashboard
        } catch (error: any) {
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email-password') {
                setErro('E-mail ou senha incorretos.');
        
            } else {
                setErro('Erro ao fazer login. Tente novamente mais tarde.');
                console.log(error.code);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/cauldron.png')} style={styles.logo} />
            <Text style={styles.title}>Entrar</Text>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/cadastro')}>
                <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#6C47A3',
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 12,
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
    },
    link: {
        marginTop: 15,
        color: '#6C47A3',
        fontWeight: 'bold',
    },
    erro: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});
