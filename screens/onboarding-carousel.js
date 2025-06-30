import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const data = [
  {
    key: "1",
    title: "Metas",
    description:
      "Define y sigue tus propias metas de crecimiento personal. Ya sea un hábito diario o un reto físico.",
    image: require("../assets/meta.png"),
  },
  {
    key: "2",
    title: "Sentimentario",
    description:
      "Escribe en tu diario emocional, reflexiona sobre tu día y descubre patrones en tu bienestar.",
    image: require("../assets/senti.png"),
  },
  {
    key: "3",
    title: "Social",
    description:
      "Comparte recuerdos, agradecimientos y mensajes que refuercen la comunidad.",
    image: require("../assets/social.png"),
  },
];

export default function OnboardingCarousel({ navigation }) {
  const flatListRef = useRef(null);
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < data.length - 1) {
      const nextIndex = index + 1;
      flatListRef.current.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setIndex(nextIndex);
    } else {
      navigation.navigate("Login");
    }
  };

  const handleBack = () => {
    if (index > 0) {
      const prevIndex = index - 1;
      flatListRef.current.scrollToOffset({
        offset: prevIndex * width,
        animated: true,
      });
      setIndex(prevIndex);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {data.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleBack} disabled={index === 0}>
          <Text style={[styles.button, index === 0 && styles.disabled]}>
            Atrás
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.button}>
            {index === data.length - 1 ? "Empezar" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  slide: { width, alignItems: "center", justifyContent: "center", padding: 20 },
  image: { height: 300, width: "100%", marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#663399",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginTop: 10,
  },
  dots: { flexDirection: "row", justifyContent: "center", marginVertical: 20 },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: "#ccc",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: "#663399", width: 20 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  button: { color: "#663399", fontWeight: "bold", fontSize: 16 },
  disabled: { opacity: 0.3, fontWeight: "normal" },
});
