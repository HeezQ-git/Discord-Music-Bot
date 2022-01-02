import './EmailSent.scss';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { mailerService } from '../../services/mailer.service';

const EmailSent = () => {

    const delay = async ms => new Promise(res => setTimeout(res, ms));
    
    const { email } = useParams();
    const [disabled, setDisabled] = useState(false);
    const [btnStyle, setBtnStyle] = useState(null);

    const resendEmail = async () => {
        const res = await mailerService.sendEmail({ email: email });
        console.log(res);

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
                <div className="emailsent--text">
                    <h1>ACCOUNT ACTIVATION</h1>
                    <h2>A verification email has been sent to your inbox.</h2>
                    <h3>The e-mail address you have provided: <span className="emailsent-feature">{email}</span></h3>
                </div>
                <div className="emailsent--note">
                    <span className="red">Please note:</span>
                    <p>If you do not click the link your account will remain inactive.</p>
                </div>
                <p className="emailsent--smallnote">If you do not receive the email within a few minutes, please check your spam folder.</p>
                <div className="emailsent--buttons">
                    <div className="mdc-touch-target-wrapper">
                        <button style={btnStyle} onClick={() => resendEmail()} disabled={disabled === null || disabled === true ? true : false} className="mdc-button">
                            <span className="mdc-button__ripple"></span>
                            {disabled === true ? <span className="material-icons">done</span> : disabled === null ? <span className="material-icons">close</span> : <span className="material-icons">autorenew</span>}
                            <span className="mdc-button__label">RESEND EMAIL</span>
                        </button>
                    </div>
                    <div className="mdc-touch-target-wrapper">
                        <Link to={`/login/${email}`}><button className="mdc-button mdc-button--raised">
                            <span className="mdc-button__ripple"></span>
                            <span className="material-icons">login</span>
                            <span className="mdc-button__label">LOGIN</span>
                        </button></Link>
                    </div>
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