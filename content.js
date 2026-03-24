// GitHub PR Approval Highlighter
// Watches for approved PRs and makes them visually unmistakable

(function () {
  'use strict';

  // ─── PR List Page (github.com/*/pulls) ──────────────────────────────────────

  function tagPRListItems() {
    document.querySelectorAll('[id^="issue_"]').forEach(row => {
      if (row.dataset.approvalTagged) return;

      // Look for elements with class "tooltipped" whose aria-label includes
      // "approval" and whose visible text includes "approved".
      const approvedEl = Array.from(row.querySelectorAll('.tooltipped')).find(el => {
        const label = (el.getAttribute('aria-label') || '').toLowerCase();
        const text  = (el.textContent || '').toLowerCase();
        return label.includes('approval') && text.includes('approved');
      });

      if (!approvedEl) return;

      row.dataset.approvalTagged = 'true';

      // Parse the approval count from aria-label (e.g. "2 review approval")
      const label = (approvedEl.getAttribute('aria-label') || '').toLowerCase();
      const match = label.match(/^(\d+)\s+review\s+approval/);
      const count = match ? parseInt(match[1], 10) : 1;

      if (count > 1) {
        row.classList.add('gha-approved-row', 'gha-approved-row-pulse');
      } else {
        row.classList.add('gha-approved-row');
      }
    });
  }

  // ─── Runner ─────────────────────────────────────────────────────────────────

  function run() {
    if (/\/pulls/.test(window.location.pathname) || window.location.pathname === '/') {
      tagPRListItems();
    }
  }

  // Run on load
  run();

  // Watch for GitHub's pjax navigation and dynamic content
  const observer = new MutationObserver(() => {
    run();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Also run on popstate (GitHub SPA navigation)
  window.addEventListener('popstate', () => { setTimeout(run, 300); });
  document.addEventListener('turbo:load', () => { setTimeout(run, 300); });
  document.addEventListener('pjax:end', () => { setTimeout(run, 300); });

})();
