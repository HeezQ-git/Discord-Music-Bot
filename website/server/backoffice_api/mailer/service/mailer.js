const nodemailer = require('nodemailer');
const PendingUsers = require('./../../../models/pendingUsers');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const WebsiteUsers = require('../../../models/websiteUsers');

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.GOOGLE_USER}`,
        pass: `${process.env.GOOGLE_PASSWORD}`,
    },
});

const newPendingUser = async (req, res) => {
    const response = {
        success: false,
        msg: '',
    }

    const hashedPassword = await hashPassword(req.body.password);

    await PendingUsers.create({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    });

    const user = await PendingUsers.findOne({ username: req.body.username });
    if (user) response.success = true
    else response.msg = `Didn't find user in pending users list.`;

    if (response.success) {
        const info = await sendConfirmationEmail(user, user._id);
        if (info.rejected.length > 0) {
            response.success = false;
            response.msg = `Email couldn't be sent, please retry in a moment.`;
        }
    }

    res.status(200).json(response);
}

const sendConfirmationEmail = async (toUser, hash) => {

    let info = await transporter.sendMail({
        from: `"Tournament Team" <${process.env.GOOGLE_USER}>`,
        to: toUser.email,
        subject: "Tournament Team - Account Activation",
        text: "Account Activation",
        html: `
        <div style="user-select: none; font-family: 'Gelion', sans-serif; height: 100vh;">
            <div class="outside-content" style="display: block;width: 500px;">
                <div style="display: inline-flex; font-weight: bold; font-size: 2rem; width: 100%; background-color: #242424; padding: 10px; color: white;">
                    <div><a target="_" href="${process.env.DOMAIN}"><img src="https://i.imgur.com/kcjcPFs.png" style="height: 100px;width: 100px;"></a></div>
                    <p style="margin-top: auto; margin-left: auto; margin-right: auto">ACCOUNT ACTIVATION</p>
                </div>
                <div class="content" style="background: #f4f4f4; padding: 10px; display: block;align-items: center;margin: auto;height: 300px;width: 100%;border-radius: 5px;">
                    <h1 class="heading" style="text-align:center;padding-top: 10px;font-size: 1.5rem;color: rgb(49, 49, 49);">Dear ${toUser.username},</h1>
                    <div class="text">
                        <p style="margin: 0;margin-top: 10px;text-align: center;font-size:1rem;">Thank you for registering on our website.</p>
                        <p style="margin: 0;margin-top: 5px;text-align: center;font-size:1rem;">We sincerely hope you enjoy your time with us.</p>
                    </div>
                    <p class="info" style="text-align:center;margin:auto;max-width: 400px;margin-top: 35px;font-size: 1.25rem;color: rgb(49, 49, 49);font-weight: bold;">To activate your account, please click the following button:</p>
                    <div class="button" style="margin-top: 35px;text-align:center;">
                        <a target="_" href="${process.env.DOMAIN}/account/activate/${hash}" style="padding: 15px;padding-inline: 30px; height: 45px;background: #1a73e8;border: 0;border-radius: 8px;color: white;font-size: 1.1rem;cursor: pointer;text-decoration: none;">ACTIVATE ACCOUNT</a>
                    </div>
                </div>
                <div style="display: inline-flex; width: 100%; background-color: rgba(36, 36, 36, 0.9); padding: 10px; color: white;">
                    <div style="margin: auto; margin-top: 10px; text-align: center; opacity: .5; max-width: 80%;">
                        <p>You received this email because you set up an account with this email. If it wasn't you, you can safely ignore this email.</p>
                    </div>
                </div>
            </div>
        </div>
        `,
    });

    return info;
}

const sendEmail = async (req, res) => {
    const response = {
        success: false,
    }

    const user = await PendingUsers.findOne({ email: req.body.email });
    if (user) {
        let flag = true;
        if (user.resendemail) {
            const diff = Date.now() - user.resendemail;
            if (diff < 30000) flag = false;
        }
        if (flag) {
            const info = await sendConfirmationEmail(user, user._id);
            if (info.rejected.length <= 0) response.success = true;
            await PendingUsers.updateOne({ resendemail: Date.now() });
        }
    }

    return res.status(200).json(response);
}

const sendForgetPassword = async (req, res) => {
    const response = {
        success: false,
        msg: '',
    }

    if (req.body.email) {

        const user = await WebsiteUsers.findOne({ email: req.body.email });

        if (user) {
            if (user.accountType === 'classic') {

                const hash = crypto.randomBytes(20).toString('hex');
                user.passwordResetId = hash;
                await WebsiteUsers.updateOne({ email: req.body.email }, user);
                
                console.log(`${req.body.email} : ${hash}`);
                
                let info;

                try {
                    info = await transporter.sendMail({
                        from: `"Tournament Team" <${process.env.GOOGLE_USER}>`,
                        to: req.body.email,
                        subject: "Password Reset (Tournaments)",
                        text: "Password Reset",
                        html: `
                        <div style="width: 100vw; font-family: 'Gelion', sans-serif; height: 100vh;">
                            <div class="outside-content" style="display: block;width: 500px;">
                                <div style="display: inline-flex; font-weight: bold; font-size: 2rem; width: 100%; background-color: #242424; padding: 10px; color: white;">
                                    <div><a target="_" href="${process.env.DOMAIN}"><img src="https://i.imgur.com/kcjcPFs.png" style="height: 100px;width: 100px;"></a></div>
                                    <p style="margin-top: auto; margin-left: auto; margin-right: auto">PASSWORD RESET</p>
                                </div>
                                <div class="content" style="background: #f4f4f4; padding: 10px; display: block;align-items: center;margin: auto;height: 300px;width: 100%;border-radius: 5px;">
                                    <h1 class="heading" style="margin-left: 25px; font-weight: normal; padding-top: 10px;font-size: 1.3rem;color: rgb(49, 49, 49);">Dear ${user.username},</h1>
                                    <div style="line-height:1.65rem;max-width: 90%;margin-left: 25px;margin-top: 25px;">
                                        <span style="font-size: 1.1rem;color: rgb(49, 49, 49);font-weight: 550;">A request has been received to change the password for your Tournament account.</span> 
                                        <p style="opacity: .9; margin-top: 5px; color: black; font-size: 1.1rem;">Click on this link to create a new password:</p>
                                    </div>
                                    <div class="button" style="margin-top: 60px;text-align:center;">
                                        <a target="_" href="${process.env.DOMAIN}/account/password_reset/${hash}" style="padding: 15px;padding-inline: 30px; height: 45px;background: #2c7bfa;border: 0;border-radius: 8px;color: white;font-size: 1.1rem;cursor: pointer;text-decoration: none;">Reset Password</a>
                                    </div>
                                </div>
                                <div style="display: inline-flex; width: 100%; background-color: rgba(36, 36, 36, 0.9); padding: 10px; color: white;">
                                    <div style="margin: auto; text-align: center; opacity: .5; max-width: 100%;">
                                        <p>If this was a mistake, just ignore this email and nothing will happen.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `,
                    });
                } catch (error) {
                    response.msg = `Something went wrong!`;
                }
                if (info.rejected.length > 0) {
                    response.msg = `Something went wrong!`;
                } else {
                    response.success = true;
                }
            }  else response.msg = `Google accounts are not supported`;
        } else response.msg = `We could't find that account`;

    }

    return res.status(200).json(response);
}

module.exports = {
    sendConfirmationEmail,
    sendForgetPassword,
    newPendingUser,
    sendEmail,
};