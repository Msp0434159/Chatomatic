import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    // setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const axios = require('axios');
      let data = JSON.stringify({});


      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://1zautuxw45.execute-api.us-east-1.amazonaws.com/prod/user?email=${email}&password=${password}`,
        headers: {
          'Content-Type': 'application/json'
        },
      };

      axios.request(config)
        .then((response) => {
          if (response) {
            if (response.status == 200) {
              response.data.isConnected = false;
              localStorage.setItem("userInfo", JSON.stringify(response.data));
              setUser(response.data);
              setLoading(false);

              toast({
                title: "Success",
                description: "Login successfull",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              window.location.reload();
            } else {
              toast({
                title: "Error",
                description: "Login Failed",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });


    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
