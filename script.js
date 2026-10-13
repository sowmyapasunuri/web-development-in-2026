/**
 * NAINA TECHNOLOGIES - 2026 Editorial Blog Interactive Logic
 * Features: Reading progress, Stack simulator, Code tabs, Readiness audit, Live comments
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initStackSimulator();
  initCodeCopyButtons();
  initTableOfContents();
  initReadinessAudit();
  initEngagementButtons();
  initCommentSystem();
  initNewsletterForm();
  initArticleRouting();
  initArticleReadMore();
});

/* Article Routing Navigation */
function initArticleRouting() {
  const readArticleBtns = document.querySelectorAll('#btn-read-full-article, #btn-explore-trends');
  readArticleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetArticle = document.getElementById('deep-dive');
      if (targetArticle) {
        targetArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', '#deep-dive');
      }
    });
  });
}

/* 1. Reading Progress Bar */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* 2. Interactive Stack Simulator (2023 Legacy vs 2026 Autonomous Edge) */
function initStackSimulator() {
  const btn2026 = document.getElementById('sim-mode-2026');
  const btn2023 = document.getElementById('sim-mode-2023');
  const metricLatency = document.getElementById('sim-val-latency');
  const metricBundle = document.getElementById('sim-val-bundle');
  const metricAi = document.getElementById('sim-val-ai');
  const barLatency = document.getElementById('sim-bar-latency');
  const barBundle = document.getElementById('sim-bar-bundle');
  const barAi = document.getElementById('sim-bar-ai');
  const simNoteText = document.getElementById('sim-note-text');

  if (!btn2026 || !btn2023) return;

  function setMode(mode) {
    if (mode === '2026') {
      btn2026.classList.add('active');
      btn2023.classList.remove('active');

      metricLatency.textContent = '12ms';
      metricBundle.textContent = '0kb';
      metricAi.textContent = '94%';

      barLatency.style.width = '12%';
      barBundle.style.width = '3%';
      barAi.style.width = '94%';

      simNoteText.textContent = 'Current: Edge Workers streaming micro-HTML with Zero-Runtime WASM island.';
    } else {
      btn2023.classList.add('active');
      btn2026.classList.remove('active');

      metricLatency.textContent = '480ms';
      metricBundle.textContent = '780kb';
      metricAi.textContent = '8%';

      barLatency.style.width = '92%';
      barBundle.style.width = '88%';
      barAi.style.width = '8%';

      simNoteText.textContent = 'Legacy: Heavy client-side JavaScript hydration & monolithic cloud origins.';
    }
  }

  btn2026.addEventListener('click', () => setMode('2026'));
  btn2023.addEventListener('click', () => setMode('2023'));
}

/* 3. Code Copy Buttons */
function initCodeCopyButtons() {
  const copyButtons = document.querySelectorAll('.code-copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.dark-code-window').querySelector('code');
      if (!codeBlock) return;
      navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        showToast('Code copied to clipboard!');
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }).catch(() => {
        showToast('Failed to copy code.');
      });
    });
  });
}

/* 4. Table of Contents ScrollSpy & Smooth Scrolling */
function initTableOfContents() {
  const tocLinks = document.querySelectorAll('.toc-link');
  const sections = document.querySelectorAll('.article-content h3[id], .article-content .interactive-audit-card[id]');

  if (tocLinks.length === 0 || sections.length === 0) return;

  // Smooth click navigation
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        // If clicking any section, ensure article matter is expanded first
        if (typeof window.expandArticleMatter === 'function') {
          window.expandArticleMatter();
        }
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', targetId);
          tocLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* 4b. Collapsible Article Matter ("Read More" / "Show Less") */
function initArticleReadMore() {
  const readMoreBtn = document.getElementById('btn-article-read-more');
  const collapseBottomBtn = document.getElementById('btn-article-collapse-bottom');
  const restMatter = document.getElementById('article-rest-matter');

  if (!readMoreBtn || !restMatter) return;

  function toggleArticle(expand) {
    const isCurrentlyHidden = restMatter.style.display === 'none' || !restMatter.classList.contains('is-expanded');
    const shouldExpand = (typeof expand === 'boolean') ? expand : isCurrentlyHidden;

    if (shouldExpand) {
      restMatter.style.display = 'block';
      restMatter.classList.add('is-expanded');
      readMoreBtn.classList.add('is-expanded');
      readMoreBtn.setAttribute('aria-expanded', 'true');
      const btnText = readMoreBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Show Less';
    } else {
      restMatter.style.display = 'none';
      restMatter.classList.remove('is-expanded');
      readMoreBtn.classList.remove('is-expanded');
      readMoreBtn.setAttribute('aria-expanded', 'false');
      const btnText = readMoreBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Read More';

      // Scroll smoothly back to start of section
      const targetSec = document.getElementById('sec-ai-web-dev');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  readMoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleArticle();
  });

  if (collapseBottomBtn) {
    collapseBottomBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleArticle(false);
    });
  }

  // Export expand helper for Table of Contents navigation
  window.expandArticleMatter = () => toggleArticle(true);
}

