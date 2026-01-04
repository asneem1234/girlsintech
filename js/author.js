// author.js - Article management using Supabase
document.addEventListener('DOMContentLoaded', function() {
  const articleForm = document.getElementById('article-form');
  const articlesContainer = document.getElementById('articles-container');
  const viewBlogBtn = document.getElementById('view-blog-btn');
  const previewBtn = document.getElementById('preview-btn');
  let editingArticleId = null;

  async function getArticles() {
    try {
      const { data, error } = await supabaseClient
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
  }

  function init() {
    if (articleForm) articleForm.addEventListener('submit', handleFormSubmit);
    if (previewBtn) previewBtn.addEventListener('click', previewArticle);
    if (viewBlogBtn) viewBlogBtn.addEventListener('click', () => window.location.href = 'blog.html');
    
    const imageInput = document.getElementById('article-image');
    if (imageInput) {
      imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            document.getElementById('preview-img').src = event.target.result;
            document.getElementById('image-preview').style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }
    loadArticles();
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const submitBtn = articleForm.querySelector('button[type="submit"]');
      submitBtn.textContent = editingArticleId ? '⏳ Updating...' : '⏳ Publishing...';
      submitBtn.disabled = true;

      const authorName = document.getElementById('author-name').value;
      const nameLower = authorName.toLowerCase().trim();
      let profilePic = 'assets/random.png';
      if (nameLower === 'keerthi') profilePic = 'assets/kee.png';
      else if (nameLower === 'asneem') profilePic = 'assets/an.png';
      
      const formData = {
        title: document.getElementById('article-title').value,
        category: document.getElementById('article-category').value,
        excerpt: document.getElementById('article-excerpt').value,
        content: document.getElementById('article-content').value,
        author: authorName,
        profilepic: profilePic
      };

      if (!formData.title || !formData.category || !formData.excerpt || !formData.content || !formData.author) {
        throw new Error('Please fill in all fields');
      }

      const imageInput = document.getElementById('article-image');
      if (imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
          reader.onload = function(event) {
            formData.image = event.target.result;
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      if (editingArticleId) {
        const { error } = await supabaseClient
          .from('blogs')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingArticleId);
        if (error) throw error;
        showNotification('Article updated successfully!', 'success');
      } else {
        const { error } = await supabaseClient
          .from('blogs')
          .insert([formData]);
        if (error) throw error;
        showNotification('Article published successfully!', 'success');
      }

      articleForm.reset();
      document.getElementById('image-preview').style.display = 'none';
      editingArticleId = null;
      submitBtn.textContent = '📤 Publish Article';
      await loadArticles();
    } catch (error) {
      console.error('Error publishing article:', error);
      showNotification(error.message || 'Failed to publish article', 'error');
    } finally {
      const submitBtn = articleForm.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
    }
  }

  async function loadArticles() {
    try {
      const articles = await getArticles();
      const emptyState = document.getElementById('empty-state');
      if (articles.length === 0) {
        articlesContainer.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }
      if (emptyState) emptyState.style.display = 'none';
      articlesContainer.innerHTML = articles.map(article => createArticleCard(article)).join('');
      
      document.querySelectorAll('.delete-article-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (confirm('Are you sure you want to delete this article?')) {
            deleteArticle(this.dataset.id);
          }
        });
      });
      
      document.querySelectorAll('.edit-article-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          editArticle(this.dataset.id);
        });
      });
    } catch (error) {
      console.error('Error loading articles:', error);
      showNotification('Failed to load articles', 'error');
    }
  }

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

  async function editArticle(id) {
    playClickSound();
    const articles = await getArticles();
    const article = articles.find(a => a.id === id);
    if (!article) {
      showNotification('Article not found', 'error');
      return;
    }
    document.getElementById('article-title').value = article.title;
    document.getElementById('article-category').value = article.category;
    document.getElementById('article-excerpt').value = article.excerpt;
    document.getElementById('article-content').value = article.content;
    document.getElementById('author-name').value = article.author;
    if (article.image) {
      document.getElementById('preview-img').src = article.image;
      document.getElementById('image-preview').style.display = 'block';
    }
    editingArticleId = id;
    articleForm.querySelector('button[type="submit"]').textContent = '💾 Update Article';
    articleForm.scrollIntoView({ behavior: 'smooth' });
  }

  async function deleteArticle(id) {
    try {
      playClickSound();
      const { error } = await supabaseClient.from('blogs').delete().eq('id', id);
      if (error) throw error;
      showNotification('Article deleted successfully!', 'success');
      await loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      showNotification('Failed to delete article', 'error');
    }
  }

  function previewArticle(e) {
    e.preventDefault();
    playClickSound();
    const title = document.getElementById('article-title').value;
    const category = document.getElementById('article-category').value;
    const excerpt = document.getElementById('article-excerpt').value;
    const content = document.getElementById('article-content').value;
    const author = document.getElementById('author-name').value;
    if (!title || !category || !excerpt || !content || !author) {
      showNotification('Please fill in all fields before previewing', 'error');
      return;
    }
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview: ${title}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
            h1 { color: #333; }
            .meta { color: #666; margin: 20px 0; }
            .content { line-height: 1.6; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="meta">
            <strong>Category:</strong> ${category}<br>
            <strong>Author:</strong> ${author}<br>
            <strong>Excerpt:</strong> ${excerpt}
          </div>
          <div class="content">${content}</div>
        </body>
      </html>
    `);
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; padding: 15px 25px;
      background: ${type === 'success' ? '#A3D9A5' : type === 'error' ? '#D9A3A3' : '#D9A3CF'};
      border: 2px solid #000; border-radius: 12px; box-shadow: 3px 3px 0 #000;
      z-index: 10000; font-weight: 600; animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  function playClickSound() {
    const clickSound = document.getElementById('click-sound');
    if (clickSound) {
      try {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Audio play prevented:', e));
      } catch (e) {}
    }
  }

  init();
});
