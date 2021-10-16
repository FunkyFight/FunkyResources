const inquirer = require("inquirer")
const utils = require("./utils")

module.exports = {
  main_menu: () => { //Menu principal

    const questions = [
      {
        name: "Main menu",
        type: "input",
        message: "Que devrions nous faire ?\n\n1. Créer un nouveau resource pack.\n2. Exporter le pack de ressources",
        validate: function(value) {
          if(!value.length || !["1", "2"].includes(value)) {
            return "Veuillez répondre à la question."
          } else {
            return true;
          }
          
        }
      }
    ]

    return inquirer.prompt(questions)

  },
  creation_menu: () => { //Menu de création de projet

    const questions = [
      {
        name: "name",
        type: "input",
        message: "Entrez le nom du pack de ressource.",
        validate: function(value) {
          if(!value.length) {
            return "Veuillez répondre à la question."
          } else {
            return true;
          }
          
        }
      },
      {
        name: "description",
        type: "input",
        message: "Entrez la description du pack de resource.",
        validate: function(value) {
          if(!value.length) {
            return "Veuillez répondre à la question."
          } else {
            return true;
          }
          
        }
      }
    ]

    return inquirer.prompt(questions)

  },
  export_menu: () => { //Menu de création de projet

    const questions = [
      {
        name: "name",
        type: "input",
        message: "Entrez le nom du pack de ressource.",
        validate: function(value) {
          if(!value.length) {
            return "Veuillez répondre à la question."
          } else {
            return true;
          }
          
        }
      }
    ]

    return inquirer.prompt(questions)

  }
} 

