import { Lock, Mail, Truck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { useRouter } from 'expo-router';
import { app, auth, database } from '../src/config/firebaseconfig'
import { ref, onValue } from 'firebase/database';

const Login = () => {
    const [teste, setTeste] = useState('');
    const router = useRouter();


    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#FEF7FF' }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 40 }}>
            {/* Tela de Login */}
            <View style={{ width: '90%', marginBottom: 40, alignItems: 'center' }}>
                <Text>Teste: {teste}</Text>
                <Truck color="#b765ff" size={100} />
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginTop: 20, marginBottom: 30 }}>Faça Login para continuar</Text>
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>E-mail ou telefone:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcdcdc', borderRadius: 10, paddingHorizontal: 10 }}>
                        <Mail color="#b765ff" size={24} style={{ marginRight: 8 }}/>
                        <TextInput placeholder="Digite seu e-mail ou telefone" style={{ flex: 1, paddingVertical: 12 }} />
                    </View>
                </View>
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Senha:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcdcdc', borderRadius: 10, paddingHorizontal: 10 }}>
                        <Lock color="#b765ff" size={24} style={{ marginRight: 8 }}/>
                        <TextInput placeholder="Digite sua senha" secureTextEntry style={{ flex: 1, paddingVertical: 12 }} />
                    </View>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#b765ff', paddingVertical: 15, borderRadius: 30, width: '100%', marginBottom: 20 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/cadastro')} style={{ alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ color: '#000', marginBottom: 20 }}>Não tem cadastro?</Text>
                    <Text style={{ color: '#b765ff', fontWeight: 'bold' }}>Criar cadastro</Text>
                </TouchableOpacity>
                <Image
                    source={require('../assets/images/cauldron.png')}
                    style={{ width: 60, height: 60, marginBottom: 5, marginTop: 180 }}
                />
                <Text style={{ fontWeight: 'bold' }}>Feitiços moving</Text>
            </View>
        </ScrollView>
    );
};

export default Login;