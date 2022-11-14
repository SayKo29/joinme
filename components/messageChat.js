import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useAuth } from '../contexts/Auth'
import { io } from 'socket.io-client'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import colors from '../styles/colors'

const Chat = ({ chatroomId, onBack }) => {
  // create chat room
  const URL = process.env.SOCKET_URL
  const [messages, setMessages] = useState([])
  const [user, setUser] = useState(null)
  const auth = useAuth()

  const socket = io(URL, {
    query: {
      userId: auth.authData.user.id
    }
  })
  //   join chat room
  useEffect(() => {
    console.log(chatroomId)
    socket.emit('joinRoom', { chatroomId })
    setUser(auth.authData.user)
    socket.on('allMessages', (message) => {
      const messagesFormated = message.map((message) => {
        return {
          _id: message._id,
          text: message.message,
          createdAt: message.createdAt,
          user: {
            _id: message.user._id
          }
        }
      })
      //   sort messages by date
      const sortedMessages = messagesFormated.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setMessages(sortedMessages)
      console.log(messages)
    })
    // receive message
    socket.on('newMessage', (message) => {
      console.log(message)
      const formatedMessage = message.map((message) => {
        return {
          _id: message._id,
          text: message.message,
          createdAt: message.createdAt,
          user: {
            _id: message.user._id
          }
        }
      })
      //   update messages
      setMessages((previousMessages) =>
        formatedMessage.concat(previousMessages)
      )
    })
  }, [setMessages])

  //   send message async
  const onSend = useCallback((messages = []) => {
    socket.emit('chatroomMessage', {
      chatroomId,
      msg: messages[0].text
    })
    // recieve message
    socket.on('newMessage', (message) => {
      console.log(message)
      const formatedMessage = message.map((message) => {
        return {
          _id: message._id,
          text: message.message,
          createdAt: message.createdAt,
          user: {
            _id: message.user._id
          }
        }
      })
      //   update messages
      setMessages((previousMessages) =>
        formatedMessage.concat(previousMessages)
      )
      setMessages(previousMessages => GiftedChat.append(previousMessages, formatedMessage))
      //   rerender messages
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {/* button to return back setting chatroomId to null */}
      <TouchableOpacity
        style={styles.button}
        onPress={onBack}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

      <GiftedChat
        messages={messages}
        onSend={useCallback((messages) => onSend(messages), [])}
        user={{
          _id: auth.authData.user._id
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  }
})

export default Chat
