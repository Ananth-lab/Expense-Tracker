const User = require("../models/user");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const generateAccessToken = (id, ispremiumuser) => {
    return jwt.sign({userid : id, ispremiumuser :ispremiumuser }, process.env.AUTH_SECRET_KEY)
}

exports.logInController = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result == true) {
                    res.status(201).json({ message: "User login successful" , token : generateAccessToken(user.id, user.ispremiumuser), ispremiumuser : user.ispremiumuser});
                }
                else {
                    res.status(401).json({ error: "User is not authorized" })
                }
            })
        }
        
        else {
            res.status(404).json({ error: "User not found" })
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.forgotPassword = async (req, res, next) => {
    try {
        console.log(req.body)
        res.end()
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

