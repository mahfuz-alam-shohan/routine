// src/ui/public/home.js

export function HomeHTML(companyName, data = {}) {
    const plans = Array.isArray(data.plans) ? data.plans : [];
    const features = Array.isArray(data.features) ? data.features : [];
    const schools = Array.isArray(data.schools) ? data.schools : [];

    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const planFeatures = {};
    features.forEach(feature => {
        const key = feature.plan_id;
        if (!planFeatures[key]) planFeatures[key] = [];
        planFeatures[key].push(feature);
    });

    return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
      .home-shell {
        font-family: 'Space Grotesk', sans-serif;
        color: #111827;
      }
      .home-grid-bg {
        background-image:
          linear-gradient(to right, rgba(17, 24, 39, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(17, 24, 39, 0.06) 1px, transparent 1px);
        background-size: 28px 28px;
      }
      [data-reveal] {
        opacity: 0;
        transform: translateY(12px);
      }
      [data-reveal].is-visible {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 480ms ease, transform 480ms ease;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-reveal] { opacity: 1; transform: none; }
      }
    </style>

    <div class="home-shell home-grid-bg">
        <div class="max-w-6xl mx-auto px-3 sm:px-6 py-10">
            <div class="border border-gray-200 bg-white p-5 sm:p-8" data-reveal>
                <div class="text-xs uppercase tracking-widest text-gray-500">Pricing</div>
                <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">${companyName} Memberships</h1>
                <p class="text-sm text-gray-600 mt-2">Pick a plan and place an order. Our team will contact you within 24 hours.</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    ${plans.length ? plans.map(plan => {
                        const price = Number(plan.price_taka) || 0;
                        const billing = plan.billing_cycle ? plan.billing_cycle.charAt(0).toUpperCase() + plan.billing_cycle.slice(1) : '';
                        const list = planFeatures[plan.id] || [];
                        const featureHtml = list.length
                            ? list.map(item => {
                                const highlight = Number(item.is_highlight) === 1;
                                const featureClass = highlight ? 'font-semibold text-gray-900' : 'text-gray-600';
                                return '<li class="text-xs ' + featureClass + '">' + escapeHtml(item.feature_text) + '</li>';
                            }).join('')
                            : '<li class="text-xs text-gray-500">No features listed yet.</li>';
                        return `
                            <div class="border border-gray-200 bg-white p-4 flex flex-col">
                                <div class="text-sm font-semibold text-gray-900">${escapeHtml(plan.name)}</div>
                                <div class="text-xs text-gray-500 mt-1">${escapeHtml(billing)} billing</div>
                                <div class="text-2xl font-bold text-gray-900 mt-3">BDT ${price}</div>
                                <ul class="mt-3 space-y-1">${featureHtml}</ul>
                                <a href="/order?plan=${plan.id}" class="mt-4 border border-gray-900 text-gray-900 text-xs font-semibold px-3 py-2 text-center">
                                    Order Now
                                </a>
                            </div>
                        `;
                    }).join('') : `
                        <div class="border border-gray-200 bg-white p-6 text-sm text-gray-500">
                            No pricing plans published yet.
                        </div>
                    `}
                </div>
            </div>
        </div>

        <div class="max-w-6xl mx-auto px-3 sm:px-6 pb-14">
            <div class="border border-gray-200 bg-white p-5 sm:p-8" data-reveal>
                <div class="text-xs uppercase tracking-widest text-gray-500">Institutions</div>
                <h2 class="text-2xl font-semibold text-gray-900 mt-2">Schools We Serve</h2>
                <div class="mt-4 border border-gray-200">
                    <div class="bg-gray-50 border-b border-gray-200 px-4 py-2 text-[11px] uppercase tracking-widest text-gray-500">Institution List</div>
                    <div class="p-4 max-h-64 overflow-y-auto">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            ${schools.length ? schools.map((school) => {
                                const name = escapeHtml(school.school_name || '');
                                if (!name) return '';
                                return '<div class="border border-gray-200 px-3 py-2 text-xs text-gray-700">' + name + '</div>';
                            }).join('') : '<div class="text-xs text-gray-500">No institutions registered yet.</div>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
      (function() {
        var items = document.querySelectorAll('[data-reveal]');
        if (!items.length) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            items.forEach(function(el) { el.classList.add('is-visible'); });
            return;
        }
        var observer = new IntersectionObserver(function(entries, obs) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        items.forEach(function(el) { observer.observe(el); });
      })();
    </script>
    `;
}
