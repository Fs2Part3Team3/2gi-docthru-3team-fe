import Head from 'next/head';
import Header from '@/components/Header';
import { UserProvider } from '@/context/UserProvider';
import ViewportProvider from '@/context/ViewportProvider';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export default function App({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ViewportProvider>
          <Head>
            <title>Docthru</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className="container">
            <Header />
            <div className="subContainer">
              <Component {...pageProps} />
            </div>
          </div>
        </ViewportProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
