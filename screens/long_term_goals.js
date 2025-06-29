import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, database } from "../config/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

export default function LongTermGoals() {
  const [goals, setGoals] = useState([]);

  const loadGoalsByProblem = async (problem) => {
    switch (problem) {
      case "ira":
        return require("../assets/goals/longterm/anger.json");
      case "ansiedad":
        return require("../assets/goals/longterm/anxiety.json");
      case "tristeza":
        return require("../assets/goals/longterm/sadness.json");
      default:
        return [];
    }
  };

  useEffect(() => {
    const fetchGoalsAndProgress = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userRef = doc(database, "users", uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          console.warn("No se encontró el perfil del usuario.");
          return;
        }

        const problem = docSnap.data().problem;
        const baseGoals = await loadGoalsByProblem(problem);

        const progressCol = collection(
          database,
          "userLongTermProgress",
          uid,
          "progress"
        );
        const progressSnap = await getDocs(progressCol);

        const progressMap = {};
        progressSnap.forEach((doc) => {
          progressMap[doc.id] = doc.data().completedLevels || [];
        });

        const goalsWithProgress = baseGoals.map((goal) => {
          const completedLevels = progressMap[goal.id] || [];
          const totalLevels = goal.levels.length;
          const progressPercent = Math.round(
            (completedLevels.length / totalLevels) * 100
          );

          return {
            ...goal,
            completedLevels,
            progress: `${progressPercent}%`,
          };
        });

        setGoals(goalsWithProgress);
      } catch (error) {
        console.error("Error cargando metas con progreso:", error);
      }
    };

    fetchGoalsAndProgress();
  }, []);

  const toggleLevel = async (goalId, levelIndex) => {
    try {
      const updatedGoals = goals.map((goal) => {
        if (goal.id !== goalId) return goal;

        let newCompletedLevels = [...goal.completedLevels];
        const levelExists = newCompletedLevels.includes(levelIndex);

        if (levelExists) {
          newCompletedLevels = newCompletedLevels.filter(
            (i) => i !== levelIndex
          );
        } else {
          newCompletedLevels.push(levelIndex);
        }

        const progressPercent = Math.round(
          (newCompletedLevels.length / goal.levels.length) * 100
        );

        return {
          ...goal,
          completedLevels: newCompletedLevels,
          progress: `${progressPercent}%`,
        };
      });

      setGoals(updatedGoals);

      const uid = auth.currentUser.uid;
      const goalProgress = updatedGoals.find((g) => g.id === goalId);
      await setDoc(
        doc(database, "userLongTermProgress", uid, "progress", `${goalId}`),
        {
          completedLevels: goalProgress.completedLevels,
        }
      );
    } catch (error) {
      console.error("Error guardando progreso:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Objetivos a Largo plazo</Text>

      {goals.map((goal) => (
        <View key={goal.id} style={styles.goalContainer}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: goal.progress }]} />
            <Text style={styles.progressText}>{goal.progress}</Text>
          </View>

          <Text style={styles.mainTitle}>{goal.title}</Text>

          {goal.levels.map((level, index) => {
            const completed = goal.completedLevels.includes(index);
            return (
              <TouchableOpacity
                key={index}
                style={styles.levelItem}
                onPress={() => toggleLevel(goal.id, index)}
              >
                <Ionicons
                  name={completed ? "checkbox" : "square-outline"}
                  size={20}
                  color={completed ? "#8B5CF6" : "#6B7280"}
                />
                <Text
                  style={[styles.levelText, completed && styles.levelCompleted]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
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
  levelCompleted: {
    color: "#8B5CF6",
    textDecorationLine: "line-through",
  },
});
