import { StyleSheet, Text, View } from "react-native";

export default function Progreso({etiqueta, valor, maxValor}){
    const porcentaje = (valor / maxValor) * 100;

    return (
        <View style={estilos.contenedor}>
            <Text style={estilos.etiqueta}>{etiqueta}</Text>
            <View style={estilos.progreso_bar}>
                <View style={[estilos.progreso, { width: `${porcentaje}%` }]} />
            </View>
            <Text style={estilos.porciento}>{Math.round(porcentaje)}%</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        marginVertical: 10
    },
    etiqueta: {
        marginBottom: 5,
        fontWeight: 'bold',
        color: '#5D3E9C'
    },
    progreso_bar: {
        backgroundColor: '#eee',
        height: 10,
        borderRadius: 8,
        overflow: 'hidden'
    },
    progreso: {
        height: 10,
        backgroundColor: '#5D3E9C'
    },
    porciento: {
        fontSize: 12,
        color: '#666',
        marginTop: 4
    }
})  