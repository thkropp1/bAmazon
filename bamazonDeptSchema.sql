
CREATE TABLE departments (
    dept_id INTEGER AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10,2),
    PRIMARY KEY (item_id)
);

SELECT * FROM departments;

INSERT INTO departments (dept_name, over_head_costs) 
VALUES ("personal care", "2000");

INSERT INTO departments (dept_name, over_head_costs) 
VALUES ("kitchenware", "3000");

INSERT INTO departments (dept_name, over_head_costs) 
VALUES ("office supplies", "1500");

INSERT INTO departments (dept_name, over_head_costs) 
VALUES ("clothing", "5000");





