import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import {useRouter} from 'expo-router'

export default function index(){
    const router = useRouter();
    return(
        <View>
            <Button title='cadastro' onPress={() => router.push('/cadastro')}/>
            <Button title='filter' onPress={() => router.push('/filter')}/>
            <Button title='login' onPress={() => router.push('/login')}/>
            <Button title='cadastro-servico' onPress={() => router.push('/cadastro-servico')}/>
<<<<<<< HEAD
            <Button title='avaliacao' onPress={() => router.push('/avaliacao')}/>
=======
            <Button title='avaliar' onPress={() => router.push('/avaliacao')}/>
>>>>>>> 3b47a523a2374b1b8d5bfdb63ad6bbd3779a1f9b
        </View>
    );
    
}
