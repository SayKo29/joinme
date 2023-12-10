import colors from "./colors";
const formStyles = {
    inputContainer: {
        marginVertical: 10,
    },
    input: {
        borderRadius: 10,
        borderWidth: 2,
        padding: 10,
        borderColor: colors.primary,
        color: colors.text,
    },
    label: {
        color: colors.white,
        fontWeight: "bold",
        paddingBottom: 8,
    },
    text: {
        color: colors.white,
        textAlign: "center",
    },
    inputAutocomplete: {
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        width: "90%",
        color: colors.text,
        borderColor: colors.primary,
        borderWidth: 2,
    },
};

export default formStyles;
