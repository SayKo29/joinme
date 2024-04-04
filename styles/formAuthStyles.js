import { StyleSheet, Dimensions, StatusBar, Platform } from 'react-native'
import colors from './colors'

const formAuth = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: colors.background
    },
    SignUpScreen: {
        width: '100%',
        height: '100%',
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: Platform.OS === 'ios' ? -30 : 0
    },
    backgroundImageLogo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height + 30,
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 30
    },
    logoContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
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
        padding: 10,
        paddingTop: 50,
        justifyContent: 'flex-start'
    },
    input: {
        width: '100%',
        height: 40,
        marginTop: 20,
        padding: 10,
        backgroundColor: colors.inputBackground,
        color: '#FFF',
        borderRadius: 20
    },
    loginButton: {
        width: 50,
        height: 50,
        marginTop: 20,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: colors.inputBackground,
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
        backgroundColor: colors.accent,
        color: '#FFF',
        borderRadius: 40
    }
})

export { formAuth }
