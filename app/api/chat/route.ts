import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-4.1'),
    messages: convertToModelMessages(messages),
    tools: {
      // client-side tool that is automatically executed on the client:
      logMessage: {
        description: 'Log a message to the browser console.',
        inputSchema: z.object({
          message: z.string().describe('The message to log to the console.'),
        }),
      },
      getWhiteboard: {
        description: 'Get the current state of the whiteboard with all clusters and cards.',
        inputSchema: z.object({}),
      },
      addCard: {
        description: 'Add a new card to the whiteboard. Cards are displayed as colored stickers with text.',
        inputSchema: z.object({
          id: z.string().describe('Unique identifier for the card'),
          color: z.enum(['red', 'blue', 'green', 'yellow']).describe('Color of the card'),
          text: z.string().describe('Short text to display on the card (e.g., name, label, concept)'),
          cluster: z.string().optional().describe('Optional cluster ID to add the card to. Defaults to "default" if not specified.'),
        }),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
