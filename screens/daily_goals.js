import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { database, auth } from "../config/firebase";

export default function DailyGoals() {
  const [goals, setGoals] = useState([]);

  const loadJsonByProblem = async (problem) => {
    switch (problem) {
      case "ira":
        return require("../assets/goals/daily/anger.json");
      case "ansiedad":
        return require("../assets/goals/daily/anxiety.json");
      case "tristeza":
        return require("../assets/goals/daily/sadness.json");
      default:
        return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userRef = doc(database, "users", uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          console.warn("No se encontró el perfil del usuario.");
          return;
        }

        const userData = docSnap.data();
        const problem = userData.problem;
        const today = new Date().toISOString().split("T")[0];

        if (userData.dailyGoals && userData.dailyGoals[today]) {
          setGoals(userData.dailyGoals[today]);
        } else {
          const loadedGoals = await loadJsonByProblem(problem);
          const formattedGoals = loadedGoals.map((goal) => ({
            ...goal,
            completed: false,
            date: new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            }),
          }));

          setGoals(formattedGoals);

          await updateDoc(userRef, {
            [`dailyGoals.${today}`]: formattedGoals,
          });
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      }
    };

    fetchData();
  }, []);

  const toggleComplete = async (id) => {
    try {
      const updatedGoals = goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      );
      setGoals(updatedGoals);

      const uid = auth.currentUser.uid;
      const userRef = doc(database, "users", uid);
      const today = new Date().toISOString().split("T")[0];

      await updateDoc(userRef, {
        [`dailyGoals.${today}`]: updatedGoals,
      });
    } catch (error) {
      console.error("Error al guardar el estado del goal:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Objetivos Diarios</Text>
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
