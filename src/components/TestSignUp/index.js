import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { animationVariants, staggerVariants } from './animations';
import {
  Wrapper,
  Container,
  Header,
  Logo,
  Nav,
  NavLink,
  LoginButton,
  MainSection,
  FormSection,
  Tabs,
  Tab,
  InputField,
  IconWrapper,
  Input,
  ForgotPassword,
  SubmitButton,
  SocialIcons,
  SocialButton,
  ImageSection,
  CirclesInner,
  Image,
  TopLeftCircles,
  CircleInner1,
  CircleInner2,
  CircleInner3,
  BottomRightCircles,
} from './components';
import { auth, googleProvider, githubProvider } from '../../lib/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axiosClient from '../../axiosClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    toast.error('Failed to send user data to the server.');
  }
};

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('signup');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (location.pathname === '/signup') {
      setActiveTab('signup');
    } else if (location.pathname === '/signin') {
      setActiveTab('signin');
    }
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'signup') {
      navigate('/signup');
    } else if (tab === 'signin') {
      navigate('/signin');
    }
  };

  const handleEmailSignin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/spreadsheets');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await sendUserDataToServer(result.user);
      navigate('/spreadsheets');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleGithubSignin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await sendUserDataToServer(result.user);
      navigate('/spreadsheets');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const getPhotoWithFirstLetter = (name) => {
    return `https://ui-avatars.com/api/?name=${name}&background=random`;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL = null;
      const photo = getPhotoWithFirstLetter(name);
      if (photo) {
        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName: name, photoURL });
      await sendUserDataToServer(user);
      navigate('/');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <Wrapper>
      <ToastContainer />
      <TopLeftCircles>
        <CircleInner1
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <CircleInner2
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <CircleInner3
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        />
      </TopLeftCircles>

      <Container initial="hidden" animate="visible" variants={animationVariants}>
        <Header>
          <Logo initial="hidden" animate="visible" variants={animationVariants}>
            Calcify
          </Logo>
          <Nav>
            <NavLink initial="hidden" animate="visible" variants={animationVariants} href="#">
              Home
            </NavLink>
            <NavLink initial="hidden" animate="visible" variants={animationVariants} href="#">
              Our products
            </NavLink>
            <NavLink initial="hidden" animate="visible" variants={animationVariants} href="#">
              About us
            </NavLink>
            <NavLink initial="hidden" animate="visible" variants={animationVariants} href="#">
              Contact us
            </NavLink>
          </Nav>
          <LoginButton initial="hidden" animate="visible" variants={animationVariants}>
            Login
          </LoginButton>
        </Header>
        <MainSection>
          <FormSection initial="hidden" animate="visible" variants={staggerVariants}>
            <Tabs>
              <Tab active={activeTab === 'signin'} onClick={() => handleTabClick('signin')}>
                Sign in
              </Tab>
              <Tab active={activeTab === 'signup'} onClick={() => handleTabClick('signup')}>
                Sign up
              </Tab>
            </Tabs>

            {activeTab === 'signup' && (
              <>
                <InputField>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                </InputField>
                <InputField>
                  <IconWrapper>
                    <FaEnvelope />
                  </IconWrapper>
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </InputField>
                <InputField>
                  <IconWrapper>
                    <FaLock />
                  </IconWrapper>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputField>
                <InputField>
                  <IconWrapper>
                    <FaLock />
                  </IconWrapper>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </InputField>
                <SubmitButton onClick={handleEmailSignup}>Sign up</SubmitButton>
              </>
            )}

            {activeTab === 'signin' && (
              <>
                <InputField>
                  <IconWrapper>
                    <FaEnvelope />
                  </IconWrapper>
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </InputField>
                <InputField>
                  <IconWrapper>
                    <FaLock />
                  </IconWrapper>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputField>
                <ForgotPassword>Forgot your password?</ForgotPassword>
                <SubmitButton onClick={handleEmailSignin}>Sign in</SubmitButton>
              </>
            )}

            <SocialIcons>
              <SocialButton onClick={handleGithubSignin}>
                <FaGithub />
              </SocialButton>
              <SocialButton onClick={handleGoogleSignin}>
                <FaGoogle />
              </SocialButton>
            </SocialIcons>
          </FormSection>

          <ImageSection initial="hidden" animate="visible" variants={animationVariants}>
            <CirclesInner style={{ top: '-250px', right: '-300px' }}>
              <CircleInner1
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <CircleInner2
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <CircleInner3
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
              />
            </CirclesInner>
            <Image src="/signup_page_image-removebg-preview.png" alt="Signup Illustration" />
          </ImageSection>
        </MainSection>
      </Container>

      <BottomRightCircles>
        <CircleInner1
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <CircleInner2
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <CircleInner3
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        />
      </BottomRightCircles>
    </Wrapper>
  );
};

export default Signup;
