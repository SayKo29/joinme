import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Router } from "./routes/Router";
import { AuthProvider } from "@/contexts/Auth";
import { StatusBar } from "expo-status-bar";
// import * as ScreenOrientation from "expo-screen-orientation";

export default () => {
    // Lock screen orientation to portrait
    // React.useEffect(() => {
    //     ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    // }, []);

    // Create a client
    const queryClient = new QueryClient();

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <StatusBar style="auto" hidden={false} />
                <Router />
            </QueryClientProvider>
        </AuthProvider>
    );
};
