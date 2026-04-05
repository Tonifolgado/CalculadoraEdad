/**
 * Main Application Entry Point
 * Initializes the Age Calculator and Historical Events App
 */

import './styles/style.css';
import {
  calculateAgeBreakdown,
  validateBirthdate,
  formatDateDisplay,
} from './services/age-calculator';
import {
  fetchHistoricalEvents,
  filterEventsByBirthYear,
  getMostRelevantEvent,
} from './services/event-service';
import { displayAgeResults, showError, hideError, displayFormattedDate } from './components/age-display';
import {
  displayEventsAsTimeline,
  showLoadingState,
  showErrorState,
} from './components/timeline';

// DOM Elements
const birthdateInput = document.getElementById('birthdate') as HTMLInputElement | null;
const geminiBtn = document.getElementById('gemini-btn') as HTMLButtonElement | null;
const geminiOutputDiv = document.getElementById('gemini-output') as HTMLDivElement | null;

// Initialize app
function initApp(): void {
  if (!birthdateInput) return;

  // Set max date to today
  const todayStr = new Date().toISOString().split('T')[0];
  birthdateInput.max = todayStr;

  // Event listeners
  birthdateInput.addEventListener('change', handleBirthdateChange);
  geminiBtn?.addEventListener('click', handleGenerateHistoricalContent);
}

/**
 * Handles birthdate input change
 */
function handleBirthdateChange(): void {
  if (!birthdateInput) return;

  const birthdate = new Date(birthdateInput.value);
  const validation = validateBirthdate(birthdate, birthdateInput.value);

  if (!validation.isValid) {
    showError(validation.error || 'Fecha inválida');
    return;
  }

  // Calculate and display age
  const breakdown = calculateAgeBreakdown(birthdate);
  displayAgeResults(breakdown);

  // Display formatted date
  const formatted = formatDateDisplay(birthdateInput.value);
  displayFormattedDate(formatted);

  hideError();

  // Clear events when new date is selected
  if (geminiOutputDiv) {
    geminiOutputDiv.classList.add('hidden');
    geminiOutputDiv.innerHTML = '';
  }
}

/**
 * Handles historical events generation
 */
async function handleGenerateHistoricalContent(): Promise<void> {
  if (!birthdateInput?.value || !geminiBtn || !geminiOutputDiv) return;

  geminiBtn.disabled = true;
  geminiBtn.textContent = '⌛ Cargando...';

  showLoadingState('#gemini-output');
  geminiOutputDiv.classList.remove('hidden');

  try {
    const birthYear = new Date(birthdateInput.value + 'T00:00:00').getFullYear();
    const eventsData = await fetchHistoricalEvents();
    const filteredEvents = filterEventsByBirthYear(eventsData.events, birthYear);

    // Get only the most relevant event per year
    const relevantEvents = filteredEvents
      .map((yearData) => {
        const mainEvent = getMostRelevantEvent(yearData);
        if (mainEvent) {
          return {
            year: yearData.year,
            events: [mainEvent],
          };
        }
        return null;
      })
      .filter((item) => item !== null) as typeof filteredEvents;

    displayEventsAsTimeline(relevantEvents, '#gemini-output');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    showErrorState('#gemini-output', errorMsg);
    console.error('Error generating historical content:', error);
  } finally {
    geminiBtn.disabled = false;
    geminiBtn.textContent = '⌛ Obtener acontecimientos históricos ⌛';
  }
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
