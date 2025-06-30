import React, { useState, createContext, useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";

import Login from "./screens/login";
import SignUp from "./screens/signup";
import MainTabs from "./screens/main_tabs";
import CompleteProfile from "./screens/profile";
import { auth, database } from "./config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Welcome from "./screens/welcome";
import OnboardingCarousel from "./screens/onboarding-carousel";

export const AuthenticatedUserContext = createContext({
  user: null,
  setUser: () => {},
  profileComplete: null,
  setProfileComplete: () => {},
});

const Stack = createNativeStackNavigator();

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(null);

  return (
    <AuthenticatedUserContext.Provider
      value={{ user, setUser, profileComplete, setProfileComplete }}
    >
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="OnboardingCarousel" component={OnboardingCarousel} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser, profileComplete, setProfileComplete } = useContext(
    AuthenticatedUserContext
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      setUser(authenticatedUser);

      if (authenticatedUser) {
        try {
          const docRef = doc(database, "users", authenticatedUser.uid);
          const docSnap = await getDoc(docRef);

          if (
            docSnap.exists() &&
            docSnap.data().name &&
            docSnap.data().age &&
            docSnap.data().problem
          ) {
            setProfileComplete(true);
          } else {
            setProfileComplete(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfileComplete(false);
        }
      } else {
        setProfileComplete(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || (user && profileComplete === null)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user && <AuthStack />}
      {user && profileComplete === false && <ProfileStack />}
      {user && profileComplete === true && <AppStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
