export class LangGraphCLIError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'LangGraphCLIError';
  }
}

export class ConfigError extends LangGraphCLIError {
  constructor(message: string, cause?: Error) {
    super(`Configuration error: ${message}`, cause);
    this.name = 'ConfigError';
  }
}

export class APIError extends LangGraphCLIError {
  constructor(message: string, public statusCode?: number, cause?: Error) {
    super(`API error: ${message}`, cause);
    this.name = 'APIError';
  }
}

export function handleError(error: unknown): void {
  if (error instanceof LangGraphCLIError) {
    console.error(`❌ ${error.message}`);
    if (error.cause) {
      console.error(`Caused by: ${error.cause.message}`);
    }
  } else if (error instanceof Error) {
    console.error(`❌ Unexpected error: ${error.message}`);
    
    // Provide more specific help for common errors
    if (error.message.includes('fetch failed')) {
      console.error('\n💡 This usually means:');
      console.error('   • The LangGraph server is not running');
      console.error('   • The server URL is incorrect');
      console.error('   • Network connectivity issues');
      console.error('\n🔧 Try:');
      console.error('   • Check if the server is running at the specified URL');
      console.error('   • Verify the URL with --url or in your config file');
      console.error('   • Start a local server with: npx @langchain/langgraph-cli dev');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Connection refused - the server is not accepting connections');
      console.error('🔧 Try starting the LangGraph server first');
    }
  } else {
    console.error(`❌ Unknown error: ${String(error)}`);
  }
  
  process.exit(1);
}