// src/ui/institute/teachers.js - COMPLETE REFACTOR: New Architecture & Design System

const TeacherManager = {
    // State management
    state: {
        teachers: [],
        subjects: [],
        teacherSubjects: [],
        loading: false,
        searchQuery: '',
        selectedTeacher: null,
        modalOpen: false
    },

    // Initialize the module
    init(school, teachers, subjects, teacherSubjects) {
        this.state.school = school;
        this.state.teachers = teachers;
        this.state.subjects = subjects;
        this.state.teacherSubjects = teacherSubjects;
        this.bindEvents();
        this.render();
    },

    // Event binding
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="add-teacher"]')) {
                this.showAddTeacherForm();
            }
            if (e.target.matches('[data-action="edit-subjects"]')) {
                const teacherId = e.target.dataset.teacherId;
                const teacherName = e.target.dataset.teacherName;
                this.openSubjectEditor(teacherId, teacherName);
            }
            if (e.target.matches('[data-action="remove-teacher"]')) {
                const teacherId = e.target.dataset.teacherId;
                this.removeTeacher(teacherId);
            }
            if (e.target.matches('[data-action="close-modal"]')) {
                this.closeModal();
            }
        });

        document.addEventListener('submit', (e) => {
            if (e.target.matches('#teacher-form')) {
                e.preventDefault();
                this.handleAddTeacher(e);
            }
            if (e.target.matches('#subject-form')) {
                e.preventDefault();
                this.handleSubjectAssignment(e);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.matches('#teacher-search')) {
                this.handleSearch(e.target.value);
            }
            if (e.target.matches('#subject-search')) {
                this.handleSubjectSearch(e.target.value);
            }
        });
    },

    // Rendering engine
    render() {
        const container = document.getElementById('teacher-management');
        if (!container) return;

        container.innerHTML = this.getMainHTML();
        this.attachComponentScripts();
    },

    getMainHTML() {
        const { teachers, subjects, teacherSubjects, searchQuery } = this.state;
        
        // Filter teachers based on search
        const filteredTeachers = teachers.filter(teacher => 
            teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return `
            <div class="teacher-management-system">
                ${this.getHeaderHTML()}
                ${this.getSearchHTML()}
                ${this.getTeachersTableHTML(filteredTeachers)}
                ${this.getModalsHTML()}
            </div>
        `;
    },

    getHeaderHTML() {
        return `
            <header class="module-header">
                <div class="header-content">
                    <div class="header-text">
                        <h1 class="module-title">Teacher Management</h1>
                        <p class="module-subtitle">Manage teaching staff and subject assignments</p>
                    </div>
                    <div class="header-actions">
                        <button data-action="add-teacher" class="btn btn-primary">
                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Add Teacher
                        </button>
                    </div>
                </div>
            </header>
        `;
    },

    getSearchHTML() {
        return `
            <div class="search-section">
                <div class="search-container">
                    <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input 
                        type="text" 
                        id="teacher-search" 
                        placeholder="Search teachers by name or email..."
                        class="search-input"
                    >
                </div>
            </div>
        `;
    },

    getTeachersTableHTML(teachers) {
        if (teachers.length === 0) {
            return this.getEmptyStateHTML();
        }

        return `
            <div class="teachers-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Teacher Information</th>
                            <th>Assigned Subjects</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${teachers.map(teacher => this.getTeacherRowHTML(teacher)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    getTeacherRowHTML(teacher) {
        const subjects = this.getTeacherSubjects(teacher.id);
        const primarySubject = subjects.find(s => s.is_primary === 1);
        const additionalSubjects = subjects.filter(s => s.is_primary === 0);

        return `
            <tr class="data-row" data-teacher-id="${teacher.id}">
                <td class="teacher-info">
                    <div class="teacher-avatar">
                        ${teacher.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div class="teacher-details">
                        <div class="teacher-name">${teacher.full_name}</div>
                        <div class="teacher-email">${teacher.email}</div>
                        <div class="teacher-phone">${teacher.phone}</div>
                    </div>
                </td>
                <td class="subjects-cell">
                    <div class="subjects-list">
                        ${primarySubject ? `
                            <span class="subject-badge primary">
                                <span class="badge-icon">🎯</span>
                                ${primarySubject.subject_name}
                            </span>
                        ` : '<span class="no-subject">No primary subject</span>'}
                        ${additionalSubjects.map(subject => `
                            <span class="subject-badge secondary">
                                ${subject.subject_name}
                            </span>
                        `).join('')}
                    </div>
                </td>
                <td class="actions-cell">
                    <div class="action-buttons">
                        <button 
                            data-action="edit-subjects"
                            data-teacher-id="${teacher.id}"
                            data-teacher-name="${teacher.full_name.replace(/'/g, "\\'")}"
                            class="btn btn-sm btn-outline"
                        >
                            <svg class="btn-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit Subjects
                        </button>
                        <button 
                            data-action="remove-teacher"
                            data-teacher-id="${teacher.id}"
                            class="btn btn-sm btn-danger"
                        >
                            <svg class="btn-icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Remove
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-state-content">
                    <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-12h13a6 6 0 016 12v1m-18 0V7a4 4 0 114 0h4a2 2 0 012 2v1a2 2 0 002 2h4a2 2 0 002-2V9a2 2 0 00-2-2h-4a2 2 0 00-2 2v-1z"></path>
                    </svg>
                    <h3 class="empty-state-title">No Teachers Found</h3>
                    <p class="empty-state-description">
                        ${this.state.searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first teacher'}
                    </p>
                    ${!this.state.searchQuery ? `
                        <button data-action="add-teacher" class="btn btn-primary">
                            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Add Your First Teacher
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    getModalsHTML() {
        return `
            ${this.getAddTeacherModalHTML()}
            ${this.getSubjectAssignmentModalHTML()}
        `;
    },

    getAddTeacherModalHTML() {
        return `
            <div id="add-teacher-modal" class="modal hidden">
                <div class="modal-backdrop" data-action="close-modal"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Add New Teacher</h2>
                        <button data-action="close-modal" class="modal-close">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <form id="teacher-form" class="modal-body">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Full Name *</label>
                                <input type="text" name="full_name" required class="form-input" placeholder="Enter teacher's full name">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email Address *</label>
                                <input type="email" name="email" required class="form-input" placeholder="teacher@school.edu">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number *</label>
                            <div class="phone-input-group">
                                <span class="phone-prefix">+880</span>
                                <input type="tel" name="phone_digits" required maxlength="10" pattern="[0-9]{10}" class="form-input" placeholder="1XXXXXXXXX">
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button type="submit" class="btn btn-primary">Add Teacher</button>
                            <button type="button" data-action="close-modal" class="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    getSubjectAssignmentModalHTML() {
        return `
            <div id="subject-modal" class="modal hidden">
                <div class="modal-backdrop" data-action="close-modal"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">Assign Subjects</h2>
                        <p class="modal-subtitle">For <span id="selected-teacher-name"></span></p>
                        <button data-action="close-modal" class="modal-close">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <form id="subject-form" class="modal-body">
                        <input type="hidden" name="teacher_id" id="subject-teacher-id">
                        <input type="hidden" name="primary_subject" id="selected-primary-subject">
                        
                        <div class="form-section">
                            <label class="form-label">Primary Subject *</label>
                            <div class="subject-selector">
                                <input 
                                    type="text" 
                                    id="subject-search" 
                                    class="form-input" 
                                    placeholder="Search and select primary subject..."
                                >
                                <div id="subject-dropdown" class="subject-dropdown hidden"></div>
                            </div>
                            <div id="primary-subject-display" class="selected-subject hidden">
                                <span class="subject-badge primary">
                                    <span class="badge-icon">🎯</span>
                                    <span id="primary-subject-name"></span>
                                    <button type="button" onclick="TeacherManager.clearPrimarySubject()" class="remove-btn">×</button>
                                </span>
                            </div>
                        </div>

                        <div class="form-section">
                            <label class="form-label">Additional Subjects</label>
                            <div class="subject-selector">
                                <input 
                                    type="text" 
                                    id="additional-search" 
                                    class="form-input" 
                                    placeholder="Search and add additional subjects..."
                                >
                                <div id="additional-dropdown" class="subject-dropdown hidden"></div>
                            </div>
                            <div id="additional-subjects-display" class="selected-subjects"></div>
                        </div>

                        <div class="modal-actions">
                            <button type="submit" class="btn btn-primary">Save Assignments</button>
                            <button type="button" data-action="close-modal" class="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    // Component scripts attachment
    attachComponentScripts() {
        // Initialize component-specific functionality
        this.initSubjectSearch();
        this.initAdditionalSearch();
    },

    // Data methods
    getTeacherSubjects(teacherId) {
        return this.state.teacherSubjects.filter(ts => ts.teacher_id === teacherId);
    },

    handleSearch(query) {
        this.state.searchQuery = query;
        this.render();
    },

    // Modal management
    showAddTeacherForm() {
        document.getElementById('add-teacher-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },

    openSubjectEditor(teacherId, teacherName) {
        document.getElementById('subject-teacher-id').value = teacherId;
        document.getElementById('selected-teacher-name').textContent = teacherName;
        document.getElementById('subject-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        this.loadCurrentSubjects(teacherId);
    },

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
        this.resetForms();
    },

    resetForms() {
        document.getElementById('teacher-form')?.reset();
        document.getElementById('subject-form')?.reset();
        this.clearPrimarySubject();
        this.clearAdditionalSubjects();
    },

    // Form handlers
    async handleAddTeacher(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const phoneDigits = data.phone_digits.replace(/\D/g, '');
        if (phoneDigits.length !== 10) {
            this.showError('Please enter a valid 10-digit phone number');
            return;
        }
        
        data.phone = '+880-' + phoneDigits;
        delete data.phone_digits;
        
        try {
            const response = await fetch('/school/teachers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            if (result.success) {
                this.closeModal();
                window.location.reload();
            } else {
                this.showError(result.error || 'Failed to add teacher');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        }
    },

    async handleSubjectAssignment(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (!document.getElementById('selected-primary-subject').value) {
            this.showError('Please select a primary subject');
            return;
        }
        
        data.action = 'assign_subjects';
        
        try {
            const response = await fetch('/school/teachers', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            if (result.success) {
                this.closeModal();
                window.location.reload();
            } else {
                this.showError(result.error || 'Failed to assign subjects');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        }
    },

    async removeTeacher(teacherId) {
        if (!confirm('Are you sure you want to remove this teacher? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await fetch('/school/teachers', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: teacherId})
            });
            
            const result = await response.json();
            if (result.success) {
                window.location.reload();
            } else {
                this.showError(result.error || 'Failed to remove teacher');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        }
    },

    // Subject search functionality
    initSubjectSearch() {
        const searchInput = document.getElementById('subject-search');
        
        searchInput?.addEventListener('input', (e) => {
            this.performSubjectSearch('primary', e.target.value);
        });
        
        searchInput?.addEventListener('focus', () => {
            if (searchInput.value) {
                this.performSubjectSearch('primary', searchInput.value);
            }
        });
    },

    initAdditionalSearch() {
        const searchInput = document.getElementById('additional-search');
        
        searchInput?.addEventListener('input', (e) => {
            this.performSubjectSearch('additional', e.target.value);
        });
        
        searchInput?.addEventListener('focus', () => {
            if (searchInput.value) {
                this.performSubjectSearch('additional', searchInput.value);
            }
        });
    },

    performSubjectSearch(type, query) {
        const dropdown = document.getElementById(type === 'primary' ? 'subject-dropdown' : 'additional-dropdown');
        const primarySubjectId = document.getElementById('selected-primary-subject').value;
        
        const filteredSubjects = this.state.subjects.filter(subject => {
            const matchesSearch = subject.subject_name.toLowerCase().includes(query.toLowerCase());
            if (type === 'primary') {
                return matchesSearch && subject.id != primarySubjectId;
            } else {
                return matchesSearch && subject.id != primarySubjectId;
            }
        });
        
        if (query && filteredSubjects.length > 0) {
            dropdown.innerHTML = filteredSubjects.map(subject => 
                '<div class="subject-option" onclick="TeacherManager.selectSubject(\'' + type + '\', ' + subject.id + ', \'' + subject.subject_name.replace(/'/g, "\\'") + '\')">' + 
                subject.subject_name + 
                '</div>'
            ).join('');
            dropdown.classList.remove('hidden');
        } else {
            dropdown.classList.add('hidden');
        }
    },

    selectSubject(type, id, name) {
        if (type === 'primary') {
            document.getElementById('selected-primary-subject').value = id;
            document.getElementById('primary-subject-name').textContent = name;
            document.getElementById('primary-subject-display').classList.remove('hidden');
            document.getElementById('subject-search').value = '';
            document.getElementById('subject-dropdown').classList.add('hidden');
        } else {
            this.addAdditionalSubject(id, name);
            document.getElementById('additional-search').value = '';
            document.getElementById('additional-dropdown').classList.add('hidden');
        }
    },

    clearPrimarySubject() {
        document.getElementById('selected-primary-subject').value = '';
        document.getElementById('primary-subject-display').classList.add('hidden');
        document.getElementById('subject-search').value = '';
    },

    addAdditionalSubject(id, name) {
        const display = document.getElementById('additional-subjects-display');
        const subjectBadge = document.createElement('span');
        subjectBadge.className = 'subject-badge secondary';
        subjectBadge.innerHTML = name + '<button type="button" onclick="TeacherManager.removeAdditionalSubject(' + id + ', this)" class="remove-btn">×</button>';
        display.appendChild(subjectBadge);
    },

    removeAdditionalSubject(id, button) {
        button.parentElement.remove();
    },

    clearAdditionalSubjects() {
        document.getElementById('additional-subjects-display').innerHTML = '';
    },

    loadCurrentSubjects(teacherId) {
        const subjects = this.getTeacherSubjects(teacherId);
        const primarySubject = subjects.find(s => s.is_primary === 1);
        const additionalSubjects = subjects.filter(s => s.is_primary === 0);
        
        // Load primary subject
        if (primarySubject) {
            document.getElementById('selected-primary-subject').value = primarySubject.subject_id;
            document.getElementById('primary-subject-name').textContent = primarySubject.subject_name;
            document.getElementById('primary-subject-display').classList.remove('hidden');
        }
        
        // Load additional subjects
        additionalSubjects.forEach(subject => {
            this.addAdditionalSubject(subject.subject_id, subject.subject_name);
        });
    },

    showError(message) {
        alert(message);
    }
};

// Export the main function
export function TeachersPageHTML(school, teachers, subjects, teacherSubjects) {
    return `
        <div id="teacher-management" class="module-container">
            <!-- CSS Styles -->
            <style>
                .teacher-management-system {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .module-header {
                    margin-bottom: 2rem;
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .module-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                }

                .module-subtitle {
                    color: #6b7280;
                    font-size: 1rem;
                }

                .search-section {
                    margin-bottom: 2rem;
                }

                .search-container {
                    position: relative;
                    max-width: 400px;
                }

                .search-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1.25rem;
                    height: 1.25rem;
                    color: #9ca3af;
                }

                .search-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 3rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    transition: border-color 0.15s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .teachers-table-container {
                    background: white;
                    border-radius: 0.75rem;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .data-table th {
                    background: #f9fafb;
                    padding: 1rem;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 1px solid #e5e7eb;
                }

                .data-table td {
                    padding: 1rem;
                    vertical-align: top;
                    border-bottom: 1px solid #f3f4f6;
                }

                .data-row:hover {
                    background: #f9fafb;
                }

                .teacher-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .teacher-avatar {
                    width: 3rem;
                    height: 3rem;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 1.125rem;
                }

                .teacher-name {
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.25rem;
                }

                .teacher-email {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin-bottom: 0.25rem;
                }

                .teacher-phone {
                    color: #9ca3af;
                    font-size: 0.875rem;
                }

                .subjects-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .subject-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .subject-badge.primary {
                    background: #dcfce7;
                    color: #166534;
                }

                .subject-badge.secondary {
                    background: #dbeafe;
                    color: #1d4ed8;
                }

                .badge-icon {
                    font-size: 0.875rem;
                }

                .no-subject {
                    color: #9ca3af;
                    font-size: 0.875rem;
                    font-style: italic;
                }

                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }

                .btn-primary {
                    background: #3b82f6;
                    color: white;
                }

                .btn-primary:hover {
                    background: #2563eb;
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .btn-outline {
                    background: white;
                    color: #3b82f6;
                    border: 1px solid #d1d5db;
                }

                .btn-outline:hover {
                    background: #f9fafb;
                    border-color: #3b82f6;
                }

                .btn-danger {
                    background: #fef2f2;
                    color: #dc2626;
                    border: 1px solid #fecaca;
                }

                .btn-danger:hover {
                    background: #fee2e2;
                }

                .btn-sm {
                    padding: 0.375rem 0.75rem;
                    font-size: 0.75rem;
                }

                .btn-icon {
                    width: 1rem;
                    height: 1rem;
                }

                .btn-icon-sm {
                    width: 0.875rem;
                    height: 0.875rem;
                }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: white;
                    border-radius: 0.75rem;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .empty-state-icon {
                    width: 4rem;
                    height: 4rem;
                    color: #d1d5db;
                    margin: 0 auto 1rem;
                }

                .empty-state-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                }

                .empty-state-description {
                    color: #6b7280;
                    margin-bottom: 1.5rem;
                }

                .modal {
                    position: fixed;
                    inset: 0;
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }

                .modal.hidden {
                    display: none;
                }

                .modal-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                }

                .modal-content {
                    position: relative;
                    background: white;
                    border-radius: 1rem;
                    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
                    max-width: 32rem;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.25rem;
                }

                .modal-subtitle {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .modal-close {
                    width: 2rem;
                    height: 2rem;
                    border: none;
                    background: none;
                    color: #6b7280;
                    cursor: pointer;
                    border-radius: 0.375rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-close:hover {
                    background: #f3f4f6;
                }

                .modal-body {
                    padding: 1.5rem;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .form-group {
                    margin-bottom: 1rem;
                }

                .form-section {
                    margin-bottom: 1.5rem;
                }

                .form-label {
                    display: block;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                }

                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    transition: border-color 0.15s ease;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .phone-input-group {
                    display: flex;
                    align-items: center;
                }

                .phone-prefix {
                    background: #f3f4f6;
                    color: #6b7280;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-right: none;
                    border-radius: 0.5rem 0 0 0.5rem;
                    font-size: 0.875rem;
                }

                .phone-input-group .form-input {
                    border-radius: 0 0.5rem 0.5rem 0;
                }

                .subject-selector {
                    position: relative;
                }

                .subject-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    margin-top: 0.25rem;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 10;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
                }

                .subject-option {
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: background-color 0.15s ease;
                }

                .subject-option:hover {
                    background: #f9fafb;
                }

                .selected-subject {
                    margin-top: 0.75rem;
                }

                .selected-subjects {
                    margin-top: 0.75rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .remove-btn {
                    background: none;
                    border: none;
                    color: inherit;
                    cursor: pointer;
                    font-size: 1rem;
                    line-height: 1;
                    padding: 0;
                    margin-left: 0.25rem;
                }

                .remove-btn:hover {
                    opacity: 0.7;
                }

                .modal-actions {
                    display: flex;
                    gap: 0.75rem;
                    padding-top: 1rem;
                    border-top: 1px solid #e5e7eb;
                }

                @media (max-width: 768px) {
                    .teacher-management-system {
                        padding: 1rem;
                    }

                    .header-content {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .action-buttons {
                        flex-direction: column;
                    }

                    .teacher-info {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }

                    .subjects-list {
                        flex-direction: column;
                    }
                }
            </style>

            <!-- Main Content -->
            <div class="teacher-management-system">
                ${this.getHeaderHTML()}
                ${this.getSearchHTML()}
                ${this.getTeachersTableHTML(teachers)}
                ${this.getModalsHTML()}
            </div>

            <!-- Initialize Module -->
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    TeacherManager.init(${JSON.stringify(school)}, ${JSON.stringify(teachers)}, ${JSON.stringify(subjects)}, ${JSON.stringify(teacherSubjects)});
                });
            </script>
        </div>
    `;
}
