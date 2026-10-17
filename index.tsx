/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface AgeMetrics {
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
}

// Global state for calculations
let currentMetrics: AgeMetrics | null = null;
let currentBirthdateValue: string = '';
let currentFormattedDateStr: string = '';

// DOM Elements: Date Input
const birthDayInput = document.getElementById('birth-day') as HTMLInputElement;
const birthMonthSelect = document.getElementById('birth-month') as HTMLSelectElement;
const birthYearInput = document.getElementById('birth-year') as HTMLInputElement;
const birthdatePicker = document.getElementById('birthdate-picker') as HTMLInputElement;

// DOM Elements: Results & Error
const resultsDiv = document.getElementById('results') as HTMLDivElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;
const formattedDateDisplay = document.getElementById('formatted-date-display') as HTMLParagraphElement;

// DOM Elements: Export
const downloadPdfBtn = document.getElementById('download-pdf-btn') as HTMLButtonElement;
const downloadTxtBtn = document.getElementById('download-txt-btn') as HTMLButtonElement;
const exportStatusHint = document.getElementById('export-status-hint') as HTMLSpanElement;
const exportToast = document.getElementById('export-toast') as HTMLDivElement;

let toastTimer: number | null = null;

function showToast(message: string, isError: boolean = false) {
    if (!exportToast) return;
    if (toastTimer) {
        window.clearTimeout(toastTimer);
    }
    exportToast.textContent = message;
    exportToast.className = isError
        ? 'mt-2.5 text-center text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg py-1.5 px-3'
        : 'mt-2.5 text-center text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg py-1.5 px-3';
    exportToast.classList.remove('hidden');

    toastTimer = window.setTimeout(() => {
        exportToast.classList.add('hidden');
    }, 3500);
}

function updateExportStatusHint() {
    if (!exportStatusHint) return;
    if (currentMetrics) {
        exportStatusHint.textContent = 'Métricas calculadas listas';
        exportStatusHint.className = 'text-[11px] text-blue-600 font-semibold';
    } else {
        exportStatusHint.textContent = 'Introduce una fecha';
        exportStatusHint.className = 'text-[11px] text-slate-400 font-medium';
    }
}

// Auto-advance & recalculate listeners
birthDayInput?.addEventListener('input', () => {
    if (birthDayInput.value.length >= 2) {
        const val = parseInt(birthDayInput.value, 10);
        if (val > 31) birthDayInput.value = '31';
        birthMonthSelect.focus();
    }
    onDateFieldsChanged();
});

birthMonthSelect?.addEventListener('change', () => {
    if (birthMonthSelect.value) {
        birthYearInput.focus();
    }
    onDateFieldsChanged();
});

birthYearInput?.addEventListener('input', () => {
    if (birthYearInput.value.length > 4) {
        birthYearInput.value = birthYearInput.value.slice(0, 4);
    }
    onDateFieldsChanged();
});

birthdatePicker?.addEventListener('change', () => {
    if (!birthdatePicker.value) return;
    const [y, m, d] = birthdatePicker.value.split('-');
    if (birthDayInput) birthDayInput.value = parseInt(d, 10).toString();
    if (birthMonthSelect) birthMonthSelect.value = parseInt(m, 10).toString();
    if (birthYearInput) birthYearInput.value = y;
    
    calculateAge();
});

function onDateFieldsChanged() {
    updateExportStatusHint();

    if (birthDayInput?.value && birthMonthSelect?.value && birthYearInput?.value) {
        if (birthYearInput.value.trim().length === 4) {
            calculateAge();
        }
    }
}

function calculateAge() {
    if (!birthDayInput || !birthMonthSelect || !birthYearInput) return;

    const dayVal = parseInt(birthDayInput.value.trim(), 10);
    const monthVal = parseInt(birthMonthSelect.value.trim(), 10);
    const yearVal = parseInt(birthYearInput.value.trim(), 10);
    const today = new Date();

    const handleInvalidDate = (message: string) => {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        formattedDateDisplay.classList.add('hidden');
        currentMetrics = null;
        currentBirthdateValue = '';
        currentFormattedDateStr = '';
        updateExportStatusHint();
    };

    if (isNaN(dayVal) || dayVal < 1 || dayVal > 31) {
        handleInvalidDate('Por favor, introduce un día válido (1 - 31).');
        return;
    }

    if (isNaN(monthVal) || monthVal < 1 || monthVal > 12) {
        handleInvalidDate('Por favor, selecciona un mes.');
        return;
    }

    if (isNaN(yearVal) || birthYearInput.value.trim().length !== 4) {
        handleInvalidDate('El año debe tener exactamente cuatro dígitos (ejemplo: 1985).');
        return;
    }

    if (yearVal < 1900 || yearVal > today.getFullYear()) {
        handleInvalidDate(`El año debe estar entre 1900 y ${today.getFullYear()}.`);
        return;
    }

    // Days in month check
    const daysInMonth = new Date(yearVal, monthVal, 0).getDate();
    if (dayVal > daysInMonth) {
        handleInvalidDate(`El mes seleccionado solo tiene ${daysInMonth} días para el año ${yearVal}.`);
        return;
    }

    const birthdate = new Date(yearVal, monthVal - 1, dayVal);

    if (birthdate > today) {
        handleInvalidDate('La fecha de nacimiento no puede ser en el futuro.');
        return;
    }

    const formattedDay = dayVal.toString().padStart(2, '0');
    const formattedMonth = monthVal.toString().padStart(2, '0');
    const formattedYear = yearVal.toString();

    currentBirthdateValue = `${formattedYear}-${formattedMonth}-${formattedDay}`;
    currentFormattedDateStr = `${formattedDay}/${formattedMonth}/${formattedYear}`;
    formattedDateDisplay.textContent = `Fecha seleccionada: ${currentFormattedDateStr}`;
    formattedDateDisplay.classList.remove('hidden');

    if (birthdatePicker) {
        birthdatePicker.value = currentBirthdateValue;
    }

    errorMessage.classList.add('hidden');
    resultsDiv.classList.remove('hidden');

    const totalMilliseconds = today.getTime() - birthdate.getTime();
    
    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const totalMonths = Math.floor(days / 30.44);
    const totalYears = Math.floor(days / 365.25);

    currentMetrics = {
        years: totalYears,
        months: totalMonths,
        weeks: weeks,
        days: days,
        hours: hours
    };

    (document.getElementById('years') as HTMLElement).textContent = totalYears.toLocaleString('es-ES');
    (document.getElementById('months') as HTMLElement).textContent = totalMonths.toLocaleString('es-ES');
    (document.getElementById('weeks') as HTMLElement).textContent = weeks.toLocaleString('es-ES');
    (document.getElementById('days') as HTMLElement).textContent = days.toLocaleString('es-ES');
    (document.getElementById('hours') as HTMLElement).textContent = hours.toLocaleString('es-ES');

    updateExportStatusHint();
}

