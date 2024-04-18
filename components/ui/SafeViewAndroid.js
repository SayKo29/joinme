import { StyleSheet, Platform, StatusBar } from "react-native";
import colors from "styles/colors";

export default StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
});