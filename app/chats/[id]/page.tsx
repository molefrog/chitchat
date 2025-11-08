'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { Whiteboard } from '../../whiteboard';
import { useWhiteboardStore } from '../../whiteboard-store';

export default function ChatPage() {
  const clusters = useWhiteboardStore((state) => state.clusters);
  const addCardToStore = useWhiteboardStore((state) => state.addCard);
  const updateCardInStore = useWhiteboardStore((state) => state.updateCard);
  const removeCardFromStore = useWhiteboardStore((state) => state.removeCard);
  const removeClusterFromStore = useWhiteboardStore((state) => state.removeCluster);
  const moveCardToCluster = useWhiteboardStore((state) => state.moveCardToCluster);
  const clearWhiteboard = useWhiteboardStore((state) => state.clearWhiteboard);

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
        const input = toolCall.input as { message: string };
        console.log('Tool called with message:', input.message);

        // No await - avoids potential deadlocks
        addToolOutput({
          tool: 'logMessage',
          toolCallId: toolCall.toolCallId,
          output: 'Message logged to console',
        });
      }

      if (toolCall.toolName === 'getWhiteboard') {
        const whiteboardState = JSON.stringify({ clusters }, null, 2);

        addToolOutput({
          tool: 'getWhiteboard',
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === 'addCard') {
        const input = toolCall.input as {
          id: string;
          color: 'red' | 'blue' | 'green' | 'yellow';
          text: string;
          cluster?: string;
        };

        addCardToStore(
          { id: input.id, type: 'card', color: input.color, text: input.text, tag: null },
          input.cluster
        );

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters },
          null,
          2
        );
        addToolOutput({
          tool: 'addCard',
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === 'updateCard') {
        const input = toolCall.input as {
          id: string;
          tag?: string;
          cluster?: string;
        };

        if (input.cluster) {
          moveCardToCluster(input.id, input.cluster);
        }

        if (input.tag !== undefined) {
          updateCardInStore(input.id, { tag: input.tag });
        }

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters },
          null,
          2
        );
        addToolOutput({
          tool: 'updateCard',
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === 'removeCard') {
        const input = toolCall.input as { id: string };

        removeCardFromStore(input.id);

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters },
          null,
          2
        );
        addToolOutput({
          tool: 'removeCard',
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === 'removeCluster') {
        const input = toolCall.input as { id: string };

        removeClusterFromStore(input.id);

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters },
          null,
          2
        );
        addToolOutput({
          tool: 'removeCluster',
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === 'clearWhiteboard') {
        clearWhiteboard();

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters },
          null,
          2
        );
        addToolOutput({
          tool: 'clearWhiteboard',
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
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

                    case 'tool-getWhiteboard':
                    case 'tool-addCard':
                    case 'tool-updateCard':
                    case 'tool-removeCard':
                    case 'tool-removeCluster':
                    case 'tool-clearWhiteboard': {
                      const callId = part.toolCallId;
                      const toolName = part.type.replace('tool-', '');

                      switch (part.state) {
                        case 'input-streaming':
                        case 'input-available':
                          return (
                            <div key={callId} className="text-xs opacity-60 italic">
                              🔧 {toolName}
                            </div>
                          );
                        case 'output-available':
                          return (
                            <div key={callId} className="text-xs opacity-60 italic">
                              ✓ {toolName}
                            </div>
                          );
                        case 'output-error':
                          return (
                            <div key={callId} className="text-xs text-red-500">
                              ✗ {toolName}: {part.errorText}
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
