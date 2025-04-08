# Zarin Installation Guide

Zarin is a free, open-source AI chat app with multi-model support. This guide covers how to install and run zarin on different platforms, including Docker deployment options.

![Zarin screenshot](./public/cover-zarin.png)

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git
- API keys for supported AI models (OpenAI, AI/ML API, etc.)

## Environment Setup

First, you'll need to set up your environment variables. Create a `.env.local` file in the root of the project with the following variables:

```bash
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# AI/ML API
AIML_API_KEY=your_ai_ml_api_key
```

## Local Installation

### macOS / Linux

```bash
# Clone the repository
git clone https://github.com/abdibrokhim/zarin.git
cd zarin

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Windows

```bash
# Clone the repository
git clone https://github.com/abdibrokhim/zarin.git
cd zarin

# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).


## Community and Support

- GitHub Issues: Report bugs or request features
- GitHub Discussions: Ask questions and share ideas

## License

Apache License 2.0
