import { View, Text, StyleSheet } from "react-native";
import React from "react";
import colors from "../styles/colors";

const Tag = ({ name }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.tag}>{name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "fit-content",
        backgroundColor: colors.accent,
        borderRadius: 3,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    tag: {
        color: colors.white,
    },
});

export default Tag;
