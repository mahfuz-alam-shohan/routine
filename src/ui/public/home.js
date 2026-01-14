// src/ui/public/home.js

export function HomeHTML(companyName) {
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
