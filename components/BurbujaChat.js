import { StyleSheet, Text, View } from "react-native";

export default function BurbujaChat({ texto, estado }){
    return (
        <View style={[estilos.burbuja, estado ? estilos.remitente : estilos.receptor]}>
            <Text style={estilos.texto}>{texto}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    burbuja: {
        maxWidth: '80%',
        padding: 10,
        marginVertical: 5,
        borderRadius: 12
    },
    remitente: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCCEF5'
    },
    receptor: {
        alignSelf: 'flex-start',
        backgroundColor: '#F2ECF7'
    },
    texto: {
        fontSize: 14,
        color: '#333'
    }
})