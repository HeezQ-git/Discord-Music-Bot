import './login.scss';
import Header from './../Header';
import React, { useState } from 'react';
import lockIcon from './../../img/icons/lock.png';
import { mailerService } from './../../services/mailer.service';
import { loginService } from './../../services/login.service';

const Login = () => {

    const [activeBtn, setActiveBtn] = useState('login');
    const [loginStyles, setLoginStyles] = useState({display: 'block'});
    const [regStyles, setRegStyles] = useState({display: 'none'});

    const [usernameStyles, setUsernameStyles] = useState(null);
    const [emailStyles, setEmailStyles] = useState(null);

    const choiceChange = type => {
        if (type === 'login') {
            setLoginStyles({display: 'block'});
            setRegStyles({display: 'none'});
        } else {
            setLoginStyles({display: 'none'});
            setRegStyles({display: 'block'});
        }
    }

    const emailLoginRef = React.createRef();
    const passwordLoginRef = React.createRef();
    
    const usernameRegisterRef = React.createRef();
    const emailRegisterRef = React.createRef();
    const passwordRegisterRef = React.createRef();
    const confirmPasswordRegisterRef = React.createRef();

    const checkEmail = () => {
        console.log(emailRegisterRef.current.value);
        const email = String(emailRegisterRef.current.value).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        console.log(email);
        if (!email) setEmailStyles('red-border')
        else setEmailStyles('green-border')
    }

    const login = () => {
        loginService.loginUser({ 
            email: emailLoginRef.current.value,
            password: passwordLoginRef.current.value,
        }).then((res) => {
            console.log(res);
        })
    }

    const register = () => {
        mailerService.newPendingUser({ 
            username: usernameRegisterRef.current.value,
            email: emailRegisterRef.current.value,
            password: passwordRegisterRef.current.value,
        }).then((res) => {
            console.log(res);
        })
    }

    return (
        <div className="Login-content">
            <Header></Header>
            <div className="login-form-content">
                <div className="login-inside">
                    <h1>Login form</h1>
                    <div className="choice-box">
                        <p><img src={lockIcon}></img>Your data is protected.</p>
                        <div className="choice">
                            <div className="choice-border">
                                <button onClick={() => {setActiveBtn('login'); choiceChange('login')}} className={`choice-login ${activeBtn === 'login' ? 'choice--active' : ''}`}>Login</button>
                                <button onClick={() => {setActiveBtn('reg'); choiceChange('reg')}} className={`choice-register ${activeBtn === 'reg' ? 'choice--active' : ''}`}>Register</button>
                            </div>
                        </div>
                    </div>
                    <div className="login-form" style={loginStyles}>
                        <div className="credentials">
                            <div className="login-box">
                                <p>E-mail address</p>
                                <input ref={emailLoginRef} placeholder="john.doe@gmail.com"></input>
                            </div>
                            <div className="login-box">
                                <p>Password</p>
                                <input ref={passwordLoginRef} placeholder="********" type="password"></input>
                            </div>
                        </div>
                        <p className="forgot-password">Forgot password?</p>
                        <button onClick={() => login()} className="login-button">Login</button>
                    </div>
                    <div className="register-form" style={regStyles}>
                        <div className="credentials">
                            <div className="reg-box">
                                <p>Username</p>
                                <input ref={usernameRegisterRef} className={usernameStyles} placeholder="John Doe"></input>
                            </div>
                            <div className="reg-box">
                                <p>E-mail address</p>
                                <input onChange={() => checkEmail()} className={emailStyles} ref={emailRegisterRef} placeholder="john.doe@gmail.com"></input>
                            </div>
                            <div className="reg-box">
                                <p>Password</p>
                                <input ref={passwordRegisterRef} placeholder="********" type="password"></input>
                            </div>
                            <div className="reg-box">
                                <p>Confirm password</p>
                                <input ref={confirmPasswordRegisterRef} placeholder="********" type="password"></input>
                            </div>
                        </div>
                        <button onClick={() => register()} className="reg-button">Register</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;