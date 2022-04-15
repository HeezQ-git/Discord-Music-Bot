import "./Sidebar.scss";
import logo from "./../../images/logo.png";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import {
    Paper,
    Grid,
    Typography,
    Divider,
    MenuItem,
    Fade,
    styled,
    Menu,
    alpha,
} from "@mui/material";
import {
    MdLibraryMusic,
    MdKeyboardArrowRight,
    MdLogin,
    MdLogout,
    MdPerson,
    MdSettings,
    MdDashboard,
    MdMusicNote,
} from "react-icons/md";
import { FaDiscord, FaUserFriends } from "react-icons/fa";
import { FiMoon } from "react-icons/fi";
import { BsSun } from "react-icons/bs";
import UserAvatar from "./../UserAvatar";

const StyledMenu = styled((props) => (
    <Menu
        elevation={4}
        anchorOrigin={{
            vertical: props.sidebar === "true" ? "top" : "bottom",
            horizontal: props.sidebar === "true" ? "left" : "right",
        }}
        transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 10,
        minWidth: 250,
        overflow: "visible",
        color:
            theme.palette.mode === "light"
                ? "rgb(55, 65, 81)"
                : theme.palette.grey[300],
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "& .MuiSvgIcon-root": {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            "&:active": {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                ),
            },
        },
    },
}));

const Sidebar = ({ theme, setTheme }) => {
    const [sidebar, setSidebar] = useState(false);
    const [isAdmin, setAdmin] = useState(true);
    const logged = true;

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleClose = (num) => {
        setAnchorEl(null);
        switch (num) {
            case 1:
                navigate("/account/profile");
                break;
            case 2:
                navigate("/account/settings");
                break;
            case 3:
                break;
        }
    };

    return (
        <Paper
            className={`drop-shadow-xl Sidebar-content${
                theme ? " dark whiten" : ""
            } ${!sidebar ? "closed" : "opened"}`}
        >
            <Grid sx={{ position: "relative" }}>
                <Grid className="logo">
                    <img src={logo} />
                    <Grid container className="text" sx={{ ml: "10px" }}>
                        <Typography variant="h5">Lorem ipsum</Typography>
                        <Typography variant="h6">Tournaments system</Typography>
                    </Grid>
                </Grid>
                <MdKeyboardArrowRight
                    color="white"
                    size={23}
                    className="toggle"
                    onClick={() => setSidebar(!sidebar)}
                />
            </Grid>
            <Divider sx={{ mt: "10px" }} />
            <Grid className="content">
                <Grid className="menu">
                    <ul>
                        <Link to="/songlist">
                            <li>
                                <MdLibraryMusic size={25} className="icon" />
                                <Typography component="span">
                                    Songlist
                                </Typography>
                            </li>
                        </Link>
                        <a
                            styles={{ textDecoration: "none" }}
                            target="_blank"
                            href="https://discord.gg/RxeuKWFZbH"
                        >
                            <li className="mb-[10px]">
                                <FaDiscord size={20} className="icon" />
                                <Typography component="span">
                                    Discord
                                </Typography>
                            </li>
                        </a>
                        <Divider />
                        <Link to="/dashboard">
                            <li>
                                <MdDashboard size={25} className="icon" />
                                <Typography component="span">
                                    Dashboard
                                </Typography>
                            </li>
                        </Link>
                        <Link to="/dashboard/song-manager">
                            <li>
                                <MdMusicNote size={25} className="icon" />
                                <Typography component="span">
                                    Songs manager
                                </Typography>
                            </li>
                        </Link>
                        <Link to="/dashboard/user-list">
                            <li>
                                <FaUserFriends size={20} className="icon" />
                                <Typography component="span">
                                    User list
                                </Typography>
                            </li>
                        </Link>
                    </ul>
                </Grid>
                <Grid className="menu">
                    {!logged ? (
                        <Link to="/login">
                            <li>
                                <MdLogin size={25} className="icon" />
                                <Typography component="span">Login</Typography>
                            </li>
                        </Link>
                    ) : (
                        <>
                            <div className="user" onClick={handleClick}>
                                <UserAvatar
                                    avatar="https://hubun.pl/img/cms/blog/shiba-inu-liscie.jpeg"
                                    username="HeezQ"
                                    width="55px"
                                    height="55px"
                                    margin="2.5px"
                                    rounded={10}
                                />
                                <Typography component="h6">HeezQ</Typography>
                            </div>
                            <StyledMenu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                TransitionComponent={Fade}
                                sidebar={sidebar.toString()}
                                sx={{
                                    zIndex: "99999",
                                    ml: !sidebar ? "5px" : "",
                                }}
                            >
                                <MenuItem
                                    onClick={() => handleClose(1)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <MdPerson size={20} />
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleClose(2)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <MdSettings size={20} />
                                    Settings
                                </MenuItem>
                                <MenuItem
                                    onClick={() => handleClose(3)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <MdLogout size={20} />
                                    Logout
                                </MenuItem>
                            </StyledMenu>
                        </>
                    )}
                    <li className="darkmode" onClick={() => setTheme(!theme)}>
                        {!theme ? (
                            <FiMoon size={20} className="icon" />
                        ) : (
                            <BsSun size={20} className="icon" />
                        )}
                        <div className="spacing">
                            <Typography component="span">
                                {theme ? "Light" : "Dark"} mode
                            </Typography>
                            <div className="toggle-switch">
                                <span className="switch"></span>
                            </div>
                        </div>
                    </li>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Sidebar;
