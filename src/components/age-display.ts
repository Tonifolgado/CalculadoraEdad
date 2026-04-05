/**
 * Age Display Component
 * Handles rendering of age calculation results
 */

import { AgeBreakdown } from '../services/age-calculator';

/**
 * Updates the UI with age breakdown results
 * @param breakdown - Age breakdown object
 */
export function displayAgeResults(breakdown: AgeBreakdown): void {
  const yearsEl = document.getElementById('years');
  if (yearsEl) yearsEl.textContent = breakdown.years.toLocaleString();

  const monthsEl = document.getElementById('months');
  if (monthsEl) monthsEl.textContent = breakdown.months.toLocaleString();

  const weeksEl = document.getElementById('weeks');
  if (weeksEl) weeksEl.textContent = breakdown.weeks.toLocaleString();

  const daysEl = document.getElementById('days');
  if (daysEl) daysEl.textContent = breakdown.days.toLocaleString();

  const hoursEl = document.getElementById('hours');
  if (hoursEl) hoursEl.textContent = breakdown.hours.toLocaleString();
}

/**
 * Shows error message to user
 * @param message - Error message to display
 */
export function showError(message: string): void {
  const errorMessage = document.getElementById('error-message');
  const resultsDiv = document.getElementById('results');
  const formattedDateDisplay = document.getElementById('formatted-date-display');

  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }
  if (resultsDiv) resultsDiv.classList.add('hidden');
  if (formattedDateDisplay) formattedDateDisplay.classList.add('hidden');
}

/**
 * Hides error message and shows results
 */
export function hideError(): void {
  const errorMessage = document.getElementById('error-message');
  const resultsDiv = document.getElementById('results');

  if (errorMessage) errorMessage.classList.add('hidden');
  if (resultsDiv) resultsDiv.classList.remove('hidden');
}

/**
 * Displays formatted date selection
 * @param formattedDate - Formatted date string
 */
export function displayFormattedDate(formattedDate: string): void {
  const formattedDateDisplay = document.getElementById('formatted-date-display');
  if (formattedDateDisplay) {
    formattedDateDisplay.textContent = formattedDate;
    formattedDateDisplay.classList.remove('hidden');
  }
}
