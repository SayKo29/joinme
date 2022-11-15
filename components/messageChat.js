import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/Auth'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '@env'
import { Icon } from 'react-native-elements'
import { formatToTimeWithoutSeconds } from '../services/functions'
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
import LottieAnimation from './LottieAnimation'

const Chat = ({ chatroomId, onBack, event }) => {
  // create chat room
  const URL = SOCKET_URL
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const auth = useAuth()
  const flatListRef = React.useRef(null)
  const [loading, setLoading] = useState(false)

  const socket = io(URL, {
    query: {
      userId: auth.authData.user.id
    }
  })
  console.log(event)

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

  //   get all message and use loader to show them

  useEffect(() => {
    setLoading(true)
    socket.on('allMessages', (data) => {
      setMessages(data)
      setLoading(false)
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={finishChatRoom}>
          {/* <Text style={styles.backButtonText}>Back</Text> */}
          <Icon name='chevron-left' size={40} color={colors.white} />

        </TouchableOpacity>
        <Text style={styles.headerText}>{event?.name}</Text>
      </View>

      {/* render messages like whatsapp */}
      {/* ios avoid input  */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 45 : 0}
      >
        {/* show loader until messages are loaded */}
        {loading
          ? (
            <LottieAnimation />
            )
          : (
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
                        <Text style={styles.messageTextRight}>{item.message}</Text>
                        <View style={styles.timeContainerRight}>
                          <Text style={styles.messageTime}>
                            {formatToTimeWithoutSeconds(new Date(item.createdAt))}
                          </Text>
                        </View>
                      </View>
                    )}
                    {/* if user message is not the same of user auth align left */}
                    {item.user._id !== auth.authData.user.id && (
                      <View style={styles.messageLeft}>
                        <Text style={styles.userName}>{item.user.name}</Text>
                        <Text style={styles.messageTextLeft}>{item.message}</Text>
                        {/* time container */}
                        <View style={styles.timeContainerLeft}>
                          {/*  */}
                          <Text style={styles.timeText}>{formatToTimeWithoutSeconds(new Date(item.createdAt))}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )
              }}
            />
            )}

        {/* input to send message */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Escribe un mensaje'
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            style={styles.sendMessageButton}
          // disabled if input is empty
            disabled={!newMessage}
            onPress={sendMessage}
          >
            <Icon name='send' type='font-awesome' size={30} color={colors.white} />
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
    // paddingtop for android
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    width: '100%',
    height: 80,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold'
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 35
  },

  message: {
    borderRadius: 5,
    margin: 0,
    maxWidth: '100%'
  },
  messageTextRight: {
    color: colors.white,
    textAlign: 'justify'
  },
  inputContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    paddingRight: 20
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
  messageTextLeft: {
    color: colors.white,
    textAlign: 'left'
  },
  keyboard: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  userName: {
    color: colors.white,
    textAlign: 'left',
    fontWeight: 'bold'
  },
  timeContainerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 5
  },
  timeText: {
    color: colors.white,
    textAlign: 'right',
    fontSize: 10
  },
  sendMessageButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  sendMessageText: {
    color: colors.white,
    fontSize: 12
  },
  timeContainerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  messageTime: {
    color: colors.white,
    textAlign: 'left',
    fontSize: 10,
    paddingTop: 5
  }

})

export default Chat
