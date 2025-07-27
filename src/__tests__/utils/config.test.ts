import fs from 'fs';
import { loadConfig, mergeConfig } from '../../utils/config';
import { ConfigError } from '../../utils/errors';

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('Config Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadConfig', () => {
    it('should return empty config when no config file exists', () => {
      mockedFs.existsSync.mockReturnValue(false);
      
      const config = loadConfig();
      
      expect(config).toEqual({});
    });

    it('should load and parse valid config file', () => {
      const configPath = '/test/langgraph-cli.json';
      const configData = {
        url: 'https://api.example.com',
        apiKey: 'test-key',
        timeout: 5000,
      };

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify(configData));

      const config = loadConfig(configPath);

      expect(config).toEqual(configData);
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(configPath, 'utf8');
    });

    it('should throw ConfigError on invalid JSON', () => {
      const configPath = '/test/langgraph-cli.json';

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('invalid json');

      expect(() => loadConfig(configPath)).toThrow(ConfigError);
    });

    it('should throw ConfigError on invalid schema', () => {
      const configPath = '/test/langgraph-cli.json';
      const invalidConfig = {
        url: 'not-a-url',
        timeout: -1,
      };

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify(invalidConfig));

      expect(() => loadConfig(configPath)).toThrow(ConfigError);
    });
  });

  describe('mergeConfig', () => {
    beforeEach(() => {
      // Clear environment variables before each test
      delete process.env.LANGGRAPH_API_URL;
      delete process.env.LANGGRAPH_API_KEY;
      delete process.env.LANGGRAPH_TIMEOUT;
      delete process.env.LANGGRAPH_RETRIES;
    });

    it('should merge configs with CLI options taking precedence', () => {
      const fileConfig = {
        url: 'https://file.example.com',
        apiKey: 'file-key',
        timeout: 1000,
      };

      const cliOptions = {
        url: 'https://cli.example.com',
        apiKey: undefined,
      };

      const result = mergeConfig(fileConfig, cliOptions);

      expect(result).toEqual({
        url: 'https://cli.example.com',
        apiKey: 'file-key',
        timeout: 1000,
      });
    });

    it('should use environment variables over file config', () => {
      process.env.LANGGRAPH_API_URL = 'https://env.example.com';
      process.env.LANGGRAPH_API_KEY = 'env-key';
      process.env.LANGGRAPH_TIMEOUT = '5000';

      const fileConfig = {
        url: 'https://file.example.com',
        apiKey: 'file-key',
        timeout: 1000,
      };

      const result = mergeConfig(fileConfig, {});

      expect(result).toEqual({
        url: 'https://env.example.com',
        apiKey: 'env-key',
        timeout: 5000,
      });
    });

    it('should use CLI options over environment variables and file config', () => {
      process.env.LANGGRAPH_API_URL = 'https://env.example.com';
      process.env.LANGGRAPH_API_KEY = 'env-key';

      const fileConfig = {
        url: 'https://file.example.com',
        apiKey: 'file-key',
        timeout: 1000,
      };

      const cliOptions = {
        url: 'https://cli.example.com',
        timeout: 8000,
      };

      const result = mergeConfig(fileConfig, cliOptions);

      expect(result).toEqual({
        url: 'https://cli.example.com',
        apiKey: 'env-key',
        timeout: 8000,
      });
    });

    it('should filter out undefined CLI options', () => {
      const fileConfig = {
        url: 'https://file.example.com',
        apiKey: 'file-key',
      };

      const cliOptions = {
        url: undefined,
        timeout: 5000,
      };

      const result = mergeConfig(fileConfig, cliOptions);

      expect(result).toEqual({
        url: 'https://file.example.com',
        apiKey: 'file-key',
        timeout: 5000,
      });
    });

    it('should handle invalid environment variable numbers gracefully', () => {
      process.env.LANGGRAPH_TIMEOUT = 'not-a-number';
      process.env.LANGGRAPH_RETRIES = 'invalid';

      const fileConfig = {
        url: 'https://file.example.com',
        timeout: 1000,
        retries: 3,
      };

      const result = mergeConfig(fileConfig, {});

      expect(result).toEqual({
        url: 'https://file.example.com',
        timeout: 1000,
        retries: 3,
      });
    });
  });
});