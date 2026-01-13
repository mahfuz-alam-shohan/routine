export const ADMIN_SETUP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Admin Setup</title>
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; padding-top: 50px; background: #f4f4f4; }
    form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); width: 300px; }
    input { width: 100%; padding: 8px; margin: 10px 0; box-sizing: border-box; }
    button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; }
    button:hover { background: #0056b3; }
  </style>
</head>
<body>
  <form onsubmit="createAdmin(event)">
    <h2>Create Root Admin</h2>
    <input type="email" id="email" placeholder="Email" required />
    <input type="password" id="password" placeholder="Password" required />
    <button type="submit">Create Admin</button>
  </form>

  <script>
    async function createAdmin(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      const res = await fetch('/admin/setup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if(data.success) {
        alert("Admin Created! You can now login.");
        window.location.href = '/admin/dashboard';
      } else {
        alert("Error: " + data.error);
      }
    }
  </script>
</body>
</html>
`;