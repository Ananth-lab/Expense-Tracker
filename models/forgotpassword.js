const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const forgotPassword = new Schema ({
    id : {
        type : String
    },
    active : {
        type : String,
    },
    expireby : {
        type : Date,
    }, 
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})


module.exports = mongoose.model("ForgotPassword", forgotPassword)

