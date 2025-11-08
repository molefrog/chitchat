import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4.1"),
    messages: convertToModelMessages(messages),
    system: `You are an expert at creating interactive visuals to explain concepts clearly and simply.

# Examples of what kinds of visuals you can create
- Simple org charts and how they are changed over time
- Explaining general concept, e.g. "How a AI agent works"
- Visualising project management, timeline, how tasks are assigned, killed etc.
- And many more...

# What you work with
You have access to the **Whiteboard** that displays props and their layout.
Use it to visualize ideas, relationships, and concepts during conversations.

Available props:
- **Card**. Like a sticker with a text, color and optional tag. 
  - "id": unique id of the card (required)
  - "color": basic colors 4 colors: red, blue, green, yellow (required)
  - "text": short text on the card, like "User" or "CEO" or "A" or "Alice" etc. Can be no longer than a sentence. (required)
  - "tag": optional only symbol tag that can be added to the card later on. Like "🛑" or "🔥" or "💡" or "🔍" etc. (optional) Tags are used to update the card after some action for example.

Layout:
- Props are displayed on a canvas in clusters. A clusters is a ordered list of props.
- Empty whiteboard contains only one cluster with id "default"
- New cards by default are added to the "default" cluster
- Clusters can be removed, cards can be moved to different clusters
- When all cards are removed from a cluster, the cluster automatically disappears

Rules:
- A new card always created without a tag, tags are added later on to describe a transition or action.
For example, a team member got sick, we add a tag "💀" to the card to indicate that the team member is sick.

## Actions
You are equipped with the tools for interacting with the whiteboard. Tools always return up to date
state of the whiteboard after the action.

You can execute multiple actions in one turn, a user can also ask to change something.
`,

    tools: {
      // client-side tool that is automatically executed on the client:
      logMessage: {
        description: "Log a message to the browser console.",
        inputSchema: z.object({
          message: z.string().describe("The message to log to the console."),
        }),
      },
      getWhiteboard: {
        description: "Get the current state of the whiteboard with all clusters and cards.",
        inputSchema: z.object({}),
      },
      addCard: {
        description:
          "Add a new card to the whiteboard. Cards are displayed as colored stickers with text.",
        inputSchema: z.object({
          id: z.string().describe("Unique identifier for the card"),
          color: z.enum(["red", "blue", "green", "yellow"]).describe("Color of the card"),
          text: z
            .string()
            .describe("Short text to display on the card (e.g., name, label, concept)"),
          cluster: z
            .string()
            .optional()
            .describe(
              'Optional cluster ID to add the card to. Defaults to "default" if not specified.'
            ),
        }),
      },
      updateCard: {
        description:
          "Update a card on the whiteboard. Can set/update the tag or move the card to a different cluster.",
        inputSchema: z.object({
          id: z.string().describe("ID of the card to update"),
          tag: z.string().optional().describe("Emoji tag to add/update on the card (e.g., 🔥, 💡, 🛑)"),
          cluster: z.string().optional().describe("Cluster ID to move the card to"),
        }),
      },
      removeCard: {
        description: "Remove a card from the whiteboard.",
        inputSchema: z.object({
          id: z.string().describe("ID of the card to remove"),
        }),
      },
      removeCluster: {
        description: "Remove an entire cluster from the whiteboard.",
        inputSchema: z.object({
          id: z.string().describe("ID of the cluster to remove"),
        }),
      },
      clearWhiteboard: {
        description: "Clear the entire whiteboard, removing all clusters and cards. Use this to start fresh.",
        inputSchema: z.object({}),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
