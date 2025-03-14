// Global observer instance
let globalObserver = null;

function initialize() {
  chrome.storage.sync.get(
    {
      hideDifficulty: true,
      hideAcceptance: true,
      hideTopics: false,
    },
    (settings) => {
      try {
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
    const difficulties = ["Easy", "Medium", "Hard"];
    document
      .querySelectorAll("span[data-difficulty], div[data-difficulty]")
      .forEach((el) => {
        if (difficulties.includes(el.textContent.trim())) {
          el.style.display = hide ? "none" : "";
        }
      });
  } catch (error) {
    console.error("Error toggling difficulty:", error);
  }
}

function toggleAcceptance(hide) {
  try {
    document.querySelectorAll("div[role='cell']").forEach((el) => {
      const text = el.textContent.trim();
      if (/^\d+\.?\d*%$/.test(text)) {
        el.style.display = hide ? "none" : "";
      }
    });
  } catch (error) {
    console.error("Error toggling acceptance rate:", error);
  }
}

function toggleTopics(hide) {
  try {
    document.querySelectorAll(".topic-tag, .tag__1z4C").forEach((el) => {
      el.style.display = hide ? "none" : "";
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
