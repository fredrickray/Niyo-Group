const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { errorHandler, routeNotFound } = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
const indexRouter = require("./routes/index");
// const passport = require("passport")

dotenv.config();
const port = process.env.PORT || 5040;

connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests")
    })
})

const app = express();

app.get('/', (req, res) => {
    res.send({
        success: true,
        message: "Server is live and running"
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/api", indexRouter);

app.use(routeNotFound);

app.use(errorHandler);