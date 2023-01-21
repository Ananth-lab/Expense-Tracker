const User = require("../models/user");

const bcrypt = require("bcrypt");

exports.SignUpController = async (req, res, next) => {
    try {
        const cycles = 10;
        bcrypt.hash(req.body.password, cycles, async (err, hash) => {
            try {
                const user = await User.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    ispremiumuser : false
                })
                res.status(200).json({ newuser: user });
            }
            catch (error) {
                res.status(504).json({error : error.name})
            }
        })
    }
    catch (error) {
        res.status(504).json({ error: error })
    }
}



