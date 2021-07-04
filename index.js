// dependencies
const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

// start DB connection
db.connect((err) => {
  if (err) throw err;
  console.log(
    `
        ==========================
             Employee Tracker
        ==========================
        `
  );
  // Call start function
  startPrompt();
});

// Start/Main User Prompts
function startPrompt() {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Please choose an action.",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          getAllDepartments();
          break;
        case "View all roles":
          getAllRoles();
          break;
        case "View all employees":
          getAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployee();
          break;
      }
    });
}

// ============== DB Query Functions ==============

// View All Departments
function getAllDepartments() {
  const sql = `SELECT departments.name AS Department, 
                 departments.id AS Department_ID 
                 FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log("\n");
    console.table(rows);
    startPrompt();
  });
}

// View All Roles
function getAllRoles() {
  const sql = `SELECT roles.title AS Title,
                 roles.id AS Role_ID,
                 departments.name AS Department_Name,
                 roles.salary AS Salary
                 FROM roles 
                 JOIN departments
                 ON roles.department_id = departments.id
                 `;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    startPrompt();
  });
}

// View All Employees
function getAllEmployees() {
  const sql = `SELECT employees.id AS Employee_ID,
                 employees.first_name AS First_Name,
                 employees.last_name AS Last_Name,
                 roles.title AS Title,
                 departments.name AS Department_Name,
                 roles.salary AS Salary,
                 CONCAT(m.first_name, ' ' ,  m.last_name) AS Manager
                 FROM employees 
                 JOIN roles
                 ON employees.role_id = roles.id
                 JOIN departments
                 ON roles.department_id = departments.id
                 LEFT JOIN employees m on employees.manager_id = m.id
                 ORDER BY employees.id
                 `;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    startPrompt();
  });
}

// Add a Department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the department you would like to add?",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO departments SET ?`,
        {
          name: answer.name,
        },
        function (err) {
          if (err) throw err;
          console.table(answer);
          startPrompt();
        }
      );
    });
}

// Add a Role
function addRole() {
  db.query(`SELECT * FROM departments`, (err, res) => {
    let departments = [];
    for (var i = 0; i < res.length; i++) {
      departments.push(res[i].name);
    }
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of the new role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for the new role?",
        },
        {
          name: "department",
          type: "list",
          message: "What department is the role in?",
          choices: departments,
        },
      ])
      .then((answer) => {
        var departmentId = departments.indexOf(answer.department) + 1;
        db.query(
          `INSERT INTO roles SET ?`,
          {
            title: answer.title,
            salary: answer.salary,
            department_id: departmentId,
          },
          function (err) {
            if (err) throw err;
            console.table(answer);
            startPrompt();
          }
        );
      });
  });
}

// Select Functions for Role and Manager for addEmployee function
// Select Role
let rolesArr = [];
function selectRole() {
  db.query(`SELECT * FROM roles`, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      rolesArr.push(res[i].title);
    }
  });
  return rolesArr;
}

// Select Manager
let employeeArr = [];
function selectManager() {
  db.query(`SELECT * FROM employees`, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      employeeArr.push(res[i].first_name + " " + res[i].last_name);
    }
    employeeArr.push("null");
  });
  return employeeArr;
}

// Add an Employee
function addEmployee() {
  //grab all roles
  let rolesArray = [];
  let employeeArray = [];
  db.query(`SELECT * FROM roles`, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
    }
    //once we pushed everyone in, let's do the same with employeeArray
    db.query(`SELECT * FROM employees`, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        employeeArray.push(res[i].first_name + " " + res[i].last_name);
      }
      addPrompts();
    });
  });
  function addPrompts() {
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the first name of the employee?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the last name of the employee?",
        },
        {
          name: "role",
          type: "list",
          message: "What is the role of the employee?",
          choices: selectRole(),
        },
        {
          name: "manager",
          type: "list",
          message: "What employee will manage the new employee?",
          choices: selectManager(),
        },
      ])
      .then((answer) => {
        let roleId = selectRole().indexOf(answer.role) + 1;
        let managerId = selectManager().indexOf(answer.manager) + 1;
        db.query(
          `INSERT INTO employees SET ?`,
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: roleId,
            manager_id: managerId,
          },
          function (err) {
            if (err) throw err;
            console.table(answer);
            startPrompt();
          }
        );
      });
  }
}

// Update Employee Role
function updateEmployee() {
  //grab all roles
  let rolesArray = [];
  let employeeArray = [];
  db.query(`SELECT * FROM roles`, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
    }
    //once we pushed everyone in, let's do the same with employeeArray
    db.query(`SELECT * FROM employees`, (err, res) => {
      for (var i = 0; i < res.length; i++) {
        employeeArray.push(res[i].first_name + " " + res[i].last_name);
      }
      updatePrompts();
    });
  });
  function updatePrompts() {
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Select an employee.",
          choices: employeeArray,
        },
        {
          name: "role",
          type: "list",
          message: "Select a new role for the employee.",
          choices: rolesArray,
        },
      ])
      .then((answer) => {
        let employeeId = employeeArray.indexOf(answer.employee) + 1;
        let roleId = rolesArray.indexOf(answer.role) + 1;
        db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [
          roleId,
          employeeId,
        ]),
          console.table(answer);
        startPrompt();
      });
  }
}
