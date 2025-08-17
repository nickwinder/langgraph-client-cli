#!/usr/bin/env node

import { Command } from 'commander';
import { createAssistantsCommand, createThreadsCommand, createRunsCommand, createConfigCommand, createStoreCommand } from './commands';
import { getVersion } from './utils';

const program = new Command();

program
  .name('langgraph-client-cli')
  .description('CLI wrapper for the LangGraph SDK')
  .version(getVersion());

// Add a global option for verbose output
program.option('-v, --verbose', 'enable verbose output');

program.addCommand(createConfigCommand());
program.addCommand(createAssistantsCommand());
program.addCommand(createThreadsCommand());
program.addCommand(createRunsCommand());
program.addCommand(createStoreCommand());

// Show help if no command is provided
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
