export function InstituteDashboardHTML(stats) {
    return `
      <div class="space-y-6 max-w-6xl mx-auto pt-4 md:pt-6">
          <div class="ui-panel p-4">
              <h1 class="ui-title">Institution Dashboard</h1>
              <p class="ui-subtitle mt-1">Operational summary and quick access.</p>
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
                          <td>${stats.teachers || 0}</td>
                          <td class="ui-muted">Tracked</td>
                      </tr>
                      <tr>
                          <td>Active Classes</td>
                          <td>${stats.classes || 0}</td>
                          <td class="ui-muted">Tracked</td>
                      </tr>
                      <tr>
                          <td>Routines</td>
                          <td>${stats.routines || 0}</td>
                          <td class="ui-muted">Tracked</td>
                      </tr>
                      <tr>
                          <td>System Status</td>
                          <td>Operational</td>
                          <td class="ui-muted">Online</td>
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
