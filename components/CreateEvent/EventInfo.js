import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import React from "react";
import colors from "styles/colors";
import * as ImagePicker from "expo-image-picker";

const EventInfo = ({ eventInfo, currentEvent }) => {
    const [event, setEvent] = React.useState(currentEvent);
    const [image, setImage] = React.useState({});

    const updateEvent = (key, value) => {
        setEvent((oldEvent) => ({
            ...oldEvent,
            [key]: value,
        }));
        eventInfo(key, value);
    };

    // useeffect to set the image if previous image exists
    React.useEffect(() => {
        if (currentEvent && currentEvent?.images) {
            setImage(currentEvent?.images);
        }
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [16, 9], // [4, 3], [1, 1], [16, 9
            quality: 1,
        });

        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            const filename = localUri.split("/").pop();

            // Añade la imagen al formulario
            let image = {
                uri: localUri,
                name: filename,
                type: "image/jpeg", // Ajusta según el tipo de archivo de tu imagen
            };
            // set the image if the user selects one
            updateEvent("images", image);

            setImage(image);
        }

        if (result.canceled) {
            setImage(null);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Información del evento</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre del evento</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => updateEvent("name", text)}
                    value={event.name}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Descripción del evento</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(description) =>
                        updateEvent("description", description)
                    }
                    value={event.description}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Imagenes del evento</Text>
                {
                    // show Seleccionar imagen button if there is no image
                    image && !image?.uri && (
                        <Button
                            title="Seleccionar imagen"
                            onPress={pickImage}
                        />
                    )
                }
                {
                    // show Cambiar imagen button if there is an image
                    image && image?.uri && (
                        <Button
                            color={colors.accent}
                            title="Cambiar imagen"
                            onPress={pickImage}
                        />
                    )
                }
                {image && image?.uri && (
                    <Image
                        source={{ uri: image?.uri }}
                        style={{ width: 200, height: 200, alignSelf: "center" }}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    titleContainer: {
        alignItems: "center",
        paddingVertical: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    inputContainer: {
        marginVertical: 10,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 10,
    },
    label: {
        color: colors.white,
        fontWeight: "bold",
    },
});

export default EventInfo;
