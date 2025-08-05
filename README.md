# 🤖 LangGraph Client CLI

A powerful TypeScript command-line interface for the LangGraph SDK that provides seamless access to LangGraph assistants, threads, and runs from your terminal.

## ✨ Features

### 🎯 **Complete LangGraph SDK Coverage**
- 🤖 **Assistants Management** - List, get, create, and delete assistants
- 🧵 **Threads Management** - Create, list, get, delete threads, and retrieve state  
- 🔄 **Runs Management** - Create, stream, list, get, and cancel runs with real-time updates

### ⚙️ **Advanced Configuration**
- 📁 **File-based Configuration** - JSON config files with automatic discovery
- 🌍 **Environment Variables** - Full support for CI/CD and deployment scenarios
- 🔧 **CLI Option Override** - Command-line options take precedence over all other config
- 🔍 **Configuration Validation** - Runtime validation with helpful error messages

### 🛠️ **Developer Experience**
- 📝 **TypeScript** - Full type safety and IntelliSense support
- 🧪 **Comprehensive Testing** - Jest-based test suite with core utility coverage
- 🎨 **Code Quality** - ESLint and Prettier configured for consistent code style
- 📚 **Extensive Documentation** - Detailed examples and troubleshooting guides

### 🚀 **Production Ready**
- 🔐 **Secure Configuration** - Support for secrets management and environment-based config
- 🌐 **Multiple Deployment Options** - npm exec, global install, or direct Node.js execution
- ⚡ **Performance Optimized** - Efficient SDK usage with proper error handling
- 📊 **Detailed Logging** - Connection status and authentication feedback

## Installation

```bash
npm install
npm run build
```

For global installation:
```bash
npm install -g .
```

## Running the CLI

There are several ways to run the CLI:

### 1. Using npm exec (recommended for development)
```bash
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli <command> [options]
```
> **Note:** The `--` is required when passing options to prevent npm from interpreting them.

### 2. Direct Node.js execution
```bash
node dist/index.js <command> [options]
```

### 3. Global installation
```bash
# Install globally first
npm install -g .

# Then run directly
@nfxdevelopment/langgraph-client-cli <command> [options]
```

## 🚀 Quick Start

Get up and running in under 2 minutes:

### 1️⃣ **Install and Build**
```bash
npm install && npm run build
```

### 2️⃣ **Initialize Configuration**
```bash
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli config init
```

### 3️⃣ **Configure Your Server**
Edit the generated `langgraph-cli.json` or use environment variables:

**Option A: Config File**
```json
{
  "url": "http://localhost:2024",
  "apiKey": "your-api-key"
}
```

**Option B: Environment Variables**
```bash
export LANGGRAPH_API_URL="http://localhost:2024"
export LANGGRAPH_API_KEY="your-api-key"
```

### 4️⃣ **Start LangGraph Server** (if needed)
```bash
npx @langchain/langgraph-cli dev
```

### 5️⃣ **Test Your Setup**
```bash
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli config show
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli assistants list
```

> 💡 **Tip:** When using `npm exec`, the `--` separator is required before CLI options. For easier usage, consider global installation: `npm install -g .`

## Configuration

The CLI supports multiple configuration methods with a clear precedence order. Configuration can be provided through:

1. **Command-line options** (highest precedence)
2. **Environment variables**
3. **Configuration file** (lowest precedence)

### Configuration Management Commands

```bash
# Initialize a new configuration file
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli config init

# Show current configuration and environment variables  
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli config show

# Initialize with custom settings
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli config init --force  # Overwrites existing config
```

### Configuration File (`langgraph-cli.json`)

The CLI automatically searches for `langgraph-cli.json` in the current directory and parent directories. You can also specify a custom config file path with the `-c` option.

**Complete configuration example:**
```json
{
  "url": "https://your-langgraph-server.com",
  "apiKey": "your-api-key",
  "defaultAssistant": "assistant-id",
  "timeout": 30000,
  "retries": 3
}
```

**Minimal configuration example:**
```json
{
  "url": "http://localhost:2024",
  "apiKey": "your-api-key"
}
```

### Environment Variables

Set these environment variables to configure the CLI:

```bash
# Required
export LANGGRAPH_API_URL="https://your-langgraph-server.com"
export LANGGRAPH_API_KEY="your-api-key"

# Optional
export LANGGRAPH_TIMEOUT="30000"
export LANGGRAPH_RETRIES="3"
```

