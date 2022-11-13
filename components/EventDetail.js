import { View, StyleSheet, Text } from 'react-native'
import Gallery from 'react-native-image-gallery'
import React from 'react'
import colors from '../styles/colors'
import getUsersData from '../api/UsersData'
import { useQuery } from 'react-query'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function EventDetail (props) {
  const users = useQuery('USERS', getUsersData)

  if (users.isLoading) {
    return <Text>Loading users...</Text>
  }
  if (users.isError) {
    return <Text>Error users...</Text>
  }
  if (users.data) {
    // console.log(users.data)

    const eventCreator = users.data[props.markerPressed?.user]
    // console.log(eventCreator)

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
        {/* if eventCreator has name */}
        {eventCreator && (
          <Text style={styles.description}>Evento creado por {eventCreator?.name}</Text>
        )}

        {/* button to join chat event */}
        <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Chat', { event: props.markerPressed })}>
          <Text style={styles.buttonText}>Unirse al chat del evento</Text>
        </TouchableOpacity>
      </View>
    )
  }
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
      {/* <Text style={styles.description}>Evento creado por {users.data[props.markerPressed.user]}</Text> */}
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
