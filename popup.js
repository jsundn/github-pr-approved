// Popup script — loads and saves highlight settings via chrome.storage.sync

const DEFAULT_SETTINGS = {
  highlightApproved: true,
  highlightDraft: true,
};

document.addEventListener('DOMContentLoaded', () => {
  const approvedCheckbox = document.getElementById('highlightApproved');
  const draftCheckbox    = document.getElementById('highlightDraft');

  if (!approvedCheckbox || !draftCheckbox) return;

  // Populate checkboxes from stored settings
  chrome.storage.sync.get(DEFAULT_SETTINGS, settings => {
    approvedCheckbox.checked = settings.highlightApproved;
    draftCheckbox.checked    = settings.highlightDraft;
  });

  // Persist changes immediately on toggle
  approvedCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ highlightApproved: approvedCheckbox.checked });
  });

  draftCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ highlightDraft: draftCheckbox.checked });
  });
});
