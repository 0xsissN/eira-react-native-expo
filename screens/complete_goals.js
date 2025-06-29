import { ScrollView, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CompleteGoals() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Monitoring",
      level: "Level 1",
      completed: true,
      date: "Mar 24, 2025",
    },
    {
      id: 2,
      title: "Exercise Smile",
      level: "Level 1",
      completed: true,
      date: "Mar 23, 2025",
    },
    {
      id: 3,
      title: "Nursing",
      level: "Level 4",
      completed: true,
      date: "Mar 20, 2025",
    },
    {
      id: 4,
      title: "Hydration",
      description: "Drink 2 liters of water a day",
      completed: true,
      date: "Mar 24, 2015",
    },
  ]);

  // Load completed goals from AsyncStorage
  useEffect(() => {
    const loadCompletedGoals = async () => {
      const storedGoals = await AsyncStorage.getItem("completedGoals");
      if (storedGoals) setGoals(JSON.parse(storedGoals));
    };
    loadCompletedGoals();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Achievements</Text>

      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalCard}>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.badgeText}>Completed</Text>
          </View>

          <Text style={styles.goalTitle}>{goal.title}</Text>

          {goal.level ? (
            <Text style={styles.goalLevel}>{goal.level}</Text>
          ) : (
            <Text style={styles.goalDesc}>{goal.description}</Text>
          )}

          <Text style={styles.goalDate}>{goal.date}</Text>

          <View style={styles.separator} />
        </View>
      ))}

      <Text style={[styles.header, { marginTop: 30 }]}>All</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    marginLeft: 8,
  },
  goalCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  goalLevel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
  },
  goalDesc: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontStyle: "italic",
  },
  goalDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#EEE",
    marginTop: 12,
  },
});
