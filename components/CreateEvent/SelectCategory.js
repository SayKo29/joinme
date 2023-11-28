import { View, Text, StyleSheet } from "react-native";
import React from "react";
import getCategories from "@/api/CategoryData";
import { useQuery } from "react-query";
import CategoryCard from "./CategoryCard";
import colors from "@/styles/colors";
import LottieAnimation from "components/LottieAnimation";

const SelectCategory = ({ navigation, categorySelected, activeCategory }) => {
    const categories = useQuery("CATEGORIES", getCategories);

    if (categories.isLoading) {
        return <LottieAnimation />;
    }

    const handleCategoryPressed = (category) => {
        categorySelected(category);
    };
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Selecciona la categoría del evento
                </Text>
            </View>
            {categories.data.map((category) => (
                <CategoryCard
                    key={category._id}
                    category={category}
                    categorySelected={handleCategoryPressed}
                    activeCategory={activeCategory}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    titleContainer: {
        alignItems: "center",
        paddingVertical: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
    },
});

export default SelectCategory;
