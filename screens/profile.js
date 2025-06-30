import { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
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
      Alert.alert("Please fill all fields");
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
      Alert.alert("Error saving profile", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nombre</Text>
      <TextInput
        placeholder="Ingresar nombre"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <Text>Edad</Text>
      <TextInput
        placeholder="Ingresar edad"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <Text>Especificar problema</Text>
      <TextInput
        placeholder="E.g. ira, ansiedad, tristeza"
        value={problem}
        onChangeText={setProblem}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TouchableOpacity
        onPress={handleSaveProfile}
        style={{
          backgroundColor: "#8B5CF6",
          padding: 15,
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Guardar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}
