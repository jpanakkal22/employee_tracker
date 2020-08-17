CREATE DATABASE eTracker_db;

USE eTracker_db;

CREATE TABLE department (
	department_id INT auto_increment,
    name varchar(30) not null,
    primary key(department_id)
);

CREATE TABLE role (
	role_id INT auto_increment,
    title varchar(30) not null,
    salary decimal(8,2) not null,
    department_id INT not null,
    foreign key (department_id) references department(department_id),
    primary key(role_id)
);

CREATE TABLE employee (
	employee_id INT auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id INT not null,
    foreign key (role_id) references role(role_id),
    manager_id INT,
    foreign key (manager_id) references employee(employee_id),
    primary key(employee_id)
);

INSERT INTO department (name) VALUES ("Chemical");
INSERT INTO department (name) VALUES ("Extruding");
INSERT INTO department (name) VALUES ("Packaging");
INSERT INTO department (name) VALUES ("QA");

INSERT INTO role (title, salary, department_id) VALUES ("Supervisor", 100000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Manager", 90000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Engineer", 80000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Operator", 50000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tom", "Hanks", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Smith", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jason", "Jones", 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Lebron", "James", 4, 1);

