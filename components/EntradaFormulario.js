import { StyleSheet, TextInput, View } from "react-native";

export default function EntradaFormulario({ marcador, valor, cambioTexto: cambioValor}){
    return(
        <View style={estilos.en_contenedor}>
            <TextInput
                style={estilos.entrada}
                placeholder={marcador}
                value={valor}            
                onChangeText={cambioValor}
                placeholderTextColor='#999'
            />
        </View>
    )
}

const estilos = StyleSheet.create({
    en_contenedor: {
        marginVertical: 10
    },
    entrada: {
        backgroundColor: '#F2ECF7',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        borderColor: '#ccc',
        borderWidth: 1
    }
})