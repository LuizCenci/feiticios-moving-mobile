import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../src/config/firebaseconfig';


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
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const tipoUsuario = userData.tipoUsuario;

            if (tipoUsuario === 'cliente') {
                router.replace('/dashboard');
            } else if (tipoUsuario === 'mudanceiro') {
                router.replace('/dashboardMudanceiro');
            } else {
                setErro('Tipo de usuário inválido.');
            }
        } else {
            setErro('Usuário não encontrado no banco de dados.');
        }

        setErro('');
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
