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

    { 
        type: "input",
        name: "name",
        message:"Please enter employee's full name."
    },

    { 
        type: "input",
        name: "id",
        message:"What is the employee's ID number?"
    },

    { 
        type: "input",
        name: "email",
        message:"Please enter employee's email address."
    },
    
    { 
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

            
            case "Manager":
                specificQuestions(role, "officeNumber", "Manager's office number?", userInput);
            break;

            
            case "Engineer":
                specificQuestions(role, "github", "Engineer's gitHub Username?", userInput);
            break;

            
            case "Intern":
                specificQuestions(role, "school", "Intern's school name?", userInput);
            break;
        }
    });
}
    
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
}

const writeHTMLtoFile = (html) => {
    fs.writeFile(outputPath, html, function(err) {
        if (err) {
            return console.log(err);
         }
         console.log ("Your team site is complete.")
    });
};

enterEmployeeInfo();