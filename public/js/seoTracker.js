// seoTracker.js - monitors keywords and suggests SEO improvements
const seoStopWords = ['the','and','for','are','but','with','that','this','your','from','you','have','has','was','were','will','shall','can','our','too','very','also','into','out','about','more','some','them','they','their','then','than','after','before','such','had','been','use'];

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !seoStopWords.includes(word));
}

const seoTracker = {
  update: function () {
    const titleEl = document.getElementById('title');
    const descEl = document.getElementById('description');
    let fullText = '';
    if (titleEl) fullText += ' ' + titleEl.value;
    if (descEl) fullText += ' ' + descEl.value;
    const blocksList = document.getElementById('blocks-list');
    if (blocksList) {
      blocksList.querySelectorAll('.block-item').forEach((item) => {
        fullText += ' ' + item.innerText;
      });
    }
    const words = extractKeywords(fullText);
    const freq = {};
    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const liveFeed = document.getElementById('live-feed');
    if (!liveFeed) return;
    liveFeed.innerHTML = '';
    if (sorted.length === 0) {
      liveFeed.textContent = 'Provide more descriptive content to see keyword trends.';
    } else {
      const ul = document.createElement('ul');
      sorted.forEach(([word, count]) => {
        const li = document.createElement('li');
        li.textContent = `${word} (${count})`;
        ul.appendChild(li);
      });
      liveFeed.appendChild(ul);
    }
    // Send trending keywords to the server for storage
    fetch('/api/seo-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords: sorted.map(([w]) => w) }),
    }).catch((err) => console.error('Failed to send SEO score:', err));
  },
};

function initSeoTracker() {
  const contextForm = document.getElementById('context-form');
  if (contextForm) {
    contextForm.addEventListener('submit', () => {
      // Wait a moment to allow context to be saved
      setTimeout(() => seoTracker.update(), 500);
    });
  }
  // Expose seoTracker globally so app.js can call update after block uploads
  window.seoTracker = seoTracker;
}

document.addEventListener('DOMContentLoaded', initSeoTracker);
