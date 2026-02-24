import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";

import { queryClient } from "./query-client";

import i18next from "../i18n";

type AppProvidersProps = {
  children: React.ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <I18nextProvider i18n={i18next}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  );
};
