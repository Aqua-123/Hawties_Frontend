// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axiosClient from '../axiosClient';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosClient.post(`/api/auth/user`);
        if (response.data) {
          setUser((prevUser) => ({
            ...prevUser,
            ...response.data, // Merge backend details with Firebase user details
          }));
        }
      } catch (error) {
        console.error('Error fetching user details from backend:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { displayName, photoURL, email } = currentUser;
        setUser({ name: displayName, photoURL, email });
        console.log('User signed in:', currentUser);
        fetchUserDetails(email); // Fetch additional user details from the backend
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <UserContext.Provider value={{ user, setUser, loading }}>{!loading && children}</UserContext.Provider>;
};
