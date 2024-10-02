// Dummy translation function
function translateMessageDummy(message, targetLanguage) {
  // Define demo sentences for each target language
  const demoSentences = {
      en: `Hello! This is a demo sentence in English.`,
      es: `¡Hola! Esta es una oración de demostración en español.`,
      fr: `Bonjour ! Ceci est une phrase de démonstration en français.`
  };

  // Return the demo sentence for the specified language or a generic translation for others
  if (demoSentences[targetLanguage]) {
      return demoSentences[targetLanguage];
  } else {
      return `Translated (${targetLanguage}): ${message}`; // Fallback for unsupported languages
  }
}

// Function to translate incoming messages
function translateIncomingMessages(targetLanguage) {
  const messages = document.querySelectorAll('.message-in, .message-out'); // Only target incoming messages
  messages.forEach((msg) => {
      // Avoid re-translation
      if (!msg.classList.contains('translated')) {
          // Check for text container
          const textElement = msg.querySelector('.selectable-text span'); // WhatsApp text messages are within this element

          if (textElement && textElement.innerText.trim()) {
              const originalText = textElement.innerText;
              const translatedText = translateMessageDummy(originalText, targetLanguage);

              // Create the translated message container
              const translationDiv = document.createElement('div');
              translationDiv.style.marginTop = '5px';
              translationDiv.style.borderTop = '1px solid #ccc'; // A line between original and translated message
              translationDiv.style.paddingTop = '5px';
              translationDiv.style.color = '#999'; // Grey color for translation

              // Add the translated text
              translationDiv.innerText = `Translated (${targetLanguage}): ${translatedText}`;

              // Append the translated message after the original message
              textElement.parentNode.appendChild(translationDiv);
              msg.classList.add('translated');
          }
      }
  });
}

// Function to translate outgoing messages before sending
function addTranslationFeature() {
  const inputBox = document.querySelector('[contenteditable="true"]'); // Selector for the input box
  inputBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // Prevent the default "Enter" action
          const originalText = inputBox.innerText;

          // Use saved language from Chrome storage
          chrome.storage.local.get('targetLanguage', (result) => {
              const targetLanguage = result.targetLanguage || 'en'; // Default to English if not set
              const translatedText = translateMessageDummy(originalText, targetLanguage);
              
              // Display the translated message in the chat for your view
              const messageContainer = document.createElement('div');
              messageContainer.classList.add('message-out'); // Class for outgoing messages
              messageContainer.innerHTML = `
                  <div class="selectable-text">
                      <span>${translatedText}</span>
                  </div>
                  <div style="margin-top: 5px; color: #999;">Translated (${targetLanguage}): ${translatedText}</div>
              `;

              // Append the message to the chat (assuming a specific chat container)
              const chatContainer = document.querySelector('.chat-container'); // Update with your chat container selector
              chatContainer.appendChild(messageContainer);

              // Clear the input box after showing the translated message
              inputBox.innerText = '';

              // Simulate "Enter" keypress to send the original message (or you may directly send the translated message if needed)
              const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
              inputBox.dispatchEvent(event);
          });
      }
  });
}

// Update translations whenever the target language changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.targetLanguage) {
      const newLanguage = changes.targetLanguage.newValue;
      translateIncomingMessages(newLanguage);
  }
});

// Set up a mutation observer to handle dynamic content
const observer = new MutationObserver(() => {
  chrome.storage.local.get('targetLanguage', (result) => {
      const targetLanguage = result.targetLanguage || 'en'; // Default to English if not set
      translateIncomingMessages(targetLanguage);
  });
});

// Observe document body for changes to dynamically handle incoming messages
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Run functions to set up translation features
chrome.storage.local.get('targetLanguage', (result) => {
  const targetLanguage = result.targetLanguage || 'en'; // Default to English if not set
  translateIncomingMessages(targetLanguage);
});

// Initialize the translation feature
addTranslationFeature();
