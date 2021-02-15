SELECT employee.id,role.id,role.salary SUM(salary) as totalSalary          
FROM employee 
INNER JOIN roleSalJoin         
ON employee.id=role.id        
