![GitHub PR Approved](https://github.com/user-attachments/assets/2236e1a8-b914-4615-a107-b4200a6d87b0)

# GitHub PR Approval Highlighter

A Chrome extension that makes approved and draft Pull Requests visually unmistakable on the GitHub PR list page.

## Features

- **Approved PRs**: Green background highlight and left border accent; the approval count link gains a ✓ prefix
- **Multi-approval pulse**: PRs with 2 or more approvals get an additional pulsing background animation to stand out even more
- **Draft PRs**: Gray background highlight and left border accent so drafts are immediately distinguishable
- **Persistent settings**: A popup lets you toggle approved and draft highlighting independently — settings are saved across sessions via `chrome.storage.sync`
- Works in both light and dark mode

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select this folder (`github-pr-approval-highlighter/`)
5. Navigate to any GitHub PR list page

## How it works

The extension injects a content script that runs on the GitHub PR list page (`/pulls`):

- **Approved**: For each PR row, it looks for a `.tooltipped` element whose `aria-label` contains "approval" and whose visible text contains "approved" (e.g. "1 review approval"). Matching rows get a green background and left border accent, with a ✓ prefix added to the approval count link. Rows with 2 or more approvals also get a subtle pulsing background animation.
- **Draft**: For each PR row, it looks for a `.tooltipped` element whose `aria-label` is exactly `"Draft"`. Matching rows get a gray background and left border accent.

Settings (toggle approved/draft highlighting) are stored in `chrome.storage.sync` and applied instantly whenever changed. A `MutationObserver` keeps watching for GitHub's dynamic page updates (SPA navigation).

