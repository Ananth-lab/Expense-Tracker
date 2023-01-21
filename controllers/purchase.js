const Order = require("../models/order");

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
        const amount = 250;
        rzr.orders.create({amount, currency : "INR"}, (error, order) => {
            if(error){
                throw new Error(JSON.stringify(error))
            }
            req.user.createOrder({orderId : order.id, status : "PENDING" })
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
            const order = await Order.findOne({where : {orderId : req.body.order_id}});
            await order.update({status : "FAILURE"});
            return res.status(501).json({success : false, message : "Transaction failed"}) 
        }
        const {order_id, payment_id} = req.body;
        const order = await Order.findOne({where : {orderId : order_id}})
        await order.update({paymentId : payment_id, status : "SUCCESSFUL"})
        await req.user.update({ispremiumuser : true})
        return res.status(201).json({success : true, message : "Transaction successful", token : generateAccessToken(req.user.id, true)})
    }
    catch(error) {
        console.log(error)
    }
}