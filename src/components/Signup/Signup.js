import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import axiosClient from '../../axiosClient';
import { auth, googleProvider, githubProvider } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// MUI Components
import { TextField, Button, Avatar, Typography, Container, Box, IconButton, InputAdornment } from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

// React Icons (FontAwesome)
import { FaGoogle, FaGithub } from 'react-icons/fa';

const sendUserDataToServer = async (user) => {
  console.log('User data:', user);
  try {
    await axiosClient.post('/api/auth/signup', {
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL,
      provider: user.providerData[0]?.providerId,
    });
  } catch (error) {
    console.error('Error sending user data to server:', error);
  }
};

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setPhoto(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = null;
      if (photo) {
        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      await user.updateProfile({ displayName: name, photoURL });
      await sendUserDataToServer(user);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await sendUserDataToServer(user);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGithubSignup = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      await sendUserDataToServer(user);
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
        <div onDrop={handleDrop} onDragOver={handleDragOver} style={{ position: 'relative', cursor: 'pointer' }}>
          <Avatar src={photoPreview || null} sx={{ width: 100, height: 100 }}>
            {!photoPreview && <LockOutlined />}
          </Avatar>
          <input
            type="file"
            accept="image/*"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
            onChange={handleFileChange}
          />
        </div>
        <Typography component="h1" variant="h5" sx={{ marginTop: 2 }}>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleEmailSignup} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} color="primary">
            Sign Up
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            startIcon={<FaGoogle />}
            sx={{ mt: 1, mb: 1 }}
            onClick={handleGoogleSignup}
          >
            Sign up with Google
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="default"
            startIcon={<FaGithub />}
            sx={{ mt: 1, mb: 2 }}
            onClick={handleGithubSignup}
          >
            Sign up with GitHub
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
