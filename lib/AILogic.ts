import { CalendarEvent } from "@/app/components/Scheduler/Scheduler";

export interface SchedulerState {
  events: CalendarEvent[];
  timeTableEvents: CalendarEvent[];
  extraEvents: CalendarEvent[];
}

export interface SchedulerAction {
  type: 'ADD_EVENT' | 'REMOVE_EVENT' | 'CLEAR_EXTRA_EVENTS' | 'SUGGEST_EVENTS';
  payload?: any;
}

export interface AIResponse {
  action: SchedulerAction | null;
  message: string;
  suggestions?: CalendarEvent[];
  warnings?: string[];
}

// Event categorization based on mood
const eventCategories = {
  energetic: ['Gym', 'Run', 'Football', 'Hiking', 'Rock Climbing', 'Dance', 'Pilates', 'Swimming', 'Badminton'],
  relaxed: ['Meditation', 'Yoga', 'Book Club', 'Brunch', 'Pottery', 'Mindfulness'],
  social: ['Debate', 'Board Games', 'Pub Quiz', 'Open Mic', 'Language Exchange', 'Film Society', 'Drama', 'Brunch'],
  focused: ['Study Group', 'Chess', 'Coding Bootcamp', 'Tech Talks', 'Latin Society'],
  creative: ['Photography', 'Creative Writing', 'Art', 'Pottery', 'Drama', 'Music Jam', 'Dance'],
  stressed: ['Meditation', 'Yoga', 'Mindfulness', 'Brunch', 'Book Club'],
  productive: ['Study Group', 'Coding Bootcamp', 'Tech Talks', 'Morning Run'],
};

// Check if two events clash
export function checkClash(event1: CalendarEvent, event2: CalendarEvent): boolean {
  const start1 = new Date(event1.start);
  const end1 = new Date(event1.end);
  const start2 = new Date(event2.start);
  const end2 = new Date(event2.end);
  
  // Add 5 minute buffer for transitions
  const buffer = 5 * 60 * 1000; // 5 minutes in milliseconds
  end1.setTime(end1.getTime() + buffer);
  
  return (start1 < end2 && start2 < end1);
}

// Analyze user mood from message
export function analyzeMood(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  const moodKeywords = {
    energetic: ['energetic', 'active', 'workout', 'exercise', 'pumped', 'energy'],
    relaxed: ['relaxed', 'chill', 'calm', 'peaceful', 'rest', 'easy'],
    social: ['social', 'friends', 'meet', 'hang out', 'lonely', 'people'],
    focused: ['focused', 'study', 'work', 'concentrate', 'productive', 'homework'],
    creative: ['creative', 'artistic', 'express', 'create', 'art'],
    stressed: ['stressed', 'anxious', 'overwhelmed', 'tired', 'exhausted', 'burnout'],
    productive: ['productive', 'accomplish', 'get things done', 'busy', 'efficient'],
  };
  
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return mood;
    }
  }
  
  return null;
}

// Parse user intent from message
export function parseUserIntent(message: string): {
  action: string;
  parameters?: any;
} {
  const lowerMessage = message.toLowerCase();
  
  // Check for clear action keywords
  if (lowerMessage.includes('clear') && (lowerMessage.includes('schedule') || lowerMessage.includes('events') || lowerMessage.includes('extra'))) {
    return { action: 'CLEAR_EXTRA_EVENTS' };
  }
  
  if ((lowerMessage.includes('add') || lowerMessage.includes('schedule')) && 
      (lowerMessage.includes('event') || lowerMessage.includes('activity'))) {
    return { action: 'ADD_EVENT' };
  }
  
  if (lowerMessage.includes('remove') || lowerMessage.includes('delete') || lowerMessage.includes('cancel')) {
    return { action: 'REMOVE_EVENT' };
  }
  
  if (lowerMessage.includes('suggest') || lowerMessage.includes('recommend') || 
      lowerMessage.includes('what should i do') || lowerMessage.includes('free time') ||
      lowerMessage.includes('bored')) {
    return { action: 'SUGGEST_EVENTS' };
  }
  
  // Default to suggestion if mood is detected
  const mood = analyzeMood(message);
  if (mood) {
    return { action: 'SUGGEST_EVENTS', parameters: { mood } };
  }
  
  return { action: 'NONE' };
}

