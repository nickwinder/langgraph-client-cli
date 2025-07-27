import { Command } from 'commander';
import { createClient, loadConfig, mergeConfig, handleError } from '../utils';
import { AssistantConfig, AssistantConfigSchema } from '../types/config';

export function createAssistantsCommand(): Command {
  const assistants = new Command('assistants')
    .description('Manage LangGraph assistants');

  assistants
    .command('list')
    .description('List all assistants')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .option('--limit <number>', 'maximum number of assistants to return', '10')
    .option('--offset <number>', 'offset for pagination', '0')
    .action(async (options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const assistants = await client.assistants.search({
          limit: parseInt(options.limit),
          offset: parseInt(options.offset),
        });

        console.log(JSON.stringify(assistants, null, 2));
      } catch (error) {
        handleError(error);
      }
    });

  assistants
    .command('get')
    .description('Get a specific assistant by ID')
    .argument('<assistant_id>', 'assistant ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (assistantId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const assistant = await client.assistants.get(assistantId);

        console.log(JSON.stringify(assistant, null, 2));
      } catch (error) {
        handleError(error);
      }
    });

  assistants
    .command('create')
    .description('Create a new assistant from JSON config')
    .argument('<config_file>', 'path to assistant config JSON file')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (configFile, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const fs = await import('fs');
        const assistantConfigData = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        const assistantConfig: AssistantConfig = AssistantConfigSchema.parse(assistantConfigData);

        const client = createClient(config);
        const assistant = await client.assistants.create(assistantConfig as any);

        console.log(JSON.stringify(assistant, null, 2));
      } catch (error) {
        handleError(error);
      }
    });

  assistants
    .command('delete')
    .description('Delete an assistant by ID')
    .argument('<assistant_id>', 'assistant ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (assistantId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        await client.assistants.delete(assistantId);

        console.log(`Assistant ${assistantId} deleted successfully`);
      } catch (error) {
        handleError(error);
      }
    });

  return assistants;
}