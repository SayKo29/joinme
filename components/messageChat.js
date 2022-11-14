import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/Auth'
import { io } from 'socket.io-client'
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import colors from '../styles/colors'

const Chat = ({ chatroomId, onBack }) => {
  // create chat room
  const URL = 'http://192.168.1.199:3000'
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState(false)
  const auth = useAuth()
  const flatListRef = React.useRef(null)

  const socket = io(URL, {
    query: {
      userId: auth.authData.user.id
    }
  })

  const finishChatRoom = () => {
    socket.emit('leaveRoom', { chatroomId })
    onBack()
  }
  //   join room only once

  useEffect(() => {
    socket.emit('joinRoom', { chatroomId })
    return () => {
      socket.emit('leaveRoom', { chatroomId })
    }
  }, [])

  //   get all earlier messages
  useEffect(() => {
    socket.on('allMessages', (data) => {
      setMessages(data)
    })
  }, [])

  //   receive new messages and add to the first of the array

  useEffect(() => {
    socket.on('newMessage', (data) => {
      setMessages((messages) => [data, ...messages])
    })
  }, [])

  const sendMessage = () => {
    socket.emit('chatroomMessage', { chatroomId, msg: newMessage })
    setNewMessage('')
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={finishChatRoom}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      {/* render messages like whatsapp */}
      {/* ios avoid input  */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 45 : 0}
      >
        {/* when new message animate scroll */}
        <FlatList
          data={messages}
          inverted
          ref={flatListRef}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <View style={styles.message}>
                {/* if user message is the same of user auth align right */}
                {item.user._id === auth.authData.user.id && (
                  <View style={styles.messageRight}>
                    {/* avatar img */}
                    {/* <Text style={styles.messageText}>{item.avatar}</Text> */}
                    <Text style={styles.messageText}>{item.message}</Text>
                  </View>
                )}
                {/* if user message is not the same of user auth align left */}
                {item.user._id !== auth.authData.user.id && (
                  <View style={styles.messageLeft}>
                    <Text style={styles.messageText}>{item.message}</Text>
                  </View>
                )}
              </View>
            )
          }}
        />

        {/* input to send message */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Type a message'
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            style={styles.button}
          // disabled if input is empty
            disabled={!newMessage}
            onPress={sendMessage}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    margin: 10
  },
  buttonText: {
    // at right
    height: 18,
    textAlign: 'right',
    color: colors.white
  },
  message: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    maxWidth: '100%'
  },
  messageText: {
    color: colors.white,
    textAlign: 'center'
  },
  inputContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10
  },
  input: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    width: '80%'
  },
  messageRight: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    borderTopRightRadius: 0,
    margin: 10,
    maxWidth: '80%',
    alignSelf: 'flex-end'
  },
  messageLeft: {
    backgroundColor: colors.persianGreen,
    padding: 10,
    borderRadius: 5,
    borderTopLeftRadius: 0,
    margin: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start'
  },
  keyboard: {
    flex: 1,
    width: '100%',
    height: '100%'
  }

})

export default Chat
