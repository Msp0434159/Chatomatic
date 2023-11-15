import React, { useState } from 'react';
// import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { Card, Button,Au } from '@material-ui/core';
import { useToast } from "@chakra-ui/react";
import SelectSearch from 'react-select-search';

const axios = require('axios');
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const primary = '#272245';
const secondary = 'white';
// import Chip from '@material-ui/core/Chip';
export const GroupModal = ({ setOpen, open, title, description, member, setMember, namesList, groupName, setGroupName }) => {
    const toast = useToast();
    const theme = useTheme();
    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }
    const [personName, setPersonName] = useState([userInfo.email]);
    const rootRef = React.useRef(null);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const addGroup = (event) => {
        
        if (personName.length <= 1 || groupName.length == 0) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
                containerStyle: {
                    color:primary
                  },
            });

            return
        }
        let data = JSON.stringify({
            "name": personName.length > 2 ? groupName:  personName[1],
            "members": personName
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://1zautuxw45.execute-api.us-east-1.amazonaws.com/prod/group',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                // console.log(response);
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });

    }
    const handleChange = (event) => {

        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <>
            <Modal
                style={{ position: 'absolute', top: '33%', left: '33%' }}
                open={open}
                onClose={handleClose}
            >

                <Card
                    style={{
                        width: '40%',
                        height: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    {personName.length > 2 &&
                        <TextField
                            label={'Group Name'}
                            id='Group'
                            onChange={(e) => setGroupName(e.target.value)}
                            value={groupName}
                            style={{
                                width: '90%',
                                marginTop: "5%",
                                input: { textAlign: 'center', padding: 1, fontSize: 20 },
                            }}
                            placeholder='My Awesome Group 🙂'
                        />
                    }
                    <FormControl style={{ m: 1, width: "90%", mt: 3 }}>
                        <Select
                            multiple
                            displayEmpty
                            value={personName}
                            onChange={handleChange}
                            input={<OutlinedInput />}
                            renderValue={(selected) => {
                                if (selected.length === 0) {
                                    return <em>Select Users</em>;
                                }

                                return selected.join(', ');
                            }}
                            MenuProps={MenuProps}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem disabled value="">
                                <em>Placeholder</em>
                            </MenuItem>
                            {namesList.map((item) => (

                                <MenuItem
                                    disabled={item.email == userInfo.email}
                                    selected={item.email == userInfo.email}
                                    key={item.email}
                                    value={item.email}
                                    style={getStyles(item.email, personName, theme)}
                                >
                                    {item.email}
                                </MenuItem>
                            ))}
                        </Select>


                    </FormControl>

                    <Button
                        variant='contained'
                        onClick={(event) => addGroup(event)}
                        style={{
                            width: '90%',
                            marginBottom: 10,
                            backgroundColor: primary,
                            color: secondary
                        }}
                    >
                        Create Group
                    </Button>

                </Card>
            </Modal>
        </>

    )
}
