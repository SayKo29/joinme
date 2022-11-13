import React, { useState, useEffect, useCallback } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useAuth } from '../contexts/Auth'
import { io } from 'socket.io-client'

const Chat = ({ route }) => {
  // create chat room
  const URL = 'http://192.168.1.199:8000'
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
    socket.emit('joinRoom', { chatroomId: '63711dd3eab3770233bc4990' })
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
    socket.emit('sendMessage', {
      chatroomId: '63711dd3eab3770233bc4990',
      message: messages[0].text
    })

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={useCallback((messages) => onSend(messages), [])}
      user={{
        _id: auth.authData.user._id
      }}
    />
  )
}

export default Chat
