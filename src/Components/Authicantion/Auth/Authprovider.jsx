import React, { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '../../Firebase/firebase.init';
import { Authcontext } from './Authcontext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create new user
  const createUser = async (email, password, name = 'Unnamed User', photoURL = '') => {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await newUser.getIdToken();

      // Send to backend, backend should handle default role as 'user'
      await axios.post(
        'https://matrimony-server-side-sigma.vercel.app/users',
        {
          name,
          email,
          photoURL,
          uid: newUser.uid,
        },
        { headers: { Authorization: `Bearer ${idToken}` }, timeout: 5000 }
      );

      localStorage.setItem('token', idToken);
      setToken(idToken);
      return newUser;
    } catch (error) {
      console.error('Create user error:', error.message);
      throw new Error(error.code || 'Failed to create user');
    }
  };

  // Sign in existing user
  const signIn = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await user.getIdToken();

      // Try to create user in backend if not exists
      try {
        await axios.post(
          'https://matrimony-server-side-sigma.vercel.app/users',
          {
            name: user.displayName || 'Unnamed User',
            email: user.email,
            uid: user.uid,
          },
          { headers: { Authorization: `Bearer ${idToken}` }, timeout: 5000 }
        );
      } catch (err) {
        // If user already exists, ignore
        if (err.response?.status !== 409) throw err;
      }

      localStorage.setItem('token', idToken);
      setToken(idToken);
      return user;
    } catch (error) {
      console.error('Sign in error:', error.message);
      throw new Error(error.code || 'Failed to sign in');
    }
  };

  // Google sign in
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Try to create user in backend if not exists
      try {
        await axios.post(
          'https://matrimony-server-side-sigma.vercel.app/users',
          {
            name: user.displayName || 'Unnamed User',
            email: user.email,
            photoURL: user.photoURL || '',
            uid: user.uid,
          },
          { headers: { Authorization: `Bearer ${idToken}` }, timeout: 5000 }
        );
      } catch (err) {
        // If user already exists, ignore
        if (err.response?.status !== 409) throw err;
      }

      localStorage.setItem('token', idToken);
      setToken(idToken);
      return user;
    } catch (error) {
      console.error('Google sign in error:', error.message);
      throw new Error(error.code || 'Failed to sign in with Google');
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken(true); // force refresh
          localStorage.setItem('token', idToken);
          setToken(idToken);

          // Fetch user info from backend
          const { data } = await axios.get(`https://matrimony-server-side-sigma.vercel.app/users/${currentUser.email}`, {
            headers: { Authorization: `Bearer ${idToken}` },
            timeout: 5000,
          });

          // Merge backend data (role, etc.) with Firebase user
          setUser({ ...currentUser, ...data });
        } catch (error) {
          console.error('Error fetching user data:', error.response?.data || error.message);
          setUser({ ...currentUser, role: 'user' }); // fallback role
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Refresh token every 30 minutes
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const idToken = await auth.currentUser.getIdToken(true);
        localStorage.setItem('token', idToken);
        setToken(idToken);
      } catch (error) {
        console.error('Token refresh error:', error.message);
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [user]);

  const authInfo = {
    user,
    token,
    loading,
    createUser,
    signIn,
    googleSignIn,
    logout,
  };

  return <Authcontext value={authInfo}>{children}</Authcontext>;
};

export default AuthProvider;