document.addEventListener("DOMContentLoaded", () => {
  const difficultyCheckbox = document.getElementById("toggle-difficulty");
  const acceptanceCheckbox = document.getElementById("toggle-acceptance-rate");
  const topicsCheckbox = document.getElementById("toggle-topics");

  console.log("Popup initialized");

  // Load initial settings from storage
  chrome.storage.sync.get(
    {
      hideDifficulty: true,
      hideAcceptance: false,
      hideTopics: false,
    },
    (settings) => {
      console.log("Loading initial settings:", settings);
      difficultyCheckbox.checked = settings.hideDifficulty;
      acceptanceCheckbox.checked = settings.hideAcceptance;
      topicsCheckbox.checked = settings.hideTopics;
    }
  );

  // Add event listeners for toggles
  difficultyCheckbox.addEventListener("change", () => {
    const isHidden = difficultyCheckbox.checked;
    console.log("Difficulty checkbox changed:", isHidden);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url.includes("leetcode.com")) {
        console.log("Sending toggleDifficulty message");
        chrome.tabs.sendMessage(
          tab.id,
          {
            action: "toggleDifficulty",
            isHidden,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error:", chrome.runtime.lastError);
            } else {
              console.log("Toggle difficulty response:", response);
            }
          }
        );
      }
    });
  });

  acceptanceCheckbox.addEventListener("change", () => {
    const isHidden = acceptanceCheckbox.checked;
    console.log("Acceptance checkbox changed:", isHidden);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url.includes("leetcode.com")) {
        console.log("Sending toggleAcceptance message");
        chrome.tabs.sendMessage(
          tab.id,
          {
            action: "toggleAcceptance",
            isHidden,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error:", chrome.runtime.lastError);
            } else {
              console.log("Toggle acceptance response:", response);
            }
          }
        );
      }
    });
  });

  topicsCheckbox.addEventListener("change", () => {
    const isHidden = topicsCheckbox.checked;
    console.log("Topics checkbox changed:", isHidden);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url.includes("leetcode.com")) {
        console.log("Sending toggleTopics message");
        chrome.tabs.sendMessage(
          tab.id,
          {
            action: "toggleTopics",
            isHidden,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error:", chrome.runtime.lastError);
            } else {
              console.log("Toggle topics response:", response);
            }
          }
        );
      }
    });
  });
});
