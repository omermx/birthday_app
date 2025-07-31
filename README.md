# Birthday Tracker

A totally vibe coded, modern web application for tracking birthdays and anniversaries by importing calendar files. Built with React and powered by Vite for fast development and optimal performance.

## Overview

Birthday Tracker helps you keep track of all your friends' and family's birthdays in one convenient place. Simply upload your calendar files (.ics/.ical format) and view all your important dates in an intuitive monthly calendar interface.

## Features

- **Calendar Import**: Upload .ics and .ical files to import birthday and anniversary events
- **Monthly Calendar View**: Browse through years with a responsive grid layout showing all events
- **Event Details**: Click on any event to see detailed information including age calculations
- **Smart Date Processing**: Automatically extracts birth years from event descriptions
- **Anniversary Support**: Distinguishes between birthdays and anniversaries with appropriate labeling
- **Upcoming Events**: View upcoming events for the current month on the homepage
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser and navigate to the local development URL
5. Upload a calendar file containing birthday/anniversary events
6. Browse your events in the calendar view

## Release Notes

### V0.1 - Initial Release

**Key Features Added:**
- ✨ **Calendar File Upload**: Import birthday and anniversary events from .ics/.ical files
- 📅 **Interactive Calendar View**: Monthly grid layout with year navigation
- 🎂 **Smart Age Calculation**: Automatically calculates ages and years since anniversaries
- 🔍 **Event Details Popup**: Click events to view detailed information with birth year and calculated age
- 📊 **Upcoming Events Counter**: Homepage displays count of remaining events in current month
- 🎊 **Anniversary Support**: Special handling for anniversary events with "Years Ago" instead of "Age"
- 📱 **Responsive Design**: Adaptive layout that works on all screen sizes
- 🎯 **Smart Year Extraction**: Extracts birth years from event descriptions when available
- 💫 **Modern UI**: Clean, intuitive interface with smooth animations and hover effects

**Technical Highlights:**
- Built with React 18 and Vite for optimal performance
- Uses ICAL.js for robust calendar file parsing
- Responsive CSS Grid layout with clamp() functions for fluid sizing
- Date-fns integration for reliable date handling and formatting
