const Manager = require("./Develop/lib/Manager");
const Engineer = require("./Develop/lib/Engineer");
const Intern = require("./Develop/lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./Develop/lib/htmlRenderer");

const employeesInfo = [];

const enterEmployeeInfo = () => {

inquirer.prompt([

    { //Name
        type: "input",
        name: "name",
        message:"Please enter employee's full name."
    },

    { //ID Number
        type: "input",
        name: "id",
        message:"What is the employee's ID number?"
    },

    { //Email
        type: "input",
        name: "email",
        message:"Please enter employee's email address."
    },
    
    { //Role
        type: "list",
        name: "role",
        message:"What is the employee's job title?",
        choices: [
            "Manager",
            "Engineer",
            "Intern"]
    },

])
.then(userInput => {
            const { role } = userInput;

        switch(role) {

            //Manager Office Number
            case "Manager":
                specificQuestions(role, "officeNumber", "Manager's office number?", userInput);
            break;

            //Engineer Github
            case "Engineer":
                specificQuestions(role, "github", "Engineer's gitHub Username?", userInput);
            break;

            //Intern School
            case "Intern":
                specificQuestions(role, "school", "Intern's school name?", userInput);
            break;
        }
    });
}
    //Questions for specific roles.
const specificQuestions = (role, inputType, message, userInput) => {
        inquirer.prompt ([
                {
                    type: "input",
                    name: inputType,
                    message: message
                }
            ])

        .then(answers => {
            let answer;

            for (let key in answers) {
                answer = answers[key];
            }
            const { name, id, email } = userInput;
            let employee;
            
            switch(role) {
                case "Manager":
                    employee = new Manager(name, id, email, answer);
                break;

                case "Engineer":
                    employee = new Engineer(name, id, email, answer);
                break;

                case "Intern":
                    employee = new Intern(name, id, email, answer);
                break;
            }
            employeesInfo.push(employee);
            addEmployee();
        });

}
const addEmployee = () => {

    inquirer.prompt ([

        {
            type: "confirm",
            name: "addAnother",
            message:"Would you like to add another employee?" 
        }
    ])
                  
    .then(answer => {
        if (answer.addAnother === true) {
            enterEmployeeInfo();
        }
        else {
            const html = render(employeesInfo);
            writeHTMLtoFile(html);
        }
    });
}   // After the user has input all employees desired, call the `render` function (required
    // above) and pass in an array containing all employee objects; the `render` function will
    // generate and return a block of HTML including templated divs for each employee!

const writeHTMLtoFile = (html) => {
    fs.writeFile(outputPath, html, function(err) {
        if (err) {
            return console.log(err);
         }
         console.log ("Your team HTML file is complete.")
    });
};

enterEmployeeInfo();