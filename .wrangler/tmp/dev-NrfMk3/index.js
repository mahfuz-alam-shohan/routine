var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-xUnko8/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-xUnko8/checked-fetch.js"() {
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// src/ui/public/home.js
var home_exports = {};
__export(home_exports, {
  HomeHTML: () => HomeHTML
});
function HomeHTML(companyName) {
  return `
    <div class="animate-fade-in">
        
        <div class="py-24 md:py-32 text-center max-w-5xl mx-auto px-6">
            <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight mb-8">
                Smart Scheduling for <br>
                <span class="text-blue-600">Modern Education.</span>
            </h1>
            <p class="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
                ${companyName} helps institutions design conflict-free class routines, manage faculty workloads, and organize academic structures efficiently.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/login" class="px-10 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1">
                    Get Started
                </a>
                <a href="#features" class="px-10 py-4 text-lg font-bold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all">
                    Explore Features
                </a>
            </div>
        </div>

        <div id="features" class="bg-blue-700 text-white py-24 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">
                <div>
                    <h2 class="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Automated Routine Engine</h2>
                    <p class="text-blue-100 text-lg leading-relaxed mb-8 font-light">
                        Our core algorithm analyzes your teachers, subjects, and classrooms to build the perfect weekly schedule. It handles complex constraints like split shifts and teacher availability automatically.
                    </p>
                    <div class="flex gap-4">
                        <span class="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm font-medium">Conflict Detection</span>
                        <span class="px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm font-medium">Workload Balancing</span>
                    </div>
                </div>
                <div class="bg-gradient-to-br from-white/10 to-transparent p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
                     <div class="space-y-4">
                        <div class="h-32 bg-white/5 rounded-xl w-full flex items-center justify-center border border-white/5">
                            <span class="text-white/40 font-bold tracking-widest uppercase text-sm">Algorithm Visualization</span>
                        </div>
                        <div class="flex gap-4">
                            <div class="h-16 bg-white/5 rounded-xl w-1/3"></div>
                            <div class="h-16 bg-white/5 rounded-xl w-2/3"></div>
                        </div>
                     </div>
                </div>
            </div>
        </div>

        <div class="bg-white py-24">
            <div class="max-w-7xl mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Complete Academic Control</h2>
                    <p class="text-gray-500 mt-4">Everything you need to run your institution.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div class="group">
                        <div class="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Teacher Management</h3>
                        <p class="text-gray-500 leading-relaxed">Maintain detailed profiles, subjects, and contact info for all your faculty members.</p>
                    </div>
                    
                    <div class="group">
                        <div class="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Class & Sectioning</h3>
                        <p class="text-gray-500 leading-relaxed">Organize your academic structure with flexible class and section configurations.</p>
                    </div>

                    <div class="group">
                        <div class="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Export Ready</h3>
                        <p class="text-gray-500 leading-relaxed">Download routines and reports in standard formats suitable for printing.</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `;
}
var init_home = __esm({
  "src/ui/public/home.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(HomeHTML, "HomeHTML");
  }
});

// src/ui/public/login.js
var login_exports = {};
__export(login_exports, {
  LOGIN_HTML: () => LOGIN_HTML
});
function LOGIN_HTML(companyName) {
  return `
    <div class="flex min-h-screen bg-white">
        
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

        <div class="w-full lg:w-1/2 flex items-start pt-12 lg:pt-0 lg:items-center justify-center p-4">
            
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
                                class="appearance-none block w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" 
                                placeholder="admin@school.edu">
                        </div>

                        <div>
                            <label for="password" class="block text-xs font-bold text-gray-700 uppercase mb-1.5">Password</label>
                            <div class="relative">
                                <input id="password" name="password" type="password" required 
                                    class="appearance-none block w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12" 
                                    placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
                                
                                <button type="button" onclick="togglePassword()" 
                                        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer">
                                    <svg id="eye-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <\/script>
    `;
}
var init_login = __esm({
  "src/ui/public/login.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    __name(LOGIN_HTML, "LOGIN_HTML");
  }
});

// .wrangler/tmp/bundle-xUnko8/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-xUnko8/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// src/index.js
init_checked_fetch();
init_modules_watch_stub();

// src/routers/router_public.js
init_checked_fetch();
init_modules_watch_stub();

// src/core/utils.js
init_checked_fetch();
init_modules_watch_stub();
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonResponse, "jsonResponse");
function htmlResponse(html) {
  return new Response(html, {
    headers: { "Content-Type": "text/html" }
  });
}
__name(htmlResponse, "htmlResponse");
async function getCompanyName(env) {
  try {
    const result = await env.DB.prepare("SELECT value FROM system_settings WHERE key = 'site_name'").first();
    return result ? result.value : "RoutineAI SaaS";
  } catch (e) {
    return "RoutineAI SaaS";
  }
}
__name(getCompanyName, "getCompanyName");
function getCookie(request, name) {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) return null;
  const cookies = cookieString.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) return value;
  }
  return null;
}
__name(getCookie, "getCookie");

// src/ui/public/layout.js
init_checked_fetch();
init_modules_watch_stub();
function PublicLayout(contentHTML, title = "Home", companyName = "RoutineAI", user = null) {
  let dashboardLink = "/login";
  if (user && user.role) {
    const r = user.role.toLowerCase();
    if (r === "admin") dashboardLink = "/admin/dashboard";
    else if (r === "institute") dashboardLink = "/school/dashboard";
    else if (r === "teacher") dashboardLink = "/teacher/dashboard";
  }
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
      <title>${title} - ${companyName}</title>
      <script src="https://cdn.tailwindcss.com"><\/script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; }
        .smooth-scroll { -webkit-overflow-scrolling: touch; }
        .page-shell { animation: pageFadeIn 320ms ease-out both; }
        .page-leave .page-shell { opacity: 0; transform: translateY(6px); transition: opacity 180ms ease, transform 180ms ease; }
        .ui-glow::before {
          content: "";
          position: fixed;
          inset: -10% -10% auto -10%;
          height: 40vh;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 55%),
            radial-gradient(circle at top right, rgba(168, 85, 247, 0.16), transparent 55%),
            radial-gradient(circle at 40% 10%, rgba(16, 185, 129, 0.12), transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-shell { animation: none; }
          .page-leave .page-shell { transition: none; }
        }
      </style>
  </head>
  <body class="ui-glow bg-slate-50 text-gray-900 flex flex-col min-h-screen relative overflow-x-hidden">

      <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
          <div class="h-0.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400"></div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between items-center h-16">
                  
                  <div class="flex items-center">
                      <a href="/" class="text-xl font-bold text-gray-900 tracking-tight hover:opacity-80 transition-opacity">
                          ${companyName}
                      </a>
                  </div>

                  <div class="flex items-center gap-6">
                      
                      ${user ? `
                        <div class="flex items-center gap-3">
                            <a href="${dashboardLink}" class="group flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <span class="hidden md:block text-sm font-medium text-gray-700 group-hover:text-blue-600">
                                    My Dashboard
                                </span>
                                <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                                    ${user.email.charAt(0).toUpperCase()}
                                </div>
                            </a>
                        </div>
                      ` : `
                        <div class="flex items-center gap-4">
                            <a href="/login" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</a>
                            <a href="/login" class="hidden sm:inline-flex items-center justify-center px-5 py-2 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-black transition-all shadow-sm">
                                Get Started
                            </a>
                        </div>
                      `}
                      
                  </div>
              </div>
          </div>
      </nav>

      <main class="page-shell flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 smooth-scroll relative z-10">
          ${contentHTML}
      </main>

      <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
          <div class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <p class="text-sm text-gray-500">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ${companyName}. All rights reserved.</p>
              <div class="flex gap-6 text-sm text-gray-500">
                  <a href="#" class="hover:text-gray-900 transition-colors">Privacy Policy</a>
                  <a href="#" class="hover:text-gray-900 transition-colors">Terms of Service</a>
                  <a href="#" class="hover:text-gray-900 transition-colors">Contact Support</a>
              </div>
          </div>
      </footer>

      <script>
        const enablePageTransitions = () => {
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
            const href = link.getAttribute('href') || '';
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            event.preventDefault();
            document.body.classList.add('page-leave');
            setTimeout(() => { window.location.href = link.href; }, 180);
          });
        };

        const enableAutoRefresh = () => {
          let lastInteraction = Date.now();
          const mark = () => { lastInteraction = Date.now(); };
          ['click', 'keydown', 'scroll', 'mousemove', 'touchstart'].forEach((evt) => {
            document.addEventListener(evt, mark, { passive: true });
          });
          const intervalMs = 120000;
          setInterval(() => {
            if (document.hidden) return;
            const active = document.activeElement;
            if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;
            if (Date.now() - lastInteraction < intervalMs) return;
            window.location.reload();
          }, intervalMs);
        };

        window.addEventListener('DOMContentLoaded', () => {
          enablePageTransitions();
          enableAutoRefresh();
        });
      <\/script>
  </body>
  </html>
  `;
}
__name(PublicLayout, "PublicLayout");

// src/core/auth.js
init_checked_fetch();
init_modules_watch_stub();
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = [...salt].map((b) => b.toString(16).padStart(2, "0")).join("");
  const data = encoder.encode(password + saltHex);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return { hash: hashHex, salt: saltHex };
}
__name(hashPassword, "hashPassword");
async function verifyPassword(inputPassword, storedHash, storedSalt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(inputPassword + storedSalt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const computedHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return computedHash === storedHash;
}
__name(verifyPassword, "verifyPassword");

// src/routers/router_public.js
async function handlePublicRequest(request, env) {
  const url = new URL(request.url);
  const companyName = await getCompanyName(env);
  let email = getCookie(request, "user_email");
  let role = getCookie(request, "user_role");
  if (role) role = role.replace(/['"]+/g, "").trim();
  if (email) email = email.replace(/['"]+/g, "").trim();
  const isLoggedIn = !!(email && role);
  const currentUser = isLoggedIn ? { email, role } : null;
  if (url.pathname === "/") {
    const { HomeHTML: HomeHTML2 } = await Promise.resolve().then(() => (init_home(), home_exports));
    return htmlResponse(PublicLayout(HomeHTML2(companyName), "Home", companyName, currentUser));
  }
  if (url.pathname === "/login") {
    if (isLoggedIn) {
      if (role === "admin") return Response.redirect(url.origin + "/admin/dashboard", 302);
      if (role === "institute") return Response.redirect(url.origin + "/school/dashboard", 302);
      if (role === "teacher") return Response.redirect(url.origin + "/teacher/dashboard", 302);
      return Response.redirect(url.origin + "/", 302);
    }
    if (request.method === "POST") {
      try {
        const { email: email2, password } = await request.json();
        const user = await env.DB.prepare("SELECT * FROM auth_accounts WHERE email = ?").bind(email2).first();
        if (!user) return jsonResponse({ error: "Account not found" }, 401);
        const isValid = await verifyPassword(password, user.password_hash, user.salt);
        if (!isValid) return jsonResponse({ error: "Wrong password" }, 401);
        const headers = new Headers();
        const safeRole = user.role || "unknown";
        const isSecure = url.protocol === "https:";
        const secureFlag = isSecure ? "Secure;" : "";
        const cookieSettings = `Path=/; HttpOnly; ${secureFlag} SameSite=Lax; Max-Age=604800`;
        headers.set("Content-Type", "application/json");
        headers.append("Set-Cookie", `user_role=${safeRole}; ${cookieSettings}`);
        headers.append("Set-Cookie", `user_email=${user.email}; ${cookieSettings}`);
        headers.append("Set-Cookie", `auth_status=active; ${cookieSettings}`);
        return new Response(JSON.stringify({ success: true, role: safeRole }), { headers });
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }
    const { LOGIN_HTML: LOGIN_HTML2 } = await Promise.resolve().then(() => (init_login(), login_exports));
    return htmlResponse(PublicLayout(LOGIN_HTML2(companyName), "Sign In", companyName, null));
  }
  if (url.pathname === "/logout") {
    const headers = new Headers();
    headers.append("Set-Cookie", "user_role=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    headers.append("Set-Cookie", "user_email=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    headers.append("Set-Cookie", "auth_status=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
    headers.append("Location", "/login");
    return new Response("Logging out...", { status: 302, headers });
  }
  return new Response("Page Not Found", { status: 404 });
}
__name(handlePublicRequest, "handlePublicRequest");

// src/routers/router_admin.js
init_checked_fetch();
init_modules_watch_stub();

// src/ui/admin/setup.js
init_checked_fetch();
init_modules_watch_stub();
var ADMIN_SETUP_HTML = `
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
  <\/script>
</body>
</html>
`;

// src/ui/admin/layout.js
init_checked_fetch();
init_modules_watch_stub();
function AdminLayout(contentHTML, title = "Dashboard", companyName = "RoutineAI", user = { email: "A" }) {
  const initial = (user.email || "A").charAt(0).toUpperCase();
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
      <title>${title} - ${companyName}</title>
      <script src="https://cdn.tailwindcss.com"><\/script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        body { 
          font-family: 'Inter', sans-serif; 
          -webkit-tap-highlight-color: transparent;
          padding-top: env(safe-area-inset-top);
        }
        .sidebar-transition { transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .page-shell { animation: pageFadeIn 320ms ease-out both; }
        .page-leave .page-shell { opacity: 0; transform: translateY(6px); transition: opacity 180ms ease, transform 180ms ease; }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .mobile-header {
            padding-top: env(safe-area-inset-top);
            background: white;
            position: sticky;
            top: 0;
            z-index: 40;
          }
          .mobile-content {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
        
        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px !important;
        }
        
        /* Smooth transitions */
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        input, textarea {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
        .ui-glow::before {
          content: "";
          position: fixed;
          inset: -10% -10% auto -10%;
          height: 40vh;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.14), transparent 55%),
            radial-gradient(circle at top right, rgba(168, 85, 247, 0.14), transparent 55%),
            radial-gradient(circle at 40% 10%, rgba(16, 185, 129, 0.1), transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-shell { animation: none; }
          .page-leave .page-shell { transition: none; }
        }
      </style>
  </head>
  <body class="ui-glow bg-gray-50 h-[100dvh] overflow-hidden flex flex-col text-gray-900 relative">

      <header class="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-30 shrink-0">
          <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400"></div>
          <div class="flex items-center gap-3">
              <button onclick="toggleSidebar()" class="text-gray-500 hover:text-gray-900 p-2 -ml-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <span class="text-sm font-bold text-gray-800 truncate max-w-[150px]">${companyName}</span>
          </div>
          <a href="/admin/settings" class="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              ${initial}
          </a>
      </header>

      <div class="flex flex-1 overflow-hidden relative">
          
          <div id="sidebar-overlay" onclick="toggleSidebar()" class="fixed inset-0 bg-black/20 z-40 hidden md:hidden transition-opacity"></div>

          <aside id="sidebar" class="sidebar-transition fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform -translate-x-full md:relative md:translate-x-0 flex flex-col h-full">
              
              <div class="h-16 hidden md:flex items-center border-b border-gray-100 px-6 shrink-0">
                  <span class="text-sm font-bold text-gray-900 tracking-wide uppercase">${companyName}</span>
              </div>

              <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1 no-scrollbar">
                  
                  <div class="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overview</div>
                  <a href="/admin/dashboard" class="flex items-center px-3 py-2 text-[13px] font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                      Dashboard
                  </a>

                  <div class="px-3 mt-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Management</div>
                  <a href="/admin/schools" class="flex items-center px-3 py-2 text-[13px] font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      Schools & Clients
                  </a>

                  <div class="px-3 mt-6 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</div>
                  <a href="/admin/settings" class="flex items-center px-3 py-2 text-[13px] font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
                      <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Admin Settings
                  </a>
                  
              </nav>

              <div class="p-4 border-t border-gray-100 shrink-0">
                  <a href="/logout" class="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                      Sign Out
                  </a>
              </div>
          </aside>

          <div class="flex-1 flex flex-col min-w-0 bg-gray-50">
              <main class="page-shell flex-1 overflow-y-auto p-4 md:p-8 pb-20 relative z-10">
                  ${contentHTML}
              </main>
          </div>
      </div>

      <script>
        const enablePageTransitions = () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            document.addEventListener('click', (event) => {
                const link = event.target.closest('a');
                if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
                const href = link.getAttribute('href') || '';
                if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                const url = new URL(link.href, window.location.href);
                if (url.origin !== window.location.origin) return;
                event.preventDefault();
                document.body.classList.add('page-leave');
                setTimeout(() => { window.location.href = link.href; }, 180);
            });
        };

        const enableAutoRefresh = () => {
            let lastInteraction = Date.now();
            const mark = () => { lastInteraction = Date.now(); };
            ['click', 'keydown', 'scroll', 'mousemove', 'touchstart'].forEach((evt) => {
                document.addEventListener(evt, mark, { passive: true });
            });
            const intervalMs = 120000;
            setInterval(() => {
                if (document.hidden) return;
                const active = document.activeElement;
                if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;
                if (Date.now() - lastInteraction < intervalMs) return;
                window.location.reload();
            }, intervalMs);
        };

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            const isClosed = sidebar.classList.contains('-translate-x-full');
            if (isClosed) { sidebar.classList.remove('-translate-x-full'); overlay.classList.remove('hidden'); }
            else { sidebar.classList.add('-translate-x-full'); overlay.classList.add('hidden'); }
        }

        window.addEventListener('DOMContentLoaded', () => {
            enablePageTransitions();
            enableAutoRefresh();
        });
      <\/script>
  </body>
  </html>
  `;
}
__name(AdminLayout, "AdminLayout");

