import {openai} from "@ai-sdk/openai";
import {convertToModelMessages, streamText, UIMessage} from 'ai'

export const maxDuration = 30

export async function POST(req: Request){
  try {
      console.log("POST /api/chat - Request Recieveid");
      const {messages}: {messages: UIMessage[]} = await req.json()

      console.log("Messages Recieved",messages);
      
      const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: convertToModelMessages(messages),
      system: `You are LU ChatBot, you are friendly,helpful and concise. 
                You assist Lancaster students in scheduling their timetable by editing the schedular component, 
                and giving suggestions of events that fit the student's needs. If the User asks to clear the timetable, do so, but SOLELY of
                the events you have put. Always ask for confirmation before editing, adding or clearing the scheduler.` 
      });

      console.log("streamText result created, returning + response");
  
      return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return new Response("Internal Servor Error", {status: 500})
  }
}

/*
    This is the Backend API which sends the message to openAI's API.
*/