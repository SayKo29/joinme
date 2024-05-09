import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Switch,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import React from 'react'
import colors from '@/styles/colors'
import * as ImagePicker from 'expo-image-picker'
import formStyles from '@/styles/formStyles'

const EventInfo = ({ eventInfo, currentEvent }) => {
    const [event, setEvent] = React.useState(currentEvent)
    const [image, setImage] = React.useState({})
    const [isRemote, setIsRemote] = React.useState(false)

    const updateEvent = (key, value) => {
        setEvent((oldEvent) => ({
            ...oldEvent,
            [key]: value
        }))
        eventInfo(key, value)
    }

    // useeffect to set the image if previous image exists
    React.useEffect(() => {
        if (currentEvent && currentEvent?.images) {
            setImage(currentEvent?.images)
            setIsRemote(currentEvent?.isRemote)
        }
    }, [])

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [16, 9], // [4, 3], [1, 1], [16, 9
            quality: 1
        })

        if (!result.canceled) {
            const localUri = result.assets[0].uri
            const filename = localUri.split('/').pop()

            // Añade la imagen al formulario
            const image = {
                uri: localUri,
                name: filename,
                type: 'image/jpg'
            }
            // set the image if the user selects one
            updateEvent('images', image)

            setImage(image)
        }

        if (result.canceled) {
            setImage({})
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Información del evento</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={formStyles.label}>Nombre del evento</Text>
                <TextInput
                    style={formStyles.input}
                    placeholderTextColor={colors.gray}
                    placeholder='Partido de fútbol'
                    onChangeText={(text) => updateEvent('name', text)}
                    value={event.name}
                />
            </View>
            <View style={formStyles.inputContainer}>
                <Text style={formStyles.label}>Descripción del evento</Text>
                <TextInput
                    style={formStyles.inputTextArea}
                    placeholderTextColor={colors.gray}
                    placeholder='Partido de fútbol en el parque del ayuntamiento...'
                    multiline
                    maxLength={200}
                    onChangeText={(description) =>
                        updateEvent('description', description)}
                    value={event.description}
                />
            </View>
            {/* make switch for isRemote */}
            <View style={formStyles.inputContainer}>
                <Text style={formStyles.label}>¿Es un evento remoto?</Text>
                <Switch
                    trackColor={{
                        false: colors.disabled,
                        true: colors.primary
                    }}
                    thumbColor={isRemote ? colors.gray : colors.gray}
                    ios_backgroundColor={colors.disabled}
                    onValueChange={() => {
                        setIsRemote(!isRemote)
                        updateEvent('isRemote', !isRemote)
                    }}
                    style={{ marginTop: 8 }}
                    value={isRemote}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={formStyles.label}>Imagen del evento</Text>
                {
                    // show Seleccionar imagen button if there is no image
                    image && !image?.uri && (
                        <TouchableOpacity style={formStyles.pickImage} onPress={pickImage}>
                            <Text style={formStyles.text}>Seleccionar imagen</Text>
                        </TouchableOpacity>
                    )
                }
                {
                    // show Cambiar imagen button if there is an image
                    image && image?.uri && (
                        <TouchableOpacity style={formStyles.input} onPress={pickImage}>
                            <Text style={formStyles.text}>Cambiar imagen</Text>
                        </TouchableOpacity>
                    )
                }
                {image && image?.uri && (
                    <Image
                        source={{ uri: image?.uri }}
                        style={{
                            width: 200,
                            height: 200,
                            alignSelf: 'center',
                            marginVertical: 15
                        }}
                    />
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    titleContainer: {
        alignItems: 'center',
        paddingVertical: 20
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'SignikaBold'
    }
})

export default EventInfo
