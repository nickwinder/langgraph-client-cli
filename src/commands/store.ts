import { Command } from 'commander';
import { createClient, loadConfig, mergeConfig, handleError } from '../utils';

// Helper function to parse namespace strings with dot or comma separators
function parseNamespace(namespace: string): string[] {
  return namespace.split(/[,.]/).map(ns => ns.trim()).filter(ns => ns.length > 0);
}

export function createStoreCommand(): Command {
  const store = new Command('store')
    .description('Manage key-value store items');

  // Store get command
  store
    .command('get')
    .description('Get an item from the store')
    .argument('<namespace>', 'Namespace to get the item from (use . or , for multi-part namespaces)')
    .argument('<key>', 'Key of the item to retrieve')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (namespace: string, key: string, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const namespaceArray = parseNamespace(namespace);
        const result = await client.store.getItem(namespaceArray, key);
        
        if (!result || !result.value) {
          console.log(JSON.stringify({ 
            error: `Item not found: ${namespace}/${key}` 
          }, null, 2));
          return;
        }

        console.log(JSON.stringify({
          namespace: result.namespace,
          key: result.key,
          value: result.value,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt
        }, null, 2));
      } catch (error) {
        handleError(error);
      }
    });

  // Store set command
  store
    .command('set')
    .description('Set an item in the store')
    .argument('<namespace>', 'Namespace to store the item in (use . or , for multi-part namespaces)')
    .argument('<key>', 'Key of the item')
    .argument('<value>', 'Value to store (JSON string)')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (namespace: string, key: string, value: string, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        
        // Try to parse the value as JSON, if it fails, store as string
        let parsedValue: any;
        try {
          parsedValue = JSON.parse(value);
        } catch {
          parsedValue = value;
        }

        const namespaceArray = parseNamespace(namespace);
        await client.store.putItem(namespaceArray, key, { value: parsedValue });
        
        console.log(JSON.stringify({
          message: `Item set successfully: ${namespace}/${key}`
        }, null, 2));
      } catch (error) {
        handleError(error);
      }
    });

  // Store delete command
  store
    .command('delete')
    .description('Delete an item from the store')
    .argument('<namespace>', 'Namespace of the item (use . or , for multi-part namespaces)')
    .argument('<key>', 'Key of the item to delete')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .action(async (namespace: string, key: string, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const namespaceArray = parseNamespace(namespace);
        await client.store.deleteItem(namespaceArray, key);
        
        console.log(JSON.stringify({
          message: `Item deleted successfully: ${namespace}/${key}`
        }, null, 2));
      } catch (error) {
        handleError(error);
      }
    });

  // Store list command
  store
    .command('list')
    .description('List items in a namespace')
    .argument('<namespace>', 'Namespace to list items from (use . or , for multi-part namespaces)')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .option('--limit <number>', 'Maximum number of items to return', '10')
    .option('--offset <string>', 'Pagination offset')
    .option('--query <string>', 'Search query')
    .action(async (namespace: string, options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const namespaceArray = parseNamespace(namespace);
        const result = await client.store.searchItems(namespaceArray, {
          limit: parseInt(options.limit),
          offset: options.offset,
          query: options.query
        });
        
        if (result.items.length === 0) {
          console.log(JSON.stringify({ 
            message: `No items found in namespace: ${namespace}` 
          }, null, 2));
          return;
        }

        const items = result.items.map(item => ({
          namespace: item.namespace,
          key: item.key,
          value: item.value,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        console.log(JSON.stringify(items, null, 2));
      } catch (error) {
        handleError(error);
      }
    });

  // Store namespaces command
  store
    .command('namespaces')
    .description('List all namespaces')
    .option('-c, --config <path>', 'path to config file')
    .option('--url <url>', 'LangGraph server URL')
    .option('--api-key <key>', 'API key for authentication')
    .option('--limit <number>', 'Maximum number of namespaces to return', '50')
    .option('--offset <string>', 'Pagination offset')
    .option('--prefix <string>', 'Filter by namespace prefix (use . or , to separate multiple prefixes)')
    .option('--suffix <string>', 'Filter by namespace suffix (use . or , to separate multiple suffixes)')
    .action(async (options) => {
      try {
        const fileConfig = loadConfig(options.config);
        const config = mergeConfig(fileConfig, {
          url: options.url,
          apiKey: options.apiKey,
        });

        const client = createClient(config);
        const result = await client.store.listNamespaces({
          limit: parseInt(options.limit),
          offset: options.offset,
          prefix: options.prefix ? parseNamespace(options.prefix) : undefined,
          suffix: options.suffix ? parseNamespace(options.suffix) : undefined
        });
        
        if (result.namespaces.length === 0) {
          console.log(JSON.stringify({ 
            message: 'No namespaces found' 
          }, null, 2));
          return;
        }

        console.log(JSON.stringify(result.namespaces, null, 2));
      } catch (error) {
        handleError(error);
      }
    });

  return store;
}
