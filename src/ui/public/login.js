// src/ui/public/login.js

export function LOGIN_HTML(companyName) {
    return `
    <div class="flex min-h-[calc(100vh-64px)]">
        
        <div class="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-12 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div class="relative z-10 text-white max-w-lg">
                <h2 class="text-4xl font-bold mb-6">Manage your institution with confidence.</h2>
                <p class="text-blue-100 text-lg leading-relaxed mb-8">
                    "${companyName} has transformed how we handle our academic scheduling. It's not just software; it's peace of mind."
                </p>
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">P</div>
                    <div>
                        <p class="font-bold text-sm">Principal, Dhaka Model College</p>
                        <p class="text-xs text-blue-200">Verified User</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
            <div class="w-full max-w-md space-y-8">
                
                <div class="text-left">
                    <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
                    <p class="mt-2 text-sm text-gray-500">Please enter your details to sign in.</p>
                </div>

                <form class="space-y-6" id="loginForm" onsubmit="handleLogin(event)">
                    
                    <div class="space-y-5">
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input id="email" name="email" type="email" required 
                                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all" 
                                placeholder="name@school.edu">
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input id="password" name="password" type="password" required 
                                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all" 
                                placeholder="••••••••">
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
                        </div>
                        <div class="text-sm">
                            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" id="submitBtn"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-sm">
                            Sign in
                        </button>
                    </div>
                </form>

                <p class="mt-2 text-center text-sm text-gray-500">
                    Don't have an account? 
                    <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Contact Sales</a>
                </p>
            </div>
        </div>
    </div>

    <script>
        async function handleLogin(e) {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const originalText = btn.innerText;
            btn.innerText = "Signing in...";
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    // Redirect based on role
                    if (result.role === 'admin') window.location.href = '/admin/dashboard';
                    else if (result.role === 'institute') window.location.href = '/school/dashboard';
                    else if (result.role === 'teacher') window.location.href = '/teacher/dashboard';
                    else window.location.href = '/'; 
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Login failed");
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (error) {
                console.error('Login error:', error);
                alert("Network error. Please try again.");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
    </script>
    `;
}
