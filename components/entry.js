import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { database } from "../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Entry({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sentimiento: "bien",
    sueno: "bien",
    clima: "lluvia",
    actividades: [],
    notas: "",
  });

  const sentimientos = [
    { id: "muy-bien", label: "Muy bien", color: "#10B981", emoji: "😄" },
    { id: "bien", label: "Bien", color: "#A7F3D0", emoji: "😊" },
    { id: "okay", label: "Okay", color: "#93C5FD", emoji: "😐" },
    { id: "mal", label: "Mal", color: "#FECACA", emoji: "😢" },
    { id: "muy-mal", label: "Muy mal", color: "#EF4444", emoji: "😠" },
  ];

  const opcionesSueno = [
    { id: "mal", label: "MAL", color: "#FECACA" },
    { id: "okay", label: "OKAY", color: "#93C5FD" },
    { id: "bien", label: "BIEN", color: "#A7F3D0" },
  ];

  const opcionesClima = [
    { id: "soleado", label: "Soleado", icon: "sunny" },
    { id: "nublado", label: "Nublado", icon: "cloud" },
    { id: "lluvioso", label: "Lluvioso", icon: "rainy" },
    { id: "lluvia", label: "Lluvia", icon: "rainy" },
    { id: "tormenta", label: "Tormenta", icon: "thunderstorm" },
    { id: "nieve", label: "Nieve", icon: "snow" },
  ];

  const categorias = {
    "Trabajo y rutina": [
      { id: "teletrabajo", label: "Teletrabajo", icon: "home" },
      { id: "oficina", label: "Oficina", icon: "business" },
      { id: "uni", label: "Uni", icon: "school" },
      { id: "insti", label: "Insti", icon: "library" },
    ],
    Salud: [
      { id: "dentista", label: "Dentista", icon: "medical" },
      { id: "regla", label: "Regla", icon: "flower" },
      { id: "medico", label: "Médico", icon: "medical" },
      { id: "medicinas", label: "Medicinas", icon: "medical" },
      { id: "sexo", label: "Sexo", icon: "heart" },
      { id: "terapia", label: "Terapia", icon: "chatbubbles" },
    ],
    Ocio: [
      { id: "ejercicio", label: "Ejercicio", icon: "fitness" },
      { id: "leer", label: "Leer", icon: "book" },
      { id: "alcohol", label: "Alcohol", icon: "wine" },
      { id: "gaming", label: "Gaming", icon: "game-controller" },
      { id: "pintar", label: "Pintar", icon: "brush" },
      { id: "amigues", label: "Amigues", icon: "people" },
      { id: "discusion", label: "Discusión", icon: "chatbubbles" },
      { id: "cita", label: "Cita", icon: "heart" },
    ],
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          await addDoc(collection(database, "entradas"), {
            ...formData,
            timestamp: Timestamp.now(),
            userId: user.uid,
          });
        } else {
          console.warn("Usuario no autenticado");
        }

        onClose();
      } catch (error) {
        console.error("Error al guardar la entrada:", error);
      }
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const SentimientoCard = ({ sentimiento }) => (
    <TouchableOpacity
      style={[
        styles.sentimientoCard,
        { backgroundColor: sentimiento.color },
        formData.sentimiento === sentimiento.id && styles.selectedCard,
      ]}
      onPress={() => setFormData({ ...formData, sentimiento: sentimiento.id })}
    >
      <Text style={styles.sentimientoEmoji}>{sentimiento.emoji}</Text>
      <Text style={styles.sentimientoLabel}>{sentimiento.label}</Text>
    </TouchableOpacity>
  );

  const SuenoButton = ({ opcion }) => (
    <TouchableOpacity
      style={[
        styles.suenoButton,
        { backgroundColor: opcion.color },
        formData.sueno === opcion.id && styles.selectedButton,
      ]}
      onPress={() => setFormData({ ...formData, sueno: opcion.id })}
    >
      <Text style={styles.suenoLabel}>{opcion.label}</Text>
    </TouchableOpacity>
  );

  const ClimaButton = ({ opcion }) => (
    <TouchableOpacity
      style={[
        styles.climaButton,
        formData.clima === opcion.id && styles.selectedClimaButton,
      ]}
      onPress={() => setFormData({ ...formData, clima: opcion.id })}
    >
      <Ionicons name={opcion.icon} size={24} color="#6B7280" />
      <Text style={styles.climaLabel}>{opcion.label}</Text>
    </TouchableOpacity>
  );

  const ActividadButton = ({ actividad }) => {
    const isSelected = formData.actividades.includes(actividad.id);

    return (
      <TouchableOpacity
        style={[
          styles.actividadButton,
          isSelected && styles.selectedActividadButton,
        ]}
        onPress={() => {
          const newActividades = isSelected
            ? formData.actividades.filter((id) => id !== actividad.id)
            : [...formData.actividades, actividad.id];
          setFormData({ ...formData, actividades: newActividades });
        }}
      >
        <Ionicons name={actividad.icon} size={20} color="#8B5CF6" />
        <Text style={styles.actividadLabel}>{actividad.label}</Text>
      </TouchableOpacity>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView
            style={styles.stepContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.stepTitle}>¿Cómo te sientes?</Text>
            <View style={styles.sentimientosGrid}>
              {sentimientos.map((sentimiento) => (
                <SentimientoCard
                  key={sentimiento.id}
                  sentimiento={sentimiento}
                />
              ))}
            </View>
          </ScrollView>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>¿Cómo has dormido?</Text>
            <View style={styles.suenoContainer}>
              {opcionesSueno.map((opcion) => (
                <SuenoButton key={opcion.id} opcion={opcion} />
              ))}
            </View>

            <Text style={styles.stepSubtitle}>¿Qué tiempo hace?</Text>
            <View style={styles.climaGrid}>
              {opcionesClima.map((opcion) => (
                <ClimaButton key={opcion.id} opcion={opcion} />
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <ScrollView
            style={styles.stepContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.stepTitle}>¿Qué has estado haciendo?</Text>

            {Object.entries(categorias).map(([categoria, actividades]) => (
              <View key={categoria} style={styles.categoriaContainer}>
                <Text style={styles.categoriaTitle}>{categoria}</Text>
                <View style={styles.actividadesGrid}>
                  {actividades.map((actividad) => (
                    <ActividadButton key={actividad.id} actividad={actividad} />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>¿Quieres añadir algo?</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Añade todas las anotaciones que necesites..."
              multiline
              numberOfLines={6}
              value={formData.notas}
              onChangeText={(text) => setFormData({ ...formData, notas: text })}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva entrada</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>{renderStep()}</View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>
            {currentStep === 1 ? "Guardar" : "Atrás"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>
            {currentStep === 4 ? "Guardar" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 30,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
  },
  sentimientosGrid: {
    gap: 15,
  },
  sentimientoCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: "#8B5CF6",
  },
  sentimientoEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  sentimientoLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  suenoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  suenoButton: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  selectedButton: {
    borderWidth: 3,
    borderColor: "#8B5CF6",
  },
  suenoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  climaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 15,
  },
  climaButton: {
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedClimaButton: {
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  climaLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },
  categoriaContainer: {
    marginBottom: 30,
  },
  categoriaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 15,
  },
  actividadesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actividadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedActividadButton: {
    backgroundColor: "#EDE9FE",
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  actividadLabel: {
    fontSize: 14,
    color: "#1F2937",
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#1F2937",
    textAlignVertical: "top",
    minHeight: 120,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  secondaryButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  primaryButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#8B5CF6",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
