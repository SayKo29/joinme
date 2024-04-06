import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import CategoryCard from './CategoryCard'
import colors from '@/styles/colors'
import LottieAnimation from '@/components/LottieAnimation'
import useEventStore from '@/store/EventStore'
import formStyles from 'styles/formStyles'

const SelectCategory = ({ navigation, categorySelected, activeCategory }) => {
    const { categories, isInitialized, fetchCategories } = useEventStore()

    const [filteredCategories, setFilteredCategories] = useState([])

    React.useEffect(() => {
        // Llamar a fetchCategories solo si no está inicializado
        if (!isInitialized) {
            fetchCategories()
        }
    }, [isInitialized])

    React.useEffect(() => {
        if (categories.length > 0) {
            setFilteredCategories(categories);
        }
    }, [categories]);

    if (categories.isLoading) {
        return <LottieAnimation />
    }

    const handleCategoryPressed = (category) => {
        categorySelected(category._id)
    }
    const handleCategoryFiltering = (text) => {
        const filterValue = text.toLowerCase(); // Convert input value to lowercase for case-insensitive filtering
        const filteredCategories = categories.filter(category => category.name.toLowerCase().includes(filterValue));
        // Use the filteredCategories array for further processing or rendering
        setFilteredCategories(filteredCategories)
    }
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Selecciona la categoría del evento</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.title_search}>
                    Buscar categoría
                </Text>
                <TextInput placeholder='Senderismo...' placeholderTextColor={colors.gray} style={formStyles.input} onChangeText={(text) => handleCategoryFiltering(text)} />
            </View>
            {filteredCategories.map((category) => (
                <CategoryCard
                    key={category._id}
                    category={category}
                    categorySelected={handleCategoryPressed}
                    activeCategory={activeCategory}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    titleContainer: {
        alignItems: 'center',
        paddingVertical: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text
    },
    title_search: {
        fontSize: 14,
        fontWeight: 'normal',
        color: colors.text
    }
})

export default SelectCategory
