import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <QueryClientProvider client={new QueryClient()}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
