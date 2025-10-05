
# Run and deploy the app

This contains everything you need to run your app locally.
View your app in AI Studio: https://ai.studio/apps/drive/1hw3CPsHFrre93tpKFAN3ETMXSlcHjtz6

## Run Locally
**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
   Create a `.env.local` file in the root of the project. Inside, set the `VITE_GEMINI_API_KEY` to your Gemini API key obtained from Google AI Studio. For example: `VITE_GEMINI_API_KEY="YOUR_API_KEY_HERE"`
3. Run the app:
   `npm run dev`
