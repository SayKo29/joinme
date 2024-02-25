import colors from './colors'
const formStyles = {
  inputContainer: {
    marginVertical: 10
  },
  input: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: colors.text,
    borderRadius: 20,
    marginVertical: 8
  },
  inputTextArea: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: colors.text,
    borderRadius: 10,
    height: 70,
    textAlignVertical: 'top',
    marginVertical: 8
  },
  label: {
    color: colors.white,
    fontWeight: 'bold'
  },
  text: {
    color: colors.white,
    textAlign: 'center'
  },
  inputAutocomplete: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: '90%',
    color: colors.text,
    borderColor: colors.primary,
    borderWidth: 2
  },
  pickImage: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    marginVertical: 8,
    width: '100%'
  }
}

export default formStyles
