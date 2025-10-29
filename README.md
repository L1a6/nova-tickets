# NovaTicket — React Implementation (HNG Frontend Stage 2 Project)

*NovaTicket* is a modern and responsive *Ticket Management Web Application* built using *React (Vite)*.  
It provides a seamless user experience across authentication, dashboard analytics, and full CRUD operations for tickets.  
This project was built for the *Frontend Stage 2 Multi-Framework Ticket Web App Challenge* — implementing the same design system and logic using React.

---

## Overview

NovaTicket allows users to:

- Sign up and log in with session-based authentication.
- View a real-time dashboard displaying ticket statistics.
- Manage tickets — create, edit, delete, and view with clear visual feedback.
- Enjoy a consistent UI with dark/light mode, animated transitions, and responsive design.

Authentication and authorization are simulated using *localStorage* with the session key.

---

## Features

### Authentication
- Secure login and signup forms with inline validation.
- Toast/snackbar feedback for invalid credentials.
- Redirects to dashboard on successful login.
- Logout clears session and redirects to the Landing Page.

### Dashboard
- Displays key stats:
  - Total Tickets
  - Open Tickets
  - In Progress Tickets
  - Closed Tickets
- Includes quick navigation buttons to the Ticket Management screen.
- Logout button visible at all times.

### Ticket Management (CRUD)
- Create, Read, Update, and Delete tickets with instant validation.
- Each ticket displays its *status* using a color-coded tag:
  - 🟢 open
  - 🟠 in_progress
  - ⚫ closed
- Inline or toast-based validation feedback.
- Fully responsive layout using flex and grid structures.

###  Design & Layout
- Consistent design across all pages:
  - Centered content with max-width: 1440px
  - Wavy SVG Hero section
  - Circular decorative shapes
  - Uniform dark/light mode themes
- Mobile navigation with hamburger toggle
- Accessible color contrast, focus states, and semantic HTML

---

##  Tech Stack

| Category | Tools / Libraries |
|-----------|-------------------|
| Framework | *React (Vite)* |
| State Management | React Context API, useState, useEffect |
| Styling | CSS Modules + Global Styles + Responsive Grid |
| Routing | React Router v6 |
| Charts | Recharts (for dashboard metrics) |
| Animations | Framer Motion |
| Storage | LocalStorage |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Project Setup

### Clone the Repository
```bash
git clone https://github.com/<your-username>/NovaTicket.git
cd NovaTicket
