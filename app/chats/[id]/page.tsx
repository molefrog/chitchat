"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { Whiteboard } from "../../whiteboard";
import { useWhiteboardStore } from "../../whiteboard-store";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "New chat";
  const clusters = useWhiteboardStore((state) => state.clusters);
  const addCardToStore = useWhiteboardStore((state) => state.addCard);
  const updateCardInStore = useWhiteboardStore((state) => state.updateCard);
  const removeCardFromStore = useWhiteboardStore((state) => state.removeCard);
  const removeClusterFromStore = useWhiteboardStore((state) => state.removeCluster);
  const moveCardToCluster = useWhiteboardStore((state) => state.moveCardToCluster);
  const clearWhiteboard = useWhiteboardStore((state) => state.clearWhiteboard);

  const { messages, sendMessage, status, addToolOutput } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      // Check if it's a dynamic tool first for proper type narrowing
      if (toolCall.dynamic) {
        return;
      }

      if (toolCall.toolName === "logMessage") {
        const input = toolCall.input as { message: string };
        console.log("Tool called with message:", input.message);

        // No await - avoids potential deadlocks
        addToolOutput({
          tool: "logMessage",
          toolCallId: toolCall.toolCallId,
          output: "Message logged to console",
        });
      }

      if (toolCall.toolName === "getWhiteboard") {
        const whiteboardState = JSON.stringify({ clusters }, null, 2);

        addToolOutput({
          tool: "getWhiteboard",
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === "addCard") {
        const input = toolCall.input as {
          id: string;
          color: "red" | "blue" | "green" | "yellow";
          text: string;
          cluster?: string;
        };

        addCardToStore(
          { id: input.id, type: "card", color: input.color, text: input.text, tag: null },
          input.cluster
        );

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters },
          null,
          2
        );
        addToolOutput({
          tool: "addCard",
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === "updateCard") {
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
          tool: "updateCard",
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === "removeCard") {
        const input = toolCall.input as { id: string };

        removeCardFromStore(input.id);

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters },
          null,
          2
        );
        addToolOutput({
          tool: "removeCard",
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === "removeCluster") {
        const input = toolCall.input as { id: string };

        removeClusterFromStore(input.id);

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters },
          null,
          2
        );
        addToolOutput({
          tool: "removeCluster",
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === "clearWhiteboard") {
        clearWhiteboard();

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters },
          null,
          2
        );
        addToolOutput({
          tool: "clearWhiteboard",
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }
    },
  });
  const [input, setInput] = useState("");

  return (
    <div className="flex h-screen bg-zinc-50 [background-image:var(--dotted-pattern-bg)]">
      <div className="flex w-full">
        <main className="flex h-full w-[640px] flex-col px-12 py-8">
          <div className="shadow-ds-border-medium rounded-2xl bg-white h-full flex flex-col">
            <div className="border-b border-zinc-200 p-4">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                  <Undo2 className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-lg">
              {messages.length === 0 && (
                <div className="flex h-full items-center justify-center text-zinc-400">
                  Start a conversation...
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-900"
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div key={index} className=" max-w-none">
                              <ReactMarkdown>{part.text}</ReactMarkdown>
                            </div>
                          );

                        case "tool-getWhiteboard":
                        case "tool-addCard":
                        case "tool-updateCard":
                        case "tool-removeCard":
                        case "tool-removeCluster":
                        case "tool-clearWhiteboard": {
                          const callId = part.toolCallId;
                          const toolName = part.type.replace("tool-", "");

                          switch (part.state) {
                            case "input-streaming":
                            case "input-available":
                              return (
                                <div key={callId} className="text-xs opacity-60 italic">
                                  🔧 {toolName}
                                </div>
                              );
                            case "output-available":
                              return (
                                <div key={callId} className="text-xs opacity-60 italic">
                                  ✓ {toolName}
                                </div>
                              );
                            case "output-error":
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
                  setInput("");
                }
              }}
              className="border-t border-zinc-200 p-4"
            >
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status !== "ready"}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-50 text-lg"
                />
                <button
                  type="submit"
                  disabled={status !== "ready"}
                  className="cursor-pointer rounded-lg text-lg font-medium text-white transition-colors disabled:opacity-50 px-4 py-2"
                  style={{
                    background: "blue",
                    boxShadow: "rgb(3, 18, 152) 0px -2px 0px 3px inset",
                    textShadow: "rgb(51, 51, 51) 0px 1px 0px",
                  }}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </main>

        <div className="flex-1 p-8">
          <Whiteboard />
        </div>
      </div>
    </div>
  );
}
