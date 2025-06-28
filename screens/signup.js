import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, Text } from "react-native-web";
const backImage = require("../assets/backImage.png");
import { auth } from "../config/firebase";

export default function SignUp({ navigation }){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = () => {
        if(email !== '' && password !== ''){
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => console.log("sign up exitoso"))
                .catch((e) => Alert.alert("Login error", e.message))
        }
    }
    
    return (
        <View>
            <Image source={backImage} style={{width: '100%', height: 340}}/>
            <View/>
            <SafeAreaView>
                <Text>Sign up</Text>
                <TextInput placeholder="enter email" value={email} onChangeText={(text) => setEmail(text)}/>
                <TextInput placeholder="enter password" value={password} onChangeText={(text) => setPassword(text)}/>
                <TouchableOpacity onPress={handleRegister}>
                    <Text>Sign up</Text>
                </TouchableOpacity>
                <View>
                    <Text>Dont have account</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text>Log in</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>        
        </View>
    )
}