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

  const handleMessage = (message: string): string => {
    const response = processAISchedulerCommand(message, {
      events,
      timeTableEvents: TimeTableEvents, //Giving AI the arrays as a message, so it can read and make the new events array.
      extraEvents: ExtraEvents,
    });

    if (response.suggestions && response.suggestions.length > 0) {
      if (
        window.confirm(
          `Add these activities?\n${response.suggestions
            .map((e) => e.title)
            .join("\n")}`
        )
      ) {
        setEvents([...events, ...response.suggestions]);
      }
    }

    if (response.action?.type === "CLEAR_EXTRA_EVENTS") {
      if (window.confirm("Clear all extra events?")) {
        setEvents(TimeTableEvents);
      }
    }

    return response.message;
  };

  return (
    <>
      <Scheduler events={events} />
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