// src/ui/admin/settings.js
init_checked_fetch();
init_modules_watch_stub();
function SettingsPageHTML(profile = {}, email = "") {
  const p = profile || {};
  return `
      <div class="max-w-2xl mx-auto space-y-8">
          
          <div class="text-center mb-8">
              <h1 class="text-2xl font-bold text-gray-900">Account Settings</h1>
              <p class="text-sm text-gray-500 mt-1">Manage your profile information and security.</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Personal Information</h2>
                  <span class="text-xs text-gray-400">Admin ID: ${p.auth_id || "-"}</span>
              </div>
              
              <div class="p-8">
                  <div class="flex flex-col items-center mb-8">
                      <div class="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold mb-4 ring-4 ring-gray-100">
                          ${(p.full_name || email || "A").charAt(0).toUpperCase()}
                      </div>
                      <h3 class="text-lg font-bold text-gray-900">${p.full_name || "Admin User"}</h3>
                      <p class="text-sm text-gray-500">${email}</p>
                  </div>

                  <form onsubmit="updateProfile(event)" class="space-y-5">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                              <input type="text" name="full_name" value="${p.full_name || ""}" placeholder="Enter your name" 
                                     class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all">
                          </div>
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Phone Number</label>
                              <input type="text" name="phone" value="${p.phone || ""}" placeholder="+880..." 
                                     class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all">
                          </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Date of Birth</label>
                              <input type="date" name="dob" value="${p.dob || ""}" 
                                     class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all">
                          </div>
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email (Read Only)</label>
                              <input type="text" value="${email}" disabled 
                                     class="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-3 py-2.5 text-sm cursor-not-allowed">
                          </div>
                      </div>

                      <div class="pt-4 flex justify-end">
                          <button type="submit" class="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-transform active:scale-95 shadow-sm">
                              Save Changes
                          </button>
                      </div>
                  </form>
              </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 class="text-sm font-bold text-red-600 uppercase tracking-wide">Security</h2>
              </div>
              <div class="p-8">
                  <form onsubmit="changePassword(event)" class="space-y-5">
                      <div>
                          <label class="block text-xs font-bold text-gray-500 uppercase mb-1.5">New Password</label>
                          <input type="password" name="password" required placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" 
                                 class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
                      </div>
                      <div class="flex justify-end">
                          <button type="submit" class="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                              Update Password
                          </button>
                      </div>
                  </form>
              </div>
          </div>

      </div>

      <script>
        async function updateProfile(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Saving...";
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'update_profile';

            try {
                const res = await fetch('/admin/settings', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                if(res.ok) alert("Profile updated successfully!");
                else alert("Error saving profile");
            } catch(e) { alert("Network error"); }
            finally { btn.innerText = originalText; }
        }

        async function changePassword(e) {
            e.preventDefault();
            if(!confirm("Are you sure you want to change your password?")) return;
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'change_password';

            try {
                const res = await fetch('/admin/settings', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                if(res.ok) { alert("Password changed!"); e.target.reset(); }
                else alert("Error changing password");
            } catch(e) { alert("Network error"); }
        }
      <\/script>
    `;
}
__name(SettingsPageHTML, "SettingsPageHTML");

// src/ui/admin/schools.js
init_checked_fetch();
init_modules_watch_stub();
function SchoolsPageHTML(schoolsList = []) {
  const rows = schoolsList.map((school) => `
    <tr class="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group">
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${school.school_name}</div>
            <div class="text-xs text-gray-500 md:hidden">EIIN: ${school.eiin_code || "N/A"}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell text-sm text-gray-500">${school.eiin_code || "N/A"}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${school.email}</td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <a href="/admin/school/view?id=${school.auth_id}" class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors">
                Manage
            </a>
        </td>
    </tr>
  `).join("");
  const mobileCards = schoolsList.map((school) => `
    <div class="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <div class="flex items-start justify-between gap-3">
            <div>
                <div class="text-sm font-semibold text-gray-900">${school.school_name}</div>
                <div class="text-xs text-gray-500 mt-1">EIIN: ${school.eiin_code || "N/A"}</div>
                <div class="text-xs text-gray-500 mt-1">${school.email}</div>
            </div>
            <span class="px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
            </span>
        </div>
        <div class="mt-3">
            <a href="/admin/school/view?id=${school.auth_id}" class="inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded">
                Manage
            </a>
        </div>
    </div>
  `).join("");
  return `
    <div class="space-y-6">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Schools</h2>
                <p class="text-sm text-gray-500 mt-1">Manage all registered institutions.</p>
            </div>
            
            <button onclick="toggleForm()" id="add-btn" class="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center shadow-sm transition-all focus:ring-2 focus:ring-blue-200 text-sm">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Add New School
            </button>
        </div>

        <div id="list-view" class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div class="md:hidden space-y-3 p-4">
                ${mobileCards.length > 0 ? mobileCards : '<div class="py-10 text-center text-gray-500 text-sm">No schools found.</div>'}
            </div>
            <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">EIIN Code</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Email</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${rows.length > 0 ? rows : '<tr><td colspan="5" class="px-6 py-12 text-center text-gray-500">No schools found. <br><span class="text-sm">Click "Add New School" to create one.</span></td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>

        <div id="add-form" class="hidden fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onclick="toggleForm()"></div>

            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                    
                    <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                <h3 class="text-xl font-semibold leading-6 text-gray-900" id="modal-title">Register New Institution</h3>
                                <div class="mt-4">
                                    <form onsubmit="createSchool(event)" class="space-y-4">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="col-span-2">
                                                <label class="block text-sm font-medium text-gray-700">School Name</label>
                                                <input type="text" name="school_name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">EIIN Code</label>
                                                <input type="text" name="eiin" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Address</label>
                                                <input type="text" name="address" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>

                                            <div class="col-span-2 border-t pt-4 mt-2">
                                                <span class="text-xs font-bold text-gray-500 uppercase">Admin Account</span>
                                            </div>

                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Email</label>
                                                <input type="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700">Password</label>
                                                <input type="password" name="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                            </div>
                                        </div>
                                        
                                        <div class="mt-6 sm:flex sm:flex-row-reverse">
                                            <button type="submit" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Create School</button>
                                            <button type="button" onclick="toggleForm()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script>
        function toggleForm() {
            const form = document.getElementById('add-form');
            form.classList.toggle('hidden');
        }

        async function createSchool(e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = "Creating...";
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('/admin/schools', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                
                if (result.success) {
                    window.location.reload(); 
                } else {
                    alert("Error: " + result.error);
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                alert("Network Error");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
    <\/script>
  `;
}
__name(SchoolsPageHTML, "SchoolsPageHTML");

// src/ui/admin/school_detail.js
init_checked_fetch();
init_modules_watch_stub();
function SchoolDetailHTML(school) {
  return `
      <div class="space-y-8">
          
          <div class="border-b pb-6">
              <h1 class="text-3xl font-bold text-gray-900">${school.school_name}</h1>
              <div class="flex items-center gap-2 mt-2">
                  <span class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">EIIN: ${school.eiin_code || "N/A"}</span>
                  <span class="text-sm text-gray-500">Auth ID: ${school.auth_id}</span>
              </div>
          </div>
          
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Contact Email</p>
                 <p class="text-gray-900">${school.email}</p>
               </div>
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Address</p>
                 <p class="text-gray-900">${school.address || "N/A"}</p>
               </div>
          </div>

          <div>
              <h3 class="font-bold text-gray-900 mb-4 text-lg">Configuration</h3>
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                  
                  <a href="/admin/school/teachers?id=${school.auth_id}" class="block hover:bg-gray-50 transition-colors p-4 group">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center gap-4">
                              <div class="bg-purple-100 p-2 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-900">Teachers</h4>
                                  <p class="text-sm text-gray-500">Set limits and view staff list</p>
                              </div>
                          </div>
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                  </a>

                  <a href="/admin/school/classes?id=${school.auth_id}" class="block hover:bg-gray-50 transition-colors p-4 group">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center gap-4">
                              <div class="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-900">Classes & Sections</h4>
                                  <p class="text-sm text-gray-500">Hierarchy view and structure management</p>
                              </div>
                          </div>
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                  </a>

                  </div>
          </div>
      </div>
    `;
}
__name(SchoolDetailHTML, "SchoolDetailHTML");

