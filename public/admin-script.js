const API_URL = '/api';

async function loadAdminPosters() {
  try {
    const response = await fetch(`${API_URL}/posters`);
    const posters = await response.json();
    displayAdminPosters(posters);
  } catch (error) {
    console.error('Error loading posters:', error);
  }
}

function displayAdminPosters(posters) {
  const container = document.getElementById('admin-posters-container');
  
  if (posters.length === 0) {
    container.innerHTML = '<div class="no-posters-admin">No posters yet. Create your first one above!</div>';
    return;
  }

  container.innerHTML = posters.map(poster => {
    const bannerUrl = poster.banner ? 
      (poster.banner.startsWith('http') ? poster.banner : `uploads/${poster.banner}`) : '';
    
    return `
    <div class="admin-poster-card">
      ${bannerUrl ? `<img src="${bannerUrl}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">` : ''}
      <h3>${poster.title}</h3>`;
      <p>${poster.description}</p>
      <div class="contact-info">
        ${poster.applyLink ? `Apply: ${poster.applyLink}<br>` : ''}
        ${poster.phone ? `Phone: ${poster.phone}<br>` : ''}
        ${poster.telegram ? `Telegram: ${poster.telegram}<br>` : ''}
        ${poster.facebook ? `Facebook: ${poster.facebook}<br>` : ''}
        ${poster.email ? `Email: ${poster.email}<br>` : ''}
      </div>
      <div class="actions">
        <button class="btn btn-edit" onclick="editPoster(${poster.id})">Edit</button>
        <button class="btn btn-delete" onclick="deletePoster(${poster.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Banner preview
document.getElementById('banner').addEventListener('change', (e) => {
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

document.getElementById('poster-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const posterId = document.getElementById('poster-id').value;
  let bannerFilename = document.getElementById('poster-form').dataset.currentBanner || '';
  
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

function resetForm() {
  document.getElementById('poster-form').reset();
  document.getElementById('poster-id').value = '';
  document.getElementById('banner-preview').innerHTML = '';
  document.getElementById('poster-form').dataset.currentBanner = '';
  document.getElementById('form-title').textContent = 'Add New Job Poster';
  document.getElementById('titleKh').value = '';
  document.getElementById('descriptionKh').value = '';
  document.getElementById('applyButtonText').value = '';
  document.getElementById('applyButtonTextKh').value = '';
}

loadAdminPosters();

function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  window.location.href = 'login.html';
}

// Load and save settings
async function loadSettings() {
  try {
    const response = await fetch(`${API_URL}/settings`);
    const settings = await response.json();
    
    document.getElementById('language').value = settings.language || 'en';
    document.getElementById('headerText').value = settings.headerText || 'Job Opportunities';
    document.getElementById('headerTextKh').value = settings.headerTextKh || 'ឱកាសការងារ';
    document.getElementById('titleFont').value = settings.titleFont || 'Segoe UI';
    document.getElementById('descriptionFont').value = settings.descriptionFont || 'Segoe UI';
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

document.getElementById('settings-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const settings = {
    language: document.getElementById('language').value,
    headerText: document.getElementById('headerText').value,
    headerTextKh: document.getElementById('headerTextKh').value,
    titleFont: document.getElementById('titleFont').value,
    descriptionFont: document.getElementById('descriptionFont').value
  };
  
  try {
    await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    
    alert('Settings saved successfully!');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Error saving settings. Please try again.');
  }
});

loadSettings();
