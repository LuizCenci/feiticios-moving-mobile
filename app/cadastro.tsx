import { Lock, Mail, Truck } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { app, auth, database } from '../src/config/firebaseconfig'

export default function Cadastro() {
    const router = useRouter();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');

    const formatCPF = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 11);
        const formatted = cleaned
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        setCpf(formatted);
    };

    const formatDataNascimento = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 8);
        const formatted = cleaned
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d)/, '$1/$2');
        setDataNascimento(formatted);
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#FEF7FF' }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 40 }}>
            <View style={{ width: '90%', alignItems: 'center' }}>
                <Image source={require('../assets/images/cauldron.png')} style={{ width: 100, height: 100, marginBottom: 20 }} />
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 30 }}>Criar conta</Text>

                {/* Nome */}
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Nome completo:</Text>
                    <View style={{ backgroundColor: '#dcdcdc', borderRadius: 10, paddingHorizontal: 10 }}>
                        <TextInput placeholder="Digite seu nome completo" style={{ flex: 1, paddingVertical: 12 }} />
                    </View>
                </View>

                {/* Data de nascimento */}
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Data de nascimento:</Text>
                    <View style={{ backgroundColor: '#dcdcdc', borderRadius: 10, paddingHorizontal: 10 }}>
                        <TextInput
                            placeholder="DD/MM/AAAA"
                            value={dataNascimento}
                            onChangeText={formatDataNascimento}
                            keyboardType="numeric"
                            style={{ flex: 1, paddingVertical: 12 }}
                        />
                    </View>
                </View>

                {/* CPF */}
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>CPF:</Text>
                    <View style={{ backgroundColor: '#dcdcdc', borderRadius: 10, paddingHorizontal: 10 }}>
                        <TextInput
                            placeholder="Digite seu CPF"
                            value={cpf}
                            onChangeText={formatCPF}
                            keyboardType="numeric"
                            style={{ flex: 1, paddingVertical: 12 }}
                        />
                    </View>
                </View>

                {/* E-mail ou telefone */}
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>E-mail ou telefone:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcdcdc', borderRadius: 10, paddingHorizontal: 10 }}>
                        <Mail color="#b765ff" size={24} />
                        <TextInput placeholder="Digite seu e-mail ou telefone" style={{ flex: 1, paddingVertical: 12, marginLeft: 10 }} />
                    </View>
                </View>

                {/* Senha */}
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Senha:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcdcdc', borderRadius: 10, paddingHorizontal: 10 }}>
                        <Lock color="#b765ff" size={24} />
                        <TextInput placeholder="Digite sua senha" secureTextEntry style={{ flex: 1, paddingVertical: 12, marginLeft: 10 }} />
                    </View>
                </View>

                <TouchableOpacity style={{ backgroundColor: '#b765ff', paddingVertical: 15, borderRadius: 30, width: '100%' }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Criar cadastro</Text>
                </TouchableOpacity>

                <Truck color="#b765ff" size={100} style={{ marginTop: 30 }} />
            </View>
        </ScrollView>
    );
}