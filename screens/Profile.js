import React from "react";
import colors from "../styles/colors";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
    StatusBar,
} from "react-native";
import { useAuth } from "../contexts/Auth";
import getCategories from "../api/CategoryData";
import { useQuery } from "react-query";
import Tag from "../components/tag";

const Profile = ({ navigation }) => {
    const auth = useAuth();
    const categories = useQuery("CATEGORIES", getCategories);
    let user = auth.authData.user;
    const signOut = () => {
        auth.signOut();
    };
    let allCategories = [];
    if (categories.data) {
        // format data for autocomplete
        categories.data.map((category) => {
            allCategories.push({
                id: category._id,
                name: category.name,
            });
        });
    }
    if (user) {
        return (
            // if has state, show profile

            <SafeAreaView style={profile.container}>
                <View style={profile.userBox}>
                    <Image
                        style={profile.profileImage}
                        source={
                            user.avatar
                                ? { uri: user.avatar }
                                : require("../assets/avatar.jpg")
                        }
                    />
                    <Text style={profile.name}>
                        {user.username ? user.username : "SayKo29"}
                    </Text>
                    <Text style={profile.fullName}>{user.name}</Text>
                    <Text style={profile.location}>
                        {user.location
                            ? user.location
                            : "Vilassar de Mar, Spain"}
                    </Text>
                </View>
                <View style={profile.interests}>
                    <Text style={profile.title}>Intereses</Text>
                    <View style={profile.tagsContainer}>
                        {allCategories.map((category) => {
                            return (
                                <Tag name={category.name} key={category.id} />
                            );
                        })}
                    </View>
                </View>

                <TouchableOpacity
                    style={profile.signoutButton}
                    onPress={signOut}
                >
                    <Text style={profile.signoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
    return (
        // if no state, show signin
        <SafeAreaView className="h-full w-full">
            <View className="w-full">
                <TouchableOpacity
                    className="self-end my-2 mx-2 bg-secondary rounded-lg px-6 py-2"
                    onPress={signOut}
                >
                    <Text className=" text-xl w-auto text-white ">
                        Iniciar Sesión
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const profile = StyleSheet.create({
    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
    },
    container: {
        flex: 1,
        alignItems: "flex-start",
        paddingHorizontal: 20,
        justifyContent: "flex-start",
        // padding for android notch
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    userBox: {
        width: "100%",
        justifyContent: "center",
        marginTop: 20,
        paddingBottom: 30,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    interests: {
        width: "100%",
        justifyContent: "center",
        marginTop: 20,
        paddingBottom: 30,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    tagsContainer: {
        flexDirection: "row",
        width: "100%",
        flexWrap: "wrap",
        paddingTop: 10,
        gap: 10,
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 100,
        overflow: "hidden",
        borderWidth: 3,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.white,
        paddingTop: 30,
    },
    fullName: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.gray,
        paddingTop: 5,
    },
    location: {
        fontSize: 12,
        fontWeight: "bold",
        color: colors.gray,
        paddingTop: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.white,
        textTransform: "uppercase",
        paddingTop: 5,
    },
    signoutButton: {
        backgroundColor: colors.primary,
        width: "100%",
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    signoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: "center",
    },
});

export default Profile;
