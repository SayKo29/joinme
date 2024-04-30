import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native'
import React, { useMemo, useState } from 'react'
import CategoryCard from './CategoryCard'
import colors from '@/styles/colors'
import LottieAnimation from '@/components/LottieAnimation'
import formStyles from 'styles/formStyles'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { FlashList } from '@shopify/flash-list'
import { eventCategories } from 'Constants'

const SelectCategory = ({ categorySelected }) => {
    const [loading, setLoading] = useState(false)

    const [filteredCategories, setFilteredCategories] = useState([])

    const [activeCategory, setActiveCategory] = useState(null);

    React.useEffect(() => {
        if (eventCategories.length > 0) {
            setFilteredCategories(eventCategories);
            setLoading(false)
        }
    }, [eventCategories]);


    const handleCategoryPressed = (category) => {
        setActiveCategory(category);
        categorySelected(category._id)
    }
    const handleCategoryFiltering = (text) => {
        const filterValue = normalize(text).toLowerCase(); // Convert input value to lowercase for case-insensitive filtering and remove accents
        const filteredCategories = eventCategories.filter(category => normalize(category.name).toLowerCase().includes(filterValue));
        // Use the filteredCategories array for further processing or rendering
        setFilteredCategories(filteredCategories)
    }
    // Function to remove accents from text
    const normalize = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    // Use useMemo outside of the conditional block
    const memoizedCategories = useMemo(() => (
        <FlashList
            data={filteredCategories}
            estimatedItemSize={filteredCategories.length}
            renderItem={({ item, index }) => (
                <Animated.View entering={FadeInDown.delay(300 * index)}>
                    <CategoryCard
                        category={item}
                        onCategoryPress={handleCategoryPressed}
                        activeCategory={activeCategory}
                    />
                </Animated.View>
            )}
            keyExtractor={(item) => item._id}
        />
    ), [filteredCategories, activeCategory]);

    return (
        <View style={styles.container}>
            {loading || filteredCategories.length === 0 ? <>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieAnimation />
                </View>
            </>
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
                    {memoizedCategories}
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
