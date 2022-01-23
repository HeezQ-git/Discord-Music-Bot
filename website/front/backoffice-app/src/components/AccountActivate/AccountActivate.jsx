import './AccountActivate.scss';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { accountService } from '../../services/account.service';
import { Link } from 'react-router-dom';
import { FaDiscord } from 'react-icons/fa';
import { MdLogin } from 'react-icons/md';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Loading from './../Loading';

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
            <div className="aa-content" style={{ height: activated === null ? '400px' : ''}}>
                <Paper className="paper" elevation={8}>
                    {activated != null ? !activated ?
                        <div className="approved">
                            <div className="approved-content">
                                <Typography variant="h4">ACCOUNT ACTIVATION</Typography>
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
                            </div>
                        </div>
                        :
                        <div className="denied">
                            <div className="denied-content">
                                <Typography variant="h4">ACCOUNT ACTIVATION</Typography>
                                <Typography variant="h5">Account Activation has failed!</Typography>
                                <div className="denied-info">
                                    <Typography variant="h6">INFO:</Typography>
                                    <Typography variant="p">{message}</Typography>
                                </div>
                                <div className="denied-box">
                                    <Typography variant="subtitle1"><span className="not-selectable">Given ID: </span>{id}</Typography>
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
                    : <div className="loading-box"> <Loading content/> </div>}
                </Paper>
            </div>
        </div>
    )
}

export default AccountActivate;