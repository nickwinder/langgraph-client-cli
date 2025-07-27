import { LangGraphCLIError, ConfigError, APIError, handleError } from '../../utils/errors';

describe('Error Classes', () => {
  describe('LangGraphCLIError', () => {
    it('should create error with message', () => {
      const error = new LangGraphCLIError('test message');
      
      expect(error.message).toBe('test message');
      expect(error.name).toBe('LangGraphCLIError');
      expect(error.cause).toBeUndefined();
    });

    it('should create error with cause', () => {
      const cause = new Error('original error');
      const error = new LangGraphCLIError('test message', cause);
      
      expect(error.message).toBe('test message');
      expect(error.cause).toBe(cause);
    });
  });

  describe('ConfigError', () => {
    it('should create config error with prefixed message', () => {
      const error = new ConfigError('invalid format');
      
      expect(error.message).toBe('Configuration error: invalid format');
      expect(error.name).toBe('ConfigError');
    });
  });

  describe('APIError', () => {
    it('should create API error with status code', () => {
      const error = new APIError('request failed', 404);
      
      expect(error.message).toBe('API error: request failed');
      expect(error.name).toBe('APIError');
      expect(error.statusCode).toBe(404);
    });
  });
});

describe('handleError', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  it('should handle LangGraphCLIError', () => {
    const error = new LangGraphCLIError('test error');
    
    handleError(error);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ test error');
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should handle LangGraphCLIError with cause', () => {
    const cause = new Error('original error');
    const error = new LangGraphCLIError('test error', cause);
    
    handleError(error);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ test error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Caused by: original error');
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should handle generic Error', () => {
    const error = new Error('generic error');
    
    handleError(error);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Unexpected error: generic error');
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should handle unknown error', () => {
    const error = 'string error';
    
    handleError(error);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Unknown error: string error');
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});