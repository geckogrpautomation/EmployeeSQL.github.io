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
const addChoice = ["Add Department","Add Role","Add Employee" , ];

const slctact = {name: "act", type: "rawlist", message:"What do you want to do?" , choices: actChoice, default:"view"};
const slctViewChoice = {name: "act", type: "rawlist", message:"Select which area you would like to view.", choices: viewChoice, default:"View Department"};
const slctViewByChoice = {name: "act", type: "rawlist", message:"Select what you would like to view by", choices: viewByChoice, default:"View Employees by Manager"};
const slctAddChoice = {name: "act", type: "rawlist", message:"Select which area you want to add to.", choices: addChoice, default:"Add Department"};


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

const updEmployee = [

    {name: "upID", type: "input", message:"Input the employee ID you wish to update"},    
    {name: "upEmp_fName", type: "input", message:"What is their first name?"},
    {name: "upEmp_lName", type: "input", message:"What is their last name?"},
    {name: "upEmp_roleid", type: "input", message:"What is their role id?"},
    {name: "upEmp_manID", type: "input", message:"What is their manager's id?"}

];


//Inquirer function
function runInquirer(inputObject){


  inqCount++; 

  inquirer

    .prompt(inputObject)
    .then( a => {   

if (a.viewEmpMang != undefined){
    
    i = "View Employees by Manager Query";  
    p = a.viewEmpMang;

}else if (a.addDept != undefined){    

    i = "Add Department Query";
    p = a.addDept;

}else if (a.addRoleTitle != undefined){    

    i = "Add Role Query";
    p = {title : a.addRoleTitle , salary: a.addRoleSalary , deptID : a.addRoleDept_ID};
}else if(a.addEmp_fName != undefined){

    i = "Add Employee Query";
    p = {fName : a.addEmp_fName , lName: a.addEmp_lName , role_id : a.addEmp_roleID, man_id : a.addEmp_manID };

}else if(a.upID != undefined){

    i = "Update Employee Query";
    p = {upID : a.upID , fName: a.upEmp_fName , lName : a.upEmp_lName, role_id : a.upEmp_roleid, man_id: a.upEmp_manID };

}
else{
    i = a.act;
    p = "";
}

    inqRtn(i,p);
          
    });
}
//End function runInquirer()

function inqRtn(i,p){

    console.log("i - " + i);
    console.log("p - " + p);

switch (i) {
   
    // View Inquirer

    case i = "View":

        runInquirer(slctViewChoice);
                
    break;

   
    case i = "View Department":

        cnctSQL("SELECT * FROM department","s");
        
    break;

    case i = "View Roles":

        cnctSQL("SELECT * FROM role","s");
        
    break;

    case i = "View Employees":

        cnctSQL("SELECT * FROM employee","s");
        
    break;    

 // View By Inquirer

    case i = "View By":

        runInquirer(slctViewByChoice);
        
    break;    

    case i = "View Employees by Manager":
    
        runInquirer(viewEmpMang);
        
    break;

    case i = "View Employees by Manager Query":
        
        cnctSQL(`SELECT * FROM employee WHERE manager_ID = ${p}`,"s");
        
    break;

    case i = "View Total Utilised Budget":
       
        cnctSQL(`SELECT SUM(salary)total_sal FROM employee INNER JOIN role ON employee.role_id = role.id`,"s" );
        
    break;   


 // Add Inquirer   
    
    case i ="Add":

        runInquirer(slctAddChoice);
     
    break;

    case i = "Add Department":

        runInquirer(addDept);
     
    break;

    case i= "Add Department Query":    
    
    console.log()
    console.log(`INSERT INTO department (name) VALUES ('${p}')`,"i"); 

    cnctSQL(`INSERT INTO department (name) VALUES ('${p}')`,"i");
     
    break;

    case i = "Add Role":

        runInquirer(addRole);
     
    break;

    case i = "Add Role Query":
        
    console.log(`INSERT INTO role (title, salary, department_id) VALUES ('${p.title}' , '${p.salary}' , '${p.deptID}')`);        

    cnctSQL(`INSERT INTO role (title, salary, department_id) VALUES ('${p.title}' , '${p.salary}' , '${p.deptID}')`);
 
    break;    

    case i = "Add Employee":

        runInquirer(addEmploy);
     
    break;

    case i = "Add Employee Query":

        cnctSQL(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${p.fName}' , '${p.lName}' , '${p.role_id}' , '${p.man_id}')`);
        
     
    break;

// Update Inquirer    

    case i = "Update":

        runInquirer(updEmployee);

    break;
   
    case i = "Update Employee Query":

        cnctSQL(`UPDATE employee SET first_name = '${p.fName}' , last_name = '${p.lName}' , role_id = '${p.role_id}' , manager_id = '${p.man_id}' WHERE id = '${p.upID}'`); 

    break;

    default:

        console.log(" SQL Function Error");

    break;
}
}

function cnctSQL(query,q){         

    pool.getConnection(function(err, connection) {

        if (err) throw err; // not connected!
      
        // Use the connection
        connection.query(query, function (err, results, fields) {            

            if (err){
                console.log(err);
            }else{
                
                if (q === "s"){

                    let header = "";
                    

                    fields.forEach( (e) => {                           
                        header = header.concat(`| -- ${e.name} -- `)                         
                    });
                    console.log(header);
                    
                    results.forEach( (e) => {     

                        console.log(e);  
                        console.log("____________________________________________________________________________________________");  

                    });
                    }else {

                        console.log("Query OK")
                    }
                 }
        
        connection.release(); 
        // When done with the connection, release it.        
        });
    });
}


//Call Inquirer for the first time when called from the command line.
runInquirer(slctact);