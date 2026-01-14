// src/ui/public/home.js

export function HomeHTML(companyName) {
    return `
    <div class="flex flex-col items-center justify-center text-center py-12 md:py-24 space-y-8">
        
        <div class="space-y-4 max-w-3xl">
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                Simplify Your <br>
                <span class="text-blue-600">School Routine</span>
            </h1>
            <p class="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                ${companyName} automates your class scheduling, teacher management, and conflict resolution. 
                Built specifically for educational institutions in Bangladesh.
            </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="/login" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Create Routine Now
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </a>
            <a href="#features" class="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                Learn More
            </a>
        </div>

        <div id="features" class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-20 text-left">
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-colors">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Auto-Balancing</h3>
                <p class="text-gray-500">Automatically distributes teacher workload evenly across the week.</p>
            </div>
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-100 transition-colors">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Conflict Free</h3>
                <p class="text-gray-500">Detects and resolves teacher overlap and lab conflicts instantly.</p>
            </div>
            <div class="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-purple-100 transition-colors">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">PDF Export</h3>
                <p class="text-gray-500">Generate print-ready routines for notice boards in one click.</p>
            </div>
        </div>

    </div>
    `;
}
