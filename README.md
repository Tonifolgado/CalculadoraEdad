<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Age Calculator

This is a simple web application that calculates the age of a person based on their birthdate and displays it in years, months, weeks, days, and hours. It also uses the Gemini API to generate a list of historical events that occurred between the person's birth year and the current year.

View your app in AI Studio: https://ai.studio/apps/drive/1hw3CPsHFrre93tpKFAN3ETMXSlcHjtz6

## Features

-   Calculates the age of a person in years, months, weeks, days, and hours.
-   Generates a list of historical events that occurred between the person's birth year and the current year.
-   Displays the historical events in a table.
-   Handles invalid dates and future dates.

## Run Locally

**Prerequisites:**

-   Node.js
-   A Gemini API key

1.  Clone the repository:
    `git clone https://github.com/google-gemini-v-flash/age-calculator.git`
2.  Install dependencies:
    `npm install`
3.  Create a `.env.local` file in the root of the project and add your Gemini API key:
    `GEMINI_API_KEY=YOUR_API_KEY`
4.  Run the app:
    `npm run dev`

## Technologies

-   [GoogleGenAI](https://ai.google.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Vite](https://vitejs.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
