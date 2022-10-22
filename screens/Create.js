import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";
import getCategories from "../api/CategoryData";
import { useQuery } from "react-query";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const CreateEvent = ({ navigation }) => {
    const categories = useQuery("CATEGORIES", getCategories);
    console.log(categories);
    let dataSet = [];
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    if (categories.data) {
        // format data for autocomplete
        categories.data.map((category) => {
            dataSet.push({ id: category.id, title: category.name });
        });
    }

    return (
        <SafeAreaView>
            <View className="w-full h-full p-2">
                <Text className="">Crea un nuevo evento</Text>
                <Text>Name of the event</Text>
                <TextInput
                    value={name}
                    className="border-2 border-main border-x-0 border-t-0 w-full h-10 text-lg"
                    placeholder="Padel Game"
                />
                <Text className="pt-3">Descripción del evento</Text>
                <TextInput
                    className="h-30 w-full border-2 border-main border-x-0 text-l border-t-0"
                    value={description}
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
                    placeholder="Search"
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        // console.log(data, details.geometry);
                        setSelectedLocation(data.details.geometry.location);
                    }}
                    query={{
                        key: "AIzaSyCXI6UDD5VVeeDwYwCFY5SKyTCQjbt3OIY",
                        language: "es",
                        components: "country:es",
                    }}
                />
                <Text>{selectedLocation}</Text>
            </View>
        </SafeAreaView>
    );
};

export default CreateEvent;
