# 🤖 LangGraph Client CLI

A powerful TypeScript command-line interface for the LangGraph SDK that provides seamless access to LangGraph assistants, threads, and runs from your terminal.

## ✨ Features

### 🎯 **Complete LangGraph SDK Coverage**
- 🤖 **Assistants Management** - List, get, create, and delete assistants
- 🧵 **Threads Management** - Create, list, get, delete threads, and retrieve state  
- 🔄 **Runs Management** - Create, stream, list, get, and cancel runs with real-time updates
- 🗄️ **Store Management** - Full CRUD operations for key-value store with search and filtering

### ⚙️ **Advanced Configuration**
- 📁 **File-based Configuration** - JSON config files with automatic discovery
- 🌍 **Environment Variables** - Full support for CI/CD and deployment scenarios
- 🔧 **CLI Option Override** - Command-line options take precedence over all other config
- 🔍 **Configuration Validation** - Runtime validation with helpful error messages

## Installation

### 🚀 Quick Start (Recommended)

No installation required! Use npx to run the CLI directly:

```bash
npx langgraph-client-cli@latest <command> [options]
```

### 📦 Alternative Installation Methods

**For development or local modifications:**
```bash
git clone https://github.com/nickwinder/langgraph-client-cli
cd langgraph-client-cli
npm install
npm run build
```

**For global installation:**
```bash
npm install -g langgraph-client-cli
```

## Running the CLI

### 1. 🚀 Using npx (Recommended)
```bash
npx langgraph-client-cli@latest <command> [options]
```
> **Best choice:** Always gets the latest version, no installation required!

### 2. Global installation
```bash
# Install globally first
npm install -g langgraph-client-cli

# Then run directly
langgraph-client-cli <command> [options]
```

### 3. Local development
```bash
# For development or local modifications
npm exec -- langgraph-client-cli <command> [options]
# or
node dist/index.js <command> [options]
```

## 🚀 Quick Start

Get up and running in under 2 minutes:

### 1️⃣ **Initialize Configuration**
```bash
npx langgraph-client-cli@latest config init
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

### 3️⃣ **Start LangGraph Server** (if needed)
```bash
npx @langchain/langgraph-cli dev
```

### 4️⃣ **Test Your Setup**
```bash
npx langgraph-client-cli@latest config show
npx langgraph-client-cli@latest assistants list
```

> 💡 **Tip:** Using `npx` always gets the latest version and requires no installation!

## Configuration

The CLI supports multiple configuration methods with a clear precedence order. Configuration can be provided through:

1. **Command-line options** (highest precedence)
2. **Environment variables**
3. **Configuration file** (lowest precedence)

### Configuration Management Commands

```bash
# Initialize a new configuration file
npx langgraph-client-cli@latest config init

# Show current configuration and environment variables  
npx langgraph-client-cli@latest config show

# Initialize with custom settings
npx langgraph-client-cli@latest config init --force  # Overwrites existing config
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
npx langgraph-client-cli@latest assistants list \
  --url https://production.example.com \
  --api-key prod-key-123
```

**Example 2: Environment variables override config file**
```bash
export LANGGRAPH_API_URL="https://staging.example.com"
export LANGGRAPH_API_KEY="staging-key-456"

# Will use staging environment even if config file points to localhost
npx langgraph-client-cli@latest assistants list
```

**Example 3: Custom config file**
```bash
# Use a specific config file
npx langgraph-client-cli@latest assistants list -c ./production-config.json
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
npx langgraph-client-cli@latest config init

# 3. The default config will be:
{
  "url": "http://localhost:2024",
  "apiKey": "your-api-key-here",
  "timeout": 30000,
  "retries": 3
}

# 4. Test the connection
npx langgraph-client-cli@latest config show
npx langgraph-client-cli@latest assistants list
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
npx langgraph-client-cli@latest assistants list \
  --url "$PRODUCTION_URL" \
  --api-key "$PRODUCTION_KEY"
```

### Troubleshooting Configuration

**Check current configuration:**
```bash
npx langgraph-client-cli@latest config show
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
npx langgraph-client-cli@latest assistants list

