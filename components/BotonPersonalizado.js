import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function BotonPersonalizado({titulo}){
    return (
        <TouchableOpacity style={estilos.boton}>
            <Text style={estilos.texto}>{titulo}</Text>
        </TouchableOpacity>
    );
}

const estilos = StyleSheet.create({
    boton: {
        backgroundColor: '#5D3E9C',
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginVertical: 10,
    },
    texto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})