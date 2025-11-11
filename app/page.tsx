"use client";

import Scheduler from "./components/Scheduler/Scheduler";
import LUchat_Icon from "./components/LUchat/Icon/LUchat_Icon";
import LUchat from "./components/LUchat/Chat/LUchat";
import { useState } from "react";
import { processAISchedulerCommand } from "@/lib/AILogic";
import { TimeTableEvents, ExtraEvents } from "./components/Scheduler/Scheduler";

//import or define events here from scheduler.tsx

export default function Home() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState(TimeTableEvents);
  const [pendingSuggestions, setPendingSuggestions] = useState<any[]>([]);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [pendingActionType, setPendingActionType] = useState<
    "suggestions" | "clear" | null
  >(null);

  const handleMessage = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    // Check if user is responding to a confirmation
    if (waitingForConfirmation) {
      const isYes =
        lowerMessage.includes("yes") ||
        lowerMessage.includes("add") ||
        lowerMessage.includes("sure") ||
        lowerMessage.includes("ok");
      const isNo =
        lowerMessage.includes("no") ||
        lowerMessage.includes("cancel") ||
        lowerMessage.includes("don't");

      if (
        pendingActionType === "suggestions" &&
        pendingSuggestions.length > 0
      ) {
        if (isYes) {
          console.log("Before adding - Current events count:", events.length);
          console.log("Pending suggestions to add:", pendingSuggestions);
          console.log("Pending suggestions count:", pendingSuggestions.length);

          const newEvents = [...events, ...pendingSuggestions];
          console.log("New events count:", newEvents.length);
          console.log("New events:", newEvents);

          setEvents(newEvents);
          const addedTitles = pendingSuggestions.map((e) => e.title).join(", ");
          setPendingSuggestions([]);
          setWaitingForConfirmation(false);
          setPendingActionType(null);
          return `Great! I've added ${addedTitles} to your schedule. You can see them on your calendar now.`;
        } else if (isNo) {
          setPendingSuggestions([]);
          setWaitingForConfirmation(false);
          setPendingActionType(null);
          return "No problem! Let me know if you'd like other suggestions or if there's anything else I can help with.";
        }
      } else if (pendingActionType === "clear") {
        if (isYes) {
          setEvents(TimeTableEvents);
          setWaitingForConfirmation(false);
          setPendingActionType(null);
          return "All extra events have been cleared! Your timetable classes remain unchanged.";
        } else if (isNo) {
          setWaitingForConfirmation(false);
          setPendingActionType(null);
          return "No problem! Your schedule remains unchanged.";
        }
      }
    }

    // Process the message with AILogic
    const response = processAISchedulerCommand(message, {
      events,
      timeTableEvents: TimeTableEvents,
      extraEvents: ExtraEvents,
    });

    console.log("AI Response:", response);
    console.log("AI Suggestions:", response.suggestions);
    console.log("AI Suggestions count:", response.suggestions?.length);

    // Handle suggestions
    if (response.suggestions && response.suggestions.length > 0) {
      console.log("Setting pending suggestions:", response.suggestions);
      setPendingSuggestions(response.suggestions);
      setWaitingForConfirmation(true);
      setPendingActionType("suggestions");
      return response.message; // AILogic already asks for confirmation in the message
    }

    // Handle clear events action
    if (response.action?.type === "CLEAR_EXTRA_EVENTS") {
      setWaitingForConfirmation(true);
      setPendingActionType("clear");
      return response.message; // AILogic already asks for confirmation
    }

    return response.message;
  };

  return (
    <>
      <Scheduler key={events.length} events={events} />
      {open ? (
        <LUchat
          onMinimize={() => setOpen(false)}
          onProccessMessage={handleMessage}
        />
      ) : (
        <LUchat_Icon onClick={() => setOpen(true)} />
      )}
    </>
  );
}
