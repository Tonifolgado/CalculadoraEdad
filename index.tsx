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

    (document.getElementById('years') as HTMLElement).textContent = totalYears.toLocaleString();
    (document.getElementById('months') as HTMLElement).textContent = totalMonths.toLocaleString();
    (document.getElementById('weeks') as HTMLElement).textContent = weeks.toLocaleString();
    (document.getElementById('days') as HTMLElement).textContent = days.toLocaleString();
    (document.getElementById('hours') as HTMLElement).textContent = hours.toLocaleString();
}

// --- Conversor de unidad de tiempo a años ---

const timeInput = document.getElementById('time-input') as HTMLInputElement | null;
const unitSelect = document.getElementById('unit-select') as HTMLSelectElement | null;
const conversionResult = document.getElementById('conversion-result') as HTMLDivElement | null;
const convertedYearsEl = document.getElementById('converted-years') as HTMLSpanElement | null;
const conversionDetail = document.getElementById('conversion-detail') as HTMLParagraphElement | null;
const conversionError = document.getElementById('conversion-error') as HTMLParagraphElement | null;

const HOURS_PER_YEAR = 365.2425 * 24;        // 8765.82
const MONTHS_PER_YEAR = 12;
const MINUTES_PER_YEAR = 365.2425 * 24 * 60; // 525,949.2

function convertTimeToYears() {
    if (!timeInput || !unitSelect || !conversionResult || !convertedYearsEl || !conversionDetail || !conversionError) return;

    const raw = timeInput.value;
    const value = parseFloat(raw);

    if (raw === '' || isNaN(value)) {
        conversionResult.classList.add('hidden');
        conversionError.classList.add('hidden');
        return;
    }

    if (value < 0) {
        conversionError.textContent = 'El valor debe ser positivo.';
        conversionError.classList.remove('hidden');
        conversionResult.classList.add('hidden');
        return;
    }

    conversionError.classList.add('hidden');

    const unit = unitSelect.value;
    let years: number;
    let detailText: string;

    switch (unit) {
        case 'hours':
            years = value / HOURS_PER_YEAR;
            detailText = `${value.toLocaleString('es-ES')} h ÷ ${HOURS_PER_YEAR.toFixed(2)} h/año`;
            break;
        case 'months':
            years = value / MONTHS_PER_YEAR;
            detailText = `${value.toLocaleString('es-ES')} meses ÷ ${MONTHS_PER_YEAR} meses/año`;
            break;
        case 'minutes':
            years = value / MINUTES_PER_YEAR;
            detailText = `${value.toLocaleString('es-ES')} min ÷ ${MINUTES_PER_YEAR.toFixed(2)} min/año`;
            break;
        default:
            return;
    }

    const formatted = years >= 0.01
        ? years.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : years.toPrecision(3);

    conversionResult.classList.remove('hidden');
    convertedYearsEl.textContent = formatted;
    conversionDetail.textContent = detailText;
}

if (timeInput) timeInput.addEventListener('input', convertTimeToYears);
if (unitSelect) unitSelect.addEventListener('change', convertTimeToYears);

