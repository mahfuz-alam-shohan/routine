export function OrdersHTML(orders = []) {
    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const rows = (orders || []).map(order => {
        const date = order.created_at ? new Date(order.created_at).toLocaleDateString() : '';
        const billing = order.billing_cycle ? order.billing_cycle.charAt(0).toUpperCase() + order.billing_cycle.slice(1) : '';
        const price = Number(order.price_taka) || 0;
        const status = order.status || 'new';
        return `
            <tr data-order-id="${escapeHtml(order.id)}" data-status="${escapeHtml(status)}">
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-600">${escapeHtml(order.id)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-600">${escapeHtml(date)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-700 font-semibold">${escapeHtml(order.plan_name)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-600">${escapeHtml(billing)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-600">BDT ${escapeHtml(price)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-700">${escapeHtml(order.requester_name)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-700">${escapeHtml(order.requester_email)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-700">${escapeHtml(order.requester_phone)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-700">${escapeHtml(order.institution_name)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-600" data-status-cell>${escapeHtml(status)}</td>
                <td class="border border-gray-300 px-3 py-2 text-xs text-gray-700" data-action-cell>
                    ${status === 'new' ? `
                        <div class="flex gap-2">
                            <button type="button" onclick="grantOrder(${order.id})" class="border border-gray-900 text-gray-900 px-2 py-1 text-xs">Grant</button>
                            <button type="button" onclick="declineOrder(${order.id})" class="border border-gray-300 text-gray-700 px-2 py-1 text-xs">Decline</button>
                        </div>
                    ` : '<span class="text-gray-400">-</span>'}
                </td>
            </tr>
        `;
    }).join('');

    return `
      <div class="space-y-6 px-3 sm:px-4">
          <div>
              <h1 class="text-xl font-bold text-gray-900">Orders</h1>
              <p class="text-sm text-gray-500">All pricing requests from the public site.</p>
          </div>

          <div class="bg-white border border-gray-300 overflow-x-auto">
              <table class="min-w-full border-collapse text-sm">
                  <thead class="bg-gray-50">
                      <tr>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">ID</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Date</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Plan</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Billing</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Price</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Name</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Email</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Phone</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Institution</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Status</th>
                          <th class="border border-gray-300 px-3 py-2 text-left text-[11px] font-bold text-gray-500 uppercase">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${rows || '<tr><td colspan="11" class="border border-gray-300 px-4 py-8 text-center text-sm text-gray-500">No orders yet.</td></tr>'}
                  </tbody>
              </table>
          </div>
      </div>

      <script>
        async function updateOrder(orderId, action) {
            const row = document.querySelector('[data-order-id="' + orderId + '"]');
            const statusCell = row ? row.querySelector('[data-status-cell]') : null;
            const actionCell = row ? row.querySelector('[data-action-cell]') : null;

            try {
                const res = await fetch('/admin/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: action, order_id: orderId })
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to update order');
                    return;
                }
                if (statusCell) statusCell.textContent = action === 'grant_order' ? 'granted' : 'declined';
                if (actionCell) actionCell.innerHTML = '<span class="text-gray-400">-</span>';
            } catch (e) {
                alert('Network error');
            }
        }

        function grantOrder(orderId) {
            if (!confirm('Grant this order and create the institution account?')) return;
            updateOrder(orderId, 'grant_order');
        }

        function declineOrder(orderId) {
            if (!confirm('Decline this order?')) return;
            updateOrder(orderId, 'decline_order');
        }
      </script>
    `;
}
