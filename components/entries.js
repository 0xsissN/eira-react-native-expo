import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, database } from "../config/firebase";

export default function Entries() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false); 
          return;
        }

        const q = query(
          collection(database, "entradas"),
          where("userId", "==", user.uid) 
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          const fechaObj = d.timestamp.toDate();
          const dia = fechaObj.getDate();
          const mes = fechaObj.toLocaleDateString("es-ES", { month: "long" });

          const sentimientoMap = {
            "muy-bien": { emoji: "😄", color: "#A7F3D0" },
            bien: { emoji: "😊", color: "#D1FAE5" },
            okay: { emoji: "😐", color: "#FEF3C7" },
            mal: { emoji: "😢", color: "#FECACA" },
            "muy-mal": { emoji: "😠", color: "#FCA5A5" },
          };

          const { emoji, color } = sentimientoMap[d.sentimiento] || {
            emoji: "❓",
            color: "#E5E7EB",
          };

          return {
            id: doc.id,
            fecha: { dia, mes },
            clima: d.clima,
            emoji,
            color,
            texto: d.notas,
          };
        });

        setEntradas(data);
      } catch (error) {
        console.error("Error al obtener entradas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntradas();
  }, []);

  const getClimaIcon = (clima) => {
    switch (clima.toLowerCase()) {
      case "nublado":
        return "cloudy-outline";
      case "lluvioso":
        return "rainy-outline";
      case "soleado":
        return "sunny-outline";
      case "tormenta":
        return "thunderstorm-outline";
      default:
        return "partly-sunny-outline";
    }
  };

  const EntradaCard = ({ entrada }) => (
    <View style={[styles.entradaCard, { backgroundColor: entrada.color }]}>
      <View style={styles.entradaHeader}>
        <View style={styles.fechaContainer}>
          <Text style={styles.fechaNumero}>{entrada.fecha.dia}</Text>
          <Text style={styles.fechaTexto}>{entrada.fecha.mes}</Text>
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
        {!loading && entradas.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 40, fontSize: 16 }}>
            No tienes entradas aún. Agrega nuevas entradas para comenzar.
          </Text>
        ) : (
          entradas.map((entrada) => (
            <EntradaCard key={entrada.id} entrada={entrada} />
          ))
        )}
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
