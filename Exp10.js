const readline = require("readline");

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Employee data stored in an array
let employees = [
  { name: "Alice", id: "E101" },
  { name: "Bob", id: "E102" },
  { name: "Charlie", id: "E103" }
];

// Display menu
function showMenu() {
  console.log("\nEmployee Management System");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Remove Employee");
  console.log("4. Exit");

  rl.question("\nEnter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        addEmployee();
        break;
      case "2":
        listEmployees();
        break;
      case "3":
        removeEmployee();
        break;
      case "4":
        console.log("Exiting program...");
        rl.close();
        break;
      default:
        console.log("Invalid choice, try again.");
        showMenu();
    }
  });
}

// Add new employee
function addEmployee() {
  rl.question("Enter employee name: ", (name) => {
    rl.question("Enter employee ID: ", (id) => {
      employees.push({ name, id });
      console.log(`Employee ${name} (ID: ${id}) added successfully.`);
      showMenu();
    });
  });
}

// List all employees
function listEmployees() {
  if (employees.length === 0) {
    console.log("No employees found.");
  } else {
    console.log("\nEmployee List:");
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. Name: ${emp.name}, ID: ${emp.id}`);
    });
  }
  showMenu();
}

// Remove employee by ID
function removeEmployee() {
  rl.question("Enter employee ID to remove: ", (id) => {
    const index = employees.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      const removed = employees.splice(index, 1)[0];
      console.log(`Employee ${removed.name} (ID: ${removed.id}) removed successfully.`);
    } else {
      console.log("Employee not found.");
    }
    showMenu();
  });
}

// Start program
showMenu();
