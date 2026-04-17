/* ============================================================
   common.js — Shared nav, footer, utilities
   Requires: var BASE = './' or '../' set before this script
============================================================ */
(function () {
  'use strict';

  // ── TOOLS MANIFEST ──────────────────────────────────────
  const TOOLS = [
    { id: 'personal-injury-calculator',       icon: '⚖️',  label: 'Personal Injury Settlement' },
    { id: 'workers-comp-calculator',          icon: '🔨',  label: 'Workers\' Compensation' },
    { id: 'ssdi-calculator',                  icon: '♿',  label: 'SSDI Benefits' },
    { id: 'dui-cost-calculator',              icon: '🚘',  label: 'DUI / DWI True Cost' },
    { id: 'wrongful-termination-calculator',  icon: '📋',  label: 'Wrongful Termination' },
    { id: 'alimony-calculator',               icon: '💍',  label: 'Alimony / Spousal Support' },
    { id: 'non-compete-checker',              icon: '🔕',  label: 'Non-Compete Checker' },
    { id: 'child-support-calculator',         icon: '👶',  label: 'Child Support' },
    { id: 'medical-malpractice-calculator',   icon: '🏥',  label: 'Medical Malpractice' },
    { id: 'dog-bite-calculator',              icon: '🐕',  label: 'Dog Bite Settlement' },
  ];

  // ── DETECT CURRENT PAGE ──────────────────────────────────
  const path = window.location.pathname;
  const currentFile = path.split('/').pop().replace('.html', '');

  // ── RENDER NAV (dropdown) ────────────────────────────────
  const dropdownLinks = TOOLS.map(t =>
    `<a href="${BASE}tools/${t.id}.html" class="${currentFile === t.id ? 'active' : ''}">
      <span class="nd-icon">${t.icon}</span>${t.label}
    </a>`
  ).join('');

  const isHome = currentFile === 'index' || currentFile === '';

  const navHTML = `
<nav class="site-nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="${BASE}index.html" class="nav-logo" aria-label="Legal Claim Calculators Home">
      <span class="nav-logo-icon" aria-hidden="true">⚖️</span>
      <span class="nav-logo-text">Legal Claim <span>Calculators</span></span>
    </a>
    ${!isHome ? `<a href="${BASE}index.html" class="nav-home-link">← All Tools</a>` : ''}
    <a href="${BASE}articles/index.html" class="nav-home-link" style="margin-left:20px;">📚 Articles</a>
    <div class="nav-tools-wrap">
      <button class="nav-tools-btn" id="tools-btn" aria-haspopup="true" aria-expanded="false">
        ⚖️ All 10 Legal Tools <i class="chev-down">▾</i>
      </button>
      <div class="nav-dropdown" id="nav-dropdown" role="menu">
        ${dropdownLinks}
      </div>
    </div>
    <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu">☰</button>
  </div>
</nav>`;

  // ── RENDER FOOTER ────────────────────────────────────────
  const half = Math.ceil(TOOLS.length / 2);
  const col1 = TOOLS.slice(0, half).map(t =>
    `<a href="${BASE}tools/${t.id}.html">${t.icon} ${t.label}</a>`
  ).join('');
  const col2 = TOOLS.slice(half).map(t =>
    `<a href="${BASE}tools/${t.id}.html">${t.icon} ${t.label}</a>`
  ).join('');

  const footerHTML = `
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="fb-logo">
          <span class="fb-icon">⚖️</span>
          <span class="fb-name">Legal Claim <span>Calculators</span></span>
        </div>
        <p>Free, attorney-grade legal calculators to help you understand your rights before your first consultation. 10 tools, no sign-up required.</p>
      </div>
      <div class="footer-col">
        <h4>Tools (1–5)</h4>
        ${col1}
      </div>
      <div class="footer-col">
        <h4>Tools (6–10) &amp; Info</h4>
        ${col2}
        <a href="${BASE}about.html">About This Site</a>
        <a href="${BASE}disclaimer.html">Legal Disclaimer</a>
        <a href="${BASE}privacy.html">Privacy Policy</a>
      </div>
    </div>
    <div class="footer-bottom">
      <strong>⚠️ Disclaimer:</strong> All calculators on this site are for <strong>educational and informational purposes only</strong> and do not constitute legal advice. Results are estimates and may not reflect actual case outcomes. Always consult a licensed attorney in your jurisdiction before making legal decisions. This site is not a law firm and does not create any attorney-client relationship.
      <br><br>
      © ${new Date().getFullYear()} LegalClaimCalculators.com &nbsp;•&nbsp; Not a law firm &nbsp;•&nbsp; Free educational resource
    </div>
  </div>
</footer>`;

  // ── INJECT INTO DOM ──────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const navEl = document.getElementById('nav-placeholder');
    const ftrEl = document.getElementById('footer-placeholder');
    if (navEl) navEl.innerHTML = navHTML;
    if (ftrEl) ftrEl.innerHTML = footerHTML;

    // ── Tools dropdown ────────────────────────────────────
    const toolsBtn = document.getElementById('tools-btn');
    const dropdown = document.getElementById('nav-dropdown');
    if (toolsBtn && dropdown) {
      toolsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = dropdown.classList.toggle('open');
        toolsBtn.classList.toggle('open', open);
        toolsBtn.setAttribute('aria-expanded', open);
      });
      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
        toolsBtn.classList.remove('open');
        toolsBtn.setAttribute('aria-expanded', 'false');
      });
      dropdown.addEventListener('click', e => e.stopPropagation());
    }

    // ── Mobile hamburger → shows dropdown on mobile ───────
    const hamburger = document.getElementById('nav-hamburger');
    if (hamburger && dropdown) {
      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = dropdown.classList.toggle('open');
        toolsBtn && toolsBtn.classList.toggle('open', open);
        hamburger.textContent = open ? '✕' : '☰';
      });
    }

    // ── SCROLL FADE-IN ────────────────────────────────────
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ── FAQ ACCORDION ─────────────────────────────────────
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
        btn.setAttribute('aria-expanded', !isOpen);
      });
    });
  });

  // ── UTILITY: Format as currency ──────────────────────────
  window.fmtMoney = function(n) {
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1000) return '$' + Math.round(n).toLocaleString();
    return '$' + Math.round(n);
  };

  window.animateBars = function(items) {
    setTimeout(() => {
      items.forEach(({ id, pct }) => {
        const el = document.getElementById(id);
        if (el) el.style.width = Math.min(100, Math.max(0, Math.round(pct))) + '%';
      });
    }, 120);
  };

  window.showResults = function() {
    const form = document.getElementById('calc-form');
    const results = document.getElementById('results');
    if (form) form.style.display = 'none';
    if (results) {
      results.style.display = 'block';
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.resetCalc = function() {
    const form = document.getElementById('calc-form');
    const results = document.getElementById('results');
    if (results) results.style.display = 'none';
    if (form) form.style.display = 'block';
    document.querySelectorAll('.bk-bar').forEach(b => b.style.width = '0');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

})();
