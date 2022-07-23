import React, { useContext } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import tw from "twrnc";

const Profile = ({ navigation }) => {
    const { state, signout } = useContext(AuthContext);

    return (
        <SafeAreaView style={tw.style("h-full")}>
            <View style={tw.style("w-full")}>
                <Button
                    style={tw.style("self-end text-5xl text-slate-200")}
                    onPress={signout}
                    title="Cerrar sesión"
                    type="clear"
                />
                <Text style={tw.style("self-center text-4xl")}>
                    {state.firstName}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default Profile;
