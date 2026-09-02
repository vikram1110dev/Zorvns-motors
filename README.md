# ZORVNS

ZORVNS is a comprehensive web platform for motorcycle enthusiasts, offering an extensive e-commerce catalog for spare parts and a complete garage service booking system. 

Built with React and Vite, the platform provides a seamless experience for browsing parts by bike model, managing service bookings, and tracking repairs.

## Features

- **E-Commerce Catalog:** Browse and search for motorcycle spare parts across various categories (Engine, Brakes, Filters, Controls, etc.).
- **Shop by Bike Model:** Filter spare parts based on specific motorcycle brands and models.
- **Service Booking:** Schedule garage services, general diagnostics, and repairs.
- **Real-Time Tracking:** Track the status of your service booking using a unique tracking code.
- **Admin Dashboard:** (via `admin.html`) A dedicated admin panel for managing inventory, tracking bookings, and responding to customer inquiries.
- **Wishlist & Cart:** Save parts for later or add them to your cart for checkout.

## Tech Stack

- **Frontend:** React 19, Vite, Lucide React (Icons)
- **Styling:** Custom CSS with CSS variables for responsive design and dynamic layouts
- **Deployment:** Vercel (configured via `vercel.json`)

## Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview the production build locally:
   ```bash
   npm run preview
   ```

5. Run the linter (Oxlint):
   ```bash
   npm run lint
   ```

## Folder Structure

- `/src`: Contains the React source code, components, and assets.
  - `App.jsx`: Main application component handling state, routing, and UI.
  - `index.css`: Global styles and custom CSS variables.
- `index.html`: Main entry point for the React application.
- `admin.html`: Static admin dashboard entry point.
- `vite.config.js`: Vite configuration.
- `vercel.json`: Vercel deployment configuration.
