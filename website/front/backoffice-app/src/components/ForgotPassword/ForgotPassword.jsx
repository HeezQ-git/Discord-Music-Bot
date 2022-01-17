import './ForgotPassword.scss';
import { useParams } from 'react-router-dom';
import { MdOutlineEmail, MdDone, MdClose, MdErrorOutline } from 'react-icons/md'
import { FaDiscord } from 'react-icons/fa';
import { IoMdWarning } from 'react-icons/io';
import React, { useState, useEffect } from 'react';
import { mailerService } from '../../services/mailer.service';
import { accountService } from '../../services/account.service';
import { Link, useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';

import { LinearProgress } from "@react-md/progress";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Password from './../Password';

const ForgotPassword = (props) => {

    const delay = async ms => new Promise(res => setTimeout(res, ms));
    const { email, id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Forgot password
    const [inputClass, setInputClass] = useState(null);
    const [buttonInfo, setButtonInfo] = useState({ icon: 'email', msg: 'send', error: '', disabled: false });
    const [emailValue, setEmailValue] = useState('');

    // Reset password
    const [resetPassword, setResetPassword] = useState({ success: null, msg: '' });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStyles, setPasswordStyles] = useState({ pass: null, text: '', value: '', msg: '', suggestion: '', warning: '' });
    const [confirmPasswordStyles, setConfirmPasswordStyles] = useState({ pass: null, msg: '' });

    const sendEmail = async () => {
        if (!emailValue) return setInputClass(true);
        const email = String(emailValue).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!email) return setInputClass(true);
        setButtonInfo({ ...buttonInfo, disabled: true });
        setLoading(true);
        const res = await mailerService.sendForgetPassword({ email: emailValue });
        if (res.data.success) {
            setInputClass(false);
            setButtonInfo({ icon: 'ok', msg: 'sent', error: '', disabled: true });
        } else {
            setInputClass(true);
            setButtonInfo({ icon: 'email', msg: 'send', error: res.data.msg, disabled: false });
        };
        setLoading(false);
        await delay(5000);
        setButtonInfo({ icon: 'email', msg: 'send', error: res.data.msg, disabled: false });
    }

    const checkPassword = async () => {
        if (password.length < 8) return setPasswordStyles({pass: false, text: '', value: '', msg: '1', suggestion: '', warning: 'Minimum password length is 8 characters'});
        const res = zxcvbn(password);
        const strength = { 0: 'Terribly bad ❌', 1: 'Bad 🙁', 2: 'Weak 😕', 3: 'Good 👍', 4: 'Strong 💪' };
        if (Number(res.score) <= 2) setPasswordStyles({pass: false, text: strength[res.score], value: res.score, msg: '1', suggestion: res.feedback.suggestions[Math.floor(Math.random()*res.feedback.suggestions.length)], warning: res.feedback.warning});
        else setPasswordStyles({pass: true, text: strength[res.score], value: res.score, msg: '', suggestion: '', warning: ''});
        return (Number(res.score) > 2);
    }

    const checkConfirmPassword = async () => {
        if (!confirmPassword) return setConfirmPasswordStyles({ pass: false, msg: '' });
        if (confirmPassword != password) setConfirmPasswordStyles({ pass: false, msg: 'Passwords don\'t match' });
        else setConfirmPasswordStyles({ pass: true, msg: '' });
        return (confirmPassword === password);
    }

    const changePassword = async () => {
        const p1 = await checkPassword();
        const p2 = await checkConfirmPassword();
        if (p1 && p2) {
            setLoading(true);
            const res = await accountService.changePassword({ password: password, passwordResetId: id });
            if (res.data.success) {
                await delay(1000);
                navigate('/login');
            } else {
                setError(res.data.msg);
            }
            setLoading(false);
        }
    }

    useEffect(async () => {
        if (props.type != "reset") return;

        const res = await accountService.checkPasswordReset({ passwordResetId: id });
        setResetPassword({ success: res.data.success, msg: res.data.msg });
    }, [])

    return (
        <div className="ForgotPassword-content">
            {props.type === "forgot" ?
            <div className="forgotpassword-inside">
                {loading &&
                <div className="forgotpassword--loading">
                    <LinearProgress id='simple-linear-progress' /> 
                </div>}
                <div className="forgotpassword--title">
                    <h1 className="title">Forgot password?</h1>
                    <h2>Reset your password via email.</h2>
                </div>
                <div className="forgotpassword--credentials">
                    <div className={"input input-email " + (inputClass ? inputClass : '')}>
                        <TextField id="text-field-type-email" onChange={(event) => setEmailValue(event.currentTarget.value)} defaultValue={email != `null` ? email : ''} placeholder="Your e-mail" label="E-mail address"/>
                    </div>
                    {buttonInfo.error ?
                    <div className="error btn-gap">
                        <MdErrorOutline size="20"/>
                        {buttonInfo.error}
                    </div> : ''}
                    <Button disabled={buttonInfo.disabled} className="btn" onClick={() => sendEmail()} variant="contained" startIcon={buttonInfo.icon === 'email' || buttonInfo.icon === 'loading' ? <MdOutlineEmail/> : buttonInfo.icon === 'ok' ? <MdDone/> : <MdClose/>}>{buttonInfo.msg}</Button>
                </div>
                <div className="forgotpassword--info">
                    <h1>Logged in using <span>Google Account</span>?</h1>
                    <p>If you would like to set a password for your account, you can do it in your account settings!</p>
                </div>
            </div>
            : resetPassword.success != null ?
                <div className="forgotpassword-inside">
                    {loading &&
                    <div className="forgotpassword--loading">
                        <LinearProgress id='simple-linear-progress' /> 
                    </div>}
                    { resetPassword.success ? <div className="forgotpassword--title">
                        <h1>PASSWORD RESET</h1>
                        <h2>Fill in the fields below:</h2>
                        <div className="form">
                            <div className="password">
                                <Password className="medium-width" inputProps={{ maxLength: 24 }} required value={password} onChange={(event) => setPassword(event.currentTarget.value)} id={`text-field-type-password`} placeholder="New password" label="Password" error={passwordStyles.pass != null ? !passwordStyles.pass : false} />
                                {passwordStyles.msg.length > 0 ?
                                    <div className="tips">
                                        {passwordStyles.warning && <p className="warning">{passwordStyles.warning}</p>}
                                        <p className="suggestion">{passwordStyles.suggestion}</p>
                                    </div>
                                : ''}
                            </div>
                            <Password className="medium-width" inputProps={{ maxLength: 24 }} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.currentTarget.value)} id={`text-field-type-confirm`} placeholder="Confirm password" label="Confirm" error={confirmPasswordStyles.pass != null ? !confirmPasswordStyles.pass : false} />
                            
                            {confirmPasswordStyles.msg && <p className="error"><MdErrorOutline size="20"/>{confirmPasswordStyles.msg}</p>}
                            <Button onClick={() => changePassword()} variant="contained" startIcon={<MdDone/>}>Submit</Button>
                        </div>
                        {error && <p className="error"><MdErrorOutline size="20"/>{error}</p>}
                        <div className="warning">
                            <h2><IoMdWarning/> Warning!</h2>
                            <p>Once the password is changed, you will be logged out from all devices!</p>
                        </div>
                    </div> :
                    <div className="forgotpassword--title">
                        <div className="content">
                            <h1>PASSWORD RESET</h1>
                            <h2>Couldn't download password reset form.</h2>
                            <p>{resetPassword.msg}</p>
                        </div>
                        <div className="details">
                            <h3>Does this keep happening?</h3>
                            <p>Please contact support at our <Link to="/discord"><span><FaDiscord/>Discord server</span></Link> for further help.</p>
                        </div>
                    </div>}
                </div>
            : <div className="forgotpassword-loading">
                <div className="forgotpassword-loading--content">
                    <Typography type="headline-4">Loading content...</Typography>
                    <LinearProgress id='simple-linear-progress' /> 
                    {/* <LinearProgress id='simple-linear-progress' /> */}
                </div>
            </div>
            }
        </div>
    )
}

export default ForgotPassword;