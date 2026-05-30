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
  const blogImage = document.getElementById('blog-image');
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
    // Set author avatar image if provided
    const authorAvatarImg = document.getElementById('blog-author-avatar');
    if (authorAvatarImg) {
      if (blog.profilePic) {
        authorAvatarImg.src = blog.profilePic;
      } else if (blog.profile_pic) {
        authorAvatarImg.src = blog.profile_pic;
      } else {
        authorAvatarImg.src = 'assets/author.png';
      }
      authorAvatarImg.alt = blog.author || 'Author';
    }
    if (blogImage && blog.image) {
      blogImage.src = blog.image;
      blogImage.style.display = 'block';
    } else if (blogImage) {
      blogImage.style.display = 'none';
    }
    if (blogContent) {
      // Convert newlines to <p> tags for better formatting
      const formattedContent = blog.content
        .split('\n\n')
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph)
        .map(paragraph => `<p>${paragraph}</p>`)
        .join('');
      
      blogContent.innerHTML = formattedContent;
      // Add share bar with copy and native share support
      try {
        // Remove existing share bar if present
        const existing = document.getElementById('share-bar');
        if (existing) existing.remove();

        const shareBar = document.createElement('div');
        shareBar.id = 'share-bar';
        shareBar.style.display = 'flex';
        shareBar.style.gap = '8px';
        shareBar.style.alignItems = 'center';
        shareBar.style.marginTop = '18px';
        shareBar.style.paddingTop = '12px';
        shareBar.style.borderTop = '1px solid rgba(0,0,0,0.08)';

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.readOnly = true;
        urlInput.value = window.location.href;
        urlInput.style.flex = '1';
        urlInput.style.padding = '8px 10px';
        urlInput.style.border = '1px solid #ddd';
        urlInput.style.borderRadius = '8px';
        urlInput.style.fontSize = '13px';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy link';
        copyBtn.className = 'share-btn';
        copyBtn.style.padding = '8px 12px';
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(urlInput.value);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => (copyBtn.textContent = 'Copy link'), 2000);
          } catch (e) {
            alert('Copy failed — please copy the URL manually.');
          }
        });

        shareBar.appendChild(urlInput);
        shareBar.appendChild(copyBtn);

        // Native share API
        if (navigator.share) {
          const nativeBtn = document.createElement('button');
          nativeBtn.textContent = 'Share';
          nativeBtn.className = 'share-btn';
          nativeBtn.style.padding = '8px 12px';
          nativeBtn.addEventListener('click', async () => {
            try {
              await navigator.share({ title: document.title, url: window.location.href });
            } catch (err) {
              console.log('Share cancelled or failed', err);
            }
          });
          shareBar.appendChild(nativeBtn);
        } else {
          // Add a Twitter share button as fallback
          const twBtn = document.createElement('a');
          twBtn.textContent = 'Tweet';
          twBtn.className = 'share-btn';
          twBtn.style.display = 'inline-flex';
          twBtn.style.alignItems = 'center';
          twBtn.style.justifyContent = 'center';
          twBtn.style.padding = '8px 12px';
          const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title || '')}`;
          twBtn.href = tweetUrl;
          twBtn.target = '_blank';
          shareBar.appendChild(twBtn);
        }

        blogContent.appendChild(shareBar);
      } catch (e) {
        console.error('Error adding share bar:', e);
      }
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
