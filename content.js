// Global observer instance
let globalObserver = null;

function initialize() {
  console.log("Initializing LeetClean extension...");
  chrome.storage.sync.get(
    {
      hideDifficulty: true,
      hideAcceptance: true,
      hideTopics: false,
    },
    (settings) => {
      try {
        console.log("Initial settings:", settings);
        if (settings.hideDifficulty) toggleDifficulty(true);
        if (settings.hideAcceptance) toggleAcceptance(true);
        if (settings.hideTopics) toggleTopics(true);
      } catch (error) {
        console.error("Error applying settings:", error);
      }
    }
  );
}

// Cleanup function to disconnect observer
function cleanup() {
  if (globalObserver) {
    globalObserver.disconnect();
    globalObserver = null;
  }
}

// More targeted MutationObserver
function setupObserver() {
  cleanup(); // Cleanup any existing observer

  globalObserver = new MutationObserver((mutations) => {
    // Only process mutations if they affect the problem list or problem page
    const relevantMutation = mutations.some((mutation) => {
      const target = mutation.target;
      return (
        target.classList?.contains("problems-table") ||
        target.id === "app" ||
        target.querySelector(".problems-table, #app")
      );
    });

    if (relevantMutation) {
      chrome.storage.sync.get(
        {
          hideDifficulty: true,
          hideAcceptance: true,
          hideTopics: false,
        },
        (settings) => {
          try {
            console.log("Reapplying settings:", settings);
            if (settings.hideDifficulty) toggleDifficulty(true);
            if (settings.hideAcceptance) toggleAcceptance(true);
            if (settings.hideTopics) toggleTopics(true);
          } catch (error) {
            console.error("Error reapplying settings after DOM change:", error);
          }
        }
      );
    }
  });

  // More specific targeting of what to observe
  const appElement = document.getElementById("app");
  if (appElement) {
    globalObserver.observe(appElement, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  }
}

// Improved toggle functions with error handling
function toggleDifficulty(hide) {
  try {
    console.log(`Toggling difficulty ${hide ? "off" : "on"}`);
    const difficulties = ["Easy", "Medium", "Hard"];

    // Target the specific difficulty label elements
    const elements = document.querySelectorAll(
      'div.relative.inline-flex.items-center.justify-center.text-caption[class*="text-difficulty-"]'
    );
    console.log(`Found ${elements.length} difficulty elements`);

    elements.forEach((el) => {
      const text = el.textContent.trim();
      console.log("Processing element:", text);
      if (difficulties.includes(text)) {
        console.log(`Hiding difficulty element: ${text}`);
        el.style.display = hide ? "none" : "inline-flex";
      }
    });
  } catch (error) {
    console.error("Error toggling difficulty:", error);
  }
}

function toggleAcceptance(hide) {
  try {
    console.log(`Toggling acceptance rate ${hide ? "off" : "on"}`);
    // Updated selector for acceptance rate
    const elements = document.querySelectorAll(
      'div.mr-4:has(div:contains("Acceptance Rate")), div:has(> div.text-label-2:contains("Acceptance Rate"))'
    );
    console.log(`Found ${elements.length} acceptance rate elements`);

    elements.forEach((el) => {
      console.log(`Hiding acceptance rate container`);
      el.style.display = hide ? "none" : "flex";
    });
  } catch (error) {
    console.error("Error toggling acceptance rate:", error);
  }
}

function toggleTopics(hide) {
  try {
    console.log(`Toggling topics ${hide ? "off" : "on"}`);
    // Target the specific Topics button element
    const elements = document.querySelectorAll(
      'div.relative.inline-flex.items-center.justify-center.text-caption.rounded-full.bg-fill-secondary:has(div:contains("Topics"))'
    );
    console.log(`Found ${elements.length} topic elements`);

    elements.forEach((el) => {
      console.log(`Hiding topic button: ${el.textContent.trim()}`);
      el.style.display = hide ? "none" : "inline-flex";
    });
  } catch (error) {
    console.error("Error toggling topics:", error);
  }
}

// Improved message listener with error handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
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
    sendResponse({ success: true });
  } catch (error) {
    console.error("Error processing message:", error);
    sendResponse({ success: false, error: error.message });
  }
  return true; // Keep message channel open for async response
});

// Initialize only once when the page is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initialize();
    setupObserver();
  });
} else {
  initialize();
  setupObserver();
}

// Cleanup on page unload
window.addEventListener("unload", cleanup);
