/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Type } from "@google/genai";

// Assuming process.env.API_KEY is configured
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const birthdateInput = document.getElementById('birthdate') as HTMLInputElement;
const resultsDiv = document.getElementById('results') as HTMLDivElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;
const geminiBtn = document.getElementById('gemini-btn') as HTMLButtonElement;
const geminiOutputDiv = document.getElementById('gemini-output') as HTMLDivElement;
const formattedDateDisplay = document.getElementById('formatted-date-display') as HTMLParagraphElement;

birthdateInput.addEventListener('change', () => {
    calculateAge();
    geminiOutputDiv.classList.add('hidden');
    geminiOutputDiv.innerHTML = '';
});
geminiBtn.addEventListener('click', generateHistoricalContent);

function calculateAge() {
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

// --- Funciones para generar contenido histórico ---

async function generateHistoricalContent() {
    if (!birthdateInput.value) {
        errorMessage.textContent = 'Por favor, introduce una fecha de nacimiento válida.';
        errorMessage.classList.remove('hidden');
        return;
    }

    geminiBtn.disabled = true;
    geminiBtn.textContent = 'Cargando acontecimientos...';
    geminiOutputDiv.classList.remove('hidden');
    geminiOutputDiv.innerHTML = '<p class="text-gray-700 text-center">Generando el pasado, por favor espera...</p>';

    try {
        const birthYear = new Date(birthdateInput.value).getFullYear();
        const events = await getHistoricalEvents(birthYear);
        displayEventsAsTable(events);
    } catch (error) {
        console.error(error);
        geminiOutputDiv.innerHTML = '<p class="text-red-500 text-center">No se pudieron generar los eventos. Por favor, inténtalo de nuevo.</p>';
    } finally {
        geminiBtn.disabled = false;
        geminiBtn.textContent = '⌛ Obtener acontecimientos históricos ⌛';
    }
}

async function getHistoricalEvents(birthYear: number): Promise<any[]> {
    const currentYear = new Date().getFullYear();
    
    const prompt = `Genera una lista de acontecimientos históricos relevantes, uno internacional y uno local (de España), para cada año desde ${birthYear} hasta ${currentYear}.`;

    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         responseMimeType: "application/json",
         responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: {
                  type: Type.STRING,
                  description: 'El año del acontecimiento.',
                },
                international: {
                  type: Type.STRING,
                  description: 'Un acontecimiento internacional relevante de ese año.',
                },
                local: {
                  type: Type.STRING,
                  description: 'Un acontecimiento local relevante de España para ese año.',
                },
              },
              required: ['year', 'international', 'local'],
            },
          },
       },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
}

function displayEventsAsTable(events: any[]) {
    geminiOutputDiv.innerHTML = '';
    
    if (!Array.isArray(events) || events.length === 0) {
        geminiOutputDiv.innerHTML = '<p class="text-gray-700 text-center">No se encontraron eventos históricos para este período.</p>';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('w-full', 'rounded-lg', 'overflow-hidden');
    
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th class="bg-blue-200">Año</th><th class="bg-blue-200">Acontecimiento Internacional</th><th class="bg-blue-200">Acontecimiento Local (España)</th></tr>';
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    events.forEach(event => {
        const row = document.createElement('tr');
        const yearCell = document.createElement('td');
        const internationalCell = document.createElement('td');
        const localCell = document.createElement('td');
        
        yearCell.textContent = event.year;
        internationalCell.textContent = event.international;
        localCell.textContent = event.local;
        
        row.appendChild(yearCell);
        row.appendChild(internationalCell);
        row.appendChild(localCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    geminiOutputDiv.appendChild(table);
}