import { Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import colors from "styles/colors";

const CategoryCard = ({ category, categorySelected }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => categorySelected(category)}
        >
            <Text>{category.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        width: "100%",
    },
});

export default CategoryCard;
