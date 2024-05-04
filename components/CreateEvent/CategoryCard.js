import { Text, StyleSheet, Pressable, Image, View } from 'react-native'
import React from 'react'
import colors from '@/styles/colors'

const CategoryCard = ({ category, onCategoryPress, activeCategory }) => {
    const isSelected = activeCategory?._id === category._id;
    return (
        <Pressable
            style={[
                styles.card,
                isSelected && { backgroundColor: colors.primary },
            ]}
            onPress={() => onCategoryPress(category)}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {category?.icon ?

                    <Image style={styles.image} source={category.icon} />
                    :
                    <Image style={styles.image} source={require('@/assets/img/image-placeholder.jpg')} />
                }
                <Text style={[styles.text, isSelected && { color: colors.black }]}>{category.name}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 20,
        marginVertical: 10,
        width: '100%',
        borderWidth: 2,
        borderColor: colors.primary
    },
    text: {
        color: colors.text,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'SignikaBold'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10
    }
})

export default CategoryCard
