import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Entries() {
  const entradas = [
    {
      id: 1,
      fecha: "10 de agosto",
      clima: "cloud",
      emoji: "😊",
      estado: "bien",
      color: "#A7F3D0",
      texto:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Se...",
    },
    {
      id: 2,
      fecha: "9 de agosto",
      clima: "rainy",
      emoji: "😐",
      estado: "okay",
      color: "#A7F3D0",
      texto:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Se...",
    },
    {
      id: 3,
      fecha: "8 de agosto",
      clima: "cloudy",
      emoji: "😊",
      estado: "bien",
      color: "#A7F3D0",
      texto:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Se...",
    },
    {
      id: 4,
      fecha: "7 de agosto",
      clima: "rainy",
      emoji: "😢",
      estado: "mal",
      color: "#FECACA",
      texto:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Se...",
    },
    {
      id: 5,
      fecha: "6 de agosto",
      clima: "rainy",
      emoji: "😠",
      estado: "muy-mal",
      color: "#FECACA",
      texto:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Se...",
    },
    {
      id: 6,
      fecha: "5 de agosto",
      clima: "cloudy",
      emoji: "😊",
      estado: "bien",
      color: "#A7F3D0",
      texto:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Se...",
    },
  ];
  
  const getClimaIcon = (clima) => {
    switch (clima) {
      case "cloud":
        return "cloud-outline";
      case "rainy":
        return "rainy-outline";
      case "cloudy":
        return "cloudy-outline";
      default:
        return "sunny-outline";
    }
  };

  const EntradaCard = ({ entrada }) => (
    <View style={[styles.entradaCard, { backgroundColor: entrada.color }]}>
      <View style={styles.entradaHeader}>
        <View style={styles.fechaContainer}>
          <Text style={styles.fechaNumero}>{entrada.fecha.split(" ")[0]}</Text>
          <Text style={styles.fechaTexto}>
            {entrada.fecha.split(" ").slice(1).join(" ")}
          </Text>
        </View>
        <View style={styles.iconosContainer}>
          <Ionicons
            name={getClimaIcon(entrada.clima)}
            size={24}
            color="#6B7280"
          />
          <Text style={styles.emoji}>{entrada.emoji}</Text>
        </View>
      </View>
      <Text style={styles.entradaTexto}>{entrada.texto}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {entradas.map((entrada) => (
          <EntradaCard key={entrada.id} entrada={entrada} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    gap: 15,
  },
  entradaCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  entradaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  fechaContainer: {
    flex: 1,
  },
  fechaNumero: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  fechaTexto: {
    fontSize: 14,
    color: "#6B7280",
  },
  iconosContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 15,
  },
  emoji: {
    fontSize: 24,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  entradaTexto: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
});
