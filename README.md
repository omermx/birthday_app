# Birthday Tracker

A totally vibe coded, modern web application for tracking birthdays and anniversaries with full event management capabilities. Import, create, categorize, and export your birthday calendar with ease. Built with React and powered by Vite for fast development and optimal performance.

## Overview

Birthday Tracker helps you keep track of all your friends' and family's birthdays in one convenient place. Simply upload your calendar files (.ics/.ical format), manage events with categorized prefixes, and export your complete birthday calendar whenever needed. View all your important dates in an intuitive monthly calendar interface with full create, read, update, and delete capabilities.

## Features

- **Calendar Import**: Upload .ics and .ical files to import birthday and anniversary events
- **Calendar Export**: Download your events as .ics or .ical files with format selection dialog
- **Monthly Calendar View**: Browse through years with a responsive grid layout showing all events
- **Event Management**: Create, view, and delete events with real-time updates
- **Event Categorization**: Prefix events with types like [Family Birthday], [Work Anniversary], etc.
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
5. Upload a calendar file containing birthday/anniversary events OR use the 'dummy-calendar.ics' file provided in the repository
6. Browse your events in the calendar view
7. Add new events by right-clicking on any calendar day or hovering over empty days
8. Click on events to view details or delete them
9. Download your complete calendar anytime from the menu or welcome page

## Release Notes

### V0.3 - Event Categorization & Export Functionality

**Key Features Added:**
- 📥 **Calendar Export**: Download your events as .ics or .ical files with format selection popup
- 🏷️ **Event Type Prefixing**: All events now include category prefixes (e.g., "[Family Birthday] John")
- 📊 **Enhanced Event Categories**: Expanded event types including:
  - Family Birthday, Friend Birthday, Work Birthday
  - Anniversary, Work Anniversary
  - Other Celebration
- 🗑️ **Delete Confirmation**: Added confirmation dialog when deleting events for safety
- 💾 **Real-time Data Updates**: Both add and delete operations immediately update the calendar view
- 📤 **Smart Export Options**: Download button only appears when events exist to export

**User Experience Improvements:**
- Download Calendar feature accessible from both hamburger menu and welcome page
- Event creation now includes descriptive prefixes for better organization
- Confirmation dialogs prevent accidental event deletion
- Export popup shows event count before download
- Dynamic form labels based on selected event type (Birth Year vs Year)

**Technical Enhancements:**
- ICS file generation with proper VCALENDAR format and yearly recurrence rules
- Blob API integration for client-side file downloads
- Enhanced state management for add/delete operations with proper data flow
- Conditional rendering for download options based on event existence
- Improved event type detection for anniversary vs birthday displays

### V0.2 - Enhanced Event Management & Navigation

**Key Features Added:**
- 🎯 **"Today" Navigation Buttons**: Quick jump to current week, month, or year from any calendar view
- 🎉 **Enhanced Multi-Event Display**: Improved hover functionality to reveal all events on busy days
- ➕ **Create & Delete Events**: Full event management with popup forms and confirmation dialogs
- 🖱️ **Right-Click Context Menu**: Elegant way to add events to days that already contain events
- 🎈 **Event Overflow Management**: Smart display of multiple events with hover-to-expand functionality
- 📝 **Form Validation**: Comprehensive input validation for new event creation
- 🎂 **Visual Event Indicators**: Event count badges and hover hints for better user experience

**User Experience Improvements:**
- Hover over days with multiple events to see all events in an expanded, scrollable view
- Right-click on any day to add new events via context menu
- Today/Current Year buttons for instant navigation back to present time
- Improved event visibility with backdrop effects and smooth transitions
- Enhanced welcome page messaging to include anniversaries

**Technical Enhancements:**
- Context menu system with overlay and positioning logic
- Event state management for add/edit/delete operations
- Improved CSS hover states with z-index management and backdrop effects
- Form handling with date picker and dropdown inputs
- Event filtering and array manipulation for CRUD operations

### V0.1 - Initial Release

**Key Features Added:**
- ✨ **Calendar File Upload**: Import birthday and anniversary events from .ics/.ical files
- 📅 **Interactive Calendar Views**: Week, Month and 12 month grid layouts with year navigation
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