// src/ui/admin/school_classes.js
init_checked_fetch();
init_modules_watch_stub();
function SchoolClassesHTML(school, classesData = [], groupsData = [], sectionsData = []) {
  const classGroups = {};
  groupsData.forEach((g) => {
    if (!classGroups[g.class_id]) classGroups[g.class_id] = [];
    classGroups[g.class_id].push(g);
  });
  const classSections = {};
  sectionsData.forEach((s) => {
    if (!classSections[s.class_id]) classSections[s.class_id] = [];
    classSections[s.class_id].push(s);
  });
  const classHierarchy = classesData.map((cls) => {
    const groups = classGroups[cls.id] || [];
    const sections = classSections[cls.id] || [];
    const sectionsByGroup = {};
    groups.forEach((g) => {
      sectionsByGroup[g.id] = {
        group: g,
        sections: sections.filter((s) => s.group_id === g.id)
      };
    });
    const sectionsWithoutGroup = sections.filter((s) => !s.group_id);
    return `
            <div class="mb-4 border border-gray-300">
                <!-- Class Header -->
                <div class="bg-gray-100 px-3 py-2 border-b">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-sm md:text-base">${cls.class_name}</span>
                            <span class="text-xs text-gray-500">(${groups.length} groups, ${sections.length} sections)</span>
                        </div>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                            ${cls.has_groups ? `
                                <button onclick="openAddGroupModal(${cls.id}, '${cls.class_name}')" class="text-xs bg-green-600 text-white px-2 py-1 hover-lift">
                                    + Add Group
                                </button>
                            ` : `
                                <button onclick="openAddSectionModal(${cls.id}, '${cls.class_name}', ${cls.has_groups})" class="text-xs bg-blue-600 text-white px-2 py-1 hover-lift">
                                    + Add Section
                                </button>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Groups and Sections -->
                <div class="p-2">
                    ${groups.length > 0 ? `
                        <div class="space-y-2">
                            ${groups.map((g) => {
      const groupSections = sectionsByGroup[g.id]?.sections || [];
      return `
                                    <div class="border-l-2 border-gray-400 pl-2">
                                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span class="font-semibold text-sm md:text-base">${g.group_name}</span>
                                                <span class="text-xs text-gray-500">(${groupSections.length} sections)</span>
                                            </div>
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-1">
                                                <button onclick="openAddSectionModalForGroup(${cls.id}, '${cls.class_name}', ${g.id}, '${g.group_name}')" class="text-xs bg-blue-600 text-white px-2 py-1">
                                                    + Add Section
                                                </button>
                                                <button onclick="deleteGroup(${g.id})" class="text-xs text-red-600">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap gap-1">
                                            ${groupSections.map((s) => `
                                                <span class="border border-gray-300 px-2 py-1 text-sm">
                                                    ${s.section_name}
                                                    <button onclick="deleteSection(${s.id})" class="text-xs text-red-500 ml-1">\xD7</button>
                                                </span>
                                            `).join("")}
                                        </div>
                                    </div>
                                `;
    }).join("")}
                        </div>
                    ` : ""}
                    
                    ${sectionsWithoutGroup.length > 0 ? `
                        <div class="border-l-2 border-gray-400 pl-2">
                            <div class="mb-1">
                                <span class="font-semibold">No Group</span>
                                <span class="text-xs text-gray-500 ml-2">(${sectionsWithoutGroup.length} sections)</span>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                ${sectionsWithoutGroup.map((s) => `
                                    <span class="border border-gray-300 px-2 py-1 text-sm">
                                        ${s.section_name}
                                        <button onclick="deleteSection(${s.id})" class="text-xs text-red-500 ml-1">\xD7</button>
                                    </span>
                                `).join("")}
                            </div>
                        </div>
                    ` : ""}
                    
                    ${groups.length === 0 && sectionsWithoutGroup.length === 0 ? `
                        <div class="text-center py-4 text-gray-400 text-sm">
                            No groups or sections added yet
                        </div>
                    ` : ""}
                </div>
            </div>
        `;
  }).join("");
  return `
      <style>
        /* Enhanced animations and transitions */
        .btn-primary {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .section-badge {
          transition: all 0.2s ease;
        }
        .section-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* Loading skeleton */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        /* Success animations */
        @keyframes slideInSuccess {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .success-message {
          animation: slideInSuccess 0.3s ease-out;
        }
        
        /* Smooth focus states */
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          transition: all 0.2s ease;
        }
        
        /* Hover states for interactive elements */
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Mobile responsive design */
        @media (max-width: 768px) {
          .class-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .class-header button {
            width: 100%;
            justify-content: center;
          }
          
          .group-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .group-header button {
            width: 100%;
            justify-content: center;
          }
        }
        
        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px !important;
        }
      </style>
      
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/admin/school/view?id=${school.auth_id}" class="hover:text-blue-600">Back to Menu</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Classes & Sections</span>
         </div>

         <div class="mb-4">
             <form onsubmit="createClass(event)" class="border border-gray-300 p-3">
                 <div class="flex flex-col md:flex-row gap-2 items-end">
                     <div class="flex-1">
                         <input type="text" name="class_name" placeholder="Class Name (e.g. Class 10)" required class="w-full border border-gray-300 px-2 py-1 text-sm">
                     </div>
                     <div class="flex items-center gap-1">
                         <input type="checkbox" name="has_groups" id="has_groups">
                         <label for="has_groups" class="text-sm">Has Groups</label>
                     </div>
                     <button type="submit" class="bg-gray-800 text-white px-3 py-1 text-sm">
                         Create Class
                     </button>
                 </div>
             </form>
         </div>

         <div class="space-y-4">
             ${classHierarchy.length > 0 ? classHierarchy : `
                 <div class="bg-white border border-gray-200 rounded-lg p-8 text-center">
                     <p class="text-gray-400">No classes found</p>
                 </div>
             `}
         </div>
      </div>

      <!-- Add Group Modal -->
      <div id="addGroupModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Add Group</h3>
              <form onsubmit="addGroup(event)">
                  <input type="hidden" name="class_id" id="group_class_id">
                  <div class="mb-3">
                      <input type="text" name="group_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. Science, Arts">
                  </div>
                  <div class="flex gap-2">
                      <button type="submit" class="bg-green-600 text-white px-3 py-1 text-sm" id="addGroupBtn">Add Group</button>
                      <button type="button" onclick="closeModal('addGroupModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Add Section Modal -->
      <div id="addSectionModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative">
              <h3 class="font-bold mb-3">Add Section</h3>
              <form onsubmit="addSection(event)">
                  <input type="hidden" name="class_id" id="section_class_id">
                  <input type="hidden" name="group_id" id="section_group_id">
                  
                  <div class="mb-3">
                      <input type="text" name="section_name" required class="w-full border border-gray-300 px-2 py-1" placeholder="e.g. A, B">
                  </div>
                  
                  <div class="flex gap-2">
                      <button type="submit" class="bg-blue-600 text-white px-3 py-1 text-sm" id="addSectionBtn">Add Section</button>
                      <button type="button" onclick="closeModal('addSectionModal')" class="bg-gray-200 text-gray-800 px-3 py-1 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        const CLASS_GROUPS = ${JSON.stringify(classGroups)};

        function createClass(e) {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            if (submitBtn.disabled) return; // Prevent multiple submissions
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'create_class';
            data.school_id = SCHOOL_ID;
            data.has_groups = formData.has('has_groups');

            fetch('/admin/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error creating class: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Create Class';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Class';
            });
        }

        function openAddGroupModal(classId, className) {
            document.getElementById('group_class_id').value = classId;
            openModal('addGroupModal');
            setTimeout(() => {
                document.querySelector('#addGroupModal input[name="group_name"]').focus();
            }, 100);
        }

        function openAddSectionModalForGroup(classId, className, groupId, groupName) {
            document.getElementById('section_class_id').value = classId;
            document.getElementById('section_group_id').value = groupId;
            openModal('addSectionModal');
            setTimeout(() => {
                document.querySelector('#addSectionModal input[name="section_name"]').focus();
            }, 100);
        }

        function openAddSectionModal(classId, className, hasGroups) {
            document.getElementById('section_class_id').value = classId;
            document.getElementById('section_group_id').value = '';
            openModal('addSectionModal');
            setTimeout(() => {
                document.querySelector('#addSectionModal input[name="section_name"]').focus();
            }, 100);
        }

        function addGroup(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('addGroupBtn');
            if (submitBtn.disabled) return; // Prevent multiple submissions
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_group';
            data.school_id = SCHOOL_ID;

            fetch('/admin/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error adding group: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Group';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Group';
            });
        }

        function addSection(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('addSectionBtn');
            if (submitBtn.disabled) return; // Prevent multiple submissions
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_section';
            data.school_id = SCHOOL_ID;

            fetch('/admin/school/classes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error adding section: ' + (response.error || 'Unknown error'), 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Section';
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Section';
            });
        }

        function deleteGroup(id) {
            if(!confirm("Delete this group and all its sections?")) return;
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_group', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error deleting group: ' + (response.error || 'Unknown error'), 'error');
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
            });
        }

        function deleteSection(id) {
            if(!confirm("Delete this section?")) return;
            
            fetch('/admin/school/classes', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_section', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    showToast('Error deleting section: ' + (response.error || 'Unknown error'), 'error');
                }
            }).catch(error => {
                console.error('Network error:', error);
                showToast('Network error. Please check your connection and try again.', 'error');
            });
        }

        // Modal management
        function openModal(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
            document.body.style.overflow = '';
            const modal = document.getElementById(modalId);
            const submitBtn = modal.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.id === 'addGroupBtn' ? 'Add Group' : 'Add Section';
            }
            modal.querySelector('form').reset();
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.fixed.inset-0');
                modals.forEach(modal => {
                    if (!modal.classList.contains('hidden')) {
                        closeModal(modal.id);
                    }
                });
            }
        });

        // Close modal on background click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
                closeModal(e.target.id);
            }
        });

        // Toast notification system
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            const bgColor = type === 'success' ? 'bg-green-600' : 
                          type === 'error' ? 'bg-red-600' : 
                          type === 'info' ? 'bg-blue-600' : 'bg-gray-600';
            
            toast.className = 'fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-[10000] success-message ' + bgColor;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.querySelector('input[name="class_name"]').focus();
            }
        });
      <\/script>
    `;
}
__name(SchoolClassesHTML, "SchoolClassesHTML");

// src/ui/admin/school_teachers.js
init_checked_fetch();
init_modules_watch_stub();
function SchoolTeachersHTML(school, teachers = []) {
  return `
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/admin/school/view?id=${school.auth_id}" class="hover:text-blue-600">Back to Menu</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Teacher Management</span>
         </div>

         <div class="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                 <h2 class="text-purple-900 font-bold text-lg">Teacher Limit Control</h2>
                 <p class="text-purple-700 text-sm">Enforce limits based on payment plan.</p>
             </div>
             <form onsubmit="updateLimit(event)" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                 <div class="bg-white border border-purple-200 rounded px-3 py-2 text-sm w-full sm:w-auto">
                    <span class="text-gray-500 mr-2">Max Allowed:</span>
                    <input type="number" name="max_teachers" value="${school.max_teachers || 10}" class="w-16 font-bold text-center outline-none">
                 </div>
                 <button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-purple-700 w-full sm:w-auto">Save Limit</button>
             </form>
         </div>

         <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                 <h3 class="font-bold text-gray-700">Registered Teachers</h3>
                 <span class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    Count: ${teachers.length} / ${school.max_teachers || 10}
                 </span>
             </div>
             <div class="md:hidden p-4 space-y-3">
                ${teachers.map((t) => `
                    <div class="border border-gray-200 rounded-lg p-3">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <div class="text-sm font-semibold text-gray-900">${t.full_name}</div>
                                <div class="text-xs text-gray-500">${t.email || "-"}</div>
                            </div>
                            <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px]">${t.subject || "-"}</span>
                        </div>
                        <div class="text-xs font-mono text-gray-600 mt-2">${t.phone || "-"}</div>
                    </div>
                `).join("")}
                ${teachers.length === 0 ? '<div class="py-6 text-center text-gray-400 text-sm">No teachers added yet.</div>' : ""}
             </div>
             <div class="hidden md:block overflow-x-auto">
                 <table class="min-w-full divide-y divide-gray-200">
                     <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name & Email</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Subject</th>
                            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phone</th>
                        </tr>
                     </thead>
                     <tbody class="bg-white divide-y divide-gray-200">
                        ${teachers.map((t) => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-bold text-gray-900">${t.full_name}</div>
                                    <div class="text-xs text-gray-500">${t.email || "-"}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">${t.subject || "-"}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                                    ${t.phone || "-"}
                                </td>
                            </tr>
                        `).join("")}
                        ${teachers.length === 0 ? '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-400">No teachers added yet.</td></tr>' : ""}
                     </tbody>
                 </table>
             </div>
         </div>
      </div>

      <script>
        async function updateLimit(e) {
            e.preventDefault();
            const form = new FormData(e.target);
            const val = form.get('max_teachers');
            
            try {
                const res = await fetch('/admin/school/teachers', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        action: 'update_limit', 
                        school_id: ${school.id}, 
                        max_val: val 
                    })
                });
                if(res.ok) alert("Limit Updated!");
                else alert("Error");
            } catch(e) { alert("Network Error"); }
        }
      <\/script>
    `;
}
__name(SchoolTeachersHTML, "SchoolTeachersHTML");

// src/config.js
init_checked_fetch();
init_modules_watch_stub();
var ROLES = {
  ADMIN: "admin",
  INSTITUTE: "institute",
  // <--- ensuring this is lowercase 'institute'
  TEACHER: "teacher",
  STUDENT: "student"
};

// src/core/schema_manager.js
init_checked_fetch();
init_modules_watch_stub();
var DEFINED_SCHEMA = {
  auth_accounts: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    email: "TEXT UNIQUE NOT NULL",
    password_hash: "TEXT NOT NULL",
    salt: "TEXT NOT NULL",
    role: "TEXT NOT NULL",
    is_active: "BOOLEAN DEFAULT 1",
    created_at: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  },
  profiles_institution: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    auth_id: "INTEGER",
    school_name: "TEXT",
    eiin_code: "TEXT",
    address: "TEXT",
    max_teachers: "INTEGER DEFAULT 10",
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)"
  },
  profiles_admin: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    auth_id: "INTEGER",
    full_name: "TEXT",
    phone: "TEXT",
    dob: "DATE",
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)"
  },
  profiles_teacher: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    auth_id: "INTEGER",
    school_id: "INTEGER",
    full_name: "TEXT",
    subject: "TEXT",
    // Keep for backward compatibility
    email: "TEXT",
    phone: "TEXT",
    "FOREIGN KEY(auth_id)": "REFERENCES auth_accounts(id)"
  },
  // --- TEACHER SUBJECT ASSIGNMENTS ---
  teacher_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    teacher_id: "INTEGER",
    subject_id: "INTEGER",
    is_primary: "BOOLEAN DEFAULT 0",
    // Main subject vs additional subjects
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(teacher_id)": "REFERENCES profiles_teacher(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
  },
  academic_classes: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_name: "TEXT",
    has_groups: "INTEGER DEFAULT 0",
    // 0 = no groups, 1 = has groups
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  },
  class_groups: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_id: "INTEGER",
    group_name: "TEXT",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)"
  },
  class_sections: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_id: "INTEGER",
    group_id: "INTEGER",
    // null if class has no groups
    section_name: "TEXT",
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)",
    "FOREIGN KEY(group_id)": "REFERENCES class_groups(id)"
  },
  academic_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    subject_name: "TEXT"
  },
  // --- SUBJECT ASSIGNMENT TABLES ---
  class_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    class_id: "INTEGER",
    subject_id: "INTEGER",
    classes_per_week: "INTEGER",
    // Actual number of classes assigned
    min_classes: "INTEGER",
    // Minimum required classes per week
    max_classes: "INTEGER",
    // Maximum allowed classes per week
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(class_id)": "REFERENCES academic_classes(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
  },
  group_subjects: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    group_id: "INTEGER",
    subject_id: "INTEGER",
    classes_per_week: "INTEGER",
    // Actual number of classes assigned
    min_classes: "INTEGER",
    // Minimum required classes per week
    max_classes: "INTEGER",
    // Maximum allowed classes per week
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)",
    "FOREIGN KEY(group_id)": "REFERENCES class_groups(id)",
    "FOREIGN KEY(subject_id)": "REFERENCES academic_subjects(id)"
  },
  // --- SIMPLIFIED SCHEDULE CONFIGURATION ---
  schedule_config: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER UNIQUE",
    // One config per school
    strategy: "TEXT",
    // Keep for backward compatibility
    shifts_json: "TEXT",
    // Keep for backward compatibility  
    start_time: "TEXT DEFAULT '08:00'",
    // School start time
    active_days: "INTEGER DEFAULT 5",
    // Keep for backward compatibility
    periods_per_day: "INTEGER DEFAULT 8",
    // Keep for backward compatibility
    // New working days fields
    working_days: `TEXT DEFAULT '["monday","tuesday","wednesday","thursday","friday"]'`,
    // JSON array of working days
    off_days: `TEXT DEFAULT '["saturday","sunday"]'`
    // JSON array of off days
  },
  schedule_slots: {
    id: "INTEGER PRIMARY KEY AUTOINCREMENT",
    school_id: "INTEGER",
    slot_index: "INTEGER",
    // Keep for backward compatibility
    start_time: "TEXT",
    // "08:00"
    end_time: "TEXT",
    // "08:45"
    duration: "INTEGER",
    // Duration in minutes
    type: "TEXT",
    // 'class', 'break'
    label: "TEXT",
    // "1st Period", "Tiffin"
    applicable_shifts: "TEXT",
    // Keep for backward compatibility
    "FOREIGN KEY(school_id)": "REFERENCES profiles_institution(id)"
  },
  system_settings: {
    key: "TEXT PRIMARY KEY",
    value: "TEXT"
  }
};
async function syncDatabase(env) {
  const report = [];
  const existingTablesResult = await env.DB.prepare("PRAGMA table_list").all();
  const existingTables = existingTablesResult.results.map((t) => t.name).filter((n) => !n.startsWith("_") && !n.startsWith("sqlite") && !n.startsWith("d1"));
  for (const [tableName, columns] of Object.entries(DEFINED_SCHEMA)) {
    if (!existingTables.includes(tableName)) {
      await createTable(env, tableName, columns);
      report.push(`Created table: ${tableName}`);
    } else {
      await syncColumns(env, tableName, columns, report);
    }
  }
  for (const existingTable of existingTables) {
    if (!DEFINED_SCHEMA[existingTable]) {
      try {
        await env.DB.prepare(`DROP TABLE "${existingTable}"`).run();
      } catch (e) {
      }
    }
  }
  return report;
}
__name(syncDatabase, "syncDatabase");
async function createTable(env, tableName, columns) {
  const colDefs = Object.entries(columns).map(([colName, colType]) => {
    if (colName.includes(" ")) return `${colName} ${colType}`;
    return `"${colName}" ${colType}`;
  }).join(", ");
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS "${tableName}" (${colDefs});`).run();
}
__name(createTable, "createTable");
async function syncColumns(env, tableName, schemaColumns, report) {
  const dbColsResult = await env.DB.prepare(`PRAGMA table_info("${tableName}")`).all();
  const dbColNames = dbColsResult.results.map((c) => c.name);
  for (const [colName, colType] of Object.entries(schemaColumns)) {
    if (colName.includes(" ")) continue;
    if (!dbColNames.includes(colName)) {
      try {
        await env.DB.prepare(`ALTER TABLE "${tableName}" ADD COLUMN "${colName}" ${colType}`).run();
      } catch (e) {
      }
    }
  }
}
__name(syncColumns, "syncColumns");

// src/routers/router_admin.js
async function handleAdminRequest(request, env) {
  const url = new URL(request.url);
  const companyName = await getCompanyName(env);
  const email = getCookie(request, "user_email");
  if (!email && url.pathname !== "/admin/setup") {
    return htmlResponse("<h1>Unauthorized</h1><p>Please log in.</p>", 401);
  }
  if (url.pathname === "/admin/dashboard") {
    const content = `
    <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Welcome to your Control Center</h3>
        <p class="text-gray-500">Select an option from the sidebar to manage schools, settings, or view reports.</p>
    </div>`;
    return htmlResponse(AdminLayout(content, "Dashboard", companyName, { email }));
  }
  if (url.pathname === "/admin/settings") {
    const admin = await env.DB.prepare("SELECT * FROM auth_accounts WHERE email = ?").bind(email).first();
    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (body.action === "update_profile") {
          const exists = await env.DB.prepare("SELECT id FROM profiles_admin WHERE auth_id = ?").bind(admin.id).first();
          if (exists) {
            await env.DB.prepare("UPDATE profiles_admin SET full_name=?, phone=?, dob=? WHERE auth_id=?").bind(body.full_name, body.phone, body.dob, admin.id).run();
          } else {
            await env.DB.prepare("INSERT INTO profiles_admin (auth_id, full_name, phone, dob) VALUES (?, ?, ?, ?)").bind(admin.id, body.full_name, body.phone, body.dob).run();
          }
          return jsonResponse({ success: true });
        }
        if (body.action === "change_password") {
          const { hash, salt } = await hashPassword(body.password);
          await env.DB.prepare("UPDATE auth_accounts SET password_hash=?, salt=? WHERE id=?").bind(hash, salt, admin.id).run();
          return jsonResponse({ success: true });
        }
      } catch (e) {
        if (e.message.includes("no such table")) await syncDatabase(env);
        return jsonResponse({ error: e.message }, 500);
      }
    }
    let profile = {};
    try {
      profile = await env.DB.prepare("SELECT * FROM profiles_admin WHERE auth_id = ?").bind(admin.id).first();
    } catch (e) {
    }
    return htmlResponse(AdminLayout(SettingsPageHTML(profile, email), "Settings", companyName, { email }));
  }
  if (url.pathname === "/admin/schools") {
    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (!body.email || !body.password || !body.school_name) return jsonResponse({ error: "Missing fields" }, 400);
        const exists = await env.DB.prepare("SELECT id FROM auth_accounts WHERE email = ?").bind(body.email).first();
        if (exists) return jsonResponse({ error: "Email exists" }, 400);
        const { hash, salt } = await hashPassword(body.password);
        const authResult = await env.DB.prepare("INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?) RETURNING id").bind(body.email, hash, salt, ROLES.INSTITUTE).first();
        await env.DB.prepare("INSERT INTO profiles_institution (auth_id, school_name, eiin_code, address) VALUES (?, ?, ?, ?)").bind(authResult.id, body.school_name, body.eiin || "", body.address || "").run();
        return jsonResponse({ success: true });
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }
    const result = await env.DB.prepare(`SELECT p.auth_id, p.school_name, p.eiin_code, a.email FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id ORDER BY p.id DESC`).all();
    return htmlResponse(AdminLayout(SchoolsPageHTML(result.results || []), "Schools", companyName, { email }));
  }
  if (url.pathname === "/admin/school/view") {
    const authId = url.searchParams.get("id");
    const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
    if (school) school.email = (await env.DB.prepare("SELECT email FROM auth_accounts WHERE id=?").bind(authId).first()).email;
    return htmlResponse(AdminLayout(SchoolDetailHTML(school), "Manage Client", companyName, { email }));
  }
  if (url.pathname === "/admin/school/teachers") {
    if (request.method === "POST") {
      const body = await request.json();
      if (body.action === "update_limit") {
        await env.DB.prepare("UPDATE profiles_institution SET max_teachers = ? WHERE id = ?").bind(body.max_val, body.school_id).run();
        return jsonResponse({ success: true });
      }
    }
    const authId = url.searchParams.get("id");
    const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
    const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ?").bind(school.id).all();
    return htmlResponse(AdminLayout(SchoolTeachersHTML(school, teachers.results), "Teachers", companyName, { email }));
  }
  if (url.pathname === "/admin/school/classes") {
    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (body.action === "create_class") {
          await env.DB.prepare("INSERT INTO academic_classes (school_id, class_name, has_groups) VALUES (?, ?, ?)").bind(body.school_id, body.class_name, body.has_groups ? 1 : 0).run();
          return jsonResponse({ success: true });
        }
        if (body.action === "add_group") {
          await env.DB.prepare("INSERT INTO class_groups (school_id, class_id, group_name) VALUES (?, ?, ?)").bind(body.school_id, body.class_id, body.group_name).run();
          return jsonResponse({ success: true });
        }
        if (body.action === "add_section") {
          await env.DB.prepare("INSERT INTO class_sections (school_id, class_id, group_id, section_name) VALUES (?, ?, ?, ?)").bind(body.school_id, body.class_id, body.group_id || null, body.section_name).run();
          return jsonResponse({ success: true });
        }
      } catch (e) {
        console.error("Classes API Error:", e);
        if (e.message.includes("no such table")) {
          await syncDatabase(env);
          return jsonResponse({ error: "Database tables are being created. Please try again in a moment." }, 500);
        }
        return jsonResponse({ error: e.message }, 500);
      }
    }
    if (request.method === "DELETE") {
      const body = await request.json();
      if (body.action === "delete_class") {
        await env.DB.prepare("DELETE FROM academic_classes WHERE id=?").bind(body.id).run();
        return jsonResponse({ success: true });
      }
      if (body.action === "delete_group") {
        await env.DB.prepare("DELETE FROM class_groups WHERE id=?").bind(body.id).run();
        return jsonResponse({ success: true });
      }
      if (body.action === "delete_section") {
        await env.DB.prepare("DELETE FROM class_sections WHERE id=?").bind(body.id).run();
        return jsonResponse({ success: true });
      }
    }
    const authId = url.searchParams.get("id");
    const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
    const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
    const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
    const sections = await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ? ORDER BY class_id, section_name").bind(school.id).all();
    return htmlResponse(AdminLayout(
      SchoolClassesHTML(
        school,
        classes.results,
        groups.results,
        sections.results
      ),
      "Classes",
      companyName,
      { email }
    ));
  }
  if (url.pathname === "/admin/setup") {
    try {
      await syncDatabase(env);
    } catch (e) {
    }
    if (request.method === "POST") {
      const { email: email2, password } = await request.json();
      const { hash, salt } = await hashPassword(password);
      await env.DB.prepare("INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?)").bind(email2, hash, salt, ROLES.ADMIN).run();
      return jsonResponse({ success: true });
    }
    return htmlResponse(ADMIN_SETUP_HTML);
  }
  return new Response("Page Not Found", { status: 404 });
}
__name(handleAdminRequest, "handleAdminRequest");

// src/routers/router_institute.js
init_checked_fetch();
init_modules_watch_stub();

// src/ui/institute/layout.js
init_checked_fetch();
init_modules_watch_stub();
function InstituteLayout(content, title, schoolName) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>${title} - ${schoolName}</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Inter', sans-serif; font-size: 0.875rem; } 
            
            /* Hide Scrollbar for Chrome/Safari/Opera */
            .no-scrollbar::-webkit-scrollbar { display: none; }
            /* Hide Scrollbar for IE, Edge and Firefox */
            .no-scrollbar { -ms-overflow-style: none;  scrollbar-width: none; }

            /* Professional custom scrollbar for main content */
            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

            /* Prevent iOS Zoom on inputs */
            @media screen and (max-width: 768px) {
                input, select, textarea { font-size: 16px !important; }
            }

            .page-shell { animation: pageFadeIn 320ms ease-out both; }
            .page-leave .page-shell { opacity: 0; transform: translateY(6px); transition: opacity 180ms ease, transform 180ms ease; }
            .ui-glow::before {
                content: "";
                position: fixed;
                inset: -10% -10% auto -10%;
                height: 40vh;
                background:
                  radial-gradient(circle at top left, rgba(59, 130, 246, 0.14), transparent 55%),
                  radial-gradient(circle at top right, rgba(168, 85, 247, 0.14), transparent 55%),
                  radial-gradient(circle at 40% 10%, rgba(16, 185, 129, 0.1), transparent 50%);
                pointer-events: none;
                z-index: 0;
            }
            @keyframes pageFadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @media (prefers-reduced-motion: reduce) {
                .page-shell { animation: none; }
                .page-leave .page-shell { transition: none; }
            }
        </style>
    </head>
    <body class="ui-glow bg-gray-50 text-gray-800 antialiased h-screen flex flex-col md:flex-row overflow-hidden relative">

        <header class="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30 flex-shrink-0 relative">
            <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400"></div>
            <div class="flex items-center gap-3">
                <button onclick="toggleSidebar()" class="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <span class="font-bold text-gray-900 truncate max-w-[200px]">${schoolName}</span>
            </div>
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                ${schoolName.charAt(0)}
            </div>
        </header>

        <div id="sidebar-backdrop" onclick="toggleSidebar()" class="fixed inset-0 bg-gray-900/50 z-40 hidden transition-opacity opacity-0"></div>

        <aside id="sidebar" class="fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col shadow-2xl md:shadow-none">
            <div class="h-14 flex items-center px-4 border-b border-gray-200 flex-shrink-0 justify-between">
                <div class="flex items-center">
                    <div class="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs mr-2">S</div>
                    <span class="font-bold text-gray-900 truncate text-sm max-w-[150px]">${schoolName}</span>
                </div>
                <button onclick="toggleSidebar()" class="md:hidden p-1 text-gray-400 hover:text-gray-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <nav class="flex-1 overflow-y-auto py-3 space-y-1 px-3">
                <a href="/school/dashboard" class="nav-link flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium" data-page="dashboard">Dashboard</a>
                <div class="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase">Academic</div>
                <a href="/school/schedules" class="nav-link flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium" data-page="schedules">Master Schedule</a>
                <a href="/school/teachers" class="nav-link flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium" data-page="teachers">Teachers</a>
                <a href="/school/subjects" class="nav-link flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium" data-page="subjects">Subjects</a>
                <a href="/school/classes" class="nav-link flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium" data-page="classes">Classes</a>
                <div class="mt-auto pt-4 border-t">
                    <a href="/logout" class="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium">Sign Out</a>
                </div>
            </nav>
        </aside>

        <main class="page-shell flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden relative z-10">
            <div class="flex-1 overflow-auto p-4 pb-20 md:pb-6">
                ${content}
            </div>
        </main>

        <script>
            const enablePageTransitions = () => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                document.addEventListener('click', (event) => {
                    const link = event.target.closest('a');
                    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
                    const href = link.getAttribute('href') || '';
                    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                    const url = new URL(link.href, window.location.href);
                    if (url.origin !== window.location.origin) return;
                    event.preventDefault();
                    document.body.classList.add('page-leave');
                    setTimeout(() => { window.location.href = link.href; }, 180);
                });
            };

            const enableAutoRefresh = () => {
                let lastInteraction = Date.now();
                const mark = () => { lastInteraction = Date.now(); };
                ['click', 'keydown', 'scroll', 'mousemove', 'touchstart'].forEach((evt) => {
                    document.addEventListener(evt, mark, { passive: true });
                });
                const intervalMs = 120000;
                setInterval(() => {
                    if (document.hidden) return;
                    const active = document.activeElement;
                    if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;
                    if (Date.now() - lastInteraction < intervalMs) return;
                    window.location.reload();
                }, intervalMs);
            };

            function toggleSidebar() {
                const sb = document.getElementById('sidebar');
                const bd = document.getElementById('sidebar-backdrop');
                const isClosed = sb.classList.contains('-translate-x-full');
                if (isClosed) {
                    sb.classList.remove('-translate-x-full');
                    bd.classList.remove('hidden');
                    setTimeout(() => bd.classList.remove('opacity-0'), 10);
                } else {
                    sb.classList.add('-translate-x-full');
                    bd.classList.add('opacity-0');
                    setTimeout(() => bd.classList.add('hidden'), 200);
                }
            }

            function setActiveNav() {
                const currentPath = window.location.pathname;
                const navLinks = document.querySelectorAll('.nav-link');
                
                navLinks.forEach(link => {
                    const page = link.getAttribute('data-page');
                    link.classList.remove('bg-blue-50', 'text-blue-600');
                    link.classList.add('text-gray-600');
                    
                    if (currentPath.includes(\`/school/\${page}\`)) {
                        link.classList.remove('text-gray-600');
                        link.classList.add('bg-blue-50', 'text-blue-600');
                    }
                });
            }

            window.addEventListener('DOMContentLoaded', () => {
                enablePageTransitions();
                enableAutoRefresh();
                setActiveNav();
            });
        <\/script>
    </body>
    </html>
    `;
}
__name(InstituteLayout, "InstituteLayout");

