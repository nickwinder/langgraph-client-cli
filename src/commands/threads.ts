import { Command } from 'commander';
import { createClient, loadConfig, mergeConfig } from '../utils';
import { ThreadConfig, ThreadConfigSchema } from '../types/config';

export function createThreadsCommand(): Command {
  const threads = new Command('threads')
    .description('Manage LangGraph threads');

  threads
    .command('list')
    .description('List all threads')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .option('--limit <number>', 'maximum number of threads to return', '10')
    .option('--offset <number>', 'offset for pagination', '0')
    .action(async (options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const threads = await client.threads.search({
          limit: parseInt(options.limit),
          offset: parseInt(options.offset),
        });

        console.log(JSON.stringify(threads, null, 2));
      } catch (error) {
        console.error('Error listing threads:', error);
        process.exit(1);
      }
    });

  threads
    .command('get')
    .description('Get a specific thread by ID')
    .argument('<thread_id>', 'thread ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (threadId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const thread = await client.threads.get(threadId);

        console.log(JSON.stringify(thread, null, 2));
      } catch (error) {
        console.error('Error getting thread:', error);
        process.exit(1);
      }
    });

  threads
    .command('create')
    .description('Create a new thread')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .option('--thread-id <id>', 'custom thread ID')
    .option('--metadata <json>', 'thread metadata as JSON string')
    .option('--if-exists <action>', 'action if thread exists (raise|do_nothing)', 'raise')
    .action(async (options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const threadConfig: ThreadConfig = {};

        if (options.ifExists) {
          threadConfig.ifExists = options.ifExists as 'raise' | 'do_nothing';
        }

        if (options.metadata) {
          threadConfig.metadata = JSON.parse(options.metadata);
        }

        const validatedConfig = ThreadConfigSchema.parse(threadConfig);

        const createPayload: { threadId?: string; metadata?: Record<string, unknown>; ifExists?: 'raise' | 'do_nothing' } = {};
        
        if (options.threadId) {
          createPayload.threadId = options.threadId;
        }
        
        if (validatedConfig.metadata) {
          createPayload.metadata = validatedConfig.metadata;
        }
        
        if (validatedConfig.ifExists) {
          createPayload.ifExists = validatedConfig.ifExists;
        }

        const client = createClient(config);
        const thread = await client.threads.create(createPayload);

        console.log(JSON.stringify(thread, null, 2));
      } catch (error) {
        console.error('Error creating thread:', error);
        process.exit(1);
      }
    });

  threads
    .command('delete')
    .description('Delete a thread by ID')
    .argument('<thread_id>', 'thread ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (threadId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        await client.threads.delete(threadId);

        console.log(`Thread ${threadId} deleted successfully`);
      } catch (error) {
        console.error('Error deleting thread:', error);
        process.exit(1);
      }
    });

  threads
    .command('state')
    .description('Get thread state')
    .argument('<thread_id>', 'thread ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (threadId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const state = await client.threads.getState(threadId);

        console.log(JSON.stringify(state, null, 2));
      } catch (error) {
        console.error('Error getting thread state:', error);
        process.exit(1);
      }
    });

  return threads;
}