import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LongTermGoals() {
  const goals = [
    {
      id: 1,
      progress: "20%",
      title: "Multicode Lvl.1",
      levels: [
        "Enlaminerías Lvl.2",
        "Enlaminerías Lvl.3",
        "Enlaminerías Lvl.3",
      ],
    },
    // More goals can be added here
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Long-Term Goals</Text>

      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalContainer}>
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: goal.progress }]} />
            <Text style={styles.progressText}>{goal.progress}</Text>
          </View>

          {/* Main title */}
          <Text style={styles.mainTitle}>{goal.title}</Text>

          {/* Level list */}
          {goal.levels.map((level, index) => (
            <View key={index} style={styles.levelItem}>
              <Ionicons name="ellipse-outline" size={16} color="#8B5CF6" />
              <Text style={styles.levelText}>{level}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginLeft: 8,
  },
  goalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainer: {
    height: 24,
    backgroundColor: "#EDE9FE",
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
  },
  progressText: {
    position: "absolute",
    right: 12,
    color: "#6D28D9",
    fontWeight: "bold",
    fontSize: 14,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  levelItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  levelText: {
    fontSize: 16,
    color: "#4B5563",
    marginLeft: 8,
  },
});
