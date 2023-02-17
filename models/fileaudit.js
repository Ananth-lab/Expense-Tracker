const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const fileAuditSchema = new Schema({
    url : {
        type : String
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

module.exports = mongoose.model("FileAudit", fileAuditSchema)

