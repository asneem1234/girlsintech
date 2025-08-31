// author.js
document.addEventListener('DOMContentLoaded', function() {
  // Configuration - Update with your backend URL
  const API_URL = 'http://localhost:3000/api/blogs';

  // Cache DOM elements
  const articleForm = document.getElementById('article-form');
  const articlesContainer = document.getElementById('articles-container');
  const viewBlogBtn = document.getElementById('view-blog-btn');
  const previewBtn = document.getElementById('preview-btn');

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
    
    // Load existing articles
    loadArticles();
  }

  /**
   * Handle form submission for creating a new blog article
   * @param {Event} e - Form submit event
   */
  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      // Show loading state
      const submitBtn = articleForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '⏳ Publishing...';
      submitBtn.disabled = true;

      // Get form values
      const formData = {
        title: document.getElementById('article-title').value,
        category: document.getElementById('article-category').value,
        excerpt: document.getElementById('article-excerpt').value,
        content: document.getElementById('article-content').value,
        author: document.getElementById('author-name').value
      };

      // Validate form data
      if (!formData.title || !formData.category || !formData.excerpt || !formData.content || !formData.author) {
        throw new Error('Please fill in all fields');
      }

      // Send data to backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // Check if request was successful
      if (!response.ok) {
        throw new Error(data.message || 'Failed to publish article');
      }

      // Show success message
      showNotification('Article published successfully!', 'success');

      // Reset form
      articleForm.reset();

      // Reload articles to show the new one
      loadArticles();
      
    } catch (error) {
      console.error('Error publishing article:', error);
      showNotification(error.message || 'Failed to publish article', 'error');
    } finally {
      // Reset button state
      const submitBtn = articleForm.querySelector('button[type="submit"]');
      submitBtn.textContent = '📤 Publish Article';
      submitBtn.disabled = false;
    }
  }

  /**
   * Load existing articles from the backend
   */
  async function loadArticles() {
    try {
      // Show loading state
      articlesContainer.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading your articles...</p>
        </div>
      `;

      // Fetch articles from backend
      const response = await fetch(API_URL);
      
      // Check if request was successful
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const result = await response.json();
      const articles = result.data || [];

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
          // You would implement editing functionality here
          alert('Edit functionality will be implemented in a future update');
        });
      });

    } catch (error) {
      console.error('Error loading articles:', error);
      articlesContainer.innerHTML = '<p>Failed to load articles. Please try again later.</p>';
    }
  }

  /**
   * Create HTML for an article card
   * @param {Object} article - The article object
   * @returns {string} HTML string for the article card
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
          <p>${article.category} • ${article.excerpt.substring(0, 100)}${article.excerpt.length > 100 ? '...' : ''}</p>
        </div>
        <div class="article-actions">
          <button class="btn-small btn-edit edit-article-btn" data-id="${article.id}">✏️ Edit</button>
          <button class="btn-small btn-delete delete-article-btn" data-id="${article.id}">🗑️ Delete</button>
        </div>
      </div>
    `;
  }

  /**
   * Delete an article by ID
   * @param {string} id - The article ID to delete
   */
  async function deleteArticle(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete article');
      }

      // Show success message
      showNotification('Article deleted successfully', 'success');

      // Reload articles
      loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      showNotification(error.message || 'Failed to delete article', 'error');
    }
  }

  /**
   * Preview the article before publishing
   */
  function previewArticle() {
    const title = document.getElementById('article-title').value;
    const category = document.getElementById('article-category').value;
    const excerpt = document.getElementById('article-excerpt').value;
    const content = document.getElementById('article-content').value;
    const author = document.getElementById('author-name').value;

    // Validate form data
    if (!title || !category || !excerpt || !content || !author) {
      showNotification('Please fill in all fields to preview', 'error');
      return;
    }

    // Create and show preview modal (you would implement this UI)
    alert(`
      Title: ${title}
      Category: ${category}
      Author: ${author}
      Excerpt: ${excerpt}
      
      Content Preview:
      ${content.substring(0, 200)}${content.length > 200 ? '...' : ''}
    `);
    
    // Alternatively, you could implement a more sophisticated preview modal
  }

  /**
   * Show notification to user
   * @param {string} message - The message to show
   * @param {string} type - The notification type (success, error)
   */
  function showNotification(message, type = 'info') {
    // You could implement a more sophisticated notification system
    if (type === 'error') {
      alert(`❌ ${message}`);
    } else {
      alert(`✅ ${message}`);
    }
  }

  // Initialize the page
  init();

  // Expose deleteArticle function globally to override the stub
  window.deleteArticle = function(id) {
    deleteArticle(id);
  };

  // Expose editArticle function globally (placeholder for future implementation)
  window.editArticle = function(id) {
    alert("Edit functionality will be implemented in a future update");
    // In a full implementation, this would populate the form with article data
    // and set up form for update instead of create
  };
});
