document.addEventListener('DOMContentLoaded', () => {
  const contextForm = document.getElementById('contextForm');
  if (contextForm) {
    contextForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const siteTitle = document.getElementById('siteTitle').value;
      const siteDescription = document.getElementById('siteDescription').value;
      try {
        const res = await fetch('/api/context', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteTitle, siteDescription }),
        });
        if (res.ok) {
          alert('Site context saved.');
        } else {
          alert('Error saving context.');
        }
      } catch (err) {
        console.error(err);
        alert('Network error saving context.');
      }
    });
  }

  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('blockFile');
      if (!fileInput.files.length) {
        alert('Please select a block file to upload.');
        return;
      }
      const formData = new FormData();
      formData.append('blockFile', fileInput.files[0]);
      try {
        const res = await fetch('/api/upload-block', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          fileInput.value = '';
          await loadBlocks();
          alert('Block uploaded successfully.');
        } else {
          alert('Error uploading block.');
        }
      } catch (err) {
        console.error(err);
        alert('Network error uploading block.');
      }
    });
  }

  async function loadBlocks() {
    try {
      const res = await fetch('/blocks/');
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'))
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && h.endsWith('.html'));
      const blockList = document.getElementById('blocksList');
      if (!blockList) return;
      blockList.innerHTML = '';
      links.forEach((link) => {
        const li = document.createElement('li');
        li.className = 'block-item';
        li.textContent = link.split('/').pop();
        blockList.appendChild(li);
      });
    } catch (err) {
      console.error(err);
    }
  }

  loadBlocks();
});
