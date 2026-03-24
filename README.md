![GitHub PR Approved](https://github.com/user-attachments/assets/2236e1a8-b914-4615-a107-b4200a6d87b0)

# GitHub PR Approval Highlighter

A Chrome extension that makes approved Pull Requests visually unmistakable on GitHub.

## Features

- **PR List page**: Approved PRs get a green background highlight and a left border accent; the approval count link gains a ✓ prefix
- **PR Detail page**: The PR title turns green with a ✓ suffix and the merge box glows with a pulsing green border
- **Inline labels**: Any "Approved" or "Changes approved" text label is transformed into a bold green pill badge with pulsing animation
- Works in both light and dark mode

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select this folder (`gh-pr-approved/`)
5. Navigate to any GitHub PR list or PR detail page

## How it works

The extension injects a content script that watches GitHub pages for approval signals:

**PR List page** (`/pulls`):
- Scans PR rows for elements whose `aria-label` contains "approval" (e.g. "1 review approval")

**PR Detail page** (`/pull/*`):
- Checks `MergeBoxSectionHeader` elements with an `aria-label` containing "approved"
- Checks `[data-state="approved"]`, `[class*="approved"]`, `[aria-label*="approved"]`, `[title*="approved"]`
- Scans review timeline items, the PR header area, and the reviewers sidebar for approval signals

**Inline labels** (both pages):
- Finds any element whose visible text is exactly "Approved" or "Changes approved" and styles it as a green badge

A `MutationObserver` keeps watching for GitHub's dynamic page updates (SPA navigation).
