// src/ui/public/login.js

export function LOGIN_HTML(companyName) {
    return `
    <div class="flex min-h-[80vh] bg-white">
        
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

        <div class="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
            
            <div class="w-full max-w-md bg-white border border-gray-200 shadow-2xl rounded-xl p-6 sm:p-10 relative z-10">
                
                <div class="text-center mb-8">
                    <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Sign In</h1>
                    <p class="mt-2 text-sm text-gray-500">Welcome back to ${companyName}</p>
                </div>

                <form class="space-y-6" id="loginForm" onsubmit="handleLogin(event)">
                    
                    <div class="space-y-5">
                        <div>
                            <label for="email" class="block text-xs font-bold text-gray-700 uppercase mb-1.5">Email Address</label>
                            <input id="email" name="email" type="email" required 
                                class="appearance-none block w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
                                placeholder="admin@school.edu">
                        </div>

                        <div>
                            <label for="password" class="block text-xs font-bold text-gray-700 uppercase mb-1.5">Password</label>
                            <div class="relative">
                                <input id="password" name="password" type="password" required 
                                    class="appearance-none block w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12" 
                                    placeholder="••••••••">
                                
                                <button type="button" onclick="togglePassword()" 
                                        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                                    <svg id="eye-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path class="eye-open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path class="eye-open" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        <path class="eye-closed hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between mt-2">
                        <label class="flex items-center cursor-pointer select-none">
                            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <span class="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" class="text-sm font-bold text-blue-600 hover:text-blue-500 hover:underline">Forgot password?</a>
                    </div>

                    <button type="submit" id="submitBtn"
                        class="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-md active:scale-[0.98]">
                        Sign In
                    </button>
                </form>

                <p class="mt-6 text-center text-sm text-gray-500">
                    New here? 
                    <a href="#" class="font-bold text-gray-900 hover:underline">Create an account</a>
                </p>
            </div>
        </div>
    </div>

    <script>
        function togglePassword() {
            const input = document.getElementById('password');
            const icon = document.getElementById('eye-icon');
            const eyeOpen = icon.querySelectorAll('.eye-open');
            const eyeClosed = icon.querySelector('.eye-closed');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.forEach(p => p.classList.add('hidden'));
                eyeClosed.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeOpen.forEach(p => p.classList.remove('hidden'));
                eyeClosed.classList.add('hidden');
            }
        }

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
