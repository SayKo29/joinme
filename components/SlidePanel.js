import { View, StyleSheet } from 'react-native'
import React from 'react'
import GallerySwiper from 'react-native-gallery-swiper'

export default function SlidePanel (props) {
  return (
    <View style={styles.slider}>
      {/* /* Imagenes preview * */}
      <GallerySwiper
        style={styles.gallery}
        images={props.markerPressed.images.map((image) => ({
          source: {
            uri: image !== []
              ? image
              : require('../assets/avatar.jpg')
          }
        }))}
      />
    </View>
  )
}

// create our styling code:
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '50%'
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  slideContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slider: {
    width: '100%',
    height: '30%'
  },
  gallery: {
    width: '100%',
    height: '100%'
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    location: 'relative'
  },
  lottie: { width: '100%', height: '100%' }
})
