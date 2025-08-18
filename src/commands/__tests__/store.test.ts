// Mock the entire utils module before any imports
jest.mock('../../utils', () => ({
  createClient: jest.fn(),
  loadConfig: jest.fn(() => ({})),
  mergeConfig: jest.fn((fileConfig, options) => ({ ...fileConfig, ...options })),
  handleError: jest.fn()
}));

import { createStoreCommand } from '../store';
import { createClient, handleError } from '../../utils';

describe('Store Command', () => {
  let mockStore: {
    getItem: jest.Mock;
    putItem: jest.Mock;
    deleteItem: jest.Mock;
    searchItems: jest.Mock;
    listNamespaces: jest.Mock;
  };
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Mock store methods
    mockStore = {
      getItem: jest.fn(),
      putItem: jest.fn(),
      deleteItem: jest.fn(),
      searchItems: jest.fn(),
      listNamespaces: jest.fn()
    };
    
    // Create a proper mock client with all required properties
    const mockClient = {
      store: mockStore,
      assistants: {},
      threads: {},
      runs: {},
      crons: {}
    };
    
    // Mock createClient to return our mock client
    (createClient as jest.Mock).mockReturnValue(mockClient);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('store get', () => {
    it('should handle multi-part namespaces with dots', async () => {
      const mockItem = {
        namespace: ['part1', 'part2', 'part3'],
        key: 'test-key',
        value: { data: 'test-value' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      mockStore.getItem.mockResolvedValue(mockItem);
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'get', 'part1.part2.part3', 'test-key']);
      
      expect(mockStore.getItem).toHaveBeenCalledWith(['part1', 'part2', 'part3'], 'test-key');
    });

    it('should handle multi-part namespaces with commas', async () => {
      const mockItem = {
        namespace: ['part1', 'part2', 'part3'],
        key: 'test-key',
        value: { data: 'test-value' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      mockStore.getItem.mockResolvedValue(mockItem);
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'get', 'part1,part2,part3', 'test-key']);
      
      expect(mockStore.getItem).toHaveBeenCalledWith(['part1', 'part2', 'part3'], 'test-key');
    });

    it('should handle mixed separators and trim whitespace', async () => {
      const mockItem = {
        namespace: ['part1', 'part2', 'part3'],
        key: 'test-key',
        value: { data: 'test-value' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      mockStore.getItem.mockResolvedValue(mockItem);
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'get', 'part1, part2.part3', 'test-key']);
      
      expect(mockStore.getItem).toHaveBeenCalledWith(['part1', 'part2', 'part3'], 'test-key');
    });
    it('should retrieve an item from the store', async () => {
      const mockItem = {
        namespace: 'test-namespace',
        key: 'test-key',
        value: { data: 'test-value' },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      mockStore.getItem.mockResolvedValue(mockItem);
      
      const command = createStoreCommand();
      try {
        await command.parseAsync(['node', 'test', 'get', 'test-namespace', 'test-key']);
      } catch (error) {
        console.error('Command error:', error);
      }
      
      expect(createClient).toHaveBeenCalled();
      expect(mockStore.getItem).toHaveBeenCalledWith(['test-namespace'], 'test-key');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('"data": "test-value"'));
    });

    it('should handle missing items', async () => {
      mockStore.getItem.mockResolvedValue(null);
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'get', 'test-namespace', 'missing-key']);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Item not found: test-namespace/missing-key')
      );
    });
  });

  describe('store set', () => {
    it('should handle multi-part namespaces with dots', async () => {
      const command = createStoreCommand();
      await command.parseAsync([
        'node', 'test', 'set', 'part1.part2.part3', 'test-key', '{"data":"test-value"}'
      ]);
      
      expect(mockStore.putItem).toHaveBeenCalledWith(
        ['part1', 'part2', 'part3'],
        'test-key',
        { value: { data: 'test-value' } }
      );
    });

    it('should handle multi-part namespaces with commas', async () => {
      const command = createStoreCommand();
      await command.parseAsync([
        'node', 'test', 'set', 'part1,part2,part3', 'test-key', '{"data":"test-value"}'
      ]);
      
      expect(mockStore.putItem).toHaveBeenCalledWith(
        ['part1', 'part2', 'part3'],
        'test-key',
        { value: { data: 'test-value' } }
      );
    });
    it('should set a JSON value in the store', async () => {
      const command = createStoreCommand();
      await command.parseAsync([
        'node', 'test', 'set', 'test-namespace', 'test-key', '{"data":"test-value"}'
      ]);
      
      expect(mockStore.putItem).toHaveBeenCalledWith(
        ['test-namespace'],
        'test-key',
        { value: { data: 'test-value' } }
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Item set successfully: test-namespace/test-key')
      );
    });

    it('should set a string value in the store', async () => {
      const command = createStoreCommand();
      await command.parseAsync([
        'node', 'test', 'set', 'test-namespace', 'test-key', 'plain-string'
      ]);
      
      expect(mockStore.putItem).toHaveBeenCalledWith(
        ['test-namespace'],
        'test-key',
        { value: 'plain-string' }
      );
    });
  });

  describe('store delete', () => {
    it('should handle multi-part namespaces with dots', async () => {
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'delete', 'part1.part2.part3', 'test-key']);
      
      expect(mockStore.deleteItem).toHaveBeenCalledWith(['part1', 'part2', 'part3'], 'test-key');
    });

    it('should handle multi-part namespaces with commas', async () => {
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'delete', 'part1,part2,part3', 'test-key']);
      
      expect(mockStore.deleteItem).toHaveBeenCalledWith(['part1', 'part2', 'part3'], 'test-key');
    });
    it('should delete an item from the store', async () => {
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'delete', 'test-namespace', 'test-key']);
      
      expect(mockStore.deleteItem).toHaveBeenCalledWith(['test-namespace'], 'test-key');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Item deleted successfully: test-namespace/test-key')
      );
    });
  });

  describe('store list', () => {
    it('should handle multi-part namespaces with dots', async () => {
      mockStore.searchItems.mockResolvedValue({ items: [] });
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'list', 'part1.part2.part3']);
      
      expect(mockStore.searchItems).toHaveBeenCalledWith(['part1', 'part2', 'part3'], {
        limit: 10,
        offset: undefined,
        query: undefined
      });
    });

    it('should handle multi-part namespaces with commas', async () => {
      mockStore.searchItems.mockResolvedValue({ items: [] });
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'list', 'part1,part2,part3']);
      
      expect(mockStore.searchItems).toHaveBeenCalledWith(['part1', 'part2', 'part3'], {
        limit: 10,
        offset: undefined,
        query: undefined
      });
    });
    it('should list items in a namespace', async () => {
      const mockItems = {
        items: [
          {
            namespace: 'test-namespace',
            key: 'key1',
            value: { data: 'value1' },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          {
            namespace: 'test-namespace',
            key: 'key2',
            value: { data: 'value2' },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        ]
      };
      
      mockStore.searchItems.mockResolvedValue(mockItems);
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'list', 'test-namespace']);
      
      expect(mockStore.searchItems).toHaveBeenCalledWith(['test-namespace'], {
        limit: 10,
        offset: undefined,
        query: undefined
      });
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      mockStore.searchItems.mockResolvedValue({ items: [] });
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'list', 'empty-namespace']);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('No items found in namespace: empty-namespace')
      );
    });

    it('should apply filters', async () => {
      mockStore.searchItems.mockResolvedValue({ items: [] });
      
      const command = createStoreCommand();
      await command.parseAsync([
        'node', 'test', 'list', 'test-namespace',
        '--limit', '20',
        '--query', 'user data'
      ]);
      
      expect(mockStore.searchItems).toHaveBeenCalledWith(['test-namespace'], {
        limit: 20,
        offset: undefined,
        query: 'user data'
      });
    });
  });

  describe('store namespaces', () => {
    it('should list all namespaces', async () => {
      const mockNamespaces = {
        namespaces: ['namespace1', 'namespace2', 'namespace3']
      };
      
      mockStore.listNamespaces.mockResolvedValue(mockNamespaces);
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'namespaces']);
      
      expect(mockStore.listNamespaces).toHaveBeenCalledWith({
        limit: 50,
        offset: undefined,
        prefix: undefined,
        suffix: undefined
      });
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle prefix and suffix filters with dots', async () => {
      mockStore.listNamespaces.mockResolvedValue({ namespaces: [] });
      
      const command = createStoreCommand();
      await command.parseAsync([
        'node', 'test', 'namespaces',
        '--prefix', 'prefix1.prefix2',
        '--suffix', 'suffix1.suffix2'
      ]);
      
      expect(mockStore.listNamespaces).toHaveBeenCalledWith({
        limit: 50,
        offset: undefined,
        prefix: ['prefix1', 'prefix2'],
        suffix: ['suffix1', 'suffix2']
      });
    });

    it('should handle prefix and suffix filters with commas', async () => {
      mockStore.listNamespaces.mockResolvedValue({ namespaces: [] });
      
      const command = createStoreCommand();
      await command.parseAsync([
        'node', 'test', 'namespaces',
        '--prefix', 'prefix1,prefix2',
        '--suffix', 'suffix1,suffix2'
      ]);
      
      expect(mockStore.listNamespaces).toHaveBeenCalledWith({
        limit: 50,
        offset: undefined,
        prefix: ['prefix1', 'prefix2'],
        suffix: ['suffix1', 'suffix2']
      });
    });

    it('should handle mixed separators in prefix and suffix', async () => {
      mockStore.listNamespaces.mockResolvedValue({ namespaces: [] });
      
      const command = createStoreCommand();
      await command.parseAsync([
        'node', 'test', 'namespaces',
        '--prefix', 'prefix1, prefix2.prefix3',
        '--suffix', 'suffix1.suffix2, suffix3'
      ]);
      
      expect(mockStore.listNamespaces).toHaveBeenCalledWith({
        limit: 50,
        offset: undefined,
        prefix: ['prefix1', 'prefix2', 'prefix3'],
        suffix: ['suffix1', 'suffix2', 'suffix3']
      });
    });

    it('should handle empty namespace list', async () => {
      mockStore.listNamespaces.mockResolvedValue({ namespaces: [] });
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'namespaces']);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('No namespaces found')
      );
    });
  });

  describe('error handling', () => {
    it('should handle errors using handleError', async () => {
      const error = new Error('API error');
      mockStore.getItem.mockRejectedValue(error);
      
      const command = createStoreCommand();
      await command.parseAsync(['node', 'test', 'get', 'test-namespace', 'test-key']);
      
      expect(handleError).toHaveBeenCalledWith(error);
    });
  });
});