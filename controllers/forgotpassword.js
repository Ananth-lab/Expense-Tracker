const sgMail = require('@sendgrid/mail');

const bcrypt = require("bcrypt");

const uuid = require("uuid");

const Forgotpassword = require("../models/forgotpassword");

const User = require("../models/user");

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const id = uuid.v4();
            user.createForgotpassword({
                id,
                active: true
            })
                .catch(err => {
                    throw new Error(err);
                })
            const msg = {
                to: user.email,
                from: 'anantharajabk@gmail.com',
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: `http://localhost:3000/password/resetpassword/${id}`
            }
            // sgMail
            //     .send(msg)
            //     .then((response) => {
            //         return res.status(response[0].statusCode).json({ message: 'Link to reset password sent to your mail ', success: true })
            //     })
            //     .catch((error) => {
            //         console.error(error)
            //     })
            return res.status(200).json({ message: 'Link to reset password sent to your mail ', link: msg.html })
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        Forgotpassword.findOne({ where: { id: id } })
            .then(resetrequest => {
                if (resetrequest) {
                    resetrequest.update({ active: false })
                    res.status(200).send(`<html>
                    <form action="/password/updatepassword/${id}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button>reset password</button>
                </form>
                <script src="../public/css/styles"></script>
            </html>`);
                    res.end()
                }
            })
    }
    catch (error) {
        console.log(error)
    }
}


exports.updatePassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const newPassword = req.query.newpassword;
        Forgotpassword.findOne({ where: { id } })
            .then(resetrequest => {
                User.findOne({ where: { id: resetrequest.userId } })
                    .then(user => {
                        const saltRounds = 10;
                        bcrypt.genSalt(saltRounds, function (error, salt) {
                            if (error) {
                                throw new Error(error)
                            }
                            bcrypt.hash(newPassword, salt, (err, hash) => {
                                if (error) {
                                    throw new Error(error)
                                }
                                user.update({ password: hash })
                                    .then(() => {
                                        res.status(201).json({ message: "Password updated succesfully" })
                                    })
                            })
                        })
                    })
            })
    }
    catch (error) {
        res.status(404).json({ message: "User not found" })
    }
}

