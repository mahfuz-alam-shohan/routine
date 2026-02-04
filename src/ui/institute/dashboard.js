export function InstituteDashboardHTML(stats) {
    const safeNumber = (value) => {
        const num = Number(value);
        return Number.isFinite(num) ? num : 0;
    };
    const limits = stats.limits || {};
    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const planName = limits.plan_name ? escapeHtml(limits.plan_name) : 'Custom Plan';
    const planCycleRaw = limits.plan_billing_cycle ? String(limits.plan_billing_cycle) : '';
    const planCycle = planCycleRaw ? planCycleRaw.charAt(0).toUpperCase() + planCycleRaw.slice(1) : '';
    const planPrice = limits.plan_price_taka !== null && limits.plan_price_taka !== undefined && limits.plan_price_taka !== ''
        ? `BDT ${escapeHtml(limits.plan_price_taka)}`
        : '';
    const planLineParts = [];
    if (planCycle) planLineParts.push(planCycle);
    if (planPrice) planLineParts.push(planPrice);
    const planLine = planLineParts.length ? planLineParts.join(' / ') : 'Plan details will appear here.';

    const limitLabel = (value) => (value === null || value === undefined ? 'Unlimited' : value);
    const statusLabel = (used, limit) => {
        if (limit === null || limit === undefined) return 'Flexible';
        const remaining = Number(limit) - Number(used);
        if (remaining <= 0) return 'Limit reached';
        return `${remaining} remaining`;
    };
    const statusClass = (used, limit) => {
        if (limit === null || limit === undefined) return 'ui-muted';
        return used >= Number(limit) ? 'text-red-600' : 'text-green-700';
    };

    const usageRows = [
        { label: 'Teachers', used: safeNumber(stats.teachers), limit: limits.max_teachers, upgradeLabel: 'teachers' },
        { label: 'Subjects', used: safeNumber(stats.subjects), limit: limits.max_subjects, upgradeLabel: 'subjects' },
        { label: 'Routines (this year)', used: safeNumber(stats.routineYearCount), limit: limits.max_routines_yearly, upgradeLabel: 'routines' },
        { label: 'Shifts', used: safeNumber(stats.shiftCount || 1), limit: limits.max_shifts, upgradeLabel: 'shifts' }
    ];

    const upgradeItems = usageRows
        .filter(row => row.limit !== null && row.limit !== undefined && row.used >= Number(row.limit))
        .map(row => row.upgradeLabel || row.label.toLowerCase());
    const upgradeMessage = upgradeItems.length
        ? `Upgrade membership to add more ${upgradeItems.join(', ')}.`
        : 'Upgrade membership to unlock more subjects, shifts, and routine generations.';

    return `
      <div class="space-y-6 max-w-6xl mx-auto px-3 sm:px-4 pt-4 md:pt-6">
          <div class="ui-panel p-4">
              <h1 class="ui-title">Institution Dashboard</h1>
              <p class="ui-subtitle mt-1">Operational summary, membership limits, and quick access.</p>
          </div>

          <div class="ui-panel p-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                      <div class="text-xs uppercase tracking-widest text-gray-500">Membership</div>
                      <div class="text-base font-semibold text-gray-900 mt-1">${planName}</div>
                      <div class="ui-muted mt-1">${planLine}</div>
                  </div>
                  <div class="ui-chip">Upgrade Available</div>
              </div>
              <div class="mt-3 text-xs text-gray-600">${upgradeMessage}</div>
          </div>

          <div class="ui-panel p-4">
              <table>
                  <thead>
                      <tr>
                          <th>Resource</th>
                          <th>Used</th>
                          <th>Limit</th>
                          <th>Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${usageRows.map(row => `
                          <tr>
                              <td>${row.label}</td>
                              <td>${row.used}</td>
                              <td>${limitLabel(row.limit)}</td>
                              <td class="${statusClass(row.used, row.limit)}">${statusLabel(row.used, row.limit)}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
          </div>

          <div class="ui-panel p-4">
              <table>
                  <thead>
                      <tr>
                          <th>Metric</th>
                          <th>Value</th>
                          <th>Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>Total Teachers</td>
                          <td>${safeNumber(stats.teachers)}</td>
                          <td class="ui-muted">Tracked</td>
                      </tr>
                      <tr>
                          <td>Total Subjects</td>
                          <td>${safeNumber(stats.subjects)}</td>
                          <td class="ui-muted">Tracked</td>
                      </tr>
                      <tr>
                          <td>Active Classes</td>
                          <td>${safeNumber(stats.classes)}</td>
                          <td class="ui-muted">Tracked</td>
                      </tr>
                      <tr>
                          <td>Total Routines</td>
                          <td>${safeNumber(stats.routines)}</td>
                          <td class="ui-muted">Tracked</td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <div class="ui-panel p-4">
              <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Quick Actions</h3>
              <div class="flex flex-col sm:flex-row gap-2 text-sm">
                  <a href="/school/teachers" class="ui-button ui-button--ghost text-center">Manage Teachers</a>
                  <a href="/school/classes" class="ui-button ui-button--ghost text-center">Manage Classes</a>
                  <a href="/school/subjects" class="ui-button ui-button--ghost text-center">Manage Subjects</a>
                  <a href="/school/schedules" class="ui-button ui-button--ghost text-center">Master Schedule</a>
              </div>
          </div>
      </div>
    `;
}
