import { View } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useState } from "react";

const backImage = require("../assets/backImage.png")

export default function Login({ navigation }){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        if(email !== '' && password != ''){
            signInWithEmailAndPassword(auth, email, password)
                .then(() => console.log("Login exitoso"))
                .catch((e) => alert("Login error", e.message))
        }
    }
    
    return (
        <View>
            
        </View>
    )
}
