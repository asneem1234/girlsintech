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
      if (blogsGrid) {
        blogsGrid.innerHTML = blogs.map(blog => createBlogCard(blog)).join('');
        // Defensive cleanup: remove any share/copy UI that may have been added to cards
        try {
          document.querySelectorAll('#blogsGrid .share-btn, #blogsGrid .copy-btn, #blogsGrid .social-share, #blogsGrid .copy-link').forEach(el => el.remove());
        } catch (e) {
          console.warn('Cleanup of card share buttons failed', e);
        }
      }
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
      
      const shareUrl = new URL(`blog-template.html?id=${encodeURIComponent(articleId)}`, window.location.href).href;
      const articleWindow = window.open('', '_blank', 'width=900,height=700');
      articleWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Share ${article.title}</title>
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              min-height: 100vh;
              margin: 0;
              display: grid;
              place-items: center;
              background: #ffe7d8;
            }
            .share-shell {
              background: #fff;
              border: 3px solid #000;
              border-radius: 16px;
              padding: 28px;
              box-shadow: 4px 4px 0 #000;
            }
            .share-btn {
              appearance: none;
              background: #A3D9CF;
              border: 2px solid #000;
              border-radius: 12px;
              padding: 12px 24px;
              font-weight: 700;
              font-size: 15px;
              cursor: pointer;
              box-shadow: 3px 3px 0 #000;
              transition: transform 0.2s, box-shadow 0.2s;
            }
            .share-btn:hover {
              transform: translate(-2px, -2px);
              box-shadow: 5px 5px 0 #000;
            }
            .share-btn:active {
              transform: translate(0, 0);
              box-shadow: 3px 3px 0 #000;
            }
            .share-btn:focus {
              outline: none;
            }
          </style>
        </head>
        <body>
          <div class="share-shell">
            <button class="share-btn" id="share-btn" type="button">Share</button>
          </div>
          <script>
            const shareBtn = document.getElementById('share-btn');
            const shareData = {
              title: ${JSON.stringify(article.title || 'Girlsin.tech Blog')},
              text: ${JSON.stringify(article.title || 'Check out this article')},
              url: ${JSON.stringify(shareUrl)}
            };

            shareBtn.addEventListener('click', async () => {
              try {
                if (navigator.share) {
                  await navigator.share(shareData);
                  return;
                }

                if (navigator.clipboard) {
                  await navigator.clipboard.writeText(shareData.url);
                  shareBtn.textContent = 'Link copied';
                  setTimeout(() => {
                    shareBtn.textContent = 'Share';
                  }, 1500);
                  return;
                }

                const fallbackUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(shareData.url) + '&text=' + encodeURIComponent(shareData.text);
                window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
              } catch (err) {
                console.error('Share action failed:', err);
              }
            });
          </script>
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
