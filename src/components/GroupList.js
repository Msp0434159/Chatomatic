import React, { useState } from 'react';
import { ChakraProvider, Box, Avatar, VStack, Text, Select } from '@chakra-ui/react';
import { ChatState } from "../Context/ChatProvider";

const primary = '#272245';
const secondary = 'white';
const textColor = 'white';

const ChatList = (props) => {

    const { user, setSelectedChat } = ChatState();
    // Example array of chat items
    // const chatList = [
    //     { id: 1, name: 'John Doe', avatar: 'JD' },
    //     { id: 2, name: 'Jane Smith', avatar: 'JS' },
    //     { id: 3, name: 'Bob Johnson', avatar: 'BJ' },
    // ];

    return (
        <ChakraProvider>
            <VStack align="start" spacing={2}>
                {props.groups.map((chat) => (
                    <Box width={"100%"}
                        key={chat.id}
                        bg={props.selectedChat === chat.id ? secondary:primary}
                        color={props.selectedChat === chat.id ? primary: secondary}
                        p={3}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        onClick={() => setSelectedChat(chat.id)}
                        cursor="pointer"
                    >
                        <Avatar bg={'grey'} size="md" marginRight={3}>
                        </Avatar>
                        <div>
                            <Text fontWeight="bold">{chat.members.length <= 2 ? (chat.members[0] == user.email ? chat.members[1] : chat.members[0]) : (chat.name)}</Text>

                            <Text>{chat.last_message}</Text>
                        </div>
                    </Box>
                ))}
            </VStack>
        </ChakraProvider>
    );
};

export default ChatList;
