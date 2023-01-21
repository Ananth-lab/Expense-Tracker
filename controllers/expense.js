const Expense = require("../models/expense");

const S3Services = require("../services/s3");

const FileAudit = require("../models/fileaudit");

// const userServices = require("../services/user")



exports.addExpense = async (req, res, next) => {
    try {
        const expense = await Expense.create({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category,
            userId: req.user.id
        });
        res.status(201).json({ expense: expense })
    }
    catch (error) {
        console.log(error)
    }
};


exports.getExpense = async (req, res, next) => {
    try {
        const expensesPerPage = req.query.perpage * 1;
         const page = +req.query.page || 1;
         const totalExp = await req.user.getExpenses(); //we can findout length 

         const expenses = await req.user.getExpenses({
            offset : (page - 1) * expensesPerPage,
            limit : expensesPerPage
         });

         return res.status(200).json({ 
            success: true,
            expenses ,
            isPremium: req.user.ispremiumuser,
            name: req.user.name,
            currentPage: page,
            hasNextPage: expensesPerPage * page < totalExp.length,
            nextPage : page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage : Math.ceil(totalExp.length / expensesPerPage),
        });
    }
    catch (error) {
        console.log(error)
    }
}


exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (expense) {
            expense.destroy();
            return res.status(201).json({ message: "expense removed" })
        }
        else {
            return res.status(404).json({ message: "expense not found" })
        }
    }
    catch (error) {
        console.log(error)
    }
}


exports.downloadReport = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses()
        const stringifiedExpense = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense.txt${userId}${new Date()}`;
        const fileURL = await S3Services.uploadToS3(stringifiedExpense, filename);
        if (fileURL) {
            await FileAudit.create({ userId: req.user.id, url: fileURL })
        }
        res.status(200).json({ fileURL, success: true })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: error, success: true })
    }
}