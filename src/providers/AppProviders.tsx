import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";

type AppProvidersProps = {
    children: React.ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}