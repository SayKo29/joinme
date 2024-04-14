import { Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native'
import React from 'react'
import colors from '@/styles/colors'

const CategoryCard = ({ category, categorySelected, activeCategory }) => {
    return (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor:
                        activeCategory === category._id
                            ? colors.primary
                            : colors.background
                }
            ]}
            onPress={() => categorySelected(category)}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.image} source={{ uri: category?.icon ? category?.icon : 'https://fakeimg.pl/600x400/0cab59/ffffff?text=Sin+imagen' }} />
                <Text style={styles.text}>{category.name}</Text>
            </View>
        </TouchableOpacity>
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
        fontWeight: 'bold'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 10
    }
})

export default CategoryCard
