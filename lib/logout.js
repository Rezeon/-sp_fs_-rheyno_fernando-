export async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
}
