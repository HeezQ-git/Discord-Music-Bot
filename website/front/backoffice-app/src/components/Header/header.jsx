import './header.scss';
import logo from './../../images/logo.png';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { grey } from '@mui/material/colors';
import { Typography } from '@mui/material';

const Header = ({ theme }) => {
    const [hamburgerClass, setHamburgerClass] = useState(['hamburger--box1']);
    const [navButtons, setNavButtons] = useState(['navbuttons']);
    const hamburgerRef = React.createRef();
    const textColor = theme ? grey[300] : grey[800];

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

    const styles = {
        color: textColor,
        "&:hover": {
            background: !theme ? '#0abcf9 !important' : ''
        },
        "&:focus-within": {
            background: !theme ? '#0abcf9 !important' : ''
        }
    }

    const hamStyles = {
        background: !theme ? '#000 !important' : '',
        "&::before": {
            background: !theme ? '#000 !important' : '',
        },
        "&::after": {
            background: !theme ? '#000 !important' : '',
        },
    }
 
    return (
        <div className="Header-content">
            <Paper elevation={8}>
                <div className="header-inside-content">
                    <img src={logo} className="logo"></img>
                    <div className={hamburgerClass.join(' ')} ref={hamburgerRef} onClick={() => hamburgerClick()}>
                        <Typography component="button" className="hamburger">
                            <Typography component="span" className="hamburger--box"></Typography>
                            <Typography component="span" sx={hamStyles} className="hamburger--inner"></Typography>
                        </Typography>
                    </div>
                    <div className="buttons">
                        <Link to="/"><Typography className="button" component="button" variant="p" sx={styles}>HOME</Typography></Link>
                        <Link to="/songlist"><Typography className="button" component="button" variant="p" sx={styles}>SONG LIST</Typography></Link>
                        <Link to="/login"><Typography className="button" component="button" variant="p" sx={styles}>LOGIN</Typography></Link>
                        <Link to="/discord"><Typography className="button" component="button" variant="p" sx={styles}>DISCORD</Typography></Link>
                    </div>
                </div>
                <div className={navButtons.join(' ')}>
                    <div className="buttons">
                        <Link to="/"><Typography onClick={() => hamburgerClick()} className="button" component="button" variant="p" sx={styles}>HOME</Typography></Link>
                        <Link to="/songlist"><Typography onClick={() => hamburgerClick()} className="button" component="button" variant="p" sx={styles}>SONG LIST</Typography></Link>
                        <Link to="/login"><Typography onClick={() => hamburgerClick()} className="button" component="button" variant="p" sx={styles}>LOGIN</Typography></Link>
                        <Link to="/discord"><Typography onClick={() => hamburgerClick()} className="button" component="button" variant="p" sx={styles}>DISCORD</Typography></Link>
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default Header;