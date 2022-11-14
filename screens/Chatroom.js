import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/Auth'
import { io } from 'socket.io-client'
import { Button, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import getEventsByParticipant from '../api/GetParticipantEvents'
import { useQuery } from 'react-query'
import LottieAnimation from '../components/LottieAnimation'
import Chat from '../components/messageChat'
// import .env socketUrl variable

const ChatRooms = () => {
  // show chat rooms
  const [chatRooms, setChatRooms] = useState([])
  const auth = useAuth()
  const { isLoading, isError, data } = useQuery('CHATROOMS', () => getEventsByParticipant(auth.authData.user.id))
  const [chatroomId, setChatroomId] = useState(null)

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
  console.log(chatroomId)

  if (data) {
    return (
      <SafeAreaView style={styles.container}>
        {/* show if not chatroom id */}
        {!chatroomId && (

          <View style={styles.chatrooms}>
            {data.map((chatroom, index) => {
              return (
                <TouchableOpacity style={styles.card} onPress={() => setChatroomId(chatroom.chatroom)} key={index}>
                  {/* if chatroom has image show it at left */}
                  {chatroom.image && (
                    <Image style={styles.image} source={{ uri: chatroom.image ? chatroom.image : require('../assets/img/logo.png') }} />
                  )}
                  {/* show default image for event if doesnt have */}
                  {!chatroom.image && (
                    <Image style={styles.image} source={require('../assets/img/logo.png')} />
                  )}

                  <Text key={chatroom.id} style={styles.chatroom}>{chatroom.name}</Text>
                </TouchableOpacity>

              )
            })}
          </View>
        )}
        {chatroomId && <Chat onBack={handleBack} chatroomId={chatroomId} />}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
