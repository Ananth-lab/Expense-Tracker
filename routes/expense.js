const express = require("express");

const userAuthentication = require("../middlewares/auth")

const expenseRouters = require("../controllers/expense");

const routes = express.Router();

routes.post("/addExpense",userAuthentication.authenticate,expenseRouters.addExpense);

routes.get("/getExpense", userAuthentication.authenticate ,expenseRouters.getExpense );

routes.delete("/deleteExpense/:id",userAuthentication.authenticate, expenseRouters.deleteExpense );

module.exports = routes;