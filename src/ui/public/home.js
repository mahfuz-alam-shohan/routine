// src/ui/public/home.js

export function HomeHTML(companyName) {
    return `
    <div class="animate-fade-in">
        
        <div class="py-20 md:py-32 text-center max-w-4xl mx-auto px-6">
            <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight mb-8">
                The smart way to <br>
                <span class="text-blue-600">manage your school.</span>
            </h1>
            <p class="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                ${companyName} eliminates the chaos of manual scheduling. We help top institutions in Bangladesh save time and reduce errors.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/login" class="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Get Started Now
                </a>
            </div>
        </div>

        <div class="bg-blue-600 text-white py-24">
            <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 class="text-3xl md:text-4xl font-bold mb-6">Auto-Balancing Engine</h2>
                    <p class="text-blue-100 text-lg leading-relaxed mb-6">
                        Stop worrying about teacher burnout. Our algorithm automatically distributes workload evenly across the week, ensuring no teacher is overloaded while maximizing classroom efficiency.
                    </p>
                    <ul class="space-y-3">
                        <li class="flex items-center gap-3">
                            <svg class="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Conflict detection
                        </li>
                        <li class="flex items-center gap-3">
                            <svg class="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Fair load distribution
                        </li>
                    </ul>
                </div>
                <div class="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
                     <div class="space-y-4 opacity-80">
                        <div class="h-4 bg-white/20 rounded w-3/4"></div>
                        <div class="h-4 bg-white/20 rounded w-1/2"></div>
                        <div class="h-4 bg-white/20 rounded w-5/6"></div>
                        <div class="h-32 bg-white/10 rounded w-full mt-6 flex items-center justify-center text-white/30 font-bold">
                            SMART ALGORITHM
                        </div>
                     </div>
                </div>
            </div>
        </div>

        <div class="bg-gray-50 py-24 border-y border-gray-100">
            <div class="max-w-7xl mx-auto px-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div class="text-4xl font-bold text-gray-900 mb-2">100%</div>
                        <div class="text-gray-500 font-medium">Conflict Free</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-gray-900 mb-2">2x</div>
                        <div class="text-gray-500 font-medium">Faster Planning</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-gray-900 mb-2">24/7</div>
                        <div class="text-gray-500 font-medium">Support Access</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `;
}
