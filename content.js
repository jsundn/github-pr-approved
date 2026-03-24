// GitHub PR Approval Highlighter
// Watches for approved PRs and makes them visually unmistakable

(function () {
  'use strict';

  const APPROVED_TEXTS = ['approved', 'changes approved'];

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function isApprovedText(text) {
    return APPROVED_TEXTS.some(t => text.toLowerCase().trim().includes(t));
  }

  // ─── PR List Page (github.com/*/pulls) ──────────────────────────────────────

  function tagPRListItems() {
    document.querySelectorAll('[id^="issue_"]').forEach(row => {
      if (row.dataset.approvalTagged) return;

      // Match the real GitHub pattern: aria-label="1 review approval" or "X review approvals"
      const hasApproved = Array.from(row.querySelectorAll('[aria-label]')).some(el =>
        el.getAttribute('aria-label').toLowerCase().includes('approval')
      );

      if (hasApproved) {
        row.dataset.approvalTagged = 'true';
        row.classList.add('gha-approved-row');
      }
    });
  }

  // ─── PR Detail Page (github.com/*/pull/*) ───────────────────────────────────

  function tagPRDetailPage() {
    // Check MergeBoxSectionHeader elements for approval (e.g. aria-label="1 approval")
    const mergeBoxHeaders = document.querySelectorAll('[class*="MergeBoxSectionHeader"]');
    let pageApproved = Array.from(mergeBoxHeaders).some(el => {
      const label = el.getAttribute('aria-label');
      return label && label.toLowerCase().includes('approved');
    });

    // Check all text content for approval signals
    if (!pageApproved) {
      const approvalNodes = document.querySelectorAll(
        '[class*="approved" i], [data-state="approved"], [aria-label*="approved" i], [title*="approved" i]'
      );
      pageApproved = approvalNodes.length > 0;
    }

    // Also scan review event headings
    if (!pageApproved) {
      document.querySelectorAll('.TimelineItem .color-fg-success, [class*="success"], .octicon-check').forEach(el => {
        if (isApprovedText(el.closest('[class*="TimelineItem"]')?.textContent || el.textContent || '')) {
          pageApproved = true;
        }
      });
    }

    // Check the review state in the PR header area
    const headerArea = document.querySelector('#partial-discussion-header, .gh-header-meta, .gh-header-show');
    if (headerArea) {
      const stateLabels = headerArea.querySelectorAll('[class*="State"], [class*="label"]');
      stateLabels.forEach(el => {
        if (isApprovedText(el.textContent)) pageApproved = true;
      });
    }

    // Scan the reviews sidebar
    const reviewers = document.querySelectorAll('.js-reviewer-container, [data-login]');
    reviewers.forEach(reviewer => {
      const stateEl = reviewer.querySelector('[aria-label*="approved" i], [title*="approved" i], .color-fg-success');
      if (stateEl) pageApproved = true;
    });

    if (pageApproved) {
      applyPageApprovalStyling();
    }
  }

  function applyPageApprovalStyling() {
    if (document.body.dataset.ghaApproved) return;
    document.body.dataset.ghaApproved = 'true';

    // Highlight the PR title
    const prTitle = document.querySelector('.js-issue-title, [class*="title"] .markdown-title, h1 bdi');
    if (prTitle) {
      prTitle.classList.add('gha-approved-title');
    }

    // Highlight merge box area
    const mergeBox = document.querySelector('#mergeability-section, .merge-pr, [class*="MergeBox"]');
    if (mergeBox) {
      mergeBox.classList.add('gha-approved-merge-box');
    }
  }

  // ─── Review state elements (works on both pages) ─────────────────────────────

  function enhanceApprovedLabels() {
    // Find any element whose visible text is exactly "Approved" or similar
    const allElements = document.querySelectorAll(
      'span, div, p, strong, [class*="review-state"], [class*="reviewState"]'
    );

    allElements.forEach(el => {
      if (el.dataset.ghaEnhanced) return;
      if (el.children.length > 2) return; // skip containers
      const text = el.textContent.trim().toLowerCase();
      if (text === 'approved' || text === 'changes approved') {
        el.dataset.ghaEnhanced = 'true';
        el.classList.add('gha-inline-approved');
      }
    });
  }

  // ─── Runner ─────────────────────────────────────────────────────────────────

  function run() {
    const path = window.location.pathname;

    // PR detail page
    if (/\/pull\/\d+/.test(path)) {
      tagPRDetailPage();
    }

    // PR list page
    if (/\/pulls/.test(path) || path === '/') {
      tagPRListItems();
    }

    // Always try to enhance inline labels
    enhanceApprovedLabels();
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
  window.addEventListener('popstate', () => { delete document.body.dataset.ghaApproved; setTimeout(run, 300); });
  document.addEventListener('turbo:load', () => { delete document.body.dataset.ghaApproved; setTimeout(run, 300); });
  document.addEventListener('pjax:end', () => { delete document.body.dataset.ghaApproved; setTimeout(run, 300); });

})();
