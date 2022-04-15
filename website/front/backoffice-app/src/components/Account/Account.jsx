import { Grid } from "@mui/material";
import React from "react";
import { Routes, Route } from "react-router-dom";
import EmailSent from "./EmailSent";
import ForgotPassword from "./ForgotPassword";
import Activate from "./Activate";
import Profile from "./Profile";

const Account = (props) => {
    return (
        <Grid
            className="accountContent"
            sx={{
                height: "100%",
                width: "100%",
                paddingLeft: "10px",
                paddingRight: "10px",
            }}
        >
            <Routes>
                {/* <Route path="/profile" element={<Profile />} /> */}
                <Route path="/activate/:id" element={<Activate />} />
                <Route path="/email_sent/:email" element={<EmailSent />} />
                <Route
                    path="/forgot_password"
                    element={<ForgotPassword type="forgot" />}
                />
                <Route
                    path="/forgot_password/:emailParam"
                    element={<ForgotPassword type="forgot" />}
                />
                <Route
                    path="/password_reset/:id"
                    element={<ForgotPassword type="reset" {...props} />}
                />
            </Routes>
        </Grid>
    );
};

export default Account;
