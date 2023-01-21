const express = require("express");

const userAuthentication = require("../middlewares/auth");

const routes = express.Router();

const purchaseControllers = require("../controllers/purchase");

routes.use("/purchase-premium",userAuthentication.authenticate, purchaseControllers.getPremium);

routes.use("/update-transaction-status", userAuthentication.authenticate, purchaseControllers.updateStatus)

module.exports = routes;