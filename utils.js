const fs = require("fs")
const chalk = require("chalk");
const inquirer = require("inquirer");

module.exports = {
  getData: (name) => {
    return JSON.parse(fs.readFileSync("./" + name + "\\data.funkyresources"));
  },
  saveData: (name, data) => {
      fs.writeFileSync(`./${name}/data.funkyresources`, JSON.stringify(data))
  }
}