import { StyleSheet, Text, View } from "react-native";

export default function Tarjeta({titulo}){
    return (
        <View style={estilos.tarjeta}>
            <Text style={estilos.texto}>{titulo}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    tarjeta: {
        backgroundColor: '#DCCEF5',
        padding: 16,
        borderRadius: 12,
        marginVertical: 10,
    },
    texto: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#5D3E9C'
    }
})