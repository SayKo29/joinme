import React from 'react'
import colors from '@/styles/colors'
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
    StatusBar,
    TextInput
} from 'react-native'
import { useAuth } from '@/contexts/Auth'
import Tag from '@/components/ui/tag'
import { Icon } from 'react-native-elements'
import useCategoryStore from 'store/CategoryStore'
import CustomBottomTab from 'components/ui/CustomBottomTab'

const Profile = ({ navigation }) => {
    const auth = useAuth()
    const { categories, isInitialized, fetchCategories } = useCategoryStore()
    let user = JSON.parse(JSON.stringify(auth?.authData.user))

    const [search, setSearch] = React.useState('')

    const signOut = () => {
        auth.signOut()
    }
    const allCategories = []
    if (categories.length > 0) {
        // format data for autocomplete
        categories.map((category) => {
            allCategories.push({
                id: category._id,
                name: category.name
            })
        })
    }

    React.useEffect(() => {
        // Llamar a fetchCategories solo si no está inicializado
        if (!isInitialized) {
            fetchCategories()
        }
    }, [isInitialized])

    return (
        <View style={profile.container}>
            <View style={profile.content}>
                <View style={profile.profileBackgroundContent}>
                    <View style={profile.imageBackgroundContainer}>
                        <Image
                            style={profile.imageBackground}
                            source={
                                user.avatar
                                    ? { uri: user.avatar } : user.picture ? { uri: user.picture }
                                        : require('@/assets/avatar.png')
                            }
                            resizeMode='cover'
                        />
                    </View>
                    <View style={profile.filterBackgroundColor} />
                    <View style={profile.profileContainer}>
                        <Image
                            style={profile.profileImage}
                            source={
                                user.avatar
                                    ? { uri: user.avatar } : user.picture ? { uri: user.picture }
                                        : require('@/assets/avatar.png')
                            }
                        />
                        <View style={profile.iconImageView}>
                            <Icon
                                name='pencil'
                                type='font-awesome'
                                color={colors.white}
                                size={18}
                                style={profile.iconImage}
                            />
                        </View>
                    </View>
                </View>
                <View style={profile.info}>
                    <Text style={profile.fullName}>{user.name}</Text>
                    <Text style={profile.location}>
                        {/* {user.location ? user.location : 'Vilassar de Mar, Spain'} */}
                    </Text>
                </View>
                <View style={profile.interests}>
                    <Text style={profile.title}>Intereses</Text>
                    <View style={profile.tagsContainer}>
                        {/* {allCategories.map((category) => {
                                return <Tag name={category.name} key={category.id} />
                            })} */}


                    </View>
                </View>
                <TouchableOpacity style={profile.signoutButton} onPress={signOut}>
                    <Text style={profile.signoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
            <CustomBottomTab />
        </View>
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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        // padding for android notch
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: colors.background
    },
    userBox: {
        width: '100%',
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 30,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray
    },
    interests: {
        width: '100%',
        justifyContent: 'center',
        marginTop: 20,
        paddingBottom: 30,
        marginBottom: 20,
        paddingHorizontal: 10
    },
    tagsContainer: {
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
        paddingTop: 10,
        gap: 10
    },
    profileBackgroundContent: {
        width: '100%',
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBackgroundContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    filterBackgroundColor: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary,
        opacity: 0.7,
        position: 'absolute',
        zIndex: 2
    },
    profileContainer: {
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: colors.gray,
        zIndex: 3,
        position: 'absolute',
        bottom: -30,
        alignItems: 'center'
    },
    info: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        zIndex: -3
    },
    iconImageView: {
        width: 33,
        height: 33,
        borderRadius: 100,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0
    },
    iconImage: {
        color: colors.accent,
        fontSize: 20
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        paddingTop: 30,
        fontFamily: 'SignikaRegular'
    },
    fullName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        paddingTop: 5,
        fontFamily: 'SignikaBold'
    },
    location: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.gray,
        paddingTop: 5
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
        textTransform: 'uppercase',
        paddingTop: 5
    },
    signoutButton: {
        backgroundColor: colors.accent,
        width: '80%',
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.accent,
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
        color: colors.black,
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
        fontFamily: 'SignikaBold'
    }
})

export default Profile