// Get suggestions based on mood and availability
export function getSuggestions(
  mood: string,
  extraEvents: CalendarEvent[],
  currentEvents: CalendarEvent[],
  timeTableEvents: CalendarEvent[]
): { suggestions: CalendarEvent[], warnings: string[] } {
  const suggestions: CalendarEvent[] = [];
  const warnings: string[] = [];
  
  // Get relevant categories for mood
  const relevantCategories = eventCategories[mood as keyof typeof eventCategories] || [];
  
  // Filter extra events by mood
  const relevantEvents = extraEvents.filter(event => 
    relevantCategories.some(category => 
      event.title.toLowerCase().includes(category.toLowerCase())
    )
  );
  
  // Check each relevant event for clashes
  for (const event of relevantEvents) {
    let hasClash = false;
    
    // Check against timetable events
    for (const ttEvent of timeTableEvents) {
      if (checkClash(event, ttEvent)) {
        warnings.push(`⚠️ ${event.title} clashes with ${ttEvent.title}`);
        hasClash = true;
        break;
      }
    }
    
    // Check against current events (already added extra events)
    if (!hasClash) {
      for (const currentEvent of currentEvents) {
        if (checkClash(event, currentEvent)) {
          warnings.push(`⚠️ ${event.title} clashes with ${currentEvent.title}`);
          hasClash = true;
          break;
        }
      }
    }
    
    if (!hasClash && suggestions.length < 3) { // Limit to 3 suggestions
      suggestions.push(event);
    }
  }
  
  return { suggestions, warnings };
}

// Main function to process AI chat messages and return scheduler actions
export function processAISchedulerCommand(
  message: string,
  currentState: SchedulerState
): AIResponse {
  const { action, parameters } = parseUserIntent(message);
  
  switch (action) {
    case 'CLEAR_EXTRA_EVENTS': {
      // Filter out only extra events, keep timetable events
      const clearedEvents = currentState.timeTableEvents;
      return {
        action: {
          type: 'CLEAR_EXTRA_EVENTS',
          payload: { events: clearedEvents }
        },
        message: "I'll clear all extra events from your schedule. Your timetable classes will remain unchanged. Should I proceed?",
        warnings: []
      };
    }
    
    case 'SUGGEST_EVENTS': {
      const mood = parameters?.mood || analyzeMood(message) || 'relaxed';
      const { suggestions, warnings } = getSuggestions(
        mood,
        currentState.extraEvents,
        currentState.events,
        currentState.timeTableEvents
      );
      
      if (suggestions.length === 0) {
        return {
          action: null,
          message: `I couldn't find any ${mood} activities that fit your schedule without conflicts. Would you like me to show you what's clashing?`,
          warnings
        };
      }
      
      const eventDescriptions = suggestions.map(e => formatEventForChat(e)).join('\n');
      
      return {
        action: {
          type: 'SUGGEST_EVENTS',
          payload: { suggestions }
        },
        message: `Based on your ${mood} mood, I found these activities that fit your schedule:\n\n${eventDescriptions}\n\nWould you like me to add these to your schedule?`,
        suggestions,
        warnings
      };
    }
    
    case 'ADD_EVENT': {
      // This would need more sophisticated parsing to extract event details
      return {
        action: null,
        message: "I'd be happy to add an event! Please tell me:\n- What's the event name?\n- When does it start?\n- How long does it last?",
        warnings: []
      };
    }
    
    case 'REMOVE_EVENT': {
      return {
        action: null,
        message: "Which event would you like to remove? Just tell me the name and I'll take care of it.",
        warnings: []
      };
    }
    
    default: {
      // Try to detect mood and suggest events
      const mood = analyzeMood(message);
      if (mood) {
        const { suggestions, warnings } = getSuggestions(
          mood,
          currentState.extraEvents,
          currentState.events,
          currentState.timeTableEvents
        );
        
        if (suggestions.length > 0) {
          const eventDescriptions = suggestions.map(e => formatEventForChat(e)).join('\n');
          
          return {
            action: {
              type: 'SUGGEST_EVENTS',
              payload: { suggestions }
            },
            message: `I can sense you're feeling ${mood}. Here are some activities that might suit your mood:\n\n${eventDescriptions}\n\nWould you like to add any of these?`,
            suggestions,
            warnings
          };
        }
      }
      
      return {
        action: null,
        message: "I'm here to help with your schedule! You can:\n• Tell me how you're feeling (e.g., 'I'm stressed')\n• Ask for activity suggestions ('What should I do today?')\n• Clear extra events ('Clear my extra activities')\n• Add or remove specific events",
        warnings: []
      };
    }
  }
}

// Function to format event for display in chat
export function formatEventForChat(event: CalendarEvent): string {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const day = start.toLocaleDateString('en-US', { weekday: 'long' });
  const startTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const endTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  return `• ${event.title} - ${day}, ${startTime} to ${endTime}`;
}

// Helper function to find events by partial name match
export function findEventByName(
  eventName: string, 
  events: CalendarEvent[]
): CalendarEvent | null {
  const lowerName = eventName.toLowerCase();
  return events.find(event => 
    event.title.toLowerCase().includes(lowerName)
  ) || null;
}

// Helper function to get all events for a specific day
export function getEventsForDay(
  date: Date,
  events: CalendarEvent[]
): CalendarEvent[] {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  
  return events.filter(event => {
    const eventStart = new Date(event.start);
    return eventStart >= dayStart && eventStart <= dayEnd;
  });
}