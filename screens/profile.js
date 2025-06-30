import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, database } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { AuthenticatedUserContext } from "../App";

export default function CompleteProfile() {
  const { setProfileComplete } = useContext(AuthenticatedUserContext);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [problem, setProblem] = useState("");

  const handleSaveProfile = async () => {
    if (!name || !age || !problem) {
      Alert.alert("Por favor, completa todos los campos");
      return;
    }

    try {
      const uid = auth.currentUser.uid;
      await setDoc(doc(database, "users", uid), {
        name,
        age,
        problem,
      });
      setProfileComplete(true);
    } catch (error) {
      Alert.alert("Error al guardar perfil", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.card}>
        <Text style={styles.title}>Completar Perfil</Text>
        <Text style={styles.subtitle}>Queremos conocerte mejor</Text>

        <TextInput
          placeholder="Ingresar nombre"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <TextInput
          placeholder="Ingresar edad"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={problem}
            onValueChange={(itemValue) => setProblem(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un problema..." value="" />
            <Picker.Item label="Ira" value="ira" />
            <Picker.Item label="Ansiedad" value="ansiedad" />
            <Picker.Item label="Tristeza" value="tristeza" />
          </Picker>
        </View>

        <TouchableOpacity onPress={handleSaveProfile} style={styles.button}>
          <Text style={styles.buttonText}>Guardar Perfil</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2D3436",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  pickerWrapper: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    marginBottom: 24,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#713E82",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#6C5CE7",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
