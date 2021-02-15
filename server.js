const inquirer = require("inquirer");
const fs = require("fs");
//const obj = require("./objClass");
const path = require('path');

//Define file paths
let pkgPath = path.join(__dirname, "/pkgLog.JSON");
let orgPath = path.join(__dirname, "/orgChart.JSON");

const mysql = require('mysql'); 

const pool  = mysql.createPool({
    connectionLimit : 2,
    host            : 'localhost',
    user            : 'root',
    password        : 'RmkL!CB~x2t>D;Y>%9-B_nnD',
    database        : 'employee'
    });


//Count how many time inquirer has run
let inqCount = 0;

//Define inquirer choices constants.
const actChoice =["View", "View By" , "Add", "Update"];
const viewChoice = ["View Department","View Roles","View Employees"];
const viewByChoice = ["View Employees by Manager" , "View Total Utilised Budget"];
const addChoice = ["Add Department","Add Role","Add Employees" , ];
const updtChoice = ["Update Employee Roles", "Update Employee Managers"];

const slctact = {name: "act", type: "rawlist", message:"What do you want to do?" , choices: actChoice, default:"view"};
const slctViewChoice = {name: "act", type: "rawlist", message:"Select which area you would like to view.", choices: viewChoice, default:"View Department"};
const slctViewByChoice = {name: "act", type: "rawlist", message:"Select what you would like to view by", choices: viewByChoice, default:"View Employees by Manager"};
const slctAddChoice = {name: "act", type: "rawlist", message:"Select which area you want to add to.", choices: addChoice, default:"Add Department"};
const slctUpdtChoice = {name: "act", type: "rawlist", message:"Select which area you wish to update.", choices:updtChoice, default:"Update Employee Roles"};

const viewEmpMang = {name: "viewEmpMang", type: "input", message:"Input manager to find which employees are under them."};

const addDept = {name: "addDept", type: "input", message:"Input the department you want to add."};


const addRole = [

    {name: "addRoleTitle", type: "input", message:"What is the title?"},
    {name: "addRoleSalary", type: "input", message:"What is the salary?"},
    {name: "addRoleDept_ID", type: "input", message:"What is the department id?"},

];

const addEmploy = [

    {name: "addEmp_fName", type: "input", message:"What is their first name?"},
    {name: "addEmp_lName", type: "input", message:"What is their last name?"},
    {name: "addEmp_roleID", type: "input", message:"What is their role id?"},
    {name: "addEmp_manID", type: "input", message:"What is their manager's id?"}

];

const updEmployRole = [

    {name: "upEmp", type: "input", message:"Input the employee you wish to update"},
    {name: "upEmp", type: "input", message:"Input the employee you want to add."},
    {name: "upEmp_fName", type: "input", message:"What is their first name?"},
    {name: "upEmp_lName", type: "input", message:"What is their last name?"},
    {name: "upEmp_roleID", type: "input", message:"What is their role id?"},
    {name: "upEmp_manID", type: "input", message:"What is their manager's id?"}

];


//Inquirer function
function runInquirer(inputObject){

  inqCount++; 

  inquirer

    .prompt(inputObject)
    .then( a => {   

if (a.viewEmpMang != undefined){

    a = "View Employees by Manager Query";  
    p = a.viewEmpMang;

}else if (a.addDept != undefined){    

    a = "Add Department Query";
    p = a.addDept;

}else if (a.addRole != undefined){    

    a = "Add Role Query";
    p = {title : a.addRoleTitle , salary: a.addRoleSalary , DeptID : a.addRoleDept_ID};
}
else{
    a = a.act;
    p = "";
}

    inqRtn(a,q);
          
    });
}
//End function runInquirer()

function inqRtn(a,p){

    console.log("a - " + a);
    console.log("q - " + p);

switch (a) {
   
    // View Inquirer

    case a = "View":

        runInquirer(slctViewChoice);
        console.log("view ran");
        
    break;

   
    case a = "View Department":

        cnctSQL("SELECT * FROM department");
        
    break;

    case a = "View Roles":

        cnctSQL("SELECT * FROM role");
        
    break;

    case a = "View Employees":

        cnctSQL("SELECT * FROM employee");
        
    break;    

 // View By Inquirer

    case a = "View By":

        runInquirer(slctViewByChoice);
        
    break;    

    case a = "View Employees by Manager":
    
        runInquirer(viewEmpMang);
        
    break;

    case a = "View Employees by Manager Query":
        
        cnctSQL(`SELECT * FROM employee WHERE manager_ID = ${p}`);
        
    break;

    case a = "View Total Utilised Budget":
       
        cnctSQL(`SELECT SUM(salary)total_sal FROM employee INNER JOIN role ON employee.role_id = role.id` );
        
    break;   


 // Add Inquirer   
    
    case a ="Add":

        runInquirer(slctAddChoice);
     
    break;

    case a = "Add Department":

        runInquirer(addDept);
     
    break;

    case a= "Add Department Query":        

        cnctSQL(`INSERT INTO department (name) VALUES ('${p}')`);
     
    break;

    case a = "Add Role":

        runInquirer(addRole);
     
    break;

    case a= "Add Role Query":        

    cnctSQL(`INSERT INTO role (title, salary, department_id) VALUES ('${p.title}' , '${p.salary}' , ${p.DeptID}')`);
 
    break;    

    case a = "Add Employee":

        runInquirer(addEmploy);
     
    break;

    case a = "Add Employee Query":

        runInquirer(addDept);
     
    break;

    case a = "Update Employee Managers":

        runInquirer(addDept);
     
    break;

// Update Inquirer    

    case a = "Update":

        runInquirer(slctUpdtChoice) 

    case a != undefined:

        cnctSQL(`SELECT ${a.viewEmpMang} FROM department`);
        
    break;


    default:
        console.log("error sdjlkfhasdk");
    break;
}
}

function cnctSQL(query){         

    pool.getConnection(function(err, connection) {

        if (err) throw err; // not connected!
      
        // Use the connection
        connection.query(query, function (err, results, fields) {            

            if (err){
                console.log(err);
            }else{

                results.forEach( (e) => {   

                    console.log(e);  
                    console.log("____________________________________________________________________________________________");  
                });

            }
        
        connection.release(); 
        // When done with the connection, release it.        
        });
    });
}


//Call Inquirer for the first time when called from the command line.
runInquirer(slctact);

