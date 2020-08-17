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

        // Console.table
        console.table(result);

        inquirer.prompt(
            {
                type: "list",
                message: "Scroll UP or DOWN, press ENTER to select",
                name: "initial",
                choices: ["ADD", "UPDATE ROLE"]
            }   
        ).then((response) => {           
    
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
                                start();
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
                                    start();
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
                                    start();
                                })
                            })                              
                        })
    
                    }
                })
            }
            // Prompt for UPDATE ROLE
            else {
                connection.query("SELECT employee.employee_id, employee.first_name, employee.last_name, employee.role_id, role.title FROM employee JOIN role ON employee.role_id=role.role_id", function(err, result){
                    if(err) throw err;
                    
                    var names = result.map((name) => {
                        return {name: `${name.first_name + " " + name.last_name}`, value: name.employee_id}
                    })

                    var roles = result.map((rol) => {
                        return {name: rol.title, value: rol.role_id}
                    })
                    console.log(names);
                    console.log(roles);
                    
                    inquirer.prompt([
                        {
                            type: "list",
                            message: "Scroll UP or DOWN, press ENTER to select employee",
                            name: "update_employee",
                            choices: names
                        },{
                            type: "list",
                            message: "Scroll UP or DOWN, press ENTER to select NEW role",
                            name: "update_role",
                            choices: roles
                        }
                    ]).then((response) => {
                        connection.query("UPDATE employee SET ? WHERE ?",
                        [
                            {
                                role_id: response.update_role
                            },
                            {
                                employee_id: response.update_employee
                            }
                        ],
                        function(error) {
                            if(error) throw error;
                            console.log("Updated role!");
                            start();
                        });
                    })             
                })                
            }            
        })
    })        
}