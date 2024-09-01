import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f8fa;
  position: relative;
  overflow: hidden;
`;

export const Container = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  width: 1000px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2;
`;

export const Header = styled.header`
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
`;

export const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #00796b;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

export const NavLink = styled(motion.a)`
  text-decoration: none;
  color: #00796b;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const LoginButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 20px;
  background-color: #00796b;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #005a4f;
  }
`;

export const MainSection = styled.div`
  display: flex;
  overflow: hidden;
  height: 100%;
`;

export const FormSection = styled(motion.div)`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Tabs = styled(motion.div)`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
`;

export const Tab = styled(motion.button)`
  background: none;
  border: none;
  font-size: 18px;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  color: ${({ active }) => (active ? '#00796b' : '#aaa')};
  cursor: pointer;
  padding: 10px;
  border-bottom: ${({ active }) => (active ? '2px solid #00796b' : '2px solid transparent')};
  outline: none;
  transition: all 0.3s ease;
`;

export const InputField = styled(motion.div)`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

export const Input = styled(motion.input)`
  width: calc(100% - 50px);
  padding: 15px 20px 15px 50px;
  border-radius: 25px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  font-size: 16px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.05);
  outline: none;
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: #aaa;
`;

export const ForgotPassword = styled(motion.a)`
  align-self: flex-start;
  color: #00796b;
  font-size: 14px;
  margin-bottom: 20px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  border-radius: 25px;
  border: none;
  background-color: #00796b;
  color: white;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background-color: #005a4f;
  }
`;

export const SocialIcons = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
`;

export const SocialButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f8fa;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #00796b;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #00796b;
    color: white;
  }
`;

export const ImageSection = styled(motion.div)`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CirclesInner = styled(motion.div)`
  position: absolute;
  width: 800px;
  height: 800px;
  z-index: 1;
`;

export const CircleInner = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
`;

export const CircleInner1 = styled(CircleInner)`
  width: 800px;
  height: 800px;
  background-color: #9ed4ce9a;
  top: 100px;
  left: 40px;
`;

export const CircleInner2 = styled(CircleInner)`
  width: 700px;
  height: 700px;
  background-color: #7dc1c18d;
  top: 150px;
  left: 100px;
`;

export const CircleInner3 = styled(CircleInner)`
  width: 600px;
  height: 600px;
  background-color: #58a8a7ad;
  top: 200px;
  left: 160px;
`;

export const Image = styled(motion.img)`
  width: 510px;
  height: auto;
  z-index: 2;
`;

export const TopLeftCircles = styled(CirclesInner)`
  top: -580px;
  left: -470px;
  opacity: 0.6;
`;

export const BottomRightCircles = styled(CirclesInner)`
  bottom: -435px;
  right: -350px;
  opacity: 0.6;
`;