/* 5. Interactive 2026 Readiness Audit Checklist */
function initReadinessAudit() {
  const checkboxes = document.querySelectorAll('.audit-item input[type="checkbox"]');
  const scoreBadge = document.getElementById('audit-score-text');

  if (!scoreBadge || checkboxes.length === 0) return;

  function updateScore() {
    let checkedCount = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) checkedCount++;
    });
    const percentage = Math.round((checkedCount / checkboxes.length) * 100);
    scoreBadge.textContent = `${percentage}% 2026 Ready`;

    if (percentage === 100) {
      scoreBadge.style.backgroundColor = '#10b981';
      showToast('🎉 Excellent! Your stack is 100% prepared for 2026 Web Standards.');
    } else {
      scoreBadge.style.backgroundColor = '#2563eb';
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateScore);
  });
}

/* 6. Engagement Actions (Likes, Bookmarks, Share) */
function initEngagementButtons() {
  const likeBtn = document.getElementById('btn-like-post');
  const likeCountSpan = document.getElementById('like-count');
  const bookmarkBtn = document.getElementById('btn-bookmark-post');
  const shareBtn = document.getElementById('btn-share-post');

  let storedLikes = parseInt(localStorage.getItem('naina_post_likes') || '0', 10);
  if (storedLikes === 842 || isNaN(storedLikes)) {
    storedLikes = 0;
    localStorage.setItem('naina_post_likes', '0');
  }
  let likes = storedLikes;
  let liked = localStorage.getItem('naina_post_liked') === 'true';

  function renderLikeState() {
    if (likeCountSpan) {
      if (likes > 0) {
        likeCountSpan.textContent = `(${likes})`;
        likeCountSpan.style.display = 'inline';
      } else {
        likeCountSpan.textContent = '';
        likeCountSpan.style.display = 'none';
      }
    }
    if (likeBtn) {
      const icon = likeBtn.querySelector('.like-icon');
      if (liked) {
        likeBtn.classList.add('active');
        if (icon) icon.textContent = '❤️';
      } else {
        likeBtn.classList.remove('active');
        if (icon) icon.textContent = '🤍';
      }
    }
  }

  renderLikeState();

  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      liked = !liked;
      if (liked) {
        likes++;
        localStorage.setItem('naina_post_liked', 'true');
        showToast('Thank you for liking this Naina Tech research piece!');
      } else {
        likes = Math.max(0, likes - 1);
        localStorage.setItem('naina_post_liked', 'false');
      }
      localStorage.setItem('naina_post_likes', likes.toString());
      renderLikeState();
    });
  }

  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      bookmarkBtn.classList.toggle('active');
      const isSaved = bookmarkBtn.classList.contains('active');
      showToast(isSaved ? 'Article saved to your Naina Tech reading list!' : 'Article removed from reading list.');
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Web Development in 2026 - Naina Technologies',
          text: 'Comprehensive architectural insights on 2026 web engineering, Agentic AI and Edge runtime.',
          url: window.location.href,
        }).catch(() => { });
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Link copied to clipboard! Share with your team.');
        });
      }
    });
  }
}

/* 7. Live Comment System */
function initCommentSystem() {
  const form = document.getElementById('comment-form');
  const list = document.getElementById('comment-list');
  const nameInput = document.getElementById('comment-author-name');
  const textInput = document.getElementById('comment-message');

  if (!form || !list) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim() || 'Anonymous Engineer';
    const message = textInput.value.trim();

    if (!message) {
      showToast('Please type a comment before posting.');
      return;
    }

    const firstLetter = name.charAt(0).toUpperCase();

    const commentEl = document.createElement('div');
    commentEl.className = 'comment-item';
    commentEl.innerHTML = `
      <div class="comment-avatar">${firstLetter}</div>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-author">${escapeHtml(name)}</span>
          <span class="comment-time">Just now</span>
        </div>
        <p class="comment-text">${escapeHtml(message)}</p>
      </div>
    `;

    list.prepend(commentEl);
    form.reset();
    showToast('Your perspective was published to Naina Tech discussion!');
  });
}

/* 8. Newsletter Forms */
function initNewsletterForm() {
  const fnForms = document.querySelectorAll('.fn-form');
  fnForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.fn-input');
      if (input && input.value) {
        showToast('Subscribed! Welcome to Naina Technologies Engineering Briefings.');
        input.value = '';
      }
    });
  });
}

/* Helper: Toast Notifications */
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>ℹ️</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

