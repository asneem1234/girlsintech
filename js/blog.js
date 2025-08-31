// blog.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('Blog.js loaded and running');
  
  // Configuration - Update with your backend URL
  const API_URL = 'http://localhost:3000/api/blogs';
  
  // Cache DOM elements
  const blogsGrid = document.getElementById('blogsGrid');
  const featuredBlog = document.querySelector('.featured-content');
  const categoryLinks = document.querySelectorAll('.category-link');
  const blogSearch = document.getElementById('blog-search');
  
  // Track current filter
  let currentCategory = '';
  let currentSearchQuery = '';
  
  /**
   * Initialize the blog page
   */
  function init() {
    // Add a small delay to ensure the DOM is fully ready and any previous scripts have finished
    setTimeout(() => {
      console.log('Loading blogs from API');
      // Load all blogs on page load
      loadBlogs();
    }, 100);
    
    // Setup category filter links
    if (categoryLinks) {
      categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Remove active class from all links
          categoryLinks.forEach(l => l.classList.remove('active'));
          
          // Add active class to clicked link
          this.classList.add('active');
          
          // Get category from data attribute
          currentCategory = this.dataset.category || '';
          
          // Load filtered blogs
          loadBlogs(currentCategory, currentSearchQuery);
        });
      });
    }
    
    // Setup search
    if (blogSearch) {
      blogSearch.addEventListener('input', debounce(function(e) {
        currentSearchQuery = e.target.value.trim();
        loadBlogs(currentCategory, currentSearchQuery);
      }, 500));
    }
  }
  
  /**
   * Load blogs from the backend API
   * @param {string} category - Optional category filter
   * @param {string} searchQuery - Optional search query
   */
  async function loadBlogs(category = '', searchQuery = '') {
    try {
      // Show loading state
      blogsGrid.innerHTML = '<p>Loading articles...</p>';
      if (featuredBlog) {
        featuredBlog.innerHTML = '<div class="loading-spinner"></div><p>Loading featured article...</p>';
      }
      
      // Build query URL with optional filters
      let url = API_URL;
      const queryParams = [];
      
      if (category) {
        queryParams.push(`category=${encodeURIComponent(category)}`);
      }
      
      // Add the query parameters to the URL
      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }
      
      // Fetch blogs from backend
      const response = await fetch(url);
      
      // Check if request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      
      const result = await response.json();
      const blogs = result.data || [];
      
      // Filter by search query if provided (client-side filtering)
      const filteredBlogs = searchQuery ? 
        blogs.filter(blog => 
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase())
        ) : blogs;
      
      // Handle no results
      if (filteredBlogs.length === 0) {
        blogsGrid.innerHTML = `
          <div class="no-results">
            <p>No articles found${category ? ' in ' + category : ''}${searchQuery ? ' matching "' + searchQuery + '"' : ''}.</p>
          </div>
        `;
        return;
      }
      
      // Set featured blog (first blog)
      if (filteredBlogs.length > 0 && featuredBlog) {
        updateFeaturedBlog(filteredBlogs[0]);
      }
      
      // Display the rest of the blogs in the grid
      const remainingBlogs = filteredBlogs.slice(1);
      blogsGrid.innerHTML = remainingBlogs.map(blog => createBlogCard(blog)).join('');
      
      // Add click event listeners to blog cards
      document.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', function() {
          const blogId = this.dataset.id;
          openBlogPost(blogId);
        });
      });
      
      // Add click event listeners to "Read Full Article" buttons
      document.querySelectorAll('.blog-card .read-btn').forEach(button => {
        button.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent the card click event from firing
          const blogId = this.dataset.id;
          openBlogPost(blogId);
        });
      });
      
    } catch (error) {
      console.error('Error loading blogs:', error);
      blogsGrid.innerHTML = '<p>Failed to load articles. Please try again later.</p>';
    }
  }
  
  /**
   * Update the featured blog section
   * @param {Object} blog - The blog object to feature
   */
  function updateFeaturedBlog(blog) {
    if (!featuredBlog) return;
    
    const date = new Date(blog.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Placeholder image for the blog
    const blogImage = 'assets/author.png'; // Use a default image or store image URLs in your database
    
    featuredBlog.innerHTML = `
      <img src="${blogImage}" alt="${blog.title}" class="featured-image">
      <div class="featured-text">
        <h3>${blog.title}</h3>
        <p>${blog.excerpt}</p>
        <div class="author-info">
          <img src="assets/author.png" alt="${blog.author}" class="author-avatar">
          <div>
            <div style="font-weight:600;">${blog.author}</div>
            <div>${date}</div>
          </div>
        </div>
        <button class="read-btn" style="position: absolute; right: 12px; bottom: 12px;" data-id="${blog.id}">Read Full Article</button>
      </div>
    `;
    
    // Add click event for the "Read Full Article" button
    document.querySelector('.featured-text .read-btn').addEventListener('click', function() {
      const blogId = this.dataset.id;
      openBlogPost(blogId);
    });
  }
  
  /**
   * Create HTML for a blog card
   * @param {Object} blog - The blog object
   * @returns {string} HTML string for the blog card
   */
  function createBlogCard(blog) {
    const date = blog.created_at ? 
      new Date(blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 
      (blog.date || "");
    
    // Square card layout (4:3 aspect ratio) with highlighted categories and no images
    return `
      <div class="blog-card" data-id="${blog.id}">
        <h3>${blog.title}</h3>
        <span class="blog-category" style="background-color: ${getCategoryColor(blog.category)}; color: #fff; padding: 4px 8px; border-radius: 6px; font-weight: 600;">${blog.category || 'General'}</span>
        <div class="blog-excerpt" style="margin-top: 10px; margin-bottom: 40px; font-size: 12px; line-height: 1.4; height: 65px; overflow: hidden; text-overflow: ellipsis;">
          ${blog.excerpt || 'Click to read this interesting article...'}
        </div>
        <div style="position: absolute; bottom: 55px; left: 15px;">
          <div class="blog-author" style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <img src="assets/author.png" alt="${blog.author}" class="author-avatar-small" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid #000;">
            <span style="font-size: 12px;">${blog.author}</span>
          </div>
          <div class="blog-date" style="font-size: 11px;">${date}</div>
        </div>
        <button class="read-btn" data-id="${blog.id}" style="position: absolute; right: 12px; bottom: 12px; background-color: #D9A3CF; font-size: 12px; padding: 6px 12px;">Read Full Article</button>
      </div>
    `;
  }
  
  /**
   * Get a color for a category
   * @param {string} category - The category name
   * @returns {string} A hex color code
   */
  function getCategoryColor(category) {
    const colors = {
      'Technology': '#4285F4',
      'Design': '#EA4335',
      'Career': '#34A853',
      'Development': '#8E44AD',
      'Leadership': '#F4B400',
      'General': '#808080'
    };
    
    return colors[category] || colors['General'];
  }
  }
  
  /**
   * Open a full blog post by redirecting to blog-template.html
   * @param {string} id - The ID of the blog to open
   */
  function openBlogPost(id) {
    window.location.href = `blog-template.html?id=${id}`;
  }
  
  /**
   * Debounce function to limit how often a function is called
   * @param {Function} func - The function to debounce
   * @param {number} wait - The debounce delay in milliseconds
   * @returns {Function} - The debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  // Initialize the page
  init();
});
