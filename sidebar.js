(function () {
  /* ── Detect root path relative to current page ── */
  const parts = window.location.pathname.split('/').filter(p => p && !/\.[a-z]+$/i.test(p));
  const repoIdx = parts.indexOf('tech-wiki');
  const depth   = repoIdx >= 0 ? parts.length - repoIdx - 1 : 0;
  const R       = depth > 0 ? Array(depth).fill('..').join('/') + '/' : './';

  /* ── Inject CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    :root { --twiki-w: 240px; }
    body  { margin-left: var(--twiki-w) !important; }

    .twiki-sidebar {
      position: fixed;
      top: 0; left: 0;
      width: var(--twiki-w);
      height: 100vh;
      background: #0b0f1a;
      border-right: 1px solid #1a2540;
      display: flex;
      flex-direction: column;
      z-index: 9999;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Noto Sans TC', sans-serif;
    }

    .twiki-logo {
      padding: 24px 20px 20px;
      border-bottom: 1px solid #1a2540;
      text-decoration: none;
      display: block;
    }
    .twiki-logo-title {
      font-size: 1rem;
      font-weight: 700;
      color: #eef4ff;
      letter-spacing: -0.3px;
    }
    .twiki-logo-sub {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: #4e6a88;
      margin-top: 3px;
    }

    .twiki-nav { flex: 1; padding: 20px 12px; }

    .twiki-nav-section { margin-bottom: 24px; }

    .twiki-nav-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #4e6a88;
      padding: 0 8px;
      margin-bottom: 6px;
      display: block;
    }

    .twiki-nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 8px;
      border-radius: 6px;
      text-decoration: none;
      color: #4e6a88;
      font-size: 0.85rem;
      transition: background .15s, color .15s;
      margin-bottom: 2px;
    }
    .twiki-nav-link:hover,
    .twiki-nav-link.twiki-active {
      background: rgba(56,189,248,.07);
      color: #38bdf8;
    }
    .twiki-nav-icon { font-size: 0.95rem; width: 18px; text-align: center; flex-shrink: 0; }

    .twiki-footer {
      padding: 16px 20px;
      border-top: 1px solid #1a2540;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: #4e6a88;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .twiki-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #2dd4bf;
      animation: twikiPulse 2s ease-in-out infinite;
    }
    @keyframes twikiPulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: .4; }
    }

    /* Mobile */
    .twiki-menu-btn {
      display: none;
      position: fixed;
      top: 14px; left: 14px;
      z-index: 10000;
      background: #0d1220;
      border: 1px solid #1a2540;
      border-radius: 8px;
      width: 36px; height: 36px;
      align-items: center; justify-content: center;
      cursor: pointer;
      color: #cdd9f0;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      body { margin-left: 0 !important; }
      .twiki-sidebar {
        transform: translateX(-100%);
        transition: transform .25s ease;
      }
      .twiki-sidebar.twiki-open { transform: translateX(0); }
      .twiki-menu-btn { display: flex; }
    }
  `;
  document.head.appendChild(style);

  /* ── Inject HTML ── */
  const sidebar = document.createElement('aside');
  sidebar.className = 'twiki-sidebar';
  sidebar.id = 'twikiSidebar';
  sidebar.innerHTML = `
    <a class="twiki-logo" href="${R}">
      <div class="twiki-logo-title">Tech Wiki</div>
      <div class="twiki-logo-sub">CrannyChen · Personal KB</div>
    </a>
    <nav class="twiki-nav">
      <div class="twiki-nav-section">
        <span class="twiki-nav-label">導覽</span>
        <a class="twiki-nav-link" href="${R}">
          <span class="twiki-nav-icon">🏠</span> HOME
        </a>
      </div>
      <div class="twiki-nav-section">
        <span class="twiki-nav-label">Roadmaps</span>
        <a class="twiki-nav-link" href="${R}ai-engineer-roadmap/">
          <span class="twiki-nav-icon">🤖</span> AI Engineer
        </a>
        <a class="twiki-nav-link" href="${R}backend-architect-roadmap/">
          <span class="twiki-nav-icon">🏗️</span> 後端架構師
        </a>
      </div>
      <div class="twiki-nav-section">
        <span class="twiki-nav-label">Linux</span>
        <a class="twiki-nav-link" href="${R}linux/part1.html">
          <span class="twiki-nav-icon">🐧</span> 基礎指令 Part 1
        </a>
        <a class="twiki-nav-link" href="${R}linux/part2.html">
          <span class="twiki-nav-icon">⚙️</span> 環境建置 Part 2
        </a>
      </div>
      <div class="twiki-nav-section">
        <span class="twiki-nav-label">Network / Security</span>
        <a class="twiki-nav-link" href="${R}ssl/">
          <span class="twiki-nav-icon">🔒</span> HTTPS 憑證鏈
        </a>
      </div>
    </nav>
    <div class="twiki-footer">
      <span class="twiki-dot"></span> 持續更新中
    </div>
  `;
  document.body.insertBefore(sidebar, document.body.firstChild);

  /* ── Hamburger button ── */
  const btn = document.createElement('button');
  btn.className = 'twiki-menu-btn';
  btn.setAttribute('aria-label', '選單');
  btn.textContent = '☰';
  btn.addEventListener('click', () => sidebar.classList.toggle('twiki-open'));
  document.body.insertBefore(btn, document.body.firstChild);

  /* ── Highlight active link ── */
  const current = window.location.pathname;
  sidebar.querySelectorAll('.twiki-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const abs = new URL(href, window.location.href).pathname;
    if (current === abs || current.startsWith(abs) && abs !== R) {
      link.classList.add('twiki-active');
    }
  });
})();
