const Order = require("../models/order");

const User = require("../models/user");

const RazorPay = require("razorpay");

const jwt = require("jsonwebtoken");


const generateAccessToken = (id, ispremiumuser) => {
    return jwt.sign({userid : id, ispremiumuser :ispremiumuser }, process.env.AUTH_SECRET_KEY)
}


exports.getPremium = async (req, res, next) => {
    try {
        var rzr = new RazorPay( {
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        rzr.orders.create({amount, currency : "INR"}, (error, order) => {
            if(error){
                throw new Error(JSON.stringify(error))
            }
            const doc = new Order({orderId : order.id, status : "PENDING" })
            doc.save()
            .then(() => {
                return res.status(201).json({order,key_id : rzr.key_id})
            })
        })
    }
    catch(error) {
        console.log("error is", error)
    }
}

exports.updateStatus = async (req, res, next) => {
    try {
        if(!req.body.payment_id){
            const order = await Order.findOne({orderId : order_id});
            await order.updateOne({status : "FAILURE"});
            return res.status(501).json({success : false, message : "Transaction failed"}) 
        }
        const {order_id, payment_id} = req.body;
        const order = await Order.findOne({orderId : order_id})
        await order.updateOne({paymentId : payment_id, status : "SUCCESSFUL"});
        const user = User.findOne({_id : req.user._id});
        await user.updateOne({isPremiumuser : true})
        //await req.user.update({ispremiumuser : true})
        return res.status(201).json({success : true, message : "Transaction successful", token : generateAccessToken(req.user.id, true)})
    }
    catch(error) {
        console.log(error)
    }
}