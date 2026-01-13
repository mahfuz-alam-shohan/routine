// src/ui/public/home.js

export const LANDING_PAGE_CONTENT = `
<section class="bg-white dark:bg-gray-900">
    <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">
            <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-gray-900">
                School Routines, <br>
                <span class="text-blue-600">Solved in Seconds.</span>
            </h1>
            <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">
                The smart scheduling platform for Bangladesh. Automatically generate conflict-free class routines for Teachers, Sections, and Labs without the headache.
            </p>
            <a href="/login" class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                Get Started
                <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
            <a href="#features" class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100">
                How it works
            </a>
        </div>
        <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="https://placehold.co/600x400/png?text=Routine+Dashboard" alt="mockup" class="rounded-lg shadow-lg">
        </div>
    </div>
</section>

<section id="features" class="bg-gray-50 py-16">
    <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div class="max-w-screen-md mb-8 lg:mb-16">
            <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">Designed for Education</h2>
            <p class="text-gray-500 sm:text-xl">We understand the complexity of Sections, Fixed Teachers, and Lab conflicts.</p>
        </div>
        <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            <div>
                <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue-100 lg:h-12 lg:w-12">
                   <span class="text-blue-600 text-xl font-bold">1</span>
                </div>
                <h3 class="mb-2 text-xl font-bold text-gray-900">Auto-Balancing</h3>
                <p class="text-gray-500">Ensures no teacher is overworked. The system distributes load evenly across the week.</p>
            </div>
            <div>
                <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue-100 lg:h-12 lg:w-12">
                    <span class="text-blue-600 text-xl font-bold">2</span>
                </div>
                <h3 class="mb-2 text-xl font-bold text-gray-900">Fixed Teacher Support</h3>
                <p class="text-gray-500">Assign specific teachers to specific sections. We calculate the perfect time slot for them.</p>
            </div>
            <div>
                <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue-100 lg:h-12 lg:w-12">
                    <span class="text-blue-600 text-xl font-bold">3</span>
                </div>
                <h3 class="mb-2 text-xl font-bold text-gray-900">PDF Export</h3>
                <p class="text-gray-500">Download printable routines for the Notice Board instantly.</p>
            </div>
        </div>
    </div>
</section>
`;