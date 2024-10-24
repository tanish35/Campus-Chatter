import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { FaGithub } from "react-icons/fa"; // GitHub icon
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, githubProvider } from "../firebase.js";
import { signInWithPopup } from "firebase/auth";
import { InfinitySpin } from "react-loader-spinner";
import { set } from "zod";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const response = await axios.post(
        "/api/user/google",
        {
          email: user.email,
          displayName: user.displayName,
        },
        { withCredentials: true }
      );
      // console.log(response.data.isCollegeEmail);
      if (response.data.isCollegeEmail === true) {
        toast({
          title: "Signup successful.",
          description: "Add college details to continue.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        navigate(`/addDetails/${response.data.userId}`);
        return;
      }
      if (!response.data.username) {
        toast({
          title: "Signup successful.",
          description: "Add username to continue.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        navigate(`/addusername/${response.data.userId}`);
        return;
      }
      setLoading(false);
      toast({
        title: "Login successful.",
        description: "You are being redirected to the posts page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/posts");
    } catch (error) {
      setLoading(false);
      console.error("Google login error: ", error);
      toast({
        title: "Login failed.",
        description: error.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const response = await axios.post(
        "/api/user/github",
        {
          email: user.email,
          displayName: user.displayName,
        },
        { withCredentials: true }
      );
      if (response.data.isCollegeEmail === true) {
        toast({
          title: "Signup successful.",
          description: "Add college details to continue.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate(`/addDetails/${response.data.userId}`);
        return;
      } else if (!response.data.username) {
        toast({
          title: "Signup successful.",
          description: "Add username to continue.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate(`/addusername/${response.data.userId}`);
        return;
      }
      toast({
        title: "Login successful.",
        description: "You are being redirected to the posts page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/posts");
    } catch (error) {
      console.error("Github login error: ", error);
      toast({
        title: "Login failed.",
        description: error.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="black">
        <InfinitySpin color="#3182CE" size={80} />
      </Flex>
    );
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/user/login",
        { email, password },
        { withCredentials: true }
      );
      setLoading(false);
      if (response.status == 201) {
        toast({
          title: "Email not verified.",
          description: "Please check your email for verification.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
      toast({
        title: "Login successful.",
        description: "You are being redirected to the posts page.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/posts");
    }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Login failed.",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="black">
      <Container
        maxW="md"
        bg="gray.800"
        boxShadow="md"
        p={6}
        rounded="md"
        color="white"
      >
        <Stack spacing={4}>
          <Heading as="h1" size="lg" textAlign="center" color="white">
            Login
          </Heading>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              bg="gray.700"
              color="white"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              bg="gray.700"
              color="white"
            />
          </FormControl>
          <Button
            colorScheme="teal"
            isLoading={loading}
            onClick={handleLogin}
            _hover={{ bg: "teal.500" }}
          >
            Login
          </Button>
          <Link className="text-center" to='/forgetPassword'>Forgot Password?</Link>
          <Button
            leftIcon={<FcGoogle />}
            colorScheme="gray"
            onClick={handleGoogleLogin}
            bg="white"
            color="black"
            _hover={{ bg: "gray.200" }}
          >
            Login with Google
          </Button>
          <Button
            leftIcon={<FaGithub />}
            colorScheme="gray"
            onClick={handleGithubLogin}
            bg="white"
            color="black"
            _hover={{ bg: "gray.200" }}
          >
            Login with Github
          </Button>
        </Stack>
      </Container>
    </Flex>
  );
};

export default LoginPage;
