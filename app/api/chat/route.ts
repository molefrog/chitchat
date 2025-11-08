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
    },
  });

  return result.toUIMessageStreamResponse();
}
