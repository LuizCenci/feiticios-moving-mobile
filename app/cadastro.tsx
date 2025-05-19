import { Lock, Mail, Truck } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Cadastro(){
    const router = useRouter();
    return(
        <ScrollView style={{flex: 1, backgroundColor: '#FEF7FF'}}  contentContainerStyle={{ alignItems: 'center', paddingVertical: 40 }}>
            <View style={{ width: '90%', alignItems: 'center' }}>
                <Image source={require('../assets/images/cauldron.jpeg')} style={{ width: 100, height: 100, marginBottom: 20 }} />
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 30 }}>Criar conta</Text>
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
                <TouchableOpacity style={{ backgroundColor: '#b765ff', paddingVertical: 15, borderRadius: 30, width: '100%' }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Criar cadastro</Text>
                </TouchableOpacity>
                <Truck color="#b765ff" size={100} style={{ marginTop: 30 }} />
            </View>
        </ScrollView>
    );
}
