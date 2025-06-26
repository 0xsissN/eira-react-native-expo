import { Alert, StyleSheet, View } from 'react-native';
import BotonPersonalizado from './components/BotonPersonalizado';
import EmocionCara from './components/EmocionCara';
import { useState } from 'react';
import EntradaFormulario from './components/EntradaFormulario';
import Tarjeta from './components/Tarjeta';
import Progreso from './components/Progreso';
import BurbujaChat from './components/BurbujaChat';
import TituloSeccion from './components/TituloSeccion';

export default function App() {
  const [nombre, setNombre] = useState('')

  return (
    <View style={estilos.container}>
      <BotonPersonalizado
        titulo="Presioname"
        onPress={() => alert("Boton presionado")}
      />
      <EmocionCara
        imagen_src={require('./assets/feliz.jpg')}
        etiqueta="feliz"
      />
      <EntradaFormulario
        marcador="ingresa tu nombre"
        valor={nombre}
        cambioTexto={setNombre}
      />
      <Tarjeta
        titulo="Probando"
      />
      <Progreso
        etiqueta="Progreso de lectura"
        valor={30}
        maxValor={100}
      />
      <BurbujaChat
        texto="Probando"
        estado={true}
      />
      <TituloSeccion
        seccion="Prueba"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
