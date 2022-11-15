import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/Auth'
import { FlatList, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import getEventsByParticipant from '../api/GetParticipantEvents'
import { useQuery } from 'react-query'
import LottieAnimation from '../components/LottieAnimation'
import Chat from '../components/messageChat'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import .env socketUrl variable

const ChatRooms = () => {
  // show chat rooms
//   const [chatRooms, setChatRooms] = useState([])
  const auth = useAuth()
  const { isLoading, isError, data } = useQuery('CHATROOMS', () => getEventsByParticipant(auth.authData.user.id))
  const [chatroomId, setChatroomId] = useState(null)
  const [events, setEvents] = useState([])
  //   get all events from async storage
  useEffect(() => {
    AsyncStorage.getItem('events').then((events) => {
    // format events by chatroom
      const eventsArray = JSON.parse(events)
      const eventsByChatroom = eventsArray.map((event) => {
        return {
          id: event._id,
          name: event.name,
          chatroomId: event.chatroom,
          startDate: event.startDate,
          endDate: event.endDate,
          participants: event.participants
        }
      })

      setEvents(eventsByChatroom)
    })
  }, [])

  const handleBack = () => {
    setChatroomId(null)
  }

  if (isLoading) {
    return <LottieAnimation />
  }
  if (isError) {
    return <Text>Error</Text>
  }

  if (data.length === 0) {
    return <Text>No chatrooms</Text>
  }

  if (data) {
    return (
      <SafeAreaView style={styles.container}>
        {/* show if not chatroom id */}
        {!chatroomId && (
        // flatlist of events
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return (
              // if chatroom end date is passed disable chatroom
                <TouchableOpacity
                  disabled={
                        new Date(item.endDate) < new Date()
                    } style={[
                      styles.card,
                      {
                        backgroundColor:
                            new Date(item.endDate) < new Date()
                              ? '#e0e0e0'
                              : '#fff'
                      }
                    ]} onPress={() => setChatroomId(item.chatroom)}
                >
                  {/* if chatroom has image show it at left */}
                  {item.image && (
                    <Image style={styles.image} source={{ uri: item.image ? item.image : require('../assets/img/logo.png') }} />
                  )}
                  {/* show default image for event if doesnt have */}
                  {!item.image && (
                    <Image style={styles.image} source={require('../assets/img/logo.png')} />
                  )}

                  <Text key={item.id} style={styles.chatroom}>{item.name}</Text>
                </TouchableOpacity>

              )
            }}
          />
        )}
        {chatroomId && (
          <Chat chatroomId={chatroomId} onBack={handleBack} event={events.find((event) => event.chatroomId === chatroomId)} />
        )}

        {/* {chatroomId && <Chat onBack={handleBack} chatroomId={chatroomId}  />} */}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  chatrooms: {
    // padding for android
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10
  }
})

export default ChatRooms
