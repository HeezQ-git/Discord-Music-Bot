const nodemailer = require('nodemailer');
const pendingUsers = require('./../../../models/pendingUsers');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

const newPendingUser = async (req, res) => {
    const response = {
        success: false,
        msg: '',
    }

    const hashedPassword = await hashPassword(req.body.password);

    await pendingUsers.create({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword
    });

    const user = await pendingUsers.findOne({ username: req.body.username });
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

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.GOOGLE_USER}`,
            pass: `${process.env.GOOGLE_PASSWORD}`,
        },
    });

    let info = await transporter.sendMail({
        from: `"Tournament Team" <${process.env.GOOGLE_USER}>`,
        to: toUser.email,
        subject: "Tournament Team - Account Activation",
        text: "Account Activation",
        html: `
        <div style="font-family: 'Gelion', sans-serif; background: url('https://i.imgur.com/aE1h491.jpg'); background-position: center; background-repeat: no-repeat; background-size: cover; backdrop-filter: blur(15px); height: 100vh; overflow-y: hidden; overflow-x: hidden;">
            <div class="outside-content" style="display: block;justify-content: center;margin: auto;width: 500px;">
                <a target="_" href="${process.env.DOMAIN}"><img src="https://i.imgur.com/kcjcPFs.png" style="height: 100px;width: 100px;"></a>
                <div class="content" style="display: block;align-items: center;margin: auto;height: 400px;width: 100%;background: white;border-radius: 5px;">
                    <h1 class="heading" style="text-align:center;padding-top: 50px;font-size: 1.5rem;color: rgb(49, 49, 49);">Dear ${toUser.username},</h1>
                    <div class="text">
                        <p style="margin: 0;margin-top: 10px;text-align: center;font-size:1rem;">Thank you for registering on our website.</p>
                        <p style="margin: 0;margin-top: 10px;text-align: center;font-size:1rem;">We sincerely hope you enjoy your time with us.</p>
                    </div>
                    <p class="info" style="text-align:center;margin:auto;max-width: 400px;margin-top: 50px;font-size: 1.25rem;color: rgb(49, 49, 49);font-weight: bold;">To activate your account, please click the following button:</p>
                    <div class="button" style="margin-top: 25px;text-align:center;">
                        <a target="_" href="${process.env.DOMAIN}/account/activate/${hash}" style="transition: all .3s ease;padding: 10px;padding-inline: 30px;height: 45px;background: linear-gradient(97deg, rgba(195,51,244,1) 0%, rgba(219,66,149,1) 100%);border: 0.5px solid rgba(100, 100, 100, 0.5);border-radius: 8px;color: white;font-size: 1.25rem;cursor: pointer;text-decoration: none;">ACTIVATE ACCOUNT</a>
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

    const user = await pendingUsers.findOne({ email: req.body.email });
    if (user) {
        let flag = true;
        if (user.resendemail) {
            const diff = Date.now() - user.resendemail;
            if (diff < 30000) flag = false;
        }
        if (flag) {
            const info = await sendConfirmationEmail(user, user._id);
            if (info.rejected.length <= 0) response.success = true;
            await pendingUsers.updateOne({ resendemail: Date.now() });
        }
    }

    return res.status(200).json(response);
}

module.exports = {
    sendConfirmationEmail,
    newPendingUser,
    sendEmail,
};