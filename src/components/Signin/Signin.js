import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../lib/api'; // Import the API client
import './Signin.css';
import { auth, googleProvider, githubProvider } from '../../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

// MUI Components
import { TextField, Button, Typography, Container, Box, IconButton, InputAdornment, Avatar } from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';

// React Icons (FontAwesome)
import { FaGoogle, FaGithub } from 'react-icons/fa';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
      const token = await user.getIdToken();

      // Optionally, you can send the token to your backend to establish a session or verify the user
      await apiClient.post('/api/auth/signin', { token });

      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 100, height: 100 }}>
          <LockOutlined sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleEmailSignin} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} color="primary">
            Sign In
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<FaGoogle />}
            sx={{ mt: 1, mb: 1 }}
            onClick={handleGoogleSignin}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="default"
            startIcon={<FaGithub />}
            sx={{ mt: 1, mb: 2 }}
            onClick={handleGithubSignin}
          >
            Sign in with GitHub
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signin;
