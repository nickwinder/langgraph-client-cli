#!/usr/bin/env node

import { Command } from 'commander';
import { createAssistantsCommand, createThreadsCommand, createRunsCommand, createConfigCommand } from './commands';

const program = new Command();

program
  .name('langgraph-client-cli')
  .description('CLI wrapper for the LangGraph SDK')
  .version('1.0.0');

// Add a global option for verbose output
program.option('-v, --verbose', 'enable verbose output');

program.addCommand(createConfigCommand());
program.addCommand(createAssistantsCommand());
program.addCommand(createThreadsCommand());
program.addCommand(createRunsCommand());

// Show help if no command is provided
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
