import { Command } from 'commander';
import { createClient, loadConfig, mergeConfig } from '../utils';
import { RunConfig, RunConfigSchema } from '../types/config';

export function createRunsCommand(): Command {
  const runs = new Command('runs')
    .description('Manage LangGraph runs');

  runs
    .command('list')
    .description('List runs for a thread')
    .argument('<thread_id>', 'thread ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .option('--limit <number>', 'maximum number of runs to return', '10')
    .option('--offset <number>', 'offset for pagination', '0')
    .action(async (threadId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const runs = await client.runs.list(threadId, {
          limit: parseInt(options.limit),
          offset: parseInt(options.offset),
        });

        console.log(JSON.stringify(runs, null, 2));
      } catch (error) {
        console.error('Error listing runs:', error);
        process.exit(1);
      }
    });

  runs
    .command('get')
    .description('Get a specific run by ID')
    .argument('<thread_id>', 'thread ID')
    .argument('<run_id>', 'run ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (threadId, runId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const run = await client.runs.get(threadId, runId);

        console.log(JSON.stringify(run, null, 2));
      } catch (error) {
        console.error('Error getting run:', error);
        process.exit(1);
      }
    });

  runs
    .command('create')
    .description('Create a new run')
    .argument('<thread_id>', 'thread ID')
    .argument('<assistant_id>', 'assistant ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .option('--input <json>', 'run input as JSON string')
    .option('--config-data <json>', 'run config as JSON string')
    .option('--metadata <json>', 'run metadata as JSON string')
    .option('--multitask-strategy <strategy>', 'multitask strategy (reject|interrupt|rollback)')
    .option('--stream-mode <mode>', 'stream mode (values|updates|debug|messages)')
    .action(async (threadId, assistantId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const runConfig: RunConfig = {};

        if (options.input) {
          runConfig.input = JSON.parse(options.input);
        }

        if (options.configData) {
          runConfig.config = JSON.parse(options.configData);
        }

        if (options.metadata) {
          runConfig.metadata = JSON.parse(options.metadata);
        }

        if (options.multitaskStrategy) {
          runConfig.multitaskStrategy = options.multitaskStrategy as 'reject' | 'interrupt' | 'rollback';
        }

        if (options.streamMode) {
          runConfig.streamMode = options.streamMode as 'values' | 'updates' | 'debug' | 'messages';
        }

        const validatedConfig = RunConfigSchema.parse(runConfig);

        const createPayload: { input?: Record<string, unknown> | null; config?: Record<string, unknown> | null; metadata?: Record<string, unknown> | null; multitaskStrategy?: 'reject' | 'interrupt' | 'rollback' | null; streamMode?: 'values' | 'updates' | 'debug' | 'messages' | null } = {};
        
        if (validatedConfig.input !== undefined) {
          createPayload.input = validatedConfig.input;
        }
        
        if (validatedConfig.config !== undefined) {
          createPayload.config = validatedConfig.config;
        }
        
        if (validatedConfig.metadata !== undefined) {
          createPayload.metadata = validatedConfig.metadata;
        }
        
        if (validatedConfig.multitaskStrategy !== undefined) {
          createPayload.multitaskStrategy = validatedConfig.multitaskStrategy;
        }
        
        if (validatedConfig.streamMode !== undefined) {
          createPayload.streamMode = validatedConfig.streamMode;
        }

        const client = createClient(config);
        const run = await client.runs.create(threadId, assistantId, createPayload as any);

        console.log(JSON.stringify(run, null, 2));
      } catch (error) {
        console.error('Error creating run:', error);
        process.exit(1);
      }
    });

  runs
    .command('stream')
    .description('Stream a run with real-time updates')
    .argument('<thread_id>', 'thread ID')
    .argument('<assistant_id>', 'assistant ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .option('--input <json>', 'run input as JSON string')
    .option('--config-data <json>', 'run config as JSON string')
    .option('--metadata <json>', 'run metadata as JSON string')
    .option('--stream-mode <mode>', 'stream mode (values|updates|debug|messages)', 'values')
    .action(async (threadId, assistantId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const runConfig: RunConfig = {
          streamMode: options.streamMode as 'values' | 'updates' | 'debug' | 'messages',
        };

        if (options.input) {
          runConfig.input = JSON.parse(options.input);
        }

        if (options.configData) {
          runConfig.config = JSON.parse(options.configData);
        }

        if (options.metadata) {
          runConfig.metadata = JSON.parse(options.metadata);
        }

        const validatedConfig = RunConfigSchema.parse(runConfig);

        const streamPayload: { input?: Record<string, unknown> | null; config?: Record<string, unknown> | null; metadata?: Record<string, unknown> | null; streamMode?: 'values' | 'updates' | 'debug' | 'messages' | null } = {};
        
        if (validatedConfig.input !== undefined) {
          streamPayload.input = validatedConfig.input;
        }
        
        if (validatedConfig.config !== undefined) {
          streamPayload.config = validatedConfig.config;
        }
        
        if (validatedConfig.metadata !== undefined) {
          streamPayload.metadata = validatedConfig.metadata;
        }
        
        if (validatedConfig.streamMode !== undefined) {
          streamPayload.streamMode = validatedConfig.streamMode;
        }

        const client = createClient(config);
        const streamResponse = client.runs.stream(threadId, assistantId, streamPayload as any);

        for await (const chunk of streamResponse) {
          console.log(JSON.stringify(chunk, null, 2));
        }
      } catch (error) {
        console.error('Error streaming run:', error);
        process.exit(1);
      }
    });

  runs
    .command('cancel')
    .description('Cancel a running execution')
    .argument('<thread_id>', 'thread ID')
    .argument('<run_id>', 'run ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (threadId, runId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        await client.runs.cancel(threadId, runId);

        console.log(`Run ${runId} cancelled successfully`);
      } catch (error) {
        console.error('Error cancelling run:', error);
        process.exit(1);
      }
    });

  runs
    .command('once')
    .description('Create a one-time run without setting up a persistent thread')
    .argument('<assistant_id>', 'assistant ID')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .option('--input <json>', 'run input as JSON string')
    .option('--config-data <json>', 'run config as JSON string')
    .option('--metadata <json>', 'run metadata as JSON string')
    .option('--stream-mode <mode>', 'stream mode (values|updates|debug|messages)', 'values')
    .option('--keep-thread', 'keep the thread after the run completes')
    .action(async (assistantId, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        
        // Create a temporary thread
        const thread = await client.threads.create({});
        const threadId = thread.thread_id;
        
        console.log(`Created temporary thread: ${threadId}`);

        try {
          const runConfig: RunConfig = {
            streamMode: options.streamMode as 'values' | 'updates' | 'debug' | 'messages',
          };

          if (options.input) {
            runConfig.input = JSON.parse(options.input);
          }

          if (options.configData) {
            runConfig.config = JSON.parse(options.configData);
          }

          if (options.metadata) {
            runConfig.metadata = JSON.parse(options.metadata);
          }

          const validatedConfig = RunConfigSchema.parse(runConfig);

          const streamPayload: { input?: Record<string, unknown> | null; config?: Record<string, unknown> | null; metadata?: Record<string, unknown> | null; streamMode?: 'values' | 'updates' | 'debug' | 'messages' | null } = {};
          
          if (validatedConfig.input !== undefined) {
            streamPayload.input = validatedConfig.input;
          }
          
          if (validatedConfig.config !== undefined) {
            streamPayload.config = validatedConfig.config;
          }
          
          if (validatedConfig.metadata !== undefined) {
            streamPayload.metadata = validatedConfig.metadata;
          }
          
          if (validatedConfig.streamMode !== undefined) {
            streamPayload.streamMode = validatedConfig.streamMode;
          }

          // Stream the run
          const streamResponse = client.runs.stream(threadId, assistantId, streamPayload as any);

          for await (const chunk of streamResponse) {
            console.log(JSON.stringify(chunk, null, 2));
          }
        } finally {
          // Clean up the thread unless --keep-thread is specified
          if (!options.keepThread) {
            try {
              await client.threads.delete(threadId);
              console.log(`Cleaned up temporary thread: ${threadId}`);
            } catch (cleanupError) {
              console.warn(`Warning: Failed to clean up thread ${threadId}:`, cleanupError);
            }
          } else {
            console.log(`Thread ${threadId} preserved (use --keep-thread flag was used)`);
          }
        }
      } catch (error) {
        console.error('Error running one-time execution:', error);
        process.exit(1);
      }
    });

  return runs;
}