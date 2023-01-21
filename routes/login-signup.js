const express = require("express");

const userAuthentication = require("../middlewares/auth");

const routes = express.Router();

const logInController = require("../controllers/login");

const expenseController = require("../controllers/expense");

const signUpController = require("../controllers/signin");

routes.use("/signup", signUpController.SignUpController);

routes.use("/login", logInController.logInController);

routes.get("/download-report", userAuthentication.authenticate, expenseController.downloadReport);

module.exports = routes;