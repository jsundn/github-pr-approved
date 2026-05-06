// GitHub PR Approval Highlighter
// Watches for approved/draft PRs and makes them visually unmistakable

(function () {
  'use strict';

  const DEFAULT_SETTINGS = {
    highlightApproved: true,
    highlightDraft: true,
  };

  let settings = { ...DEFAULT_SETTINGS };

  // ─── PR List Page (github.com/*/pulls) ──────────────────────────────────────

  function tagApprovedRows() {
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

  function untagApprovedRows() {
    document.querySelectorAll('[id^="issue_"][data-approval-tagged]').forEach(row => {
      row.classList.remove('gha-approved-row', 'gha-approved-row-pulse');
      delete row.dataset.approvalTagged;
    });
  }

  function tagDraftRows() {
    document.querySelectorAll('[id^="issue_"]').forEach(row => {
      if (row.dataset.draftTagged) return;

      // Look for a .tooltipped element whose aria-label is exactly "Draft"
      const draftEl = Array.from(row.querySelectorAll('.tooltipped')).find(el => {
        return el.getAttribute('aria-label') === 'Draft';
      });

      if (!draftEl) return;

      row.dataset.draftTagged = 'true';
      row.classList.add('gha-draft-row');
    });
  }

  function untagDraftRows() {
    document.querySelectorAll('[id^="issue_"][data-draft-tagged]').forEach(row => {
      row.classList.remove('gha-draft-row');
      delete row.dataset.draftTagged;
    });
  }

  // ─── Runner ─────────────────────────────────────────────────────────────────

  function run() {
    if (/\/pulls/.test(window.location.pathname) || window.location.pathname === '/') {
      if (settings.highlightApproved) tagApprovedRows();
      if (settings.highlightDraft)   tagDraftRows();
    }
  }

  function applySettings(newSettings) {
    const prev = { ...settings };
    settings = { ...DEFAULT_SETTINGS, ...newSettings };

    if (prev.highlightApproved && !settings.highlightApproved) untagApprovedRows();
    if (prev.highlightDraft    && !settings.highlightDraft)    untagDraftRows();

    run();
  }

  // ─── Persistent settings via chrome.storage.sync ────────────────────────────

  chrome.storage.sync.get(DEFAULT_SETTINGS, stored => {
    settings = stored;
    run();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    const updated = {};
    for (const [key, { newValue }] of Object.entries(changes)) {
      updated[key] = newValue;
    }
    applySettings({ ...settings, ...updated });
  });

  // ─── Watch for GitHub's pjax navigation and dynamic content ─────────────────

  const observer = new MutationObserver(() => { run(); });
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('popstate',       () => { setTimeout(run, 300); });
  document.addEventListener('turbo:load',   () => { setTimeout(run, 300); });
  document.addEventListener('pjax:end',     () => { setTimeout(run, 300); });

})();
