import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";
import getCategories from "../api/CategoryData";
import { useQuery } from "react-query";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { TouchableOpacity } from "react-native-gesture-handler";
import CreateEventPost from "../api/CreateEventPost";

const CreateEvent = ({ navigation }) => {
    const categories = useQuery("CATEGORIES", getCategories);
    let dataSet = [];
    const ref = useRef();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreateEvent = () => {
        // console.log("hoolafdsafsa");
        // console.log(selectedLocation);

        const event = {
            name: name,
            description: description,
            category: selectedCategory.id,
            longitude: selectedLocation?.lng,
            latitude: selectedLocation?.lat,
            user: "634ed058ba603fa66e53732f",
        };
        CreateEventPost(event);
        // console.log(selectedCategory);
    };

    if (categories.data) {
        // format data for autocomplete
        categories.data.map((category) => {
            dataSet.push({ id: category._id, title: category.name });
        });
    }

    return (
        <SafeAreaView>
            <View className="w-full h-full p-2">
                <Text className="">Crea un nuevo evento</Text>
                <Text>Name of the event</Text>
                <TextInput
                    value={name}
                    onChangeText={(text) => setName(text)}
                    className="border-2 border-main border-x-0 border-t-0 w-full h-10 text-lg"
                    placeholder="Padel Game"
                />
                <Text className="pt-3">Descripción del evento</Text>
                <TextInput
                    className="h-30 w-full border-2 border-main border-x-0 text-l border-t-0"
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    placeholder="Breve descripción del evento"
                    multiline={true}></TextInput>
                <Text>Category</Text>
                <AutocompleteDropdown
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={true}
                    onSelectItem={setSelectedCategory}
                    dataSet={dataSet}
                />
                <Text>Location</Text>
                <GooglePlacesAutocomplete
                    ref={ref}
                    placeholder="Search"
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        if (details) {
                            setSelectedLocation(details.geometry.location);
                        }
                        // setSelectedLocation(details?.geometry?.location);
                        // console.log(details?.geometry?.location);
                    }}
                    query={{
                        key: "AIzaSyCXI6UDD5VVeeDwYwCFY5SKyTCQjbt3OIY",
                        language: "es",
                        components: "country:es",
                    }}
                />
                {/* <Text>{selectedLocation}</Text> */}

                <TouchableOpacity
                    className="bg-main w-full h-10 rounded-lg flex justify-center"
                    onPress={handleCreateEvent}>
                    <Text className="text-white text-center text-xl">
                        Crear evento
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CreateEvent;