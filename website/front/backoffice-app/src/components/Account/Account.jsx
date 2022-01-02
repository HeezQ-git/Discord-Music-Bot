import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AccountActivate, EmailSent, ForgotPassword } from '../';

const Account = () => {
    return (
        <div className="Account-content">
            <Routes>
                <Route path="/activate/:id" element={<AccountActivate/>}/>
                <Route path="/email_sent/:email" element={<EmailSent/>}/>
                <Route path="/forgot_password" element={<ForgotPassword type="forgot"/>}/>
                <Route path="/forgot_password/:email" element={<ForgotPassword type="forgot"/>}/>
                <Route path="/password_reset/:id" element={<ForgotPassword type="reset"/>}/>
            </Routes>
        </div>
    )
}

export default Account
