// src/Providers.js
import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { UserProvider } from './contexts/UserContext';

const Providers = ({ children }) => {
  return (
    <UserProvider>
      <PrimeReactProvider>{children}</PrimeReactProvider>
    </UserProvider>
  );
};

export default Providers;
