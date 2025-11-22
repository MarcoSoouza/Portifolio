# Projeto TopBurgue Documentation

## Overview
TopBurgue is a web project designed to showcase and manage a fictional burger restaurant with an interactive front-end interface for customers and an administrative financial dashboard. It uses modern web technologies with responsive design and rich UI interactions.

## Technologies Used
- **HTML5** for semantic markup and content structure.
- **CSS3** with custom styles and Bootstrap 5 for responsive grid layouts and components.
- **JavaScript (ES6+)** for client-side interactions including cart management, order processing, and finance dashboard.
- **LocalStorage** for persisting order data on the client side.
- **Bootstrap 5 CDN** for fast UI components and grid layout.
- **FontAwesome CDN** for iconography.

## Project Structure
```
Projeto/Projeto 3/TopBurgue/
├── index.html              # Homepage with navbar, hero, feature highlights, footer
├── cardapio.html           # Menu page (not reviewed, but linked from index)
├── contato.html            # Contact page (linked from navbar)
├── financeiro.html         # Finance dashboard page with login and reports
├── TODO.md                 # Project todo list (if exists)
├── assets/
│   ├── css/
│   │   ├── index.css       # Custom styles for homepage
│   │   ├── cardapio.css    # Menu page styling (not reviewed)
│   │   ├── contato.css     # Contact page styling (not reviewed)
│   │   ├── financeiro.css  # Finance page styling (not reviewed)
│   │   └── style.css       # Additional shared styles (if any)
│   ├── js/
│   │   └── script.js       # Main JavaScript for cart, order submission, finance functions
│   └── Imagem/             # Image assets folder with burger and food images
│       ├── Hamburguers, Snacks, Drinks images used in UI
└── PROJECT_DOCUMENTATION.md # This documentation file
```

## Key Features

### Homepage (index.html)
- Responsive navigation bar with links to Home, Menu (Cardápio), Contact, and Finance pages.
- Hero section showcasing signature burger and call-to-action button linking to menu.
- Features section highlighting key selling points such as premium ingredients, artisan preparation, express service, team specialization, and location.
- Footer with copyright.

### Styles (index.css)
- Uses smooth gradients for backgrounds and buttons.
- Card hover animations and shadow effects to enhance UI interactivity.
- Responsive design for mobile and tablet screens.
- Animated feature cards with fade-in effects.

### Client-side JavaScript (script.js)
- **Cart management**: add/remove items, update totals dynamically.
- **Order submission**: validate form inputs, alert order summary, clear cart on submission.
- **Audio feedback**: beep sound when adding to cart or submitting order.
- **Finance Dashboard**:
  - Login system with simple username/password check.
  - Displays financial metrics: total orders, revenue, today's sales.
  - Lists orders and recent activity dynamically from LocalStorage.
  - Export financial report as text file.
  - Clear order history and refresh financial data functions.

## Usage
- Customer visits homepage, browses menu, adds items to cart.
- Customers submit order through form, which stores data locally.
- Finance users login to monitor sales and export reports.

## Potential Enhancements
- Backend integration for order persistence and management.
- User authentication for secure finance page.
- Responsive improvements for smaller screen devices.
- Additional pages and features such as promotions or customer reviews.

---

*Documentation generated based on project files reviewed as of 2023.*
