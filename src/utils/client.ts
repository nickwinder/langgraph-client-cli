import { Client } from '@langchain/langgraph-sdk';
import { Config } from '../types/config';
import { ConfigError } from './errors';

export function createClient(config: Config): Client {
  // Check if we have minimal required configuration
  if (!config.url) {
    throw new ConfigError(
      'No LangGraph server URL provided. Please set --url option, add "url" to config file, or set LANGGRAPH_API_URL environment variable.'
    );
  }

  const clientOptions: ConstructorParameters<typeof Client>[0] = {};
  
  // The config passed here should already have precedence applied by mergeConfig
  if (config.url) {
    clientOptions.apiUrl = config.url;
  }
  
  if (config.apiKey) {
    clientOptions.apiKey = config.apiKey;
  }

  if (config.timeout) {
    clientOptions.timeoutMs = config.timeout;
  }

  console.log(`🔗 Connecting to LangGraph server: ${config.url}`);
  if (config.apiKey) {
    console.log('🔑 Using API key for authentication');
  } else {
    console.log('⚠️  No API key provided - some operations may fail');
  }

  return new Client(clientOptions);
}