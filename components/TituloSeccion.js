import { StyleSheet, Text } from "react-native";

export default function TituloSeccion({ seccion }){
    return (
        <Text style={estilos.titulo}>{seccion}</Text>
    );
}

const estilos = StyleSheet.create({
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#5D3E9C'
    }
})