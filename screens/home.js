import { TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function Home({ navigation }){
    return (
        <View>
            <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                <Entypo name="chat"/>
            </TouchableOpacity>
        </View>
    );
} 