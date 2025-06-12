import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile  } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Lock, Mail, Truck } from 'lucide-react-native';
import React, { useState } from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet,} from 'react-native';
import { auth, db } from '../src/config/firebaseconfig';

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'cliente' | 'mudanceiro' | null>(null);
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erro, setErro] = useState('');

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

  const handleCadastro = async () => {
    setErro('');
    if (!email || !senha || !tipoUsuario || !nome || !cpf || !dataNascimento) {
      setErro('Preencha todos os campos e selecione o tipo de usuário.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      await updateProfile(userCredential.user, { displayName: nome });

      await setDoc(doc(db, 'usuarios', user.uid), {
        email,
        tipoUsuario,
        nome,
        cpf,
        dataNascimento,
      });

      if (tipoUsuario === 'cliente') {
        router.replace('/dashboard');
      } else {
        router.replace('/dashboardMudanceiro');
      }
    } catch (error: any) {
      setErro(error.message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.innerContainer}>
        <Image
          source={require('../assets/images/cauldron.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Criar conta</Text>

        {/* Nome */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome completo:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Digite seu nome completo"
              value={nome}
              onChangeText={setNome}
              style={styles.textInput}
            />
          </View>
        </View>

        {/* Data de nascimento */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data de nascimento:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="DD/MM/AAAA"
              value={dataNascimento}
              onChangeText={formatDataNascimento}
              keyboardType="numeric"
              style={styles.textInput}
            />
          </View>
        </View>

        {/* CPF */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>CPF:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Digite seu CPF"
              value={cpf}
              onChangeText={formatCPF}
              keyboardType="numeric"
              style={styles.textInput}
            />
          </View>
        </View>

        {/* E-mail */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail:</Text>
          <View style={[styles.inputWrapper, styles.iconInputWrapper]}>
            <Mail color="#b765ff" size={24} />
            <TextInput
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              style={[styles.textInput, styles.inputWithIcon]}
            />
          </View>
        </View>

        {/* Senha */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha:</Text>
          <View style={[styles.inputWrapper, styles.iconInputWrapper]}>
            <Lock color="#b765ff" size={24} />
            <TextInput
              placeholder="Digite sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              style={[styles.textInput, styles.inputWithIcon]}
            />
          </View>
        </View>

        {/* Tipo de usuário */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de usuário:</Text>
          <View style={styles.userTypeWrapper}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                tipoUsuario === 'cliente' && styles.userTypeButtonSelected,
              ]}
              onPress={() => setTipoUsuario('cliente')}
            >
              <Text
                style={[
                  styles.userTypeButtonText,
                  tipoUsuario === 'cliente' && styles.userTypeButtonTextSelected,
                ]}
              >
                Sou Cliente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                tipoUsuario === 'mudanceiro' && styles.userTypeButtonSelected,
              ]}
              onPress={() => setTipoUsuario('mudanceiro')}
            >
              <Text
                style={[
                  styles.userTypeButtonText,
                  tipoUsuario === 'mudanceiro' && styles.userTypeButtonTextSelected,
                ]}
              >
                Sou Mudanceiro
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

        <TouchableOpacity
          onPress={handleCadastro}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Criar cadastro</Text>
        </TouchableOpacity>

        <Truck color="#b765ff" size={100} style={styles.truckIcon} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF7FF',
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  innerContainer: {
    width: '90%',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#dcdcdc',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
  },
  iconInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithIcon: {
    marginLeft: 10,
  },
  userTypeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userTypeButton: {
    backgroundColor: '#dcdcdc',
    padding: 10,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  userTypeButtonSelected: {
    backgroundColor: '#b765ff',
  },
  userTypeButtonText: {
    color: '#000',
  },
  userTypeButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#b765ff',
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  truckIcon: {
    marginTop: 30,
  },
});
