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

// Connect
connection.connect(function(err) {
if (err) throw err;
console.log("connected as id " + connection.threadId);
start();
});

// Begin Inquirer
function start(){
    var sql = "SELECT employee.employee_id, employee.first_name, employee.last_name, role.title, department.name, role.salary ";
    sql += "FROM employee JOIN role ON employee.role_id=role.role_id Join department ON role.department_id=department.department_id";
    connection.query(sql, function(err, result){
        if (err) throw err;
        console.table(result);

        inquirer.prompt(
            {
                type: "list",
                message: "Scroll UP or DOWN, press ENTER to select",
                name: "initial",
                choices: ["ADD", "UPDATE ROLE"]
            }   
        ).then((response) => {
            
    
            // Prompt to VIEW
            // if(response.initial === "VIEW"){
            //     inquirer.prompt(
            //         {
            //             type: "list",
            //             message: "Scroll UP or DOWN, press ENTER to view",
            //             name: "view",
            //             choices: ["Department", "Role", "Employee"]
            //         }
            //     ).then((response) => {
            //         if(response.view === "Department"){
            //             connection.query("SELECT * FROM  department", function (err, res){
            //                 if (err) throw err;
                            
            //                 console.table(res);
            //             });
            //         }
            //         else if(response.view === "Role"){
            //             connection.query("SELECT * FROM  role", function (err, res){
            //                 if (err) throw err;
                            
            //                 console.table(res);
            //             });
            //         }
            //         else {
            //             connection.query("SELECT * FROM  employee", function (err, res){
            //                 if (err) throw err;
                            
            //                 console.table(res);
            //             });
            //         }  
            //     })
            // }
            // Prompt for ADD
            if(response.initial === "ADD"){
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
    
                            result = result.map((dep) => {
                                return {name: dep.name, value: dep.department_id}
                            });
                           
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
                                    message: "Scroll UP or DOWN, press ENTER to select a department",
                                    name: "role_department",
                                    choices: result
                                }
                            ]).then((response) => {
                                                            
                                connection.query("INSERT INTO role SET ?",
                                {
                                    title: response.role_title,
                                    salary: response.role_number,
                                    department_id: response.role_department
                                
                                },
                                
                                function(err){
                                    if (err) throw err;
                                    console.log("Inserted 1 row!");
                                })
                            })                         
                        })
                              
                    }
                    else if(response.add === "Employee"){
                        connection.query("SELECT * FROM role", function(err, result){
                            if(err) throw err;
    
                            result = result.map((rol) => {
                                return {name: rol.title, value: rol.role_id}
                            })
                             console.log(result);
                                                                         
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
                                    choices: result
                                }                            
                            ]).then((response) => {
                                connection.query("INSERT INTO employee SET ?",
                                {
                                    first_name: response.employee_firstName,
                                    last_name: response.employee_lastName,
                                    role_id: response.employee_role,
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
                connection.query("SELECT * FROM employee", function(err, result){
                    if(err) throw err;
                    console.log(result)
                    
                    var array = [];
    
                    for (var i = 0; i < result.length; i++){
                        array.push(result[i].title)
                    }
                    
                    inquirer.prompt([
                        {
                            type: "list",
                            message: "Update Employee Role -> Scroll UP or DOWN, press ENTER to select employee",
                            name: "update_employee",
                            choices: result
                        }
                    ]);       
            
                 })
                
            }            
        })   



    })

    
        
}