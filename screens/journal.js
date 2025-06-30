import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Calendar from "../components/calendar";
import Entries from "../components/entries";
import Entry from "../components/entry";

export default function Journal() {
  const [activeTab, setActiveTab] = useState("Entradas");
  const [showNewEntry, setShowNewEntry] = useState(false);

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

  if (showNewEntry) {
    return <Entry onClose={() => setShowNewEntry(false)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Entradas":
        return <Entries />;
      case "Calendario":
        return <Calendar />;
      default:
        return <Entries />;
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sentimentario</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowNewEntry(true)}
            >
              <Ionicons name="add" size={24} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TabButton
            title="Entradas"
            isSelected={activeTab === "Entradas"}
            onPress={() => setActiveTab("Entradas")}
          />
          <TabButton
            title="Calendario"
            isSelected={activeTab === "Calendario"}
            onPress={() => setActiveTab("Calendario")}
          />
        </View>

        <View style={styles.contentContainer}>{renderContent()}</View>
      </SafeAreaView>
    </>
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
    borderBottomColor: "#F3F4F6",
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
    borderBottomColor: "#F3F4F6",
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
  contentContainer: {
    flex: 1,
  },
});
