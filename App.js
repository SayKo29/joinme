import * as React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Router } from './routes/Router'
import { AuthProvider } from '@/contexts/Auth'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'

export default () => {
    let [fontsLoaded] = useFonts({
        'SignikaRegular': require('./assets/fonts/SignikaNegative-Regular.ttf'),
        'SignikaBold': require('./assets/fonts/SignikaNegative-Bold.ttf'),
        'SignikaLight': require('./assets/fonts/SignikaNegative-Light.ttf'),
        'SignikaSemiBold': require('./assets/fonts/SignikaNegative-SemiBold.ttf'),
    })

    if (!fontsLoaded) {
        return null
    }

    // Create a client
    const queryClient = new QueryClient()

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <StatusBar style='auto' hidden={false} />
                <Router />
            </QueryClientProvider>
        </AuthProvider>
    )
}
