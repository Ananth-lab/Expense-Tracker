const FileAudit = require("../models/fileaudit")

const User = require("../models/user");

exports.getLeaderBoard = async (req, res, next) => {
    try {
        const leaderBoard = await User.aggregate([
            {
              $lookup: {
                from: "expenses",
                localField: "_id",
                foreignField: "userId",
                as: "expenses"
              }
            },
            {
              $addFields: {
                total_amount: { $sum: "$expenses.amount" }
              }
            },
            {
              $project: {
                _id: 1,
                username: 1,
                total_amount: 1
              }
            },
            {
              $sort: { total_amount: -1 }
            }
          ]);
          res.status(200).json(leaderBoard);
          
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: error, success : false})
    }
}


exports.getFileAudit = async (req,res,next) => {
    try{
        const auditList = await FileAudit.find({userId : req.user.id});
        res.status(200).json({FileAudit : auditList, success : true})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: error, success : false})
    }
}


