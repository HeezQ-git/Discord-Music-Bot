import './EmailSent.scss';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { mailerService } from '../../services/mailer.service';
import { MdAutorenew, MdLogin, MdClose, MdDone } from 'react-icons/md';

import Loading from './../Loading';
import Button from '@mui/material/Button';

const EmailSent = () => {

    const delay = async ms => new Promise(res => setTimeout(res, ms));
    
    const { email } = useParams();
    const [disabled, setDisabled] = useState(false);
    const [btnStyle, setBtnStyle] = useState(null);
    const [loading, setLoading] = useState(false);

    const resendEmail = async () => {
        setLoading(true);
        const res = await mailerService.sendEmail({ email: email });
        setLoading(false);

        let color;
        if (res.data.success) {
            color = '#0F9D58';
            setDisabled(true);
            setBtnStyle({ color: color });
            await delay(30000);
        } else {
            color = '#DB4437';
            setDisabled(null);
            setBtnStyle({ color: color });
            await delay(5000);
        };
        setBtnStyle(null);
        setDisabled(false);
    }

    return (
        <div className="EmailSent-content">
            <div className="emailsent-inside">
                {loading && <Loading/>}
                <div className="emailsent--text">
                    <h1>ACCOUNT ACTIVATION</h1>
                    <h2>A verification email has been sent to your inbox.</h2>
                    <h3>The e-mail address you have provided: <span className="emailsent-feature">{email}</span></h3>
                </div>
                <div className="emailsent--note">
                    <span className="red">Please note:</span>
                    <p>If you do not click the link your account will remain inactive.</p>
                </div>
                <p className="emailsent--smallnote">Didn't receive email within a few minutes? Check your spam folder.</p>
                <div className="emailsent--buttons">
                    <Button style={btnStyle} onClick={() => resendEmail()} disabled={disabled === null || disabled === true ? true : false} startIcon={disabled === true ? <MdDone/> : disabled === null ? <MdClose/> : <MdAutorenew/>}>Resend email</Button>
                    <Link to={`/login/${email}`}><Button variant="contained" startIcon={<MdLogin/>}>Login</Button></Link>
                </div>
                <div className="emailsent--bottom-text">
                    <p>Best regards,</p>
                    <p>Tournament Team</p>
                </div>
            </div>
        </div>
    )
}

export default EmailSent;