import { Image, TextInput, Touchable, TouchableOpacity, View } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView, Text } from "react-native-web";

const backImage = require("../assets/backImage.png")

export default function Login({ navigation }){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        if(email !== '' && password !== ''){
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    console.log("Login exitoso")
                })
                .catch((e) => Alert.alert("Login error", e.message))
        }
    }
    
    return (
        <View>
            <Image source={backImage} style={{width: '100%', height: 340}}/>
            <View/>
            <SafeAreaView>
                <Text>Login</Text>
                <TextInput placeholder="enter email" value={email} onChangeText={(text) => setEmail(text)}/>
                <TextInput placeholder="enter password" value={password} onChangeText={(text) => setPassword(text)}/>
                <TouchableOpacity onPress={handleLogin}>
                    <Text>Log in</Text>
                </TouchableOpacity>
                <View>
                    <Text>Dont have account</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>        
        </View>
    )
}
