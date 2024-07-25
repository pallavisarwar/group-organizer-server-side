CREATE TABLE Groups (
GroupId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
Title varchar(100) UNIQUE,
Description varchar(500),
ImageURL varchar(200)
)