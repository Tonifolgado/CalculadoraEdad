/**
 * Age Calculator Service
 * Handles all age calculation logic
 */

export interface AgeBreakdown {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  totalDays: number;
  totalMilliseconds: number;
}

/**
 * Calculates age breakdown from a birthdate to today
 * @param birthdate - The birthdate as a Date object
 * @returns AgeBreakdown object with all time units
 */
export function calculateAgeBreakdown(birthdate: Date): AgeBreakdown {
  const today = new Date();
  const totalMilliseconds = today.getTime() - birthdate.getTime();

  const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
  const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const totalMonths = Math.floor(days / 30.44);
  const totalYears = Math.floor(days / 365.25);

  return {
    years: totalYears,
    months: totalMonths,
    weeks,
    days,
    hours,
    totalDays: days,
    totalMilliseconds,
  };
}

/**
 * Validates if a date is a valid birthdate
 * @param birthdate - The date to validate
 * @param birthdateString - The original date string
 * @returns Object with validation result and error message if any
 */
export function validateBirthdate(
  birthdate: Date,
  birthdateString: string
): { isValid: boolean; error?: string } {
  if (isNaN(birthdate.getTime()) || !birthdateString) {
    return {
      isValid: false,
      error: 'Por favor, introduce una fecha de nacimiento válida.',
    };
  }

  const today = new Date();
  if (birthdate > today) {
    return {
      isValid: false,
      error: 'La fecha de nacimiento no puede ser en el futuro.',
    };
  }

  return { isValid: true };
}

/**
 * Formats a date string from YYYY-MM-DD to DD/MM/YYYY
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDateDisplay(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `Fecha seleccionada: ${day}/${month}/${year}`;
}
