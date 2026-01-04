// blog.js - Reading articles from Supabase
document.addEventListener('DOMContentLoaded', function() {
  console.log('Blog.js loaded and running');
  
  const blogsGrid = document.getElementById('blogsGrid');
  const featuredBlog = document.querySelector('.featured-content');
  const categoryTags = document.querySelectorAll('.category-tag');
  const blogSearch = document.getElementById('blog-search');
  let currentCategory = '';
  let currentSearchQuery = '';
  
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
  
  function getProfilePic(authorName) {
    if (!authorName) return 'assets/random.png';
    const nameLower = authorName.toLowerCase().trim();
    if (nameLower === 'keerthi') return 'assets/kee.png';
    else if (nameLower === 'asneem') return 'assets/an.png';
    return 'assets/random.png';
  }
  
  function init() {
    console.log('Loading blogs from Supabase');
    loadBlogs();
    
    if (categoryTags) {
      categoryTags.forEach(tag => {
        tag.addEventListener('click', function() {
          categoryTags.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          currentCategory = this.dataset.category || '';
          loadBlogs(currentCategory, currentSearchQuery);
        });
      });
    }
    
    if (blogSearch) {
      blogSearch.addEventListener('input', function() {
        currentSearchQuery = this.value.toLowerCase();
        loadBlogs(currentCategory, currentSearchQuery);
      });
    }
  }
  
  async function loadBlogs(category = '', searchQuery = '') {
    try {
      let blogs = await getArticles();
      
      if (category) {
        blogs = blogs.filter(blog => blog.category === category);
      }
      
      if (searchQuery) {
        blogs = blogs.filter(blog => 
          blog.title.toLowerCase().includes(searchQuery) ||
          blog.excerpt.toLowerCase().includes(searchQuery) ||
          blog.author.toLowerCase().includes(searchQuery)
        );
      }
      
      if (blogs.length === 0) {
        if (blogsGrid) blogsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No articles found</p>';
        if (featuredBlog) featuredBlog.innerHTML = '<p>No featured article yet</p>';
        return;
      }
      
      if (featuredBlog) updateFeaturedBlog(blogs[0]);
      if (blogsGrid) blogsGrid.innerHTML = blogs.map(blog => createBlogCard(blog)).join('');
    } catch (error) {
      console.error('Error loading blogs:', error);
      if (blogsGrid) blogsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to load articles</p>';
    }
  }
  
  function updateFeaturedBlog(blog) {
    const date = blog.created_at ? 
      new Date(blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '';
    
    const blogImage = blog.image || 'assets/default-blog.png';
    
    featuredBlog.innerHTML = `
      <img src="${blogImage}" alt="${blog.title}" class="featured-image">
      <div class="featured-text">
        <h3>${blog.title}</h3>
        <p>${blog.excerpt}</p>
        <div class="author-info">
          <img src="${blog.profilepic || getProfilePic(blog.author)}" alt="${blog.author}" class="author-avatar">
          <div>
            <div style="font-weight:600;">${blog.author}</div>
            <div>${date}</div>
          </div>
        </div>
        <button class="read-btn" style="position: absolute; right: 12px; bottom: 12px;" onclick="viewArticleContent('${blog.id}')">Read Full Article</button>
      </div>
    `;
  }
  
  function createBlogCard(blog) {
    const date = blog.created_at ? 
      new Date(blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '';
    
    return `
      <div class="blog-card" data-id="${blog.id}" onclick="viewArticleContent('${blog.id}')">
        <h3>${blog.title}</h3>
        <span class="blog-category" style="background-color: ${getCategoryColor(blog.category)}; color: #fff; padding: 4px 8px; border-radius: 6px; font-weight: 600;">${blog.category || 'General'}</span>
        <div class="blog-excerpt" style="margin-top: 10px; margin-bottom: 40px; font-size: 12px; line-height: 1.4; height: 65px; overflow: hidden;">
          ${blog.excerpt || 'Click to read this interesting article...'}
        </div>
        <div style="position: absolute; bottom: 55px; left: 15px;">
          <div class="blog-author" style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <img src="${blog.profilepic || getProfilePic(blog.author)}" alt="${blog.author}" class="author-avatar-small" style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid #000;">
            <span style="font-size: 12px;">${blog.author}</span>
          </div>
          <div class="blog-date" style="font-size: 11px;">${date}</div>
        </div>
        <button class="read-btn" onclick="event.stopPropagation(); viewArticleContent('${blog.id}')" style="position: absolute; right: 12px; bottom: 12px; background-color: #D9A3CF; font-size: 12px; padding: 6px 12px;">Read</button>
      </div>
    `;
  }
  
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
    return colors[category] || '#D9A3CF';
  }
  
  window.viewArticleContent = async function(articleId) {
    try {
      const { data: article, error } = await supabaseClient
        .from('blogs')
        .select('*')
        .eq('id', articleId)
        .single();
      
      if (error) throw error;
      if (!article) {
        alert('Article not found');
        return;
      }
      
      const date = new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const articleWindow = window.open('', '_blank', 'width=900,height=700');
      articleWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${article.title}</title>
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              background: #ffe7d8;
              color: #000;
            }
            .article-container {
              background: #fff;
              border: 3px solid #000;
              border-radius: 14px;
              padding: 40px;
              box-shadow: 4px 4px 0 #000;
            }
            .article-image {
              width: 100%;
              max-height: 400px;
              object-fit: cover;
              border: 2px solid #000;
              border-radius: 10px;
              margin-bottom: 20px;
            }
            h1 {
              margin: 0 0 10px;
              font-size: 32px;
              line-height: 1.2;
            }
            .meta {
              display: flex;
              align-items: center;
              gap: 15px;
              margin: 20px 0;
              padding: 15px 0;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
            }
            .category {
              background: ${getCategoryColor(article.category)};
              color: #fff;
              padding: 6px 12px;
              border-radius: 8px;
              font-weight: 600;
              border: 2px solid #000;
            }
            .author-info {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-left: auto;
            }
            .author-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 2px solid #000;
            }
            .content {
              line-height: 1.8;
              font-size: 16px;
              margin: 30px 0;
              white-space: pre-wrap;
            }
            .back-btn {
              background: #A3D9CF;
              border: 2px solid #000;
              border-radius: 12px;
              padding: 12px 24px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 3px 3px 0 #000;
              transition: transform 0.2s;
            }
            .back-btn:hover {
              transform: translate(-2px, -2px);
              box-shadow: 5px 5px 0 #000;
            }
            .back-btn:active {
              transform: translate(0, 0);
              box-shadow: 3px 3px 0 #000;
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
                <img src="${article.profilepic || getProfilePic(article.author)}" alt="${article.author}" class="author-avatar">
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
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Failed to load article. Please try again.');
    }
  };
  
  init();
});
