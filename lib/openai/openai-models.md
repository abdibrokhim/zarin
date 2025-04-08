### ---- ###

import OpenAI from 'openai';

const api = new OpenAI({
  baseURL: 'https://api.aimlapi.com/v1',
  apiKey: '<YOUR_API_KEY>',
});

const main = async () => {
  const answer = await api.chat.completions.create({
    model: 'gpt-4o-mini-search-preview',
    web_search_options: {},
    messages: [
      {
        role: 'user',
        content: 'What holiday is today?'
      }
    ],
  });

  console.log(answer.choices[0]);
};

main();

### ---- ###

const { OpenAI } = require('openai');

const api = new OpenAI({
  baseURL: 'https://api.aimlapi.com/v1',
  apiKey: '<YOUR_API_KEY>',
});

const main = async () => {
  const result = await api.chat.completions.create({
    model: 'o3-mini',
    messages: [
      {
        role: 'user',
        content: 'Tell me, why is the sky blue?'
      }
    ],
  });

  const message = result.choices[0].message.content;
  console.log(`Assistant: ${message}`);
};

main();

### ---- ###

const { OpenAI } = require('openai');

const api = new OpenAI({
  baseURL: 'https://api.aimlapi.com/v1',
  apiKey: '<YOUR_API_KEY>',
});

const main = async () => {
  const result = await api.chat.completions.create({
    model: 'o1',
    messages: [
      {
        role: 'user',
        content: 'Tell me, why is the sky blue?'
      }
    ],
  });

  const message = result.choices[0].message.content;
  console.log(`Assistant: ${message}`);
};

main();

### ---- ###

const { OpenAI } = require('openai');

const api = new OpenAI({
  baseURL: 'https://api.aimlapi.com/v1',
  apiKey: '<YOUR_API_KEY>',
});

const main = async () => {
  const result = await api.chat.completions.create({
    model: 'gpt-4.5-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an AI assistant who knows everything.',
      },
      {
        role: 'user',
        content: 'Tell me, why is the sky blue?'
      }
    ],
  });

  const message = result.choices[0].message.content;
  console.log(`Assistant: ${message}`);
};

main();