// src/core/auth.js

// 1. Hash a new password (for Setup/Registration)
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = [...salt].map(b => b.toString(16).padStart(2, '0')).join('');
  
  const data = encoder.encode(password + saltHex);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  return { hash: hashHex, salt: saltHex };
}

// 2. Verify a password (for Login)
// We take the input password, mix it with the STORED salt, and see if it matches the STORED hash.
export async function verifyPassword(inputPassword, storedHash, storedSalt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputPassword + storedSalt);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const computedHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  return computedHash === storedHash;
}