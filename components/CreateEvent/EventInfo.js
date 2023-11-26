import { View, Text, StyleSheet, TextInput, Button, Image } from "react-native";
import React from "react";
import colors from "styles/colors";
import * as ImagePicker from "expo-image-picker";

const EventInfo = ({ eventInfo }) => {
    const [event, setEvent] = React.useState({
        name: "",
        description: "",
        images: [],
    });
    const [image, setImage] = React.useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
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
                    onChangeText={(name) => handleEventInfo({ name })}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Descripción del evento</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(description) =>
                        handleEventInfo({ description })
                    }
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Imagenes del evento</Text>
                <Button title="Seleccionar imagen" onPress={pickImage} />
                {image && (
                    <Image
                        source={{ uri: image }}
                        style={{ width: 200, height: 200 }}
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
