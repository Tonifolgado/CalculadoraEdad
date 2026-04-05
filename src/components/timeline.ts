/**
 * Timeline Component
 * Handles rendering of historical events timeline
 */

import { Event, YearEvents } from '../services/event-service';
import { getRegionEmoji, truncateText } from '../services/event-service';

/**
 * Renders events as an interactive timeline
 * @param events - Array of YearEvents to display
 * @param containerSelector - CSS selector of container to render into
 */
export function displayEventsAsTimeline(
  events: YearEvents[],
  containerSelector: string
): void {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.innerHTML = '';

  if (!Array.isArray(events) || events.length === 0) {
    container.innerHTML =
      '<p class="text-gray-700 text-center">No se encontraron eventos históricos para este período.</p>';
    return;
  }

  const timeline = document.createElement('div');
  timeline.classList.add('timeline');

  events.forEach((yearData) => {
    const item = document.createElement('div');
    item.classList.add('timeline-item');

    const dot = document.createElement('div');
    dot.classList.add('timeline-dot');

    const content = document.createElement('div');
    content.classList.add('timeline-content');

    // Year header
    const yearContainer = document.createElement('div');
    yearContainer.classList.add('year-container');
    const year = document.createElement('div');
    year.classList.add('timeline-year');
    year.textContent = String(yearData.year);
    yearContainer.appendChild(year);
    content.appendChild(yearContainer);

    // Most relevant event for this year
    if (yearData.events && Array.isArray(yearData.events) && yearData.events.length > 0) {
      const sortedEvents = [...yearData.events].sort((a, b) => {
        const priorityMap: Record<string, number> = {
          World: 0,
          Europe: 1,
          Spain: 2,
        };
        const priorityA = priorityMap[a.region] ?? 3;
        const priorityB = priorityMap[b.region] ?? 3;
        return priorityA - priorityB;
      });

      const mainEvent = sortedEvents[0];
      const eventCard = createEventCard(mainEvent);
      content.appendChild(eventCard);
    }

    item.appendChild(dot);
    item.appendChild(content);
    timeline.appendChild(item);
  });

  container.appendChild(timeline);
}

/**
 * Creates an interactive event card
 * @param event - Event object to display
 * @returns DOM element for the event card
 */
function createEventCard(event: Event): HTMLElement {
  const card = document.createElement('div');
  card.classList.add('event-card');

  const header = document.createElement('div');
  header.classList.add('event-card-header');

  // First row: title, region, expand icon
  const titleRow = document.createElement('div');
  titleRow.style.display = 'flex';
  titleRow.style.alignItems = 'center';
  titleRow.style.justifyContent = 'space-between';
  titleRow.style.width = '100%';

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('event-card-title');
  titleDiv.textContent = event.title;

  const regionDiv = document.createElement('div');
  regionDiv.classList.add('event-card-region');
  regionDiv.textContent = getRegionEmoji(event.region) + ' ' + event.region;

  const expandIcon = document.createElement('div');
  expandIcon.classList.add('expand-icon');
  expandIcon.textContent = '▼';

  titleRow.appendChild(titleDiv);
  titleRow.appendChild(regionDiv);
  titleRow.appendChild(expandIcon);
  header.appendChild(titleRow);

  // Second row: preview section
  const previewDiv = document.createElement('div');
  previewDiv.classList.add('event-card-preview');

  const shortDescription = truncateText(event.description, 120);
  const previewText = document.createElement('p');
  previewText.classList.add('preview-text');
  previewText.textContent = shortDescription;
  previewDiv.appendChild(previewText);

  let readMoreLink: HTMLAnchorElement | null = null;
  if (event.description.length > 120) {
    readMoreLink = document.createElement('a');
    readMoreLink.classList.add('read-more-link');
    readMoreLink.href = '#';
    readMoreLink.textContent = 'Leer más...';
    readMoreLink.onclick = (e) => {
      e.preventDefault();
      contentDiv.classList.toggle('expanded');
      expandIcon.classList.toggle('expanded');
    };
    previewDiv.appendChild(readMoreLink);
  }

  header.appendChild(previewDiv);

  // Full content section (collapsible)
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('event-card-content');

  // Image
  if (event.image) {
    const img = document.createElement('img');
    img.classList.add('event-image');
    img.src = event.image;
    img.alt = event.title;
    img.onerror = function () {
      this.style.display = 'none';
    };
    contentDiv.appendChild(img);
  }

  // Full description
  const fullDescription = document.createElement('div');
  fullDescription.classList.add('event-description');
  fullDescription.textContent = event.description;
  contentDiv.appendChild(fullDescription);

  // Wikipedia link
  if (event.wikipedia) {
    const linksDiv = document.createElement('div');
    linksDiv.classList.add('event-links');

    const wikiLink = document.createElement('a');
    wikiLink.classList.add('wiki-link');
    wikiLink.href = event.wikipedia;
    wikiLink.target = '_blank';
    wikiLink.rel = 'noopener noreferrer';
    wikiLink.textContent = '📖 Leer en Wikipedia';

    linksDiv.appendChild(wikiLink);
    contentDiv.appendChild(linksDiv);
  }

  card.appendChild(header);
  card.appendChild(contentDiv);

  // Toggle expandible
  titleRow.addEventListener('click', function (e) {
    if (!readMoreLink || (e.target !== readMoreLink && !e.target.closest('.read-more-link'))) {
      contentDiv.classList.toggle('expanded');
      expandIcon.classList.toggle('expanded');
    }
  });

  return card;
}

/**
 * Shows loading state while fetching events
 * @param containerSelector - CSS selector of container
 */
export function showLoadingState(containerSelector: string): void {
  const container = document.querySelector(containerSelector);
  if (container) {
    container.innerHTML =
      '<p class="text-gray-700 text-center">Generando el pasado, por favor espera...</p>';
  }
}

/**
 * Shows error state when events fail to load
 * @param containerSelector - CSS selector of container
 * @param errorMessage - Error message to display
 */
export function showErrorState(containerSelector: string, errorMessage: string): void {
  const container = document.querySelector(containerSelector);
  if (container) {
    container.innerHTML = `<p class="text-red-500 text-center">Error: ${errorMessage}</p>`;
  }
}
