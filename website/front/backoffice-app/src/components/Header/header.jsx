import './Header.scss';
import logo from './../../images/logo.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Paper, Grid, Typography, Box, Button } from '@mui/material';
import UserAvatar from '../UserAvatar';
import { MdArrowDropDown } from 'react-icons/md';

const Header = ({ theme }) => {

    const navigate = useNavigate();
    const logged = false;    
 
    return (
        <Grid className="header">
            <Paper elevation={8} className="header_paper">
                <Grid className="inside">
                    <img src={logo}/>
                    { logged && <Grid className="profile">
                        <UserAvatar username="HeezQ" rounded={6} />
                        <Box className="username">
                            <Typography className="username__nick">HeezQ</Typography>
                            <MdArrowDropDown size={20}/>
                        </Box>
                    </Grid> }
                    { !logged && <Grid className="buttons">
                        <button onClick={() => navigate('/songlist')}>Songlist</button>
                        <button onClick={() => navigate('/discord')}>Discord</button>
                        <button onClick={() => navigate('/login')}>Login</button>
                        {/* <Button variant="contained" onClick={() => navigate('/login')}>Login / Register</Button> */}
                    </Grid> }
                </Grid>
            </Paper>
        </Grid>
    )
}

export default Header;