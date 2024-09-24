"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/store/index";
import useAuthStateListener from "@/hooks/useAuthStateListener";
import { QueryClient, QueryClientProvider } from "react-query";
import Next13ProgressBar from 'next13-progressbar'

const queryClient = new QueryClient();

const App = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <AuthStateListenerWrapper>
          <QueryClientProvider client={queryClient}>
            <Next13ProgressBar height="4px" color="lightgreen" options={{ showSpinner: false }} showOnShallow />
            {children}
          </QueryClientProvider>
        </AuthStateListenerWrapper>
      </Provider>
    </SessionProvider>
  );
};

// Hacemos uso de useAuthStateListener dentro de un componente envuelto por SessionProvider
const AuthStateListenerWrapper = ({ children }: { children: React.ReactNode }) => {
  useAuthStateListener();
  return <>{children}</>;
};

export default App;