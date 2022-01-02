import './header.scss';
import logo from './../../images/logo.png';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

const Header = () => {
    const [hamburgerClass, setHamburgerClass] = useState(['hamburger--box1']);
    const [navButtons, setNavButtons] = useState(['navbuttons']);

    const hamburgerRef = React.createRef();

    const hamburgerClick = () => {
        if (hamburgerClass.includes('hamburger--active')) hamburgerClass.splice(1, 1)
        else hamburgerClass.push('hamburger--active');
        const newHam = [...hamburgerClass];
        setHamburgerClass(newHam);

        if (navButtons.includes('navbuttons--active')) navButtons.splice(1, 1)
        else navButtons.push('navbuttons--active');
        const newNav = [...navButtons];
        setNavButtons(newNav);
    };
 
    return (
        <div className="Header-content">
            <div className="header-inside-content">
                <img src={logo} className="logo"></img>
                <div className={hamburgerClass.join(' ')} ref={hamburgerRef} onClick={() => hamburgerClick()}>
                    <button className="hamburger">
                        <span className="hamburger--box"></span>
                        <span className="hamburger--inner"></span>
                    </button>
                </div>
                <div className="buttons">
                    <Link to="/"><button className="button">HOME</button></Link>
                    <Link to="/songlist"><button className="button">SONG LIST</button></Link>
                    <Link to="/login"><button className="button">LOGIN</button></Link>
                    <Link to="/discord"><button className="button">DISCORD</button></Link>
                </div>
            </div>
            <div className={navButtons.join(' ')}>
                <div className="buttons">
                    <Link to="/"><button onClick={() => hamburgerClick()} className="button">HOME</button></Link>
                    <Link to="/songlist"><button onClick={() => hamburgerClick()} className="button">SONG LIST</button></Link>
                    <Link to="/login"><button onClick={() => hamburgerClick()} className="button">LOGIN</button></Link>
                    <Link to="/discord"><button onClick={() => hamburgerClick()} className="button">DISCORD</button></Link>
                </div>
            </div>
        </div>
    )
}

export default Header;