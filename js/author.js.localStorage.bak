// author.js - Article management using localStorage
document.addEventListener('DOMContentLoaded', function() {
  // LocalStorage key for articles
  const STORAGE_KEY = 'girlsin_articles';

  // Cache DOM elements
  const articleForm = document.getElementById('article-form');
  const articlesContainer = document.getElementById('articles-container');
  const viewBlogBtn = document.getElementById('view-blog-btn');
  const previewBtn = document.getElementById('preview-btn');

  // Track current editing article
  let editingArticleId = null;

  /**
   * Get articles from localStorage
   */
  function getArticles() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Save articles to localStorage
   */
  function saveArticles(articles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }

  /**
   * Initialize the page
   */
  function init() {
    // Add event listeners
    if (articleForm) {
      articleForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (previewBtn) {
      previewBtn.addEventListener('click', previewArticle);
    }
    
    if (viewBlogBtn) {
      viewBlogBtn.addEventListener('click', () => {
        window.location.href = 'blog.html';
      });
    }
    
    // Image upload preview
    const imageInput = document.getElementById('article-image');
    if (imageInput) {
      imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            const previewContainer = document.getElementById('image-preview');
            const previewImg = document.getElementById('preview-img');
            previewImg.src = event.target.result;
            previewContainer.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // Load existing articles
    loadArticles();
  }

  /**
   * Handle form submission for creating/updating a blog article
   */
  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      // Show loading state
      const submitBtn = articleForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = editingArticleId ? '⏳ Updating...' : '⏳ Publishing...';
      submitBtn.disabled = true;

      // Get form values
      const authorName = document.getElementById('author-name').value;
      
      // Determine profile picture based on author name
      let profilePic = 'assets/random.png'; // default
      const nameLower = authorName.toLowerCase().trim();
      if (nameLower === 'keerthi') {
        profilePic = 'assets/kee.png';
      } else if (nameLower === 'asneem') {
        profilePic = 'assets/an.png';
      }
      
      const formData = {
        title: document.getElementById('article-title').value,
        category: document.getElementById('article-category').value,
        excerpt: document.getElementById('article-excerpt').value,
        content: document.getElementById('article-content').value,
        author: authorName,
        profilePic: profilePic
      };

      // Validate form data
      if (!formData.title || !formData.category || !formData.excerpt || !formData.content || !formData.author) {
        throw new Error('Please fill in all fields');
      }

      // Handle image upload
      const imageInput = document.getElementById('article-image');
      if (imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        
        // Wait for image to be read
        await new Promise((resolve, reject) => {
          reader.onload = function(event) {
            formData.image = event.target.result;
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // Get existing articles
      const articles = getArticles();

      if (editingArticleId) {
        // Update existing article
        const index = articles.findIndex(a => a.id === editingArticleId);
        if (index !== -1) {
          articles[index] = {
            ...articles[index],
            ...formData,
            updated_at: new Date().toISOString()
          };
        }
        showNotification('Article updated successfully!', 'success');
      } else {
        // Create new article
        const newArticle = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        articles.unshift(newArticle);
        showNotification('Article published successfully!', 'success');
      }

      // Save to localStorage
      saveArticles(articles);

      // Reset form and editing state
      articleForm.reset();
      document.getElementById('image-preview').style.display = 'none';
      editingArticleId = null;
      submitBtn.textContent = '📤 Publish Article';

      // Reload articles
      loadArticles();
      
    } catch (error) {
      console.error('Error publishing article:', error);
      showNotification(error.message || 'Failed to publish article', 'error');
    } finally {
      // Reset button state
      const submitBtn = articleForm.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
    }
  }

  /**
   * Load existing articles from localStorage
   */
  function loadArticles() {
    try {
      const articles = getArticles();

      // Display articles or show empty state
      const emptyState = document.getElementById('empty-state');
      
      if (articles.length === 0) {
        articlesContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      // Hide empty state and render articles
      if (emptyState) emptyState.style.display = 'none';
      articlesContainer.innerHTML = articles.map(article => createArticleCard(article)).join('');
      
      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-article-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const articleId = this.dataset.id;
          if (confirm('Are you sure you want to delete this article?')) {
            deleteArticle(articleId);
          }
        });
      });
      
      // Add event listeners to edit buttons
      document.querySelectorAll('.edit-article-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const articleId = this.dataset.id;
          editArticle(articleId);
        });
      });

    } catch (error) {
      console.error('Error loading articles:', error);
      articlesContainer.innerHTML = '<p>Failed to load articles. Please try again later.</p>';
    }
  }

  /**
   * Create HTML for an article card
   */
  function createArticleCard(article) {
    const date = new Date(article.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <div class="article-item" data-id="${article.id}">
        <div class="article-info">
          <h4>${article.title}</h4>
          <p><strong>${article.category}</strong> • ${article.excerpt.substring(0, 100)}${article.excerpt.length > 100 ? '...' : ''}</p>
          <small>By ${article.author} • ${date}</small>
        </div>
        <div class="article-actions">
          <button class="btn-small btn-edit edit-article-btn" data-id="${article.id}">✏️ Edit</button>
          <button class="btn-small btn-delete delete-article-btn" data-id="${article.id}">🗑️ Delete</button>
        </div>
      </div>
    `;
  }

  /**
   * Edit an article by ID
   */
  function editArticle(id) {
    playClickSound();
    const articles = getArticles();
    const article = articles.find(a => a.id === id);
    
    if (!article) {
      showNotification('Article not found', 'error');
      return;
    }

    // Populate form with article data
    document.getElementById('article-title').value = article.title;
    document.getElementById('article-category').value = article.category;
    document.getElementById('article-excerpt').value = article.excerpt;
    document.getElementById('article-content').value = article.content;
    document.getElementById('author-name').value = article.author;

    // Set editing state
    editingArticleId = id;

    // Update button text
    const submitBtn = articleForm.querySelector('button[type="submit"]');
    submitBtn.textContent = '💾 Update Article';

    // Scroll to form
    articleForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

    showNotification('Editing article - make your changes and click Update', 'info');
  }

  /**
   * Delete an article by ID
   */
  function deleteArticle(id) {
    playClickSound();
    try {
      const articles = getArticles();
      const filteredArticles = articles.filter(a => a.id !== id);
      saveArticles(filteredArticles);
      showNotification('Article deleted successfully', 'success');
      loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      showNotification('Failed to delete article', 'error');
    }
  }

  /**
   * Preview the article before publishing
   */
  function previewArticle() {
    playClickSound();
    const title = document.getElementById('article-title').value;
    const content = document.getElementById('article-content').value;
    const author = document.getElementById('author-name').value;
    const category = document.getElementById('article-category').value;
    
    if (!title || !content) {
      alert('Please fill in title and content to preview!');
      return;
    }
    
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview: ${title}</title>
          <style>
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              max-width: 800px; 
              margin: 40px auto; 
              padding: 20px;
              line-height: 1.6;
            }
            h1 { 
              border-bottom: 3px solid #000; 
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .meta {
              color: #666;
              margin-bottom: 20px;
              font-size: 14px;
            }
            .category {
              display: inline-block;
              background: #D9A3CF;
              padding: 4px 12px;
              border-radius: 8px;
              border: 2px solid #000;
              font-weight: 600;
              margin-right: 10px;
            }
            .content { 
              white-space: pre-wrap; 
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="meta">
            <span class="category">${category}</span>
            <span>By ${author}</span>
          </div>
          <div class="content">${content}</div>
        </body>
      </html>
    `);
  }

  /**
   * Show notification message
   */
  function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: #fff;
        border: 3px solid #000;
        border-radius: 12px;
        box-shadow: 4px 4px 0 #000;
        z-index: 10000;
        max-width: 300px;
        font-weight: 600;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(notification);
    }

    // Set color based on type
    const colors = {
      success: '#A3D9A5',
      error: '#D9A3A3',
      info: '#A3D9CF'
    };
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    notification.style.opacity = '1';

    // Hide after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
    }, 3000);
  }

  /**
   * Play click sound (if available)
   */
  function playClickSound() {
    if (window.playClickSound && typeof window.playClickSound === 'function') {
      window.playClickSound();
    }
  }

  // Make functions globally accessible
  window.editArticle = editArticle;
  window.deleteArticle = deleteArticle;

  // Initialize
  init();
});
