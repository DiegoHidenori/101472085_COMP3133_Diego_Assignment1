# COMP 3133 - Full Stack Development II - Assignment 1

## Notes

- Used localhost port 3000 with 'graphql' endpoint

## User Login

query {
login(
username: "newuser"
password: "securepassword"
) {
user {
id
username
email
}
token
}
}

## Create User

mutation {
signup(
username: "newuser"
email: "newuser@example.com"
password: "securepassword"
) {
user {
id
username
email
}
token
}
}

## Get All Employees

query {
employees {
id
first_name
last_name
email
gender
designation
salary
date_of_joining
department
employee_photo
}
}

## Create Employee

mutation {
addEmployee(
first_name: "John"
last_name: "Doe"
email: "john.doe@example.com"
gender: "Male"
designation: "Software Engineer"
salary: 60000
date_of_joining: "2025-02-12"
department: "Engineering"
) {
id
first_name
last_name
email
gender
designation
salary
date_of_joining
department
}
}

## Get Employee By ID

query {
employee(
id: "67ad179ea718654d62df2cba"
) {
id
first_name
last_name
email
gender
designation
}
}

## Update Employee ( ID )

mutation {
updateEmployee(
id: "67ad179ea718654d62df2cba"
first_name: "lalra"
last_name: "gorod"
) {
id
first_name
last_name
email
gender
designation
salary
date_of_joining
department
}
}

## Delete Employee ( ID )

mutation {
deleteEmployee(
id: "67ad179ea718654d62df2cba"
) {
id
first_name
last_name
email
gender
designation
salary
date_of_joining
department
employee_photo
}
}

## Search Employee By Department/Designation

query {
searchEmployees(
department: "Engineering"
) {
id
first_name
last_name
email
designation
department
}
}
