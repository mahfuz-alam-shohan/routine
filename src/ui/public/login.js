// src/ui/public/login.js

export const LOGIN_HTML = `
<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" onsubmit="handleLogin(event)">
      
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
        <div class="mt-2">
          <input id="email" name="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div class="text-sm">
            <a href="#" class="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
          </div>
        </div>
        <div class="mt-2">
          <input id="password" name="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
        </div>
      </div>

      <div id="error-msg" class="text-red-500 text-sm text-center hidden"></div>

      <div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            Sign in
        </button>
      </div>
    </form>
  </div>
</div>

<script>
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errBox = document.getElementById('error-msg');
    const btn = e.target.querySelector('button');

    btn.innerText = "Verifying...";
    btn.disabled = true;
    errBox.classList.add('hidden');

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            // Redirect based on role
            if(data.role === 'ADMIN') window.location.href = '/admin/dashboard';
            else if(data.role === 'INSTITUTE') window.location.href = '/school/dashboard';
            else window.location.href = '/';
        } else {
            errBox.innerText = data.error || "Login failed";
            errBox.classList.remove('hidden');
            btn.innerText = "Sign in";
            btn.disabled = false;
        }
    } catch (e) {
        errBox.innerText = "Network Error";
        errBox.classList.remove('hidden');
        btn.disabled = false;
    }
}
</script>
`;