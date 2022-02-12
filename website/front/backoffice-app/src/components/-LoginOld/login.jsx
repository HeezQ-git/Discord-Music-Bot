import './login.scss';
import React, { useState } from 'react';
import lockIcon from './../../img/icons/lock.png';
import { mailerService } from '../../services/mailer.service';
import { loginService } from '../../services/login.service';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FcGoogle, FcPrevious } from 'react-icons/fc';
import { GoogleLogin } from 'react-google-login';
import { MdErrorOutline, MdDone, MdClose, MdLogin } from 'react-icons/md'

import zxcvbn from 'zxcvbn';

import Loading from '../Loading';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { blue } from '@mui/material/colors';
import Input from './../Input';

const Login = () => {

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(true);
  
    return (
        <div className="Login-content">
            <div className="login-form-content">
                <Paper className="paper" elevation={8}>
                    {loading && <Loading/>}
                    <div className="login-inside">
                        <Typography variant="h4" sx={{ fontSize: '1.95rem' }} className="title">{form ? 'Login form' : 'Create an account'}</Typography>
                        <Typography variant="p" className="protected"><img src={lockIcon}></img>Your data is protected.</Typography>
                        {form ? <LoginForm setLoading={setLoading} form={form} setForm={setForm} /> : <RegisterForm setLoading={setLoading} form={form} setForm={setForm} />}
                    </div>
                </Paper>
            </div>
        </div>
    )
}

const LoginForm = ({ setLoading, form, setForm }) => {

    const { email } = useParams();
    const navigate = useNavigate();

    const [loginError, setLoginError] = useState(null);
    
    const [emailLogin, setEmailLogin] = useState(email || '');
    const [passwordLogin, setPasswordLogin] = useState('');

    const login = async () => {
        setLoading(true);

        const res = await loginService.loginUser({ 
            email: emailLogin,
            password: passwordLogin,
        })
        
        if (res.data.success) navigate(`/account/`)
        else setLoginError(res.data.msg);

        setLoading(false);
    }

    const responseGoogle = async (data) => {

        const res = await loginService.loginGoogleUser({
            email: data.profileObj.email,
            username: data.profileObj.name,
            imageUrl: data.profileObj.imageUrl,
            googleId: data.profileObj.googleId,
        });

        setLoginError(res.data.msg);
    }

    return (
        <div className="login-form">
            <div className="credentials">
                <div className="login-box">
                    <TextField required className="resize-box" id="text-field-type-email" onChange={(event) => setEmailLogin(event.currentTarget.value)} defaultValue={email ? `${email}` : null} placeholder="Your e-mail" label="E-mail address"/>
                </div>
                <div className="login-box">
                    <Input required onChange={(event) => setPasswordLogin(event.currentTarget.value)} onKeyDown={e => `${e.code}`.toLowerCase() === 'enter' && emailLogin.length > 0 && passwordLogin.length > 0 && login()} value={passwordLogin} id="outlined-adornment-password" inputProps={{ maxLength: 24 }} className="medium-width"/>
                </div>
            </div>
            <Link to={`/account/forgot_password/${emailLogin ? emailLogin : ''}`}><Box mt="5px"><Typography variant="p" color={blue[400]} className="forgot-password">Forgot password?</Typography></Box></Link>
            {loginError ? <div className="login-error error">
                <MdErrorOutline size={20}/>
                <Typography variant="p">{loginError}</Typography>
            </div> : ''}
            <div className="buttons-styling">
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
                    render={(renderProps) => (
                        <Box component="button" color="inherit" disabled={renderProps.disabled} onClick={renderProps.onClick} className="login-via">
                            <span><FcGoogle /></span>
                            <Typography variant="p" sx={{ fontSize: '1.1rem' }} className="google-text">Sign in with Google</Typography>
                        </Box>
                    )}
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy="single_host_origin"
                    />
                <div className="buttons">
                    <Button onClick={() => setForm(!form)}>Create account</Button>
                    <Button onClick={() => login()} variant="contained" startIcon={<MdLogin />}>Login</Button>
                </div>
            </div>
        </div>
    )
}

