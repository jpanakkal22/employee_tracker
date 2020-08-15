// Require dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Create mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",  
    // Remember to enter your password!
    password: "",
    database: "eTracker_db"
});

// Connect
connection.connect(function(err) {
if (err) throw err;
console.log("connected as id " + connection.threadId);
connection.end();
});