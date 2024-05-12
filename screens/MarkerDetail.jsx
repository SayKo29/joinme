import { View, Text } from 'react-native'
import React from 'react'

export default function MarkerDetail (data) {
  return (
    <View>
      <Text>{data.markerData.title}</Text>
    </View>
  )
}
