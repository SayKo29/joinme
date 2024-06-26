import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import colors from "@/styles/colors";

const HeaderNavigationEvent = ({ selected, setSelected }) => {
    const handleSelect = (value) => {
        setSelected(value);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => handleSelect("new")}
                style={[
                    selected === "new" ? styles.selected : styles.unselected,
                ]}
            >
                <Text
                    style={[
                        selected === "new"
                            ? styles.selected
                            : styles.unselected,
                    ]}
                >
                    Descubrir Nuevos
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleSelect("myevents")}
                testID="myevents-button"
                style={[
                    selected === "myevents"
                        ? styles.selected
                        : styles.unselected,
                ]}
            >
                <Text
                    style={[
                        selected === "myevents"
                            ? styles.selected
                            : styles.unselected,
                    ]}
                >
                    Mis eventos
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        padding: 10,
    },
    selected: {
        fontWeight: "bold",
        color: colors.text,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        fontSize: 16,
    },
    unselected: {
        fontWeight: "bold",
        color: colors.gray,
        fontSize: 16,
    },
});

export default HeaderNavigationEvent;
