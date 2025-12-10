const API_URL = 'http://localhost:3000/api';

// Authentication check
function checkAuthentication() {
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
  if (isLoggedIn !== 'true') {
    window.location.replace('login.html');
    return false;
  }
  return true;
}

// Check auth on page load
if (!checkAuthentication()) {
  throw new Error('Not authenticated');
}

// Load admin posters
async function loadAdminPosters() {
  try {
    console.log('Loading admin posters...');
    const response = await fetch(`${API_URL}/posters`);
    const posters = await response.json();
    console.log('Loaded posters:', posters);
    displayAdminPosters(posters);
  } catch (error) {
    console.error('Error loading posters:', error);
  }
}

// Display admin posters
function displayAdminPosters(posters) {
  const container = document.getElementById('admin-posters-container');
  
  if (!container) {
    console.error('Admin posters container not found');
    return;
  }
  
  if (posters.length === 0) {
    container.innerHTML = '<div class="no-posters-admin">No posters yet. Create your first one above!</div>';
    return;
  }

  // Sort by order (if exists) then by creation date (newest first)
  const sortedPosters = posters.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  container.innerHTML = sortedPosters.map((poster, index) => {
    const bannerUrl = poster.banner ? 
      (poster.banner.startsWith('http') ? poster.banner : `uploads/${poster.banner}`) : '';
    
    return `
    <div class="admin-poster-card-compact" data-id="${poster.id}" draggable="true">
      <div class="drag-handle">⋮⋮</div>
      <div class="poster-order">#${index + 1}</div>
      
      <div class="poster-content">
        ${bannerUrl ? `<img src="${bannerUrl}" class="poster-thumbnail">` : '<div class="no-image">📷</div>'}
        
        <div class="poster-info">
          <h4>${poster.title}</h4>
          <p>${poster.description.substring(0, 40)}${poster.description.length > 40 ? '...' : ''}</p>
          <div class="contact-summary">
            ${poster.phone ? '📞' : ''}${poster.telegram ? '✈️' : ''}${poster.facebook ? '📘' : ''}${poster.email ? '📧' : ''}${poster.applyLink ? '🔗' : ''}
          </div>
        </div>
        
        <div class="actions-compact">
          <button class="btn-small btn-edit" onclick="editPoster(${poster.id})" title="Edit">✏️</button>
          <button class="btn-small btn-delete" onclick="deletePoster(${poster.id})" title="Delete">🗑️</button>
        </div>
      </div>
    </div>
    `;
  }).join('');

  // Add drag and drop functionality
  initializeSimpleDragDrop();
}

// Banner preview
document.addEventListener('DOMContentLoaded', function() {
  const bannerInput = document.getElementById('banner');
  if (bannerInput) {
    bannerInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const preview = document.getElementById('banner-preview');
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.innerHTML = `<img src="${e.target.result}" style="max-width: 300px; margin-top: 10px; border-radius: 8px;">`;
        };
        reader.readAsDataURL(file);
      } else {
        preview.innerHTML = '';
      }
    });
  }
});

// Poster form submission
document.addEventListener('DOMContentLoaded', function() {
  const posterForm = document.getElementById('poster-form');
  if (posterForm) {
    posterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      console.log('Submitting poster form...');
      
      const posterId = document.getElementById('poster-id').value;
      let bannerFilename = posterForm.dataset.currentBanner || '';
      
      // Upload banner if new file selected
      const bannerFile = document.getElementById('banner').files[0];
      if (bannerFile) {
        const formData = new FormData();
        formData.append('banner', bannerFile);
        
        try {
          console.log('Uploading banner:', bannerFile.name);
          const uploadResponse = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
          });
          
          const uploadData = await uploadResponse.json();
          
          if (!uploadResponse.ok) {
            throw new Error(uploadData.error || 'Upload failed');
          }
          
          bannerFilename = uploadData.filename;
          console.log('Banner uploaded successfully:', bannerFilename);
        } catch (error) {
          console.error('Error uploading banner:', error);
          alert('Error uploading banner image. Please try again.');
          return;
        }
      }
      
      const posterData = {
        title: document.getElementById('title').value,
        titleKh: document.getElementById('titleKh').value,
        description: document.getElementById('description').value,
        descriptionKh: document.getElementById('descriptionKh').value,
        applyButtonText: document.getElementById('applyButtonText').value || 'Apply Now',
        applyButtonTextKh: document.getElementById('applyButtonTextKh').value || 'ដាក់ពាក្យ',
        banner: bannerFilename,
        applyLink: document.getElementById('applyLink').value,
        phone: document.getElementById('phone').value,
        telegram: document.getElementById('telegram').value,
        facebook: document.getElementById('facebook').value,
        email: document.getElementById('email').value
      };

      console.log('Saving poster with data:', posterData);

      try {
        if (posterId) {
          await fetch(`${API_URL}/posters/${posterId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(posterData)
          });
        } else {
          await fetch(`${API_URL}/posters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(posterData)
          });
        }
        
        resetForm();
        loadAdminPosters();
        alert('Poster saved successfully!');
      } catch (error) {
        console.error('Error saving poster:', error);
        alert('Error saving poster. Please try again.');
      }
    });
  }
});

