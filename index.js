#! /usr/bin/env node

const { program } = require("commander");

const input = require("./commands/input");

let file = "";
let dependency = "";
const run_input = (options) => {
  if (file.length <= 0) file = options;
  else if (dependency.length <= 0) {
    dependency = options;
    input(file, dependency);
  }
};
// program.command("input <file> <dependency>").description("Input").action(input);
program.option("-i, --input <options1...>", "Input file", run_input);

program.parse();
