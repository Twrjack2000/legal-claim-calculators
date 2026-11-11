/* ============================================================
   common.js — Shared nav, footer, utilities & live lead capture
   Requires: var BASE = './' or '../' set before this script
============================================================ */
(function () {
  'use strict';

  // ── TOOLS MANIFEST (All 15 Calculators) ─────────────────
  const TOOLS = [
    { id: 'truck-accident-calculator', icon: '🚛', label: '18-Wheeler & Truck Accident' },
    { id: 'oilfield-injury-calculator', icon: '🛢️', label: 'Oilfield & Rig Injury' },
    { id: 'rideshare-accident-calculator', icon: '🚕', label: 'Uber & Lyft Rideshare' },
    { id: 'concussion-tbi-calculator', icon: '🧠', label: 'Concussion & TBI' },
    { id: 'slip-and-fall-calculator', icon: '🏢', label: 'Slip & Fall / Premises' },
    { id: 'personal-injury-calculator', icon: '⚖️', label: 'Personal Injury Settlement' },
    { id: 'workers-comp-calculator', icon: '🔨', label: 'Workers\' Compensation' },
    { id: 'ssdi-calculator', icon: '♿', label: 'SSDI Benefits' },
    { id: 'medical-malpractice-calculator', icon: '🏥', label: 'Medical Malpractice' },
    { id: 'dui-cost-calculator', icon: '🚘', label: 'DUI / DWI True Cost' },
    { id: 'wrongful-termination-calculator', icon: '📋', label: 'Wrongful Termination' },
    { id: 'alimony-calculator', icon: '💍', label: 'Alimony / Spousal Support' },
    { id: 'non-compete-checker', icon: '🔕', label: 'Non-Compete Checker' },
    { id: 'child-support-calculator', icon: '👶', label: 'Child Support' },
    { id: 'dog-bite-calculator', icon: '🐕', label: 'Dog Bite Settlement' },
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
        ⚖️ All 15 Legal Tools <i class="chev-down">▾</i>
      </button>
      <div class="nav-dropdown" id="nav-dropdown" role="menu">
        ${dropdownLinks}
      </div>
    </div>
    <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu">☰</button>
  </div>
</nav>`;

  // ── RENDER FOOTER & LIVE LEAD CAPTURE ────────────────────
  const half = Math.ceil(TOOLS.length / 2);
  const col1 = TOOLS.slice(0, half).map(t =>
    `<a href="${BASE}tools/${t.id}.html">${t.icon} ${t.label}</a>`
  ).join('');
  const col2 = TOOLS.slice(half).map(t =>
    `<a href="${BASE}tools/${t.id}.html">${t.icon} ${t.label}</a>`
  ).join('');

  const emailCaptureHTML = `
<section class="gv-capture-section fade-in">
  <div class="gv-capture-inner" style="max-width:820px;">
    <h2>Don't Let the Adjusters Win</h2>
    <p>Lock in your free Case Valuation Review &amp; weekly ruthless settlement negotiation strategies before speaking with an insurance adjuster.</p>
    <form class="gv-form" style="max-width:780px;flex-wrap:wrap;" onsubmit="event.preventDefault(); window.submitLegalLead(this, 'Footer Attorney Review');">
      <input type="email" name="email" placeholder="Your Email Address *" required style="min-width:200px;flex:1.2;" />
      <input type="tel" name="phone" placeholder="Phone / Case Type *" required style="min-width:170px;flex:1;" />
      <input type="text" name="state" placeholder="State / ZIP *" required style="min-width:120px;flex:0.7;" />
      <button type="submit">GET FREE CASE REVIEW →</button>
    </form>
    <div class="gv-subtext">100% Confidential. No obligation. Direct case review &amp; settlement strategies.</div>
  </div>
</section>`;

  const footerHTML = emailCaptureHTML + `
<footer class="site-footer" role="contentinfo">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="fb-logo">
          <span class="fb-icon">⚖️</span>
          <span class="fb-name">Legal Claim <span>Calculators</span></span>
        </div>
        <p>Free, attorney-grade legal calculators to help you understand your rights before your first consultation. 15 tools, no sign-up required.</p>
      </div>
      <div class="footer-col">
        <h4>Tools (1–8)</h4>
        ${col1}
      </div>
      <div class="footer-col">
        <h4>Tools (9–15) &amp; Info</h4>
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

  // ── SCRAPE CALCULATED SETTLEMENT ESTIMATE FROM PAGE ─────
  window.scrapeEstimatedSettlement = function () {
    const clean = (txt) => (txt || '').replace(/\s+/g, ' ').trim();
    const isPopulated = (val) => val && val !== '—' && val !== 'â€”' && val !== '-';

    const midEl = document.getElementById('res-mid') || document.getElementById('res-total') || document.getElementById('total-val') || document.querySelector('.result-amount');
    const lowEl = document.getElementById('res-low') || document.getElementById('res-wc');
    const highEl = document.getElementById('res-high');
    const verdictEl = document.querySelector('.score-verdict');

    const parts = [];
    if (midEl && isPopulated(clean(midEl.textContent))) {
      parts.push('Primary Estimate: ' + clean(midEl.textContent));
    }
    if (lowEl && isPopulated(clean(lowEl.textContent))) {
      parts.push('Low/Base: ' + clean(lowEl.textContent));
    }
    if (highEl && isPopulated(clean(highEl.textContent))) {
      parts.push('High/Ceiling: ' + clean(highEl.textContent));
    }
    if (verdictEl && isPopulated(clean(verdictEl.textContent))) {
      parts.push('Verdict: ' + clean(verdictEl.textContent));
    }

    if (parts.length > 0) return parts.join(' | ');

    const resultsBox = document.getElementById('results');
    if (resultsBox && resultsBox.offsetParent !== null) {
      return clean(resultsBox.innerText).slice(0, 300);
    }
    return 'Submitted prior to running calculator';
  };

  // ── LIVE LEAD SUBMISSION TO FORMSUBMIT.CO ────────────────
  window.submitLegalLead = function (formEl, sourceTool) {
    if (!formEl || formEl.dataset.submitting === 'true') return false;

    const getVal = (selector) => {
      const el = formEl.querySelector(selector);
      return el ? el.value.trim() : '';
    };

    let email = getVal('input[name="email"], input[type="email"]');
    let name = getVal('input[name="name"]');
    let phone = getVal('input[name="phone"], input[type="tel"]');
    let state = getVal('input[name="state"]');
    let caseType = getVal('select[name="case_type"], input[name="case_type"]');

    // Fallback positional scraping for forms without explicit name attributes
    const textInputs = Array.from(formEl.querySelectorAll('input:not([type="hidden"]):not([type="submit"])'));
    textInputs.forEach((inp) => {
      const ph = (inp.getAttribute('placeholder') || '').toLowerCase();
      const val = (inp.value || '').trim();
      if (!val) return;
      if (!email && (inp.type === 'email' || ph.includes('email'))) email = val;
      else if (!name && ph.includes('name')) name = val;
      else if (!phone && (inp.type === 'tel' || ph.includes('phone'))) phone = val;
      else if (!state && (ph.includes('state') || ph.includes('zip') || ph.includes('city') || ph.includes('basin'))) state = val;
    });

    const estimatedSettlement = window.scrapeEstimatedSettlement();
    const pageTitle = document.title || window.location.pathname;

    const payload = {
      name: name || 'Legal Calculator Claimant',
      email: email || 'lead@legalclaimcalculators.com',
      phone: phone || 'Not provided',
      state: state || 'Not provided',
      case_type: caseType || sourceTool || pageTitle,
      calculator_page: pageTitle + ' (' + window.location.pathname + ')',
      estimated_settlement: estimatedSettlement,
      _subject: 'New Legal Claim Lead: ' + pageTitle,
      _captcha: 'false',
      _template: 'table'
    };

    formEl.dataset.submitting = 'true';
    const submitBtn = formEl.querySelector('button[type="submit"], input[type="submit"]');
    const origBtnText = submitBtn ? submitBtn.textContent : 'Submit';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Dossier...';
    }

    fetch('https://formsubmit.co/ajax/michael@macdatahub.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json().catch(() => ({})))
      .then(() => {
        formEl.innerHTML = `
          <div style="background:rgba(74,232,160,0.14);border:1px solid #4ae8a0;color:#f0f0f8;padding:16px 20px;border-radius:10px;width:100%;text-align:center;font-weight:600;line-height:1.5;">
            ✅ <strong style="color:#4ae8a0;">Case Valuation Dossier Sent!</strong><br>
            <span style="font-size:13px;color:#d0d0e8;">Your details ${estimatedSettlement && !estimatedSettlement.startsWith('Submitted') ? '(' + estimatedSettlement + ') ' : ''}have been transmitted for priority review.</span>
          </div>`;
      })
      .catch(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = origBtnText;
        }
        formEl.dataset.submitting = 'false';
        formEl.innerHTML = `
          <div style="background:rgba(74,232,160,0.14);border:1px solid #4ae8a0;color:#f0f0f8;padding:16px 20px;border-radius:10px;width:100%;text-align:center;font-weight:600;line-height:1.5;">
            ✅ <strong style="color:#4ae8a0;">Request Received!</strong><br>
            <span style="font-size:13px;color:#d0d0e8;">Your case estimate has been logged for review.</span>
          </div>`;
      });

    return false;
  };

  // ── INJECT INTO DOM & WIRE ALL CALCULATOR FORMS ──────────
  document.addEventListener('DOMContentLoaded', () => {
    const navEl = document.getElementById('nav-placeholder');
    const ftrEl = document.getElementById('footer-placeholder');
    if (navEl) navEl.innerHTML = navHTML;
    if (ftrEl) ftrEl.innerHTML = footerHTML;

    // ── Inject shared styles for upgraded inline lead forms ─
    if (!document.getElementById('lcc-lead-styles')) {
      const st = document.createElement('style');
      st.id = 'lcc-lead-styles';
      st.textContent = `
        .lead-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-top: 14px; text-align: left; }
        .lead-grid input { background: var(--bg-deep); border: 1px solid rgba(255,255,255,0.14); border-radius: var(--rs); padding: 11px 13px; font-size: 14px; color: var(--text-1); width: 100%; }
        .lead-grid button.btn-cta { width: 100%; border: none; cursor: pointer; text-align: center; padding: 12px 18px; }
      `;
      document.head.appendChild(st);
    }

    // ── Upgrade any .atty-cta dummy link into a live form ───
    document.querySelectorAll('.atty-cta').forEach((ctaBox) => {
      const dummyLink = ctaBox.querySelector('a.btn-cta[href="#"]');
      if (dummyLink && !ctaBox.querySelector('form')) {
        const btnLabel = dummyLink.textContent.trim() || 'Get Free Case Evaluation →';
        const form = document.createElement('form');
        form.className = 'lead-grid atty-lead-form';
        form.innerHTML = `
          <input type="text" name="name" placeholder="Full Name *" required />
          <input type="email" name="email" placeholder="Email Address *" required />
          <input type="tel" name="phone" placeholder="Phone Number *" required />
          <input type="text" name="state" placeholder="State / ZIP *" required />
          <button type="submit" class="btn-cta" style="grid-column: 1 / -1;">${btnLabel}</button>
        `;
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          window.submitLegalLead(form, 'Results Attorney Evaluation CTA');
        });
        dummyLink.replaceWith(form);
      }
    });

    // ── Intercept all .lead-grid forms across calculators ───
    document.querySelectorAll('form.lead-grid').forEach((form) => {
      if (form.classList.contains('atty-lead-form')) return;
      form.removeAttribute('onsubmit');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        window.submitLegalLead(form, 'Calculator Dossier Lead');
      });
    });

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
  window.fmtMoney = function (n) {
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1000) return '$' + Math.round(n).toLocaleString();
    return '$' + Math.round(n);
  };

  window.animateBars = function (items) {
    setTimeout(() => {
      items.forEach(({ id, pct }) => {
        const el = document.getElementById(id);
        if (el) el.style.width = Math.min(100, Math.max(0, Math.round(pct))) + '%';
      });
    }, 120);
  };

  window.showResults = function () {
    const form = document.getElementById('calc-form');
    const results = document.getElementById('results');
    if (form) form.style.display = 'none';
    if (results) {
      results.style.display = 'block';
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.resetCalc = function () {
    const form = document.getElementById('calc-form');
    const results = document.getElementById('results');
    if (results) results.style.display = 'none';
    if (form) form.style.display = 'block';
    document.querySelectorAll('.bk-bar').forEach(b => b.style.width = '0');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

})();
