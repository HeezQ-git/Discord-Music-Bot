import './login.scss';
import React, { useState } from 'react';
import lockIcon from './../../img/icons/lock.png';
import { mailerService } from '../../services/mailer.service';
import { loginService } from '../../services/login.service';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FcGoogle, FcPrevious } from 'react-icons/fc';
import { GoogleLogin } from 'react-google-login';
import { MdErrorOutline, MdDone, MdClose, MdLogin } from 'react-icons/md'
import { LinearProgress } from "@react-md/progress";

import zxcvbn from 'zxcvbn';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Password, Form } from '@react-md/form';

const Login = () => {
    const { email } = useParams();

    const navigate = useNavigate();

    const [loginStyles, setLoginStyles] = useState({display: 'block'});
    const [regStyles, setRegStyles] = useState({display: 'none'});
    const [canRegister, setCanRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const [usernameStyles, setUserStyles] = useState({pass: false, style: null, msg: ''});
    const [emailStyles, setEmailStyles] = useState({pass: false, style: null, msg: ''});
    const [passwordStyles, setPasswordStyles] = useState({pass: false, style: null, value: "0", text: '', msg: '', suggestion: '', warning: ''});
    const [confirmPasswordStyles, setConfirmPasswordStyles] = useState({pass: false, style: null, msg: ''});

    const choiceChange = type => {
        if (type === 'login') {
            setLoginStyles({display: 'block'});
            setRegStyles({display: 'none'});
        } else {
            setLoginStyles({display: 'none'});
            setRegStyles({display: 'block'});
        }
    }

    const [step, setStep] = useState(1);
    const [canNextStep, setCanNextStep] = useState(false);

    const [usernameRegister, setUsernameRegister] = useState('');
    const [emailRegister, setEmailRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [confirmPasswordRegister, setConfirmPasswordRegister] = useState('');

    const [emailLogin, setEmailLogin] = useState(email || '');
    const [passwordLogin, setPasswordLogin] = useState('');

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
    }

    const checkUserDB = async (username) => {
        const res = await loginService.checkUser({ username: username });
        
        if (res.data.success) setUserStyles({ pass: false, style: 'red-border', msg: 'This username is taken' })
        else setUserStyles({ pass: true, style: 'green-border', msg: '' });
        return !res.data.success;
    }

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
        }
    }

    const checkRegister = () => {
        if (usernameStyles.pass && emailStyles.pass && passwordStyles.pass && confirmPasswordStyles.pass) setCanRegister(true);
    }

    if (!canRegister) checkRegister();

    const login = async () => {
        const res = await loginService.loginUser({ 
            email: emailLogin,
            password: passwordLogin,
        })
        
        if (res.data.success) {

        } else {
            setLoginError(res.data.msg);
        }
    }

    const refreshPage = () => {
        navigate(`/login/${emailRegister}`);
        window.location.reload(false);
    };

    const responseGoogle = async (data) => {

        const res = await loginService.loginGoogleUser({
            email: data.profileObj.email,
            username: data.profileObj.name,
            imageUrl: data.profileObj.imageUrl,
            googleId: data.profileObj.googleId,
        });

        setLoginError(res.data.msg);
    }

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
        <div className="Login-content">
            <div className="login-form-content">
                {loading ?
                    <div className="loading">
                        <LinearProgress id='simple-linear-progress' /> 
                    </div>
                : ''}
                <div className={`login-inside`}>
                    <h1>Login form</h1>
                    <p className="protected"><img src={lockIcon}></img>Your data is protected.</p>
                    <div className="login-form" style={loginStyles}>
                        <div className="credentials">
                            <Form>
                                <div className="login-box">
                                    <TextField required className="resize-box" id="text-field-type-email" onChange={(event) => setEmailLogin(event.currentTarget.value)} defaultValue={email ? `${email}` : ''} placeholder="Your e-mail" label="E-mail address"/>
                                </div>
                                <div className="login-box">
                                    <Password className="password resize-box" required maxLength="24" id="text-field-type-password" onChange={(event) => setPasswordLogin(event.currentTarget.value)} placeholder="Your password" label="Password"/>
                                </div>
                            </Form>
                        </div>
                        <Link to={`/account/forgot_password/${emailLogin ? emailLogin : ''}`}><p className="forgot-password">Forgot password?</p></Link>
                        {loginError ? <div className="login-error error">
                            <MdErrorOutline size={20}/>
                            <p>{loginError}</p>
                        </div> : ''}
                        <div className="buttons-styling">
                            <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
                                render={(renderProps) => (
                                    <button type="button" disabled={renderProps.disabled} onClick={renderProps.onClick} className="login-via">
                                        <span><FcGoogle /></span>
                                        <p>Sign in with Google</p>
                                    </button>
                                )}
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                cookiePolicy="single_host_origin"
                                />
                            <div className="buttons">
                                <Button onClick={() => choiceChange('reg')}>Create account</Button>
                                <Button onClick={() => login()} variant="contained" startIcon={<MdLogin />}>Login</Button>
                            </div>
                        </div>
                    </div>
                    <div className="register-form" style={regStyles}>
                        <div className="credentials">
                            {step === 1 && 
                                <div className="reg-box">
                                    <p className="iTip">Prodive your username below</p>
                                    <TextField required onKeyDown={e => `${e.code}`.toLowerCase() === 'enter' && usernameStyles.pass && nextStep()} className="resize-box" maxLength={14} id="text-field-type-username" value={usernameRegister} onBlur={() => checkUserDB(usernameRegister)} onChange={(event) => {setUsernameRegister(event.currentTarget.value); checkUser(event.currentTarget.value)}} placeholder="Your username" label="Username" error={usernameStyles.msg.length > 0 ? true : false}/>
                                    {usernameStyles.msg.length > 0 ? <div className="error">
                                        <MdErrorOutline size={20}/>
                                        <span className="msg">{usernameStyles.msg}</span>
                                    </div> : ''}
                                    <div className="buttons-styling">
                                        <div className="buttons">
                                            <div className="mdc-touch-target-wrapper">
                                                <button onClick={() => choiceChange('login')} className="mdc-button btn-gap">
                                                    <span className="mdc-button__ripple"></span>
                                                    <span className="mdc-button__label">Back</span>
                                                </button>
                                            </div>
                                            
                                            {usernameStyles.pass ? <div className="mdc-touch-target-wrapper">
                                                <button onClick={() => nextStep()} className="mdc-button mdc-button--raised btn-gap">
                                                    <span className="mdc-button__ripple"></span>
                                                    <MdDone size={20}/>
                                                    <span className="mdc-button__label">Next</span>
                                                </button>
                                            </div> : 
                                            
                                            <div className="mdc-touch-target-wrapper">
                                                <button disabled className="mdc-button mdc-button--raised btn-gap">
                                                    <span className="mdc-button__ripple"></span>
                                                    <MdClose size={20}/>
                                                    <span className="mdc-button__label">Next</span>
                                                </button>
                                            </div>
                                            }
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
                                        <div className="mdc-touch-target-wrapper">
                                                <button onClick={() => prevStep()} className="mdc-button btn-gap">
                                                    <span className="mdc-button__ripple"></span>
                                                    <span className="mdc-button__label">Back</span>
                                                </button>
                                            </div>
                                            
                                            {emailStyles.pass ? <div className="mdc-touch-target-wrapper">
                                                <button onClick={() => nextStep()} className="mdc-button mdc-button--raised btn-gap">
                                                    <span className="mdc-button__ripple"></span>
                                                    <MdDone size={20}/>
                                                    <span className="mdc-button__label">Next</span>
                                                </button>
                                            </div> : <div className="mdc-touch-target-wrapper">
                                                <button disabled className="mdc-button mdc-button--raised btn-gap">
                                                    <span className="mdc-button__ripple"></span>
                                                    <MdClose size={20}/>
                                                    <span className="mdc-button__label">Next</span>
                                                </button>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            }
                            {step === 3 && 
                                <div className="password-box">
                                    <div className="reg-box">
                                        <div className="password">
                                            <div>
                                                <Password required className="resize-box" maxLength={24} id="text-field-type-passwordregister" value={passwordRegister} onBlur={() => checkPassword(passwordRegister)} onChange={async (event) => {setPasswordRegister(event.currentTarget.value); checkPassword(event.currentTarget.value)}} placeholder="Your password" label="Password" error={passwordStyles.msg.length > 0 ? true : false}/>
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
                                        <Password required onKeyDown={e => `${e.code}`.toLowerCase() === 'enter' && passwordStyles.pass && confirmPasswordStyles.pass && register()} className="resize-box confirmpass" maxLength={24} id="text-field-type-confirmpassword" value={confirmPasswordRegister} onBlur={() => checkConfirmPassword(confirmPasswordRegister)} onChange={(event) => {setConfirmPasswordRegister(event.currentTarget.value); checkConfirmPassword(event.currentTarget.value) }} placeholder="Confirm password" label="Confirm password" error={confirmPasswordStyles.msg.length > 0 ? true : false}/>
                                        {confirmPasswordStyles.msg.length > 0 ? <div className="error">
                                            <MdErrorOutline size={20}/>
                                            <span className="msg">{confirmPasswordStyles.msg}</span>
                                        </div> : ''}
                                    </div>
                                    <div className="buttons-styling">
                                        <div className="buttons">
                                            <div className="mdc-touch-target-wrapper">
                                                <button onClick={() => prevStep()} className="mdc-button btn-gap">
                                                    <span className="mdc-button__ripple"></span>
                                                    <span className="mdc-button__label">Back</span>
                                                </button>
                                            </div>
                                            {passwordStyles.pass && confirmPasswordStyles.pass ? <div className="mdc-touch-target-wrapper">
                                                <button onClick={() => register()} className="mdc-button mdc-button--raised btn-gap">
                                                    <span className="mdc-button__ripple"></span>
                                                    <MdDone size={20}/>
                                                    <span className="mdc-button__label">Register</span>
                                                </button>
                                            </div> : <div className="mdc-touch-target-wrapper">
                                                <button disabled className="mdc-button mdc-button--raised btn-gap">
                                                    <span className="mdc-button__ripple"></span>
                                                    <MdClose size={20}/>
                                                    <span className="mdc-button__label">Register</span>
                                                </button>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;