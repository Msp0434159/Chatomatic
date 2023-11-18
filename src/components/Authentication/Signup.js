import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import { useHistory } from "react-router";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClick1 = () => setShow1(!show1);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const axios = require('axios');
      let data = JSON.stringify({
        "name": name,
        "email": email,
        "password": password
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://1zautuxw45.execute-api.us-east-1.amazonaws.com/prod/user',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          if (response) {
            if (response.status == 200) {
              // localStorage.setItem("userInfo", JSON.stringify(response.data));
              // setPicLoading(false);
              // history.push("/chats");
              window.location.reload()
              toast({
                title: "Message!",
                description: response.status == 210 ? "User Already Exist" : "success",
                status: response.status == 210 ? "error" : "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              })
            }
            toast({
              title: "Message!",
              description: response.status == 210 ? "User Already Exist" : "success",
              status: response.status == 210 ? "error" : "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            })

            console.log("response", response);
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

    }
  };

  // const postDetails = (pics) => {
  //   // setPicLoading(true);
  //   // // if (pics === undefined) {
  //   // //   toast({
  //   // //     title: "Please Select an Image!",
  //   // //     status: "warning",
  //   // //     duration: 5000,
  //   // //     isClosable: true,
  //   // //     position: "bottom",
  //   // //   });
  //   // //   return;
  //   // // }
  //   // console.log(pics);
  //   // if (pics.type === "image/jpeg" || pics.type === "image/png") {
  //   //   const data = new FormData();
  //   //   data.append("file", pics);
  //   //   data.append("upload_preset", "chat-app");
  //   //   data.append("cloud_name", "piyushproj");
  //   //   fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
  //   //     method: "post",
  //   //     body: data,
  //   //   })
  //   //     .then((res) => res.json())
  //   //     .then((data) => {
  //   //       setPic(data.url.toString());
  //   //       console.log(data.url.toString());
  //   //       setPicLoading(false);
  //   //     })
  //   //     .catch((err) => {
  //   //       console.log(err);
  //   //       setPicLoading(false);
  //   //     });
  //   // } else {
  //   //   toast({
  //   //     title: "Please Select an Image!",
  //   //     status: "warning",
  //   //     duration: 5000,
  //   //     isClosable: true,
  //   //     position: "bottom",
  //   //   });
  //   //   setPicLoading(false);
  //     return;
  //   }
  // };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show1 ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick1}>
              {show1 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {/* <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl> */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      // isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
