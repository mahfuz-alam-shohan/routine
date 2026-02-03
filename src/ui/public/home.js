// src/ui/public/home.js

export function HomeHTML(companyName) {
    return `
    <div class="bg-gray-50">
        <div class="max-w-6xl mx-auto px-6 py-20">
            <div class="bg-white border border-gray-200 p-10">
                <div class="max-w-3xl">
                    <h1 class="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-6">
                        Smart Scheduling for Modern Education
                    </h1>
                    <p class="text-lg text-gray-600 leading-relaxed mb-8">
                        ${companyName} helps institutions design conflict-free class routines, manage faculty workloads, and organize academic structures efficiently.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <a href="/login" class="px-6 py-3 text-sm font-semibold text-white bg-gray-900 border border-gray-900">
                            Get Started
                        </a>
                        <a href="#features" class="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300">
                            Explore Features
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div id="features" class="max-w-6xl mx-auto px-6 pb-20">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white border border-gray-200 p-8">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Automated Routine Engine</h2>
                    <p class="text-gray-600 leading-relaxed mb-6">
                        The core algorithm analyzes teachers, subjects, and rooms to build a weekly schedule while respecting hard constraints.
                    </p>
                    <div class="text-xs text-gray-500 uppercase tracking-wide">
                        Conflict Detection • Workload Balancing
                    </div>
                </div>
                <div class="bg-white border border-gray-200 p-8">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Operational Control</h2>
                    <p class="text-gray-600 leading-relaxed mb-6">
                        Manage classes, sections, teachers, and subjects with a clean workflow designed for academic teams.
                    </p>
                    <div class="text-xs text-gray-500 uppercase tracking-wide">
                        Classes • Sections • Teacher Assignment
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-6xl mx-auto px-6 pb-24">
            <div class="bg-white border border-gray-200 p-10">
                <div class="text-sm text-gray-500 uppercase tracking-wide">Platform Highlights</div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div class="border border-gray-200 p-5">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Teacher Management</h3>
                        <p class="text-gray-600 leading-relaxed">Maintain detailed profiles, subjects, and contact info for all faculty members.</p>
                    </div>
                    <div class="border border-gray-200 p-5">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Class & Sectioning</h3>
                        <p class="text-gray-600 leading-relaxed">Organize academic structures with flexible class and section configurations.</p>
                    </div>
                    <div class="border border-gray-200 p-5">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Export Ready</h3>
                        <p class="text-gray-600 leading-relaxed">Download routines and reports in standard formats suitable for printing.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}
