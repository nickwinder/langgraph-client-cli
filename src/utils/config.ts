import fs from 'fs';
import path from 'path';
import { Config, ConfigSchema } from '../types/config';
import { ConfigError } from './errors';

const DEFAULT_CONFIG_FILENAME = 'langgraph-cli.json';

export function loadConfig(configPath?: string): Config {
  const configFile = configPath || findConfigFile();
  
  if (!configFile || !fs.existsSync(configFile)) {
    return {};
  }

  try {
    const configContent = fs.readFileSync(configFile, 'utf8');
    const rawConfig = JSON.parse(configContent);
    return ConfigSchema.parse(rawConfig);
  } catch (error) {
    throw new ConfigError(`Failed to load config from ${configFile}`, error as Error);
  }
}

function findConfigFile(): string | null {
  let currentDir = process.cwd();
  
  while (currentDir !== path.dirname(currentDir)) {
    const configPath = path.join(currentDir, DEFAULT_CONFIG_FILENAME);
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    currentDir = path.dirname(currentDir);
  }
  
  return null;
}

export function mergeConfig(fileConfig: Config, cliOptions: Partial<Config>): Config {
  // Start with file config
  let mergedConfig = { ...fileConfig };
  
  // Override with environment variables
  if (process.env.LANGGRAPH_API_URL) {
    mergedConfig.url = process.env.LANGGRAPH_API_URL;
  }
  
  if (process.env.LANGGRAPH_API_KEY) {
    mergedConfig.apiKey = process.env.LANGGRAPH_API_KEY;
  }
  
  if (process.env.LANGGRAPH_TIMEOUT) {
    const timeout = parseInt(process.env.LANGGRAPH_TIMEOUT);
    if (!isNaN(timeout)) {
      mergedConfig.timeout = timeout;
    }
  }
  
  if (process.env.LANGGRAPH_RETRIES) {
    const retries = parseInt(process.env.LANGGRAPH_RETRIES);
    if (!isNaN(retries)) {
      mergedConfig.retries = retries;
    }
  }
  
  // Finally override with CLI options (highest precedence)
  return {
    ...mergedConfig,
    ...Object.fromEntries(
      Object.entries(cliOptions).filter(([_, value]) => value !== undefined)
    ),
  };
}