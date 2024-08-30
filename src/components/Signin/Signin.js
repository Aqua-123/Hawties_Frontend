import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../lib/api'; // Import the API client
import './Signin.css';
import { auth, googleProvider, githubProvider } from '../../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSignin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Optionally, you can send the token to your backend to establish a session or verify the user
      await apiClient.post('/api/auth/signin', { token });

      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Optionally, you can send the token to your backend to establish a session or verify the user
      await apiClient.post('/api/auth/signin', { token });

      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGithubSignin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleEmailSignin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign In</button>
      </form>
      <div className="social-signin">
        <button onClick={handleGoogleSignin}>Sign in with Google</button>
        <button onClick={handleGithubSignin}>Sign in with GitHub</button>
      </div>
    </div>
  );
};

export default Signin;
