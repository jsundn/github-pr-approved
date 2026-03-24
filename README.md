# GitHub PR Approval Highlighter

A Chrome extension that makes approved Pull Requests visually unmistakable on GitHub.

## Features

- **PR List page**: Approved PRs get a green left-border glow + pulsing "✓ APPROVED" badge next to the title
- **PR Detail page**: A full-width animated green banner slides in at the top, the PR title turns green with a ✓, and the merge box glows
- **Inline labels**: Any "Approved" text label is transformed into a bold green pill badge with pulsing animation
- Works in both light and dark mode

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select this folder (`gh-pr-approved/`)
5. Navigate to any GitHub PR list or PR detail page

## How it works

The extension injects a content script that watches GitHub pages for approval signals:
- `data-state="approved"` attributes
- `aria-label` / `title` containing "approved"
- Text content matching "Approved" / "Changes approved"

A `MutationObserver` keeps watching for GitHub's dynamic page updates (SPA navigation).

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-improvement`)
3. Make your changes and test them on GitHub
4. Submit a Pull Request