### Configuration Options Reference

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `url` | string | ✅ | - | LangGraph server URL (e.g., `http://localhost:2024`) |
| `apiKey` | string | ⚠️ | - | API key for authentication (some operations may work without it) |
| `defaultAssistant` | string | ❌ | - | Default assistant ID to use when not specified |
| `timeout` | number | ❌ | `30000` | Request timeout in milliseconds |
| `retries` | number | ❌ | `3` | Number of retry attempts for failed requests |

### Configuration Precedence Examples

**Example 1: CLI options override everything**
```bash
# Even if config file has different values, CLI options take precedence
@nfxdevelopment/langgraph-client-cli assistants list \
  --url https://production.example.com \
  --api-key prod-key-123
```

**Example 2: Environment variables override config file**
```bash
export LANGGRAPH_API_URL="https://staging.example.com"
export LANGGRAPH_API_KEY="staging-key-456"

# Will use staging environment even if config file points to localhost
@nfxdevelopment/langgraph-client-cli assistants list
```

**Example 3: Custom config file**
```bash
# Use a specific config file
@nfxdevelopment/langgraph-client-cli assistants list -c ./production-config.json
```

### Configuration Validation

The CLI validates configuration at runtime and provides helpful error messages:

```bash
# Missing URL
❌ Configuration error: No LangGraph server URL provided. Please set --url option, add "url" to config file, or set LANGGRAPH_API_URL environment variable.

# Invalid URL format
❌ Configuration error: Failed to load config from langgraph-cli.json
Caused by: Invalid url
```

### Local Development Setup

For local development with the LangGraph server:

```bash
# 1. Start the LangGraph server
npx @langchain/langgraph-cli dev

# 2. Initialize config pointing to local server
@nfxdevelopment/langgraph-client-cli config init

# 3. The default config will be:
{
  "url": "http://localhost:2024",
  "apiKey": "your-api-key-here",
  "timeout": 30000,
  "retries": 3
}

# 4. Test the connection
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli config show
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli assistants list
```

### Production Setup

For production environments:

```bash
# Option 1: Use environment variables (recommended for CI/CD)
export LANGGRAPH_API_URL="https://api.your-company.com"
export LANGGRAPH_API_KEY="$(cat /path/to/secret)"

# Option 2: Use a secure config file
cat > langgraph-cli.json << EOF
{
  "url": "https://api.your-company.com",
  "apiKey": "$(cat /path/to/secret)",
  "timeout": 60000,
  "retries": 5
}
EOF

# Option 3: Pass via CLI (for scripts)
@nfxdevelopment/langgraph-client-cli assistants list \
  --url "$PRODUCTION_URL" \
  --api-key "$PRODUCTION_KEY"
```

### Troubleshooting Configuration

**Check current configuration:**
```bash
@nfxdevelopment/langgraph-client-cli config show
```

**Common issues:**

1. **"No LangGraph server URL provided"**
   - Set `url` in config file, `LANGGRAPH_API_URL` env var, or `--url` option

2. **"fetch failed" or "ECONNREFUSED"**
   - Verify the server is running at the specified URL
   - Check network connectivity
   - Ensure the URL format is correct (include `http://` or `https://`)

3. **"Configuration error: Failed to load config"**
   - Check JSON syntax in your config file
   - Ensure file permissions allow reading
   - Validate the config file format

## Usage

### Assistants

```bash
# List all assistants
@nfxdevelopment/langgraph-client-cli assistants list

# Get a specific assistant
@nfxdevelopment/langgraph-client-cli assistants get <assistant_id>

# Create an assistant from JSON config
@nfxdevelopment/langgraph-client-cli assistants create <config_file.json>

# Delete an assistant
@nfxdevelopment/langgraph-client-cli assistants delete <assistant_id>
```

### Threads

```bash
# List all threads
@nfxdevelopment/langgraph-client-cli threads list

# Get a specific thread
@nfxdevelopment/langgraph-client-cli threads get <thread_id>

# Create a new thread
@nfxdevelopment/langgraph-client-cli threads create --metadata '{"key": "value"}'

# Delete a thread
@nfxdevelopment/langgraph-client-cli threads delete <thread_id>

# Get thread state
@nfxdevelopment/langgraph-client-cli threads state <thread_id>
```

### Runs

