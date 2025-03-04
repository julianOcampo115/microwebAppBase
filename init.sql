CREATE DATABASE myflaskapp;
use myflaskapp;

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255),
    email varchar(255),
    username varchar(255),
    password varchar(255)
);


CREATE TABLE products (
    code int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255),
    quantity varchar(255),
    cost varchar(255),
    bag varchar(255)
);

CREATE TABLE orders (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userName varchar(255),
    userEmail varchar(255),
    saleTotal decimal(10,2),
    date datetime default current_timestamp);


INSERT INTO users VALUES(null, "juan", "juan@gmail.com", "juan", "123"),
    (null, "maria", "maria@gmail.com", "maria", "456");

INSERT INTO products VALUES(null, "Tomates", "4", "500", "yes"),
    (null, "Piñas", "7", "2000", "no");


"WHEN YOU WANT TO USE DOCKER COMPOSE, AND YOU'VE ALREADY PACKAGED THIS APPLICATION, 
 AND THE DATABASE DOESN'T APPEAR OR DOESN'T LOAD, USE THIS OPTION INSTEAD:"

CREATE DATABASE IF NOT EXISTS myflaskapp;
use myflaskapp;

CREATE TABLE IF NOT EXISTS users (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255),
    email varchar(255),
    username varchar(255),
    password varchar(255)
);


CREATE TABLE IF NOT EXISTS products (
    code int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255),
    quantity varchar(255),
    cost varchar(255),
    bag varchar(255)
);

CREATE TABLE IF NOT EXISTS orders (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userName varchar(255),
    userEmail varchar(255),
    saleTotal decimal(10,2),
    date datetime default current_timestamp);


INSERT IGNORE INTO users VALUES
    (null, "juan", "juan@gmail.com", "juan", "123"),
    (null, "maria", "maria@gmail.com", "maria", "456");

INSERT IGNORE INTO products VALUES
    (null, "Tomates", "4", "500", "yes"),
    (null, "Piñas", "7", "2000", "no");
