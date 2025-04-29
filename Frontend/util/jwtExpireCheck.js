export function isTokenValid(token) {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false; // Not a valid JWT
    
    const payload = parts[1];
    // Decode Base64 payload (handling URL-safe characters)
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    const exp = decodedPayload.exp;
    if (!exp) return false;
    
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
}
