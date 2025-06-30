import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withRepeat,
  Easing,
} from "react-native-reanimated";

import logoImage from "../assets/1-Pica.png";

export default function Welcome({ navigation }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 300 }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    opacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.ease }),
      1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Text style={styles.title}>Bienvenido a EIRA</Text>
      <Text style={styles.subtitle}>Tu espacio de bienestar emocional</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("OnboardingCarousel")}
      >
        <Text style={styles.buttonText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2ECF4",
    padding: 20,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 30,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D3436",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#713E82",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
