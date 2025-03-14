document.addEventListener("DOMContentLoaded", () => {
  const difficultyCheckbox = document.getElementById("toggle-difficulty");
  const acceptanceCheckbox = document.getElementById("toggle-acceptance-rate");
  const topicsCheckbox = document.getElementById("toggle-topics");

  // Load initial settings from storage
  chrome.storage.sync.get(
    {
      hideDifficulty: true,
      hideAcceptance: false,
      hideTopics: false,
    },
    (settings) => {
      difficultyCheckbox.checked = settings.hideDifficulty;
      acceptanceCheckbox.checked = settings.hideAcceptance;
      topicsCheckbox.checked = settings.hideTopics;
    }
  );

  // Add event listeners for toggles
  difficultyCheckbox.addEventListener("change", () => {
    const isHidden = difficultyCheckbox.checked;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url.includes("leetcode.com")) {
        chrome.tabs.sendMessage(tab.id, {
          action: "toggleDifficulty",
          isHidden,
        });
      }
    });
  });

  acceptanceCheckbox.addEventListener("change", () => {
    const isHidden = acceptanceCheckbox.checked;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleAcceptance",
        isHidden,
      });
    });
  });

  topicsCheckbox.addEventListener("change", () => {
    const isHidden = topicsCheckbox.checked;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleTopics", isHidden });
    });
  });
});
