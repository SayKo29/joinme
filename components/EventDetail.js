import { View, StyleSheet, Text } from 'react-native'
import Gallery from 'react-native-image-gallery'
import React from 'react'
import colors from '../styles/colors'

export default function EventDetail (props) {
  return (
    <View style={styles.cardContainer}>
      {/* /* show gallery images if have it* */}
      {props.markerPressed.images.length > 0 && (
        <View style={styles.galleryContainer}>
          <Gallery
            style={{ flex: 1, backgroundColor: 'black' }}
            images={[
              // map images to gallery
              ...props.markerPressed.images.map((image) => {
                return {
                  source: {
                    uri: image
                  }
                }
              })
            ]}
          />
        </View>
      )}

      <Text style={styles.title}>{props.markerPressed.name}</Text>
      <Text style={styles.description}>{props.markerPressed.description}</Text>
    </View>
  )
}

// create our styling code:
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.purple,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    height: '100%'
  },
  galleryContainer: {
    width: '100%',
    height: 200,
    marginBottom: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.white
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.white
  }

})
