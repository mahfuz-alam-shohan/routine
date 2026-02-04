export function PolicyManagementHTML(plans = [], features = []) {
    const safePlans = JSON.stringify(plans).split('<').join('\\u003c');
    const safeFeatures = JSON.stringify(features).split('<').join('\\u003c');

    return `
      <div class="space-y-6 px-3 sm:px-4" id="policy-management">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                  <h1 class="text-xl font-bold text-gray-900">Policy Management</h1>
                  <p class="text-sm text-gray-500">Create membership plans and publish pricing to the homepage.</p>
              </div>
              <button type="button" onclick="openPlanModal()" class="border border-gray-900 text-gray-900 px-4 py-2 text-sm font-semibold">
                  Add Membership
              </button>
          </div>

          <div id="plans-container" class="space-y-4"></div>
      </div>

      <div id="plan-modal" class="fixed inset-0 bg-black/60 z-[9999] hidden flex items-center justify-center px-4">
          <div class="bg-white border border-gray-300 w-full max-w-lg">
              <div class="p-4 border-b border-gray-300 flex items-center justify-between">
                  <h3 class="text-sm font-semibold" id="plan-modal-title">Add Membership</h3>
                  <button type="button" onclick="closePlanModal()" class="text-gray-400 hover:text-gray-600">&times;</button>
              </div>
              <div class="p-4">
                  <form onsubmit="savePlan(event)" class="space-y-4">
                      <input type="hidden" id="plan-id">
                      <div>
                          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Plan Name</label>
                          <input type="text" id="plan-name" required class="w-full border border-gray-300 px-3 py-2 text-sm">
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Billing Cycle</label>
                              <select id="plan-cycle" class="w-full border border-gray-300 px-3 py-2 text-sm">
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="yearly">Yearly</option>
                              </select>
                          </div>
                          <div>
                              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Price (BDT)</label>
                              <input type="number" id="plan-price" min="0" required class="w-full border border-gray-300 px-3 py-2 text-sm">
                          </div>
                      </div>

                      <div class="border border-gray-200 p-3">
                          <div class="text-[11px] uppercase tracking-widest text-gray-500 mb-2">Auto Limits</div>
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Max Teachers</label>
                                  <input type="number" id="plan-max-teachers" min="0" class="w-full border border-gray-300 px-3 py-2 text-sm" placeholder="e.g. 40">
                              </div>
                              <div>
                                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Max Subjects</label>
                                  <input type="number" id="plan-max-subjects" min="0" class="w-full border border-gray-300 px-3 py-2 text-sm" placeholder="e.g. 50">
                              </div>
                              <div>
                                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Routines / Year</label>
                                  <input type="number" id="plan-max-routines" min="0" class="w-full border border-gray-300 px-3 py-2 text-sm" placeholder="e.g. 120">
                              </div>
                              <div>
                                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Max Shifts</label>
                                  <input type="number" id="plan-max-shifts" min="1" class="w-full border border-gray-300 px-3 py-2 text-sm" placeholder="1 for single shift">
                              </div>
                          </div>
                          <label class="flex items-center gap-2 text-sm text-gray-700 mt-3">
                              <input type="checkbox" id="plan-teacher-dashboard" class="w-4 h-4">
                              <span>Teacher dashboard available</span>
                          </label>
                      </div>

                      <label class="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" id="plan-published" class="w-4 h-4">
                          <span>Publish this pricing</span>
                      </label>
                      <div class="flex justify-end gap-2">
                          <button type="button" onclick="closePlanModal()" class="border border-gray-300 text-gray-700 px-4 py-2 text-sm">Cancel</button>
                          <button type="submit" id="plan-save-btn" class="border border-gray-900 text-gray-900 px-4 py-2 text-sm font-semibold">Save</button>
                      </div>
                  </form>
              </div>
          </div>
      </div>

      <div id="policy-toast" class="fixed bottom-4 right-4 z-[10000] hidden bg-gray-900 text-white text-xs font-semibold px-3 py-2">Saved</div>

      <script>
        window.policyData = {
            plans: ${safePlans},
            features: ${safeFeatures}
        };

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

        function formatCycle(cycle) {
            if (!cycle) return '';
            const text = String(cycle);
            return text.charAt(0).toUpperCase() + text.slice(1);
        }

        function showToast(message) {
            const toast = document.getElementById('policy-toast');
            if (!toast) return;
            toast.textContent = message || 'Saved';
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 2000);
        }

        function describeAuto(plan) {
            const items = [];
            if (plan.max_teachers !== null && plan.max_teachers !== undefined) items.push('Teachers: ' + plan.max_teachers);
            if (plan.max_subjects !== null && plan.max_subjects !== undefined) items.push('Subjects: ' + plan.max_subjects);
            if (plan.max_routines_yearly !== null && plan.max_routines_yearly !== undefined) items.push('Routines/year: ' + plan.max_routines_yearly);
            if (plan.max_shifts !== null && plan.max_shifts !== undefined) items.push('Shifts: ' + plan.max_shifts);
            items.push('Teacher dashboard: ' + (Number(plan.allow_teacher_dashboard) === 1 ? 'Yes' : 'No'));
            return items.length ? items.join('  ') : 'No auto limits set.';
        }

        function renderPlans() {
            const container = document.getElementById('plans-container');
            if (!container) return;
            const list = Array.isArray(window.policyData.plans) ? window.policyData.plans.slice() : [];
            list.sort((a, b) => (b.id || 0) - (a.id || 0));

            if (!list.length) {
                container.innerHTML = '<div class="border border-gray-300 p-6 text-sm text-gray-500">No pricing plans yet. Click Add Membership to create one.</div>';
                return;
            }

            const features = Array.isArray(window.policyData.features) ? window.policyData.features.slice() : [];

            const html = list.map(plan => {
                const planId = Number(plan.id);
                const planName = escapeHtmlClient(plan.name || '');
                const cycleLabel = formatCycle(plan.billing_cycle || '');
                const priceValue = Number(plan.price_taka) || 0;
                const published = Number(plan.is_published) === 1;
                const statusText = published ? 'Published' : 'Draft';
                const statusClass = published ? 'text-green-700' : 'text-gray-500';
                const planFeatures = features.filter(f => Number(f.plan_id) === planId);

                const featureHtml = planFeatures.length
                    ? planFeatures.map(feature => {
                        const highlight = Number(feature.is_highlight) === 1;
                        const featureClass = highlight ? 'bg-gray-100 font-semibold' : 'bg-white';
                        return '<div class="border border-gray-200 px-2 py-1 text-xs flex items-center justify-between gap-2 ' + featureClass + '">' +
                            '<span>' + escapeHtmlClient(feature.feature_text || '') + '</span>' +
                            '<button type="button" onclick="deleteFeature(' + feature.id + ')" class="text-[10px] text-red-600">Remove</button>' +
                        '</div>';
                    }).join('')
                    : '<div class="text-xs text-gray-500">No features yet.</div>';

                return '<div class="border border-gray-300 bg-white">' +
                    '<div class="bg-gray-50 px-3 py-2 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-2">' +
                        '<div>' +
                            '<div class="text-sm font-semibold text-gray-900">' + planName + '</div>' +
                            '<div class="text-[11px] text-gray-500">' + cycleLabel + '  BDT ' + priceValue + '  <span class="' + statusClass + '">' + statusText + '</span></div>' +
                            '<div class="text-[11px] text-gray-500 mt-1">Auto: ' + escapeHtmlClient(describeAuto(plan)) + '</div>' +
                        '</div>' +
                        '<div class="flex flex-wrap gap-2">' +
                            '<button type="button" onclick="openPlanModal(' + planId + ')" class="border border-gray-300 text-gray-700 px-2 py-1 text-xs">Edit</button>' +
                            '<button type="button" onclick="togglePublish(' + planId + ')" class="border border-gray-300 text-gray-700 px-2 py-1 text-xs">' + (published ? 'Unpublish' : 'Publish') + '</button>' +
                            '<button type="button" onclick="generateAutoFeatures(' + planId + ')" class="border border-gray-300 text-gray-700 px-2 py-1 text-xs">Apply Auto Features</button>' +
                            '<button type="button" onclick="deletePlan(' + planId + ')" class="border border-red-400 text-red-600 px-2 py-1 text-xs">Delete</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="p-3">' +
                        '<div class="text-[11px] uppercase tracking-widest text-gray-500 mb-2">Features</div>' +
                        '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">' + featureHtml + '</div>' +
                        '<div class="flex flex-col sm:flex-row gap-2">' +
                            '<input type="text" id="feature-input-' + planId + '" placeholder="Add feature" class="flex-1 border border-gray-300 px-2 py-1 text-xs">' +
                            '<label class="flex items-center gap-2 text-xs text-gray-600">' +
                                '<input type="checkbox" id="feature-highlight-' + planId + '" class="w-3 h-3">Highlight' +
                            '</label>' +
                            '<button type="button" onclick="addFeature(' + planId + ')" class="border border-gray-900 text-gray-900 px-3 py-1 text-xs">Add Feature</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');

            container.innerHTML = html;
        }

        function openPlanModal(planId) {
            const modal = document.getElementById('plan-modal');
            const title = document.getElementById('plan-modal-title');
            const idInput = document.getElementById('plan-id');
            const nameInput = document.getElementById('plan-name');
            const cycleInput = document.getElementById('plan-cycle');
            const priceInput = document.getElementById('plan-price');
            const publishedInput = document.getElementById('plan-published');
            const maxTeachersInput = document.getElementById('plan-max-teachers');
            const maxSubjectsInput = document.getElementById('plan-max-subjects');
            const maxRoutinesInput = document.getElementById('plan-max-routines');
            const maxShiftsInput = document.getElementById('plan-max-shifts');
            const dashboardInput = document.getElementById('plan-teacher-dashboard');

            if (planId) {
                const plan = (window.policyData.plans || []).find(p => Number(p.id) === Number(planId));
                if (!plan) return;
                title.textContent = 'Edit Membership';
                idInput.value = plan.id;
                nameInput.value = plan.name || '';
                cycleInput.value = plan.billing_cycle || 'monthly';
                priceInput.value = plan.price_taka || 0;
                publishedInput.checked = Number(plan.is_published) === 1;
                maxTeachersInput.value = plan.max_teachers !== null && plan.max_teachers !== undefined ? plan.max_teachers : '';
                maxSubjectsInput.value = plan.max_subjects !== null && plan.max_subjects !== undefined ? plan.max_subjects : '';
                maxRoutinesInput.value = plan.max_routines_yearly !== null && plan.max_routines_yearly !== undefined ? plan.max_routines_yearly : '';
                maxShiftsInput.value = plan.max_shifts !== null && plan.max_shifts !== undefined ? plan.max_shifts : '';
                dashboardInput.checked = Number(plan.allow_teacher_dashboard) === 1;
            } else {
                title.textContent = 'Add Membership';
                idInput.value = '';
                nameInput.value = '';
                cycleInput.value = 'monthly';
                priceInput.value = '';
                publishedInput.checked = false;
                maxTeachersInput.value = '';
                maxSubjectsInput.value = '';
                maxRoutinesInput.value = '';
                maxShiftsInput.value = '';
                dashboardInput.checked = false;
            }
            modal.classList.remove('hidden');
        }

        function closePlanModal() {
            document.getElementById('plan-modal').classList.add('hidden');
        }

        async function savePlan(e) {
            e.preventDefault();
            const planId = document.getElementById('plan-id').value;
            const name = document.getElementById('plan-name').value.trim();
            const cycle = document.getElementById('plan-cycle').value;
            const price = document.getElementById('plan-price').value;
            const published = document.getElementById('plan-published').checked;
            const maxTeachers = document.getElementById('plan-max-teachers').value;
            const maxSubjects = document.getElementById('plan-max-subjects').value;
            const maxRoutines = document.getElementById('plan-max-routines').value;
            const maxShifts = document.getElementById('plan-max-shifts').value;
            const teacherDashboard = document.getElementById('plan-teacher-dashboard').checked;
            const btn = document.getElementById('plan-save-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            const payload = {
                action: planId ? 'update_plan' : 'create_plan',
                plan_id: planId || undefined,
                name: name,
                billing_cycle: cycle,
                price_taka: price,
                is_published: published ? 1 : 0,
                max_teachers: maxTeachers,
                max_subjects: maxSubjects,
                max_routines_yearly: maxRoutines,
                max_shifts: maxShifts,
                allow_teacher_dashboard: teacherDashboard ? 1 : 0
            };

            const shouldAuto = maxTeachers !== '' || maxSubjects !== '' || maxRoutines !== '' || maxShifts !== '' || teacherDashboard;

            try {
                const res = await fetch('/admin/policy-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to save plan');
                    return;
                }

                const effectivePlanId = planId || result.id;

                if (planId) {
                    const plan = window.policyData.plans.find(p => Number(p.id) === Number(planId));
                    if (plan) {
                        plan.name = name;
                        plan.billing_cycle = cycle;
                        plan.price_taka = Number(price);
                        plan.is_published = published ? 1 : 0;
                        plan.max_teachers = maxTeachers === '' ? null : Number(maxTeachers);
                        plan.max_subjects = maxSubjects === '' ? null : Number(maxSubjects);
                        plan.max_routines_yearly = maxRoutines === '' ? null : Number(maxRoutines);
                        plan.max_shifts = maxShifts === '' ? null : Number(maxShifts);
                        plan.allow_teacher_dashboard = teacherDashboard ? 1 : 0;
                    }
                } else {
                    window.policyData.plans.unshift({
                        id: result.id,
                        name: name,
                        billing_cycle: cycle,
                        price_taka: Number(price),
                        is_published: published ? 1 : 0,
                        max_teachers: maxTeachers === '' ? null : Number(maxTeachers),
                        max_subjects: maxSubjects === '' ? null : Number(maxSubjects),
                        max_routines_yearly: maxRoutines === '' ? null : Number(maxRoutines),
                        max_shifts: maxShifts === '' ? null : Number(maxShifts),
                        allow_teacher_dashboard: teacherDashboard ? 1 : 0
                    });
                }
                closePlanModal();
                renderPlans();
                if (shouldAuto && effectivePlanId) {
                    await generateAutoFeatures(effectivePlanId);
                }
                showToast('Saved');
            } catch (err) {
                alert('Network error');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }

        async function deletePlan(planId) {
            if (!confirm('Delete this plan? This will remove its features and orders.')) return;
            try {
                const res = await fetch('/admin/policy-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete_plan', plan_id: planId })
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to delete plan');
                    return;
                }
                window.policyData.plans = (window.policyData.plans || []).filter(p => Number(p.id) !== Number(planId));
                window.policyData.features = (window.policyData.features || []).filter(f => Number(f.plan_id) !== Number(planId));
                renderPlans();
                showToast('Deleted');
            } catch (err) {
                alert('Network error');
            }
        }

        async function togglePublish(planId) {
            const plan = (window.policyData.plans || []).find(p => Number(p.id) === Number(planId));
            if (!plan) return;
            const next = Number(plan.is_published) !== 1;
            try {
                const res = await fetch('/admin/policy-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update_plan',
                        plan_id: planId,
                        name: plan.name,
                        billing_cycle: plan.billing_cycle,
                        price_taka: plan.price_taka,
                        is_published: next ? 1 : 0,
                        max_teachers: plan.max_teachers,
                        max_subjects: plan.max_subjects,
                        max_routines_yearly: plan.max_routines_yearly,
                        max_shifts: plan.max_shifts,
                        allow_teacher_dashboard: plan.allow_teacher_dashboard
                    })
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to update plan');
                    return;
                }
                plan.is_published = next ? 1 : 0;
                renderPlans();
                showToast(next ? 'Published' : 'Unpublished');
            } catch (err) {
                alert('Network error');
            }
        }

        async function generateAutoFeatures(planId) {
            try {
                const res = await fetch('/admin/policy-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'generate_auto_features', plan_id: planId })
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to generate features');
                    return;
                }
                window.policyData.features = (window.policyData.features || []).filter(f => !(Number(f.plan_id) === Number(planId) && Number(f.is_auto) === 1));
                (result.features || []).forEach(item => {
                    window.policyData.features.push(item);
                });
                renderPlans();
                showToast('Auto features applied');
            } catch (err) {
                alert('Network error');
            }
        }

        async function addFeature(planId) {
            const input = document.getElementById('feature-input-' + planId);
            const highlight = document.getElementById('feature-highlight-' + planId);
            if (!input) return;
            const text = input.value.trim();
            if (!text) {
                alert('Enter a feature');
                return;
            }
            try {
                const res = await fetch('/admin/policy-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'add_feature',
                        plan_id: planId,
                        feature_text: text,
                        is_highlight: highlight && highlight.checked ? 1 : 0
                    })
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to add feature');
                    return;
                }
                window.policyData.features.push({
                    id: result.id,
                    plan_id: Number(planId),
                    feature_text: text,
                    is_highlight: highlight && highlight.checked ? 1 : 0,
                    is_auto: 0
                });
                input.value = '';
                if (highlight) highlight.checked = false;
                renderPlans();
                showToast('Feature added');
            } catch (err) {
                alert('Network error');
            }
        }

        async function deleteFeature(featureId) {
            if (!confirm('Remove this feature?')) return;
            try {
                const res = await fetch('/admin/policy-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete_feature', feature_id: featureId })
                });
                const result = await res.json();
                if (!result.success) {
                    alert(result.error || 'Unable to remove feature');
                    return;
                }
                window.policyData.features = (window.policyData.features || []).filter(f => Number(f.id) !== Number(featureId));
                renderPlans();
                showToast('Feature removed');
            } catch (err) {
                alert('Network error');
            }
        }

        document.addEventListener('DOMContentLoaded', renderPlans);
      </script>
    `;
}