// src/ui/institute/dashboard.js
init_checked_fetch();
init_modules_watch_stub();
function InstituteDashboardHTML(stats) {
  return `
      <div class="space-y-6 max-w-6xl mx-auto pt-4 md:pt-6">
          
          <div>
            <h1 class="text-xl md:text-3xl font-semibold text-gray-900">Overview</h1>
            <p class="text-sm md:text-base text-gray-500 mt-1">Welcome to your academic control center.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-b border-gray-100 py-4 md:py-6">
              <div>
                  <div class="text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-1 md:mb-2">Total Teachers</div>
                  <div class="text-3xl md:text-4xl font-light text-gray-900">${stats.teachers || 0}</div>
              </div>
              <div>
                  <div class="text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-1 md:mb-2">Active Classes</div>
                  <div class="text-3xl md:text-4xl font-light text-gray-900">${stats.classes || 0}</div>
              </div>
              <div>
                  <div class="text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-1 md:mb-2">Routines</div>
                  <div class="text-3xl md:text-4xl font-light text-gray-900">0</div>
              </div>
              <div>
                  <div class="text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-1 md:mb-2">System Status</div>
                  <div class="text-sm md:text-base font-medium text-green-600 mt-1 flex items-center">
                    <span class="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full mr-2"></span> Operational
                  </div>
              </div>
          </div>

          <div>
              <h3 class="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-widest mb-6">Quick Actions</h3>
              <div class="flex flex-col sm:flex-row gap-4 md:gap-6 text-sm md:text-base">
                  <a href="/school/teachers" class="group flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <span class="border-b border-gray-300 group-hover:border-blue-600 pb-0.5">Add Staff Member</span>
                      <svg class="w-4 md:w-5 h-4 md:h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </a>
                  <a href="/school/classes" class="group flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                      <span class="border-b border-gray-300 group-hover:border-blue-600 pb-0.5">Configure Classes</span>
                      <svg class="w-4 md:w-5 h-4 md:h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </a>
              </div>
          </div>
      </div>
    `;
}
__name(InstituteDashboardHTML, "InstituteDashboardHTML");

