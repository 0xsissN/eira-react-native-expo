import { Image, StyleSheet, Text, View } from "react-native";

export default function EmocionCara({imagen_src, etiqueta}){
    return (
        <View style={estilos.contenedor}>
            <Image source={imagen_src} style={estilos.imagen}/>
            <Text style={estilos.etiqueta}>{etiqueta}</Text>
        </View>
    )
}

const estilos = StyleSheet.create({
    contenedor: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    imagen: {
        width: 60,
        height: 60,
        marginBottom: 5,
    },
    etiqueta: {
        fontSize: 14,
        color: '#333',
    }
})