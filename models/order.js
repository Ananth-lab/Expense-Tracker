const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const orderSchema = new Schema ({
    orderId : {
        type : String,
    },
    paymentId : {
        type : String,
    },
    description : {
        type : String,
    },
    status : {
        type : String,
    }
})


module.exports = mongoose.model("Order", orderSchema)
