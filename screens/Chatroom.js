import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/Auth'
import { io } from 'socket.io-client'
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
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
        <View style={styles.chatrooms}>
          {data.map((chatroom) => {
            return (
              <Button
                key={chatroom._id}
                title={chatroom.name}
                onPress={() => setChatroomId(chatroom.chatroom)}
              />
            )
          })}
        </View>
        {chatroomId && <Chat chatroomId={chatroomId} />}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default ChatRooms
