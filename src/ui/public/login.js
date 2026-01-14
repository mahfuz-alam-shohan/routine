// src/ui/public/login.js

export function LOGIN_HTML(companyName) {
    return `
    <div class="flex min-h-[calc(100vh-64px)]">
        
        <div class="hidden lg:flex lg:w-1/2 bg-blue-700 relative overflow-hidden items-center justify-center">
            
            <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/30 rounded-full mix-blend-overlay filter blur-3xl"></div>
                <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/30 rounded-full mix-blend-overlay filter blur-3xl"></div>
                <div class="absolute top-[20%] right-[20%] w-32 h-32 bg-white/10 rounded-full mix-blend-overlay filter blur-2xl"></div>
            </div>
            
            <div class="relative z-10 p-12 text-white max-w-lg">
                <div class="mb-6 inline-block p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                <h2 class="text-4xl font-bold mb-4 tracking-tight">Academic Management Simplified.</h2>
                <p class="text-blue-100 text-lg leading-relaxed">
                    Access your institution's dashboard to manage routines, teachers, and classes efficiently.
                </p>
            </div>
        </div>

        <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
            <div class="w-full max-w-sm space-y-8">
                
                <div class="text-center md:text-left">
                    <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Sign In</h1>
                    <p class="mt-2 text-sm text-gray-500">Continue to ${companyName}</p>
                </div>

                <form class="space-y-6" id="loginForm" onsubmit="handleLogin(event)">
                    
                    <div class="space-y-4">
                        <div>
                            <label for="email" class="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                            <input id="email" name="email" type="email" required 
                                class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all" 
                                placeholder="admin@school.edu">
                        </div>
                        <div>
                            <label for="password" class="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
                            <input id="password" name="password" type="password" required 
                                class="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all" 
                                placeholder="••••••••">
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <label class="flex items-center cursor-pointer">
                            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <span class="ml-2 text-sm text-gray-600">Keep me logged in</span>
                        </label>
                        <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
                    </div>

                    <button type="submit" id="submitBtn"
                        class="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-lg shadow-gray-200">
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script>
        async function handleLogin(e) {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            const originalText = btn.innerText;
            btn.innerText = "Verifying...";
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
