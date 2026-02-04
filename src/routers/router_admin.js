import { htmlResponse, jsonResponse, getCookie, getCompanyName } from '../core/utils.js';
import { hashPassword } from '../core/auth.js';
import { ADMIN_SETUP_HTML } from '../ui/admin/setup.js';
import { AdminLayout } from '../ui/admin/layout.js';
import { SettingsPageHTML } from '../ui/admin/settings.js';
import { SchoolsPageHTML } from '../ui/admin/schools.js'; 
import { SchoolDetailHTML } from '../ui/admin/school_detail.js'; 
import { SchoolClassesHTML } from '../ui/admin/school_classes.js'; 
import { SchoolTeachersHTML } from '../ui/admin/school_teachers.js'; 
import { PolicyManagementHTML } from '../ui/admin/policy_management.js';
import { OrdersHTML } from '../ui/admin/orders.js';
import { ROLES } from '../config.js';
import { syncDatabase } from '../core/schema_manager.js';

export async function handleAdminRequest(request, env) {
  const url = new URL(request.url);
  const companyName = await getCompanyName(env);

  
  const email = getCookie(request, 'user_email');
  if (!email && url.pathname !== '/admin/setup') {
      return htmlResponse("<h1>Unauthorized</h1><p>Please log in.</p>", 401);
  }

  
  if (url.pathname === '/admin/dashboard') {
    const content = `
    <div class="p-4 bg-white border border-gray-300">
        <h3 class="text-base font-bold text-gray-900 mb-2">Welcome to your Control Center</h3>
        <p class="text-sm text-gray-600">Select an option from the sidebar to manage schools, settings, or view reports.</p>
    </div>`;
    return htmlResponse(AdminLayout(content, "Dashboard", companyName, {email}));
  }

  
  if (url.pathname === '/admin/settings') {
      const admin = await env.DB.prepare("SELECT * FROM auth_accounts WHERE email = ?").bind(email).first();
      
      if (request.method === 'POST') {
          try {
              const body = await request.json();
              
              if (body.action === 'update_profile') {
                  const exists = await env.DB.prepare("SELECT id FROM profiles_admin WHERE auth_id = ?").bind(admin.id).first();
                  if (exists) {
                      await env.DB.prepare("UPDATE profiles_admin SET full_name=?, phone=?, dob=? WHERE auth_id=?").bind(body.full_name, body.phone, body.dob, admin.id).run();
                  } else {
                      await env.DB.prepare("INSERT INTO profiles_admin (auth_id, full_name, phone, dob) VALUES (?, ?, ?, ?)").bind(admin.id, body.full_name, body.phone, body.dob).run();
                  }
                  return jsonResponse({ success: true });
              }

              if (body.action === 'change_password') {
                  const { hash, salt } = await hashPassword(body.password);
                  await env.DB.prepare("UPDATE auth_accounts SET password_hash=?, salt=? WHERE id=?").bind(hash, salt, admin.id).run();
                  return jsonResponse({ success: true });
              }

          } catch(e) { 
              if(e.message.includes("no such table")) await syncDatabase(env);
              return jsonResponse({ error: e.message }, 500); 
          }
      }

      let profile = {};
      try { profile = await env.DB.prepare("SELECT * FROM profiles_admin WHERE auth_id = ?").bind(admin.id).first(); } catch(e) {}
      return htmlResponse(AdminLayout(SettingsPageHTML(profile, email), "Settings", companyName, {email}));
  }

  
  if (url.pathname === '/admin/schools') {
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            if (!body.email || !body.password || !body.school_name) return jsonResponse({ error: "Missing fields" }, 400);
            
            const exists = await env.DB.prepare("SELECT id FROM auth_accounts WHERE email = ?").bind(body.email).first();
            if (exists) return jsonResponse({ error: "Email exists" }, 400);

            const { hash, salt } = await hashPassword(body.password);
            const authResult = await env.DB.prepare("INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?) RETURNING id").bind(body.email, hash, salt, ROLES.INSTITUTE).first();
            await env.DB.prepare("INSERT INTO profiles_institution (auth_id, school_name, eiin_code, address) VALUES (?, ?, ?, ?)").bind(authResult.id, body.school_name, body.eiin || '', body.address || '').run();
            return jsonResponse({ 
                success: true,
                school: {
                    auth_id: authResult.id,
                    school_name: body.school_name,
                    eiin_code: body.eiin || '',
                    email: body.email
                }
            });
        } catch(e) { return jsonResponse({ error: e.message }, 500); }
    }
    const result = await env.DB.prepare(`SELECT p.auth_id, p.school_name, p.eiin_code, a.email FROM profiles_institution p JOIN auth_accounts a ON p.auth_id = a.id ORDER BY p.id DESC`).all();
    return htmlResponse(AdminLayout(SchoolsPageHTML(result.results || []), "Schools", companyName, {email}));
  }

  if (url.pathname === '/admin/policy-management') {
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const action = body.action || '';

        if (action === 'create_plan') {
          const name = (body.name || '').toString().trim();
          const cycle = (body.billing_cycle || '').toString().trim().toLowerCase();
          const price = Number(body.price_taka);
          const isPublished = body.is_published ? 1 : 0;
          const maxTeachers = body.max_teachers !== undefined && body.max_teachers !== null && body.max_teachers !== '' ? Number(body.max_teachers) : null;
          const maxSubjects = body.max_subjects !== undefined && body.max_subjects !== null && body.max_subjects !== '' ? Number(body.max_subjects) : null;
          const maxRoutinesYearly = body.max_routines_yearly !== undefined && body.max_routines_yearly !== null && body.max_routines_yearly !== '' ? Number(body.max_routines_yearly) : null;
          const maxShifts = body.max_shifts !== undefined && body.max_shifts !== null && body.max_shifts !== '' ? Number(body.max_shifts) : null;
          const allowTeacherDashboard = body.allow_teacher_dashboard ? 1 : 0;
          if (!name) return jsonResponse({ error: "Plan name required" }, 400);
          if (!['weekly','monthly','yearly'].includes(cycle)) return jsonResponse({ error: "Invalid billing cycle" }, 400);
          if (!Number.isFinite(price) || price < 0) return jsonResponse({ error: "Invalid price" }, 400);
          if (maxTeachers !== null && (!Number.isFinite(maxTeachers) || maxTeachers < 0)) return jsonResponse({ error: "Invalid teacher limit" }, 400);
          if (maxSubjects !== null && (!Number.isFinite(maxSubjects) || maxSubjects < 0)) return jsonResponse({ error: "Invalid subject limit" }, 400);
          if (maxRoutinesYearly !== null && (!Number.isFinite(maxRoutinesYearly) || maxRoutinesYearly < 0)) return jsonResponse({ error: "Invalid routine limit" }, 400);
          if (maxShifts !== null && (!Number.isFinite(maxShifts) || maxShifts < 1)) return jsonResponse({ error: "Invalid shift limit" }, 400);
          const result = await env.DB.prepare(`
            INSERT INTO pricing_plans (
              name, billing_cycle, price_taka, is_published,
              max_teachers, max_subjects, max_routines_yearly, max_shifts, allow_teacher_dashboard
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
          `).bind(name, cycle, price, isPublished, maxTeachers, maxSubjects, maxRoutinesYearly, maxShifts, allowTeacherDashboard).first();
          return jsonResponse({ success: true, id: result?.id });
        }

        if (action === 'update_plan') {
          const planId = Number(body.plan_id);
          const name = (body.name || '').toString().trim();
          const cycle = (body.billing_cycle || '').toString().trim().toLowerCase();
          const price = Number(body.price_taka);
          const isPublished = body.is_published ? 1 : 0;
          const maxTeachers = body.max_teachers !== undefined && body.max_teachers !== null && body.max_teachers !== '' ? Number(body.max_teachers) : null;
          const maxSubjects = body.max_subjects !== undefined && body.max_subjects !== null && body.max_subjects !== '' ? Number(body.max_subjects) : null;
          const maxRoutinesYearly = body.max_routines_yearly !== undefined && body.max_routines_yearly !== null && body.max_routines_yearly !== '' ? Number(body.max_routines_yearly) : null;
          const maxShifts = body.max_shifts !== undefined && body.max_shifts !== null && body.max_shifts !== '' ? Number(body.max_shifts) : null;
          const allowTeacherDashboard = body.allow_teacher_dashboard ? 1 : 0;
          if (!planId) return jsonResponse({ error: "Plan ID required" }, 400);
          if (!name) return jsonResponse({ error: "Plan name required" }, 400);
          if (!['weekly','monthly','yearly'].includes(cycle)) return jsonResponse({ error: "Invalid billing cycle" }, 400);
          if (!Number.isFinite(price) || price < 0) return jsonResponse({ error: "Invalid price" }, 400);
          if (maxTeachers !== null && (!Number.isFinite(maxTeachers) || maxTeachers < 0)) return jsonResponse({ error: "Invalid teacher limit" }, 400);
          if (maxSubjects !== null && (!Number.isFinite(maxSubjects) || maxSubjects < 0)) return jsonResponse({ error: "Invalid subject limit" }, 400);
          if (maxRoutinesYearly !== null && (!Number.isFinite(maxRoutinesYearly) || maxRoutinesYearly < 0)) return jsonResponse({ error: "Invalid routine limit" }, 400);
          if (maxShifts !== null && (!Number.isFinite(maxShifts) || maxShifts < 1)) return jsonResponse({ error: "Invalid shift limit" }, 400);
          await env.DB.prepare(`
            UPDATE pricing_plans SET
              name = ?, billing_cycle = ?, price_taka = ?, is_published = ?,
              max_teachers = ?, max_subjects = ?, max_routines_yearly = ?, max_shifts = ?, allow_teacher_dashboard = ?
            WHERE id = ?
          `).bind(name, cycle, price, isPublished, maxTeachers, maxSubjects, maxRoutinesYearly, maxShifts, allowTeacherDashboard, planId).run();

          await env.DB.prepare(`
            UPDATE profiles_institution SET
              plan_name = ?,
              plan_billing_cycle = ?,
              plan_price_taka = ?,
              max_teachers = ?,
              max_subjects = ?,
              max_routines_yearly = ?,
              max_shifts = ?,
              allow_teacher_dashboard = ?
            WHERE plan_id = ?
          `).bind(
            name,
            cycle,
            price,
            maxTeachers,
            maxSubjects,
            maxRoutinesYearly,
            maxShifts,
            allowTeacherDashboard,
            planId
          ).run();

          if (maxShifts !== null && maxShifts !== undefined) {
            const shiftsEnabled = Number(maxShifts) > 1 ? 1 : 0;
            await env.DB.prepare("UPDATE profiles_institution SET shifts_enabled = ? WHERE plan_id = ?")
              .bind(shiftsEnabled, planId).run();
            if (shiftsEnabled) {
              const schools = await env.DB.prepare("SELECT id FROM profiles_institution WHERE plan_id = ?")
                .bind(planId).all();
              for (const row of schools.results || []) {
                await ensureScheduleConfigWithShifts(env, row.id);
              }
            }
          }

          return jsonResponse({ success: true });
        }

        if (action === 'delete_plan') {
          const planId = Number(body.plan_id);
          if (!planId) return jsonResponse({ error: "Plan ID required" }, 400);
          await env.DB.prepare("DELETE FROM pricing_orders WHERE plan_id = ?").bind(planId).run();
          await env.DB.prepare("DELETE FROM pricing_features WHERE plan_id = ?").bind(planId).run();
          await env.DB.prepare("DELETE FROM pricing_plans WHERE id = ?").bind(planId).run();
          return jsonResponse({ success: true });
        }

        if (action === 'add_feature') {
          const planId = Number(body.plan_id);
          const text = (body.feature_text || '').toString().trim();
          const isHighlight = body.is_highlight ? 1 : 0;
          if (!planId) return jsonResponse({ error: "Plan ID required" }, 400);
          if (!text) return jsonResponse({ error: "Feature text required" }, 400);
          const result = await env.DB.prepare(`
            INSERT INTO pricing_features (plan_id, feature_text, is_highlight, is_auto)
            VALUES (?, ?, ?, 0) RETURNING id
          `).bind(planId, text, isHighlight).first();
          return jsonResponse({ success: true, id: result?.id });
        }

        if (action === 'delete_feature') {
          const featureId = Number(body.feature_id);
          if (!featureId) return jsonResponse({ error: "Feature ID required" }, 400);
          await env.DB.prepare("DELETE FROM pricing_features WHERE id = ?").bind(featureId).run();
          return jsonResponse({ success: true });
        }

        if (action === 'generate_auto_features') {
          const planId = Number(body.plan_id);
          if (!planId) return jsonResponse({ error: "Plan ID required" }, 400);
          const plan = await env.DB.prepare("SELECT * FROM pricing_plans WHERE id = ?").bind(planId).first();
          if (!plan) return jsonResponse({ error: "Plan not found" }, 404);

          const featureList = [];
          if (plan.max_teachers !== null && plan.max_teachers !== undefined) {
            featureList.push({ text: `Up to ${plan.max_teachers} teachers`, highlight: 1 });
          }
          if (plan.max_subjects !== null && plan.max_subjects !== undefined) {
            featureList.push({ text: `Up to ${plan.max_subjects} subjects`, highlight: 1 });
          }
          if (plan.max_routines_yearly !== null && plan.max_routines_yearly !== undefined) {
            featureList.push({ text: `Up to ${plan.max_routines_yearly} routines per year`, highlight: 0 });
          }
          if (plan.max_shifts !== null && plan.max_shifts !== undefined) {
            const shiftLabel = Number(plan.max_shifts) === 1 ? 'Single shift' : `Up to ${plan.max_shifts} shifts`;
            featureList.push({ text: shiftLabel, highlight: 1 });
          }
          featureList.push({ text: `Teacher dashboard: ${Number(plan.allow_teacher_dashboard) === 1 ? 'Yes' : 'No'}`, highlight: 0 });

          await env.DB.prepare("DELETE FROM pricing_features WHERE plan_id = ? AND is_auto = 1").bind(planId).run();

          for (const item of featureList) {
            await env.DB.prepare(`
              INSERT INTO pricing_features (plan_id, feature_text, is_highlight, is_auto)
              VALUES (?, ?, ?, 1)
            `).bind(planId, item.text, item.highlight ? 1 : 0).run();
          }

          const rows = await env.DB.prepare("SELECT * FROM pricing_features WHERE plan_id = ? AND is_auto = 1 ORDER BY id ASC").bind(planId).all();
          return jsonResponse({ success: true, features: rows.results || [] });
        }

        return jsonResponse({ error: "Invalid action" }, 400);
      } catch (e) {
        if (e.message && (e.message.includes("no such table") || e.message.includes("no such column"))) {
          await syncDatabase(env);
          return jsonResponse({ error: "Database updated. Please retry." }, 500);
        }
        return jsonResponse({ error: e.message }, 500);
      }
    }

    let plans = [];
    let features = [];
    try {
      const planRows = await env.DB.prepare("SELECT * FROM pricing_plans ORDER BY id DESC").all();
      plans = planRows.results || [];
      const featureRows = await env.DB.prepare("SELECT * FROM pricing_features ORDER BY id ASC").all();
      features = featureRows.results || [];
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await syncDatabase(env);
      }
    }
    return htmlResponse(AdminLayout(PolicyManagementHTML(plans, features), "Policy Management", companyName, {email}));
  }

  if (url.pathname === '/admin/orders') {
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const action = body.action || '';
        const orderId = Number(body.order_id);
        if (!orderId) return jsonResponse({ error: "Order ID required" }, 400);

        if (action === 'decline_order') {
          await env.DB.prepare("UPDATE pricing_orders SET status = 'declined', processed_at = CURRENT_TIMESTAMP WHERE id = ?")
            .bind(orderId).run();
          return jsonResponse({ success: true });
        }

        if (action === 'grant_order') {
          const order = await env.DB.prepare("SELECT * FROM pricing_orders WHERE id = ?").bind(orderId).first();
          if (!order) return jsonResponse({ error: "Order not found" }, 404);
          if (order.status === 'granted') return jsonResponse({ error: "Order already granted" }, 400);

          const phone = (order.requester_phone || '').toString().trim();
          if (!/^\d+$/.test(phone)) {
            return jsonResponse({ error: "Phone number must contain digits only." }, 400);
          }

          const existing = await env.DB.prepare("SELECT id FROM auth_accounts WHERE email = ?").bind(order.requester_email).first();
          if (existing) return jsonResponse({ error: "Email already exists. Cannot grant." }, 400);

          const plan = await env.DB.prepare("SELECT * FROM pricing_plans WHERE id = ?").bind(order.plan_id).first();
          if (!plan) return jsonResponse({ error: "Plan not found" }, 404);

          const { hash, salt } = await hashPassword(phone);
          const authResult = await env.DB.prepare(
            "INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?) RETURNING id"
          ).bind(order.requester_email, hash, salt, ROLES.INSTITUTE).first();

          const maxTeachers = plan.max_teachers !== null && plan.max_teachers !== undefined ? Number(plan.max_teachers) : null;
          const shiftsEnabled = plan.max_shifts !== null && plan.max_shifts !== undefined && Number(plan.max_shifts) > 1 ? 1 : 0;

          const schoolInsert = await env.DB.prepare(`
            INSERT INTO profiles_institution (
              auth_id, school_name, eiin_code, address,
              max_teachers, shifts_enabled,
              plan_id, plan_name, plan_billing_cycle, plan_price_taka,
              max_subjects, max_routines_yearly, max_shifts, allow_teacher_dashboard
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING id
          `).bind(
            authResult.id,
            order.institution_name || 'Institution',
            '',
            '',
            maxTeachers,
            shiftsEnabled,
            plan.id,
            plan.name,
            plan.billing_cycle,
            plan.price_taka,
            plan.max_subjects,
            plan.max_routines_yearly,
            plan.max_shifts,
            plan.allow_teacher_dashboard ? 1 : 0
          ).first();

          const schoolId = schoolInsert?.id;
          if (schoolId) {
            await ensureScheduleConfigWithShifts(env, schoolId);
          }

          await env.DB.prepare(`
            UPDATE pricing_orders
            SET status = 'granted', school_id = ?, auth_id = ?, processed_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).bind(schoolId || null, authResult.id, orderId).run();

          return jsonResponse({ success: true });
        }

        return jsonResponse({ error: "Invalid action" }, 400);
      } catch (e) {
        if (e.message && (e.message.includes("no such table") || e.message.includes("no such column"))) {
          await syncDatabase(env);
          return jsonResponse({ error: "Database updated. Please retry." }, 500);
        }
        return jsonResponse({ error: e.message }, 500);
      }
    }

    let orders = [];
    try {
      const rows = await env.DB.prepare("SELECT * FROM pricing_orders ORDER BY created_at DESC").all();
      orders = rows.results || [];
    } catch (e) {
      if (e.message && e.message.includes("no such table")) {
        await syncDatabase(env);
      }
    }
    return htmlResponse(AdminLayout(OrdersHTML(orders), "Orders", companyName, {email}));
  }

  
  if (url.pathname === '/admin/school/view') {
    const authId = url.searchParams.get('id');
    const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
    if (school) {
      const account = await env.DB.prepare("SELECT email, is_active, created_at FROM auth_accounts WHERE id=?").bind(authId).first();
      if (account) {
        school.email = account.email;
        school.is_active = account.is_active;
        school.created_at = account.created_at;
      }
    }
    let shiftConfig = { enabled: false, shifts: ['Full Day'] };
    try {
      const scheduleConfig = await env.DB.prepare("SELECT shifts_json FROM schedule_config WHERE school_id = ?").bind(school.id).first();
      const shifts = parseShiftList(scheduleConfig?.shifts_json);
      shiftConfig = { enabled: !!school.shifts_enabled, shifts };
    } catch (e) {}
    let stats = {};
    try {
      const sid = school.id;
      const metrics = await env.DB.prepare(`
        SELECT
          (SELECT COUNT(*) FROM academic_classes WHERE school_id = ?) AS class_count,
          (SELECT COUNT(*) FROM class_groups WHERE school_id = ?) AS group_count,
          (SELECT COUNT(*) FROM class_sections WHERE school_id = ?) AS section_count,
          (SELECT COUNT(*) FROM academic_subjects WHERE school_id = ?) AS subject_count,
          (SELECT COUNT(*) FROM profiles_teacher WHERE school_id = ?) AS teacher_count,
          (SELECT COUNT(*) FROM teacher_assignments WHERE school_id = ?) AS assignment_count,
          (SELECT COUNT(*) FROM teacher_assignments WHERE school_id = ? AND is_auto = 1) AS assignment_auto_count,
          (SELECT COUNT(*) FROM generated_routines WHERE school_id = ?) AS routine_count,
          (SELECT COUNT(*) FROM generated_routines WHERE school_id = ? AND is_active = 1) AS active_routine_count,
          (SELECT MAX(generated_at) FROM generated_routines WHERE school_id = ?) AS last_generated,
          (SELECT COUNT(*) FROM schedule_slots WHERE school_id = ?) AS slot_count,
          (SELECT COUNT(*) FROM schedule_slots WHERE school_id = ? AND type != 'break') AS class_slot_count,
          (SELECT COUNT(*) FROM schedule_slots WHERE school_id = ? AND type = 'break') AS break_slot_count
      `).bind(
        sid, sid, sid, sid, sid,
        sid, sid, sid, sid, sid,
        sid, sid, sid
      ).first();

      const scheduleConfig = await env.DB.prepare(`
        SELECT working_days, off_days, periods_per_day, active_days, start_time
        FROM schedule_config WHERE school_id = ?
      `).bind(sid).first();

      let workingDays = [];
      let offDays = [];
      try { workingDays = JSON.parse(scheduleConfig?.working_days || '[]'); } catch (e) {}
      try { offDays = JSON.parse(scheduleConfig?.off_days || '[]'); } catch (e) {}

      stats = {
        ...metrics,
        schedule: {
          working_days: workingDays,
          off_days: offDays,
          periods_per_day: scheduleConfig?.periods_per_day || 0,
          active_days: scheduleConfig?.active_days || 0,
          start_time: scheduleConfig?.start_time || ''
        }
      };
    } catch (e) {}
    let plans = [];
    try {
      const planRows = await env.DB.prepare("SELECT * FROM pricing_plans ORDER BY price_taka ASC").all();
      plans = planRows.results || [];
    } catch (e) {}
    return htmlResponse(AdminLayout(SchoolDetailHTML(school, shiftConfig, stats, plans), "Manage Client", companyName, {email}));
  }

  if (url.pathname === '/admin/school/status') {
    if (request.method !== 'POST') {
      return jsonResponse({ error: "Invalid method" }, 405);
    }
    try {
      const body = await request.json();
      const authId = body.auth_id;
      const isActive = body.is_active ? 1 : 0;
      if (!authId) return jsonResponse({ error: "Auth ID required" }, 400);
      if (isActive === 1) {
        const schoolRow = await env.DB.prepare("SELECT plan_id FROM profiles_institution WHERE auth_id = ?").bind(authId).first();
        if (!schoolRow?.plan_id) {
          return jsonResponse({ error: "Assign a membership before enabling access." }, 400);
        }
      }
      await env.DB.prepare("UPDATE auth_accounts SET is_active = ? WHERE id = ?").bind(isActive, authId).run();
      return jsonResponse({ success: true, is_active: isActive });
    } catch (e) {
      return jsonResponse({ error: e.message }, 500);
    }
  }

  if (url.pathname === '/admin/school/membership') {
    if (request.method !== 'POST') {
      return jsonResponse({ error: "Invalid method" }, 405);
    }
    try {
      const body = await request.json();
      const schoolId = Number(body.school_id);
      const planIdRaw = body.plan_id;
      if (!schoolId) return jsonResponse({ error: "School ID required" }, 400);

      const schoolRow = await env.DB.prepare("SELECT id, auth_id, shifts_enabled FROM profiles_institution WHERE id = ?").bind(schoolId).first();
      if (!schoolRow) return jsonResponse({ error: "School not found" }, 404);

      if (!planIdRaw) {
        await env.DB.prepare(`
          UPDATE profiles_institution
          SET plan_id = NULL,
              plan_name = NULL,
              plan_billing_cycle = NULL,
              plan_price_taka = NULL,
              max_teachers = NULL,
              max_subjects = NULL,
              max_routines_yearly = NULL,
              max_shifts = NULL,
              allow_teacher_dashboard = 0
          WHERE id = ?
        `).bind(schoolId).run();
        await env.DB.prepare("UPDATE auth_accounts SET is_active = 0 WHERE id = ?")
          .bind(schoolRow.auth_id).run();
        return jsonResponse({ success: true, is_active: 0, plan: null });
      }

      const planId = Number(planIdRaw);
      if (!planId) return jsonResponse({ error: "Plan ID required" }, 400);
      const plan = await env.DB.prepare("SELECT * FROM pricing_plans WHERE id = ?").bind(planId).first();
      if (!plan) return jsonResponse({ error: "Plan not found" }, 404);

      let shiftsEnabled = schoolRow.shifts_enabled ? 1 : 0;
      if (plan.max_shifts !== null && plan.max_shifts !== undefined) {
        shiftsEnabled = Number(plan.max_shifts) > 1 ? 1 : 0;
      }

      await env.DB.prepare(`
        UPDATE profiles_institution
        SET plan_id = ?,
            plan_name = ?,
            plan_billing_cycle = ?,
            plan_price_taka = ?,
            max_teachers = ?,
            max_subjects = ?,
            max_routines_yearly = ?,
            max_shifts = ?,
            allow_teacher_dashboard = ?,
            shifts_enabled = ?
        WHERE id = ?
      `).bind(
        plan.id,
        plan.name,
        plan.billing_cycle,
        plan.price_taka,
        plan.max_teachers !== null && plan.max_teachers !== undefined ? Number(plan.max_teachers) : null,
        plan.max_subjects !== null && plan.max_subjects !== undefined ? Number(plan.max_subjects) : null,
        plan.max_routines_yearly !== null && plan.max_routines_yearly !== undefined ? Number(plan.max_routines_yearly) : null,
        plan.max_shifts !== null && plan.max_shifts !== undefined ? Number(plan.max_shifts) : null,
        plan.allow_teacher_dashboard ? 1 : 0,
        shiftsEnabled,
        schoolId
      ).run();

      await env.DB.prepare("UPDATE auth_accounts SET is_active = 1 WHERE id = ?")
        .bind(schoolRow.auth_id).run();

      if (shiftsEnabled) {
        await ensureScheduleConfigWithShifts(env, schoolId);
      }

      return jsonResponse({
        success: true,
        is_active: 1,
        plan: {
          id: plan.id,
          name: plan.name,
          billing_cycle: plan.billing_cycle,
          price_taka: plan.price_taka,
          max_teachers: plan.max_teachers,
          max_subjects: plan.max_subjects,
          max_routines_yearly: plan.max_routines_yearly,
          max_shifts: plan.max_shifts,
          allow_teacher_dashboard: plan.allow_teacher_dashboard ? 1 : 0
        }
      });
    } catch (e) {
      if (e.message && (e.message.includes("no such table") || e.message.includes("no such column"))) {
        await syncDatabase(env);
        return jsonResponse({ error: "Database updated. Please retry." }, 500);
      }
      return jsonResponse({ error: e.message }, 500);
    }
  }

  if (url.pathname === '/admin/school/membership-limits') {
    if (request.method !== 'POST') {
      return jsonResponse({ error: "Invalid method" }, 405);
    }
    try {
      const body = await request.json();
      const schoolId = Number(body.school_id);
      if (!schoolId) return jsonResponse({ error: "School ID required" }, 400);

      const schoolRow = await env.DB.prepare("SELECT plan_id FROM profiles_institution WHERE id = ?").bind(schoolId).first();
      if (!schoolRow?.plan_id) return jsonResponse({ error: "Assign a membership before editing limits." }, 400);

      const parseLimit = (value, minValue) => {
        if (value === null || value === undefined) return null;
        const text = String(value).trim();
        if (text === '') return null;
        const num = Number(text);
        if (!Number.isFinite(num) || num < minValue) return null;
        return num;
      };

      const maxTeachers = parseLimit(body.max_teachers, 0);
      const maxSubjects = parseLimit(body.max_subjects, 0);
      const maxRoutinesYearly = parseLimit(body.max_routines_yearly, 0);
      const maxShifts = parseLimit(body.max_shifts, 1);

      await env.DB.prepare(`
        UPDATE profiles_institution
        SET max_teachers = ?,
            max_subjects = ?,
            max_routines_yearly = ?,
            max_shifts = ?
        WHERE id = ?
      `).bind(
        maxTeachers,
        maxSubjects,
        maxRoutinesYearly,
        maxShifts,
        schoolId
      ).run();

      return jsonResponse({
        success: true,
        limits: {
          max_teachers: maxTeachers,
          max_subjects: maxSubjects,
          max_routines_yearly: maxRoutinesYearly,
          max_shifts: maxShifts
        }
      });
    } catch (e) {
      if (e.message && (e.message.includes("no such table") || e.message.includes("no such column"))) {
        await syncDatabase(env);
        return jsonResponse({ error: "Database updated. Please retry." }, 500);
      }
      return jsonResponse({ error: e.message }, 500);
    }
  }

  
  if (url.pathname === '/admin/school/shifts') {
    if (request.method !== 'POST') {
      return jsonResponse({ error: "Invalid method" }, 405);
    }
    try {
      const body = await request.json();
      const schoolId = body.school_id;
      if (!schoolId) return jsonResponse({ error: "School ID required" }, 400);

      if (body.action === 'set_enabled') {
        const enabled = body.enabled ? 1 : 0;
        await env.DB.prepare("UPDATE profiles_institution SET shifts_enabled = ? WHERE id = ?").bind(enabled, schoolId).run();
        if (enabled) {
          await ensureScheduleConfigWithShifts(env, schoolId);
        }
        return jsonResponse({ success: true });
      }

      const scheduleConfig = await ensureScheduleConfigWithShifts(env, schoolId);
      let shiftList = parseShiftList(scheduleConfig?.shifts_json);

      if (body.action === 'add_shift') {
        const rawName = (body.shift_name || '').toString().trim();
        if (!rawName) return jsonResponse({ error: "Shift name required" }, 400);
        if (rawName.toLowerCase() === 'full day') return jsonResponse({ error: "Full Day is reserved" }, 400);
        try {
          const schoolRow = await env.DB.prepare("SELECT max_shifts FROM profiles_institution WHERE id = ?").bind(schoolId).first();
          const maxShifts = schoolRow?.max_shifts;
          if (maxShifts !== null && maxShifts !== undefined) {
            const currentCount = Array.from(new Set(shiftList)).length;
            if (currentCount + 1 > Number(maxShifts)) {
              return jsonResponse({ error: "Shift limit reached. Upgrade membership to add more shifts." }, 403);
            }
          }
        } catch (e) {}
        if (!shiftList.includes(rawName)) {
          const previousShiftList = shiftList.slice();
          shiftList.push(rawName);
          await env.DB.prepare("UPDATE schedule_config SET shifts_json = ? WHERE school_id = ?")
            .bind(JSON.stringify(shiftList), schoolId).run();
          await addShiftToSlots(env, schoolId, rawName, previousShiftList);
        }
        return jsonResponse({ success: true, shifts: shiftList });
      }

      if (body.action === 'remove_shift') {
        const rawName = (body.shift_name || '').toString().trim();
        if (!rawName) return jsonResponse({ error: "Shift name required" }, 400);
        if (rawName.toLowerCase() === 'full day') return jsonResponse({ error: "Full Day cannot be removed" }, 400);
        shiftList = shiftList.filter(name => name !== rawName);
        if (!shiftList.length) shiftList = ['Full Day'];
        if (!shiftList.includes('Full Day')) shiftList.unshift('Full Day');
        await env.DB.prepare("UPDATE schedule_config SET shifts_json = ? WHERE school_id = ?")
          .bind(JSON.stringify(shiftList), schoolId).run();
        await env.DB.prepare("UPDATE academic_classes SET shift_name = 'Full Day' WHERE school_id = ? AND shift_name = ?")
          .bind(schoolId, rawName).run();
        await removeShiftFromSlots(env, schoolId, rawName, shiftList);
        return jsonResponse({ success: true, shifts: shiftList });
      }

      return jsonResponse({ error: "Invalid action" }, 400);
    } catch (e) {
      if (e.message && (e.message.includes("no such table") || e.message.includes("no such column"))) {
        await syncDatabase(env);
        return jsonResponse({ error: "Database updated. Please retry." }, 500);
      }
      return jsonResponse({ error: e.message }, 500);
    }
  }

  
  if (url.pathname === '/admin/school/teachers') {
      if(request.method === 'POST') {
          const body = await request.json();
          if(body.action === 'update_limit') {
              return jsonResponse({ error: "Limits are managed through membership policies." }, 400);
          }
      }
      const authId = url.searchParams.get('id');
      const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
      const teachers = await env.DB.prepare("SELECT * FROM profiles_teacher WHERE school_id = ?").bind(school.id).all();
      const teacherSubjects = await env.DB.prepare(`
          SELECT ts.teacher_id, ts.is_primary, sub.subject_name
          FROM teacher_subjects ts
          JOIN academic_subjects sub ON ts.subject_id = sub.id
          WHERE ts.school_id = ?
          ORDER BY ts.is_primary DESC, sub.subject_name ASC
      `).bind(school.id).all();
      const teacherAssignmentSubjects = await env.DB.prepare(`
          SELECT DISTINCT ta.teacher_id, sub.subject_name
          FROM teacher_assignments ta
          JOIN academic_subjects sub ON ta.subject_id = sub.id
          WHERE ta.school_id = ? AND ta.teacher_id IS NOT NULL
          ORDER BY sub.subject_name ASC
      `).bind(school.id).all();
      
      const subjectsByTeacher = {};
      (teacherSubjects.results || []).forEach(ts => {
          if (!subjectsByTeacher[ts.teacher_id]) {
              subjectsByTeacher[ts.teacher_id] = { primary: [], additional: [] };
          }
          if (ts.is_primary === 1) subjectsByTeacher[ts.teacher_id].primary.push(ts.subject_name);
          else subjectsByTeacher[ts.teacher_id].additional.push(ts.subject_name);
      });
      const assignmentSubjectsByTeacher = {};
      (teacherAssignmentSubjects.results || []).forEach(row => {
          if (!assignmentSubjectsByTeacher[row.teacher_id]) {
              assignmentSubjectsByTeacher[row.teacher_id] = [];
          }
          assignmentSubjectsByTeacher[row.teacher_id].push(row.subject_name);
      });
      
      const teachersWithSubjects = (teachers.results || []).map(t => {
          const entry = subjectsByTeacher[t.id];
          const assignmentList = assignmentSubjectsByTeacher[t.id] || [];
          const subjectSet = new Set();
          const ordered = [];
          if (entry) {
              entry.primary.forEach(name => {
                  if (!subjectSet.has(name)) {
                      subjectSet.add(name);
                      ordered.push(name);
                  }
              });
              entry.additional.forEach(name => {
                  if (!subjectSet.has(name)) {
                      subjectSet.add(name);
                      ordered.push(name);
                  }
              });
          }
          assignmentList.forEach(name => {
              if (!subjectSet.has(name)) {
                  subjectSet.add(name);
                  ordered.push(name);
              }
          });
          const subjectText = ordered.length ? ordered.join(', ') : '-';
          return { ...t, subject: subjectText };
      });
      
      return htmlResponse(AdminLayout(SchoolTeachersHTML(school, teachersWithSubjects), "Teachers", companyName, {email}));
  }

  
  if (url.pathname === '/admin/school/classes') {
      if(request.method === 'POST') {
          try {
              const body = await request.json();
              
              if(body.action === 'create_class') {
                  
                  const shiftName = (body.shift_name || 'Full Day').toString().trim() || 'Full Day';
                  let insertResult;
                  try {
                      insertResult = await env.DB.prepare("INSERT INTO academic_classes (school_id, class_name, has_groups, shift_name) VALUES (?, ?, ?, ?)")
                          .bind(body.school_id, body.class_name, body.has_groups ? 1 : 0, shiftName).run();
                  } catch (e) {
                      if (e.message && e.message.includes("no such column")) {
                          await syncDatabase(env);
                          insertResult = await env.DB.prepare("INSERT INTO academic_classes (school_id, class_name, has_groups, shift_name) VALUES (?, ?, ?, ?)")
                              .bind(body.school_id, body.class_name, body.has_groups ? 1 : 0, shiftName).run();
                      } else {
                          throw e;
                      }
                  }
                  const classId = insertResult?.meta?.last_row_id;
                  return jsonResponse({
                      success: true,
                      class: {
                          id: classId,
                          class_name: body.class_name,
                          has_groups: body.has_groups ? 1 : 0,
                          shift_name: shiftName
                      }
                  });
              }
              
              if(body.action === 'edit_class') {
                  
                  const shiftName = (body.shift_name || '').toString().trim();
                  if (shiftName) {
                      await env.DB.prepare("UPDATE academic_classes SET class_name = ?, has_groups = ?, shift_name = ? WHERE id = ? AND school_id = ?")
                          .bind(body.class_name, body.has_groups ? 1 : 0, shiftName, body.class_id, body.school_id).run();
                  } else {
                      await env.DB.prepare("UPDATE academic_classes SET class_name = ?, has_groups = ? WHERE id = ? AND school_id = ?")
                          .bind(body.class_name, body.has_groups ? 1 : 0, body.class_id, body.school_id).run();
                  }
                  return jsonResponse({success:true});
              }
              
              if(body.action === 'add_group') {
                  
                  const insertResult = await env.DB.prepare("INSERT INTO class_groups (school_id, class_id, group_name) VALUES (?, ?, ?)")
                      .bind(body.school_id, body.class_id, body.group_name).run();
                  return jsonResponse({
                      success: true,
                      group: {
                          id: insertResult?.meta?.last_row_id,
                          class_id: body.class_id,
                          group_name: body.group_name
                      }
                  });
              }
              
              if(body.action === 'edit_group') {
                  
                  await env.DB.prepare("UPDATE class_groups SET group_name = ? WHERE id = ? AND school_id = ?")
                      .bind(body.group_name, body.group_id, body.school_id).run();
                  return jsonResponse({success:true});
              }
              
              if(body.action === 'add_section') {
                  
                  const insertResult = await env.DB.prepare("INSERT INTO class_sections (school_id, class_id, group_id, section_name) VALUES (?, ?, ?, ?)")
                      .bind(body.school_id, body.class_id, body.group_id || null, body.section_name).run();
                  return jsonResponse({
                      success: true,
                      section: {
                          id: insertResult?.meta?.last_row_id,
                          class_id: body.class_id,
                          group_id: body.group_id || null,
                          section_name: body.section_name
                      }
                  });
              }
              
              if(body.action === 'edit_section') {
                  
                  await env.DB.prepare("UPDATE class_sections SET section_name = ? WHERE id = ? AND school_id = ?")
                      .bind(body.section_name, body.section_id, body.school_id).run();
                  return jsonResponse({success:true});
              }
          } catch(e) {
              console.error('Classes API Error:', e);
              
              if(e.message.includes("no such table")) {
                  await syncDatabase(env);
                  return jsonResponse({error: "Database tables are being created. Please try again in a moment."}, 500);
              }
              return jsonResponse({error: e.message}, 500);
          }
      }
      
      if(request.method === 'DELETE') {
          const body = await request.json();
          
          if(body.action === 'delete_class') {
              
              await forceDeleteClass(env, body.id, body.school_id);
              return jsonResponse({success:true});
          }
          
          if(body.action === 'delete_group') {
              
              await forceDeleteGroup(env, body.id, body.school_id);
              return jsonResponse({success:true});
          }
          
          if(body.action === 'delete_section') {
              
              await forceDeleteSection(env, body.id, body.school_id);
              return jsonResponse({success:true});
          }
      }
      
      const authId = url.searchParams.get('id');
      const school = await env.DB.prepare(`SELECT * FROM profiles_institution WHERE auth_id = ?`).bind(authId).first();
      
      
      const classes = await env.DB.prepare("SELECT * FROM academic_classes WHERE school_id = ? ORDER BY class_name ASC").bind(school.id).all();
      const groups = await env.DB.prepare("SELECT * FROM class_groups WHERE school_id = ? ORDER BY class_id, group_name").bind(school.id).all();
      const sections = await env.DB.prepare("SELECT * FROM class_sections WHERE school_id = ? ORDER BY class_id, section_name").bind(school.id).all();
      let shiftConfig = { enabled: !!school.shifts_enabled, shifts: ['Full Day'] };
      try {
          const scheduleConfig = await env.DB.prepare("SELECT shifts_json FROM schedule_config WHERE school_id = ?").bind(school.id).first();
          shiftConfig.shifts = parseShiftList(scheduleConfig?.shifts_json);
      } catch (e) {}
      
      return htmlResponse(AdminLayout(
        SchoolClassesHTML(
          school, 
          classes.results, 
          groups.results, 
          sections.results,
          shiftConfig
        ), 
        "Classes", 
        companyName, 
        {email}
      ));
  }

  
  async function checkClassDependencies(env, classId, schoolId) {
      const details = [];
      let hasDependencies = false;
      
      
      const sections = await env.DB.prepare("SELECT COUNT(*) as count FROM class_sections WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(sections.count > 0) {
          details.push({type: 'sections', count: sections.count, message: `${sections.count} section(s)`});
          hasDependencies = true;
      }
      
      
      const groups = await env.DB.prepare("SELECT COUNT(*) as count FROM class_groups WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(groups.count > 0) {
          details.push({type: 'groups', count: groups.count, message: `${groups.count} group(s)`});
          hasDependencies = true;
      }
      
      
      const subjects = await env.DB.prepare("SELECT COUNT(*) as count FROM class_subjects WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(subjects.count > 0) {
          details.push({type: 'subjects', count: subjects.count, message: `${subjects.count} subject assignment(s)`});
          hasDependencies = true;
      }
      
      
      const teachers = await env.DB.prepare("SELECT COUNT(*) as count FROM teacher_assignments WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(teachers.count > 0) {
          details.push({type: 'teachers', count: teachers.count, message: `${teachers.count} teacher assignment(s)`});
          hasDependencies = true;
      }
      
      
      const routines = await env.DB.prepare("SELECT COUNT(*) as count FROM routine_entries WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).first();
      if(routines.count > 0) {
          details.push({type: 'routines', count: routines.count, message: `${routines.count} routine entrie(s)`});
          hasDependencies = true;
      }
      
      return { hasDependencies, details };
  }
  
  async function checkGroupDependencies(env, groupId, schoolId) {
      const details = [];
      let hasDependencies = false;
      
      
      const sections = await env.DB.prepare("SELECT COUNT(*) as count FROM class_sections WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).first();
      if(sections.count > 0) {
          details.push({type: 'sections', count: sections.count, message: `${sections.count} section(s)`});
          hasDependencies = true;
      }
      
      
      const subjects = await env.DB.prepare("SELECT COUNT(*) as count FROM group_subjects WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).first();
      if(subjects.count > 0) {
          details.push({type: 'subjects', count: subjects.count, message: `${subjects.count} subject assignment(s)`});
          hasDependencies = true;
      }
      
      
      const teachers = await env.DB.prepare("SELECT COUNT(*) as count FROM teacher_assignments WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).first();
      if(teachers.count > 0) {
          details.push({type: 'teachers', count: teachers.count, message: `${teachers.count} teacher assignment(s)`});
          hasDependencies = true;
      }
      
      
      const routines = await env.DB.prepare("SELECT COUNT(*) as count FROM routine_entries WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).first();
      if(routines.count > 0) {
          details.push({type: 'routines', count: routines.count, message: `${routines.count} routine entrie(s)`});
          hasDependencies = true;
      }
      
      return { hasDependencies, details };
  }
  
  async function checkSectionDependencies(env, sectionId, schoolId) {
      const details = [];
      let hasDependencies = false;
      
      
      const teachers = await env.DB.prepare("SELECT COUNT(*) as count FROM teacher_assignments WHERE section_id = ? AND school_id = ?").bind(sectionId, schoolId).first();
      if(teachers.count > 0) {
          details.push({type: 'teachers', count: teachers.count, message: `${teachers.count} teacher assignment(s)`});
          hasDependencies = true;
      }
      
      
      const routines = await env.DB.prepare("SELECT COUNT(*) as count FROM routine_entries WHERE section_id = ? AND school_id = ?").bind(sectionId, schoolId).first();
      if(routines.count > 0) {
          details.push({type: 'routines', count: routines.count, message: `${routines.count} routine entrie(s)`});
          hasDependencies = true;
      }
      
      return { hasDependencies, details };
  }
  
  async function forceDeleteClass(env, classId, schoolId) {
      
      await env.DB.prepare("DELETE FROM routine_entries WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM teacher_assignments WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_subjects WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_sections WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_groups WHERE class_id = ? AND school_id = ?").bind(classId, schoolId).run();
      await env.DB.prepare("DELETE FROM academic_classes WHERE id = ? AND school_id = ?").bind(classId, schoolId).run();
  }
  
  async function forceDeleteGroup(env, groupId, schoolId) {
      await env.DB.prepare("DELETE FROM routine_entries WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).run();
      await env.DB.prepare("DELETE FROM teacher_assignments WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).run();
      await env.DB.prepare("DELETE FROM group_subjects WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_sections WHERE group_id = ? AND school_id = ?").bind(groupId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_groups WHERE id = ? AND school_id = ?").bind(groupId, schoolId).run();
  }
  
  async function forceDeleteSection(env, sectionId, schoolId) {
      await env.DB.prepare("DELETE FROM routine_entries WHERE section_id = ? AND school_id = ?").bind(sectionId, schoolId).run();
      await env.DB.prepare("DELETE FROM teacher_assignments WHERE section_id = ? AND school_id = ?").bind(sectionId, schoolId).run();
      await env.DB.prepare("DELETE FROM class_sections WHERE id = ? AND school_id = ?").bind(sectionId, schoolId).run();
  }

  function parseShiftList(raw) {
      if (!raw) return ['Full Day'];
      try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length) {
              const cleaned = parsed
                  .map(item => String(item).trim())
                  .filter(Boolean)
                  .filter(name => name.toLowerCase() !== 'standard');
              if (!cleaned.includes('Full Day')) cleaned.unshift('Full Day');
              return Array.from(new Set(cleaned));
          }
      } catch (e) {}
      return ['Full Day'];
  }

  function parseApplicableShifts(raw, shiftList) {
      if (!raw) return shiftList.slice();
      let parsed = [];
      if (Array.isArray(raw)) {
          parsed = raw;
      } else if (typeof raw === 'string') {
          try {
              parsed = JSON.parse(raw);
          } catch (e) {
              parsed = raw ? [raw] : [];
          }
      }
      if (!Array.isArray(parsed)) parsed = [];
      if (!parsed.length || parsed.includes('all')) return shiftList.slice();
      const filtered = parsed.filter(name => shiftList.includes(name));
      const result = filtered.length ? filtered : shiftList.slice();
      const ordered = shiftList.filter(name => result.includes(name));
      if (ordered.length) {
          ordered.push(...result.filter(name => !ordered.includes(name)));
      }
      const finalList = ordered.length ? ordered : result.slice();
      if (shiftList.includes('Full Day') && !finalList.includes('Full Day')) {
          finalList.unshift('Full Day');
      }
      return finalList;
  }

  async function ensureScheduleConfigWithShifts(env, schoolId) {
      let config = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(schoolId).first();
      if (!config) {
          await env.DB.prepare("INSERT INTO schedule_config (school_id, active_days, periods_per_day, working_days, off_days, shifts_json) VALUES (?, ?, ?, ?, ?, ?)")
              .bind(schoolId, 5, 8, '["monday","tuesday","wednesday","thursday","friday"]', '["saturday","sunday"]', '["Full Day"]').run();
          config = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(schoolId).first();
      } else {
          const cleaned = parseShiftList(config.shifts_json);
          const normalized = JSON.stringify(cleaned);
          if (!config.shifts_json || config.shifts_json !== normalized) {
              await env.DB.prepare("UPDATE schedule_config SET shifts_json = ? WHERE school_id = ?")
                  .bind(normalized, schoolId).run();
              config = await env.DB.prepare("SELECT * FROM schedule_config WHERE school_id = ?").bind(schoolId).first();
          }
      }
      return config;
  }

  async function addShiftToSlots(env, schoolId, shiftName, previousShiftList) {
      const slots = await env.DB.prepare("SELECT id, applicable_shifts FROM schedule_slots WHERE school_id = ?").bind(schoolId).all();
      for (const slot of slots.results || []) {
          const shifts = parseApplicableShifts(slot.applicable_shifts, previousShiftList);
          if (!shifts.includes(shiftName)) shifts.push(shiftName);
          await env.DB.prepare("UPDATE schedule_slots SET applicable_shifts = ? WHERE id = ?")
              .bind(JSON.stringify(shifts), slot.id).run();
      }
  }

  async function removeShiftFromSlots(env, schoolId, shiftName, shiftList) {
      const slots = await env.DB.prepare("SELECT id, applicable_shifts FROM schedule_slots WHERE school_id = ?").bind(schoolId).all();
      for (const slot of slots.results || []) {
          const shifts = parseApplicableShifts(slot.applicable_shifts, shiftList.concat([shiftName]));
          const filtered = shifts.filter(name => name !== shiftName);
          const updated = filtered.length ? filtered : shiftList.slice();
          await env.DB.prepare("UPDATE schedule_slots SET applicable_shifts = ? WHERE id = ?")
              .bind(JSON.stringify(updated), slot.id).run();
      }
  }

  
  if (url.pathname === '/admin/setup') {
    try { await syncDatabase(env); } catch (e) {}
    if (request.method === 'POST') {
        const { email, password } = await request.json();
        const { hash, salt } = await hashPassword(password);
        await env.DB.prepare("INSERT INTO auth_accounts (email, password_hash, salt, role) VALUES (?, ?, ?, ?)").bind(email, hash, salt, ROLES.ADMIN).run();
        return jsonResponse({ success: true });
    }
    return htmlResponse(ADMIN_SETUP_HTML);
  }

  return new Response("Page Not Found", { status: 404 });
}
