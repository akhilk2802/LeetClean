// Listener for extension installation or updates
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("LeetClean installed!");
    notifyUser(
      "Welcome to LeetClean!",
      "Your extension is ready to customize your LeetCode experience."
    );
  } else if (details.reason === "update") {
    console.log("LeetClean updated!");
    notifyUser(
      "Extension Updated",
      "We've applied some improvements. Please refresh your open LeetCode tabs."
    );
  }

  // Reload any open LeetCode.com tabs to apply updates
  reloadLeetCodeTabs();
});

// Function to reload open LeetCode.com tabs
function reloadLeetCodeTabs() {
  chrome.tabs.query({ url: "*://*.leetcode.com/*" }, (tabs) => {
    if (tabs.length) {
      notifyUser(
        "LeetClean Updated",
        "Please refresh your LeetCode tabs to apply the updates."
      );
    }
  });
}

// Function to show a notification
function notifyUser(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: title,
    message: message,
  });
}
