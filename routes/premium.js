const express = require("express");

const userAuthentication = require("../middlewares/auth");

const premiumRoutes = require("../controllers/premium");

const routes = express.Router();

routes.use("/show-leaderboard",userAuthentication.authenticate, premiumRoutes.getLeaderBoard );

routes.get("/show-file-audit", userAuthentication.authenticate, premiumRoutes.getFileAudit);

module.exports = routes;