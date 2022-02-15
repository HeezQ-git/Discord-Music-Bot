import './Activate.scss';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { accountService } from '../../../services/account.service';
import { MdHome, MdLogin } from 'react-icons/md';
import { Container, Grid, Typography, Paper, Button, Box, Tooltip } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Discord from './../../Discord';

const Activate = () => {
    
    const delay = async ms => new Promise(res => setTimeout(res, ms));
    const navigate = useNavigate();

    const [activated, setActivated] = useState(null);
    const [message, setMessage] = useState('');
    const [copy, setCopy] = useState('Copy');

    const { id } = useParams();

    const copied = async () => {
        setCopy('Copied!');
        await delay(3000);
        setCopy('Copy');
    }

    useEffect(() => {
        if (id) {
            accountService.activateAccount({ id: id })
            .then(res => {
                if (res.data.success) setActivated(true)
                else {
                    setActivated(false);
                    setMessage(res.data.msg);
                };
            })
        }
    }, []);

    return (
        <Container component="main" className='activate' maxWidth='sm'>
            <Paper elevation={8} className='activate_paper'>
                <Typography variant="h5">Account Activation</Typography>
                { activated != null && activated === true ? 
                <Box className="box">
                    <Grid className="container box">
                        <Typography variant="h6" sx={{ color: green[500] }}>Account successfully activated!</Typography>
                        <Typography>You can now login to your account.</Typography>
                    </Grid>
                    <Grid className="buttons container">
                        <Button onClick={() => navigate('/')} startIcon={<MdHome/>}>Home</Button>
                        <Button onClick={() => navigate('/login/')} variant="contained" startIcon={<MdLogin/>}>Login</Button>
                    </Grid>
                </Box> : <Box className="container box">
                    <Grid className="box">
                        <Typography variant="h6" sx={{ color: red[500] }}>Unable to activate account!</Typography>
                        <Typography>{ message }</Typography>
                    </Grid>
                    <Grid className="box contact container">
                        <Typography>If this persists, contact the developer on discord with following ID:</Typography>
                            <CopyToClipboard onCopy={() => copied()} text={ id }>
                                <Tooltip followCursor title={copy}>
                                    <Typography className="id">{ id }</Typography>
                                </Tooltip>
                            </CopyToClipboard>
                    </Grid>
                    <Grid className="buttons">
                        <Button onClick={() => navigate('/')} startIcon={<MdHome/>}>Home</Button>
                        <Discord/>
                    </Grid>
                </Box> }
            </Paper>
        </Container>
    )
}

export default Activate;