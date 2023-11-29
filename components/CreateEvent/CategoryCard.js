import { Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import colors from "styles/colors";

const CategoryCard = ({ category, categorySelected, activeCategory }) => {
    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor:
                        activeCategory === category._id
                            ? colors.accent
                            : colors.primary,
                },
            ]}
            onPress={() => categorySelected(category)}
        >
            <Text style={styles.text}>{category.name}</Text>
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
    text: {
        color: colors.text,
        fontSize: 16,
    },
});

export default CategoryCard;
