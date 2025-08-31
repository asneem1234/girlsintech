# Girlsin - Interactive Digital Experience Website with Dynamic Blog

## Overview
Girlsin is a playful, nostalgic website that draws inspiration from retro desktop interfaces while delivering modern web experiences. The site features an interactive design with custom cursor interactions, pop-up windows, and a unique desktop-like interface.

## Dynamic Blog System (New)

This project has been enhanced with a dynamic blog system using:

- **Node.js Express Backend**: RESTful API endpoints
- **Supabase Database**: PostgreSQL storage for blog content
- **JavaScript Integration**: Frontend connectivity to backend services

## Features

### Interactive Elements
- **Custom Cursor**: Replaces the default cursor with a custom arrow that changes on hoverable elements
- **Click Sound Effects**: Provides audio feedback when clicking on interactive elements
- **Draggable Windows**: Desktop-style windows that can be moved, minimized, maximized, and closed
- **Dock Navigation**: MacOS-inspired dock at the bottom of the screen for easy navigation

### Main Sections
1. **Blog Window**: Browse blog posts in a categorized grid layout
2. **Team Window**: Learn about team members and their roles
3. **About Us Window**: Read about the company's story and values

### Blog System
- Blog listing page with featured posts
- Individual blog post templates
- Category filtering
- Author information display
- Related posts suggestions

## File Structure

```
Girlsin/
├── index.html          # Landing page
├── blog.html           # Blog listing with popup windows
├── blog-template.html  # Template for individual blog posts
├── author.html         # Author interface for creating blog posts
├── team.html           # Team members page
├── landingpage.html    # Alternative landing page
├── README.md           # Project documentation (this file)
├── DEPLOYMENT.md       # Deployment instructions
├── server.js           # Express server setup
├── routes/             # API route handlers
│   └── blogs.js        # Blog API endpoints
├── js/                 # Frontend JavaScript
│   ├── author.js       # Script for author.html
│   └── blog.js         # Script for blog.html
├── schema.sql          # Supabase database schema
├── package.json        # Node.js dependencies
├── .env.example        # Template for environment variables
├── assets/             # Images and media files
    ├── arrow.png       # Custom cursor
    ├── clickable.png   # Hover state cursor
    ├── logo.png        # Site logo
    ├── team.png        # Team imagery
    ├── folder.png      # Folder icon
    ├── click.mp3       # Click sound effect
    └── ...             # Other assets
```

## Design Elements

### Color Scheme
- Beige backgrounds (`#F5F5DC`)
- Purple accents (`#D9A3CF`)
- Black outlines (`#000`)
- White content areas

### Typography
- Primary font: Inter (Google Fonts)
- Headings: Bold weight
- Body text: Regular and medium weights

## Implementation Details

### Window System
The site uses a custom window management system that allows for:
- Opening multiple windows
- Bringing active window to front
- Dragging windows by their headers
- Minimizing/maximizing windows
- Closing windows with animations

### Blog Content
Blog posts use a consistent template structure with:
- Featured image
- Author information
- Reading time
- Category tags
- Related posts
- Social sharing options

## How to Use

### Navigating the Site
- Click on dock icons at the bottom to open different windows
- Use window controls (red, yellow, green buttons) to manage windows
- Click the back button to return to previous pages

### Setting Up the Backend
1. Install dependencies with `npm install`
2. Configure your `.env` file with Supabase credentials
3. Start the server with `npm start`

### Creating New Blog Posts
1. Navigate to `author.html`
2. Fill out the blog post form with title, category, excerpt, content, and author name
3. Click "Publish Article" to save to the database
4. View your published post on `blog.html`

### Modifying the Design
- Edit CSS variables in the `:root` section to change color scheme
- Adjust shadow values for more or less depth
- Modify border-radius values for rounder or sharper corners

### Adding New Windows
1. Create HTML structure following the existing window pattern
2. Add corresponding CSS styles
3. Implement JavaScript for window controls
4. Create a dock icon that opens the window

## Browser Compatibility
- Optimized for modern browsers (Chrome, Firefox, Safari, Edge)
- Uses CSS features like flexbox, grid, and custom properties
- Requires JavaScript for interactive elements

## Credits
- Fonts: Inter from Google Fonts
- Icons: Custom SVG icons
- Sounds: Custom click sound effects

## License
All rights reserved © 2025 Girlsin
