// Function to hide difficulty levels and topics
function hideLeetCodeDetails() {
  // Hide difficulty levels
  const difficultyLabels = document.querySelectorAll(".difficulty-label");
  difficultyLabels.forEach((label) => {
    label.style.display = "none";
  });

  // Hide topics (you may need to adjust this selector based on LeetCode's DOM)
  const topics = document.querySelectorAll(".topic-tag");
  topics.forEach((topic) => {
    topic.style.display = "none";
  });
}

// Run the function on page load
document.addEventListener("DOMContentLoaded", hideLeetCodeDetails);

// Observe for dynamic content updates (LeetCode uses single-page app structure)
const observer = new MutationObserver(hideLeetCodeDetails);
observer.observe(document.body, { childList: true, subtree: true });
