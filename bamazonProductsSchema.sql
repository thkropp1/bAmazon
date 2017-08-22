CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    stock_quantity INTEGER,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("toothpaste", "personal care", "1.65", "90");

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("toothbrush", "personal care", "1.00", "80");

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("floss", "personal care", ".90", "10");

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("mouthwash", "personal care", "1.25", "60");

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("plates", "kitchenware", "5.00", "50");

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("knives", "kitchenware", "2.50", "25");

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("spoon", "kitchenware", "2.50", "25");

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("forks", "kitchenware", "2.50", "25");

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("pencils", "office supplies", "2.50", "30");

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("pens", "office supplies", "2.50", "25");






