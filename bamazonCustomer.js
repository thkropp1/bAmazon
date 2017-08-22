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
      message: "Choose login: [Customer] or [Quit]",
      choices: ["Customer", "Quit"]
    })
    .then(function(answer) {
      console.log(answer.login);
      // based on their answer, call the appropriate staff function
      switch (answer.login) {
        case 'Customer':
          bamazoncustomer();
          break;
        case 'Quit':
          process.exit( );
          break;
      } // switch case
    }); // function answer
} // start

// prompt for the Customer order information
function bamazoncustomer() {
  inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Enter the Item ID of the product you would like to buy: "
      },
      {
        name: "quantity",
        type: "input",
        message: "Enter the number of units of the product you would like to buy: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false; //
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "SELECT * FROM products WHERE ?", {
          item_id: answer.id
        },
        function(err, res) {
          //console.log("ItemNumber: " + itemNumber);
          console.log(" "); // Blank line
          if ((answer.id >= 1) && (answer.id <= itemNumber)) { // Check for valid Item ID
            if (res[0].stock_quantity >= answer.quantity) {
              connection.query(
                "UPDATE products SET ? WHERE ?", [{
                  stock_quantity: res[0].stock_quantity - answer.quantity,
                }, {
                  item_id: answer.id
                }],
                function(err) {
                  if (err) throw err;
                  console.log(" "); // add a new blank line
                  console.log("Your order was successfully processed!");
                  console.log(" "); // add a new blank line
                  var totalAmount = answer.quantity * res[0].price;
                  console.log("Total order amount: $" + totalAmount.toFixed(2));
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
} // bamazoncustomer