const RegisterForm = ({ setLoading, form, setForm}) => {

    const [canRegister, setCanRegister] = useState(false);

    const [usernameStyles, setUserStyles] = useState({ pass: false, style: null, msg: '' });
    const [emailStyles, setEmailStyles] = useState({pass: false, style: null, msg: ''});
    const [passwordStyles, setPasswordStyles] = useState({pass: false, style: null, value: "0", text: '', msg: '', suggestion: '', warning: ''});
    const [confirmPasswordStyles, setConfirmPasswordStyles] = useState({pass: false, style: null, msg: ''});
    
    const checkRegister = () => {
        if (usernameStyles.pass && emailStyles.pass && passwordStyles.pass && confirmPasswordStyles.pass) setCanRegister(true);
    }

    if (!canRegister) checkRegister();

    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [usernameRegister, setUsernameRegister] = useState('');
    const [emailRegister, setEmailRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [confirmPasswordRegister, setConfirmPasswordRegister] = useState('');

    const checkPassword = (password) => {
        if (!password) return setPasswordStyles({ pass: false, style: null, text: '', value: "0", msg: '', suggestion: '', warning: ''});
        if (password.length < 8) return setPasswordStyles({ pass: false, style: 'red-border', text: '', value: '', msg: '1', suggestion: '', warning: 'Minimum number of characters is 8'});
        
        const res = zxcvbn(password);
        const strength = { 0: 'Terribly bad ❌', 1: 'Bad 🙁', 2: 'Weak 😕', 3: 'Good 👍', 4: 'Strong 💪' };
        
        if (Number(res.score) <= 2) setPasswordStyles({ pass: false, style: 'red-border', text: strength[res.score], value: res.score, msg: '1', suggestion: res.feedback.suggestions[Math.floor(Math.random()*res.feedback.suggestions.length)], warning: res.feedback.warning });
        else setPasswordStyles({ pass: true, style: 'green-border', text: strength[res.score], value: res.score, msg: '', suggestion: '', warning: '' });
        if (confirmPasswordRegister) checkConfirmPassword();
    }

    const checkConfirmPassword = (password) => {
        if (!password) return setConfirmPasswordStyles({ pass: false, style: null, msg: '' });
        if (password != passwordRegister) setConfirmPasswordStyles({ pass: false, style: 'red-border', msg: 'Passwords don\'t match' });
        else setConfirmPasswordStyles({ pass: true, style: 'green-border', msg: '' });
    }

    const checkEmail = (ev) => {
        const emailReg = ev ? ev : emailRegister;
        if (!emailReg) return setEmailStyles({ pass: false, style: null, msg: '' });
        const email = String(emailReg).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!email) setEmailStyles({ pass: false, style: 'red-border', msg: 'Invalid email address'})
        else setEmailStyles({ pass: true, style: 'green-border', msg: '' })
    }

    const checkEmailDB = async () => {
        if (!emailRegister) return setEmailStyles({ pass: false, style: null, msg: '' });
        if (emailStyles.pass) {
            const res = await loginService.checkEmail({ email: emailRegister });
            
            if (res.data.success) {
                setEmailStyles({ pass: false, style: 'red-border', msg: 'This email is taken' });
            }
            else setEmailStyles({ pass: true, style: 'green-border', msg: '' });
            return !res.data.success;
        }
    }

    const checkUser = async (username) => {
        if (!username) return setUserStyles({ pass: false, style: null, msg: '' });
        if (username.length < 4) return setUserStyles({ pass: false, style: 'red-border', msg: 'Minimum number of characters is 4' });
        if (/^\d+$/.test(username)) return setUserStyles({ pass: false, style: 'red-border', msg: 'Name cannot consist of numbers only' });
        else setUserStyles({ pass: true, style: 'green-border', msg: '' });
        console.log(usernameStyles);
    }

    const checkUserDB = async (username) => {
        if (username.length <= 0) return;
        const res = await loginService.checkUser({ username: username });
        
        if (res.data.success) setUserStyles({ pass: false, style: 'red-border', msg: 'This username is taken' })
        else setUserStyles({ pass: true, style: 'green-border', msg: '' });
        return !res.data.success;
    }

    const register = async () => {
        if (canRegister) {
            const email = emailRegister;
            
            setLoading(true);
            checkPassword();
            checkConfirmPassword();
            
            const res = await mailerService.newPendingUser({ 
                username: usernameRegister,
                email: emailRegister,
                password: passwordRegister,
            });
            
            if (res.data.success) {
                navigate(`/account/email_sent/${email}`);
            }

            setLoading(false);
        }
    }

    const refreshPage = () => {
        navigate(`/login/${emailRegister}`);
        window.location.reload(false);
    };
    
    const prevStep = () => setStep(step-1);

    const nextStep = async () => {
        let res = false;

        setLoading(true);

        if (step === 1) res = await checkUserDB(usernameRegister)
        else res = await checkEmailDB()

        setLoading(false);

        if (!res) return;

        setStep(step+1);
    };

    return (
        <div className="register-form">
            <div className="credentials">
                {step === 1 && 
                    <div className="reg-box">
                        <Typography variant="p" className="iTip">Prodive your username below</Typography>
                        <TextField required onKeyDown={e => `${e.code}`.toLowerCase() === 'enter' && usernameStyles.pass && nextStep()} className="resize-box" maxLength={14} id="text-field-type-username" value={usernameRegister} onBlur={() => checkUserDB(usernameRegister)} onChange={(event) => {setUsernameRegister(event.currentTarget.value); checkUser(event.currentTarget.value)}} placeholder="Your username" label="Username" error={usernameStyles.msg.length > 0 ? true : false}/>
                        {usernameStyles.msg.length > 0 ? <div className="error">
                            <MdErrorOutline size={20}/>
                            <Typography variant="p" className="msg">{usernameStyles.msg}</Typography>
                        </div> : ''}
                        <div className="buttons-styling">
                            <div className="buttons">
                                <Button onClick={() => setForm(!form)}>Back</Button>
                                {usernameStyles.pass ?
                                <Button onClick={() => nextStep()} variant="contained" startIcon={<MdDone />}>Next</Button> :
                                <Button variant="contained" disabled startIcon={<MdClose />}>Next</Button>}
                            </div>
                        </div>
                    </div>
                }
                {step === 2 &&
                    <div className="reg-box">
                        <p className="iTip">Also provide your e-mail address</p>
                        <TextField required onInput={(e) => { setEmailRegister(e.target.value); checkEmail(e.target.value)}} onKeyDown={e => `${e.code}`.toLowerCase() === 'enter' && emailStyles.pass && nextStep()} className="resize-box" id="text-field-type-emailRegister" value={emailRegister} onBlur={() => checkEmailDB(passwordRegister)} placeholder="Your e-mail" label="E-mail address" error={emailStyles.msg.length > 0 ? true : false}/>
                        {emailStyles.msg.length > 0 ? <div className="error">
                            <MdErrorOutline size={20}/>
                            {emailStyles.msg.includes('taken') ? <span className="msg">{emailStyles.msg}! <span onClick={() => refreshPage()} className="login">Login?</span></span> : <span className="msg">{emailStyles.msg}</span>}
                        </div> : ''}
                        <div className="buttons-styling">
                            <div className="buttons">
                                <Button onClick={() => prevStep()}>Back</Button>
                                {emailStyles.pass ?
                                <Button onClick={() => nextStep()} variant="contained" startIcon={<MdDone />}>Next</Button> :
                                <Button variant="contained" disabled startIcon={<MdClose />}>Next</Button>}
                            </div>
                        </div>
                    </div>
                }
                {step === 3 && 
                    <div className="password-box">
                        <div className="reg-box">
                            <div className="password">
                                <div className="reg-box align-left">
                                    <Input val="password" required placeholder="Password"
                                        onChange={(event) => {setPasswordRegister(event.currentTarget.value); checkPassword(event.currentTarget.value)}}
                                        error={passwordStyles.msg.length > 0 ? true : false}
                                        onBlur={() => checkPassword(passwordRegister)}
                                        inputProps={{ maxLength: 24 }}
                                        value={passwordRegister}
                                        id="outlined-adornment-passwordRegister"
                                        className="medium-width" />
                                    <meter max={4} value={passwordStyles.value} className="meter"></meter>
                                    <p className="strength">{passwordStyles.text ? <p>{passwordStyles.text}</p> : ''}</p>
                                </div>
                                {passwordStyles.msg.length > 0 ?
                                    <div className="tips">
                                        <p className="warning">{passwordStyles.warning}</p>
                                        <p className="suggestion">{passwordStyles.suggestion}</p>
                                    </div>
                                : ''}
                            </div>
                        </div>
                        <div className="reg-box">
                            <Input val="password" required placeholder="Confirm password"
                                label="Confirm password"
                                onChange={(event) => {setConfirmPasswordRegister(event.currentTarget.value); checkConfirmPassword(event.currentTarget.value) }}
                                onKeyDown={e => `${e.code}`.toLowerCase() === 'enter' && passwordStyles.pass && confirmPasswordStyles.pass && register()}
                                error={confirmPasswordStyles.msg.length > 0 ? true : false}
                                onBlur={() => checkConfirmPassword(confirmPasswordRegister)}
                                inputProps={{ maxLength: 24 }}
                                value={confirmPasswordRegister}
                                className="medium-width"
                                id="outlined-adornment-confirmpass"
                                formClasses="margin-top-15 confirmpass" />
                            {confirmPasswordStyles.msg.length > 0 ? <div className="error">
                                <MdErrorOutline size={20}/>
                                <span className="msg">{confirmPasswordStyles.msg}</span>
                            </div> : ''}
                        </div>
                        <div className="buttons-styling">
                            <div className="buttons">
                                <Button onClick={() => prevStep()}>Back</Button>
                                {passwordStyles.pass && confirmPasswordStyles.pass ? 
                                    <Button variant="contained" onClick={() => register()} startIcon={<MdDone />}>Register</Button> :
                                    <Button variant="contained" disabled startIcon={<MdClose />}>Register</Button>}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Login;