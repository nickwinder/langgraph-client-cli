import { Command } from 'commander';
import { loadConfig, mergeConfig } from '../utils';

export function createConfigCommand(): Command {
  const config = new Command('config')
    .description('Manage CLI configuration');

  config
    .command('show')
    .description('Show current configuration')
    .option('-c, --config <path>', 'path to config file')
    .action((options) => {
      try {
        const fileConfig = loadConfig(options.config);
        
        // Get the merged configuration (showing the actual precedence)
        const mergedConfig = mergeConfig(fileConfig, {});
        
        console.log('📋 Current Configuration:');
        console.log('\n🔧 Effective Configuration (after precedence):');
        console.log(JSON.stringify({
          ...mergedConfig,
          apiKey: mergedConfig.apiKey ? '***set***' : 'not set'
        }, null, 2));
        
        console.log('\n📁 Configuration File:');
        console.log(JSON.stringify({
          ...fileConfig,
          apiKey: fileConfig.apiKey ? '***set***' : 'not set'
        }, null, 2));
        
        console.log('\n🌍 Environment Variables:');
        console.log(JSON.stringify({
          LANGGRAPH_API_URL: process.env.LANGGRAPH_API_URL || 'not set',
          LANGGRAPH_API_KEY: process.env.LANGGRAPH_API_KEY ? '***set***' : 'not set',
          LANGGRAPH_TIMEOUT: process.env.LANGGRAPH_TIMEOUT || 'not set',
          LANGGRAPH_RETRIES: process.env.LANGGRAPH_RETRIES || 'not set',
        }, null, 2));
        
        console.log('\n📋 Configuration Precedence:');
        console.log('1. Command-line options (highest)');
        console.log('2. Environment variables');
        console.log('3. Configuration file (lowest)');
      } catch (error) {
        console.error('Error loading configuration:', error);
        process.exit(1);
      }
    });

  config
    .command('init')
    .description('Initialize a new configuration file')
    .option('-f, --force', 'overwrite existing config file')
    .action((options) => {
      const fs = require('fs');
      const path = require('path');
      
      const configPath = path.join(process.cwd(), 'langgraph-cli.json');
      
      if (fs.existsSync(configPath) && !options.force) {
        console.error('❌ Configuration file already exists. Use --force to overwrite.');
        process.exit(1);
      }
      
      const defaultConfig = {
        url: 'http://localhost:2024',
        apiKey: 'your-api-key-here',
        timeout: 30000,
        retries: 3
      };
      
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      console.log(`✅ Created configuration file: ${configPath}`);
      console.log('🔧 Please edit the file to set your actual API key and server URL.');
    });

  return config;
}