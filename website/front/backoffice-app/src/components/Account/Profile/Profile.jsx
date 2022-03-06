import "./Profile.scss";
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import UserAvatar from "../../UserAvatar";
import { loginService } from "../../../services/login.service";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import {
    MdCameraAlt,
    MdInput,
    MdOutlineErrorOutline,
    MdSave,
    MdUploadFile,
} from "react-icons/md";
import ReactImageBase64 from "react-image-base64";

const Profile = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["token"]);
    const [user, setUser] = useState(undefined);
    const [avatarInput, setAvatarInput] = useState(false);

    useEffect(() => {
        loginService.checkSession({ token: cookies["token"] }).then((res) => {
            if (res.data.success) setUser(res.data.user);
        });
    }, []);

    const files = (files) => {
        console.log(files);
        if (!files.file.type.startsWith("image")) console.log("not img");
    };

    const [images, setImages] = useState();
    const [error, setError] = useState();

    const [open, setOpen] = useState(true);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setImages();
        setError();
        setOpen(false);
    };

    const fixFileSize = (size) => {
        if (size < 1000000)
            return `${(images?.ofileSize / 1000).toFixed(1)} kB`;
        else return `${(images?.ofileSize / 1000000).toFixed(2)} MB`;
    };

    const throwError = (data) => {
        if (data.messages[0].toLowerCase().includes("mb"))
            setError(
                "File size of the image file exceeds the maximum value (2 MB)."
            );
    };

    const saveAvatar = () => {
        if (!!images) {
        } else setError("Please select an avatar of your choice");
    };

    return (
        <Container component="main" className="profile-component" maxWidth="lg">
            <Paper elevation={8} className="profile_paper" square>
                <Grid className="top_bar">
                    <div className="avatar">
                        <div className="iconBox" onClick={handleClickOpen}>
                            <UserAvatar
                                avatar={user?.avatar}
                                username={user?.username}
                                rounded="50%"
                                width="150px"
                                height="150px"
                            />
                            <div className="icon">
                                <MdCameraAlt size={40} />
                            </div>
                        </div>
                    </div>
                    <div className="user_info">
                        <Typography variant="h2" className="username">
                            {user?.username}
                        </Typography>
                        <Typography variant="p" className="role">
                            User
                        </Typography>
                    </div>
                </Grid>
            </Paper>
            <Paper elevation={12} className="content_paper" square></Paper>
            <Dialog open={open} onClose={handleClose}>
                <div className="avatar_select_file">
                    <DialogTitle>Select avatar image</DialogTitle>
                    <DialogContent>
                        <div className="file_input">
                            <label
                                htmlFor="js-image-base64"
                                className="drop_area"
                            >
                                <ReactImageBase64
                                    maxFileSize={2000000}
                                    thumbnail_size={100}
                                    drop={true}
                                    dropText={
                                        <span className="drop_text">
                                            <span className="text">
                                                <MdUploadFile size={30} />

                                                <span className="title">
                                                    Select image or drop it here
                                                </span>
                                            </span>
                                            <span className="info">
                                                Max file size is 2 MB
                                            </span>
                                        </span>
                                    }
                                    capture="environment"
                                    handleChange={(data) => {
                                        console.log(data);
                                        if (data.result) {
                                            setImages(data);
                                            setError();
                                        } else throwError(data);
                                    }}
                                />
                            </label>
                        </div>
                        {images?.ofileData && (
                            <div className="image_info">
                                <img
                                    src={images?.ofileData}
                                    className="image"
                                    onDragStart={(e) => e.preventDefault()}
                                />
                                <div className="text_container">
                                    <p>{images?.fileName}</p>
                                    <p>{fixFileSize(images?.ofileSize)}</p>
                                </div>
                            </div>
                        )}
                        {error && (
                            <span className="error">
                                <MdOutlineErrorOutline size={22} />
                                {error}
                            </span>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={saveAvatar}
                            startIcon={<MdSave />}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </Container>
    );
};

export default Profile;
