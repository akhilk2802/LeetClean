function initialize() {
  chrome.storage.sync.get(
    {
      hideDifficulty: true,
      hideAcceptance: true,
      hideTopics: false,
    },
    (settings) => {
      if (settings.hideDifficulty) toggleDifficulty(true);
      if (settings.hideAcceptance) toggleAcceptance(true);
      if (settings.hideTopics) toggleTopics(true);
    }
  );
}

// Observe changes in the DOM (for dynamic content loading)
const observer = new MutationObserver(() => {
  chrome.storage.sync.get(
    {
      hideDifficulty: true,
      hideAcceptance: false,
      hideTopics: false,
    },
    (settings) => {
      if (settings.hideDifficulty) toggleDifficulty(true);
      if (settings.hideAcceptance) toggleAcceptance(true);
      if (settings.hideTopics) toggleTopics(true);
    }
  );
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleDifficulty") {
    toggleDifficulty(request.isHidden);
    chrome.storage.sync.set({ hideDifficulty: request.isHidden });
  } else if (request.action === "toggleAcceptance") {
    toggleAcceptance(request.isHidden);
    chrome.storage.sync.set({ hideAcceptance: request.isHidden });
  } else if (request.action === "toggleTopics") {
    toggleTopics(request.isHidden);
    chrome.storage.sync.set({ hideTopics: request.isHidden });
  }
});

// Function to toggle difficulty visibility
function toggleDifficulty(hide) {
  const difficulties = ["Easy", "Medium", "Hard"];
  const elements = document.querySelectorAll("span, div");

  elements.forEach((el) => {
    if (difficulties.includes(el.innerText)) {
      el.style.display = hide ? "none" : "";
    }
  });
}

// Function to toggle acceptance rate visibility
function toggleAcceptance(hide) {
  const elements = document.querySelectorAll("div[role='cell']");

  elements.forEach((el) => {
    const text = el.textContent;
    if (text && /^\d+\.?\d*%$/.test(text.trim())) {
      el.style.display = hide ? "none" : "";
    }
  });
}

// Function to toggle topics visibility
function toggleTopics(hide) {
  const elements = document.querySelectorAll(".topic-tag");

  elements.forEach((el) => {
    el.style.display = hide ? "none" : "";
  });
}

// Initialize the script when the page is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
