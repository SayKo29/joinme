import * as React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Router } from "./routes/Router";
import { AuthProvider } from "./contexts/Auth";

export default () => {
    // Create a client
    const queryClient = new QueryClient();

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Router />
            </QueryClientProvider>
        </AuthProvider>
    );
};
