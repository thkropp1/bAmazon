var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");

var itemNumber = 0; // Number of items in the table

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "tkropp",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

function displayTable() { // Displays the products' stock inventory
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    //console.log(res);
    itemNumber = res.length; // Keep track of the number of items in the table
    var inventoryArr = [];
    for (var i = 0; i < res.length; i++) {
      var values = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity];
      inventoryArr.push(values);
    }
    // Display the products' stock inventory
    console.log(" "); // Blank line
    console.table(['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity Available'], inventoryArr);
    start(); // Call to prompt user for what action they should take
  }); // connection query
} // function displayTable

displayTable(); // Call the function to display the inventory and get the user's inputs

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "login",
      type: "list",
      message: "Choose login: [Manager] or [Quit]",
      choices: ["Manager", "Quit"]
    })
    .then(function(answer) {
      console.log(answer.login);
      // based on their answer, call the appropriate staff function
      switch (answer.login) {
        case 'Manager':
          bamazonmanager();
          break;
        case 'Quit':
          process.exit();
          break;
      } // switch case
    }); // function answer
} // start

function bamazonmanager() {
  inquirer.prompt({
    name: "menu",
    type: "list",
    message: "Menu Options:",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
  }).then(function(answer) {
    console.log(answer.menu);
    // based on their answer, call the appropriate staff function
    switch (answer.menu) {
      case 'View Products for Sale':
        displayTable();
        break;
      case 'View Low Inventory':
        lowInventory();
        break;
      case 'Add to Inventory':
        addInventory();
        break;
      case 'Add New Product':
        createProduct();
        break;
      case 'Quit':
        process.exit();
        break;
    } // switch case
  }); // function answer
} // bamazonsupervisor

// Check for stock_quantity < 5
function lowInventory() {
  //console.log("Check for low inventory(stock quantity < 5):\n");
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
    if (err) throw err;
    // Display all results of the SELECT statement
    //console.log(res);
    var inventoryArr = [];
    for (var i = 0; i < res.length; i++) {
      var values = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity];
      inventoryArr.push(values);
    } // for

    if (inventoryArr) { // List products with stock quantity < 5
      // Display the products' stock inventory
      console.log(" "); // Blank line
      console.table(['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity < 5'], inventoryArr);
    } else { // Display message that there are no products with low inventory
      console.log(" "); // Blank line
      console.log("There are no products with low inventory(stock quantity < 5).");
      console.log(" "); // Blank line
    }
    displayTable(); // Display the table
  }); // connection.query
} // function lowInventory

// Add inventory to existing product table
function addInventory() {
  inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Enter the Item ID of the product you would like to add inventory: ",
      },
      {
        name: "quantity",
        type: "input",
        message: "Enter the quantity of the product you would like to add: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "SELECT * FROM products WHERE ?", {
          item_id: answer.id
        },
        function(err, res) {
          //console.log("Res.length: " + res.length);
          if ((answer.id >= 1) && (answer.id <= itemNumber)) { // Check for valid Item ID
            //console.log("Quantity is: " + answer.quantity);
            if (Number.isInteger(parseInt(answer.quantity))) { // Make sure input is an integer
              connection.query(
                "UPDATE products SET ? WHERE ?", [{
                  stock_quantity: res[0].stock_quantity + parseInt(answer.quantity),
                }, {
                  item_id: answer.id
                }],
                function(err) {
                  if (err) throw err;
                  console.log(" "); // add a new blank line
                  console.log("Adding inventory was successfully processed!");
                  console.log(" "); // add a new blank line
                  var totalInventory = res[0].stock_quantity + parseInt(answer.quantity);
                  console.log(" "); // add a new blank line
                  console.log("Total inventory amount for Item ID# " + answer.id + " is now: " + parseInt(totalInventory));
                  console.log(" "); // add a new blank line
                  // re-prompt the user if they want to buy more products
                  displayTable(); // Call the function to display the inventory and get the user's inputs
                }); // connection query
            } else {
              console.log(" "); // add a new blank line
              console.log("Invalid stock quantity. Please try again.");
              console.log(" "); // add a new blank line
              displayTable(); // Call the function to display the inventory and get the user's inputs
            } // if res[0].stock_quantity
          } else {
            console.log(" "); // add a new blank line
            console.log("Invalid Item ID. Please try again.");
            console.log(" "); // add a new blank line
            displayTable(); // Call the function to display the inventory and get the user's inputs
          } // if answer.id
        }); // connection query
    }); // function answer
} // addInventory

// Create new product and add it to the products table
function createProduct() {
  inquirer.prompt([{
        name: "name",
        type: "input",
        message: "Enter the name of the new product you would like to add: "
      },
      {
        name: "dept",
        type: "input",
        message: "Enter the department name of the new product: "
      },
      {
        name: "price",
        type: "input",
        message: "Enter the price of the new product: "
      },
      {
        name: "quantity",
        type: "input",
        message: "Enter the quantity of the new product you would like to add: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      //console.log(answer);
      if (answer.name !== '' && answer.dept !== '' && answer.price !== '' && answer.quantity !== '') {
        console.log(" "); // add a new blank line
        console.log("Inserting a new product...\n");
        connection.query(
          "INSERT INTO products SET ?", {
            product_name: answer.name,
            department_name: answer.dept,
            price: answer.price,
            stock_quantity: parseInt(answer.quantity)
          },
          function(err, res) {
            if (err) throw err;
            console.log(" "); // add a new blank line
            console.log("Adding new product ''" + answer.name + "' was successfully processed!");
            console.log(" "); // add a new blank line
            // Display the table of products
            displayTable(); // Call the function to display the inventory and get the user's inputs
          }); // connection query
      } else {
        console.log(" "); // add a new blank line
        console.log("Error: Please enter data for each prompt(do not leave any blank).");
        displayTable(); // Call the function to display the inventory and get the user's inputs
      }
    }); // function answer

} // createProduct
