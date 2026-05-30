// blog-template.js
document.addEventListener('DOMContentLoaded', function() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get('id');
  
  // Cache DOM elements
  const blogTitle = document.getElementById('blog-title');
  const blogCategory = document.getElementById('blog-category');
  const blogDate = document.getElementById('blog-date');
  const blogAuthor = document.getElementById('blog-author');
  const blogContent = document.getElementById('blog-content');
  const relatedPosts = document.getElementById('related-posts');
  const loadingIndicator = document.getElementById('loading-indicator');
  const errorMessage = document.getElementById('error-message');
  const backButton = document.querySelector('.back-button');

  // Play click sound effect
  function playClickSound() {
    const clickSound = new Audio('assets/click.mp3');
    clickSound.play();
  }

  /**
   * Initialize the blog page
   */
  function init() {
    // Setup back button
    if (backButton) {
      backButton.addEventListener('click', function() {
        playClickSound();
        window.location.href = 'blog.html';
      });
    }
    
    // If we have a blog ID, load that blog
    if (blogId) {
      loadBlog(blogId);
    } else {
      // If no ID is provided, show error or redirect
      showError('No blog post specified');
      // Optionally redirect to blog list after delay
      setTimeout(() => {
        window.location.href = 'blog.html';
      }, 2000);
    }
  }

  /**
   * Load a specific blog post by ID
   * @param {string} id - The blog ID to load
   */
  async function loadBlog(id) {
    try {
      // Show loading state
      showLoading(true);
      
      const { data: blog, error } = await supabaseClient
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error('Failed to fetch blog post: ' + error.message);
      }
      
      if (!blog) {
        throw new Error('Blog post not found');
      }
      
      // Display the blog post
      displayBlog(blog);
      
      // Load related posts from database
      loadRelatedBlogs(blog.category, blog.id);
      
    } catch (error) {
      console.error('Error loading blog post:', error);
      showError(error.message || 'Error loading blog post');
    } finally {
      showLoading(false);
    }
  }

  /**
   * Display the blog post on the page
   * @param {Object} blog - The blog post object
   */
  function displayBlog(blog) {
    // Set document title
    document.title = `${blog.title} - Girlsin.tech Blog`;
    
    // Populate blog content
    if (blogTitle) blogTitle.textContent = blog.title;
    if (blogCategory) blogCategory.textContent = blog.category;
    if (blogDate) {
      const date = new Date(blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      blogDate.textContent = date;
    }
    if (blogAuthor) blogAuthor.textContent = blog.author;
    if (blogContent) {
      // Convert newlines to <p> tags for better formatting
      const formattedContent = blog.content
        .split('\n\n')
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph)
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
      
      blogContent.innerHTML = formattedContent;
    }
  }

  /**
   * Load related blog posts from the database
   * @param {string} category - The category to match for related posts
   * @param {string} currentBlogId - The ID of the current blog to exclude from results
   */
  async function loadRelatedBlogs(category, currentBlogId) {
    const relatedGrid = document.getElementById('related-blogs');
    const loadingIndicator = document.getElementById('related-loading');
    
    if (!relatedGrid) return;
    
    try {
      // Show loading indicator
      if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
      }
      
      const { data: blogs, error } = await supabaseClient
        .from('blogs')
        .select('*');
        
      if (error) {
        throw new Error('Failed to fetch related posts: ' + error.message);
      }
      
      // Filter blogs to get related posts (same category, excluding current)
      // If no category match is found, just get other random posts
      const relatedBlogs = (blogs || [])
        .filter(blog => blog.id !== currentBlogId)
        .sort((a, b) => {
          // Prioritize same category blogs but include others too
          if (a.category === category && b.category !== category) return -1;
          if (a.category !== category && b.category === category) return 1;
          return 0;
        })
        .slice(0, 3); // Limit to 3 related posts
      
      // Create HTML for related posts
      if (relatedBlogs.length === 0) {
        relatedGrid.innerHTML = '<p>No related posts found.</p>';
        return;
      }
      
      // Clear loading indicator
      relatedGrid.innerHTML = '';
      
      // Add each related blog post to the grid
      relatedBlogs.forEach(blog => {
        const relatedPost = document.createElement('div');
        relatedPost.className = 'related-post';
        
        // Format date if it exists
        let dateDisplay = blog.date || '';
        if (blog.created_at) {
          dateDisplay = new Date(blog.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        
        // Create the HTML content
        relatedPost.innerHTML = `
          <h4>${blog.title}</h4>
          <p>${blog.excerpt || blog.snippet || 'Read this interesting article...'}</p>
          <button class="read-btn" data-id="${blog.id}">Read Full Article</button>
        `;
        
        relatedGrid.appendChild(relatedPost);
      });
      
      // Add event listeners to the "Read Full Article" buttons
      document.querySelectorAll('#related-blogs .read-btn').forEach(button => {
        button.addEventListener('click', function() {
          playClickSound();
          const blogId = this.dataset.id;
          window.location.href = `blog-template.html?id=${blogId}`;
        });
      });
      
    } catch (error) {
      console.error('Error loading related posts:', error);
      relatedGrid.innerHTML = '<p>Failed to load related posts.</p>';
    } finally {
      // Hide loading indicator
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
    }
  }

  /**
   * Show or hide loading indicator
   * @param {boolean} isLoading - Whether content is loading
   */
  function showLoading(isLoading) {
    if (loadingIndicator) {
      loadingIndicator.style.display = isLoading ? 'flex' : 'none';
    }
    
    // Hide content while loading
    if (blogTitle && blogContent) {
      const contentElements = [blogTitle, blogCategory, blogDate, blogAuthor, blogContent, relatedPosts];
      contentElements.forEach(el => {
        if (el) {
          el.style.display = isLoading ? 'none' : '';
        }
      });
    }
  }

  /**
   * Show error message
   * @param {string} message - The error message to display
   */
  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    }
    
    // Hide content when showing error
    if (blogTitle && blogContent) {
      const contentElements = [blogTitle, blogCategory, blogDate, blogAuthor, blogContent, relatedPosts];
      contentElements.forEach(el => {
        if (el) {
          el.style.display = 'none';
        }
      });
    }
  }

  // Initialize the page
  init();
});
