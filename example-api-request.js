const { OpenAI } = require('openai');

const api = new OpenAI({
  baseURL: 'https://api.aimlapi.com/v1',
  apiKey: 'token',
});

const main = async () => {
  const result = await api.chat.completions.create({
    model: 'google/gemini-2.0-flash',
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