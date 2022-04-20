import "./ForgotPassword.scss";
import { useParams } from "react-router-dom";
import { MdClose, MdDone, MdOutlineErrorOutline } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { mailerService } from "../../../services/mailer.service";
import { accountService } from "../../../services/account.service";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";

import Input from "../../Input";
import {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    Alert,
    IconButton,
    Collapse,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const ForgotPassword = ({ type, theme }) => {
    const strength = [
        "❌ Terribly bad",
        "🙁 Bad",
        "😕 Weak",
        "👍 Good",
        "💪 Strong",
    ];

    const delay = async (ms) => new Promise((res) => setTimeout(res, ms));

    const { emailParam, id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState({
        value: emailParam ? emailParam : "",
        msg: "",
    });
    const [password, setPassword] = useState({
        value: "",
        msg: "",
        strength: -1,
    });
    const [repeatPass, setRepeatPass] = useState({ value: "", msg: "" });

    const [button, setButton] = useState(false);
    const [open, setOpen] = useState(false);

    const checkStrength = () => {
        const res = zxcvbn(password.value);

        setPassword({ ...password, strength: res.score });
        if (res.score <= 1) return;

        return true;
    };

    const checkPassword = () => {
        if (password.value.length == 0)
            return setPassword({
                ...password,
                msg: "You have to provide password",
            });
        return checkStrength();
    };

    const checkRepeatPass = () => {
        if (repeatPass.value.length == 0)
            return setRepeatPass({
                ...repeatPass,
                msg: "You have to repeat password",
            });
        if (password.value != repeatPass.value)
            return setRepeatPass({
                ...repeatPass,
                msg: "Passwords don`t match!",
            });

        return true;
    };

    const submit = async () => {
        if (!email.value.length)
            return setEmail({ ...email, msg: "This field can't be empty" });
        if (
            !String(email.value)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
        )
            return setEmail({ ...email, msg: "Invalid email format" });

        setLoading(true);
        setEmail({ ...email, msg: "" });

        const res = await mailerService.sendForgetPassword({
            email: email.value,
        });

        setLoading(false);

        if (res.data.success) {
            setButton(true);
            await delay(2000);
            setButton(false);
        } else setEmail({ ...email, msg: res.data.msg });
    };

    const changePassword = async () => {
        setLoading(true);

        let flag = true;

        flag = checkPassword();
        flag = flag == true ? checkRepeatPass() : false;

        if (flag) {
            const res = await accountService.changePassword({
                password: password.value,
                passwordResetId: id,
            });

            if (res.data.success) navigate("/login");
            else {
                setLoading(false);
                setEmail({ ...email, msg: res.data.msg });
                navigate("/account/forgot_password");
            }
        }

        setLoading(false);
    };

    useEffect(async () => {
        if (type != "reset") return;

        const res = await accountService.checkPasswordReset({
            passwordResetId: id,
        });
        setForm(res.data.success);

        if (!res.data.success) setOpen(true);
    }, []);

    return (
        <Grid className="main">
            <Container className="forgotPassword" maxWidth="sm">
                <div className="forgot-paper drop-shadow-xl" elevation={8}>
                    {/* { loading && <Loading/> } */}
                    {!form && (
                        <Grid className="center_form">
                            <Typography variant="h5">
                                Forgot password?
                            </Typography>
                            <Typography variant="h6">
                                Reset your password via email
                            </Typography>
                            <Container className="email_container">
                                <Input
                                    label="Email Address"
                                    placeholder="Your email"
                                    value={email.value}
                                    onChange={(e) =>
                                        setEmail({
                                            ...email,
                                            value: e.currentTarget.value,
                                            msg: "",
                                        })
                                    }
                                    error={email.msg.length > 0}
                                    required
                                    fullWidth
                                    autoFocus
                                />
                                {!!email.msg.length && (
                                    <div className="error_items mt-[-5px]">
                                        {" "}
                                        <MdOutlineErrorOutline /> {email.msg}
                                    </div>
                                )}
                                <LoadingButton
                                    color={button ? "success" : "primary"}
                                    loading={loading}
                                    loadingPosition="start"
                                    variant="contained"
                                    startIcon={<MdDone />}
                                    onClick={() => submit()}
                                >
                                    Submit
                                </LoadingButton>
                            </Container>
                            <Grid className="bottom_text">
                                <Typography variant="h6">
                                    Logged in with <span>Google Account</span>?
                                </Typography>
                                <Typography>
                                    If you would like to set a password for your
                                    account, you can do it in your account
                                    settings
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                    {form && (
                        <Grid className="center_form password_reset">
                            <Typography variant="h5">Password Reset</Typography>
                            <Typography variant="h6">
                                Fill in the fields below
                            </Typography>
                            <Grid className="limit_width">
                                <Box sx={{ width: "100%" }}>
                                    <Input
                                        val="password"
                                        label="Password"
                                        placeholder="Your password"
                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                value: e.currentTarget.value,
                                                msg: "",
                                            })
                                        }
                                        error={
                                            password.msg.length > 0 ||
                                            (password.strength != -1 &&
                                                password.strength <= 1 &&
                                                password.value.length > 0)
                                        }
                                        required
                                        fullWidth
                                    />
                                    {!!password.value.length && (
                                        <Grid
                                            sx={{
                                                marginTop: "5px",
                                                width: "100%",
                                            }}
                                        >
                                            <Typography
                                                variant="p"
                                                sx={{ opacity: ".8" }}
                                            >
                                                {password.strength != -1 &&
                                                    strength[password.strength]}
                                            </Typography>
                                            <meter
                                                max={4}
                                                value={password.strength}
                                                className={`meter ${
                                                    theme ? "dark" : ""
                                                }`}
                                            />
                                        </Grid>
                                    )}
                                    {!!password.msg.length && (
                                        <div className="error_items mt-[8px]">
                                            {" "}
                                            <MdOutlineErrorOutline />{" "}
                                            {password.msg}{" "}
                                        </div>
                                    )}
                                </Box>
                                <Input
                                    val="password"
                                    label="Repeat Password"
                                    placeholder="Repeat password"
                                    onChange={(e) =>
                                        setRepeatPass({
                                            ...repeatPass,
                                            value: e.currentTarget.value,
                                            msg: "",
                                        })
                                    }
                                    required
                                    fullWidth
                                    error={repeatPass.msg.length > 0}
                                />
                                <LoadingButton
                                    loading={loading}
                                    loadingPosition="start"
                                    variant="contained"
                                    startIcon={<MdDone />}
                                    onClick={() => changePassword()}
                                    fullWidth
                                >
                                    Submit
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    )}
                </div>
            </Container>
            <Collapse in={open} className="alert">
                <Alert
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            {" "}
                            <MdClose />{" "}
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    Reset password ID is invalid or expired!
                </Alert>
            </Collapse>
        </Grid>
        // <div className="ForgotPassword-content">
        //     <Paper elevation={8} className="paper">
        //         {props.type === "forgot" ?
        //             <div className="forgotpassword-inside">
        //                 {loading && <Loading />}
        //                 <div className="forgotpassword--title">
        //                     <h1 className="title">Forgot password?</h1>
        //                     <h2>Reset your password via email.</h2>
        //                 </div>
        //                 <div className="forgotpassword--credentials">
        //                     <div className={"input input-email " + (inputClass ? inputClass : '')}>
        //                         <TextField id="text-field-type-email" onChange={(event) => setEmailValue(event.currentTarget.value)} defaultValue={email != `null` ? email : ''} placeholder="Your e-mail" label="E-mail address"/>
        //                     </div>
        //                     {buttonInfo.error ?
        //                     <div className="error btn-gap">
        //                         <MdErrorOutline size="20"/>
        //                         {buttonInfo.error}
        //                     </div> : ''}
        //                     <Button disabled={buttonInfo.disabled} className="btn" onClick={() => sendEmail()} variant="contained" startIcon={buttonInfo.icon === 'email' || buttonInfo.icon === 'loading' ? <MdOutlineEmail/> : buttonInfo.icon === 'ok' ? <MdDone/> : <MdClose/>}>{buttonInfo.msg}</Button>
        //                 </div>
        //                 <div className="forgotpassword--info">
        //                     <h1>Logged in using <span>Google Account</span>?</h1>
        //                     <p>If you would like to set a password for your account, you can do it in your account settings!</p>
        //                 </div>
        //             </div>
        //         : resetPassword.success != null ?
        //             <div className="forgotpassword-inside">
        //                 { resetPassword.success ? <div className="forgotpassword--title">
        //                     <h1>PASSWORD RESET</h1>
        //                     <h2>Fill in the fields below:</h2>
        //                     <div className="form">
        //                         <div className="password">
        //                             <Input className="medium-width" inputProps={{ maxLength: 24 }} required value={password} onChange={(event) => setPassword(event.currentTarget.value)} id={`text-field-type-password`} placeholder="New password" label="Password" error={passwordStyles.pass != null ? !passwordStyles.pass : false} />
        //                             {passwordStyles.msg.length > 0 ?
        //                                 <div className="tips">
        //                                     {passwordStyles.warning && <p className="warning">{passwordStyles.warning}</p>}
        //                                     <p className="suggestion">{passwordStyles.suggestion}</p>
        //                                 </div>
        //                             : ''}
        //                         </div>
        //                         <Input className="medium-width" inputProps={{ maxLength: 24 }} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.currentTarget.value)} id={`text-field-type-confirm`} placeholder="Confirm password" label="Confirm" error={confirmPasswordStyles.pass != null ? !confirmPasswordStyles.pass : false} />

        //                         {confirmPasswordStyles.msg && <p className="error"><MdErrorOutline size="20"/>{confirmPasswordStyles.msg}</p>}
        //                         <Button onClick={() => changePassword()} variant="contained" startIcon={<MdDone/>}>Submit</Button>
        //                     </div>
        //                     {error && <p className="error"><MdErrorOutline size="20"/>{error}</p>}
        //                     <div className="warning">
        //                         <h2><IoMdWarning/> Warning!</h2>
        //                         <p>Once the password is changed, you will be logged out from all devices!</p>
        //                     </div>
        //                 </div> :
        //                 <div className="forgotpassword--title">
        //                     <div className="content">
        //                         <h1>PASSWORD RESET</h1>
        //                         <h2>Couldn't download password reset form.</h2>
        //                         <p>{resetPassword.msg}</p>
        //                     </div>
        //                     <div className="details">
        //                         <h3>Does this keep happening?</h3>
        //                         <p>Please contact support at our <Link to="/discord"><span><FaDiscord/>Discord server</span></Link> for further help.</p>
        //                     </div>
        //                 </div>}
        //             </div>
        //         :
        //             <div>
        //                 <Loading content/>
        //             </div>
        //         }
        //     </Paper>
        // </div>
    );
};

export default ForgotPassword;