// Edit poster
async function editPoster(id) {
  try {
    const response = await fetch(`${API_URL}/posters`);
    const posters = await response.json();
    const poster = posters.find(p => p.id === id);
    
    if (poster) {
      document.getElementById('poster-id').value = poster.id;
      document.getElementById('title').value = poster.title;
      document.getElementById('titleKh').value = poster.titleKh || '';
      document.getElementById('description').value = poster.description;
      document.getElementById('descriptionKh').value = poster.descriptionKh || '';
      document.getElementById('applyButtonText').value = poster.applyButtonText || 'Apply Now';
      document.getElementById('applyButtonTextKh').value = poster.applyButtonTextKh || 'ដាក់ពាក្យ';
      document.getElementById('applyLink').value = poster.applyLink || '';
      document.getElementById('phone').value = poster.phone || '';
      document.getElementById('telegram').value = poster.telegram || '';
      document.getElementById('facebook').value = poster.facebook || '';
      document.getElementById('email').value = poster.email || '';
      
      // Store current banner
      document.getElementById('poster-form').dataset.currentBanner = poster.banner || '';
      
      // Show current banner preview
      if (poster.banner) {
        const bannerUrl = poster.banner.startsWith('http') ? poster.banner : `uploads/${poster.banner}`;
        document.getElementById('banner-preview').innerHTML = 
          `<img src="${bannerUrl}" style="max-width: 300px; margin-top: 10px; border-radius: 8px;">`;
      }
      
      document.getElementById('form-title').textContent = 'Edit Job Poster';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (error) {
    console.error('Error loading poster:', error);
  }
}

// Delete poster
async function deletePoster(id) {
  if (!confirm('Are you sure you want to delete this poster?')) return;
  
  try {
    await fetch(`${API_URL}/posters/${id}`, { method: 'DELETE' });
    loadAdminPosters();
    alert('Poster deleted successfully!');
  } catch (error) {
    console.error('Error deleting poster:', error);
    alert('Error deleting poster. Please try again.');
  }
}

// Reset form
function resetForm() {
  const form = document.getElementById('poster-form');
  if (form) {
    form.reset();
    document.getElementById('poster-id').value = '';
    document.getElementById('banner-preview').innerHTML = '';
    form.dataset.currentBanner = '';
    document.getElementById('form-title').textContent = 'Add New Job Poster';
    document.getElementById('titleKh').value = '';
    document.getElementById('descriptionKh').value = '';
    document.getElementById('applyButtonText').value = '';
    document.getElementById('applyButtonTextKh').value = '';
  }
}

// Load settings
async function loadSettings() {
  try {
    console.log('Loading settings...');
    const response = await fetch(`${API_URL}/settings`);
    const settings = await response.json();
    console.log('Loaded settings:', settings);
    
    const languageSelect = document.getElementById('language');
    const headerTextInput = document.getElementById('headerText');
    const headerTextKhInput = document.getElementById('headerTextKh');
    const titleFontSelect = document.getElementById('titleFont');
    const descriptionFontSelect = document.getElementById('descriptionFont');
    
    if (languageSelect) languageSelect.value = settings.language || 'en';
    if (headerTextInput) headerTextInput.value = settings.headerText || 'Job Opportunities';
    if (headerTextKhInput) headerTextKhInput.value = settings.headerTextKh || 'ឱកាសការងារ';
    if (titleFontSelect) titleFontSelect.value = settings.titleFont || 'Segoe UI';
    if (descriptionFontSelect) descriptionFontSelect.value = settings.descriptionFont || 'Segoe UI';
    
    const themeSelect = document.getElementById('theme');
    if (themeSelect) themeSelect.value = settings.theme || 'golden';
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

// Settings form submission
document.addEventListener('DOMContentLoaded', function() {
  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      console.log('Submitting settings form...');
      
      const settings = {
        language: document.getElementById('language').value,
        headerText: document.getElementById('headerText').value,
        headerTextKh: document.getElementById('headerTextKh').value,
        titleFont: document.getElementById('titleFont').value,
        descriptionFont: document.getElementById('descriptionFont').value,
        theme: document.getElementById('theme').value
      };
      
      console.log('Saving settings:', settings);
      
      try {
        const response = await fetch(`${API_URL}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
        
        if (response.ok) {
          // Apply theme immediately to admin panel
          const theme = document.getElementById('theme').value;
          applyAdminTheme(theme);
          alert('Settings saved successfully!');
        } else {
          throw new Error('Failed to save settings');
        }
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
      }
    });
  }
});

// Logout function
function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  window.location.href = 'login.html';
}

// Apply admin theme
function applyAdminTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme || 'golden');
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin panel initializing...');
  
  // Show admin content
  const authLoading = document.getElementById('auth-loading');
  const adminContent = document.getElementById('admin-content');
  
  if (authLoading) authLoading.style.display = 'none';
  if (adminContent) adminContent.style.display = 'block';
  
  // Add save button event listener
  const saveBtn = document.getElementById('save-order-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveNewOrder);
  }
  
  // Load data and apply theme
  loadSettings().then(() => {
    // Apply theme to admin panel too
    const theme = document.getElementById('theme')?.value || 'golden';
    applyAdminTheme(theme);
  });
  loadAdminPosters();
  
  console.log('Admin panel initialized');
});

// Move poster up/down
async function movePoster(id, direction) {
  try {
    const response = await fetch(`${API_URL}/posters`);
    const posters = await response.json();
    
    const sortedPosters = posters.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    const currentIndex = sortedPosters.findIndex(p => p.id === id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < sortedPosters.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return;
    }
    
    // Swap positions
    const temp = sortedPosters[currentIndex];
    sortedPosters[currentIndex] = sortedPosters[newIndex];
    sortedPosters[newIndex] = temp;
    
    // Update order for all posters
    for (let i = 0; i < sortedPosters.length; i++) {
      await fetch(`${API_URL}/posters/${sortedPosters[i].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sortedPosters[i], order: i })
      });
    }
    
    loadAdminPosters();
  } catch (error) {
    console.error('Error moving poster:', error);
  }
}

// Initialize simple drag and drop
function initializeSimpleDragDrop() {
  const container = document.getElementById('admin-posters-container');
  let draggedElement = null;
  
  // Add event listeners to all cards (not just handles)
  container.querySelectorAll('.admin-poster-card-compact').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedElement = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', card.outerHTML);
    });
    
    card.addEventListener('dragend', () => {
      if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement = null;
      }
    });
    
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      // Add visual feedback
      if (draggedElement && card !== draggedElement) {
        card.classList.add('drag-over');
      }
    });
    
    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });
    
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      
      if (!draggedElement || card === draggedElement) return;
      
      // Determine drop position
      const rect = card.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      
      if (e.clientY < midpoint) {
        container.insertBefore(draggedElement, card);
      } else {
        container.insertBefore(draggedElement, card.nextSibling);
      }
      
      // Update order numbers and show save button
      updateOrderNumbers();
      showSaveButton();
    });
  });
}

