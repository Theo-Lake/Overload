"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styles from "./Scheduler.module.css";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}
interface SchedulerProps {
  events?: CalendarEvent[];
}

export const TimeTableEvents = [
  //HARD coded for now, but in practice would be in a DB
  // Monday (2025-11-10)
  {
    id: "tt-1",
    title: "Lecture: Operating Systems",
    start: "2025-11-10T09:00:00",
    end: "2025-11-10T11:00:00",
  },
  {
    id: "tt-2",
    title: "Tutorial: Software Engineering",
    start: "2025-11-10T11:00:00",
    end: "2025-11-10T12:00:00",
  },
  {
    id: "tt-3",
    title: "Lab: Computer Graphics",
    start: "2025-11-10T18:00:00", // CLASHES with Debate Society (18:00-20:00)
    end: "2025-11-10T20:00:00",
  },

  // Tuesday (2025-11-11)
  {
    id: "tt-4",
    title: "Lecture: Web Development",
    start: "2025-11-11T09:00:00",
    end: "2025-11-11T11:00:00",
  },
  {
    id: "tt-5",
    title: "Seminar: Human-Computer Interaction",
    start: "2025-11-11T12:00:00", // CLASHES with Gym Session (12:00-13:00)
    end: "2025-11-11T13:00:00",
  },

  {
    id: "tt-7",
    title: "Lab: Python Programming",
    start: "2025-11-11T17:00:00", // CLASHES with Photography Workshop (17:00-19:00)
    end: "2025-11-11T19:00:00",
  },

  // Wednesday (2025-11-12)
  {
    id: "tt-8",
    title: "Lecture: Algorithms & Data Structures",
    start: "2025-11-12T09:00:00",
    end: "2025-11-12T11:00:00",
  },

  {
    id: "tt-10",
    title: "Tutorial: Machine Learning",
    start: "2025-11-12T15:00:00",
    end: "2025-11-12T16:00:00",
  },
  {
    id: "tt-11",
    title: "Seminar: Ethics in Computing",
    start: "2025-11-12T18:00:00", // CLASHES with Film Society Screening (18:00-21:00)
    end: "2025-11-12T20:00:00",
  },

  // Thursday (2025-11-13)
  {
    id: "tt-12",
    title: "Lecture: Artificial Intelligence",
    start: "2025-11-13T09:00:00",
    end: "2025-11-13T11:00:00",
  },

  {
    id: "tt-14",
    title: "Seminar: Cybersecurity",
    start: "2025-11-13T15:00:00", // CLASHES with Cooking Class (15:00-17:00)
    end: "2025-11-13T17:00:00",
  },
  {
    id: "tt-15",
    title: "Tutorial: Distributed Systems",
    start: "2025-11-13T18:00:00", // CLASHES with Coding Bootcamp (18:00-20:00)
    end: "2025-11-13T20:00:00",
  },

  // Friday (2025-11-14)

  {
    id: "tt-18",
    title: "Lab: Data Science",
    start: "2025-11-14T14:00:00", // CLASHES with Art Workshop (14:00-16:00)
    end: "2025-11-14T16:00:00",
  },
  {
    id: "tt-19",
    title: "Lecture: Software Testing",
    start: "2025-11-14T16:00:00", // CLASHES with Drama Club Rehearsal (16:00-18:00)
    end: "2025-11-14T18:00:00",
  },
];

