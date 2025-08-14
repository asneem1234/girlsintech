# Girlsin - Interactive Digital Experience Website

## Overview
Girlsin is a playful, nostalgic website that draws inspiration from retro desktop interfaces while delivering modern web experiences. The site features an interactive design with custom cursor interactions, pop-up windows, and a unique desktop-like interface.

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
├── blog-post.html      # Example of a specific blog post
├── team.html           # Team members page
├── article.html        # Article layout
├── blogs.html          # Alternative blog listing page
├── landingpage.html    # Alternative landing page
├── README.md           # Project documentation (this file)
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

### Creating New Blog Posts
1. Duplicate the `blog-template.html` file
2. Rename it to reflect your blog post title
3. Replace placeholder content marked with [brackets]
4. Update images, text, and metadata
5. Add to the blog listing in the Blog window

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
