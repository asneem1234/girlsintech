import sys

with open("profile.html", "r", encoding="utf-8") as f:
    content = f.read()

start_idx = content.find('const author = { name: "Asneem", initials: "A", image: "assets/an.png" };')
end_idx = content.find('// Custom cursor')

new_script = """const author = { name: "Asneem", initials: "A", image: "assets/an.png" };
    const grid = document.getElementById('blogsGrid');

    async function loadAsneemBlogs() {
      try {
        const { data: blogs, error } = await supabaseClient
          .from('blogs')
          .select('*')
          .ilike('author', '%Asneem%')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (!blogs || blogs.length === 0) {
          grid.innerHTML = '<p style="text-align:center;width:100%;">No blogs found for Asneem yet.</p>';
          return;
        }

        blogs.forEach(blog => {
          const card = document.createElement('div');
          card.className = 'blog-card';

          let dateStr = "Unknown Date";
          if (blog.created_at) {
            const d = new Date(blog.created_at);
            dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          }

          card.innerHTML = `
            <div class="blog-title-text">${blog.title}</div>
            <div class="blog-tag">${blog.category || 'Blog'}</div>
            <p class="blog-excerpt">${blog.excerpt || ''}</p>
            <div class="blog-footer">
              <div class="author-mini">
                <div class="mini-avatar">${author.initials}</div>
                <div class="author-info">
                  <span class="author-name-sm">${author.name}</span>
                  <span class="blog-date">${dateStr}</span>
                </div>
              </div>
              <button class="read-btn" onclick="window.location.href='blog-template.html?id=${blog.id}'">Read</button>
            </div>
          \`;
          grid.appendChild(card);
        });
      } catch (err) {
        console.error("Error loading blogs:", err);
        grid.innerHTML = '<p style="text-align:center;width:100%;">Error loading blogs.</p>';
      }
    }

    loadAsneemBlogs();

    """

script_tag_idx = content.rfind("<script>", 0, start_idx)
imports = "<!-- Supabase Client Library -->\n  <script src=\"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2\"></script>\n  <script src=\"js/supabase-config.js\"></script>\n  "
content = content[:script_tag_idx] + imports + content[script_tag_idx:start_idx] + new_script + content[end_idx:]

with open("profile.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated profile")