export const ExtraEvents = [
  //HARD coded for now, but in practice would be in a DB
  // Monday (2025-11-10)
  {
    id: "extra-1",
    title: "Morning Yoga",
    start: "2025-11-10T07:00:00",
    end: "2025-11-10T08:00:00",
  },
  {
    id: "extra-2",
    title: "Debate Society",
    start: "2025-11-10T18:00:00",
    end: "2025-11-10T20:00:00",
  },
  {
    id: "extra-3",
    title: "Board Games Night",
    start: "2025-11-10T19:00:00",
    end: "2025-11-10T21:00:00",
  },

  // Tuesday (2025-11-11)
  {
    id: "extra-4",
    title: "Chess Club",
    start: "2025-11-11T16:00:00",
    end: "2025-11-11T18:00:00",
  },
  {
    id: "extra-5",
    title: "Photography Workshop",
    start: "2025-11-11T17:00:00",
    end: "2025-11-11T19:00:00",
  },
  {
    id: "extra-6",
    title: "Gym Session",
    start: "2025-11-11T12:00:00",
    end: "2025-11-11T13:00:00",
  },
  {
    id: "extra-7",
    title: "Creative Writing Circle",
    start: "2025-11-11T19:00:00",
    end: "2025-11-11T21:00:00",
  },

  // Wednesday (2025-11-12)
  {
    id: "extra-8",
    title: "Latin Society",
    start: "2025-11-12T10:00:00",
    end: "2025-11-12T12:00:00",
  },
  {
    id: "extra-9",
    title: "Meditation Session",
    start: "2025-11-12T13:00:00",
    end: "2025-11-12T14:00:00",
  },
  {
    id: "extra-10",
    title: "Film Society Screening",
    start: "2025-11-12T18:00:00",
    end: "2025-11-12T21:00:00",
  },
  {
    id: "extra-11",
    title: "Rock Climbing",
    start: "2025-11-12T16:00:00",
    end: "2025-11-12T18:00:00",
  },

  // Thursday (2025-11-13)
  {
    id: "extra-12",
    title: "Morning Run Club",
    start: "2025-11-13T07:00:00",
    end: "2025-11-13T08:00:00",
  },
  {
    id: "extra-13",
    title: "Music Jam Session",
    start: "2025-11-13T17:00:00",
    end: "2025-11-13T19:00:00",
  },
  {
    id: "extra-14",
    title: "Coding Bootcamp",
    start: "2025-11-13T18:00:00",
    end: "2025-11-13T20:00:00",
  },
  {
    id: "extra-15",
    title: "Cooking Class",
    start: "2025-11-13T15:00:00",
    end: "2025-11-13T17:00:00",
  },

  // Friday (2025-11-14)
  {
    id: "extra-16",
    title: "Pilates Class",
    start: "2025-11-14T08:00:00",
    end: "2025-11-14T09:00:00",
  },
  {
    id: "extra-17",
    title: "Drama Club Rehearsal",
    start: "2025-11-14T16:00:00",
    end: "2025-11-14T18:00:00",
  },
  {
    id: "extra-18",
    title: "Pub Quiz Night",
    start: "2025-11-14T20:00:00",
    end: "2025-11-14T22:00:00",
  },
  {
    id: "extra-19",
    title: "Art Workshop",
    start: "2025-11-14T14:00:00",
    end: "2025-11-14T16:00:00",
  },

  // Saturday (2025-11-15)
  {
    id: "extra-20",
    title: "Football Match",
    start: "2025-11-15T10:00:00",
    end: "2025-11-15T12:00:00",
  },
  {
    id: "extra-21",
    title: "Farmers Market Volunteering",
    start: "2025-11-15T09:00:00",
    end: "2025-11-15T13:00:00",
  },
  {
    id: "extra-22",
    title: "Pottery Class",
    start: "2025-11-15T14:00:00",
    end: "2025-11-15T16:00:00",
  },
  {
    id: "extra-23",
    title: "Dance Workshop",
    start: "2025-11-15T15:00:00",
    end: "2025-11-15T17:00:00",
  },
  {
    id: "extra-24",
    title: "Gaming Tournament",
    start: "2025-11-15T18:00:00",
    end: "2025-11-15T22:00:00",
  },

  // Sunday (2025-11-16)
  {
    id: "extra-25",
    title: "Hiking Trip",
    start: "2025-11-16T08:00:00",
    end: "2025-11-16T14:00:00",
  },
  {
    id: "extra-26",
    title: "Sunday Brunch Club",
    start: "2025-11-16T10:00:00",
    end: "2025-11-16T12:00:00",
  },
  {
    id: "extra-27",
    title: "Book Club Meeting",
    start: "2025-11-16T15:00:00",
    end: "2025-11-16T17:00:00",
  },
  {
    id: "extra-28",
    title: "Meditation & Mindfulness",
    start: "2025-11-16T18:00:00",
    end: "2025-11-16T19:00:00",
  },
  {
    id: "extra-29",
    title: "Open Mic Night",
    start: "2025-11-16T19:00:00",
    end: "2025-11-16T21:00:00",
  },

  // More general events throughout the week
  {
    id: "extra-30",
    title: "Language Exchange Meetup",
    start: "2025-11-11T18:00:00",
    end: "2025-11-11T20:00:00",
  },
  {
    id: "extra-31",
    title: "Swimming",
    start: "2025-11-13T12:00:00",
    end: "2025-11-13T13:00:00",
  },
  {
    id: "extra-32",
    title: "Environmental Society",
    start: "2025-11-14T17:00:00",
    end: "2025-11-14T19:00:00",
  },
  {
    id: "extra-33",
    title: "Study Group - Algorithms",
    start: "2025-11-12T14:00:00",
    end: "2025-11-12T16:00:00",
  },
  {
    id: "extra-34",
    title: "Badminton Club",
    start: "2025-11-13T16:00:00",
    end: "2025-11-13T18:00:00",
  },
  {
    id: "extra-35",
    title: "Tech Talks",
    start: "2025-11-14T18:00:00",
    end: "2025-11-14T20:00:00",
  },
];

export default function Scheduler({ events: propEvents }: SchedulerProps) {
  const events = propEvents || TimeTableEvents;

  console.log("[Scheduler] Rendering with events count:", events.length);
  console.log("[Scheduler] Events:", events);

  //TODO: Make it so AI can change and add events.

  return (
    <div className={styles.schedulerContainer}>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        allDaySlot={false}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        height="auto"
        key={events.length}
      />
    </div>
  );
}
