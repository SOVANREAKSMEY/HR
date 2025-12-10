// Simple authentication check
console.log('Admin check: Verifying authentication...');

const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
console.log('Admin check: Login status =', isLoggedIn);

if (isLoggedIn !== 'true') {
  console.log('Admin check: Not authenticated, redirecting to login...');
  window.location.replace('login.html');
}