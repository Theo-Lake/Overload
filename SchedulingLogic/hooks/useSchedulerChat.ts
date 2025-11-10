// hooks/useSchedulerChat.ts

import { useState, useCallback, useRef } from 'react';
import { processAISchedulerCommand, SchedulerState } from '@/lib/AILogic';
import { CalendarEvent } from '@/app/components/Scheduler/Scheduler';
export interface UseSchedulerChatProps {
  timeTableEvents: CalendarEvent[];
  extraEvents: CalendarEvent[];
}

export function useSchedulerChat({ timeTableEvents, extraEvents }: UseSchedulerChatProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([...timeTableEvents]);
  const [pendingSuggestions, setPendingSuggestions] = useState<CalendarEvent[]>([]);
  const [lastAIResponse, setLastAIResponse] = useState<string>('');

  // Process a message from the chat
  const processMessage = useCallback((message: string) => {
    const currentState: SchedulerState = {
      events,
      timeTableEvents,
      extraEvents
    };

    const response = processAISchedulerCommand(message, currentState);
    setLastAIResponse(response.message);

    // Handle the action if there is one
    if (response.action) {
      switch (response.action.type) {
        case 'SUGGEST_EVENTS':
          setPendingSuggestions(response.suggestions || []);
          break;
        case 'CLEAR_EXTRA_EVENTS':
          // Set up for confirmation
          break;
      }
    }

    return response;
  }, [events, timeTableEvents, extraEvents]);

  // Add events to the schedule
  const addEvents = useCallback((eventsToAdd: CalendarEvent[]) => {
    setEvents(prev => [...prev, ...eventsToAdd]);
    setPendingSuggestions([]);
  }, []);

  // Clear extra events
  const clearExtraEvents = useCallback(() => {
    setEvents([...timeTableEvents]);
  }, [timeTableEvents]);

  // Remove a specific event
  const removeEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  // Confirm pending suggestions
  const confirmSuggestions = useCallback(() => {
    if (pendingSuggestions.length > 0) {
      addEvents(pendingSuggestions);
      return true;
    }
    return false;
  }, [pendingSuggestions, addEvents]);

  // Cancel pending suggestions
  const cancelSuggestions = useCallback(() => {
    setPendingSuggestions([]);
  }, []);

  return {
    events,
    pendingSuggestions,
    lastAIResponse,
    processMessage,
    addEvents,
    clearExtraEvents,
    removeEvent,
    confirmSuggestions,
    cancelSuggestions,
  };
}