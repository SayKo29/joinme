import React from 'react'
import colors from '../styles/colors'
import { LinearGradient } from 'expo-linear-gradient'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar
} from 'react-native'
import { useAuth } from '../contexts/Auth'

const Profile = ({ navigation }) => {
  const auth = useAuth()
  const signOut = () => {
    auth.signOut()
  }
  if (auth.authData.user) {
    return (
    // if has state, show profile

      <SafeAreaView style={profile.container}>
        <LinearGradient
          colors={['#b7443f', '#513b68']}
          style={profile.background}
          locations={[0.45, 1]}
        />
        <View>
          {/* <SvgUri
                        className="w-full h-[20%]"
                        source={require("../assets/img/wave.svg")}
                    /> */}
          {/* <Text className="self-center text-4xl text-main">
                        {auth.authData.user.name}
                    </Text> */}
          {/* foto de perfil redondeada */}
          <Image
            style={profile.profileImage}
            source={
                            auth.authData.user.avatar
                              ? { uri: auth.authData.user.avatar }
                              : require('../assets/avatar.jpg')
                        }
          />
          <Text style={profile.name}>
            {auth.authData.user.name}
          </Text>
          <Text className='self-center text-xl text-main'>Pádel</Text>

          <TouchableOpacity
            style={profile.signoutButton}
            onPress={signOut}
          >
            <Text style={profile.signoutText}>
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
  return (
  // if no state, show signin
    <SafeAreaView className='h-full w-full'>
      <View className='w-full'>
        <TouchableOpacity
          className='self-end my-2 mx-2 bg-secondary rounded-lg px-6 py-2'
          onPress={signOut}
        >
          <Text className=' text-xl w-auto text-white '>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const profile = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // padding for android notch
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff'
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  signoutButton: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  signoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center'
  }

})

export default Profile
