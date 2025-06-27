import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Chat from "./screens/chat";

const Stack = createNativeStackNavigator()

function ChatStack(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={Chat}/>
    </Stack.Navigator>
  )
}

function RootNavigator(){
  return(
    <NavigationContainer>
      <ChatStack/>
    </NavigationContainer>
  )
}

export default function App() {
  return <RootNavigator/>
}
