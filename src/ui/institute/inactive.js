export function InstituteInactiveHTML(school = {}) {
    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    const name = escapeHtml(school.school_name || 'Institution');

    return `
      <div class="space-y-4 max-w-4xl mx-auto px-3 sm:px-4 pt-4 md:pt-6">
          <div class="ui-panel p-4">
              <h1 class="ui-title">Membership Required</h1>
              <p class="ui-subtitle mt-1">${name} is inactive.</p>
          </div>

          <div class="ui-panel p-4">
              <p class="text-sm text-gray-700">This account does not have an active membership. Please contact the company to activate your institution.</p>
              <p class="text-xs text-gray-500 mt-2">After activation you will have full access to schedules, teachers, subjects, and routine generation.</p>
              <a href="/logout" data-no-prefetch class="ui-button ui-button--ghost inline-block mt-4">Sign Out</a>
          </div>
      </div>
    `;
}
