const Sequelize = require("sequelize");

const sequelize = require('../utils/database');

const FileAudit = sequelize.define("fileaudit", {
    url : {
        type : Sequelize.STRING
    }
});


module.exports = FileAudit
