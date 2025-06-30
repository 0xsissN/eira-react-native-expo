import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, database } from "../config/firebase";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(5); // Junio (0-based)
  const [selectedYear, setSelectedYear] = useState(2025);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [entradasData, setEntradasData] = useState({});

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const años = Array.from({ length: 10 }, (_, i) => 2020 + i);

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(database, "entradas"),
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const rawData = snapshot.docs.map((doc) => doc.data());

        const filtradas = rawData.filter((d) => {
          const fecha = d.timestamp.toDate();
          return (
            fecha.getMonth() === selectedMonth &&
            fecha.getFullYear() === selectedYear
          );
        });

        const formato = {};
        filtradas.forEach((d) => {
          const fecha = d.timestamp.toDate();
          const dia = fecha.getDate();
          formato[dia] = {
            estado: d.sentimiento,
            clima: d.clima,
            actividades: d.actividades || [],
            texto: d.notas,
          };
        });

        setEntradasData(formato);
      } catch (error) {
        console.error("Error al obtener entradas:", error);
      }
    };

    fetchEntradas();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  }, []);

  const getColorForEmocion = (emocion) => {
    switch (emocion) {
      case "muy-bien":
        return "#10B981";
      case "bien":
        return "#A7F3D0";
      case "okay":
        return "#93C5FD";
      case "mal":
        return "#FECACA";
      case "muy-mal":
        return "#EF4444";
      default:
        return "#F3F4F6";
    }
  };

  const getBackgroundColorForEmocion = (emocion) => {
    switch (emocion) {
      case "muy-bien":
        return "#ECFDF5";
      case "bien":
        return "#F0FDF4";
      case "okay":
        return "#EFF6FF";
      case "mal":
        return "#FEF2F2";
      case "muy-mal":
        return "#FEF2F2";
      default:
        return "#F8FAFC";
    }
  };

  const getClimaIcon = (clima) => {
    switch (clima) {
      case "cloud":
        return "cloud-outline";
      case "rainy":
        return "rainy-outline";
      case "cloudy":
        return "cloudy-outline";
      case "sunny":
        return "sunny-outline";
      default:
        return "sunny-outline";
    }
  };

  const getActividadIcon = (actividad) => {
    const iconMap = {
      oficina: "business-outline",
      leer: "book-outline",
      cafe: "cafe-outline",
      ejercicio: "fitness-outline",
      gaming: "game-controller-outline",
      discusion: "chatbubbles-outline",
      trabajo: "briefcase-outline",
      dentista: "medical-outline",
      medicinas: "medical-outline",
      amigos: "people-outline",
      cita: "heart-outline",
      celebracion: "happy-outline",
    };
    return iconMap[actividad] || "ellipse-outline";
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Ajustar para que lunes sea 0
  };

  const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  const today = currentDate.getDate();
  const isCurrentMonth =
    selectedMonth === currentDate.getMonth() &&
    selectedYear === currentDate.getFullYear();

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42;

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-start-${i}`} style={styles.diaContainer}>
          <Text style={styles.diaTexto}></Text>
        </View>
      );
    }

    for (let dia = 1; dia <= daysInMonth; dia++) {
      const entrada = entradasData[dia];
      const isSelected = selectedDate === dia;
      const isToday = dia === today && isCurrentMonth;
      const hasData = !!entrada;

      let backgroundColor = "transparent";
      let borderColor = "transparent";
      let borderWidth = 0;
      let textColor = "#1F2937";

      if (hasData) {
        const color = getColorForEmocion(entrada.estado);
        if (isSelected) {
          backgroundColor = color;
          textColor = "#FFFFFF";
        } else {
          backgroundColor = "transparent";
          borderColor = color;
          borderWidth = 2;
          textColor = "#1F2937";
        }
      } else if (isSelected) {
        backgroundColor = "#E5E7EB";
        textColor = "#1F2937";
      }

      if (isToday && !isSelected) {
        borderColor = "#8B5CF6";
        borderWidth = 2;
        textColor = "#8B5CF6";
      }

      days.push(
        <TouchableOpacity
          key={dia}
          style={[
            styles.diaContainer,
            {
              backgroundColor,
              borderColor,
              borderWidth,
            },
          ]}
          onPress={() => setSelectedDate(dia)}
        >
          <Text style={[styles.diaTexto, { color: textColor }]}>{dia}</Text>
        </TouchableOpacity>
      );
    }

    const remainingCells = totalCells - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <View key={`empty-end-${i}`} style={styles.diaContainer}>
          <Text style={styles.diaTexto}></Text>
        </View>
      );
    }

    return days;
  };

  const selectedEntry = selectedDate ? entradasData[selectedDate] : null;
  const containerBackgroundColor = selectedEntry
    ? getBackgroundColorForEmocion(selectedEntry.estado)
    : "#F8FAFC";

  const MonthPicker = () => (
    <Modal visible={showMonthPicker} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Seleccionar Mes</Text>
            <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={meses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.pickerItem,
                  selectedMonth === index && styles.selectedPickerItem,
                ]}
                onPress={() => {
                  setSelectedMonth(index);
                  setSelectedDate(null);
                  setShowMonthPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    selectedMonth === index && styles.selectedPickerItemText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const YearPicker = () => (
    <Modal visible={showYearPicker} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Seleccionar Año</Text>
            <TouchableOpacity onPress={() => setShowYearPicker(false)}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={años}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.pickerItem,
                  selectedYear === item && styles.selectedPickerItem,
                ]}
                onPress={() => {
                  setSelectedYear(item);
                  setSelectedDate(null);
                  setShowYearPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    selectedYear === item && styles.selectedPickerItemText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: containerBackgroundColor }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Seleccionar fecha</Text>
          <View style={styles.selectorRow}>
            <TouchableOpacity
              style={styles.mesSelector}
              onPress={() => setShowMonthPicker(true)}
            >
              <Text style={styles.mesTexto}>{meses[selectedMonth]}</Text>
              <View style={styles.chevronContainer}>
                <Ionicons name="chevron-up" size={12} color="#6B7280" />
                <Ionicons name="chevron-down" size={12} color="#6B7280" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.yearSelector}
              onPress={() => setShowYearPicker(true)}
            >
              <Text style={styles.yearTexto}>{selectedYear}</Text>
              <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.calendarioContainer}>
          <View style={styles.diasSemanaContainer}>
            {diasSemana.map((dia, index) => (
              <Text key={index} style={styles.diaSemanaTexto}>
                {dia}
              </Text>
            ))}
          </View>

          <View style={styles.diasMesContainer}>{renderCalendarDays()}</View>
        </View>

        {selectedEntry && (
          <>
            <View style={styles.actividadesContainer}>
              <View style={styles.actividadesRow}>
                <View style={styles.actividadItem}>
                  <Ionicons
                    name={getClimaIcon(selectedEntry.clima)}
                    size={20}
                    color="#6B7280"
                  />
                  <Text style={styles.actividadTexto}>
                    {selectedEntry.clima === "sunny"
                      ? "Soleado"
                      : selectedEntry.clima === "rainy"
                      ? "Lluvioso"
                      : selectedEntry.clima === "cloudy"
                      ? "Nublado"
                      : "Nublado"}
                  </Text>
                </View>
                {selectedEntry.actividades
                  .slice(0, 3)
                  .map((actividad, index) => (
                    <View key={index} style={styles.actividadItem}>
                      <Ionicons
                        name={getActividadIcon(actividad)}
                        size={20}
                        color="#6B7280"
                      />
                      <Text style={styles.actividadTexto}>
                        {actividad.charAt(0).toUpperCase() + actividad.slice(1)}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>

            <View style={styles.entradaTextoContainer}>
              <Text style={styles.entradaTexto}>{selectedEntry.texto}</Text>
            </View>
          </>
        )}

        {!selectedEntry && selectedDate && (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No hay entrada para este día</Text>
          </View>
        )}
      </View>

      <MonthPicker />
      <YearPicker />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 10,
  },
  selectorRow: {
    flexDirection: "row",
    gap: 15,
  },
  mesSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mesTexto: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  chevronContainer: {
    alignItems: "center",
  },
  yearSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  yearTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  calendarioContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  diasSemanaContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  diaSemanaTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    flex: 1,
  },
  diasMesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  diaContainer: {
    width: "14.28%", // 100% / 7 días = 14.28%
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 20,
  },
  diaTexto: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "80%",
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  pickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedPickerItem: {
    backgroundColor: "#EDE9FE",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#1F2937",
    textAlign: "center",
  },
  selectedPickerItemText: {
    color: "#8B5CF6",
    fontWeight: "600",
  },
  actividadesContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actividadesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actividadItem: {
    alignItems: "center",
    gap: 5,
  },
  actividadTexto: {
    fontSize: 12,
    color: "#6B7280",
  },
  entradaTextoContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  entradaTexto: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    gap: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  audioWave: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    flex: 1,
  },
  waveLine: {
    width: 3,
    backgroundColor: "#8B5CF6",
    borderRadius: 1.5,
  },
  audioTime: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 10,
  },
  noDataContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noDataText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});
