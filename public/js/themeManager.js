// themeManager.js - manages dynamic theme loading and application
async function loadThemes() {
  try {
    const res = await fetch('/api/themes');
    const themes = await res.json();
    const select = document.getElementById('theme-select');
    if (!select) return;
    // Populate theme options
    themes.forEach((theme, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = theme.name;
      select.appendChild(option);
    });
    // Apply first theme by default
    if (themes.length > 0) {
      applyTheme(themes[0]);
    }
    select.addEventListener('change', () => {
      const idx = parseInt(select.value, 10);
      applyTheme(themes[idx]);
    });
  } catch (err) {
    console.error('Failed to load themes:', err);
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  // Set CSS custom properties based on theme colors
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.text);
  root.style.setProperty('--header-bg', theme.colors.header);
  // Header text: choose contrasting color for readability
  const headerText = getContrastColor(theme.colors.header);
  root.style.setProperty('--header-text', headerText);
  root.style.setProperty('--nav-bg', theme.colors.nav);
  root.style.setProperty('--nav-text', getContrastColor(theme.colors.nav));
  root.style.setProperty('--accent-color', theme.colors.accent);
  // Apply navigation style classes
  const nav = document.getElementById('site-nav');
  if (nav) {
    nav.classList.remove('vertical', 'horizontal');
    if (theme.navStyle === 'side') {
      nav.classList.add('vertical');
    } else {
      nav.classList.add('horizontal');
    }
  }
}

// Utility to compute contrast (simple check)
function getContrastColor(hex) {
  if (!hex) return '#ffffff';
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

document.addEventListener('DOMContentLoaded', loadThemes);
