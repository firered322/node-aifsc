const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const homeRoutes = require('./routes/index')

const app = express();

// Load config
dotenv.config({ path: "./config/config.env" });

connectDB()

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set EJS
app.set("view engine", "ejs");
app.set("views", require("path").join(__dirname, "views"));

// Set static dir
app.use(express.static(require("path").join(__dirname, "public")));

// Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Routes
app.use('', homeRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
