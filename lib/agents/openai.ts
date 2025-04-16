import { MODELS as OPENAI_MODELS } from "@/lib/models/openai"

// const { OpenAI } = require('openai');

// Example Request
// const api = new OpenAI({
//   baseURL: 'https://api.aimlapi.com/v1',
//   apiKey: '<YOUR_API_KEY>',
// });

// const main = async () => {
//   const result = await api.chat.completions.create({
//     model: 'o1',
//     messages: [
//       {
//         role: 'system',
//         content: 'You are a helpful assistant.'
//       },
//       {
//         role: 'user',
//         content: 'Tell me, why is the sky blue?'
//       }
//     ],
//   });

//   const message = result.choices[0].message.content;
//   console.log(`Assistant: ${message}`);
// };

// main();

// Core concepts:
// Agents: LLMs configured with instructions, tools, guardrails, and handoffs
// Handoffs: A specialized tool call used by the Agents SDK for transferring control between agents
// Guardrails: Configurable safety checks for input and output validation
// Tracing: Built-in tracking of agent runs, allowing you to view, debug and optimize your workflows
// Explore the examples directory to see the SDK in action, and read our documentation for more details.

// Notably, our SDK is compatible with any model providers that support the OpenAI Chat Completions API format.

// Get started
// Set up your Python environment
// python -m venv env
// source env/bin/activate
// Install Agents SDK
// pip install openai-agents
// For voice support, install with the optional voice group: pip install 'openai-agents[voice]'.

// Hello world example
// from agents import Agent, Runner

// agent = Agent(name="Assistant", instructions="You are a helpful assistant")

// result = Runner.run_sync(agent, "Write a haiku about recursion in programming.")
// print(result.final_output)

// # Code within the code,
// # Functions calling themselves,
// # Infinite loop's dance.
// (If running this, ensure you set the OPENAI_API_KEY environment variable)

// (For Jupyter notebook users, see hello_world_jupyter.py)

// Handoffs example
// from agents import Agent, Runner
// import asyncio

// spanish_agent = Agent(
//     name="Spanish agent",
//     instructions="You only speak Spanish.",
// )

// english_agent = Agent(
//     name="English agent",
//     instructions="You only speak English",
// )

// triage_agent = Agent(
//     name="Triage agent",
//     instructions="Handoff to the appropriate agent based on the language of the request.",
//     handoffs=[spanish_agent, english_agent],
// )


// async def main():
//     result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
//     print(result.final_output)
//     # ¡Hola! Estoy bien, gracias por preguntar. ¿Y tú, cómo estás?


// if __name__ == "__main__":
//     asyncio.run(main())
// Functions example
// import asyncio

// from agents import Agent, Runner, function_tool


// @function_tool
// def get_weather(city: str) -> str:
//     return f"The weather in {city} is sunny."


// agent = Agent(
//     name="Hello world",
//     instructions="You are a helpful agent.",
//     tools=[get_weather],
// )


// async def main():
//     result = await Runner.run(agent, input="What's the weather in Tokyo?")
//     print(result.final_output)
//     # The weather in Tokyo is sunny.


// if __name__ == "__main__":
//     asyncio.run(main())


// {
//     "model": "gpt-4",
//     "messages": [
//       {
//         "role": "system",
//         "content": "",
//       }
//     ],
//     "tools": [
//       {
//         "type": "function",
//         "function": {
//           "description": "",
//           "name": "",
//           "parameters": null,
//           "strict": null,
//           "required": [
//             ""
//           ]
//         }
//       }
//     ],
//     "tool_choice": "auto",
//     "parallel_tool_calls": true,
//     "reasoning_effort": "low",
//     "web_search_options": {
//       "search_context_size": "low",
//       "user_location": {
//         "approximate": {
//           "city": "",
//           "country": "",
//           "region": "",
//           "timezone": ""
//         },
//         "type": "approximate"
//       }
//     }
//   }