import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DailyGoals() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Hydration",
      description: "Drink 2 liters of water a day",
      completed: false,
      date: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
    },
    // Add more goals here
  ]);

  // Load saved goals
  useEffect(() => {
    const loadGoals = async () => {
      const savedGoals = await AsyncStorage.getItem("dailyGoals");
      if (savedGoals) setGoals(JSON.parse(savedGoals));
    };
    loadGoals();
  }, []);

  // Toggle completion
  const toggleComplete = async (id) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );

    setGoals(updatedGoals);
    await AsyncStorage.setItem("dailyGoals", JSON.stringify(updatedGoals));

    if (updatedGoals.find((g) => g.id === id)?.completed) {
      const completedGoal = updatedGoals.find((g) => g.id === id);
      const completedList = JSON.parse(
        (await AsyncStorage.getItem("completedGoals")) || "[]"
      );

      const newCompletedGoal = {
        ...completedGoal,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };

      await AsyncStorage.setItem(
        "completedGoals",
        JSON.stringify([newCompletedGoal, ...completedList])
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Daily Goals</Text>
        <Text style={styles.counter}>
          {goals.filter((g) => g.completed).length}/{goals.length}
        </Text>
      </View>

      {goals.map((goal) => (
        <View
          key={goal.id}
          style={[styles.goalContainer, goal.completed && styles.completed]}
        >
          <TouchableOpacity
            onPress={() => toggleComplete(goal.id)}
            style={styles.checkbox}
          >
            <Ionicons
              name={goal.completed ? "checkbox" : "square-outline"}
              size={24}
              color={goal.completed ? "#4CAF50" : "#757575"}
            />
          </TouchableOpacity>

          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <Text style={styles.goalDate}>{goal.date}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  counter: {
    fontSize: 18,
    color: "#666",
  },
  goalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completed: {
    opacity: 0.7,
    backgroundColor: "#F0FFF0",
  },
  checkbox: {
    marginRight: 15,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  goalDate: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
});
