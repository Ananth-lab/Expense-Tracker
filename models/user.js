const mongoose = require("mongoose")

const schema = mongoose.Schema;

const UserSchema = new schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    isPremiumuser : {
        type : Boolean,
    }
});


module.exports = mongoose.model("User", UserSchema)
