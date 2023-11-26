import { View, Text, StyleSheet } from "react-native";
import React from "react";

const SelectCategory = () => {
    return (
        <View style={styles.container}>
            <Text>Selecciona una categoría</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
});

export default SelectCategory;
