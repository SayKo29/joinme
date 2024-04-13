import { BaseToast, ErrorToast } from "react-native-toast-message"
import colors from './colors'

export const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: colors.primary }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'SignikaBold',
                color: '#000'
            }}
            text2Style={{
                fontSize: 12,
                color: '#000',
                fontFamily: 'SignikaRegular'
            }}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: 'red' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'SignikaBold',
                color: '#000'
            }}
            text2Style={{
                fontSize: 12,
                color: '#000',
                fontFamily: 'SignikaRegular'
            }}
        />
    )
}