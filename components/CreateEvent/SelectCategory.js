import { View, Text, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import CategoryCard from './CategoryCard'
import colors from '@/styles/colors'
import LottieAnimation from '@/components/LottieAnimation'
import formStyles from 'styles/formStyles'
import useCategoryStore from 'store/CategoryStore'
import Animated, { FadeInDown } from 'react-native-reanimated'

const SelectCategory = ({ navigation, categorySelected, activeCategory }) => {
    const [loading, setLoading] = useState(false)
    const { categories, isInitialized, fetchCategories } = useCategoryStore()

    const [filteredCategories, setFilteredCategories] = useState([])

    React.useEffect(() => {
        // Llamar a fetchCategories solo si no está inicializado
        if (!isInitialized) {
            setLoading(true)
            fetchCategories()
        }
    }, [isInitialized])

    React.useEffect(() => {
        if (categories.length > 0) {
            setFilteredCategories(categories);
            setLoading(false)
        }
    }, [categories]);


    const handleCategoryPressed = (category) => {
        categorySelected(category._id)
    }
    const handleCategoryFiltering = (text) => {
        const filterValue = normalize(text).toLowerCase(); // Convert input value to lowercase for case-insensitive filtering and remove accents
        const filteredCategories = categories.filter(category => normalize(category.name).toLowerCase().includes(filterValue));
        // Use the filteredCategories array for further processing or rendering
        setFilteredCategories(filteredCategories)
    }
    // Function to remove accents from text
    const normalize = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    return (
        <View style={styles.container}>
            {loading ? <LottieAnimation />
                :
                <>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Selecciona la categoría del evento</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.title_search}>
                            Buscar categoría
                        </Text>
                        <TextInput placeholder='Senderismo...' placeholderTextColor={colors.gray} style={formStyles.input} onChangeText={(text) => handleCategoryFiltering(text)} />
                    </View>
                    {filteredCategories.map((category, index) => (
                        <Animated.View entering={FadeInDown.delay(50 * index)} key={index}>
                            <CategoryCard
                                key={category._id}
                                category={category}
                                categorySelected={handleCategoryPressed}
                                activeCategory={activeCategory}
                            />
                        </Animated.View>
                    ))}
                </>}
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
        color: colors.text,
        fontFamily: 'SignikaBold'
    },
    title_search: {
        fontSize: 14,
        fontWeight: 'normal',
        color: colors.text,
        fontFamily: 'SignikaRegular'
    }
})

export default SelectCategory
