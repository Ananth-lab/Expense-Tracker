const sgMail = require('@sendgrid/mail');

const bcrypt = require("bcrypt");

const uuid = require("uuid");

const Forgotpassword = require("../models/forgotpassword");

const User = require("../models/user");

exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const id = uuid.v4();
            const doc = new Forgotpassword({
                id: id,
                active: true,
                userId : user._id
            })
            await doc.save()
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
            return res.status(200).json({ message: 'Link to reset password sent to your mail ', link: msg.html })
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.resetPassword = async (req, res, next) => {
    try {
        const resetrequest = await Forgotpassword.findOne({ id: req.params.id })
        if (resetrequest) {
            await resetrequest.updateOne({ active: false });
            res.status(200).send(`<html>
                <form action="/password/updatepassword/${req.params.id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
            </form>
        </html>`);
        }
    }
    catch (error) {
        console.log(error)
    }
}

exports.updatePassword = async (req, res, next) => {
    const id = req.params.id;
    const newPassword = req.query.newpassword;

    try {
        const resetrequest = await Forgotpassword.findOne({ id: id, active: false }).exec();
        if (!resetrequest) {
            throw new Error("Invalid or expired reset password link");
        }
        const user = await User.findById(resetrequest.userId).exec();
        if (!user) {
            throw new Error("User not found");
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(newPassword, saltRounds);
        user.password = hash;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully, please re-login" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
