import './AccountActivate.scss';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { accountService } from '../../services/account.service';
import { Link } from 'react-router-dom';
import { FaDiscord } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
// import loader from './../../img/loader.svg';
import Button from '@mui/material/Button';
import { LinearProgress } from "@react-md/progress";

const AccountActivate = () => {
    
    const [activated, setActivated] = useState(null);
    const [message, setMessage] = useState('');
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            accountService.activateAccount({ id: id })
            .then(res => {
                console.log(res);
                if (res.data.success) setActivated(true)
                else {
                    setActivated(false);
                    setMessage(res.data.msg);
                };
            })
        }
    }, []);

    return (
        <div className="AccountActivate-content">
            <div className="aa-content">
                {activated != null ? activated ?
                    <div className="approved">
                        <div className="approved-content">
                            <h1>ACCOUNT ACTIVATION</h1>
                            <h2>Your account was successfully activated!</h2>
                            <p>You can now login to your account.</p>
                            <div className="approved-buttons">
                                <div className="mdc-touch-target-wrapper">
                                    <Link to="/"><Button>Home</Button></Link>
                                </div>
                                <div className="mdc-touch-target-wrapper">
                                    <Link to="/login"><Button variant="contained" startIcon={<MdLogin/>}>Login</Button></Link>
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
                                    <Link to="/"><Button>Home</Button></Link>
                                </div>
                                <div className="mdc-touch-target-wrapper">
                                    <Link to="/discord"><Button variant="contained" startIcon={<FaDiscord/>}>Discord</Button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                : 
                <div className="loading">
                    <LinearProgress id='simple-linear-progress' /> 
                </div>}
            </div>
        </div>
    )
}

export default AccountActivate;