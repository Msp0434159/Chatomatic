import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChatClient } from '../components/ChatClient';
import { Skeleton, Stack } from '@chakra-ui/react';
import { ChatState } from "../Context/ChatProvider";
import { useToast } from "@chakra-ui/react";
const axios = require('axios');
// import { ChatState } from "../Context/ChatProvider";
const URL = 'wss://id04qrww23.execute-api.us-east-1.amazonaws.com/production';
const App = () => {
  let newArray = []
  let socket = useRef(null);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, setUser, chats, setChats } = ChatState();
  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState([]);
  const [chatRows, setChatRows] = useState([]);
  const [message, setMessage] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [refetchId, setReFetchId] = useState(0);
  const [groups, setGroups] = useState([]);


  const onSocketOpen = () => {

    if (socket.current.readyState == WebSocket.OPEN) {
      console.log("socket", socket)
      setIsConnected(true);
      socket.current.send(JSON.stringify({ action: 'setName', email: userInfo.email }));
    }
  }
  const fetchGroups = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://1zautuxw45.execute-api.us-east-1.amazonaws.com/prod/groups?email=${userInfo.email}`,
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        setGroups(response.data.groups);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const onSocketClose = () => {
    setMembers([]);
    setIsConnected(false);
    setChatRows([]);
  }
  function sortBySortIdDesc(arrayOfObjects) {
    // Create a shallow copy of the array before sorting
    const sortedArray = [...arrayOfObjects];
    sortedArray.sort((a, b) => a.sort_id - b.sort_id);
    return sortedArray;
  }
  const onSocketMessage = (dataStr) => {
    const data = JSON.parse(dataStr);
    let refetchGroup = false;
    if (data.members) {
      setMembers(data.members);
    } else if (data) {
      for (let message of data) {
        let group = groups.find((x) => x.group_id == message.group_id)
        if (!group) {
          refetchGroup = true;
        } else {

        }
      }
      if (refetchGroup) {
        fetchGroups();
      }
      for(let key in members){
        if(members[key] == userInfo.sender){
          toast({
            title: "New Message !!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
        }
      }
      // let lastMessage = data[data.length - 1].sender 
      // // let lastMessage = data[data.length - 1].sender == userInfo.email;
      // console.log("lastMessage",lastMessage);
      // if (!lastMessage) {
      //   toast({
      //     title: "New Message !!",
      //     status: "success",
      //     duration: 5000,
      //     isClosable: true,
      //     position: "bottom-right",
      //   });
      // }
      const array = sortBySortIdDesc(data)
      setChatRows(array);
    }
  }

  useEffect(() => {
    setChatRows([]);
    fetchChats();
  }, [selectedChat]);
  useEffect(() => {
    fetchGroups();
    if (socket.current?.readyState !== WebSocket.OPEN && userInfo) {
      socket.current = new WebSocket(URL);
      socket.current.addEventListener('open', onSocketOpen);
      socket.current.addEventListener('close', onSocketClose);
      socket.current.addEventListener('message', (event) => {
        onSocketMessage(event.data);
      });
    }

  }, [URL]);

  const onSendPublicMessage = () => {
    console.log("selected chat id", selectedChat);
    if (socket.current.readyState == WebSocket.OPEN) {
      socket.current.send(JSON.stringify({
        action: 'sendPublic',
        message: message,
        group_id: selectedChat
      }));
      setMessage("");
    }
  }

  const fetchChats = async () => {
    console.log("fetch", selectedChat);
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://1zautuxw45.execute-api.us-east-1.amazonaws.com/prod/chats?group_id=${selectedChat}`,
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        const array = sortBySortIdDesc(response.data.chats)
        setChatRows(array);
      })
      .catch((error) => {
        console.log(error);
      });

  }
  const handleChatSelect = async (chatId) => {
    try {
      setChatRows([]);
      // Replace this with your actual API endpoint or DynamoDB query

      setSelectedChat(chatId);
      fetchChats();
    } catch (error) {
      console.error('Error fetching chat data:', error);
    }
  }

  const onDisconnect = () => {
    if (socket.current.readyState == WebSocket.OPEN) {
      socket.current.close();
    }
  }
  return (
    <>
      {userInfo != null ?
        <ChatClient
          isConnected={isConnected}
          members={members}
          chatRows={chatRows}
          message={message}
          setMessage={setMessage}
          onPublicMessage={onSendPublicMessage}
          onDisconnect={onDisconnect}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          handleChatSelect={handleChatSelect}
          groups={groups}
          setGroups={setGroups}
        >
        </ChatClient>
        :
        <Stack>
          <Skeleton height='20px' />
          <Skeleton height='20px' />
          <Skeleton height='20px' />
        </Stack>
      }
    </>
  )
};
export default App;