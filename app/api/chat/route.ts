import {openai} from "@ai-sdk/openai";
import {convertToModelMessages, streamText, UIMessage} from 'ai'

export const maxDuration = 30

//TODO This is NOT working. NONE of the console messages are being logged, so message is not being posted.
export async function POST(req: Request){
  try {
      console.log("POST /api/chat - Request Recieveid");
      console.log("OPENAI_API_KEY exists?", !!process.env.OPENAI_API_KEY);
      console.log("OPENAI_API_KEY first 10 chars:", process.env.OPENAI_API_KEY?.substring(0, 10));

      const {messages}: {messages: UIMessage[]} = await req.json()

      console.log("Messages Recieved",messages);
      
      const convertedMessages = convertToModelMessages(messages);
      console.log("Converted messages:", JSON.stringify(convertedMessages, null, 2));

      // Direct test with generateText instead of streamText
      console.log("Trying generateText...");
      const { generateText } = await import('ai');

      try {
        const testResult = await generateText({
          model: openai("gpt-4o-mini"),
          prompt: "Say hello in one word",
        });
        console.log("Direct generateText worked! Response:", testResult.text);
      } catch (err) {
        console.error("Direct generateText failed:", err);
      }

      const result = streamText({
        model: openai("gpt-4o-mini"),
        messages: convertedMessages,
        system: `You are LU ChatBot, you are friendly,helpful and concise.
                  You assist Lancaster students in scheduling their timetable by editing the schedular component,
                  and giving suggestions of events that fit the student's needs. If the User asks to clear the timetable, do so, but SOLELY of
                  the events you have put. Always ask for confirmation before editing, adding or clearing the scheduler.`,
        onFinish: ({ text, finishReason, usage }) => {
          console.log("Stream finished!");
          console.log("Text:", text);
          console.log("Finish reason:", finishReason);
          console.log("Usage:", usage);
        },
        onError: (error) => {
          console.error("Stream error:", error);
        },
      });

      console.log("streamText result created");

      return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return new Response("Internal Servor Error", {status: 500})
  }
}

/*
    This is the Backend API which sends the message to openAI's API.
*/