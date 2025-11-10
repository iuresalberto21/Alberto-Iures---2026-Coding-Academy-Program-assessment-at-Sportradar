# Alberto-Iures---2026-Coding-Academy-Program-assessment-at-Sportradar
# Sports Event Calendar

A small frontend application that displays a sports event calendar, allows users to view event details, and add new events at runtime.  
The project is built using **HTML, CSS and JavaScript**, without any backend or database.

---

## Overview

The application is a single page app (SPA) that provides three main views:

- **Calendar view**  
  Shows the current month in a grid layout, Monday–Sunday.  
  Days that contain events are marked with a dot and list their events as small badges.

- **Event detail view**  
  When clicking on an event badge in the calendar, the user is taken to a detail page showing date, time, sport, teams/title and status.

- **Add Event view**  
  A simple form that allows the user to add new events during runtime.  
  Newly created events appear immediately in the calendar for the selected date.

Events are stored in memory in a JavaScript array (`EVENTS`). No persistent storage is used, as specified in the requirements.

---

## Features

- Dynamic calendar for the **current month**
- Monday-first layout (European format)
- Days from previous and next month are shown with a faded style
- Dot indicator for days with events
- Multiple events per day displayed as scrollable badges
- Click on event → event detail page
- Add new event via form (date, time, sport, title, status)
- Success message on event creation
- Responsive layout (desktop, tablet, mobile)
- Active navigation highlighting and mobile burger menu

---

## Tech Stack

- **HTML** – structure and templates (`<template>` elements for views)
- **CSS** – layout, responsive design, dark theme
- **JavaScript** – routing, calendar generation, event handling

No frameworks or external libraries are used.

---
## Setup & Running

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
2. Open index.html in a browser
You can simply double-click the file or use a simple static server.

Example using Python:

bash
Copy code
# Python 3
python -m http.server 8000

# Then open:
http://localhost:8000
The app will automatically load the calendar view for the current month.

Usage
Navigate using the top navigation bar:

Calendar – main month view

Add Event – add a new event

In the Calendar:

Days from the current month are shown in normal style.

Days from previous/next month are shown faded (class .other-month).

Days with events have a colored dot and event badges.

Click on a badge to see the full event details.

In the Add Event page:

Fill in all required fields (date, time, sport, title).

The default date is set to today.

After submission, a success message is displayed and you are redirected back to the calendar.

Assumptions & Decisions
The calendar always shows the current month based on the user's local time.

Week layout is Monday–Sunday, which is more natural for European users.

Events are stored only in memory (no localStorage / backend), as required.

Navigation is implemented using hash-based routing (#/calendar, #/add, #/event/:id).

Dates are stored internally as YYYY-MM-DD strings and formatted for display using toLocaleDateString.

