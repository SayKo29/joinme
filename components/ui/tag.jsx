import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import colors from '@/styles/colors'

const Tag = ({ name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.tag}>{name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    backgroundColor: colors.primary,
    borderRadius: 3,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  tag: {
    color: colors.text,
    fontSize: 13,
    fontWeight: 'bold'
  }
})

export default Tag
