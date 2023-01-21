const express = require("express");

const cors = require("cors");

const devenv = require('dotenv');

const helmet = require("helmet");

const fs = require("fs");

const path = require("path");

// const https = require("https");

//const compression = require("compression");

const morgan = require("morgan");

const bodyParser = require("body-parser");

const loginRoutes = require("./routes/login-signup");

const expenseRoutes = require("./routes/expense");

const purchaseRoutes = require("./routes/purchase");

const premiumRoutes = require("./routes/premium");

const forgotPasswordRoutes = require("./routes/forgotpassword");

const User = require("./models/user");

const Expense = require("./models/expense");

const Order = require("./models/order");

const Forgotpassword = require("./models/forgotpassword");

const FileAudit = require("./models/fileaudit");

const app = express();

// const privateKey = fs.readFileSync('server.key');

// const certificate = fs.readFileSync("server.cert");

app.use(bodyParser.json());

app.use(cors());

app.use(helmet());

//app.use(compression());

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" })

app.use(morgan("combined", { stream: accessLogStream }));

devenv.config();

const sequelize = require("./utils/database");

app.use("/user", loginRoutes);

app.use("/password", forgotPasswordRoutes);

app.use("/expense", expenseRoutes);

app.use("/get-premium", purchaseRoutes);

app.use("/premium", premiumRoutes);

User.hasMany(Expense, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});


Expense.belongsTo(User, {
  foreignKey: 'userId'
});


User.hasMany(Order, {
  foreignKey: "userId"
});

Order.belongsTo(User, {
  foreignKey: "userId"
});

User.hasMany(Forgotpassword, {
  onDelete: 'CASCADE',
});

Forgotpassword.belongsTo(User);

User.hasMany(FileAudit, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});

FileAudit.belongsTo(User);

sequelize.sync()
  .then(() => {
    // https.createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3000)
    app.listen(process.env.PORT || 3000)
  })
  .catch(error => {
    console.log("error is ", error)
    console.log(process.env.DATABASE_PASSWORD || 3000)
  })