// --- Funciones de Exportación (PDF y TXT) ---

downloadPdfBtn?.addEventListener('click', exportToPdf);
downloadTxtBtn?.addEventListener('click', exportToText);

function exportToText() {
    if (!currentMetrics || !currentBirthdateValue) {
        showToast('Introduce y calcula primero tu fecha de nacimiento.', true);
        return;
    }

    const today = new Date();
    const generationDate = today.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

    const lines: string[] = [];
    lines.push('================================================================================');
    lines.push('                 CALCULADORA DE EDAD - REPORTE DE TIEMPO');
    lines.push('================================================================================');
    lines.push('');
    lines.push(`Fecha de emisión     : ${generationDate}`);
    lines.push(`Fecha de nacimiento  : ${currentFormattedDateStr || currentBirthdateValue}`);
    lines.push('');
    lines.push('--------------------------------------------------------------------------------');
    lines.push('TIEMPO TRANSCURRIDO DESDE EL NACIMIENTO');
    lines.push('--------------------------------------------------------------------------------');
    lines.push(` • Años transcurridos    : ${currentMetrics.years.toLocaleString('es-ES')}`);
    lines.push(` • Meses transcurridos   : ${currentMetrics.months.toLocaleString('es-ES')}`);
    lines.push(` • Semanas transcurridas : ${currentMetrics.weeks.toLocaleString('es-ES')}`);
    lines.push(` • Días transcurridos    : ${currentMetrics.days.toLocaleString('es-ES')}`);
    lines.push(` • Horas transcurridas   : ${currentMetrics.hours.toLocaleString('es-ES')}`);
    lines.push('');
    lines.push('================================================================================');
    lines.push('Generado desde la aplicación Calculadora de Edad');
    lines.push('================================================================================');

    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = `calculo_edad_${currentBirthdateValue}.txt`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);

    showToast('¡Archivo TXT descargado con éxito!');
}

function exportToPdf() {
    if (!currentMetrics || !currentBirthdateValue) {
        showToast('Introduce y calcula primero tu fecha de nacimiento.', true);
        return;
    }

    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const today = new Date();
        const generationDate = today.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

        // Top accent line
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 210, 6, 'F');

        // Document Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(15, 23, 42);
        doc.text('Calculadora de Edad', 14, 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Reporte y desglose detallado de tiempo transcurrido', 14, 27);

        // Info Box
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, 33, 182, 20, 3, 3, 'FD');

        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'bold');
        doc.text('Fecha de nacimiento:', 20, 42);
        doc.setFont('helvetica', 'normal');
        doc.text(`${currentFormattedDateStr || currentBirthdateValue}`, 62, 42);

        doc.setFont('helvetica', 'bold');
        doc.text('Fecha de emisión:', 20, 48);
        doc.setFont('helvetica', 'normal');
        doc.text(generationDate, 62, 48);

        // Section: Metrics
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text('Tiempo transcurrido desde el nacimiento', 14, 63);

        autoTable(doc, {
            startY: 68,
            head: [['Unidad de Tiempo', 'Cantidad Transcurrida']],
            body: [
                ['Años', `${currentMetrics.years.toLocaleString('es-ES')} años`],
                ['Meses', `${currentMetrics.months.toLocaleString('es-ES')} meses`],
                ['Semanas', `${currentMetrics.weeks.toLocaleString('es-ES')} semanas`],
                ['Días', `${currentMetrics.days.toLocaleString('es-ES')} días`],
                ['Horas', `${currentMetrics.hours.toLocaleString('es-ES')} horas`],
            ],
            theme: 'striped',
            headStyles: {
                fillColor: [37, 99, 235],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10,
                cellPadding: 3.5,
            },
            bodyStyles: {
                fontSize: 9.5,
                textColor: [30, 41, 59],
                cellPadding: 3.5,
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252],
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 70 },
                1: { fontStyle: 'bold', textColor: [37, 99, 235], cellWidth: 112 },
            },
            margin: { left: 14, right: 14 },
        });

        // Footer
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Generado con Calculadora de Edad', 14, 285);
        doc.text('Página 1 de 1', 180, 285);

        doc.save(`calculo_edad_${currentBirthdateValue}.pdf`);
        showToast('¡Documento PDF descargado con éxito!');
    } catch (err) {
        console.error('Error al generar PDF:', err);
        showToast('Error al generar el PDF. Puedes descargar en TXT.', true);
    }
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