// src/ui/institute/teachers.js
init_checked_fetch();
init_modules_watch_stub();
function TeachersPageHTML(school, teachers = [], allSubjects = [], teacherSubjects = []) {
  const subjectsByTeacher = {};
  teacherSubjects.forEach((ts) => {
    if (!subjectsByTeacher[ts.teacher_id]) subjectsByTeacher[ts.teacher_id] = [];
    subjectsByTeacher[ts.teacher_id].push(ts);
  });
  const teacherRows = teachers.map((t) => {
    const teacherSubjectsList = subjectsByTeacher[t.id] || [];
    const primarySubject = teacherSubjectsList.find((ts) => ts.is_primary === 1);
    const additionalSubjects = teacherSubjectsList.filter((ts) => ts.is_primary === 0);
    return `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4">
                    <div class="font-medium text-gray-900">${safeHtml(t.full_name)}</div>
                    <div class="text-sm text-gray-500">${safeHtml(t.email)}</div>
                    <div class="text-sm text-gray-600">${safeHtml(t.phone)}</div>
                </td>
                <td class="p-4">
                    <div class="space-y-2">
                        ${primarySubject ? `
                            <span class="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                \u{1F3AF} ${safeHtml(primarySubject.subject_name)}
                            </span>
                        ` : '<span class="text-gray-400 text-xs">No primary subject</span>'}
                        ${additionalSubjects.length > 0 ? `
                            <div class="flex flex-wrap gap-1">
                                ${additionalSubjects.map((s) => `
                                    <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                        ${safeHtml(s.subject_name)}
                                    </span>
                                `).join("")}
                            </div>
                        ` : ""}
                    </div>
                </td>
                <td class="p-4">
                    <div class="flex gap-2">
                        <button type="button" onclick="editSubjects(${t.id}, '${safeHtml(t.full_name)}')" 
                                class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit Subjects
                        </button>
                        <button type="button" onclick="removeTeacher(${t.id})" 
                                class="text-red-600 hover:text-red-800 text-sm font-medium">
                            Remove
                        </button>
                    </div>
                </td>
            </tr>
        `;
  }).join("");
  return `
      <div class="max-w-6xl mx-auto p-6">
          <div class="flex justify-between items-center mb-6">
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Teachers Management</h1>
                <p class="text-gray-600">Manage teachers and assign subjects</p>
              </div>
              <button type="button" onclick="toggleAddForm()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  + Add Teacher
              </button>
          </div>

          <!-- Add Teacher Form -->
          <div id="add-form" class="hidden mb-6 bg-white rounded-lg border p-6">
              <h3 class="text-lg font-semibold mb-4">Add New Teacher</h3>
              <form onsubmit="addTeacher(event)" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                      <input type="text" name="full_name" placeholder="Full Name" required 
                             class="border rounded px-3 py-2">
                      <input type="email" name="email" placeholder="Email" required 
                             class="border rounded px-3 py-2">
                  </div>
                  <div class="flex gap-2">
                      <span class="bg-gray-100 px-3 py-2 rounded text-sm">+880</span>
                      <input type="text" name="phone_digits" placeholder="1XXXXXXXXX" required maxlength="10" 
                             class="flex-1 border rounded px-3 py-2">
                  </div>
                  <div class="flex gap-2">
                      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                          Add Teacher
                      </button>
                      <button type="button" onclick="toggleAddForm()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                          Cancel
                      </button>
                  </div>
              </form>
          </div>

          <!-- Teachers Table -->
          <div class="bg-white rounded-lg border overflow-hidden">
              <table class="w-full">
                  <thead class="bg-gray-50">
                      <tr>
                          <th class="p-4 text-left font-medium text-gray-900">Teacher</th>
                          <th class="p-4 text-left font-medium text-gray-900">Subjects</th>
                          <th class="p-4 text-left font-medium text-gray-900">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${teacherRows.length > 0 ? teacherRows : `
                          <tr>
                              <td colspan="3" class="p-8 text-center text-gray-500">
                                  <div class="flex flex-col items-center">
                                      <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-12h13a6 6 0 016 12v1m-18 0V7a4 4 0 114 0h4a2 2 0 012 2v1a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2h-4a2 2 0 00-2 2v-1z"></path>
                                      </svg>
                                      <p class="text-lg font-medium mb-2">No teachers added yet</p>
                                      <p class="text-sm">Click "Add Teacher" to get started</p>
                                  </div>
                              </td>
                          </tr>
                      `}
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Subject Modal -->
      <div id="subject-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
          <div class="bg-white rounded-lg max-w-md w-full">
              <!-- Step 1: Primary Subject Selection -->
              <div id="primary-step" class="p-4">
                  <div class="p-4 border-b">
                      <h3 class="font-semibold">Assign Primary Subject</h3>
                      <p class="text-sm text-gray-600">For <span id="teacher-name"></span></p>
                  </div>
                  <div class="p-4">
                      <form onsubmit="goToOptionalSubjects(event)" class="space-y-4">
                          <input type="hidden" id="modal-teacher-id">
                          <div>
                              <label class="block text-sm font-medium mb-2">Primary Subject *</label>
                              <select id="primary-subject" required class="w-full border rounded px-3 py-2">
                                  <option value="">Select primary subject...</option>
                                  ${allSubjects.map((s) => `<option value="${s.id}">${safeHtml(s.subject_name)}</option>`).join("")}
                              </select>
                          </div>
                          <div class="flex gap-2 pt-2 border-t">
                              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Continue</button>
                              <button type="button" onclick="closeModal()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
                          </div>
                      </form>
                  </div>
              </div>

              <!-- Step 2: Optional Subjects Selection -->
              <div id="optional-step" class="p-4 hidden">
                  <div class="p-4 border-b">
                      <h3 class="font-semibold">Assign Optional Subjects</h3>
                      <p class="text-sm text-gray-600">For <span id="teacher-name-optional"></span></p>
                      <p class="text-xs text-blue-600 mt-1">Primary: <span id="selected-primary-name"></span></p>
                  </div>
                  <div class="p-4">
                      <form onsubmit="saveSubjects(event)" class="space-y-4">
                          <input type="hidden" id="modal-teacher-id-optional">
                          <input type="hidden" id="selected-primary-id">
                          <div>
                              <label class="block text-sm font-medium mb-2">Optional Subjects</label>
                              <div class="max-h-40 overflow-y-auto border rounded p-2">
                                  ${allSubjects.map((s) => `
                                      <label class="flex items-center gap-2 text-sm optional-subject-item" data-subject-id="${s.id}">
                                          <input type="checkbox" name="optional" value="${s.id}" class="optional-checkbox">
                                          ${safeHtml(s.subject_name)}
                                      </label>
                                  `).join("")}
                              </div>
                              <p class="text-xs text-gray-500 mt-1">Select additional subjects (optional)</p>
                          </div>
                          <div class="flex gap-2 pt-2 border-t">
                              <button type="button" onclick="goBackToPrimary()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">Back</button>
                              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirm</button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>

      <script>
        // Data storage - simple approach
        window.teachersData = {
            teachers: ${JSON.stringify(teachers)},
            allSubjects: ${JSON.stringify(allSubjects)},
            teacherSubjects: ${JSON.stringify(teacherSubjects)}
        };

        // Simple functions
        function toggleAddForm() {
            document.getElementById('add-form').classList.toggle('hidden');
        }

        function addTeacher(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            const phoneDigits = data.phone_digits.replace(/\\D/g, '');
            if (phoneDigits.length !== 10) {
                alert('Please enter a valid 10-digit phone number');
                return;
            }
            
            data.phone = '+880-' + phoneDigits;
            delete data.phone_digits;
            
            fetch('/school/teachers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                alert('Network error. Please try again.');
            });
        }

        function editSubjects(teacherId, teacherName) {
            document.getElementById('modal-teacher-id').value = teacherId;
            document.getElementById('teacher-name').textContent = teacherName;
            document.getElementById('subject-modal').classList.remove('hidden');
            
            // Reset to primary step
            showPrimaryStep();
            
            // Load current subjects for editing
            const currentSubjects = window.teachersData.teacherSubjects.filter(ts => ts.teacher_id == teacherId);
            const primary = currentSubjects.find(ts => ts.is_primary === 1);
            const additional = currentSubjects.filter(ts => ts.is_primary === 0);
            
            if (primary) {
                document.getElementById('primary-subject').value = primary.subject_id;
            }
            
            // Store additional subjects for later
            window.currentAdditionalSubjects = additional.map(ts => ts.subject_id);
        }

        function showPrimaryStep() {
            document.getElementById('primary-step').classList.remove('hidden');
            document.getElementById('optional-step').classList.add('hidden');
        }

        function showOptionalStep() {
            document.getElementById('primary-step').classList.add('hidden');
            document.getElementById('optional-step').classList.remove('hidden');
        }

        function goToOptionalSubjects(e) {
            e.preventDefault();
            
            const primarySelect = document.getElementById('primary-subject');
            const primaryId = primarySelect.value;
            const primaryName = primarySelect.options[primarySelect.selectedIndex].text;
            
            if (!primaryId) {
                alert('Please select a primary subject');
                return;
            }
            
            // Set data for optional step
            document.getElementById('modal-teacher-id-optional').value = document.getElementById('modal-teacher-id').value;
            document.getElementById('teacher-name-optional').textContent = document.getElementById('teacher-name').textContent;
            document.getElementById('selected-primary-name').textContent = primaryName;
            document.getElementById('selected-primary-id').value = primaryId;
            
            // Update optional subjects list - hide the selected primary subject
            updateOptionalSubjectsList(primaryId);
            
            // Show optional step
            showOptionalStep();
        }

        function updateOptionalSubjectsList(primaryId) {
            const optionalItems = document.querySelectorAll('.optional-subject-item');
            const optionalCheckboxes = document.querySelectorAll('.optional-checkbox');
            
            optionalItems.forEach((item, index) => {
                const subjectId = item.dataset.subjectId;
                const checkbox = optionalCheckboxes[index];
                
                if (subjectId == primaryId) {
                    // Hide the primary subject from optional list
                    item.style.display = 'none';
                    checkbox.checked = false;
                    checkbox.disabled = true;
                } else {
                    // Show other subjects
                    item.style.display = 'flex';
                    checkbox.disabled = false;
                    
                    // Pre-select if it was previously selected
                    if (window.currentAdditionalSubjects && window.currentAdditionalSubjects.includes(parseInt(subjectId))) {
                        checkbox.checked = true;
                    }
                }
            });
        }

        function goBackToPrimary() {
            showPrimaryStep();
        }

        function closeModal() {
            document.getElementById('subject-modal').classList.add('hidden');
            showPrimaryStep(); // Reset to primary step for next time
            window.currentAdditionalSubjects = []; // Clear stored additional subjects
        }

        function saveSubjects(e) {
            e.preventDefault();
            
            const primary = document.getElementById('selected-primary-id').value;
            if (!primary) {
                alert('Please select a primary subject');
                return;
            }
            
            const additional = Array.from(document.querySelectorAll('input[name="optional"]:checked'))
                .map(cb => parseInt(cb.value));
            
            const data = {
                teacher_id: document.getElementById('modal-teacher-id-optional').value,
                primary_subject: parseInt(primary),
                additional_subjects: additional,
                action: 'assign_subjects'
            };
            
            fetch('/school/teachers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    closeModal();
                    location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                alert('Network error. Please try again.');
            });
        }

        function removeTeacher(teacherId) {
            if (!confirm('Remove this teacher?')) return;
            
            fetch('/school/teachers', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: teacherId})
            }).then(r => r.json()).then(result => {
                if (result.success) {
                    location.reload();
                } else {
                    alert('Error: ' + (result.error || 'Unknown error'));
                }
            }).catch(err => {
                alert('Network error. Please try again.');
            });
        }

        function safeHtml(text) {
            if (!text) return '';
            return text.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
      <\/script>
    `;
}
__name(TeachersPageHTML, "TeachersPageHTML");
function safeHtml(text) {
  if (!text) return "";
  return text.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(safeHtml, "safeHtml");

// src/ui/institute/classes.js
init_checked_fetch();
init_modules_watch_stub();
function ClassesPageHTML(school, classes = [], groups = [], sections = [], subjects = [], classSubjects = [], groupSubjects = [], scheduleConfig = {}) {
  const classGroups = {};
  groups.forEach((g) => {
    if (!classGroups[g.class_id]) classGroups[g.class_id] = [];
    classGroups[g.class_id].push(g);
  });
  const classSections = {};
  sections.forEach((s) => {
    if (!classSections[s.class_id]) classSections[s.class_id] = [];
    classSections[s.class_id].push(s);
  });
  const subjectsByClass = {};
  classSubjects.forEach((cs) => {
    if (!subjectsByClass[cs.class_id]) subjectsByClass[cs.class_id] = [];
    subjectsByClass[cs.class_id].push(cs);
  });
  const subjectsByGroup = {};
  groupSubjects.forEach((gs) => {
    if (!subjectsByGroup[gs.group_id]) subjectsByGroup[gs.group_id] = [];
    subjectsByGroup[gs.group_id].push(gs);
  });
  const maxClassesPerSection = scheduleConfig.maxClassesPerSection || 40;
  function calculateSectionCapacity(classId, groupId) {
    let totalClasses = 0;
    const classSubjects2 = subjectsByClass[classId] || [];
    totalClasses += classSubjects2.reduce((sum, s) => sum + (s.classes_per_week || 0), 0);
    if (groupId) {
      const groupSubjects2 = subjectsByGroup[groupId] || [];
      totalClasses += groupSubjects2.reduce((sum, s) => sum + (s.classes_per_week || 0), 0);
    }
    return {
      current: totalClasses,
      max: maxClassesPerSection,
      available: maxClassesPerSection - totalClasses,
      percentage: Math.round(totalClasses / maxClassesPerSection * 100)
    };
  }
  __name(calculateSectionCapacity, "calculateSectionCapacity");
  const classesTabContent = classes.map((cls) => {
    const groups2 = classGroups[cls.id] || [];
    const sections2 = classSections[cls.id] || [];
    const sectionsByGroup = {};
    groups2.forEach((g) => {
      sectionsByGroup[g.id] = {
        group: g,
        sections: sections2.filter((s) => s.group_id === g.id)
      };
    });
    const sectionsWithoutGroup = sections2.filter((s) => !s.group_id);
    return `
            <div class="mb-4 border border-gray-300">
                <!-- Class Header -->
                <div class="bg-gray-100 px-3 py-2 border-b">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-sm md:text-base">${cls.class_name}</span>
                            <span class="text-xs text-gray-500">(${groups2.length} groups, ${sections2.length} sections)</span>
                        </div>
                        <div class="text-xs text-gray-500">
                            ${cls.has_groups ? "Has Groups" : "No Groups"}
                        </div>
                    </div>
                </div>

                <!-- Groups and Sections -->
                <div class="p-2">
                    ${groups2.length > 0 ? `
                        <div class="space-y-2">
                            ${groups2.map((g) => {
      const groupSections = sectionsByGroup[g.id]?.sections || [];
      const capacity = calculateSectionCapacity(cls.id, g.id);
      return `
                                    <div class="border-l-2 border-gray-400 pl-2">
                                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span class="font-semibold text-sm md:text-base">${g.group_name}</span>
                                                <span class="text-xs text-gray-500">(${groupSections.length} sections)</span>
                                                <div class="text-xs px-2 py-1 rounded capacity-indicator ${capacity.percentage >= 90 ? "bg-red-100 text-red-700" : capacity.percentage >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}">
                                                    ${capacity.current}/${capacity.max} classes
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap gap-1">
                                            ${groupSections.map((s) => `
                                                <span class="border border-gray-300 px-2 py-1 text-sm">
                                                    ${s.section_name}
                                                </span>
                                            `).join("")}
                                        </div>
                                    </div>
                                `;
    }).join("")}
                        </div>
                    ` : ""}
                    
                    ${sectionsWithoutGroup.length > 0 ? `
                        <div class="border-l-2 border-gray-400 pl-2">
                            <div class="mb-1">
                                <span class="font-semibold">No Group</span>
                                <span class="text-xs text-gray-500 ml-2">(${sectionsWithoutGroup.length} sections)</span>
                                <div class="text-xs px-2 py-1 rounded bg-green-100 text-green-700 inline-block ml-2">
                                    ${calculateSectionCapacity(cls.id, null).current}/${maxClassesPerSection} classes
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                ${sectionsWithoutGroup.map((s) => `
                                    <span class="border border-gray-300 px-2 py-1 text-sm">
                                        ${s.section_name}
                                    </span>
                                `).join("")}
                            </div>
                        </div>
                    ` : ""}
                    
                    ${groups2.length === 0 && sectionsWithoutGroup.length === 0 ? `
                        <div class="text-center py-4 text-gray-400 text-sm">
                            No groups or sections added yet
                        </div>
                    ` : ""}
                </div>
            </div>
        `;
  }).join("");
  return `
      <style>
        /* Mobile responsive design */
        @media (max-width: 768px) {
          .capacity-indicator {
            font-size: 10px;
            padding: 2px 4px;
          }
        }
        
        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px !important;
        }
      </style>
      
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/school/dashboard" class="hover:text-blue-600">Back to Dashboard</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Classes & Groups</span>
         </div>

         <!-- Master Schedule Information (Read-only) -->
         <div class="mb-6 bg-gray-50 p-4 border border-gray-300">
             <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                 <div class="flex flex-col md:flex-row md:items-center gap-4">
                     <span class="font-semibold text-sm md:text-base">\u{1F4C5} Master Schedule Configuration</span>
                     <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                         <span class="text-sm">Working Days: <strong>${scheduleConfig.workingDaysCount || 5}</strong></span>
                         <span class="text-sm">Class Periods/Day: <strong>${scheduleConfig.actualClassPeriodsPerDay || 8}</strong></span>
                     </div>
                 </div>
                 <div class="text-sm text-gray-600">
                     <strong>Total Capacity:</strong> ${maxClassesPerSection} classes/week per section
                     <div class="text-xs text-gray-500 mt-1">
                         (Calculated from master schedule: ${scheduleConfig.workingDaysCount || 5} days \xD7 ${scheduleConfig.actualClassPeriodsPerDay || 8} class periods)
                     </div>
                 </div>
             </div>
             <div class="text-xs text-gray-500 mt-2">
                 \u26A0\uFE0F Schedule configuration is managed in Master Schedule. This ensures consistency with routine generation.
             </div>
         </div>

         <!-- Classes Hierarchy (Read-only) -->
         <div class="space-y-4">
             ${classesTabContent.length > 0 ? classesTabContent : `
                 <div class="bg-white border border-gray-200 rounded-lg p-8 text-center">
                     <p class="text-gray-400">No classes found</p>
                 </div>
             `}
         </div>
      </div>
    `;
}
__name(ClassesPageHTML, "ClassesPageHTML");

// src/ui/institute/subjects.js
init_checked_fetch();
init_modules_watch_stub();
function SubjectsPageHTML(school, subjects = [], classes = [], groups = [], sections = [], classSubjects = [], groupSubjects = [], scheduleConfig = {}) {
  const classGroups = {};
  groups.forEach((g) => {
    if (!classGroups[g.class_id]) classGroups[g.class_id] = [];
    classGroups[g.class_id].push(g);
  });
  const classSections = {};
  sections.forEach((s) => {
    if (!classSections[s.class_id]) classSections[s.class_id] = [];
    classSections[s.class_id].push(s);
  });
  const subjectsByClass = {};
  classSubjects.forEach((cs) => {
    if (!subjectsByClass[cs.class_id]) subjectsByClass[cs.class_id] = [];
    subjectsByClass[cs.class_id].push(cs);
  });
  const subjectsByGroup = {};
  groupSubjects.forEach((gs) => {
    if (!subjectsByGroup[gs.group_id]) subjectsByGroup[gs.group_id] = [];
    subjectsByGroup[gs.group_id].push(gs);
  });
  const maxClassesPerSection = scheduleConfig.maxClassesPerSection || 40;
  function calculateSectionCapacity(classId, groupId) {
    let totalClasses = 0;
    const classSubjects2 = subjectsByClass[classId] || [];
    totalClasses += classSubjects2.reduce((sum, s) => sum + (s.classes_per_week || 0), 0);
    if (groupId) {
      const groupSubjects2 = subjectsByGroup[groupId] || [];
      totalClasses += groupSubjects2.reduce((sum, s) => sum + (s.classes_per_week || 0), 0);
    }
    return {
      current: totalClasses,
      max: maxClassesPerSection,
      available: maxClassesPerSection - totalClasses,
      percentage: Math.round(totalClasses / maxClassesPerSection * 100)
    };
  }
  __name(calculateSectionCapacity, "calculateSectionCapacity");
  const subjectBankContent = `
        <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-100">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Subject Bank</h3>
                <div class="flex gap-2">
                    <input type="text" id="new-subject" placeholder="New Subject Name..." 
                           class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <button onclick="createSubject()" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black">
                        + Add Subject
                    </button>
                </div>
            </div>
            <div class="p-4">
                <div class="space-y-2">
                    ${subjects.map((sub, index) => `
                        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all">
                            <div class="flex items-center gap-3 flex-1">
                                <span class="text-sm font-mono text-gray-400 w-6">${index + 1}.</span>
                                <span id="name-${sub.id}" class="text-sm font-medium text-gray-700">${sub.subject_name}</span>
                                <form id="form-${sub.id}" onsubmit="updateSubject(event, ${sub.id})" class="hidden flex-1 flex gap-2">
                                    <input type="text" name="name" value="${sub.subject_name}" class="w-full text-sm border rounded px-2 py-1">
                                    <button type="submit" class="text-green-600 text-xs font-bold">Save</button>
                                    <button type="button" onclick="toggleEdit(${sub.id})" class="text-gray-400 text-xs">Cancel</button>
                                </form>
                            </div>
                            <div class="flex items-center gap-1">
                                <button onclick="toggleEdit(${sub.id})" class="p-2 text-gray-400 hover:text-blue-600">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                                <button onclick="deleteSubject(${sub.id})" class="p-2 text-gray-400 hover:text-red-600">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </div>
                    `).join("")}
                    ${subjects.length === 0 ? '<div class="p-8 text-center text-gray-400 text-sm italic">No subjects added yet.</div>' : ""}
                </div>
            </div>
        </div>
    `;
  const classCurriculumContent = classes.map((cls) => {
    const groups2 = classGroups[cls.id] || [];
    const classSubjects2 = subjectsByClass[cls.id] || [];
    return `
            <div class="mb-6 border border-gray-300">
                <div class="bg-gray-100 px-3 py-2 border-b">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <span class="font-bold text-sm md:text-base">${cls.class_name}</span>
                        <button onclick="openAddClassSubjectModal(${cls.id}, '${cls.class_name}')" class="text-xs bg-blue-600 text-white px-2 py-1 hover-lift">
                            + Add Class Subject
                        </button>
                    </div>
                </div>
                
                <!-- Class-Level Subjects -->
                <div class="p-3">
                    <div class="mb-3">
                        <h4 class="text-sm font-semibold text-gray-700 mb-2">\u{1F4DA} Common Subjects (All Groups)</h4>
                        ${classSubjects2.length > 0 ? `
                            <div class="space-y-2">
                                ${classSubjects2.map((cs) => `
                                    <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-blue-50 p-2 rounded subject-item">
                                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                            <span class="font-medium text-sm">${cs.subject_name}</span>
                                            <div class="flex flex-wrap gap-2 text-xs">
                                                <span class="text-gray-600">${cs.classes_per_week} classes/week</span>
                                                <span class="text-gray-500">min: ${cs.min_classes}, max: ${cs.max_classes}</span>
                                            </div>
                                        </div>
                                        <button onclick="deleteClassSubject(${cs.id})" class="text-xs text-red-600 self-end sm:self-auto">Remove</button>
                                    </div>
                                `).join("")}
                            </div>
                        ` : '<p class="text-sm text-gray-400">No common subjects added</p>'}
                    </div>
                    
                    <!-- Group-Level Subjects -->
                    ${groups2.map((g) => {
      const groupSubjects2 = subjectsByGroup[g.id] || [];
      const capacity = calculateSectionCapacity(cls.id, g.id);
      return `
                            <div class="mb-3 border-l-2 border-purple-300 pl-3">
                                <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                                    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <h4 class="text-sm font-semibold text-gray-700">\u{1F3AF} ${g.group_name} Group</h4>
                                        <span class="text-xs text-gray-500">(${classSections[g.class_id]?.filter((s) => s.group_id === g.id).length || 0} sections)</span>
                                        <div class="text-xs px-2 py-1 rounded capacity-indicator ${capacity.percentage >= 90 ? "bg-red-100 text-red-700" : capacity.percentage >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}">
                                            ${capacity.current}/${capacity.max} classes
                                        </div>
                                    </div>
                                    <button onclick="openAddGroupSubjectModal(${g.id}, '${g.group_name}', ${cls.id}, '${cls.class_name}')" class="text-xs bg-purple-600 text-white px-2 py-1">
                                        + Add Subject
                                    </button>
                                </div>
                                ${groupSubjects2.length > 0 ? `
                                    <div class="space-y-2">
                                        ${groupSubjects2.map((gs) => `
                                            <div class="flex flex-col md:flex-row md:items-center md:justify-between bg-purple-50 p-2 rounded subject-item">
                                                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                                    <span class="font-medium text-sm">${gs.subject_name}</span>
                                                    <div class="flex flex-wrap gap-2 text-xs">
                                                        <span class="text-gray-600">${gs.classes_per_week} classes/week</span>
                                                        <span class="text-gray-500">min: ${gs.min_classes}, max: ${gs.max_classes}</span>
                                                    </div>
                                                </div>
                                                <button onclick="deleteGroupSubject(${gs.id})" class="text-xs text-red-600 self-end sm:self-auto">Remove</button>
                                            </div>
                                        `).join("")}
                                    </div>
                                ` : '<p class="text-sm text-gray-400">No subjects added to this group</p>'}
                            </div>
                        `;
    }).join("")}
                </div>
            </div>
        `;
  }).join("");
  return `
      <style>
        /* Enhanced animations and transitions */
        .btn-primary {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .btn-primary:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Tab styling */
        .tab-button {
          transition: all 0.2s ease;
        }
        .tab-button.active {
          border-bottom: 2px solid #3b82f6;
          color: #3b82f6;
        }
        
        /* Mobile responsive design */
        @media (max-width: 768px) {
          .tab-button {
            font-size: 12px;
            padding: 8px 4px;
          }
          
          .capacity-indicator {
            font-size: 10px;
            padding: 2px 4px;
          }
          
          .subject-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .subject-item button {
            align-self: flex-end;
          }
          
          .modal-content {
            margin: 16px;
            max-width: calc(100vw - 32px);
          }
          
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px !important;
        }
      </style>
      
      <div>
         <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <a href="/school/dashboard" class="hover:text-blue-600">Back to Dashboard</a>
            <span>/</span>
            <span class="text-gray-900 font-bold">Subjects Management</span>
         </div>

         <!-- Master Schedule Information (Read-only) -->
         <div class="mb-6 bg-gray-50 p-4 border border-gray-300">
             <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                 <div class="flex flex-col md:flex-row md:items-center gap-4">
                     <span class="font-semibold text-sm md:text-base">\u{1F4C5} Master Schedule Configuration</span>
                     <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                         <span class="text-sm">Working Days: <strong>${scheduleConfig.workingDaysCount || 5}</strong></span>
                         <span class="text-sm">Class Periods/Day: <strong>${scheduleConfig.actualClassPeriodsPerDay || 8}</strong></span>
                     </div>
                 </div>
                 <div class="text-sm text-gray-600">
                     <strong>Total Capacity:</strong> ${maxClassesPerSection} classes/week per section
                     <div class="text-xs text-gray-500 mt-1">
                         (Calculated from master schedule: ${scheduleConfig.workingDaysCount || 5} days \xD7 ${scheduleConfig.actualClassPeriodsPerDay || 8} class periods)
                     </div>
                 </div>
             </div>
             <div class="text-xs text-gray-500 mt-2">
                 \u26A0\uFE0F Schedule configuration is managed in Master Schedule. This ensures consistency with routine generation.
             </div>
         </div>

         <!-- Tab Navigation -->
         <div class="border-b border-gray-300 mb-4">
             <div class="flex space-x-6">
                 <button onclick="switchTab('bank')" id="bank-tab" class="tab-button active pb-2 px-1 text-sm font-medium">
                     \u{1F4DA} Subject Bank
                 </button>
                 <button onclick="switchTab('curriculum')" id="curriculum-tab" class="tab-button pb-2 px-1 text-sm font-medium text-gray-500">
                     \u{1F3AF} Class Curriculum
                 </button>
             </div>
         </div>

         <!-- Tab Content -->
         <div id="bank-content" class="tab-content">
             ${subjectBankContent}
         </div>

         <div id="curriculum-content" class="tab-content hidden">
             <div class="space-y-4">
                 ${classCurriculumContent.length > 0 ? classCurriculumContent : `
                     <div class="bg-white border border-gray-200 rounded-lg p-8 text-center">
                         <p class="text-gray-400">No classes found</p>
                     </div>
                 `}
             </div>
         </div>
      </div>

      <!-- Add Class Subject Modal -->
      <div id="addClassSubjectModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative modal-content">
              <h3 class="font-bold mb-3 text-sm md:text-base">Add Subject to Class</h3>
              <form onsubmit="addClassSubject(event)">
                  <input type="hidden" name="class_id" id="class_subject_class_id">
                  <div class="mb-3">
                      <select name="subject_id" required class="w-full border border-gray-300 px-2 py-2 text-sm">
                          <option value="">Select Subject</option>
                          ${subjects.map((s) => `<option value="${s.id}">${s.subject_name}</option>`).join("")}
                      </select>
                  </div>
                  <div class="grid grid-cols-2 gap-2 mb-3 form-grid">
                      <div>
                          <label class="text-xs text-gray-600 block mb-1">Classes/Week</label>
                          <input type="number" name="classes_per_week" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                      </div>
                      <div>
                          <label class="text-xs text-gray-600 block mb-1">Min Classes</label>
                          <input type="number" name="min_classes" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                      </div>
                  </div>
                  <div class="mb-3">
                      <label class="text-xs text-gray-600 block mb-1">Max Classes</label>
                      <input type="number" name="max_classes" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                      <button type="submit" class="bg-blue-600 text-white px-3 py-2 text-sm" id="addClassSubjectBtn">Add Subject</button>
                      <button type="button" onclick="closeModal('addClassSubjectModal')" class="bg-gray-200 text-gray-800 px-3 py-2 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <!-- Add Group Subject Modal -->
      <div id="addGroupSubjectModal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-md p-4 relative modal-content">
              <h3 class="font-bold mb-3 text-sm md:text-base">Add Subject to Group</h3>
              <form onsubmit="addGroupSubject(event)">
                  <input type="hidden" name="group_id" id="group_subject_group_id">
                  <input type="hidden" name="class_id" id="group_subject_class_id">
                  <div class="mb-3">
                      <select name="subject_id" required class="w-full border border-gray-300 px-2 py-2 text-sm">
                          <option value="">Select Subject</option>
                          ${subjects.map((s) => `<option value="${s.id}">${s.subject_name}</option>`).join("")}
                      </select>
                  </div>
                  <div class="grid grid-cols-2 gap-2 mb-3 form-grid">
                      <div>
                          <label class="text-xs text-gray-600 block mb-1">Classes/Week</label>
                          <input type="number" name="classes_per_week" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                      </div>
                      <div>
                          <label class="text-xs text-gray-600 block mb-1">Min Classes</label>
                          <input type="number" name="min_classes" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                      </div>
                  </div>
                  <div class="mb-3">
                      <label class="text-xs text-gray-600 block mb-1">Max Classes</label>
                      <input type="number" name="max_classes" required min="1" max="20" class="w-full border border-gray-300 px-2 py-2 text-sm">
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                      <button type="submit" class="bg-purple-600 text-white px-3 py-2 text-sm" id="addGroupSubjectBtn">Add Subject</button>
                      <button type="button" onclick="closeModal('addGroupSubjectModal')" class="bg-gray-200 text-gray-800 px-3 py-2 text-sm">Cancel</button>
                  </div>
              </form>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        const MAX_CLASSES_PER_SECTION = ${maxClassesPerSection};

        // Tab switching
        function switchTab(tabName) {
            // Hide all content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab-button').forEach(tab => {
                tab.classList.remove('active');
                tab.classList.add('text-gray-500');
            });
            
            // Show selected content
            document.getElementById(tabName + '-content').classList.remove('hidden');
            
            // Add active class to selected tab
            const activeTab = document.getElementById(tabName + '-tab');
            activeTab.classList.add('active');
            activeTab.classList.remove('text-gray-500');
        }

        // Subject Bank functions
        function createSubject() {
            const input = document.getElementById('new-subject');
            const name = input.value.trim();
            if (!name) return;
            
            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'create', name: name})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        function toggleEdit(id) {
            document.getElementById('name-'+id).classList.toggle('hidden');
            document.getElementById('form-'+id).classList.toggle('hidden');
        }

        function updateSubject(e, id) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('name');
            
            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'rename', id: id, name: name})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        function deleteSubject(id) {
            if(!confirm("Delete this subject?")) return;
            
            fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({type: 'bank', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        // Curriculum functions
        function openAddClassSubjectModal(classId, className) {
            document.getElementById('class_subject_class_id').value = classId;
            openModal('addClassSubjectModal');
            setTimeout(() => {
                document.querySelector('#addClassSubjectModal select[name="subject_id"]').focus();
            }, 100);
        }

        function openAddGroupSubjectModal(groupId, groupName, classId, className) {
            document.getElementById('group_subject_group_id').value = groupId;
            document.getElementById('group_subject_class_id').value = classId;
            openModal('addGroupSubjectModal');
            setTimeout(() => {
                document.querySelector('#addGroupSubjectModal select[name="subject_id"]').focus();
            }, 100);
        }

        function addClassSubject(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('addClassSubjectBtn');
            if (submitBtn.disabled) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_class_subject';
            data.school_id = SCHOOL_ID;

            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error adding subject: ' + (response.error || 'Unknown error'));
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Subject';
                }
            });
        }

        function addGroupSubject(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('addGroupSubjectBtn');
            if (submitBtn.disabled) return;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Adding...';
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.action = 'add_group_subject';
            data.school_id = SCHOOL_ID;

            fetch('/school/subjects', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                } else {
                    alert('Error adding subject: ' + (response.error || 'Unknown error'));
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Add Subject';
                }
            });
        }

        function deleteClassSubject(id) {
            if(!confirm("Remove this subject from class?")) return;
            
            fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_class_subject', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        function deleteGroupSubject(id) {
            if(!confirm("Remove this subject from group?")) return;
            
            fetch('/school/subjects', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({action: 'delete_group_subject', id: id})
            }).then(res => res.json()).then(response => {
                if(response.success) {
                    window.location.reload();
                }
            });
        }

        // Modal management
        function openModal(modalId) {
            document.getElementById(modalId).classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
            document.body.style.overflow = '';
            const modal = document.getElementById(modalId);
            const submitBtn = modal.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Add Subject';
            }
            modal.querySelector('form').reset();
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.fixed.inset-0');
                modals.forEach(modal => {
                    if (!modal.classList.contains('hidden')) {
                        closeModal(modal.id);
                    }
                });
            }
        });

        // Close modal on background click
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
                closeModal(e.target.id);
            }
        });
      <\/script>
    `;
}
__name(SubjectsPageHTML, "SubjectsPageHTML");

// src/ui/institute/schedules.js
init_checked_fetch();
init_modules_watch_stub();
function SchedulesPageHTML(config = null, existingSlots = []) {
  existingSlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
  const initialSchoolStart = existingSlots.length > 0 ? existingSlots[0].start_time : config?.start_time || "08:00";
  return `
      <div class="max-w-7xl xl:max-w-8xl mx-auto pb-24 md:pb-10 select-none" id="schedule-app">
          
          <div class="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
              <div class="flex justify-between items-center px-4 py-3 md:px-6 md:py-4">
                  <div>
                    <h2 class="text-lg md:text-2xl font-bold text-gray-900">Master Schedule</h2>
                    <p class="text-sm md:text-base text-gray-500 mt-1">Configure your school's daily routine</p>
                  </div>
                  <div class="flex gap-3 md:gap-4">
                       <button onclick="app.save()" class="bg-black text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-bold active:scale-95 transition-transform">Save</button>
                       <button onclick="app.reset()" class="text-red-600 bg-red-50 px-4 py-2.5 md:px-5 md:py-3 rounded-lg text-sm md:text-base font-bold">Reset</button>
                  </div>
              </div>
          </div>

          <div class="mx-4 md:mx-6 mt-4 md:mt-4 p-4 md:p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div class="flex items-center gap-4">
                      <span class="text-sm md:text-base font-bold text-blue-800 uppercase tracking-wide">Day Starts At:</span>
                      <input type="time" id="school_start_time" value="${initialSchoolStart}" onchange="app.updateStartTime(this.value)" 
                             class="bg-white border border-blue-200 text-blue-900 text-sm md:text-base font-bold rounded-lg px-4 py-2.5 md:px-4 md:py-2.5 outline-none w-24 md:w-28 text-center focus:ring-2 focus:ring-blue-500">
                  </div>
                  <div class="flex-1">
                      <div class="text-sm md:text-base font-bold text-blue-800 uppercase tracking-wide mb-3">Working Days:</div>
                      <div class="grid grid-cols-7 gap-2" id="weekday-selector">
                          <div class="text-center">
                              <label class="flex flex-col items-center gap-1 cursor-pointer">
                                  <input type="checkbox" name="weekday" value="monday" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="text-xs font-medium text-gray-700">Mon</span>
                              </label>
                          </div>
                          <div class="text-center">
                              <label class="flex flex-col items-center gap-1 cursor-pointer">
                                  <input type="checkbox" name="weekday" value="tuesday" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="text-xs font-medium text-gray-700">Tue</span>
                              </label>
                          </div>
                          <div class="text-center">
                              <label class="flex flex-col items-center gap-1 cursor-pointer">
                                  <input type="checkbox" name="weekday" value="wednesday" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="text-xs font-medium text-gray-700">Wed</span>
                              </label>
                          </div>
                          <div class="text-center">
                              <label class="flex flex-col items-center gap-1 cursor-pointer">
                                  <input type="checkbox" name="weekday" value="thursday" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="text-xs font-medium text-gray-700">Thu</span>
                              </label>
                          </div>
                          <div class="text-center">
                              <label class="flex flex-col items-center gap-1 cursor-pointer">
                                  <input type="checkbox" name="weekday" value="friday" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="text-xs font-medium text-gray-700">Fri</span>
                              </label>
                          </div>
                          <div class="text-center">
                              <label class="flex flex-col items-center gap-1 cursor-pointer">
                                  <input type="checkbox" name="weekday" value="saturday" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="text-xs font-medium text-gray-700">Sat</span>
                              </label>
                          </div>
                          <div class="text-center">
                              <label class="flex flex-col items-center gap-1 cursor-pointer">
                                  <input type="checkbox" name="weekday" value="sunday" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                  <span class="text-xs font-medium text-gray-700">Sun</span>
                              </label>
                          </div>
                      </div>
                      <div class="mt-2 text-xs text-gray-600">
                        <span id="working-days-count">5</span> working days selected
                      </div>
                  </div>
              </div>
          </div>

          <div class="mt-4 md:mt-4 bg-white border-t border-b border-gray-200 md:border md:rounded-lg md:mx-6 md:shadow-md overflow-hidden">
              
              <div class="hidden lg:grid grid-cols-12 gap-3 md:gap-4 p-4 md:p-5 bg-gray-100 text-sm md:text-base uppercase font-bold text-gray-500 border-b border-gray-200">
                  <div class="col-span-1 text-center">#</div>
                  <div class="col-span-2">Start</div>
                  <div class="col-span-2">End</div>
                  <div class="col-span-1">Mins</div>
                  <div class="col-span-4">Label</div>
                  <div class="col-span-1">Type</div>
                  <div class="col-span-1"></div>
              </div>

              <div id="slot-container" class="divide-y divide-gray-100"></div>

              <button id="add-btn" onclick="app.addPeriod()" class="w-full py-4 md:py-4 text-center text-blue-600 font-bold text-base md:text-lg hover:bg-gray-50 active:bg-blue-50 transition-colors">
                  + Add Next Period
              </button>
          </div>
      </div>

      <div id="tutorial-popup" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center px-4 backdrop-blur-sm">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-xs p-5 transform transition-all scale-100">
              <h3 class="text-sm font-bold text-gray-900 mb-2">\u26A0\uFE0F Cannot Change Start Time</h3>
              <p class="text-xs text-gray-600 mb-4 leading-relaxed">
                  This period starts automatically when the previous one ends.<br>
                  To change this time, adjust the <b>Duration</b> or <b>End Time</b> of the <u>previous period</u>.
              </p>
              <button onclick="document.getElementById('tutorial-popup').classList.add('hidden')" class="w-full bg-gray-900 text-white py-2 rounded text-xs font-bold">Okay, Got it</button>
          </div>
      </div>

      <script>
        const AppState = {
            slots: ${JSON.stringify(existingSlots)},
            startTime: "${initialSchoolStart}",
            workingDays: ${config?.working_days ? JSON.stringify(config.working_days) : '["monday","tuesday","wednesday","thursday","friday"]'}
        };

        // --- HELPER FUNCTIONS ---
        const Time = {
            add: (time, mins) => {
                if(!time) return "00:00";
                let [h, m] = time.split(':').map(Number);
                let date = new Date(2000, 0, 1, h, m);
                date.setMinutes(date.getMinutes() + (parseInt(mins) || 0));
                return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
            },
            diff: (start, end) => {
                let [h1, m1] = start.split(':').map(Number);
                let [h2, m2] = end.split(':').map(Number);
                return Math.round((new Date(2000, 0, 1, h2, m2) - new Date(2000, 0, 1, h1, m1)) / 60000);
            }
        };

        const app = {
            init: function() {
                if(AppState.slots.length === 0) this.addPeriod(false);
                this.recalculateChain(); 
                this.render();
                // Set working days checkboxes
                this.setWorkingDaysCheckboxes();
                this.updateWorkingDaysCount();
            },

            setWorkingDaysCheckboxes: function() {
                const checkboxes = document.querySelectorAll('input[name="weekday"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = AppState.workingDays.includes(checkbox.value);
                });
                
                // Add event listeners
                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {
                        this.updateWorkingDays();
                        this.updateWorkingDaysCount();
                    });
                });
            },

            updateWorkingDays: function() {
                const checkboxes = document.querySelectorAll('input[name="weekday"]:checked');
                AppState.workingDays = Array.from(checkboxes).map(cb => cb.value);
            },

            updateWorkingDaysCount: function() {
                const count = document.querySelectorAll('input[name="weekday"]:checked').length;
                document.getElementById('working-days-count').textContent = count;
            },

            updateStartTime: function(val) {
                AppState.startTime = val;
                this.recalculateChain();
                this.render();
            },

            addPeriod: function(render = true) {
                AppState.slots.push({
                    id: Date.now(),
                    label: "",
                    duration: 40,
                    type: 'class'
                });
                this.recalculateChain();
                if(render) this.render();
            },

            removePeriod: function(index) {
                if(AppState.slots.length <= 1) return;
                AppState.slots.splice(index, 1);
                this.recalculateChain();
                this.render();
            },

            // --- CORE LOGIC ---
            handleInput: function(index, field, value) {
                const slot = AppState.slots[index];

                if(field === 'start_time') {
                    if(index === 0) { this.updateStartTime(value); return; }
                    else {
                        // REVERT & SHOW WARNING
                        document.getElementById('tutorial-popup').classList.remove('hidden');
                        this.render(); // Re-render to revert visually
                        return;
                    }
                }

                if (field === 'duration') {
                    let mins = parseInt(value) || 0;
                    if(mins < 5) mins = 5; 
                    slot.duration = mins;
                } 
                else if (field === 'end_time') {
                    const newDiff = Time.diff(slot.start_time, value);
                    if (newDiff > 0) slot.duration = newDiff;
                    else { alert("End time must be after start time"); this.render(); return; }
                }
                else {
                    slot[field] = value;
                }

                this.recalculateChain();
                this.render();
            },

            recalculateChain: function() {
                let current = AppState.startTime;
                AppState.slots.forEach(slot => {
                    slot.start_time = current;
                    slot.end_time = Time.add(current, slot.duration);
                    current = slot.end_time; 
                });
            },

            save: async function() {
                try {
                    await fetch('/school/schedules', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ 
                            action: 'save_schedule', 
                            slots: AppState.slots,
                            working_days: AppState.workingDays
                        })
                    });
                    window.location.reload();
                } catch(e) { alert("Save failed"); }
            },

            reset: async function() {
                if(confirm("Reset entire schedule?")) {
                    await fetch('/school/schedules', { method: 'DELETE' });
                    window.location.reload();
                }
            },

            // --- RENDER ENGINE ---
            render: function() {
                const container = document.getElementById('slot-container');
                container.innerHTML = AppState.slots.map((slot, i) => this.renderRow(slot, i)).join('');
            },

            // --- OPTIMIZED ROW DESIGN ---
            renderRow: function(slot, i) {
                const isFirst = i === 0;
                
                return \`
                <div class="group bg-white relative">
                    <div class="hidden lg:grid grid-cols-12 gap-3 md:gap-4 p-4 md:p-5 items-center hover:bg-gray-50">
                        <div class="col-span-1 text-center text-base md:text-lg text-gray-400 font-bold">\${i+1}</div>
                        <div class="col-span-2">
                             <input type="time" value="\${slot.start_time}" onchange="app.handleInput(\${i}, 'start_time', this.value)" 
                             class="w-full text-base md:text-lg font-mono font-bold border border-gray-300 rounded-lg px-3 py-2.5 md:px-4 md:py-3 \${!isFirst ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-900'} focus:border-blue-500 focus:ring-2">
                        </div>
                        <div class="col-span-2">
                             <input type="time" value="\${slot.end_time}" onchange="app.handleInput(\${i}, 'end_time', this.value)" class="w-full text-base md:text-lg font-mono font-bold border border-gray-300 rounded-lg px-3 py-2.5 md:px-4 md:py-3 bg-white text-gray-900 focus:border-blue-500 focus:ring-2">
                        </div>
                        <div class="col-span-1">
                             <input type="number" value="\${slot.duration}" onchange="app.handleInput(\${i}, 'duration', this.value)" class="w-full text-base md:text-lg text-center font-bold bg-blue-50 text-blue-700 rounded-lg px-3 py-2.5 md:px-3 md:py-3 border-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="col-span-4">
                             <input type="text" value="\${slot.label}" onchange="app.handleInput(\${i}, 'label', this.value)" class="w-full text-base md:text-lg border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent py-2.5 md:py-3 outline-none font-medium placeholder-gray-400" placeholder="Period Name...">
                        </div>
                        <div class="col-span-1">
                             <select onchange="app.handleInput(\${i}, 'type', this.value)" class="text-sm md:text-base font-bold uppercase bg-transparent outline-none \${slot.type==='break'?'text-orange-500':'text-blue-600'}">
                                <option value="class" \${slot.type==='class'?'selected':''}>Class</option>
                                <option value="break" \${slot.type==='break'?'selected':''}>Break</option>
                             </select>
                        </div>
                        <div class="col-span-1 text-right">
                             <button onclick="app.removePeriod(\${i})" class="text-gray-300 hover:text-red-500 font-bold text-lg md:text-xl transition-colors p-3 rounded-lg hover:bg-red-50">&times;</button>
                        </div>
                    </div>

                    <div class="lg:hidden p-3 border-l-2 \${slot.type==='break'?'border-orange-300':'border-blue-300'} bg-gray-50">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-sm font-bold text-gray-500 w-3">\${i+1}</span>
                            
                            <div class="flex-1">
                                <input type="time" value="\${slot.start_time}" onchange="app.handleInput(\${i}, 'start_time', this.value)"
                                class="w-full text-sm font-mono text-center bg-white border border-gray-200 rounded py-1.5 text-gray-600">
                            </div>
                            <span class="text-gray-400 text-sm mx-1">\u2192</span>
                            
                            <div class="flex-1">
                                <input type="time" value="\${slot.end_time}" onchange="app.handleInput(\${i}, 'end_time', this.value)"
                                class="w-full text-sm font-mono font-bold text-center bg-white border border-gray-200 rounded py-1.5 text-gray-900">
                            </div>

                            <div class="w-12">
                                <input type="number" value="\${slot.duration}" onchange="app.handleInput(\${i}, 'duration', this.value)"
                                class="w-full text-sm font-bold text-center bg-blue-50 text-blue-700 rounded py-1.5 border-none">
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <input type="text" value="\${slot.label}" onchange="app.handleInput(\${i}, 'label', this.value)" 
                            class="flex-1 text-sm font-medium border-b border-gray-200 focus:border-blue-500 py-1 outline-none bg-white placeholder-gray-400" placeholder="Label...">
                            
                            <select onchange="app.handleInput(\${i}, 'type', this.value)" 
                            class="text-sm font-bold uppercase bg-white border border-gray-200 rounded px-2 py-1 outline-none \${slot.type==='break'?'text-orange-500':'text-blue-500'}">
                                <option value="class" \${slot.type==='class'?'selected':''}>CL</option>
                                <option value="break" \${slot.type==='break'?'selected':''}>BR</option>
                            </select>

                            <button onclick="app.removePeriod(\${i})" class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 bg-white rounded border border-gray-200">
                                <span class="text-sm leading-none">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
                \`;
            }
        };

        document.addEventListener('DOMContentLoaded', () => app.init());
      <\/script>
    `;
}
__name(SchedulesPageHTML, "SchedulesPageHTML");

// src/routers/router_institute.js
async function handleInstituteRequest(request, env) {
  const url = new URL(request.url);
  const email = getCookie(request, "user_email");
  if (!email) return htmlResponse("<h1>Login Failed</h1>");
  const school = await env.DB.prepare(`SELECT p.* FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id WHERE a.email = ?`).bind(email).first();
  if (!school) return new Response("Error", { status: 404 });
  if (url.pathname === "/school/dashboard") {
    const tCount = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
    const cCount = await env.DB.prepare("SELECT count(*) as count FROM academic_classes WHERE school_id = ?").bind(school.id).first();
    return htmlResponse(InstituteLayout(InstituteDashboardHTML({ teachers: tCount.count, classes: cCount.count }), "Dashboard", school.school_name));
  }
  if (url.pathname === "/school/schedules") {
    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (body.action === "save_schedule") {
          await env.DB.prepare("DELETE FROM schedule_slots WHERE school_id = ?").bind(school.id).run();
          for (let i = 0; i < body.slots.length; i++) {
            const slot = body.slots[i];
            await env.DB.prepare("INSERT INTO schedule_slots (school_id, slot_index, start_time, end_time, label, duration, type, applicable_shifts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(school.id, i, slot.start_time, slot.end_time, slot.label, slot.duration, slot.type, JSON.stringify(["all"])).run();
          }
          const workingDays = JSON.stringify(body.working_days || ["monday", "tuesday", "wednesday", "thursday", "friday"]);
          const allDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
          const offDays = JSON.stringify(allDays.filter((day) => !body.working_days?.includes(day)));
          const workingDaysCount = body.working_days?.length || 5;
          await env.DB.prepare("UPDATE schedule_config SET working_days = ?, off_days = ?, active_days = ? WHERE school_id = ?").bind(workingDays, offDays, workingDaysCount, school.id).run();
        }
        return jsonResponse({ success: true });
      } catch (e) {
        if (e.message.includes("no such table")) await syncDatabase(env);
        return jsonResponse({ error: e.message }, 500);
      }
    }
    if (request.method === "DELETE") {
      await env.DB.prepare("DELETE FROM schedule_slots WHERE school_id = ?").bind(school.id).run();
      await env.DB.prepare("DELETE FROM schedule_config WHERE school_id = ?").bind(school.id).run();
      return jsonResponse({ success: true });
    }
    let config = null;
    let slots = [];
    try {
      config = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      slots = (await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? ORDER BY slot_index ASC").bind(school.id).all()).results;
      slots = slots.map((slot) => {
        if (!slot.duration && slot.start_time && slot.end_time) {
          const [h1, m1] = slot.start_time.split(":").map(Number);
          const [h2, m2] = slot.end_time.split(":").map(Number);
          slot.duration = Math.round((new Date(2e3, 0, 1, h2, m2) - new Date(2e3, 0, 1, h1, m1)) / 6e4);
        }
        return slot;
      });
    } catch (e) {
      console.error("Database error:", e);
      await syncDatabase(env);
    }
    return htmlResponse(InstituteLayout(SchedulesPageHTML(config, slots), "Master Schedule", school.school_name));
  }
  if (url.pathname === "/school/subjects") {
    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (body.action === "create") {
          await env.DB.prepare("INSERT INTO academic_subjects (school_id, subject_name) VALUES (?, ?)").bind(school.id, body.name).run();
          return jsonResponse({ success: true });
        }
        if (body.action === "rename") {
          await env.DB.prepare("UPDATE academic_subjects SET subject_name = ? WHERE id = ?").bind(body.name, body.id).run();
          return jsonResponse({ success: true });
        }
        if (body.action === "add_class_subject") {
          await env.DB.prepare("INSERT INTO class_subjects (school_id, class_id, subject_id, classes_per_week, min_classes, max_classes) VALUES (?, ?, ?, ?, ?, ?)").bind(body.school_id, body.class_id, body.subject_id, body.classes_per_week, body.min_classes, body.max_classes).run();
          return jsonResponse({ success: true });
        }
        if (body.action === "add_group_subject") {
          await env.DB.prepare("INSERT INTO group_subjects (school_id, group_id, subject_id, classes_per_week, min_classes, max_classes) VALUES (?, ?, ?, ?, ?, ?)").bind(body.school_id, body.group_id, body.subject_id, body.classes_per_week, body.min_classes, body.max_classes).run();
          return jsonResponse({ success: true });
        }
        return jsonResponse({ error: "Invalid action" }, 400);
      } catch (e) {
        console.error("Subjects API Error:", e);
        return jsonResponse({ error: e.message }, 500);
      }
    }
    if (request.method === "DELETE") {
      const body = await request.json();
      if (body.type === "bank") {
        await env.DB.prepare("DELETE FROM academic_subjects WHERE id = ?").bind(body.id).run();
        await env.DB.prepare("DELETE FROM class_subjects WHERE subject_id = ?").bind(body.id).run();
        await env.DB.prepare("DELETE FROM group_subjects WHERE subject_id = ?").bind(body.id).run();
        return jsonResponse({ success: true });
      }
      if (body.action === "delete_class_subject") {
        await env.DB.prepare("DELETE FROM class_subjects WHERE id=?").bind(body.id).run();
        return jsonResponse({ success: true });
      }
      if (body.action === "delete_group_subject") {
        await env.DB.prepare("DELETE FROM group_subjects WHERE id=?").bind(body.id).run();
        return jsonResponse({ success: true });
      }
    }
    const subjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
    const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
    const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
    const sections = await env.DB.prepare("SELECT cs.*, cg.group_name FROM class_sections cs LEFT JOIN class_groups cg ON cs.group_id = cg.id WHERE cs.school_id = ?").bind(school.id).all();
    const classSubjects = await env.DB.prepare(`
        SELECT cs.*, sub.subject_name 
        FROM class_subjects cs 
        JOIN academic_subjects sub ON cs.subject_id = sub.id 
        WHERE cs.school_id = ?
      `).bind(school.id).all();
    const groupSubjects = await env.DB.prepare(`
        SELECT gs.*, sub.subject_name, g.group_name, g.class_id
        FROM group_subjects gs 
        JOIN academic_subjects sub ON gs.subject_id = sub.id
        JOIN class_groups g ON gs.group_id = g.id
        WHERE gs.school_id = ?
      `).bind(school.id).all();
    let scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
    if (!scheduleConfig) {
      await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day, working_days, off_days) VALUES (?, ?, ?, ?, ?)").bind(school.id, 5, 8, '["monday","tuesday","wednesday","thursday","friday"]', '["saturday","sunday"]').run();
      scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
    }
    const workingDaysArray = scheduleConfig.working_days ? JSON.parse(scheduleConfig.working_days) : ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const workingDaysCount = workingDaysArray.length;
    const scheduleSlots = await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? AND type = 'class'").bind(school.id).all();
    const actualClassPeriodsPerDay = scheduleSlots.results.length || 8;
    const maxClassesPerSection = workingDaysCount * actualClassPeriodsPerDay;
    scheduleConfig.actualClassPeriodsPerDay = actualClassPeriodsPerDay;
    scheduleConfig.maxClassesPerSection = maxClassesPerSection;
    scheduleConfig.workingDaysCount = workingDaysCount;
    scheduleConfig.workingDaysArray = workingDaysArray;
    return htmlResponse(InstituteLayout(
      SubjectsPageHTML(
        school,
        subjects.results,
        classes.results,
        groups.results,
        sections.results,
        classSubjects.results,
        groupSubjects.results,
        scheduleConfig
      ),
      "Subjects Management",
      school.school_name
    ));
  }
  if (url.pathname === "/school/teachers") {
    if (request.method === "POST") {
      const body = await request.json();
      if (body.full_name && body.email && body.phone) {
        const current = await env.DB.prepare("SELECT count(*) as count FROM profiles_teacher WHERE school_id = ?").bind(school.id).first();
        if (current.count >= (school.max_teachers || 10)) return jsonResponse({ error: "Teacher limit reached" }, 403);
        await env.DB.prepare("INSERT INTO profiles_teacher (school_id, full_name, email, phone) VALUES (?, ?, ?, ?)").bind(school.id, body.full_name, body.email, body.phone).run();
        return jsonResponse({ success: true });
      }
      if (body.action === "assign_subjects") {
        await env.DB.prepare("DELETE FROM teacher_subjects WHERE teacher_id = ?").bind(body.teacher_id).run();
        if (body.primary_subject) {
          await env.DB.prepare("INSERT INTO teacher_subjects (school_id, teacher_id, subject_id, is_primary) VALUES (?, ?, ?, 1)").bind(school.id, body.teacher_id, body.primary_subject).run();
        }
        if (body.additional_subjects && Array.isArray(body.additional_subjects)) {
          for (const subjectId of body.additional_subjects) {
            await env.DB.prepare("INSERT INTO teacher_subjects (school_id, teacher_id, subject_id, is_primary) VALUES (?, ?, ?, 0)").bind(school.id, body.teacher_id, subjectId).run();
          }
        }
        return jsonResponse({ success: true });
      }
      return jsonResponse({ error: "Invalid request" }, 400);
    }
    if (request.method === "DELETE") {
      const body = await request.json();
      if (body.id) {
        await env.DB.prepare("DELETE FROM profiles_teacher WHERE id = ?").bind(body.id).run();
        await env.DB.prepare("DELETE FROM teacher_subjects WHERE teacher_id = ?").bind(body.id).run();
        return jsonResponse({ success: true });
      }
      return jsonResponse({ error: "Invalid request" }, 400);
    }
    console.log("Loading teachers page for school:", school.id);
    const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ? ORDER BY id DESC").bind(school.id).all();
    const allSubjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
    const teacherSubjects = await env.DB.prepare(`
        SELECT ts.*, sub.subject_name 
        FROM teacher_subjects ts 
        JOIN academic_subjects sub ON ts.subject_id = sub.id 
        WHERE ts.school_id = ?
        ORDER BY ts.is_primary DESC, sub.subject_name ASC
      `).bind(school.id).all();
    console.log("Teachers data:", teachers.results);
    console.log("Subjects data:", allSubjects.results);
    console.log("Teacher subjects data:", teacherSubjects.results);
    return htmlResponse(InstituteLayout(
      TeachersPageHTML(
        school,
        teachers.results,
        allSubjects.results,
        teacherSubjects.results
      ),
      "Teachers Management",
      school.school_name
    ));
  }
  if (url.pathname === "/school/classes") {
    const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
    const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
    const sections = await env.DB.prepare("SELECT cs.*, cg.group_name FROM class_sections cs LEFT JOIN class_groups cg ON cs.group_id = cg.id WHERE cs.school_id = ?").bind(school.id).all();
    const subjects = await env.DB.prepare("SELECT * FROM academic_subjects WHERE school_id = ? ORDER BY subject_name ASC").bind(school.id).all();
    const classSubjects = await env.DB.prepare(`
        SELECT cs.*, sub.subject_name 
        FROM class_subjects cs 
        JOIN academic_subjects sub ON cs.subject_id = sub.id 
        WHERE cs.school_id = ?
      `).bind(school.id).all();
    const groupSubjects = await env.DB.prepare(`
        SELECT gs.*, sub.subject_name, g.group_name, g.class_id
        FROM group_subjects gs 
        JOIN academic_subjects sub ON gs.subject_id = sub.id
        JOIN class_groups g ON gs.group_id = g.id
        WHERE gs.school_id = ?
      `).bind(school.id).all();
    let scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
    if (!scheduleConfig) {
      await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day, working_days, off_days) VALUES (?, ?, ?, ?, ?)").bind(school.id, 5, 8, '["monday","tuesday","wednesday","thursday","friday"]', '["saturday","sunday"]').run();
      scheduleConfig = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(school.id).first();
    }
    const workingDaysArray = scheduleConfig.working_days ? JSON.parse(scheduleConfig.working_days) : ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const workingDaysCount = workingDaysArray.length;
    const scheduleSlots = await env.DB.prepare("SELECT * FROM schedule_slots WHERE school_id = ? AND type = 'class'").bind(school.id).all();
    const actualClassPeriodsPerDay = scheduleSlots.results.length || 8;
    const maxClassesPerSection = workingDaysCount * actualClassPeriodsPerDay;
    scheduleConfig.actualClassPeriodsPerDay = actualClassPeriodsPerDay;
    scheduleConfig.maxClassesPerSection = maxClassesPerSection;
    scheduleConfig.workingDaysCount = workingDaysCount;
    scheduleConfig.workingDaysArray = workingDaysArray;
    return htmlResponse(InstituteLayout(
      ClassesPageHTML(
        school,
        classes.results,
        groups.results,
        sections.results,
        subjects.results,
        classSubjects.results,
        groupSubjects.results,
        scheduleConfig
      ),
      "Classes & Groups",
      school.school_name
    ));
  }
  return new Response("Not Found", { status: 404 });
}
__name(handleInstituteRequest, "handleInstituteRequest");

// src/routers/router_teacher.js
init_checked_fetch();
init_modules_watch_stub();
async function handleTeacherRequest(request, env) {
  return htmlResponse("<h1>Teacher Portal Coming Soon</h1>");
}
__name(handleTeacherRequest, "handleTeacherRequest");

// src/index.js
var src_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      await syncDatabase(env);
    } catch (error) {
      console.error("Database sync failed", error);
    }
    if (path.startsWith("/admin")) {
      return await handleAdminRequest(request, env);
    }
    if (path.startsWith("/school")) {
      return await handleInstituteRequest(request, env);
    }
    if (path.startsWith("/teacher")) {
      return await handleTeacherRequest(request, env);
    }
    return await handlePublicRequest(request, env);
  }
};

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-xUnko8/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-xUnko8/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
