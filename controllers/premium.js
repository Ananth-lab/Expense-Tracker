const Expense = require("../models/expense");

const FileAudit = require("../models/fileaudit")

const sequelize = require("sequelize");

const User = require("../models/user");

exports.getLeaderBoard = async (req, res, next) => {
    try {
        const leaderBoard = await User.findAll({
            attributes: ["id", "username", [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_amount"]],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_amount', 'DESC']]
        })
        res.status(200).json(leaderBoard)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: error, success : false})
    }
}


exports.getFileAudit = async (req,res,next) => {
    try{
        const auditList = await FileAudit.findAll({where : {userId : req.user.id}});
        res.status(200).json({FileAudit : auditList, success : true})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: error, success : false})
    }
}


