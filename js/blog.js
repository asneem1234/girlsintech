// blog.js - Reading articles from localStorage
document.addEventListener('DOMContentLoaded', function() {
  console.log('Blog.js loaded and running');
  
  // LocalStorage key for articles (same as author.js)
  const STORAGE_KEY = 'girlsin_articles';
  
  // Cache DOM elements
  const blogsGrid = document.getElementById('blogsGrid');
  const featuredBlog = document.querySelector('.featured-content');
  const categoryLinks = document.querySelectorAll('.category-link');
  const categoryTags = document.querySelectorAll('.category-tag');
  const blogSearch = document.getElementById('blog-search');
  
  // Track current filter
  let currentCategory = '';
  let currentSearchQuery = '';
  
  /**
   * Get articles from localStorage
   */
  function getArticles() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  /**
   * Get profile picture based on author name
   */
  function getProfilePic(authorName) {
    if (!authorName) return 'assets/random.png';
    const nameLower = authorName.toLowerCase().trim();
    if (nameLower === 'keerthi') {
      return 'assets/kee.png';
    } else if (nameLower === 'asneem') {
      return 'assets/an.png';
    }
    return 'assets/random.png';
  }
  
  /**
   * Initialize the blog page
   */
  function init() {
    console.log('Loading blogs from localStorage');
    // Load all blogs on page load
    loadBlogs();
    
    // Setup category filter tags (for blog.html window)
    if (categoryTags) {
      categoryTags.forEach(tag => {
        tag.addEventListener('click', function() {
          // Remove active class from all tags
          categoryTags.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked tag
          this.classList.add('active');
          
          // Get category from data attribute
          currentCategory = this.dataset.category || '';
          
          // Load filtered blogs
          loadBlogs(currentCategory, currentSearchQuery);
        });
      });
    }
    
    // Setup category filter links (for blog-template.html)
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
   * Load blogs from localStorage
   * @param {string} category - Optional category filter
   * @param {string} searchQuery - Optional search query
   */
  function loadBlogs(category = '', searchQuery = '') {
    try {
      // Get blogs from localStorage
      let blogs = getArticles();
      
      // Filter by category if provided
      if (category) {
        blogs = blogs.filter(blog => blog.category === category);
      }
      
      // Filter by search query if provided
      if (searchQuery) {
        blogs = blogs.filter(blog => 
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Handle no results
      if (blogs.length === 0) {
        blogsGrid.innerHTML = `
          <div class="no-results">
            <p>No articles found${category ? ' in ' + category : ''}${searchQuery ? ' matching "' + searchQuery + '"' : ''}.</p>
          </div>
        `;
        if (featuredBlog) {
          featuredBlog.innerHTML = '<p>No featured article available</p>';
        }
        return;
      }
      
      // Set featured blog (first blog)
      if (blogs.length > 0 && featuredBlog) {
        updateFeaturedBlog(blogs[0]);
      }
      
      // Display all blogs in the grid (or remaining if featured is shown)
      const blogsToDisplay = featuredBlog ? blogs.slice(1) : blogs;
      blogsGrid.innerHTML = blogsToDisplay.map(blog => createBlogCard(blog)).join('');
      
    } catch (error) {
      console.error('Error loading blogs:', error);
      blogsGrid.innerHTML = '<p>Failed to load articles. Please try again later.</p>';
    }
  }
  
  /**
   * Update the featured blog section
   */
  function updateFeaturedBlog(blog) {
    if (!featuredBlog) return;
    
    const date = new Date(blog.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Use uploaded image or default
    const blogImage = blog.image || 'assets/team.gif';
    
    featuredBlog.innerHTML = `
      <img src="${blogImage}" alt="${blog.title}" class="featured-image">
      <div class="featured-text">
        <h3>${blog.title}</h3>
        <p>${blog.excerpt}</p>
        <div class="author-info">
          <img src="${blog.profilePic || getProfilePic(blog.author)}" alt="${blog.author}" class="author-avatar">
          <div>
            <div style="font-weight:600;">${blog.author}</div>
            <div>${date}</div>
          </div>
        </div>
        <button class="read-btn" style="position: absolute; right: 12px; bottom: 12px;" onclick="viewArticleContent('${blog.id}')">Read Full Article</button>
      </div>
    `;
  }
  
  /**
   * Create HTML for a blog card
   */
  function createBlogCard(blog) {
    const date = blog.created_at ? 
      new Date(blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 
      (blog.date || "");
    
    return `
      <div class="blog-card" data-id="${blog.id}" onclick="viewArticleContent('${blog.id}')">
        <h3>${blog.title}</h3>
        <span class="blog-category" style="background-color: ${getCategoryColor(blog.category)}; color: #fff; padding: 4px 8px; border-radius: 6px; font-weight: 600;">${blog.category || 'General'}</span>
        <div class="blog-excerpt" style="margin-top: 10px; margin-bottom: 40px; font-size: 12px; line-height: 1.4; height: 65px; overflow: hidden; text-overflow: ellipsis;">
          ${blog.excerpt || 'Click to read this interesting article...'}
        </div>
        <div style="position: absolute; bottom: 55px; left: 15px;">
          <div class="blog-author" style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <img src="${blog.profilePic || getProfilePic(blog.author)}" alt="${blog.author}" class="author-avatar-small" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid: #000;">
            <span style="font-size: 12px;">${blog.author}</span>
          </div>
          <div class="blog-date" style="font-size: 11px;">${date}</div>
        </div>
        <button class="read-btn" onclick="event.stopPropagation(); viewArticleContent('${blog.id}')" style="position: absolute; right: 12px; bottom: 12px; background-color: #D9A3CF; font-size: 12px; padding: 6px 12px;">Read</button>
      </div>
    `;
  }
  
  /**
   * Get a color for a category
   */
  function getCategoryColor(category) {
    const colors = {
      'General': '#D9A3CF',
      'Technology': '#A3D9CF',
      'Design': '#CFA3D9',
      'Career': '#A3CFD9',
      'Tutorial': '#D9CFA3',
      'News': '#D9A3A3',
      'Events': '#A3D9A3'
    };
    
    return colors[category] || colors['General'];
  }
  
  /**
   * View article content in a new window or modal
   */
  function viewArticleContent(id) {
    const STORAGE_KEY = 'girlsin_articles';
    const data = localStorage.getItem(STORAGE_KEY);
    const articles = data ? JSON.parse(data) : [];
    const article = articles.find(a => a.id === id);
    
    if (!article) {
      alert('Article not found');
      return;
    }

    const date = new Date(article.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Open article in a new window with nice formatting
    const articleWindow = window.open('', '_blank');
    articleWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${article.title} - Girlsin.tech</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              max-width: 800px; 
              margin: 40px auto; 
              padding: 20px;
              line-height: 1.6;
              background: #f5f5f0;
            }
            .article-container {
              background: #fff;
              border: 3px solid #000;
              border-radius: 18px;
              padding: 40px;
              box-shadow: 6px 6px 0 #000;
            }
            ${article.image ? `
            .article-image {
              width: 100%;
              max-height: 400px;
              object-fit: cover;
              border: 3px solid #000;
              border-radius: 12px;
              margin-bottom: 30px;
            }
            ` : ''}
            h1 { 
              border-bottom: 3px solid #000; 
              padding-bottom: 15px;
              margin-bottom: 20px;
              font-size: 32px;
            }
            .meta {
              display: flex;
              align-items: center;
              gap: 15px;
              margin-bottom: 30px;
              padding: 15px;
              background: #f5f5f0;
              border-radius: 12px;
              border: 2px solid #000;
            }
            .category {
              display: inline-block;
              background: ${getCategoryColor(article.category)};
              color: #fff;
              padding: 6px 14px;
              border-radius: 8px;
              border: 2px solid #000;
              font-weight: 600;
              font-size: 14px;
            }
            .author-info {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .author-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 2px solid #000;
            }
            .content { 
              white-space: pre-wrap; 
              font-size: 16px;
              line-height: 1.8;
            }
            .back-btn {
              margin-top: 30px;
              padding: 10px 20px;
              background: #D9A3CF;
              border: 2px solid #000;
              border-radius: 10px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 3px 3px 0 #000;
            }
            .back-btn:hover {
              background: #c391b9;
            }
            .back-btn:active {
              transform: translate(1px, 1px);
              box-shadow: 2px 2px 0 #000;
            }
          </style>
        </head>
        <body>
          <div class="article-container">
            ${article.image ? `<img src="${article.image}" alt="${article.title}" class="article-image">` : ''}
            <h1>${article.title}</h1>
            <div class="meta">
              <span class="category">${article.category}</span>
              <div class="author-info">
                <img src="${article.profilePic || getProfilePic(article.author)}" alt="${article.author}" class="author-avatar">
                <div>
                  <div style="font-weight: 600;">${article.author}</div>
                  <div style="font-size: 14px; color: #666;">${date}</div>
                </div>
              </div>
            </div>
            <div class="content">${article.content}</div>
            <button class="back-btn" onclick="window.close()">← Close</button>
          </div>
        </body>
      </html>
    `);
  }

  // Make function globally accessible
  window.viewArticleContent = viewArticleContent;
  
  /**
   * Open a full blog post by redirecting to blog-template.html
   */
  function openBlogPost(id) {
    viewArticleContent(id);
  }
  
  /**
   * Debounce function to limit how often a function is called
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
