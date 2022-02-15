import './EmailSent.scss';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router'
import { useState } from 'react';
import { mailerService } from '../../../services/mailer.service';
import { MdLogin, MdOutlineAutorenew } from 'react-icons/md';

import { Alert, Container, Grid, Paper, Snackbar, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const EmailSent = () => {

    const navigate = useNavigate();

    const { email } = useParams();
    const [loading, setLoading] = useState(false);

    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState('');

    const resendEmail = async () => {
        setLoading(true);

        const res = await mailerService.sendEmail({ email: email });

        setLoading(false);

        if (res.data.success) setSuccessOpen(true)
        else setErrorOpen(res.data.msg ? res.data.msg : 'An unexpected error occurred');
    }

    return (
        <Grid component='main' className='main'>
            <Container className='email_sent' maxWidth='sm'>
                <Paper elevation={8} className='email_sent_paper'>
                    <Grid className="text">
                        <Typography variant="h5">Account Activation</Typography>
                        <Typography variant="h6">A verification email has been sent to your inbox</Typography>
                    </Grid>
                    <Typography className="info">Didn't receive email within a few minutes? <span>Check your spam folder.</span></Typography>
                    <Grid className="buttons">
                        <LoadingButton loading={loading} loadingPosition="start" variant="outlined" startIcon={<MdOutlineAutorenew/>} onClick={() => resendEmail()}>Resend Email</LoadingButton>
                        <Button variant="contained" startIcon={<MdLogin/>} onClick={() => navigate('/login')}>Login</Button>
                    </Grid>
                </Paper>
            </Container>
            <Snackbar open={successOpen} autoHideDuration={6000} onClose={() => setSuccessOpen(false)} sx={{ zIndex: 9999 }}>
                <Alert elevation={12} variant="filled" onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Successfully resent email to your inbox
                </Alert>
            </Snackbar>
            <Snackbar open={!!errorOpen.length} autoHideDuration={6000} onClose={() => setErrorOpen('')} sx={{ zIndex: 9999 }}>
                <Alert elevation={12} variant="filled" onClose={() => setSuccessOpen('')} severity="error" sx={{ width: '100%' }}>
                    { errorOpen }
                </Alert>
            </Snackbar>
        </Grid>
    )
}

export default EmailSent;