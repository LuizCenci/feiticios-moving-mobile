import { Lock, Mail, Truck } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';


const Login = () => {
    const router = useRouter();
    
    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#FEF7FF' }} contentContainerStyle={{ alignItems: 'center', paddingVertical: 40 }}>
            {/* Tela de Login */}
            <View style={{ width: '90%', marginBottom: 40, alignItems: 'center' }}>
                <Truck color="#b765ff" size={100} />
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginTop: 20, marginBottom: 30 }}>Faça Login para continuar</Text>
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>E-mail ou telefone:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcdcdc', borderRadius: 10, paddingHorizontal: 10 }}>
                        <Mail color="#b765ff" size={24} />
                        <TextInput placeholder="Digite seu e-mail ou telefone" style={{ flex: 1, paddingVertical: 12 }} />
                    </View>
                </View>
                <View style={{ width: '100%', marginBottom: 20 }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Senha:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcdcdc', borderRadius: 10, paddingHorizontal: 10 }}>
                        <Lock color="#b765ff" size={24} />
                        <TextInput placeholder="Digite sua senha" secureTextEntry style={{ flex: 1, paddingVertical: 12 }} />
                    </View>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#b765ff', paddingVertical: 15, borderRadius: 30, width: '100%', marginBottom: 20 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Entrar</Text>
                </TouchableOpacity>
                { <TouchableOpacity onPress={() => router.push('/cadastro')}>
                    <Text style={{ color: '#000', marginBottom: 20 }}>Não tem cadastro?</Text>
                    <Text style={{ color: '#b765ff', fontWeight: 'bold' }}>Criar cadastro</Text>
                </TouchableOpacity> }
                <Text style={{ fontWeight: 'bold', marginTop: 40 }}>Feitiços moving</Text>
            </View> 
        </ScrollView>
    );
};

export default Login;