import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';


export default function index(){
    const router = useRouter();
    return(
        <View>
            <Button title='cadastro' onPress={() => router.push('/cadastro')}/>
            <Button title='filter' onPress={() => router.push('/filter')}/>
            <Button title='login' onPress={() => router.push('/login')}/>
            <Button title='cadastro-servico' onPress={() => router.push('/cadastro-servico')}/>
            <Button title='agendamento' onPress={() => router.push('/agendamento')}/>
            <Button title='avaliar' onPress={() => router.push('/avaliacao')}/>
            <Button title='dashboard' onPress={() => router.push('/dashboard')}/>
            <Button title='dashboardMudanceiro' onPress={() => router.push('/dashboardMudanceiro')}/>
            <Button title='mudanceiros' onPress={() => router.push('/mudanceiros')}/>
        </View>
    );
    
}
