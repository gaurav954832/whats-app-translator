// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load the saved language from storage
  chrome.storage.local.get('targetLanguage', (result) => {
    const targetLanguage = result.targetLanguage || 'en'; // Default to English
    document.getElementById('languageSelect').value = targetLanguage;
    
  });

  // Add event listener to the Save button once the DOM is loaded
  document.getElementById('saveBtn').addEventListener('click', () => {
    const targetLanguage = document.getElementById('languageSelect').value;
    chrome.storage.local.set({ targetLanguage: targetLanguage }, () => {
      alert('Language saved!'); // Notification on save
    });
  });

  // Update the language immediately when selected
  document.getElementById('languageSelect').addEventListener('change', () => {
    const targetLanguage = document.getElementById('languageSelect').value;
    chrome.storage.local.set({ targetLanguage: targetLanguage });
  });
});

