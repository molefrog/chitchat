'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { Whiteboard } from './whiteboard';

export default function Home() {
  const { messages, sendMessage, status, addToolOutput } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      // Check if it's a dynamic tool first for proper type narrowing
      if (toolCall.dynamic) {
        return;
      }

      if (toolCall.toolName === 'logMessage') {
        console.log('Tool called with message:', toolCall.input.message);

        // No await - avoids potential deadlocks
        addToolOutput({
          tool: 'logMessage',
          toolCallId: toolCall.toolCallId,
          output: 'Message logged to console',
        });
      }
    },
  });
  const [input, setInput] = useState('');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <div className="flex h-[600px] w-full max-w-6xl gap-4">
        <main className="flex h-full w-full max-w-2xl flex-col rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Chitchat
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Simple AI chat powered by GPT-4
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-zinc-400">
              Start a conversation...
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                }`}
              >
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case 'text':
                      return <span key={index}>{part.text}</span>;

                    case 'tool-logMessage': {
                      const callId = part.toolCallId;

                      switch (part.state) {
                        case 'input-streaming':
                          return (
                            <div key={callId} className="text-sm opacity-70">
                              Preparing to log message...
                            </div>
                          );
                        case 'input-available':
                          return (
                            <div key={callId} className="text-sm opacity-70">
                              Logging message to console...
                            </div>
                          );
                        case 'output-available':
                          return (
                            <div key={callId} className="text-sm opacity-70">
                              {part.output}
                            </div>
                          );
                        case 'output-error':
                          return (
                            <div key={callId} className="text-sm text-red-500">
                              Error: {part.errorText}
                            </div>
                          );
                      }
                      break;
                    }

                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
              setInput('');
            }
          }}
          className="border-t border-zinc-200 p-4 dark:border-zinc-800"
        >
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== 'ready'}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-zinc-100 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status !== 'ready'}
              className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </main>
      <Whiteboard />
      </div>
    </div>
  );
}
