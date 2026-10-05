# GlowUp Mobile Web App

## What I’ll build
- An Arabic-first, English-ready mobile app experience with onboarding and a five-tab bottom navigation.
- A home dashboard showing daily calories, routine progress, streak, and an encouraging daily message.
- Food logging by typed meal name or camera upload, using a small built-in Arabic/English calorie catalogue.
- Morning, afternoon, and evening checklists with stars and completion feedback.
- Workout logging for walking, yoga, gym, and dance, including minutes and estimated calories burned.
- A virtual closet for uploaded clothing photos, category selection, three randomized outfit suggestions, and favorites.
- Local persistence in the browser so the experience works without accounts.

## Visual direction
- Pinterest-like cute editorial layout in pastel blush, warm beige, and white.
- Rounded panels, soft shadows, small kawaii illustrations, friendly Arabic typography, and restrained spring animations.
- Designed first for the current Android-sized viewport, while remaining usable on larger screens.

## Technical details
- TanStack Start mobile web app using React, semantic Tailwind v4 tokens, and browser local storage.
- Camera/file inputs use the device browser’s native image capture support.
- Reminder settings provide an in-app 8:00 AM reminder preference; true background push delivery depends on browser/OS permissions and installation support.
- Each main app area will remain inside the single mobile shell rather than separate marketing pages.
