export function SchoolDetailHTML(school, shiftConfig = null, stats = {}, plans = []) {
    const shiftsEnabled = !!(shiftConfig && shiftConfig.enabled);
    const shifts = (shiftConfig && Array.isArray(shiftConfig.shifts) && shiftConfig.shifts.length)
        ? shiftConfig.shifts
        : ['Full Day'];
    const escapeHtml = (value) => String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    const planList = Array.isArray(plans) ? plans : [];
    const currentPlanId = Number(school.plan_id);
    const activePlan = planList.find(plan => Number(plan.id) === currentPlanId);
    const membershipActive = Number.isFinite(currentPlanId) && currentPlanId > 0;
    const effectiveActive = membershipActive && Number(school.is_active) === 1;
    const teacherLimitLabel = membershipActive
        ? (school.max_teachers === null || school.max_teachers === undefined ? 'Unlimited' : school.max_teachers)
        : 'Inactive';
    const planName = school.plan_name || activePlan?.name || 'No membership';
    const planBilling = school.plan_billing_cycle || activePlan?.billing_cycle || '';
    const planPrice = school.plan_price_taka !== null && school.plan_price_taka !== undefined
        ? school.plan_price_taka
        : (activePlan?.price_taka ?? '');
    const planCycleLabel = planBilling ? planBilling.charAt(0).toUpperCase() + planBilling.slice(1) : '';
    const planPriceLabel = planPrice !== '' && planPrice !== null && planPrice !== undefined ? `BDT ${planPrice}` : '';
    const planDetail = membershipActive
        ? [planCycleLabel, planPriceLabel].filter(Boolean).join(' / ')
        : 'No membership assigned.';
    const planOptions = [
        '<option value="">No membership (inactive)</option>',
        ...planList.map(plan => {
            const selected = Number(plan.id) === currentPlanId ? 'selected' : '';
            const cycle = plan.billing_cycle ? plan.billing_cycle.charAt(0).toUpperCase() + plan.billing_cycle.slice(1) : '';
            const price = plan.price_taka !== null && plan.price_taka !== undefined ? `BDT ${plan.price_taka}` : '';
            const labelParts = [plan.name, cycle, price].filter(Boolean).join(' / ');
            return `<option value="${plan.id}" ${selected}>${escapeHtml(labelParts)}</option>`;
        })
    ].join('');
    const statusLabel = membershipActive
        ? (Number(school.is_active) === 1 ? 'Active' : 'Disabled')
        : 'Inactive';
    const statusClass = membershipActive
        ? (Number(school.is_active) === 1 ? 'text-green-700 border-green-300' : 'text-red-700 border-red-300')
        : 'text-red-700 border-red-300';
    const statusButtonLabel = membershipActive
        ? (Number(school.is_active) === 1 ? 'Disable Login' : 'Enable Login')
        : 'Assign Membership to Activate';
    const statusButtonClass = membershipActive
        ? 'border border-gray-900 text-gray-900 px-3 py-2 text-xs font-semibold'
        : 'border border-gray-300 text-gray-400 px-3 py-2 text-xs font-semibold cursor-not-allowed';
    const createdAt = school.created_at ? new Date(school.created_at).toLocaleDateString() : '--';
    const schedule = stats.schedule || {};
    const workingDaysCount = Array.isArray(schedule.working_days) && schedule.working_days.length
        ? schedule.working_days.length
        : (schedule.active_days || 0);
    const offDaysCount = Array.isArray(schedule.off_days) ? schedule.off_days.length : 0;

    return `
      <div class="space-y-8 px-3 sm:px-4">
          
          <div class="border-b pb-6">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                      <h1 class="text-2xl font-bold text-gray-900">${school.school_name}</h1>
                      <div class="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                          <span class="px-2 py-0.5 text-xs font-semibold border border-gray-300 text-gray-700">EIIN: ${school.eiin_code || 'N/A'}</span>
                          <span>Auth ID: ${school.auth_id}</span>
                          <span id="school-status-badge" class="px-2 py-0.5 border ${statusClass}">${statusLabel}</span>
                      </div>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                      <button type="button" id="status-toggle-btn" onclick="toggleAccountStatus()" class="${statusButtonClass}" ${membershipActive ? '' : 'disabled'}>
                          ${statusButtonLabel}
                      </button>
                  </div>
              </div>
          </div>
          
          <div class="bg-white border border-gray-300 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Contact Email</p>
                 <p class="text-gray-900 text-sm">${school.email || '--'}</p>
               </div>
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Address</p>
                 <p class="text-gray-900 text-sm">${school.address || 'N/A'}</p>
               </div>
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Created</p>
                 <p class="text-gray-900 text-sm">${createdAt}</p>
               </div>
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Teacher Limit</p>
                 <p class="text-gray-900 text-sm" id="teacher-limit-value">${teacherLimitLabel}</p>
               </div>
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Shifts</p>
                 <p class="text-gray-900 text-sm">${shiftsEnabled ? shifts.length : 1} (${shiftsEnabled ? 'Enabled' : 'Disabled'})</p>
               </div>
               <div>
                 <p class="text-xs font-bold text-gray-400 uppercase">Schedule Start</p>
                 <p class="text-gray-900 text-sm">${schedule.start_time || '--'}</p>
               </div>
          </div>

          <div>
              <h3 class="font-bold text-gray-900 mb-4 text-lg">Membership</h3>
              <div class="bg-white border border-gray-300 p-4 space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                          <div class="text-xs font-bold text-gray-400 uppercase">Current Plan</div>
                          <div id="membership-current" class="text-sm font-semibold text-gray-900">${escapeHtml(planName)}</div>
                          <div id="membership-details" class="text-xs text-gray-500 mt-1">${escapeHtml(planDetail)}</div>
                      </div>
                      <span id="membership-status" class="px-2 py-0.5 border ${membershipActive ? 'text-green-700 border-green-300' : 'text-red-700 border-red-300'}">
                        ${membershipActive ? 'Active' : 'Inactive'}
                      </span>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2">
                      <select id="membership-plan" class="flex-1 border border-gray-300 px-2 py-2 text-sm">
                          ${planOptions}
                      </select>
                      <button type="button" onclick="saveMembership()" class="border border-gray-900 text-gray-900 px-3 py-2 text-xs font-semibold">Assign Membership</button>
                  </div>
                  <p class="text-xs text-gray-500">Assigning a membership activates the institution. Selecting no membership will disable access.</p>
                  <div class="border-t border-gray-200 pt-3">
                      <div class="text-[11px] uppercase tracking-widest text-gray-500 mb-2">Membership Limits</div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                          <div>
                              <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Max Teachers</label>
                              <input id="limit-teachers" type="number" min="0" class="w-full border border-gray-300 px-2 py-1 text-xs" placeholder="Unlimited">
                          </div>
                          <div>
                              <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Max Subjects</label>
                              <input id="limit-subjects" type="number" min="0" class="w-full border border-gray-300 px-2 py-1 text-xs" placeholder="Unlimited">
                          </div>
                          <div>
                              <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Routines / Year</label>
                              <input id="limit-routines" type="number" min="0" class="w-full border border-gray-300 px-2 py-1 text-xs" placeholder="Unlimited">
                          </div>
                          <div>
                              <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Max Shifts</label>
                              <input id="limit-shifts" type="number" min="1" class="w-full border border-gray-300 px-2 py-1 text-xs" placeholder="Unlimited">
                          </div>
                      </div>
                      <div class="flex flex-col sm:flex-row gap-2 mt-3">
                          <button type="button" onclick="saveMembershipLimits()" class="border border-gray-900 text-gray-900 px-3 py-2 text-xs font-semibold">Save Limits</button>
                          <span class="text-[11px] text-gray-500">Leave blank for unlimited. Limits apply to this institution only.</span>
                      </div>
                  </div>
              </div>
          </div>

          <div>
              <h3 class="font-bold text-gray-900 mb-4 text-lg">Institution Metrics</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Classes</div>
                      <div class="text-lg font-bold text-gray-900">${stats.class_count || 0}</div>
                  </div>
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Groups</div>
                      <div class="text-lg font-bold text-gray-900">${stats.group_count || 0}</div>
                  </div>
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Sections</div>
                      <div class="text-lg font-bold text-gray-900">${stats.section_count || 0}</div>
                  </div>
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Subjects</div>
                      <div class="text-lg font-bold text-gray-900">${stats.subject_count || 0}</div>
                  </div>
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Teachers</div>
                      <div class="text-lg font-bold text-gray-900">${stats.teacher_count || 0}</div>
                  </div>
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Assignments</div>
                      <div class="text-lg font-bold text-gray-900">${stats.assignment_count || 0}</div>
                      <div class="text-[10px] text-gray-500">Auto: ${stats.assignment_auto_count || 0}</div>
                  </div>
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Routines</div>
                      <div class="text-lg font-bold text-gray-900">${stats.routine_count || 0}</div>
                      <div class="text-[10px] text-gray-500">Active: ${stats.active_routine_count || 0}</div>
                  </div>
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Last Generated</div>
                      <div class="text-sm font-semibold text-gray-900">${stats.last_generated ? new Date(stats.last_generated).toLocaleDateString() : '--'}</div>
                  </div>
              </div>
          </div>

          <div>
              <h3 class="font-bold text-gray-900 mb-4 text-lg">Schedule Snapshot</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Working Days</div>
                      <div class="text-lg font-bold text-gray-900">${workingDaysCount}</div>
                      <div class="text-[10px] text-gray-500">Off: ${offDaysCount}</div>
                  </div>
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Class Periods/Day</div>
                      <div class="text-lg font-bold text-gray-900">${stats.class_slot_count || schedule.periods_per_day || 0}</div>
                      <div class="text-[10px] text-gray-500">Breaks: ${stats.break_slot_count || 0}</div>
                  </div>
                  <div class="border border-gray-300 p-3 bg-white">
                      <div class="text-[10px] text-gray-400 uppercase font-semibold">Total Slots</div>
                      <div class="text-lg font-bold text-gray-900">${stats.slot_count || 0}</div>
                  </div>
              </div>
          </div>

          <div>
              <h3 class="font-bold text-gray-900 mb-4 text-lg">Configuration</h3>
              <div class="bg-white border border-gray-300 overflow-hidden divide-y divide-gray-200">
                  
                  <a href="/admin/school/teachers?id=${school.auth_id}" class="block p-4 group">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center gap-4">
                              <div class="border border-gray-300 p-2 text-gray-700">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-900">Teachers</h4>
                                  <p class="text-sm text-gray-500">Set limits and view staff list</p>
                              </div>
                          </div>
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                  </a>

                  <a href="/admin/school/classes?id=${school.auth_id}" class="block p-4 group">
                      <div class="flex items-center justify-between">
                          <div class="flex items-center gap-4">
                              <div class="border border-gray-300 p-2 text-gray-700">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                              </div>
                              <div>
                                  <h4 class="font-bold text-gray-900">Classes & Sections</h4>
                                  <p class="text-sm text-gray-500">Hierarchy view and structure management</p>
                              </div>
                          </div>
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                  </a>

                  </div>
          </div>

          <div>
              <h3 class="font-bold text-gray-900 mb-4 text-lg">Shift Scheduling</h3>
              <div class="bg-white border border-gray-300 p-4 space-y-4">
                  <label class="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" id="shift-enabled" ${shiftsEnabled ? 'checked' : ''} onchange="toggleShiftEnabled(this)" class="w-4 h-4">
                      <span>Enable shift scheduling for this institution</span>
                  </label>
                  <div id="shift-config-panel" class="${shiftsEnabled ? '' : 'hidden'}">
                      <div class="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase mb-2">
                          <span>Shifts</span>
                          <span>Full Day is default</span>
                      </div>
                      <div id="shift-list" class="space-y-2">
                          <div class="text-xs text-gray-500">Loading shifts...</div>
                      </div>
                      <form onsubmit="addShift(event)" class="flex flex-col sm:flex-row gap-2 mt-3">
                          <input type="text" id="shift-name" placeholder="Shift name (e.g. Morning)" class="flex-1 border border-gray-300 px-2 py-1 text-sm" required>
                          <button type="submit" class="bg-gray-900 text-white px-3 py-1 text-sm">Add Shift</button>
                      </form>
                      <p class="text-xs text-gray-500 mt-2">Shift tabs will appear in the Master Schedule for selecting applicable periods.</p>
                  </div>
              </div>
          </div>
      </div>

      <script>
        const SCHOOL_ID = ${school.id};
        const SCHOOL_AUTH_ID = ${school.auth_id};
        window.adminShiftList = ${JSON.stringify(shifts || []).replace(/</g, '\\u003c')};
        window.adminPlanList = ${JSON.stringify(planList).replace(/</g, '\\u003c')};
        window.schoolLimitData = {
            max_teachers: ${school.max_teachers === null || school.max_teachers === undefined ? 'null' : Number(school.max_teachers)},
            max_subjects: ${school.max_subjects === null || school.max_subjects === undefined ? 'null' : Number(school.max_subjects)},
            max_routines_yearly: ${school.max_routines_yearly === null || school.max_routines_yearly === undefined ? 'null' : Number(school.max_routines_yearly)},
            max_shifts: ${school.max_shifts === null || school.max_shifts === undefined ? 'null' : Number(school.max_shifts)}
        };
        let currentMembershipId = ${Number.isFinite(currentPlanId) && currentPlanId > 0 ? currentPlanId : 0};
        let schoolIsActive = ${effectiveActive ? 'true' : 'false'};

        function escapeHtmlClient(value) {
            if (value === null || value === undefined) return '';
            let result = String(value);
            result = result.split('&').join('&amp;');
            result = result.split('<').join('&lt;');
            result = result.split('>').join('&gt;');
            result = result.split('"').join('&quot;');
            result = result.split("'").join('&#39;');
            return result;
        }

        function formatCycleClient(cycle) {
            if (!cycle) return '';
            const text = String(cycle);
            return text.charAt(0).toUpperCase() + text.slice(1);
        }

        function getPlanById(planId) {
            const list = Array.isArray(window.adminPlanList) ? window.adminPlanList : [];
            return list.find(plan => Number(plan.id) === Number(planId));
        }

        function renderMembership(planId) {
            const plan = planId ? getPlanById(planId) : null;
            const nameEl = document.getElementById('membership-current');
            const detailEl = document.getElementById('membership-details');
            const statusEl = document.getElementById('membership-status');
            const limitEl = document.getElementById('teacher-limit-value');
            const select = document.getElementById('membership-plan');

            if (select && planId !== undefined && planId !== null) {
                select.value = planId ? String(planId) : '';
            }

            if (nameEl) nameEl.textContent = plan ? (plan.name || 'Membership') : 'No membership';

            const cycle = plan ? formatCycleClient(plan.billing_cycle) : '';
            const price = plan && plan.price_taka !== null && plan.price_taka !== undefined ? ('BDT ' + plan.price_taka) : '';
            const detailText = plan ? [cycle, price].filter(Boolean).join(' / ') : 'No membership assigned.';
            if (detailEl) detailEl.textContent = detailText || 'No membership assigned.';

            if (statusEl) {
                if (plan) {
                    statusEl.textContent = 'Active';
                    statusEl.className = 'px-2 py-0.5 border text-green-700 border-green-300';
                } else {
                    statusEl.textContent = 'Inactive';
                    statusEl.className = 'px-2 py-0.5 border text-red-700 border-red-300';
                }
            }

            if (limitEl) {
                const limits = window.schoolLimitData || {};
                if (!plan) {
                    limitEl.textContent = 'Inactive';
                } else if (limits.max_teachers === null || limits.max_teachers === undefined) {
                    limitEl.textContent = 'Unlimited';
                } else {
                    limitEl.textContent = limits.max_teachers;
                }
            }

            setLimitInputs(plan ? window.schoolLimitData : null);
        }

        function updateStatusBadge(isActive) {
            const badge = document.getElementById('school-status-badge');
            const btn = document.getElementById('status-toggle-btn');
            const hasMembership = Number(currentMembershipId) > 0;
            schoolIsActive = hasMembership && !!isActive;
            if (badge) {
                badge.textContent = hasMembership ? (schoolIsActive ? 'Active' : 'Disabled') : 'Inactive';
                badge.className = 'px-2 py-0.5 border ' + (hasMembership && schoolIsActive ? 'text-green-700 border-green-300' : 'text-red-700 border-red-300');
            }
            if (btn) {
                if (hasMembership) {
                    btn.disabled = false;
                    btn.textContent = schoolIsActive ? 'Disable Login' : 'Enable Login';
                    btn.className = 'border border-gray-900 text-gray-900 px-3 py-2 text-xs font-semibold';
                } else {
                    btn.disabled = true;
                    btn.textContent = 'Assign Membership to Activate';
                    btn.className = 'border border-gray-300 text-gray-400 px-3 py-2 text-xs font-semibold cursor-not-allowed';
                }
            }
        }

        function setLimitInputs(limits) {
            const fields = {
                teachers: document.getElementById('limit-teachers'),
                subjects: document.getElementById('limit-subjects'),
                routines: document.getElementById('limit-routines'),
                shifts: document.getElementById('limit-shifts')
            };
            const hasMembership = Number(currentMembershipId) > 0;
            Object.values(fields).forEach(input => {
                if (input) input.disabled = !hasMembership;
            });
            if (!hasMembership) {
                if (fields.teachers) fields.teachers.value = '';
                if (fields.subjects) fields.subjects.value = '';
                if (fields.routines) fields.routines.value = '';
                if (fields.shifts) fields.shifts.value = '';
                return;
            }
            const data = limits || {};
            if (fields.teachers) fields.teachers.value = data.max_teachers === null || data.max_teachers === undefined ? '' : data.max_teachers;
            if (fields.subjects) fields.subjects.value = data.max_subjects === null || data.max_subjects === undefined ? '' : data.max_subjects;
            if (fields.routines) fields.routines.value = data.max_routines_yearly === null || data.max_routines_yearly === undefined ? '' : data.max_routines_yearly;
            if (fields.shifts) fields.shifts.value = data.max_shifts === null || data.max_shifts === undefined ? '' : data.max_shifts;
        }

        async function saveMembership() {
            const select = document.getElementById('membership-plan');
            if (!select) return;
            const planId = select.value;
            if (!confirm(planId ? 'Assign this membership to the institution?' : 'Remove membership and disable access?')) return;
            try {
                const res = await fetch('/admin/school/membership', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        school_id: SCHOOL_ID,
                        plan_id: planId
                    })
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to update membership.');
                    return;
                }
                currentMembershipId = planId ? Number(planId) : 0;
                if (result.plan) {
                    window.schoolLimitData = {
                        max_teachers: result.plan.max_teachers !== undefined ? result.plan.max_teachers : null,
                        max_subjects: result.plan.max_subjects !== undefined ? result.plan.max_subjects : null,
                        max_routines_yearly: result.plan.max_routines_yearly !== undefined ? result.plan.max_routines_yearly : null,
                        max_shifts: result.plan.max_shifts !== undefined ? result.plan.max_shifts : null
                    };
                } else if (!planId) {
                    window.schoolLimitData = {
                        max_teachers: null,
                        max_subjects: null,
                        max_routines_yearly: null,
                        max_shifts: null
                    };
                }
                renderMembership(currentMembershipId);
                if (typeof result.is_active !== 'undefined') {
                    updateStatusBadge(result.is_active);
                }
            } catch (e) {
                alert('Network error. Please try again.');
            }
        }

        async function saveMembershipLimits() {
            if (!(Number(currentMembershipId) > 0)) {
                alert('Assign a membership first.');
                return;
            }
            const maxTeachers = document.getElementById('limit-teachers')?.value || '';
            const maxSubjects = document.getElementById('limit-subjects')?.value || '';
            const maxRoutines = document.getElementById('limit-routines')?.value || '';
            const maxShifts = document.getElementById('limit-shifts')?.value || '';
            try {
                const res = await fetch('/admin/school/membership-limits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        school_id: SCHOOL_ID,
                        max_teachers: maxTeachers,
                        max_subjects: maxSubjects,
                        max_routines_yearly: maxRoutines,
                        max_shifts: maxShifts
                    })
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to save limits.');
                    return;
                }
                window.schoolLimitData = {
                    max_teachers: result.limits.max_teachers,
                    max_subjects: result.limits.max_subjects,
                    max_routines_yearly: result.limits.max_routines_yearly,
                    max_shifts: result.limits.max_shifts
                };
                renderMembership(currentMembershipId);
                alert('Limits updated.');
            } catch (e) {
                alert('Network error. Please try again.');
            }
        }

        function renderShiftList() {
            const container = document.getElementById('shift-list');
            if (!container) return;
            const list = Array.isArray(window.adminShiftList) && window.adminShiftList.length
                ? window.adminShiftList.slice()
                : ['Full Day'];
            container.innerHTML = list.map(shift => {
                const safeName = escapeHtmlClient(shift);
                if (shift === 'Full Day') {
                    return '<div class="flex items-center justify-between border border-gray-300 px-3 py-2">' +
                        '<span class="text-sm text-gray-900">' + safeName + '</span>' +
                        '<span class="text-xs text-gray-500">Default</span>' +
                    '</div>';
                }
                const encoded = encodeURIComponent(shift);
                return '<div class="flex items-center justify-between border border-gray-300 px-3 py-2">' +
                    '<span class="text-sm text-gray-900">' + safeName + '</span>' +
                    '<button type="button" data-action="remove-shift" data-shift="' + encoded + '" class="text-xs text-red-600 hover:text-red-700">Remove</button>' +
                '</div>';
            }).join('');
        }

        function toggleShiftEnabled(input) {
            fetch('/admin/school/shifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'set_enabled', school_id: SCHOOL_ID, enabled: input.checked })
            }).then(res => res.json()).then(result => {
                if (result.success) {
                    document.getElementById('shift-config-panel').classList.toggle('hidden', !input.checked);
                } else {
                    alert(result.error || 'Unable to update shift settings.');
                    input.checked = !input.checked;
                }
            }).catch(() => {
                alert('Network error. Please try again.');
                input.checked = !input.checked;
            });
        }

        function addShift(event) {
            event.preventDefault();
            const input = document.getElementById('shift-name');
            const name = input.value.trim();
            if (!name) return;

            fetch('/admin/school/shifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add_shift', school_id: SCHOOL_ID, shift_name: name })
            }).then(res => res.json()).then(result => {
                if (result.success) {
                    const nameNormalized = name;
                    window.adminShiftList = window.adminShiftList || [];
                    if (!window.adminShiftList.includes(nameNormalized)) {
                        window.adminShiftList.push(nameNormalized);
                    }
                    renderShiftList();
                    input.value = '';
                } else {
                    alert(result.error || 'Unable to add shift.');
                }
            }).catch(() => {
                alert('Network error. Please try again.');
            });
        }

        function removeShift(name) {
            if (!confirm('Remove shift ' + name + '?')) return;
            fetch('/admin/school/shifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'remove_shift', school_id: SCHOOL_ID, shift_name: name })
            }).then(res => res.json()).then(result => {
                if (result.success) {
                    window.adminShiftList = (window.adminShiftList || []).filter(shift => shift !== name);
                    renderShiftList();
                } else {
                    alert(result.error || 'Unable to remove shift.');
                }
            }).catch(() => {
                alert('Network error. Please try again.');
            });
        }

        const shiftList = document.getElementById('shift-list');
        if (shiftList) {
            shiftList.addEventListener('click', function(event) {
                const target = event.target.closest('[data-action="remove-shift"]');
                if (!target) return;
                const encoded = target.getAttribute('data-shift') || '';
                removeShift(decodeURIComponent(encoded));
            });
        }

        renderShiftList();
        renderMembership(currentMembershipId);

        function toggleAccountStatus() {
            const nextStatus = !schoolIsActive;
            const label = nextStatus ? 'enable' : 'disable';
            if (!confirm('Are you sure you want to ' + label + ' login for this institution?')) return;
            const btn = document.getElementById('status-toggle-btn');
            if (btn) btn.disabled = true;
            fetch('/admin/school/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ auth_id: SCHOOL_AUTH_ID, is_active: nextStatus ? 1 : 0 })
            }).then(res => res.json()).then(result => {
                if (result.success) {
                    updateStatusBadge(result.is_active);
                } else {
                    alert(result.error || 'Unable to update status.');
                }
            }).catch(() => {
                alert('Network error. Please try again.');
            }).finally(() => {
                if (btn) btn.disabled = false;
            });
        }
      </script>
    `;
}
