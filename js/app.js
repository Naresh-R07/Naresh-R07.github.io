/* ============================================
   Naresh-R07 — Complete Application
   Phases 2-7 Integrated
   ============================================ */

(function() {
  'use strict';

  // ════════════════════════════════════════
  // LOADER
  // ════════════════════════════════════════

  const loader = document.getElementById('loader');
  const progressBar = loader?.querySelector('.loader__progress');
  const statusText = loader?.querySelector('.loader__status');
  const loadMessages = [
    'INITIALIZING...',
    'LOADING MODULES...',
    'SCANNING SYSTEMS...',
    'ESTABLISHING CONNECTION...',
    'LOADING ASSETS...',
    'READY.'
  ];

  let progress = 0;
  const loadInterval = setInterval(() => {
    progress += Math.random() * 25;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      if (statusText) statusText.textContent = loadMessages[5];
      if (progressBar) progressBar.style.width = '100%';
      setTimeout(() => {
        if (loader) loader.classList.add('is-hidden');
        document.body.style.overflow = '';
        initAll();
      }, 400);
    } else {
      const idx = Math.min(Math.floor(progress / 25), loadMessages.length - 2);
      if (statusText) statusText.textContent = loadMessages[idx];
      if (progressBar) progressBar.style.width = progress + '%';
    }
  }, 200);

  // ════════════════════════════════════════
  // INIT ALL
  // ════════════════════════════════════════

  function initAll() {
    initLenis();
    initNavigation();
    initHeroAnimations();
    initCursorSpotlight();
    initScrollReveal();
    initSmoothScroll();
    initBentoGlow();
    initProjectCards();
    initCtfFilters();
    initExperienceTimeline();
    initBlogPosts();
    initGitHubDashboard();
    initCounters();
    initTerminal();
    initContactForm();
    initBackToTop();
    initMagneticButtons();
    initTiltCards();
    initFooterGame();
    initAnimeEntrance();
  }

  // ════════════════════════════════════════
  // LENIS SMOOTH SCROLL
  // ════════════════════════════════════════

  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Link Lenis scroll to Intersection Observer
    lenis.on('scroll', () => {});

    // Expose for other modules
    window.__nexusLenis = lenis;
  }

  // ════════════════════════════════════════
  // NAVIGATION
  // ════════════════════════════════════════

  function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.querySelector('.nav__toggle');
    const mobileNav = document.querySelector('.nav__mobile');
    const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link');
    const progressBar = document.querySelector('.nav__progress-bar');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (nav) nav.classList.toggle('is-scrolled', scrollY > 50);

      // Progress bar
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.width = ((scrollY / docHeight) * 100) + '%';

      // Active link
      updateActiveLink();
    }, { passive: true });

    // Mobile toggle
    if (toggle && mobileNav) {
      toggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('is-open');
        mobileNav.classList.toggle('is-open');
        toggle.classList.toggle('is-active');
        toggle.setAttribute('aria-expanded', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });
    }

    // Close mobile nav on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav) mobileNav.classList.remove('is-open');
        if (toggle) {
          toggle.classList.remove('is-active');
          toggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      });
    });

    function updateActiveLink() {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 200;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('is-active');
            }
          });
        }
      });
    }
  }

  // ════════════════════════════════════════
  // HERO ANIMATIONS (anime.js)
  // ════════════════════════════════════════

  function initHeroAnimations() {
    if (typeof anime === 'undefined') return;

    // Title character stagger
    anime.timeline({ delay: 800 })
      .add({
        targets: '.hero__badges .badge',
        opacity: [0, 1],
        translateY: [15, 0],
        delay: anime.stagger(100),
        duration: 500,
        easing: 'easeOutCubic'
      })
      .add({
        targets: '.hero__title-line',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(200),
        duration: 700,
        easing: 'easeOutCubic'
      }, '-=200')
      .add({
        targets: '.hero__subtitle',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutCubic'
      }, '-=300')
      .add({
        targets: '.hero__cta .btn',
        opacity: [0, 1],
        translateY: [15, 0],
        delay: anime.stagger(100),
        duration: 500,
        easing: 'easeOutCubic'
      }, '-=200')
      .add({
        targets: '.hero__scroll',
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutCubic'
      }, '-=100');

    // Grid parallax on scroll
    const heroGrid = document.querySelector('.hero__grid');
    if (heroGrid) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
      }, { passive: true });
    }
  }

  // ════════════════════════════════════════
  // CURSOR SPOTLIGHT
  // ════════════════════════════════════════

  function initCursorSpotlight() {
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight || window.matchMedia('(max-width: 767px)').matches) return;

    let mouseX = 0, mouseY = 0;
    let spotX = 0, spotY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      spotX += (mouseX - spotX) * 0.1;
      spotY += (mouseY - spotY) * 0.1;
      spotlight.style.transform = `translate(${spotX - 150}px, ${spotY - 150}px)`;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // ════════════════════════════════════════
  // SCROLL REVEAL
  // ════════════════════════════════════════

  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ════════════════════════════════════════
  // SMOOTH SCROLL
  // ════════════════════════════════════════

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offset = 80;
          const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
          if (window.__nexusLenis) {
            window.__nexusLenis.scrollTo(targetPos, { duration: 1.2 });
          } else {
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }
        }
      });
    });
  }

  // ════════════════════════════════════════
  // BENTO GRID GLOW
  // ════════════════════════════════════════

  function initBentoGlow() {
    document.querySelectorAll('.bento__item').forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        item.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        item.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  }

  // ════════════════════════════════════════
  // PROJECT CARDS
  // ════════════════════════════════════════

  function initProjectCards() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    fetch('data/projects.json')
      .then(r => r.json())
      .then(projects => {
        projects.forEach((project, i) => {
          const card = document.createElement('div');
          card.className = 'project-card reveal';
          card.style.transitionDelay = (i * 100) + 'ms';
          card.innerHTML = `
            <div class="project-card__image">${project.icon}</div>
            <div class="project-card__body">
              <span class="project-card__category">${project.category}</span>
              <h3 class="project-card__title">${project.title}</h3>
              <p class="project-card__desc">${project.description}</p>
              <div class="project-card__tech">
                ${project.tech.map(t => `<span class="badge">${t}</span>`).join('')}
              </div>
              <div class="project-card__links">
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn--sm">GitHub →</a>
              </div>
            </div>
          `;
          grid.appendChild(card);
        });

        // Observe new cards
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      })
      .catch(() => {
        // Fallback: render from inline data
        renderFallbackProjects(grid);
      });
  }

  function renderFallbackProjects(grid) {
    const projects = [
      { title: 'VulnzxScanX', category: 'Security Tool', description: 'Multi-interface vulnerability scanner using Nmap with CLI, Web, and GUI.', tech: ['Python', 'Flask', 'Nmap'], icon: '🔍', github: 'https://github.com/Naresh-R07/VulnzxScanX' },
      { title: 'Identity-AI', category: 'AI Security', description: 'Behavioral threat detection from authentication logs.', tech: ['Python', 'Flask', 'JS'], icon: '🛡️', github: 'https://github.com/Naresh-R07/Identity-AI' },
      { title: 'ML CTF Challenges', category: 'CTF / AI', description: 'AI/ML security CTF challenges.', tech: ['Python', 'ML', 'AI'], icon: '🤖', github: 'https://github.com/Naresh-R07/Machine_Learning_CTF_Challenges' },
      { title: 'Claude-Red', category: 'Offensive AI', description: 'Offensive security skills for Claude.', tech: ['Python', 'Claude'], icon: '⚔️', github: 'https://github.com/Naresh-R07/Claude-Red' }
    ];
    projects.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal is-visible';
      card.innerHTML = `
        <div class="project-card__image">${p.icon}</div>
        <div class="project-card__body">
          <span class="project-card__category">${p.category}</span>
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__desc">${p.description}</p>
          <div class="project-card__tech">${p.tech.map(t => `<span class="badge">${t}</span>`).join('')}</div>
          <div class="project-card__links"><a href="${p.github}" target="_blank" rel="noopener noreferrer" class="btn btn--ghost btn--sm">GitHub →</a></div>
        </div>`;
      grid.appendChild(card);
    });
  }

  // ════════════════════════════════════════
  // CTF FILTERS
  // ════════════════════════════════════════

  function initCtfFilters() {
    const filters = document.querySelectorAll('.ctf-filter');
    const grid = document.getElementById('ctf-grid');
    if (!filters.length || !grid) return;

    const ctfChallenges = [
      { title: 'Web Exploitation Lab', category: 'web', difficulty: 'Medium', desc: 'SQL injection, XSS, and CSRF challenges.' },
      { title: 'Crypto Cipher Suite', category: 'crypto', difficulty: 'Hard', desc: 'RSA, AES, and custom cipher破解.' },
      { title: 'Binary Reversing', category: 'reverse', difficulty: 'Hard', desc: 'ELF binary analysis and deobfuscation.' },
      { title: 'Memory Forensics', category: 'forensics', difficulty: 'Medium', desc: 'RAM dump analysis and artifact extraction.' },
      { title: 'Buffer Overflow 101', category: 'pwn', difficulty: 'Easy', desc: 'Stack-based buffer overflow exploitation.' },
      { title: 'LLM Prompt Injection', category: 'ai', difficulty: 'Medium', desc: 'Attacking language model input filters.' },
      { title: 'AI Model Extraction', category: 'ai', difficulty: 'Hard', desc: 'Extracting model parameters through API queries.' },
      { title: 'Steganography Decode', category: 'forensics', difficulty: 'Easy', desc: 'Hidden data in image and audio files.' }
    ];

    // Render challenges
    function renderCtf(filter) {
      grid.innerHTML = '';
      const filtered = filter === 'all' ? ctfChallenges : ctfChallenges.filter(c => c.category === filter);
      filtered.forEach((challenge, i) => {
        const card = document.createElement('div');
        card.className = 'card ctf-card';
        card.style.animationDelay = (i * 80) + 'ms';
        const diffColor = challenge.difficulty === 'Easy' ? 'var(--secondary)' : challenge.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)';
        card.innerHTML = `
          <div class="flex flex--between mb-md">
            <span class="badge badge--primary">${challenge.category.toUpperCase()}</span>
            <span class="badge" style="color:${diffColor};border-color:${diffColor}">${challenge.difficulty}</span>
          </div>
          <h4 class="mb-sm">${challenge.title}</h4>
          <p class="text-tertiary" style="font-size:0.875rem">${challenge.desc}</p>
        `;
        grid.appendChild(card);
      });
    }

    renderCtf('all');

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        renderCtf(btn.dataset.filter);
      });
    });
  }

  // ════════════════════════════════════════
  // EXPERIENCE TIMELINE (from data)
  // ════════════════════════════════════════

  function initExperienceTimeline() {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;

    fetch('data/experience.json')
      .then(r => r.json())
      .then(items => {
        timeline.innerHTML = '<div class="timeline__line" aria-hidden="true"></div>';
        items.forEach((item, i) => {
          const el = document.createElement('div');
          el.className = 'timeline__item reveal';
          el.style.transitionDelay = (i * 100) + 'ms';
          el.innerHTML = `
            <div class="timeline__marker"></div>
            <div class="timeline__card">
              <span class="timeline__date">${item.date}</span>
              <h4 class="timeline__title">${item.title}</h4>
              <p class="timeline__text">${item.description}</p>
            </div>
          `;
          timeline.appendChild(el);
        });

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        timeline.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      });
  }

  // ════════════════════════════════════════
  // BLOG POSTS (from data)
  // ════════════════════════════════════════

  function initBlogPosts() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    fetch('data/blog.json')
      .then(r => r.json())
      .then(posts => {
        posts.forEach((post, i) => {
          const card = document.createElement('div');
          card.className = 'blog-card reveal';
          card.style.transitionDelay = (i * 100) + 'ms';
          card.innerHTML = `
            <span class="blog-card__date">${post.date} · ${post.readingTime}</span>
            <h4 class="blog-card__title">${post.title}</h4>
            <p class="blog-card__excerpt">${post.excerpt}</p>
            <div class="blog-card__tags">
              ${post.tags.map(t => `<span class="badge">${t}</span>`).join('')}
            </div>
          `;
          grid.appendChild(card);
        });

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      });
  }

  // ════════════════════════════════════════
  // GITHUB DASHBOARD
  // ════════════════════════════════════════

  function initGitHubDashboard() {
    const username = 'Naresh-R07';
    const reposGrid = document.getElementById('github-repos');
    const cacheKey = 'nexus_github_';
    const oneHour = 3600000;

    // User stats
    const userCache = localStorage.getItem(cacheKey + 'user');
    const userTime = localStorage.getItem(cacheKey + 'user_time');

    if (userCache && userTime && Date.now() - userTime < oneHour) {
      renderUserStats(JSON.parse(userCache));
    } else {
      fetch(`https://api.github.com/users/${username}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
          localStorage.setItem(cacheKey + 'user', JSON.stringify(data));
          localStorage.setItem(cacheKey + 'user_time', Date.now());
          renderUserStats(data);
        })
        .catch(() => renderUserStats({ public_repos: 15, stargazers_count: 0, followers: 1 }));
    }

    // Repos
    if (reposGrid) {
      const reposCache = localStorage.getItem(cacheKey + 'repos');
      const reposTime = localStorage.getItem(cacheKey + 'repos_time');

      if (reposCache && reposTime && Date.now() - reposTime < oneHour) {
        renderRepos(JSON.parse(reposCache));
      } else {
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=8`)
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(data => {
            localStorage.setItem(cacheKey + 'repos', JSON.stringify(data));
            localStorage.setItem(cacheKey + 'repos_time', Date.now());
            renderRepos(data);
          })
          .catch(() => renderRepos([]));
      }
    }
  }

  function renderUserStats(data) {
    const repos = document.getElementById('stat-repos');
    const stars = document.getElementById('stat-stars');
    const followers = document.getElementById('stat-followers');
    if (repos) repos.textContent = data.public_repos || 15;
    if (stars) stars.textContent = data.stargazers_count || 0;
    if (followers) followers.textContent = data.followers || 1;
  }

  function renderRepos(repos) {
    const grid = document.getElementById('github-repos');
    if (!grid) return;

    if (!repos.length) {
      grid.innerHTML = '<p class="text-tertiary text-center">Unable to load repositories.</p>';
      return;
    }

    grid.innerHTML = '';
    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'repo-card';
      card.innerHTML = `
        <h4 class="repo-card__name">${repo.name}</h4>
        <p class="repo-card__desc">${repo.description || 'No description'}</p>
        <div class="repo-card__meta">
          ${repo.language ? `<span>● ${repo.language}</span>` : ''}
          ${repo.stargazers_count ? `<span>★ ${repo.stargazers_count}</span>` : ''}
          <span>${repo.forks_count || 0} forks</span>
        </div>
      `;
      card.addEventListener('click', () => window.open(repo.html_url, '_blank'));
      card.style.cursor = 'pointer';
      grid.appendChild(card);
    });
  }

  // ════════════════════════════════════════
  // COUNTERS
  // ════════════════════════════════════════

  function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ════════════════════════════════════════
  // TERMINAL (Easter Egg)
  // ════════════════════════════════════════

  function initTerminal() {
    const terminal = document.getElementById('terminal');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const closeBtn = document.getElementById('terminal-close');
    let isOpen = false;

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        toggleTerminal();
      }
      if (e.key === 'Escape' && isOpen) toggleTerminal();
    });

    if (closeBtn) closeBtn.addEventListener('click', toggleTerminal);

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          processCommand(input.value.trim());
          input.value = '';
        }
      });
    }

    function toggleTerminal() {
      if (!terminal) return;
      isOpen = !isOpen;
      terminal.classList.toggle('is-open', isOpen);
      terminal.setAttribute('aria-hidden', !isOpen);
      if (isOpen && input) {
        input.focus();
        if (!output.innerHTML) {
          printLine('Naresh-R07 Terminal v1.0', 'system');
          printLine('Type "help" for available commands.\n', 'system');
        }
      }
    }

    function printLine(text, className = '') {
      if (!output) return;
      const line = document.createElement('div');
      line.className = 'terminal__output-line' + (className ? ' terminal__output-line--' + className : '');
      line.textContent = text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }

    function processCommand(cmd) {
      printLine('> ' + cmd, 'accent');
      const commands = {
        help: () => {
          printLine('Available commands:', 'success');
          printLine('  about      — About me');
          printLine('  skills     — Technical arsenal');
          printLine('  projects   — Featured projects');
          printLine('  github     — GitHub profile');
          printLine('  contact    — Contact info');
          printLine('  clear      — Clear terminal');
          printLine('  whoami     — Who is this?');
        },
        about: () => { printLine('NARESH RAJJ S', 'success'); printLine('AI Security Researcher | Red Team Specialist | SOC Analyst'); printLine('Mission: Build • Break • Secure'); },
        skills: () => { printLine('Technical Arsenal:', 'success'); printLine('  Python, C, C++, Java, JavaScript, Bash'); printLine('  Web Security, Reverse Engineering, Cryptography'); printLine('  Burp Suite, Nmap, Nuclei, Metasploit, Wireshark'); printLine('  Claude API, OpenAI, LangChain, MCP, AI Agents'); },
        projects: () => { printLine('Featured Projects:', 'success'); printLine('  1. VulnzxScanX — Vulnerability Scanner'); printLine('  2. Identity-AI — Behavioral Threat Detection'); printLine('  3. ML CTF Challenges — AI/ML Security'); printLine('  4. Claude-Red — Offensive Security Skills'); },
        github: () => printLine('GitHub: https://github.com/Naresh-R07', 'accent'),
        contact: () => { printLine('Contact:', 'success'); printLine('  GitHub:  github.com/Naresh-R07'); printLine('  LinkedIn: naresh-rajj-s-526564327'); },
        whoami: () => { printLine('nexus@research:~$ NARESH RAJJ S', 'success'); printLine('AI Security Researcher | Red Team | SOC'); },
        clear: () => { if (output) output.innerHTML = ''; }
      };
      if (cmd === '') return;
      if (commands[cmd]) {
        commands[cmd]();
      } else {
        printLine('Command not found: ' + cmd, 'error');
        printLine('Type "help" for available commands.', 'system');
      }
    }
  }

  // ════════════════════════════════════════
  // CONTACT FORM
  // ════════════════════════════════════════

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot check
      const honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) return;

      const name = form.querySelector('#name')?.value;
      const email = form.querySelector('#email')?.value;
      const subject = form.querySelector('#subject')?.value;
      const message = form.querySelector('#message')?.value;

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Try EmailJS first, fallback to mailto
      const mailtoLink = `mailto:naresh@example.com?subject=${encodeURIComponent(subject || 'Portfolio Contact from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
      window.location.href = mailtoLink;
      showToast('Opening email client...', 'success');
      form.reset();
    });
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      padding: 12px 24px; border-radius: 8px; font-size: 0.875rem;
      background: ${type === 'error' ? 'var(--danger)' : 'var(--secondary)'};
      color: var(--bg-primary); font-weight: 600; z-index: 9999;
      animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ════════════════════════════════════════
  // BACK TO TOP
  // ════════════════════════════════════════

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (btn) {
      btn.addEventListener('click', () => {
        if (window.__nexusLenis) {
          window.__nexusLenis.scrollTo(0, { duration: 1.5 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  // ════════════════════════════════════════
  // MAGNETIC BUTTONS
  // ════════════════════════════════════════

  function initMagneticButtons() {
    if (window.matchMedia('(max-width: 767px)').matches) return;

    document.querySelectorAll('.btn--primary').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ════════════════════════════════════════
  // 3D TILT CARDS
  // ════════════════════════════════════════

  function initTiltCards() {
    if (window.matchMedia('(max-width: 767px)').matches) return;

    document.querySelectorAll('.cert-card, .project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * 8;
        const tiltY = (x - 0.5) * -8;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
      });
    });
  }

  // ════════════════════════════════════════
  // FOOTER MINI GAME (Cybersecurity Puzzle)
  // ════════════════════════════════════════

  function initFooterGame() {
    const gameContainer = document.getElementById('footer-game');
    if (!gameContainer) return;

    const puzzles = [
      { q: 'What does SQL stand for?', a: 'structured query language', hint: 'Database language' },
      { q: 'What port does HTTP use?', a: '80', hint: 'Standard web port' },
      { q: 'What does XSS stand for?', a: 'cross site scripting', hint: 'Web attack type' },
      { q: 'What is the hash of "admin"?', a: '21232f297a57a5a743894a0e4a801fc3', hint: 'MD5 hash' },
      { q: 'What does CSRF stand for?', a: 'cross site request forgery', hint: 'Web attack' },
      { q: 'What port does HTTPS use?', a: '443', hint: 'Secure web port' },
      { q: 'What does LFI stand for?', a: 'local file inclusion', hint: 'Web vulnerability' },
      { q: 'What is the default SSH port?', a: '22', hint: 'Remote access' }
    ];

    let currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    let attempts = 0;

    gameContainer.innerHTML = `
      <div class="game-header">
        <span class="game-label">⚡ CYBER CHALLENGE</span>
        <button id="game-next" class="btn btn--ghost btn--sm" style="font-size:0.7rem;padding:2px 8px;">NEXT</button>
      </div>
      <p class="game-question">${currentPuzzle.q}</p>
      <div class="game-input-row">
        <input id="game-answer" class="game-input" type="text" placeholder="Your answer..." autocomplete="off">
        <button id="game-submit" class="btn btn--primary btn--sm">▶</button>
      </div>
      <p id="game-feedback" class="game-feedback"></p>
    `;

    const answerInput = document.getElementById('game-answer');
    const submitBtn = document.getElementById('game-submit');
    const feedback = document.getElementById('game-feedback');
    const nextBtn = document.getElementById('game-next');

    submitBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAnswer(); });

    nextBtn.addEventListener('click', () => {
      currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      document.querySelector('.game-question').textContent = currentPuzzle.q;
      feedback.textContent = '';
      answerInput.value = '';
      attempts = 0;
    });

    function checkAnswer() {
      const userAnswer = answerInput.value.trim().toLowerCase();
      if (!userAnswer) return;
      attempts++;

      if (userAnswer === currentPuzzle.a) {
        feedback.textContent = '✓ Correct!';
        feedback.className = 'game-feedback game-feedback--success';
        answerInput.value = '';
      } else if (attempts >= 3) {
        feedback.textContent = '✗ Answer: ' + currentPuzzle.a + ' (' + currentPuzzle.hint + ')';
        feedback.className = 'game-feedback game-feedback--error';
      } else {
        feedback.textContent = '✗ Try again. Hint: ' + currentPuzzle.hint;
        feedback.className = 'game-feedback game-feedback--error';
      }
    }
  }

  // ════════════════════════════════════════
  // ANIME.JS ENTRANCE ANIMATIONS
  // ════════════════════════════════════════

  function initAnimeEntrance() {
    if (typeof anime === 'undefined') return;

    // Section label animations
    const labels = document.querySelectorAll('.section__label');
    if (labels.length) {
      const labelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateX: [-20, 0],
              duration: 600,
              easing: 'easeOutCubic'
            });
            labelObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      labels.forEach(el => {
        el.style.opacity = '0';
        labelObserver.observe(el);
      });
    }

    // Stagger badge animations
    const badgeContainers = document.querySelectorAll('.bento__tags');
    if (badgeContainers.length) {
      const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target.querySelectorAll('.badge'),
              opacity: [0, 1],
              scale: [0.8, 1],
              delay: anime.stagger(50),
              duration: 400,
              easing: 'easeOutCubic'
            });
            badgeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      badgeContainers.forEach(el => badgeObserver.observe(el));
    }

    // Achievement number count-up with anime
    const achievementNums = document.querySelectorAll('.achievement__number');
    if (achievementNums.length) {
      const achObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            anime({
              targets: entry.target,
              innerText: [0, target],
              round: 1,
              duration: 2000,
              easing: 'easeOutExpo'
            });
            achObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      achievementNums.forEach(el => achObserver.observe(el));
    }

    // Timeline marker pulse
    const markers = document.querySelectorAll('.timeline__marker');
    markers.forEach(marker => {
      marker.addEventListener('mouseenter', () => {
        anime({
          targets: marker,
          scale: [1, 1.4, 1],
          duration: 400,
          easing: 'easeOutCubic'
        });
      });
    });
  }

  // ════════════════════════════════════════
  // PARTICLE SYSTEM (Hero)
  // ════════════════════════════════════════

  (function initHeroParticles() {
    const container = document.querySelector('.hero__particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: rgba(0, 229, 255, ${Math.random() * 0.4 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --tx: ${(Math.random() - 0.5) * 200}px;
        --ty: ${(Math.random() - 0.5) * 200}px;
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        animation-delay: ${Math.random() * 10}s;
        pointer-events: none;
      `;
      container.appendChild(particle);
    }
  })();

})();
