import Header from '@/components/Header';
import { UserProvider } from '@/context/UserProvider';
import ViewportProvider from '@/context/ViewportProvider';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ViewportProvider>
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
