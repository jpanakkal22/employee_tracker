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
    password: "Contigo%5",
    database: "eTracker_db"
});

var questions = [
    {
        type: "list",
        message: "Scroll UP or DOWN, press ENTER to select",
        name: "initial",
        choices: ["ADD", "VIEW", "UPDATE ROLE"]
    }
   
]

// Connect
connection.connect(function(err) {
if (err) throw err;
console.log("connected as id " + connection.threadId);
start();
});

// connection.query("SELECT * FROM department", function(err, result){
//     if(err) throw err;})
//     console.log(result);
//     // var newArray = result.map((department) => department.department_id);
//     // console.log(newArray);
   

//     inquirer.prompt(
//         {
//             type: "list",
//             message: "Choose a department",
//             name: "role_department",
//             choices: result
//         }
//     ).then((response) => {
//         console.log(response);  
            
        
//     });
// });

// Begin Inquirer
function start(){
    inquirer.prompt(questions).then((response) => {
        console.log(response.initial);
        // Prompt to VIEW
        if(response.initial === "VIEW"){
            inquirer.prompt(
                {
                    type: "list",
                    message: "Scroll UP or DOWN, press ENTER to view",
                    name: "view",
                    choices: ["Department", "Role", "Employee"]
                }
            ).then((response) => {
                if(response.view === "Department"){
                    connection.query("SELECT * FROM  department", function (err, res){
                        if (err) throw err;
                        
                        console.table(res);
                    });
                }
                else if(response.view === "Role"){
                    connection.query("SELECT * FROM  role", function (err, res){
                        if (err) throw err;
                        
                        console.table(res);
                    });
                }
                else {
                    connection.query("SELECT * FROM  employee", function (err, res){
                        if (err) throw err;
                        
                        console.table(res);
                    });
                }  
            })
        }
        // Prompt for ADD
        else if(response.initial === "ADD"){
            inquirer.prompt(
                {
                    type: "list",
                    message: "Scroll UP or DOWN, press ENTER to select",
                    name: "add",
                    choices: ["Department", "Role", "Employee"]
                }
            ).then((response) => {
                if(response.add === "Department"){
                    inquirer.prompt(
                        {
                            type: "input",
                            message: "Enter department name",
                            name: "department_name"
                        }
                    ).then((response) => {
                        connection.query("INSERT INTO department SET ?",
                        {name: response.department_name},
                        
                        function(err){
                            if (err) throw err;
                            console.log("Inserted 1 row!");
                        })
                    })
                }
                else if(response.add === "Role"){ 
                    connection.query("SELECT * FROM department", function(err, result){
                        if(err) throw err;
                        console.log(result);

                        inquirer.prompt([
                            {
                                type: "input",
                                message: "Enter title",
                                name: "role_title"
                            },
                            {
                                type: "number",
                                message: "Enter salary from 0 to 999999.00",
                                name: "role_number"
                            },
                            {
                                type: "list",
                                message: "Scroll UP or DOWN, press ENTER to select",
                                name: "role_department",
                                choices: result
                            }
                        ]).then((response) => {
                            connection.query("INSERT INTO role SET ?",
                            {
                                title: response.role_title,
                                salary: response.role_number,
                                department_id: 1
                            
                            },
                            
                            function(err){
                                if (err) throw err;
                                console.log("Inserted 1 row!");
                            })
                        })                         
                    })
                          
                }
                else if(response.add === "Employee"){
                    connection.query("SELECT title FROM role", function(err, result){
                        if(err) throw err;
                        
                        var array = [];

                        for (var i = 0; i < result.length; i++){
                            array.push(result[i].title)
                        }
                                               
                        inquirer.prompt([
                            {
                                type: "input",
                                message: "Enter employee first name",
                                name: "employee_firstName"
                            },{
                                type: "input",
                                message: "Enter employee last name",
                                name: "employee_lastName"
                            },{
                                type: "list",
                                message: "Scroll UP or DOWN, press ENTER to select employee role",
                                name: "employee_role",
                                choices: array
                            }                            
                        ]).then((response) => {
                            connection.query("INSERT INTO employee SET ?",
                            {
                                first_name: response.employee_firstName,
                                last_name: response.employee_lastName,
                                role_id: 1,
                                manager_id: 1                            
                            },
                            
                            function(err){
                                if (err) throw err;
                                console.log("Inserted 1 row!");
                            })
                        })                              
                    })

                }
            })
        }
        // Prompt for UPDATE ROLE
        else {
            inquirer.prompt();
        }            
    })   
        
 }