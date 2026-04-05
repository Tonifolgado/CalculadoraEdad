/**
 * Event Service
 * Handles historical events data fetching and filtering
 */

export interface Event {
  region: string;
  title: string;
  description: string;
  image: string;
  wikipedia: string;
}

export interface YearEvents {
  year: number;
  events: Event[];
}

export interface EventsData {
  events: YearEvents[];
}

/**
 * Fetches historical events from the events.json file
 * @returns EventsData object containing all historical events
 */
export async function fetchHistoricalEvents(): Promise<EventsData> {
  try {
    const response = await fetch('./events.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo de eventos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading events:', error);
    throw new Error('No se pudo cargar los eventos históricos');
  }
}

/**
 * Filters events to show only those within the birth year range
 * @param allEvents - All available events
 * @param birthYear - The birth year to filter from
 * @returns Filtered array of YearEvents objects
 */
export function filterEventsByBirthYear(
  allEvents: YearEvents[],
  birthYear: number
): YearEvents[] {
  const currentYear = new Date().getFullYear();
  return allEvents.filter((event) => {
    const year = parseInt(String(event.year));
    return year >= birthYear && year <= currentYear;
  });
}

/**
 * Gets the most relevant event from a year
 * Priority: World > Europe > Spain > others
 * @param yearData - YearEvents object containing events for a specific year
 * @returns The most important event or null if no events
 */
export function getMostRelevantEvent(yearData: YearEvents): Event | null {
  if (!yearData.events || yearData.events.length === 0) {
    return null;
  }

  const priorityMap: Record<string, number> = {
    World: 0,
    Europe: 1,
    Spain: 2,
  };

  const sortedEvents = [...yearData.events].sort((a, b) => {
    const priorityA = priorityMap[a.region] ?? 3;
    const priorityB = priorityMap[b.region] ?? 3;
    return priorityA - priorityB;
  });

  return sortedEvents[0];
}

/**
 * Gets emoji for a region
 * @param region - Region name
 * @returns Emoji representing the region
 */
export function getRegionEmoji(region: string): string {
  const emojis: Record<string, string> = {
    Spain: '🇪🇸',
    Europe: '🌍',
    Americas: '🌎',
    Asia: '🗻',
    Africa: '🦁',
    World: '🌐',
  };
  return emojis[region] || '🌍';
}

/**
 * Truncates text to a maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
