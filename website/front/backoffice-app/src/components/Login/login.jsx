import './login.scss';
import React, { useState } from 'react';
import lockIcon from './../../img/icons/lock.png';
import { mailerService } from '../../services/mailer.service';
import { loginService } from '../../services/login.service';
import { useNavigate, useParams, Link } from 'react-router-dom';
import loader from './../../img/loader.svg';
import { FcGoogle } from 'react-icons/fc';
import { GoogleLogin } from 'react-google-login';
import zxcvbn from 'https://cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.2.0/zxcvbn.js';
import { MdErrorOutline } from 'react-icons/md'

import { TextField, Password, Form } from '@react-md/form';

const Login = () => {
    const { email } = useParams();

    const navigate = useNavigate();

    const [activeBtn, setActiveBtn] = useState('login');
    const [loginStyles, setLoginStyles] = useState({display: 'block'});
    const [regStyles, setRegStyles] = useState({display: 'none'});
    const [canRegister, setCanRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [emailValue, setEmailValue] = useState(null);

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
    const [usernameRegister, setUsernameRegister] = useState('');
    const [emailRegister, setEmailRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [confirmPasswordRegister, setConfirmPasswordRegister] = useState('');

    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    
    const confirmPasswordRegisterRef = React.createRef();

    const checkEmail = () => {
        if (!emailRegister) return setEmailStyles({ pass: false, style: null, msg: '' });
        const email = String(emailRegister).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
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
        }
    }

    const checkUser = async () => {
        if (!usernameRegister) return setUserStyles({ pass: false, style: null, msg: '' });
        if (usernameRegister.length < 4) return setUserStyles({ pass: false, style: 'red-border', msg: 'Minimum number of characters is 4' });
        if (/^\d+$/.test(usernameRegister)) return setUserStyles({ pass: false, style: 'red-border', msg: 'Name cannot consist of numbers only' });
        const res = await loginService.checkUser({ username: usernameRegister });
        if (res.data.success) setUserStyles({ pass: false, style: 'red-border', msg: 'This username is taken' })
        else setUserStyles({ pass: true, style: 'green-border', msg: '' });
    }

    const checkPassword = () => {
        if (!passwordRegister) return setPasswordStyles({pass: false, style: null, text: '', value: "0", msg: '', suggestion: '', warning: ''});
        if (passwordRegister.length < 8) return setPasswordStyles({pass: false, style: 'red-border', text: '', value: '', msg: '1', suggestion: '', warning: 'Minimum number of characters is 8'});
        const res = zxcvbn(passwordRegister);
        const strength = { 0: 'Terribly bad ❌', 1: 'Bad 🙁', 2: 'Weak 😕', 3: 'Good 👍', 4: 'Strong 💪' };
        if (Number(res.score) <= 2) setPasswordStyles({pass: false, style: 'red-border', text: strength[res.score], value: res.score, msg: '1', suggestion: res.feedback.suggestions[Math.floor(Math.random()*res.feedback.suggestions.length)], warning: res.feedback.warning});
        else setPasswordStyles({pass: true, style: 'green-border', text: strength[res.score], value: res.score, msg: '', suggestion: '', warning: ''});
        if (confirmPasswordRegisterRef.current.value) checkConfirmPassword();
    }

    const checkConfirmPassword = () => {
        if (!confirmPasswordRegisterRef.current.value) return setConfirmPasswordStyles({ pass: false, style: null, msg: '' });
        if (confirmPasswordRegisterRef.current.value != passwordRegister) setConfirmPasswordStyles({ pass: false, style: 'red-border', msg: 'Passwords don\'t match' });
        else setConfirmPasswordStyles({ pass: true, style: 'green-border', msg: '' });
    }

    const register = async () => {
        if (canRegister) {
            const email = emailRegister.current.value;
            setLoading(true);
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
        navigate(`/login/${emailRegister.current.value}`);
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

    return (
        <div className="Login-content">
            <div style={activeBtn === 'login' ? {height: '475px'} : {minHeight: '550px', maxHeight: '700px'}} className="login-form-content">
                {loading ?
                    <div className="loading">
                        <img src={loader}></img>
                        <h1>Loading content...</h1>
                    </div>
                : ''}
                <div className={`login-inside ${loading ? 'blur' : ''}`}>
                    <h1>Login form</h1>
                    <p className="protected"><img src={lockIcon}></img>Your data is protected.</p>
                    <div className="login-form" style={loginStyles}>
                        <div className="credentials">
                            <Form>
                                <div className="login-box">
                                    <TextField required id="text-field-type-email" value={emailLogin} onChange={(event) => setEmailLogin(event.currentTarget.value)} defaultValue={email != `null` ? email : ''} placeholder="Your e-mail" label="E-mail address"/>
                                </div>
                                <div className="login-box">
                                    <Password className="password" required maxLength="24" id="text-field-type-password" onChange={(event) => setPasswordLogin(event.currentTarget.value)} placeholder="Your password" label="Password"/>
                                </div>
                            </Form>
                        </div>
                        <Link to={`/account/forgot_password/${emailValue ? emailValue : ''}`}><p className="forgot-password">Forgot password?</p></Link>
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
                                <div className="mdc-touch-target-wrapper">
                                    <button onClick={() => {setActiveBtn('reg'); choiceChange('reg')}} className="mdc-button btn-gap">
                                        <span className="mdc-button__ripple"></span>
                                        <span className="mdc-button__label">Create account</span>
                                    </button>
                                </div>
                                <div className="mdc-touch-target-wrapper">
                                    <button onClick={() => login()} className="mdc-button mdc-button--raised btn-gap">
                                        <span className="mdc-button__ripple"></span>
                                        <span className="material-icons">login</span>
                                        <span className="mdc-button__label">Login</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="register-form" style={regStyles}>
                        <div className="credentials">
                            <div className="reg-box">
                                <TextField required maxLength={14} id="text-field-type-username" value={usernameRegister} onBlur={() => checkUser()} onChange={(event) => setUsernameRegister(event.currentTarget.value)} placeholder="Your username" label="Username" error={usernameStyles.msg.length > 0 ? true : false}/>
                                {usernameStyles.msg.length > 0 ? <div className="btn-gap">
                                    <MdErrorOutline size={20}/>
                                    <span className="msg">{usernameStyles.msg}</span>
                                </div> : ''}
                            </div>
                            <div className="reg-box">
                                <TextField required id="text-field-type-emailRegister" value={emailRegister} onBlur={() => checkEmailDB()} onChange={(event) => { setEmailRegister(event.currentTarget.value); checkEmail() }} placeholder="Your e-mail" label="E-mail address" error={emailStyles.msg.length > 0 ? true : false}/>
                                {emailStyles.msg.length > 0 ? <div className="btn-gap">
                                    <MdErrorOutline size={20}/>
                                    {emailStyles.msg.includes('taken') ? <span className="msg">{emailStyles.msg}! <span onClick={() => refreshPage()} className="login">Login?</span></span> : <span className="msg">{emailStyles.msg}</span>}
                                </div> : ''}
                            </div>
                            <div className="reg-box">
                                <div className="password">
                                    <div>
                                        <Password required maxLength={24} id="text-field-type-password" value={passwordRegister} onBlur={() => checkPassword()} onChange={(event) => setPasswordRegister(event.currentTarget.value)} placeholder="Your password" label="Password" error={passwordStyles.msg.length > 0 ? true : false}/>
                                        {/* <p>Password</p>
                                        <input maxLength="24" onChange={() => checkPassword()} className={passwordStyles.style} ref={passwordRegisterRef} placeholder="********" type="password" required></input> */}
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
                                <p>Confirm password</p>
                                <input onChange={() => checkConfirmPassword()} className={confirmPasswordStyles.style} ref={confirmPasswordRegisterRef} placeholder="********" type="password" required></input>
                                {confirmPasswordStyles.msg.length > 0 ? <div className="btn-gap">
                                    <MdErrorOutline size={20}/>
                                    <span className="msg">{confirmPasswordStyles.msg}</span>
                                </div> : ''}
                            </div>
                        </div>
                        <div className="buttons">
                            <div className="mdc-touch-target-wrapper">
                                <button onClick={() => {setActiveBtn('login'); choiceChange('login')}} className="mdc-button btn-gap">
                                    <span className="mdc-button__ripple"></span>
                                    <span className="mdc-button__label">Back</span>
                                </button>
                            </div>
                            
                            {canRegister ? <div className="mdc-touch-target-wrapper">
                                <button onClick={() => register()} className="mdc-button mdc-button--raised btn-gap">
                                    <span className="mdc-button__ripple"></span>
                                    <span className="material-icons">done</span>
                                    <span className="mdc-button__label">Register</span>
                                </button>
                            </div> : <div className="mdc-touch-target-wrapper">
                                <button disabled className="mdc-button mdc-button--raised btn-gap">
                                    <span className="mdc-button__ripple"></span>
                                    <span className="material-icons">close</span>
                                    <span className="mdc-button__label">Register</span>
                                </button>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;