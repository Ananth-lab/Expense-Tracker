const express = require("express");

const cors = require("cors");

const devenv = require('dotenv');

const fs = require("fs");

const path = require("path");

const mongoose = require("mongoose");

const morgan = require("morgan");

const bodyParser = require("body-parser");

const loginRoutes = require("./routes/login-signup");

const expenseRoutes = require("./routes/expense");

const purchaseRoutes = require("./routes/purchase");

const premiumRoutes = require("./routes/premium");

const forgotPasswordRoutes = require("./routes/forgotpassword");

const app = express();

app.use(bodyParser.json());

app.use(cors());

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" })

app.use(morgan("combined", { stream: accessLogStream }));

devenv.config();

app.use("/user", loginRoutes);

app.use("/password", forgotPasswordRoutes);

app.use("/expense", expenseRoutes);

app.use("/get-premium", purchaseRoutes);

app.use("/premium", premiumRoutes);

mongoose.connect(process.env.MONGO_DB)
.then(() => {
  app.listen(3000);
  console.log("connected!")
})