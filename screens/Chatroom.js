import React from 'react'
import { useAuth } from '@/contexts/Auth'
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import getEventsByParticipant from '@/api/GetParticipantEvents'
import { useQuery } from 'react-query'
import LottieAnimation from '@/components/LottieAnimation'
import colors from '@/styles/colors'
import { FlashList } from '@shopify/flash-list'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import CustomBottomTab from 'components/ui/CustomBottomTab'
import useTabStore from 'store/TabStore'
import { uiStyles } from 'styles/uiStyles'
import ChatCard from 'components/ChatComponents/ChatCard'

const ChatRooms = () => {
    const navigation = useNavigation()
    const auth = useAuth()
    const loggedUser = auth.authData.user
    // console.log(auth.authData.user._id)
    const { isLoading, isError, data } = useQuery('CHATROOMS', () =>
        getEventsByParticipant(loggedUser._id)
    )

    const handleSelectChatroom = (event) => {
        navigation.navigate('ChatScreen', { event })
    }

    const handleGoToEvents = () => {
        navigation.navigate('EventMap')
        useTabStore.setState({ tab: 0 })
    }

    if (isLoading || isError) {
        return isLoading ? <LottieAnimation /> : <Text>Error</Text>
    }
    const events = data ?? []

    // sort events by date
    if (events?.length > 0) {
        events.sort((a, b) => {
            return new Date(b.endDate) - new Date(a.endDate)
        })
    }

    if (events.length === 0) {
        return (
            <View style={styles.emptyView}>
                <View style={styles.textContainerEmpty}>
                    <Text style={styles.textEmpty}>
                        No hay chats de eventos disponibles, para unirte a alguno,
                    </Text>
                    <TouchableOpacity
                        style={uiStyles.button}
                        onPress={handleGoToEvents}
                    >
                        <Text style={styles.buttonText}>Únete a un evento</Text>
                    </TouchableOpacity>
                </View>
                <CustomBottomTab />
            </View>
        )
    }

    return (
        <View style={[styles.container]}>
            <View style={styles.title}>
                <Text style={styles.titleText}>Chats de eventos</Text>
            </View>
            <FlashList
                data={events}
                estimatedItemSize={20}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <ChatCard event={item} index={index} onPress={() => handleSelectChatroom(item)} />
                )}
            />
            <CustomBottomTab />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 60,
        backgroundColor: colors.background
    },
    emptyView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
    },
    textContainerEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    textEmpty: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 15,
        fontFamily: 'SignikaBold'
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    title: {
        alignItems: 'center',
        paddingBottom: 10
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        fontFamily: 'SignikaBold'
    },
    text: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 10,
        fontFamily: 'SignikaBold'
    },
    btn: {
        color: colors.accent,
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 10,
        fontFamily: 'SignikaBold'
    },
    buttonText: {
        color: colors.black,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'SignikaBold'
    }
})

export default ChatRooms
