import React, { useEffect, useMemo, useState } from "react";
import Spline from "@splinetool/react-spline";

// Twinkling stars background (sparkling pixel-like stars)
const StarsBackground = ({ count = 90, color = "#e5e7eb" /* tailwind gray-200 */ }) => {
  const stars = useMemo(() => {
    const chars = ["✦", "✧", "⋆", "✶", "✸"]; // star variants only
    const sizes = [10, 12, 14, 16, 18];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      delay: +(Math.random() * 3).toFixed(2),
      duration: +(1.8 + Math.random() * 2.4).toFixed(2),
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
  }, [count]);

  const keyframes = `
  @keyframes twinkle { 0%,100%{opacity:.25; transform:scale(1)} 50%{opacity:1; transform:scale(1.2)} }
  `;

  return (
    <>
      <style>{keyframes}</style>
      {stars.map((s) => (
        <div
          key={s.id}
          className="pointer-events-none fixed z-0"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: s.size,
            color,
            textShadow: "0 0 6px rgba(229,231,235,.35)",
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {s.char}
        </div>
      ))}
    </>
  );
};

export const Frame = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [openArticle, setOpenArticle] = useState(null); // for viewing full article
  const isHome = currentPage === "home";
  const homeBgStyle = undefined; // home is now plain white

  // Articles state (prefilled + localStorage additions)
  const initialArticles = useMemo(() => ([
    {
      id: "a1",
      title: "The Art of Clean Code",
      excerpt: "Principles and patterns that make code readable and maintainable.",
      content: `Writing clean code is less about strict rules and more about empathy for the next human reading your work.\n\nStart with small functions that do one thing well. Favor meaningful names over clever tricks. Add comments when intent isn’t obvious, but let the code tell most of the story.\n\nPatterns help — but only when they reduce complexity. Test what you write. Refactor fearlessly. And remember: simple is sustainable.`,
      tag: "Best Practices",
      date: "Aug 5, 2025",
      imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop", // keyboard + code
    },
    {
      id: "a2",
      title: "AI and the Future",
      excerpt: "How AI is reshaping our digital landscape and creative work.",
      content: `AI won’t replace your curiosity — it will amplify it. The best outcomes come from humans who ask better questions, frame better prompts, and iterate with taste.\n\nFrom copilots to creative tools, we’re learning new ways to collaborate with models. The future is a studio where code, art, and systems thinking meet.`,
      tag: "AI/ML",
      date: "Jul 28, 2025",
      imageUrl: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop", // motherboard
    },
    {
      id: "a3",
      title: "React Best Practices",
      excerpt: "Modern patterns for fast, resilient, and accessible UI.",
      content: `Colocate state. Keep components focused. Derive UI from data.\n\nReach for custom hooks to isolate effects and caching. Prefer composition over inheritance. Use Suspense, lazy, and memoization when they make things clearer — not just faster.\n\nShip small, test often, and watch your UX shine.`,
      tag: "Frontend",
      date: "Jul 15, 2025",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop", // laptop on desk
    },
    {
      id: "a4",
      title: "Terminal Mastery",
      excerpt: "Advanced command-line techniques for power users.",
      content: `The shell is where ideas move at the speed of thought.\n\nLearn fuzzy-finding, ripgrep, zsh aliases, and scripts that automate the boring bits. A tidy dotfiles repo is a gift to your future self.`,
      tag: "CLI",
      date: "Jul 2, 2025",
      imageUrl: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1600&auto=format&fit=crop", // terminal
    },
  ]), []);

  const [articles, setArticles] = useState(initialArticles);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("girlsin_articles") || "[]");
      if (Array.isArray(saved) && saved.length) {
        const normalized = saved.map((a, idx) => ({ id: a.id || `u-${Date.now()}-${idx}` , ...a }));
        setArticles((prev) => [...normalized, ...prev]);
      }
    } catch {}
  }, []);

  const persistArticles = (next) => {
    setArticles(next);
    try {
      const userSaved = JSON.parse(localStorage.getItem("girlsin_articles") || "[]");
      // Only persist user-created first to keep deterministic ordering on reload
      const builtInIds = new Set(initialArticles.map((a) => a.id));
      const onlyUser = next.filter((a) => !builtInIds.has(a.id));
      localStorage.setItem("girlsin_articles", JSON.stringify(onlyUser));
    } catch {}
  };

  const removeArticle = (id) => {
    persistArticles(articles.filter((a) => a.id !== id));
    if (openArticle?.id === id) setOpenArticle(null);
  };

  // Layout proportions (professional defaults):
  // - max content width: 80rem (max-w-7xl)
  // - section vertical rhythm: 3rem mobile, 5rem+ desktop
  // - hero min height ~ 70-80vh for strong first impression
  // - responsive type scale: base=16, h1 3xl→7xl, body lg/xl for hero lead

  const Nav = () => (
    <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur border border-black/10">
      {[
        { name: "Home", key: "home" },
        { name: "Articles", key: "articles" },
        { name: "About", key: "about" },
      ].map((item) => (
        <button
          key={item.key}
          onClick={() => setCurrentPage(item.key)}
          className={`px-5 py-2 rounded-full text-sm md:text-base transition-all duration-300 focus:outline-none ${currentPage === item.key ? 'bg-black text-white shadow-sm' : 'text-black/80 hover:bg-black/10'}`}
        >
          {item.name}
        </button>
      ))}
    </nav>
  );

  // Chess tiles side strips: mosaic blocks that flip to vibrant colors on hover
  const ChessTiles = ({ side = "left", size = 72, cols = 3, gap = 8, rows = 120 }) => {
    const tiles = useMemo(() => {
      const list = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const pastel = `hsl(${(idx * 29) % 360} 80% 90%)`;
          const vibrant = `hsl(${(idx * 53) % 360} 85% 55%)`;
          const isWhite = (r + c) % 2 === 0;
          // Random spans to create building-block mosaic
          const spanCol = Math.random() < 0.28 ? 2 : 1;
          const spanRow = Math.random() < 0.22 ? 2 : 1;
          list.push({ key: idx, front: isWhite ? '#ffffff' : pastel, back: vibrant, spanCol, spanRow });
        }
      }
      return list;
    }, [rows, cols]);

    return (
      <div className={`hidden lg:block fixed inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'} z-0 pointer-events-none`} aria-hidden>
        <div
          className="h-full w-full px-3 opacity-90"
          style={{
            perspective: 900,
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${size}px)`,
            gridAutoRows: `${size}px`,
            gridAutoFlow: 'dense',
            gap,
            alignContent: 'start',
            width: cols * (size + gap) + 24,
            paddingTop: 12,
          }}
        >
          {tiles.map((t) => (
            <div
              key={t.key}
              className="group relative [transform-style:preserve-3d] transition-transform duration-500 hover:[transform:rotateY(180deg)] rounded-md shadow-sm"
              style={{ gridColumnEnd: `span ${t.spanCol}`, gridRowEnd: `span ${t.spanRow}` }}
            >
              <div className="absolute inset-0 rounded-md [backface-visibility:hidden] border border-gray-200" style={{ background: t.front }} />
              <div className="absolute inset-0 rounded-md [transform:rotateY(180deg)] [backface-visibility:hidden] border border-gray-200" style={{ background: t.back }} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tetris-like falling blocks sidebar with subtle glitter
  const TetrisSidebar = ({ side = 'left', cell = 20, cols = 10, spawnEveryMs = 2200 }) => {
    const canvasRef = React.useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let raf = 0;
      let last = performance.now();
      let width = cols * cell + 24; // a bit of padding
      let height = window.innerHeight;
      let rows = Math.ceil(height / cell) + 6;
      let running = true;
      let spawnTimer = 0;
  // Physics in cells/second for stable & readable motion
  const GRAVITY = 1.2; // cells / s^2
  const MAX_V = 2.2;   // cells / s (terminal)
      const maxPileRows = Math.max(10, Math.floor(rows * 0.6));

      const palette = Array.from({ length: 16 }, (_, i) => `hsl(${(i * 30) % 360} 85% 60%)`);

      const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

      // Seed a small base so it feels like blocks stacked already
      for (let r = rows - 1; r > rows - 1 - Math.min(6, rows - 1); r--) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < 0.25) grid[r][c] = palette[(r + c) % palette.length];
        }
      }

  let piece = null; // { x, y, w, h, vy, color } y in cells

      const glitter = Array.from({ length: 40 }, () => ({
        x: Math.random() * (cols * cell),
        y: Math.random() * height,
        a: Math.random() * 0.6 + 0.2,
        s: Math.random() * 0.6 + 0.4,
        t: Math.random() * 2000,
      }));

      function resize() {
        height = window.innerHeight;
        rows = Math.ceil(height / cell) + 6;
        canvas.width = width;
        canvas.height = height;
      }
      resize();
      window.addEventListener('resize', resize);

      function spawnPiece() {
        if (piece) return;
        const w = 1 + Math.floor(Math.random() * 3); // 1..3
        const h = 1 + (Math.random() < 0.4 ? 1 : 0); // 1 or 2
        const x = Math.floor(Math.random() * Math.max(1, cols - w));
        const color = palette[Math.floor(Math.random() * palette.length)];
        piece = { x, y: -h, w, h, vy: 0, color };
      }

      function collidesAt(py, p) {
        const belowRow = Math.floor(py + p.h - 1e-6); // the row the bottom edge is in
        if (belowRow + 1 >= rows) return true; // would touch the floor next
        const checkRow = belowRow + 1;
        for (let xx = p.x; xx < p.x + p.w; xx++) {
          if (checkRow >= 0 && checkRow < rows && xx >= 0 && xx < cols && grid[checkRow][xx]) return true;
        }
        return false;
      }

      function settle(p, collidedRow = null) {
        // Place piece just above the collision row (or floor)
        let baseY;
        if (collidedRow != null) baseY = Math.max(0, Math.min(rows - p.h, collidedRow - p.h + 1));
        else baseY = Math.min(rows - p.h, Math.floor(p.y));
        for (let yy = 0; yy < p.h; yy++) {
          for (let xx = 0; xx < p.w; xx++) {
            const gy = baseY + yy;
            const gx = p.x + xx;
            if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) grid[gy][gx] = p.color;
          }
        }
        piece = null;
      }

      function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Blocks
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const color = grid[r][c];
            if (!color) continue;
            const x = c * cell + 8; // side padding
            const y = r * cell;
            ctx.fillStyle = color;
            ctx.strokeStyle = 'rgba(0,0,0,0.08)';
            ctx.lineWidth = 1;
            const pad = 2;
            ctx.beginPath();
            ctx.roundRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2, 4);
            ctx.fill();
            ctx.stroke();
          }
        }
        // Falling piece
        if (piece) {
          ctx.fillStyle = piece.color;
          for (let yy = 0; yy < piece.h; yy++) {
            for (let xx = 0; xx < piece.w; xx++) {
              const x = (piece.x + xx) * cell + 8;
              const y = (piece.y + yy) * cell;
              ctx.beginPath();
              ctx.roundRect(x + 2, y + 2, cell - 4, cell - 4, 4);
              ctx.fill();
            }
          }
        }
        // Glitter
        glitter.forEach((g) => {
          g.t += 16;
          const alpha = 0.2 + 0.4 * Math.abs(Math.sin(g.t * 0.003));
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(8 + g.x, g.y, 2, 2);
          ctx.globalAlpha = 1;
        });
      }

      function step(now) {
        const dt = Math.min(32, now - last); // clamp dt for stability
        last = now;
        spawnTimer += dt;
        if (spawnTimer > spawnEveryMs) {
          spawnTimer = 0;
          // Keep pile height in check
          let pile = 0;
          for (let r = rows - 1; r >= 0; r--) {
            if (grid[r].some(Boolean)) { pile = rows - r; break; }
          }
          if (pile < maxPileRows) spawnPiece();
        }

        if (piece) {
          const dtSec = dt / 1000;
          piece.vy = Math.min(MAX_V, piece.vy + GRAVITY * dtSec);
          const nextY = piece.y + piece.vy * dtSec;
          if (collidesAt(nextY, piece)) {
            const collidedRow = Math.floor(nextY + piece.h - 1e-6);
            settle(piece, collidedRow);
          } else {
            piece.y = nextY;
          }
        }

        drawGrid();
        if (running) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);

      return () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
      };
    }, [cell, cols, spawnEveryMs]);

    return (
      <div className={`hidden lg:block fixed inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'} z-0 pointer-events-none`} aria-hidden>
        <canvas ref={canvasRef} style={{ width: cols * cell + 24, height: '100%' }} />
      </div>
    );
  };

  // Small scattered stars used on Home; base shows black, overlay shows white
  const StarsScatter = ({ color = '#111', count = 70, z = 0, className = '' }) => {
    const stars = useMemo(() => {
      const chars = ['✦','✧','⋆','✶','✸'];
      const sizes = [10,12,14,16,18];
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        char: chars[Math.floor(Math.random()*chars.length)],
        size: sizes[Math.floor(Math.random()*sizes.length)],
        delay: +(Math.random()*3).toFixed(2),
        dur: +(1.6 + Math.random()*2.2).toFixed(2),
      }));
    }, [count]);
    const keyframes = `@keyframes tw ${'{'}0%,100%{opacity:.35; transform:scale(1)}50%{opacity:1; transform:scale(1.15)}${'}'}`;
    return (
      <>
        <style>{keyframes}</style>
        <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: z }}>
          {stars.map(s => (
            <div key={s.id} className="fixed" style={{ left: `${s.left}%`, top: `${s.top}%`, color, fontSize: s.size, animation: `tw ${s.dur}s ease-in-out ${s.delay}s infinite` }}>{s.char}</div>
          ))}
        </div>
      </>
    );
  };

  // White home hero with cursor-trail reveal overlay
  const Hero = () => {
    const [trail, setTrail] = useState([]); // [{x,y,r}]
    const onMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const p = { x: e.clientX - rect.left, y: e.clientY - rect.top, r: 90 };
      setTrail((prev) => [...prev.slice(-10), p]);
    };
    const onDown = () => setTrail((prev) => prev.map(p => ({ ...p, r: 140 })));
    const onUp = () => setTrail((prev) => prev.map(p => ({ ...p, r: 90 })));
    const onLeave = () => setTrail([]);
    const mask = trail.length
      ? trail.map(p => `radial-gradient(circle ${p.r}px at ${p.x}px ${p.y}px, #000 99%, transparent 100%)`).join(',')
      : 'radial-gradient(circle 0px at -9999px -9999px, #000 0, transparent 1px)';
    return (
      <section className="relative overflow-hidden">
        {/* Base white layer */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20 pb-10 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-sm tracking-widest uppercase text-gray-600">A tech blog by Girlsin</p>
              <h1 className="leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl text-gray-900 mt-2" style={{ fontFamily: "'Inria Serif', serif" }}>
                Experiments, lessons, and stories from our journey in code.
              </h1>
              <p className="mt-5 text-base sm:text-lg lg:text-xl text-gray-700 max-w-prose">
                Read reflections, guides, and creative coding notes. Move your cursor on this page to reveal a hidden layer.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage("articles")}
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 text-white h-11 px-6 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Explore Articles
                </button>
              </div>
            </div>
            {/* 3D — ensure whole body visible */}
            <div className="order-1 lg:order-2">
              <div className="relative h-[480px] sm:h-[520px] lg:h-[560px] w-full rounded-3xl border border-gray-200 bg-white overflow-hidden">
                <Spline scene="https://prod.spline.design/MJEhCESng0eyvSbp/scene.splinecode" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* base scattered black stars */}
        <StarsScatter color="#111" count={60} z={1} />

        {/* Dark overlay revealed by radial cursor mask */}
        <div
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onMouseDown={onDown}
          onMouseUp={onUp}
          className="absolute inset-0" aria-hidden
          style={{ WebkitMaskImage: mask, maskImage: mask }}
        >
          <div className="absolute inset-0 bg-black text-white">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(white_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20 pb-10 lg:pb-16">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                <div className="order-2 lg:order-1">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">Behind the UI</h2>
                  <p className="mt-4 text-white/80 max-w-prose">Notes on systems, tools, and the humans who build them.</p>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="h-[480px] sm:h-[520px] lg:h-[560px] w-full rounded-3xl border border-white/15 bg-gradient-to-br from-gray-900 to-black" />
                </div>
              </div>
            </div>
            {/* overlay white stars */}
            <StarsScatter color="#fff" count={60} z={2} />
          </div>
        </div>
      </section>
    );
  };

  const Articles = () => (
    <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
  {/* Binary ribbon background */}
  <BinaryRibbon />
      {/* Subtle scattered stars behind content */}
      <StarsScatter color="#111" count={50} z={-5} className="opacity-30" />
      {/* Heading like the screenshot */}
      <div className="mb-6 lg:mb-8">
        <div className="text-black text-3xl sm:text-4xl lg:text-5xl leading-snug">
          <span style={{ fontFamily: "jsMath-cmti10, 'Inria Serif', serif" }} className="italic">Exploring</span>
          <span className="mx-2" style={{ fontFamily: "'Inria Serif', serif" }}>the</span>
          <span
            style={{ fontFamily: "Monofett, cursive" }}
            className="align-middle inline-block bg-black text-white rounded-full px-3 sm:px-4 py-1 text-2xl sm:text-3xl lg:text-4xl tracking-wider"
          >
            TECH WORLD
          </span>
          <span style={{ fontFamily: "'Inria Serif', serif" }}>,</span>
        </div>
        <div className="mt-2 text-black text-2xl sm:text-3xl lg:text-4xl" style={{ fontFamily: "'Inria Serif', serif" }}>
          One <span style={{ fontFamily: "'Micro 5', monospace" }}>Byte</span> at a Time
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-end">
        <button
          onClick={() => setCurrentPage('create')}
          className="inline-flex items-center gap-2 rounded-full bg-black text-white px-5 py-2 text-sm font-medium hover:bg-black/90"
        >
          ✎ Write now
        </button>
      </div>

  {/* Article grid */}
  <div className="relative z-10 grid md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
        {articles.map((card) => (
          <article key={card.id || card.title}
            className="group relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <button
              title="Delete"
              onClick={() => removeArticle(card.id)}
              className="absolute top-2 right-2 z-10 rounded-full bg-white/90 border border-gray-200 p-1 text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M9 3.75A2.25 2.25 0 0 1 11.25 1.5h1.5A2.25 2.25 0 0 1 15 3.75V4.5h3.75a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1 0-1.5H9V3.75zM6.75 7.5h10.5l-.64 10.27a2.25 2.25 0 0 1-2.24 2.1H9.62a2.25 2.25 0 0 1-2.24-2.1L6.75 7.5z" />
              </svg>
            </button>
            {card.imageUrl ? (
              <img src={card.imageUrl} alt="cover" className="h-40 sm:h-44 w-full object-cover" />
            ) : (
              <div className="h-40 sm:h-44 w-full bg-gradient-to-br from-gray-200 to-gray-300" />)
            }
            <div className="p-4 sm:p-5 text-black">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-600">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">{card.tag}</span>
                <span>•</span>
                <time>{card.date}</time>
              </div>
              <h3 className="mt-1.5 text-lg sm:text-xl font-semibold leading-snug">{card.title}</h3>
              <p className="mt-1.5 text-gray-700 text-sm leading-relaxed line-clamp-3">{card.excerpt}</p>
              <div className="mt-3 flex items-center justify-between">
                <button onClick={() => setOpenArticle(card)} className="text-sm font-medium text-gray-900 hover:underline">
                  Read more →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

  {/* Tetris-like falling blocks sidebars (kept behind content) */}
  <TetrisSidebar side="left" />
  <TetrisSidebar side="right" />
    </section>
  );

  const About = () => {
    const authors = [
      { id: 1, name: "Kiki", role: "Author • Frontend", blurb: "Loves pixel-perfect UI and tasty APIs.", color: "bg-pink-100 text-pink-900" },
      { id: 2, name: "Ria", role: "Author • AI", blurb: "Prompts, models, and mindful ML.", color: "bg-violet-100 text-violet-900" },
      { id: 3, name: "Jo", role: "Coder • Backend", blurb: "Rust, Postgres, and clean systems.", color: "bg-blue-100 text-blue-900" },
      { id: 4, name: "Mei", role: "Designer • Docs", blurb: "Turns chaos into clarity.", color: "bg-amber-100 text-amber-900" },
    ];
    const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

    return (
      <section className="relative px-0">
        {/* Graph paper background wrapper */}
        <div className="relative mx-auto max-w-[110rem]" style={{
          backgroundColor: '#fafaf9',
          backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '28px 28px, 28px 28px',
        }}>
          {/* Hero card */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            <div className="relative rounded-[32px] bg-white border border-gray-200 shadow-xl p-8 sm:p-10">
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Give our ideas a glow up ✨</h2>
              <p className="mt-3 text-black/70 text-lg max-w-2xl">We’re girlies exploring and tinkering in the tech world — capturing what we learn, what we break, and everything in between.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['Design notes', 'Weekend hacks', 'Bug diaries', 'Study logs'].map((pill) => (
                  <span key={pill} className="px-3 py-1 rounded-full border border-gray-300 bg-white shadow-sm text-sm">{pill}</span>
                ))}
              </div>

              {/* Sticker cards */}
              <div className="pointer-events-none select-none">
                <div className="hidden md:block absolute -top-8 -left-6 rotate-[-5deg] w-40 sm:w-48 rounded-2xl border-2 border-black/10 bg-amber-50 shadow-2xl p-3">
                  <div className="text-xs font-semibold">Book Club</div>
                  <div className="mt-2 h-20 rounded-lg bg-gradient-to-br from-amber-200 to-pink-200" />
                </div>
                <div className="hidden md:block absolute -top-10 right-8 rotate-6 w-44 sm:w-52 rounded-2xl border-2 border-black/10 bg-lime-50 shadow-2xl p-3">
                  <div className="text-xs font-semibold">Let it Flow</div>
                  <div className="mt-2 h-20 rounded-lg bg-gradient-to-br from-lime-200 to-emerald-200" />
                </div>
                <div className="hidden md:block absolute -bottom-10 left-16 rotate-3 w-44 sm:w-52 rounded-2xl border-2 border-black/10 bg-sky-50 shadow-2xl p-3">
                  <div className="text-xs font-semibold">Makers Gallery</div>
                  <div className="mt-2 h-20 rounded-lg bg-gradient-to-br from-sky-200 to-indigo-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Authors & Coders */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">Authors & Coders</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {authors.map((a) => (
                <div key={a.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
                  <div className={`w-12 h-12 rounded-full grid place-items-center font-semibold ${a.color}`}>{initials(a.name)}</div>
                  <div className="mt-2 font-semibold">{a.name}</div>
                  <div className="text-sm text-gray-600">{a.role}</div>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">{a.blurb}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Thank you section */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
            <div className="rounded-[24px] border border-gray-200 bg-gradient-to-br from-fuchsia-50 via-rose-50 to-amber-50 p-6 sm:p-8 shadow-lg">
              <h3 className="text-2xl font-semibold">Thank you for being here 💜</h3>
              <p className="mt-1 text-black/80">If something sparked your curiosity, say hi — or write with us.</p>
              <button onClick={() => setCurrentPage('create')} className="mt-4 rounded-full bg-black text-white px-5 py-2 text-sm font-medium">Start a story</button>
            </div>
          </div>
        </div>

        {/* Tetris sidebars */}
        <TetrisSidebar side="left" />
        <TetrisSidebar side="right" />
      </section>
    );
  };

  // Subtle diagonal binary ribbon animation for Articles background
  function BinaryRain({ columns = 14 }) {
    const items = useMemo(() => Array.from({ length: columns }, (_, i) => ({
      id: i,
      left: (i / columns) * 100,
      dur: 8 + Math.random() * 10,
      delay: Math.random() * 6,
      font: 12 + Math.floor(Math.random() * 8),
      color: `hsl(${(i * 29) % 360} 70% 40%)`
    })), [columns]);
    const keyframes = `@keyframes bin ${'{'}0%{transform:translateY(-110%)}100%{transform:translateY(120%)}${'}'}`;
    return (
      <>
        <style>{keyframes}</style>
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
          {items.map((band) => (
            <div
              key={band.id}
              className="absolute"
              style={{
                top: `${10 + (band.id * (80 / items.length))}%`,
                left: '-20%',
                width: '140%',
                transform: 'rotate(-18deg)',
                animation: `bin ${12 + Math.random() * 8}s linear ${band.delay}s infinite alternate`,
                WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)',
                maskImage: 'linear-gradient(90deg, transparent 0%, black 15%, black 85%, transparent 100%)',
              }}
            >
              <div
                className="whitespace-nowrap font-mono"
                style={{
                  letterSpacing: '0.18em',
                  fontSize: band.font,
                  color: band.color,
                  opacity: 0.25,
                  textShadow: '0 0 6px rgba(0,0,0,0.08)'
                }}
              >
                {Array.from({ length: 150 })
                  .map(() => (Math.random() > 0.5 ? '1' : '0'))
                  .join(' ')}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // Alias for new effect
  const BinaryRibbon = BinaryRain;

  const WriteArticle = () => {
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [content, setContent] = useState("");

    const submit = (e) => {
      e.preventDefault();
      const now = new Date();
      const article = {
        id: `u-${now.getTime()}`,
        title: title.trim() || "Untitled Story",
        tag: tag.trim() || "Story",
        imageUrl: imageUrl.trim(),
        content: content,
        excerpt: (content || "").slice(0, 160) + (content.length > 160 ? "…" : ""),
        date: now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      persistArticles([article, ...articles]);
      setCurrentPage('articles');
    };

    return (
      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">Write a story</h2>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="Your title" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tag</label>
              <input value={tag} onChange={(e)=>setTag(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="e.g. Design, AI" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cover Image URL (optional)</label>
              <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="https://…" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Story</label>
            <textarea value={content} onChange={(e)=>setContent(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-[180px]" placeholder="Start writing…" />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="rounded-full bg-black text-white px-5 py-2 text-sm font-medium">Publish</button>
            <button type="button" className="rounded-full bg-gray-200 text-black px-4 py-2 text-sm" onClick={()=>setCurrentPage('articles')}>Cancel</button>
          </div>
        </form>
      </section>
    );
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden bg-white text-black`} style={homeBgStyle}>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur border-b border-black/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
          <div className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight">Girlsin</div>
          <Nav />
          <div className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-black/5 border border-black/10`}>
            <svg className={`w-5 h-5 text-black/70`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7 7 0 1010 17a7 7 0 006.65-10.35z" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-20">
  {currentPage === "home" && <Hero />}
  {currentPage === "articles" && <Articles />}
  {currentPage === "about" && <About />}
  {currentPage === "create" && <WriteArticle />}
      </main>

      {/* Article modal for viewing content */}
      {openArticle && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" onClick={() => setOpenArticle(null)}>
          <div className="relative w-full max-w-3xl bg-white text-black rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenArticle(null)} className="absolute top-3 right-3 rounded-full bg-black text-white w-8 h-8 grid place-items-center">×</button>
            {openArticle.imageUrl ? (
              <img src={openArticle.imageUrl} alt="cover" className="h-48 w-full object-cover" />
            ) : (
              <div className="h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300" />
            )}
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-gray-600 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">{openArticle.tag}</span>
                  <span>•</span>
                  <time>{openArticle.date}</time>
                </div>
                <button onClick={() => removeArticle(openArticle.id)} className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 px-3 py-1.5 text-xs font-medium border border-red-200">Delete</button>
              </div>
              <h3 className="mt-2 text-2xl font-semibold leading-tight">{openArticle.title}</h3>
              <div className="prose prose-sm sm:prose-base max-w-none mt-3 text-gray-800">
                {(openArticle.content || openArticle.excerpt || "").split("\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-20 border-top border-black/10 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-black/60 text-sm border-t border-black/10">
          © {new Date().getFullYear()} Girlsin. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