// Update order numbers visually
function updateOrderNumbers() {
  const cards = document.querySelectorAll('.admin-poster-card-compact');
  cards.forEach((card, index) => {
    const orderElement = card.querySelector('.poster-order');
    if (orderElement) {
      orderElement.textContent = `#${index + 1}`;
    }
  });
}

// Show save button
function showSaveButton() {
  const saveBtn = document.getElementById('save-order-btn');
  if (saveBtn) {
    saveBtn.classList.add('show');
    saveBtn.textContent = '💾 Save New Order';
    saveBtn.disabled = false;
  }
}

// Save new order to database
async function saveNewOrder() {
  const cards = document.querySelectorAll('.admin-poster-card-compact');
  const saveBtn = document.getElementById('save-order-btn');
  
  if (!saveBtn || cards.length === 0) return;
  
  try {
    saveBtn.textContent = '💾 Saving...';
    saveBtn.disabled = true;
    
    // Get current posters data
    const response = await fetch(`${API_URL}/posters`);
    const posters = await response.json();
    
    // Update each poster with new order
    for (let i = 0; i < cards.length; i++) {
      const posterId = parseInt(cards[i].dataset.id);
      const poster = posters.find(p => p.id === posterId);
      
      if (poster) {
        await fetch(`${API_URL}/posters/${posterId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...poster, order: i })
        });
      }
    }
    
    saveBtn.textContent = '✅ Saved!';
    setTimeout(() => {
      saveBtn.classList.remove('show');
      saveBtn.textContent = '💾 Save New Order';
      saveBtn.disabled = false;
    }, 2000);
    
  } catch (error) {
    console.error('Error saving order:', error);
    saveBtn.textContent = '❌ Error - Try Again';
    saveBtn.disabled = false;
  }
}