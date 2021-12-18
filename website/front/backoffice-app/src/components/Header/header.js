import './header.scss';
import logo from './../../images/logo.png';
import { Link } from 'react-router-dom';

const header = () => {
    return (
        <div className="Header-content">
            <img src={logo} className="logo"></img>
            <div className="buttons">
                <Link to="/"><button className="button">HOME</button></Link>
                <Link to="/songlist"><button className="button">SONG LIST</button></Link>
                <Link to="/"><button className="button">LOGIN</button></Link>
                <Link to="/"><button className="button">DISCORD</button></Link>
            </div>
        </div>
    )
}

export default header;