```bash
# List runs for a thread
@nfxdevelopment/langgraph-client-cli runs list <thread_id>

# Get a specific run
@nfxdevelopment/langgraph-client-cli runs get <thread_id> <run_id>

# Create a new run
@nfxdevelopment/langgraph-client-cli runs create <thread_id> <assistant_id> --input '{"messages": [{"role": "human", "content": "Hello"}]}'

# Stream a run with real-time updates
@nfxdevelopment/langgraph-client-cli runs stream <thread_id> <assistant_id> --input '{"messages": [{"role": "human", "content": "Hello"}]}' --stream-mode values

# Cancel a running execution
@nfxdevelopment/langgraph-client-cli runs cancel <thread_id> <run_id>
```

### Global Options

All commands support these global options:

- `-c, --config <path>`: Path to config file
- `--url <url>`: LangGraph server URL
- `--api-key <key>`: API key for authentication

## 📖 Usage Examples

### 🚀 **Real-World Scenarios**

**Stream a conversation with real-time updates:**
```bash
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli runs stream thread-123 assistant-456 \
  --input '{"messages": [{"role": "human", "content": "What is the weather like?"}]}' \
  --stream-mode values
```

**Create and manage a conversation thread:**
```bash
# Create a new thread with metadata
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli threads create --metadata '{"user": "john", "session": "abc123"}'

# Get thread state
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli threads state thread-456

# Create a run on the thread
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli runs create thread-456 assistant-789 \
  --input '{"messages": [{"role": "human", "content": "Hello!"}]}'
```

**Production deployment with environment variables:**
```bash
export LANGGRAPH_API_URL="https://api.your-company.com"
export LANGGRAPH_API_KEY="$(cat /path/to/secret)"

# All commands now use production settings
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli assistants list --limit 50
```

### 🔧 **Configuration Scenarios**

**Development with config file:**
```bash
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli assistants list -c ./dev-config.json
```

**Override config for specific command:**
```bash
npm exec -- @nfxdevelopment/@nfxdevelopment/langgraph-client-cli assistants list \
  --url https://staging.example.com \
  --api-key staging-key-123
```

### Creating an Assistant

Create an `assistant-config.json` file:

```json
{
  "metadata": {
    "name": "Weather Assistant",
    "description": "Helps with weather queries"
  },
  "config": {
    "temperature": 0.7,
    "max_tokens": 150
  }
}
```

Then create the assistant:

```bash
@nfxdevelopment/langgraph-client-cli assistants create assistant-config.json
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Run in Development

```bash
npm run dev -- assistants list
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting and Formatting

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## API Reference

### Configuration Schema

The CLI uses Zod schemas for runtime validation:

- `ConfigSchema`: Main configuration options
- `RunConfigSchema`: Run-specific configuration
- `ThreadConfigSchema`: Thread-specific configuration
- `AssistantConfigSchema`: Assistant-specific configuration

### Error Handling

Custom error types:

- `LangGraphCLIError`: Base error class
- `ConfigError`: Configuration-related errors
- `APIError`: API request errors

## 🏗️ Architecture

Built with modern TypeScript best practices:
- **Commander.js** for CLI argument parsing and command structure
- **Zod** for runtime schema validation and type safety
- **Jest** for comprehensive testing framework
- **ESLint + Prettier** for consistent code quality

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. 🍴 **Fork the repository**
2. 🌟 **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. ✨ **Make your changes** with proper TypeScript types
4. 🧪 **Add tests** for new functionality
5. ✅ **Run the test suite** (`npm test && npm run lint`)
6. 📝 **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. 🚀 **Push to the branch** (`git push origin feature/amazing-feature`)
8. 🎯 **Open a Pull Request**

### Development Workflow

```bash
# Clone and setup
git clone <your-fork>
cd @nfxdevelopment/langgraph-client-cli
npm install

# Development
npm run dev -- assistants list
npm test
npm run lint

# Build for production
npm run build
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">
  <strong>Built with ❤️ for the LangGraph community</strong>
  <br>
  <a href="https://github.com/langchain-ai/langgraphjs">LangGraph.js</a> • 
  <a href="https://langchain-ai.github.io/langgraphjs/">Documentation</a> • 
  <a href="https://github.com/nickwinder/langgraph-client-cli/issues">Report Bug</a> • 
  <a href="https://github.com/nickwinder/langgraph-client-cli/issues">Request Feature</a>
</div>