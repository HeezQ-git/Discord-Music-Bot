import './AccountActivate.scss';
import Header from '../Header';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { accountService } from './../../services/account.service';
import { Link } from 'react-router-dom';
import loader from './../../img/loader.svg';

const AccountActivate = () => {
    
    const [activated, setActivated] = useState(null);
    const [message, setMessage] = useState('');
    const { id } = useParams();

    const tryActivate = (id) => {
        if (id) {
            accountService.activateAccount({ id })
            .then(res => {
                if (res.data.success) setActivated(true)
                else {
                    setActivated(false);
                    setMessage(res.data.msg);
                };
            })
        } else {
            setActivated(false);
        }
    }

    useEffect(() => tryActivate(id), [tryActivate]);

    return (
        <div className="AccountActivate-content">
            <Header></Header>
            <div className="aa-content">
                {activated != null ? activated ?
                    <div className="approved">
                        <div className="approved-content">
                            <h1>ACCOUNT ACTIVATION</h1>
                            <h2>Your account was successfully activated!</h2>
                            <p>You can now login to your account.</p>
                            <div className="approved-buttons">
                                <div className="mdc-touch-target-wrapper">
                                    <Link to="/"><button className="mdc-button">
                                        <span className="mdc-button__ripple"></span>
                                        <span className="mdc-button__label">HOME</span>
                                    </button></Link>
                                </div>
                                <div className="mdc-touch-target-wrapper">
                                    <Link to="/login"><button className="mdc-button mdc-button--raised mdc-button--leading">
                                        <span className="mdc-button__ripple"></span>
                                        <div className="btn-gap">
                                            <span class="material-icons">login</span>
                                            <span className="mdc-button__label">LOGIN</span>
                                        </div>
                                    </button></Link>
                                </div>
                            </div>
                            <div className="approved-bottom-text">
                                <p>Best regards,</p>
                                <p>Tournament Team</p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="denied">
                        <div className="denied-content">
                            <h1>ACCOUNT ACTIVATION</h1>
                            <h2>Account Activation has failed!</h2>
                            <div className="denied-info">
                                <h1>INFO:</h1>
                                <p>{message}</p>
                            </div>
                            <div className="denied-box">
                                <h3><span className="not-selectable">Given ID: </span>{id}</h3>
                                <div className="tooltip">It is not the first time this has happened?
                                    <span className="tooltiptext">Contact the developer via Discord with the above ID</span>
                                </div>
                            </div>
                            <div className="denied-buttons">
                                <div className="mdc-touch-target-wrapper">
                                    <Link to="/"><button className="mdc-button">
                                        <span className="mdc-button__ripple"></span>
                                        <span className="mdc-button__label">HOME</span>
                                    </button></Link>
                                </div>
                                <div className="mdc-touch-target-wrapper">
                                    <Link to="/discord"><button className="mdc-button mdc-button--raised mdc-button--leading">
                                        <span className="mdc-button__ripple"></span>
                                        <div className="btn-gap">
                                            <i className="fab fa-discord"></i>
                                            <span className="mdc-button__label">DISCORD</span>
                                        </div>
                                    </button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                : 
                <div className="loading">
                    <img src={loader}></img>
                    <h1>Loading content...</h1>
                </div>}
            </div>
        </div>
    )
}

export default AccountActivate;