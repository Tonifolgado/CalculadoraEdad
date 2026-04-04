/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/// <reference types="vite/client" />

const birthdateInput = document.getElementById('birthdate') as HTMLInputElement | null;
const resultsDiv = document.getElementById('results') as HTMLDivElement | null;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement | null;
const formattedDateDisplay = document.getElementById('formatted-date-display') as HTMLParagraphElement | null;

if (birthdateInput) {
    birthdateInput.addEventListener('change', () => {
        calculateAge();
    });
}

/**
 * Calculates the age of a person based on their birthdate and displays it in years, months, weeks, days, and hours.
 * @returns {void}
 */
function calculateAge() {
    if (!birthdateInput || !errorMessage || !resultsDiv || !formattedDateDisplay) return;

    const birthdate = new Date(birthdateInput.value);
    const today = new Date();

    const handleInvalidDate = (message: string) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        formattedDateDisplay.classList.add('hidden');
    };

    if (isNaN(birthdate.getTime()) || !birthdateInput.value) {
        handleInvalidDate('Por favor, introduce una fecha de nacimiento válida.');
        return;
    }

    if (birthdate > today) {
        handleInvalidDate('La fecha de nacimiento no puede ser en el futuro.');
        return;
    }

    const [year, month, day] = birthdateInput.value.split('-');
    formattedDateDisplay.textContent = `Fecha seleccionada: ${day}/${month}/${year}`;
    formattedDateDisplay.classList.remove('hidden');

    errorMessage.classList.add('hidden');
    resultsDiv.classList.remove('hidden');

    const totalMilliseconds = today.getTime() - birthdate.getTime();
    
    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
    
    const weeks = Math.floor(days / 7);
    const totalMonths = Math.floor(days / 30.44);
    const totalYears = Math.floor(days / 365.25);

    const yearsEl = document.getElementById('years');
    if (yearsEl) yearsEl.textContent = totalYears.toLocaleString();

    const monthsEl = document.getElementById('months');
    if (monthsEl) monthsEl.textContent = totalMonths.toLocaleString();

    const weeksEl = document.getElementById('weeks');
    if (weeksEl) weeksEl.textContent = weeks.toLocaleString();

    const daysEl = document.getElementById('days');
    if (daysEl) daysEl.textContent = days.toLocaleString();

    const hoursEl = document.getElementById('hours');
    if (hoursEl) hoursEl.textContent = hours.toLocaleString();
}
