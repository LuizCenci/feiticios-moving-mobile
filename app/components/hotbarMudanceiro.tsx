import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function HotbarMudanceiro(){
    const router = useRouter();
    return(
        <View style={styles.navbar}>
            {/* <TouchableOpacity style={styles.navItem} onPress={() => router.push('/agendamento')}>
            <Ionicons name="list" size={24} color="black" />
            <Text>Agendar</Text>
            </TouchableOpacity> */}

            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboardMudanceiro')}>
            <Ionicons name="home" size={24} color="black" />
            <Text>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/login')}>
            <Ionicons name="log-out-outline" size={24} color="black" />
            <Text>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

})