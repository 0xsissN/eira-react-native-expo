import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DailyGoals from "./daily_goals";
import LongTermGoals from "./long_term_goals";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export default function Goals() {
  const [selectedTab, setSelectedTab] = useState("Daily");
  const [settingsVisible, setSettingsVisible] = useState(false);

  const onSignOut = () => {
    setSettingsVisible(false);
    signOut(auth).catch((e) => console.log("Error signing out", e.message));
  };

  const TabButton = ({ title, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isSelected && styles.tabButtonSelected]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabButtonText,
          isSelected && styles.tabButtonTextSelected,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Goals</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TabButton
          title="Diario"
          isSelected={selectedTab === "Daily"}
          onPress={() => setSelectedTab("Daily")}
        />
        <TabButton
          title="Largo plazo"
          isSelected={selectedTab === "Long-term"}
          onPress={() => setSelectedTab("Long-term")}
        />
      </View>

      <View style={styles.tabContent}>
        {selectedTab === "Daily" && <DailyGoals />}
        {selectedTab === "Long-term" && <LongTermGoals />}
      </View>

      {settingsVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity style={styles.modalButton} onPress={onSignOut}>
              <Text style={styles.modalButtonText}>Sign out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#E5E7EB" }]}
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={[styles.modalButtonText, { color: "#1F2937" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  tabButtonSelected: {
    backgroundColor: "#8B5CF6",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  tabButtonTextSelected: {
    color: "#FFFFFF",
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalContent: {
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1F2937",
  },
  modalButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
