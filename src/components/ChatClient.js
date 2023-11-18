import React, { useState, useEffect, useRef } from 'react'
import { Button, TextField } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
// import { Tooltip } from '@chakra-ui/react';
// import ScrollableFeed from 'react-scrollable-feed';
import { Stack, Text, Avatar, Tooltip, Divider, IconButton, Skeleton } from '@chakra-ui/react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Badge from '@material-ui/core/Badge';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
// import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { ChatIcon, CloseIcon } from '@chakra-ui/icons';
import { GroupModal } from './GroupModal';
import GroupList from './GroupList';
import { IconButton as ICONBUTTON } from '@material-ui/core/';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const axios = require('axios');

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const primary = '#272245';
const secondary = 'white';
export const ChatClient = (props) => {
  // setOpen, open, title, description, member, setMember
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Group');
  const [description, setDescription] = useState('Create Group Chat');
  const [member, setMember] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [names, setNames] = useState([]);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))(Badge);
  const fetchUsers = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://1zautuxw45.execute-api.us-east-1.amazonaws.com/prod/users',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    axios.request(config)
      .then((response) => {
        setNames(response.data.users);
      })
      .catch((error) => {
        console.log(error);
      });

  }
  useEffect(() => {
    fetchUsers();
    setLoading(false);
    // scrollToBottom();
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    // Add event listener for screen resize
    window.addEventListener('resize', handleResize);
    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);
  const scrollToBottom = () => {
    // Scroll to the bottom of the container
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const avatarSize = screenWidth <= 400 ? 'sm' : 'md';
  return (
    <>

      {userInfo ?
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
        }}>
          <GroupModal
            setOpen={setOpen}
            open={open}
            title={title}
            description={title}
            member={description}
            setMember={setMember}
            namesList={names}
            groupName={groupName}
            setGroupName={setGroupName}
          />
          <CssBaseline />

          <Container maxWidth="lg" style={{ height: '90%', boxShadow: 'black' }}>
            <Grid item container style={{ height: '100%', boxShadow: 'initial' }}>
              <Grid item xs={3} sm={3} md={3} lg={3} style={{ color: secondary, borderRadius: "20px 0 0 20px", border: '1px solid grey', backgroundColor: primary }}>
                {/* <Paper> */}

                {/* <List component="nav"> */}
                <Box p={1} height={'8%'} bgcolor={primary} style={{ borderRadius: "20px 0 0 0" }}>
                  <Stack justifyContent={'space-between'} direction={'row'}>
                    {userInfo && <Stack direction={'row'}>

                      <Avatar style={{ border: `2px solid ${secondary}` }} name={userInfo.name} />
                      <Typography style={{ fontWeight: 'bold', color: secondary }}>{userInfo.name}</Typography>
                    </Stack>
                    }
                    <IconButton
                      variant='outline'
                      colorScheme='whiteAlpha'
                      aria-label='add chat'
                      size='lg'
                      icon={<ChatIcon />}
                      onClick={() => setOpen(true)}
                    ></IconButton>
                  </Stack>
                </Box>
                {props.groups && <GroupList
                  selectedChat={props.selectedChat}
                  groups={props.groups}
                  handleChatSelect={() => {props.handleChatSelect(); containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" }) }}
                />
                }
                {/* </Paper> */}
              </Grid>

              <Grid style={{ borderRadius: "0 40px 40px 0px", boxShadow: 'initial', position: 'relative' }} item container direction="column" xs={9} sm={9} md={9} lg={9} >
                <Paper style={{ flex: 1, backgroundColor: primary, borderRadius: "0 20px 20px 0px", }}>
                  {props.selectedChat &&
                    <>
                      <Grid item container style={{ height: '100%' }} direction="column">
                        <Grid item container direction='column' style={{ flex: 1 }}>
                          <Box container ref={containerRef} marginTop={3} style={{ height: '600px', overflow: "hidden", overflowY: "scroll", width: "93%", marginLeft: "2%", borderRadius: "1%", backgroundColor: secondary }}>

                            <List >
                              {
                                props.chatRows.map((item, index) => {
                                  if (item?.sender?.name == undefined) {
                                  } else {
                                    return (
                                      <ListItem ref={containerRef} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: userInfo.email == item.sender.email ? 'flex-end' : 'flex-start' }} key={index}>
                                        <div style={{ padding: '10px 20px', backgroundColor: primary, color: secondary, borderRadius: "20px", position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                          <ListItemAvatar>
                                            <StyledBadge

                                              overlap="circular"
                                              anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                              }}
                                              variant="dot"
                                            >
                                              <Avatar style={{ backgroundColor: 'black' }} size={avatarSize} alt={item && item.sender && item.sender.name} />
                                            </StyledBadge>
                                          </ListItemAvatar>
                                          <ListItemText
                                            style={{ color: secondary }}
                                            primary={
                                              <Text color={secondary} fontSize='sm' fontWeight={'extrabold'}>{capitalizeFirstLetter(item && item.sender && item.sender.name)}</Text>
                                            }
                                            secondary={
                                              <React.Fragment>
                                                <Typography
                                                  style={{
                                                    color: secondary
                                                  }}
                                                  component="span"
                                                // variant="body2"
                                                // className={useStyles.inline}
                                                // color="textSecondary"
                                                >
                                                  {item.message}
                                                </Typography>
                                                {/* {" — I'll be in your neighborhood doing errands this…"} */}
                                              </React.Fragment>
                                            }
                                          />
                                        </div>
                                      </ListItem>
                                    )
                                  }
                                })}
                            </List>
                          </Box>
                        </Grid>
                        <Grid item style={{ display: "flex", margin: 10, justifyContent: "flex-end", width: "93%" }}>
                          {props.selectedChat && (
                            <>
                              <TextField onKeyDown={(event) => {

                                if (event.key === 'Enter' && props.message.length > 0) {
                                  event.preventDefault();
                                  props.onPublicMessage()
                                  containerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
                                }
                              }} style={{ padding: 10, width: "100%" }} label="Enter Message" value={props.message} onChange={(e) => props.setMessage(e.target.value)} variant='outlined' focused fullWidth />
                              <Button style={{ marginTop: '1%', height: "80%", width: "20%", padding: 5, color: secondary, backgroundColor: props.message.length == 0 ? 'grey' : primary, float: 'left' }} disabled={props.message.length == 0} variant="outlined" disableElevation onClick={() => { props.onPublicMessage(); containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" }) }}>Send</Button>
                            </>
                          )}
                        </Grid>

                      </Grid>
                      <ICONBUTTON
                        onClick={() => { localStorage.removeItem('userInfo'); window.location.reload(); }}
                        style={{
                          position: 'absolute',
                          right: 9,
                          top: 8,
                          width: 20,
                          height: 20,
                          backgroundColor: props.isConnected ? secondary : secondary,
                          borderRadius: 2,
                        }} ><ExitToAppIcon/></ICONBUTTON></>

                  }

                </Paper>
              </Grid>
            </Grid>

          </Container >

        </div > :
        <Stack>
          <Skeleton height='20px' />
          <Skeleton height='20px' />
          <Skeleton height='20px' />
        </Stack>

      }
    </>
  )
};