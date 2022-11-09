import { StyleSheet, Dimensions, StatusBar, Platform } from 'react-native'

const colors = {
  primary: '#F27649',
  secondary: '#463B83',
  tertiary: '#FF5722',
  black: '#000',
  white: '#fff',
  gray: '#9DA3B4',
  gray2: '#C5CCD6',
  gray3: '#E1E8EE',
  gray4: '#F3F5F7',
  gray5: '#F7F9FC',
  gray6: '#F9FAFC'
}

const formAuth = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1
  },
  SignUpScreen: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -30
  },
  backgroundImageLogo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height + 30
  },
  logo: {
    width: 150,
    height: 150
  },
  logoContainer: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 100,
    alignItems: 'center'
  },

  googleButtonContainer: {
    backgroundColor: '#fff',
    marginTop: 30,
    width: 150,
    height: 50,
    borderRadius: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },

  googleLogo: {
    width: 30,
    height: 30
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  formContainer: {
    width: '100%',
    height: '100%',
    padding: 20,
    justifyContent: 'flex-start'
  },
  input: {
    width: '100%',
    height: 40,
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#FFF',
    borderRadius: 20
  },
  loginButton: {
    width: 50,
    height: 50,
    marginTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#FFF',
    borderRadius: 40
  },
  textContent: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20
  },
  textNormal: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15
  },
  text: {
    color: 'white',
    fontSize: 15
  },
  registerButton: {
    width: 150,
    height: 50,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    //
    backgroundColor: colors.primary,
    color: '#FFF',
    borderRadius: 40
  }

})

export { formAuth }
