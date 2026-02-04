// src/ui/public/order.js

export function OrderPageHTML(companyName, plan = null) {
    if (!plan) {
        return `
        <div class="max-w-2xl mx-auto px-3 sm:px-6 py-12">
            <div class="border border-gray-200 bg-white p-6 text-sm text-gray-600">
                Pricing plan not found. Please return to the homepage and choose a valid plan.
            </div>
        </div>
        `;
    }

    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const billing = plan.billing_cycle ? plan.billing_cycle.charAt(0).toUpperCase() + plan.billing_cycle.slice(1) : '';
    const priceValue = Number(plan.price_taka) || 0;

    return `
      <div class="max-w-2xl mx-auto px-3 sm:px-6 py-12">
          <div class="border border-gray-200 bg-white p-6 sm:p-8">
              <div class="text-xs uppercase tracking-widest text-gray-500">Order Plan</div>
              <h1 class="text-2xl font-semibold text-gray-900 mt-2">${escapeHtml(plan.name)}</h1>
              <p class="text-sm text-gray-600 mt-1">${escapeHtml(billing)} billing  BDT ${escapeHtml(priceValue)}</p>

              <form id="order-form" onsubmit="submitOrder(event)" class="mt-6 space-y-4">
                  <input type="hidden" id="plan-id" value="${escapeHtml(plan.id)}">
                  <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                      <input type="text" id="order-name" required class="w-full border border-gray-300 px-3 py-2 text-sm">
                  </div>
                  <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                      <input type="email" id="order-email" required class="w-full border border-gray-300 px-3 py-2 text-sm">
                  </div>
                  <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number (Digits Only)</label>
                      <input type="text" id="order-phone" required inputmode="numeric" pattern="\\d+" class="w-full border border-gray-300 px-3 py-2 text-sm">
                      <p class="text-[11px] text-gray-500 mt-1">Use numbers only. This number becomes the initial password.</p>
                  </div>
                  <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">School or Institution</label>
                      <input type="text" id="order-school" required class="w-full border border-gray-300 px-3 py-2 text-sm">
                  </div>
                  <button type="submit" id="order-submit" class="border border-gray-900 text-gray-900 px-4 py-2 text-sm font-semibold">
                      Submit Order
                  </button>
              </form>

              <div id="order-success" class="hidden mt-6 border border-green-300 bg-green-50 p-4">
                  <div class="flex items-center gap-3">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      <div>
                          <p class="text-sm font-semibold text-green-700">Order received</p>
                          <p class="text-xs text-green-700">Our team will contact you within 24 hours.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <script>
        async function submitOrder(e) {
            e.preventDefault();
            const btn = document.getElementById('order-submit');
            const originalText = btn.textContent;
            btn.textContent = 'Submitting...';
            btn.disabled = true;

            const phoneValue = document.getElementById('order-phone').value.trim();
            if (!/^[0-9]+$/.test(phoneValue)) {
                alert('Phone number must contain digits only.');
                btn.textContent = originalText;
                btn.disabled = false;
                return;
            }

            const payload = {
                plan_id: document.getElementById('plan-id').value,
                name: document.getElementById('order-name').value.trim(),
                email: document.getElementById('order-email').value.trim(),
                phone: phoneValue,
                institution_name: document.getElementById('order-school').value.trim()
            };

            try {
                const res = await fetch('/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to submit order');
                    btn.textContent = originalText;
                    btn.disabled = false;
                    return;
                }
                document.getElementById('order-form').classList.add('hidden');
                document.getElementById('order-success').classList.remove('hidden');
            } catch (err) {
                alert('Network error');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
      </script>
    `;
}
