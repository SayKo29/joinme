import { StyleSheet, View, Text, Dimensions } from "react-native";
import React from "react";
import SlidingUpPanel from "rn-sliding-up-panel";
import MarkerDetail from "../screens/MarkerDetail";

export default function SlidePanelDetail(markerData) {
    const { height } = Dimensions.get("window");

    return (
        <SlidingUpPanel
            // ref={(c) => (this._panel = c)}
            draggableRange={{ top: height, bottom: 60 }}
            // animatedValue={this._draggedValue}
            showBackdrop={false}>
            <View style={styles.panel}>
                <View style={styles.panelHeader}>
                    <Text style={{ color: "#FFF" }}>
                        {markerData.markerData.title}
                    </Text>
                </View>
                <View style={styles.slideContainer}>
                    {/* Component markerDetail with prop markerPressed */}
                    <MarkerDetail markerData={markerData.markerData} />
                </View>
            </View>
        </SlidingUpPanel>
    );
}

const styles = StyleSheet.create({
    slideContainer: {
        flex: 1,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
    },
    slider: {
        width: "100%",
        height: "30%",
    },

    panel: {
        flex: 1,
        backgroundColor: "white",
        position: "relative",
    },
    panelHeader: {
        height: "10%",
        backgroundColor: "#561F37",
        alignItems: "center",
        justifyContent: "start",
    },
});
