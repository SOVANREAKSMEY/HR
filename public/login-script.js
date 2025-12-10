// Check if already logged in
(function() {
  console.log('Checking if already logged in...');
  const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
  console.log('Current login status:', isLoggedIn);
  
  if (isLoggedIn === 'true') {
    console.log('Already logged in, redirecting to admin...');
    window.location.replace('admin.html');
  }
})();

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');
  
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      sessionStorage.setItem('adminLoggedIn', 'true');
      window.location.href = 'admin.html';
    } else {
      errorMessage.textContent = data.message || 'Invalid username or password';
      errorMessage.classList.add('show');
      
      setTimeout(() => {
        errorMessage.classList.remove('show');
      }, 3000);
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.textContent = 'Login failed. Please try again.';
    errorMessage.classList.add('show');
  }
});
