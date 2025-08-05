import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../../Firebase/firebase.init';
import { Authcontext } from './Authcontext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (email, password, name = 'Unnamed User', photoURL = '') => {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      await axios.post('http://localhost:3000/users', {
        name,
        email,
        photoURL,
        role: 'user',
        uid: newUser.uid,
      }, { timeout: 5000 });
      return newUser;
    } catch (error) {
      throw new Error(error.code || 'Failed to create user');
    }
  };

  const signIn = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      throw new Error(error.code || 'Failed to sign in');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const { data } = await axios.get(`http://localhost:3000/users/${currentUser.email}`, { timeout: 5000 });
          setUser({ ...currentUser, ...data });
        } catch (error) {
          console.error('Error fetching user data:', error.message);
          setUser({ ...currentUser, role: 'user' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    setLoading(true);
  return signOut(auth);
  };

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logout,
  };

  return (
    <Authcontext value={authInfo}>
      {children}
    </Authcontext>
  );
};

export default AuthProvider;