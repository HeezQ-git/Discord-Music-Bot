import "./Header.scss";
import logo from "./../../images/logo.png";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import {
    Paper,
    Grid,
    Typography,
    Box,
    Menu,
    MenuItem,
    Fade,
    Divider,
    ListItemIcon,
} from "@mui/material";
import UserAvatar from "../UserAvatar";
import {
    MdArrowDropDown,
    MdLogout,
    MdOutlineDashboard,
    MdPerson,
    MdSettings,
} from "react-icons/md";
import { loginService } from "../../services/login.service";

const Header = ({ theme }) => {
    const navigate = useNavigate();
    const [logged, setLogged] = useState({ logged: false, user: "" });

    const [cookies, setCookie, removeCookie] = useCookies(["token"]);

    const [hamburgerClass, setHamburgerClass] = useState(["hamburger--box1"]);
    const [navButtons, setNavButtons] = useState(["navbuttons"]);
    const hamburgerRef = React.createRef();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const hamburgerClick = () => {
        if (hamburgerClass.includes("hamburger--active"))
            hamburgerClass.splice(1, 1);
        else hamburgerClass.push("hamburger--active");
        setHamburgerClass([...hamburgerClass]);

        if (navButtons.includes("navbuttons--active")) navButtons.splice(1, 1);
        else navButtons.push("navbuttons--active");
        setNavButtons([...navButtons]);
    };

    const hamStyles = {
        background: !theme ? "#000 !important" : "",
        "&::before": {
            background: !theme ? "#000 !important" : "",
        },
        "&::after": {
            background: !theme ? "#000 !important" : "",
        },
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        loginService.checkSession({ token: cookies["token"] }).then((res) => {
            if (res.data.success) {
                setLogged({
                    ...logged,
                    logged: true,
                    user: res.data.user.username,
                    component: (
                        <UserAvatar
                            username={res.data.user.username}
                            rounded={6}
                            width="40px"
                            height="40px"
                            onClick={() => navigate("/account/profile/")}
                        />
                    ),
                });
            }
        });
    }, []);

    const logout = () => {
        removeCookie("token", { path: "/" });
        setLogged({ ...logged, logged: false, user: "", component: <></> });
        navigate("/login/");
        window.location.reload(true);
    };

    return (
        <Grid className="header">
            <Paper elevation={8} className="header_paper">
                <Grid className="inside">
                    <img src={logo} />
                    <div className="holder">
                        <div
                            className={hamburgerClass.join(" ")}
                            ref={hamburgerRef}
                            onClick={() => hamburgerClick()}
                        >
                            <Typography
                                component="button"
                                className="hamburger"
                            >
                                <Typography
                                    component="span"
                                    className="hamburger--box"
                                ></Typography>
                                <Typography
                                    component="span"
                                    sx={hamStyles}
                                    className="hamburger--inner"
                                ></Typography>
                            </Typography>
                        </div>
                        <Grid className="buttons">
                            <button onClick={() => navigate("/songlist")}>
                                Songlist
                            </button>
                            <button onClick={() => navigate("/discord")}>
                                Discord
                            </button>
                            {!logged.logged && (
                                <button onClick={() => navigate("/login")}>
                                    Login
                                </button>
                            )}
                            {/* <Button variant="contained" onClick={() => navigate('/login')}>Login / Register</Button> */}
                        </Grid>
                        {logged.logged && (
                            <Grid className="profile">
                                {logged.component}
                                <Box className="username" onClick={handleClick}>
                                    <Typography className="username__nick">
                                        {logged.user}
                                    </Typography>
                                    <MdArrowDropDown size={20} />
                                </Box>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 12,
                                        sx: {
                                            overflow: "visible",
                                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                            mt: 1.5,
                                        },
                                    }}
                                    transformOrigin={{
                                        horizontal: "right",
                                        vertical: "top",
                                    }}
                                    anchorOrigin={{
                                        horizontal: "right",
                                        vertical: "bottom",
                                    }}
                                >
                                    <MenuItem
                                        onClick={() =>
                                            navigate("account/profile/")
                                        }
                                    >
                                        <ListItemIcon>
                                            <MdOutlineDashboard size={22} />
                                        </ListItemIcon>
                                        Dashboard
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={() => logout()}>
                                        <ListItemIcon>
                                            <MdLogout size={22} />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        )}
                    </div>
                </Grid>
                <Grid
                    className={`${navButtons.join(" ")}`}
                    onClick={() => hamburgerClick()}
                >
                    <button onClick={() => navigate("/songlist")}>
                        Songlist
                    </button>
                    <button onClick={() => navigate("/discord")}>
                        Discord
                    </button>
                    <button onClick={() => navigate("/login")}>Login</button>
                    {/* <Button variant="contained" onClick={() => navigate('/login')}>Login / Register</Button> */}
                </Grid>
            </Paper>
        </Grid>
    );
};

export default Header;