# Get a specific assistant
npx langgraph-client-cli@latest assistants get <assistant_id>

# Create an assistant from JSON config
npx langgraph-client-cli@latest assistants create <config_file.json>

# Delete an assistant
npx langgraph-client-cli@latest assistants delete <assistant_id>
```

### Threads

```bash
# List all threads
npx langgraph-client-cli@latest threads list

# Get a specific thread
npx langgraph-client-cli@latest threads get <thread_id>

# Create a new thread
npx langgraph-client-cli@latest threads create --metadata '{"key": "value"}'

# Delete a thread
npx langgraph-client-cli@latest threads delete <thread_id>

# Get thread state
npx langgraph-client-cli@latest threads state <thread_id>
```

### Runs

```bash
# List runs for a thread
npx langgraph-client-cli@latest runs list <thread_id>

# Get a specific run
npx langgraph-client-cli@latest runs get <thread_id> <run_id>

# Create a new run
npx langgraph-client-cli@latest runs create <thread_id> <assistant_id> --input '{"messages": [{"role": "human", "content": "Hello"}]}'

# Stream a run with real-time updates
npx langgraph-client-cli@latest runs stream <thread_id> <assistant_id> --input '{"messages": [{"role": "human", "content": "Hello"}]}' --stream-mode values

# Cancel a running execution
npx langgraph-client-cli@latest runs cancel <thread_id> <run_id>
```

### Store (Key-Value Storage)

```bash
# Get an item from the store
npx langgraph-client-cli@latest store get <namespace> <key>

# Set an item in the store (supports JSON or string values)
npx langgraph-client-cli@latest store set <namespace> <key> <value>

# Delete an item from the store
npx langgraph-client-cli@latest store delete <namespace> <key>

# List items in a namespace
npx langgraph-client-cli@latest store list <namespace>

# List items with search query
npx langgraph-client-cli@latest store list <namespace> --query "search term"

# List items with pagination
npx langgraph-client-cli@latest store list <namespace> --limit 20 --offset 10

# List all namespaces
npx langgraph-client-cli@latest store namespaces

# List namespaces with filtering
npx langgraph-client-cli@latest store namespaces --prefix "user,session" --suffix "data"
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
npx langgraph-client-cli@latest runs stream thread-123 assistant-456 \
  --input '{"messages": [{"role": "human", "content": "What is the weather like?"}]}' \
  --stream-mode values
```

**Create and manage a conversation thread:**
```bash
# Create a new thread with metadata
npx langgraph-client-cli@latest threads create --metadata '{"user": "john", "session": "abc123"}'

# Get thread state
npx langgraph-client-cli@latest threads state thread-456

# Create a run on the thread
npx langgraph-client-cli@latest runs create thread-456 assistant-789 \
  --input '{"messages": [{"role": "human", "content": "Hello!"}]}'
```

**Manage key-value store data:**
```bash
# Store user preferences
npx langgraph-client-cli@latest store set user-123 preferences '{"theme": "dark", "language": "en"}'

# Retrieve user data
npx langgraph-client-cli@latest store get user-123 preferences

# Store session data
npx langgraph-client-cli@latest store set session-456 state '{"step": 3, "data": {"key": "value"}}'

# Search for user sessions
npx langgraph-client-cli@latest store list session --query "user-123" --limit 10

# Clean up old sessions
npx langgraph-client-cli@latest store delete session-456 state
```

**Production deployment with environment variables:**
```bash
export LANGGRAPH_API_URL="https://api.your-company.com"
export LANGGRAPH_API_KEY="$(cat /path/to/secret)"

# All commands now use production settings
npx langgraph-client-cli@latest assistants list --limit 50
```

### 🔧 **Configuration Scenarios**

**Development with config file:**
```bash
npx langgraph-client-cli@latest assistants list -c ./dev-config.json
```

**Override config for specific command:**
```bash
npx langgraph-client-cli@latest assistants list \
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
npx langgraph-client-cli@latest assistants create assistant-config.json
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
cd langgraph-client-cli
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
  <br><br>
  <strong>Created by <a href="https://x.com/nfxDevelopment">Nick Winder</a></strong>
</div>
