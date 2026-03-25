# Velozity Tracker

Frontend technical assignment built using React, TypeScript and Vite.

## Live Demo
https://velozity-tracker-eight.vercel.app

## Repository
https://github.com/Varun069/velozity-tracker

## Features
- Kanban view with 4 columns
- Custom drag and drop (native events, no library)
- List view with sorting and inline status update
- Timeline view
- Shared task data across all views
- Filters with multi-select chips
- Manual virtual scrolling (500+ seeded tasks, no react-window)
- TypeScript throughout, zero errors

## Tech Stack
- React 18
- TypeScript
- Vite

## Setup
```bash
npm install
npm run dev
npm run build
```

## Notes
- No drag-and-drop library used — native pointer events only
- No virtual scrolling library — pure math implementation
- No UI component library — all components hand-built