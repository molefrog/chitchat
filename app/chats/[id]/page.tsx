"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { Whiteboard } from "../../whiteboard";
import { useWhiteboardStore } from "../../whiteboard-store";

const DEMO_SUMMARY = `## Document Summary - Last 24 Hours (Nov 8, 2025) - Updated Analysis

### PEOPLE
- **Evan Gusev**: Primary author/editor across all documents; Task assignee for multiple projects (Q4 lead magnet, campaign dashboard, website redesign, pricing table, email nurture, newsletter draft); Project owner for Website Refresh and Q4 Lead Gen
- **Alex**: Mentioned in Finance team space - tasked to budget website refresh

### COMPANIES
- **MockMock Inc**: Main company workspace with comprehensive team structure

### FUNCTIONS WITHIN COMPANY
- **Product Squad A**: API error boundary handling, billing page tests; 27 tickets done, 2.8 days median lead time; Sprint ending 2025-11-21; Blocker: awaiting sandbox credentials from Ops; Action items: test quarantine lane, stable dataset snapshots twice weekly
- **Product Squad B**: Dashboard empty states, accessibility work, performance profiling; 31 tickets done, P95 render 0.8s; Sprint ending 2025-11-21; Action items: chart skeleton loaders, color contrast token expansion; Dedicated A11y QA hour daily
- **Sales**: 12 demos, 3 commits, 5 in procurement; Enterprise Q4 outreach; Win rate 26%→29%, cycle time 34→32 days; Week ending 2025-11-21; Blocker: pricing approval for 2 custom deals; Action items: deal desk office hours, pricing one-pagers by tier, enablement on lead magnet
- **Marketing**: Q4 lead magnet launch, December newsletter draft, campaign work; CPL down 12%, organic demo requests up 8%; Week ending 2025-11-21; Blocker: final CTA copy needs Product validation; Action items: A/B testing checklist, weekly messaging sync with Product
- **Finance**: CAC/LTV dashboard updates, board finance pack prep; Close time improved by 1 day; Blocker: waiting on Marketing spend export; Action item: budget website refresh (assigned to Alex)
- **Ops**: Synthetic checks for billing endpoints, sandbox provisioning automation; Mentioned as blocker source by Product Squad A (sandbox credentials needed)

### PROJECTS
- **Website Refresh**: Due Dec 1, 2025; Owner: Evan Gusev; Status: In progress; Tasks include redesign hero section (in progress), update pricing table (to do), accessibility audit (to do)
- **Q4 Lead Gen**: Due Dec 20, 2025; Owner: Evan Gusev; Status: In progress; Tasks include launch Q4 lead magnet (to do, high priority), campaign dashboard (to do), email nurture setup (in progress)
- **Sprint ending 2025-11-21**: Active sprint for Product Squad A & B
- **Week ending 2025-11-21**: Active week for Sales, Marketing teams

### STRATEGY DOCUMENTS
- **Company Strategy FY26**: Edited Nov 8 - added review reminder; Sections: Objective, Context, Bets and rationale, Success metrics, Risks and mitigations, Timeline and owners
- **Product Strategy**: Edited Nov 8 - add themes by Q1; Sections: Problem spaces, Themes and bets, Roadmap by quarter, Quality/performance/security bar, Research and validation plan
- **Sales Strategy**: Edited Nov 8 - add quotas draft; Sections: ICP and qualification, Messaging and objection handling, Territory and quota, Deal desk policy, Forecast methodology
- **Marketing Strategy**: Edited Nov 8 - add positioning v1 link; Sections: Positioning and narrative, Demand gen plays, Content and lifecycle, Measurement framework, Budget and channels
- **Finance Strategy**: Edited Nov 8 - add FY26 forecast scenario A/B; Sections: Revenue and margin targets, Unit economics guardrails, Forecasting and scenarios, Close process and reporting
- **Ops Strategy**: Edited Nov 8 - add SLO targets draft; Sections: Reliability targets and error budgets, Incident response, Tooling and automation roadmap, Security and compliance timeline

### STANDUPS SCHEDULED
- Multiple standup templates created for dates: 2025-11-10, 2025-11-11, 2025-11-12, 2025-11-13, 2025-11-14 across all teams`;

export default function ChatPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "New chat";
  const isDemo = searchParams.get("demo") === "true";
  const hasAutoSent = useRef(false);
  const clusters = useWhiteboardStore((state) => state.clusters);
  const caption = useWhiteboardStore((state) => state.caption);
  const addCardToStore = useWhiteboardStore((state) => state.addCard);
  const updateCardInStore = useWhiteboardStore((state) => state.updateCard);
  const removeCardFromStore = useWhiteboardStore((state) => state.removeCard);
  const removeClusterFromStore = useWhiteboardStore((state) => state.removeCluster);
  const moveCardToCluster = useWhiteboardStore((state) => state.moveCardToCluster);
  const setCaption = useWhiteboardStore((state) => state.setCaption);
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
        const whiteboardState = JSON.stringify({ clusters, caption }, null, 2);

        addToolOutput({
          tool: "getWhiteboard",
          toolCallId: toolCall.toolCallId,
          output: whiteboardState,
        });
      }

      if (toolCall.toolName === "setCaption") {
        const input = toolCall.input as { caption: string };

        setCaption(input.caption);

        const whiteboardState = JSON.stringify(
          { clusters: useWhiteboardStore.getState().clusters, caption: input.caption },
          null,
          2
        );
        addToolOutput({
          tool: "setCaption",
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
        const input = toolCall.input as { name: string };

        removeClusterFromStore(input.name);

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

  // Auto-send demo message when landing on a demo page
  useEffect(() => {
    if (isDemo && !hasAutoSent.current && status === "ready") {
      hasAutoSent.current = true;
      sendMessage({
        text: `Clear the whiteboard and explain what happened in the company based on the summary:\n\n${DEMO_SUMMARY}`,
      });
    }
  }, [isDemo, status, sendMessage]);

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
                        case "tool-setCaption":
                        case "tool-clearWhiteboard": {
                          const callId = part.toolCallId;
                          const toolName = part.type.replace("tool-", "");

                          switch (part.state) {
                            case "input-streaming":
                            case "input-available":
                              return (
                                <div
                                  key={callId}
                                  className="text-base bg-white shadow-ds-border rounded-full inline-block font-medium italic px-3 py-px mb-1 mr-1"
                                >
                                  🔧 {toolName}
                                </div>
                              );
                            case "output-available":
                              return (
                                <div
                                  key={callId}
                                  className="text-base bg-white shadow-ds-border rounded-full inline-block font-medium italic px-3 py-px mb-1 mr-1"
                                >
                                  ✓ {toolName}
                                </div>
                              );
                            case "output-error":
                              return (
                                <div
                                  key={callId}
                                  className="text-base bg-white shadow-ds-border rounded-full inline-block font-medium text-red-500"
                                >
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
