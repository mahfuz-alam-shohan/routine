// Routine Generator JavaScript
window.RoutineGeneratorApp = function() {
    return {
        // Main functions
        async generateRoutine() {
            const button = event.target;
            const originalText = button.innerHTML;
            
            try {
                button.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Generating...';
                button.disabled = true;
                
                const response = await fetch('/school/api/generate-routine', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: `Generated Routine ${new Date().toLocaleDateString()}`
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    this.showNotification('Routine generated successfully!', 'success');
                    
                    // Reload page to show new routine
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    this.showNotification(result.error || 'Failed to generate routine', 'error');
                }
            } catch (error) {
                console.error('Generation error:', error);
                this.showNotification('An error occurred while generating routine', 'error');
            } finally {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        },
        
        viewRoutine(routineId) {
            window.location.href = `/school/routine-viewer?id=${routineId}`;
        },
        
        async editRoutine(routineId) {
            // For now, redirect to viewer - you can add edit functionality later
            this.viewRoutine(routineId);
        },
        
        async activateRoutine(routineId) {
            try {
                const response = await fetch(`/school/api/routine/${routineId}/activate`, {
                    method: 'POST'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.showNotification('Routine activated successfully!', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    this.showNotification(result.error || 'Failed to activate routine', 'error');
                }
            } catch (error) {
                console.error('Activation error:', error);
                this.showNotification('An error occurred while activating routine', 'error');
            }
        },
        
        async deleteRoutine(routineId) {
            if (!confirm('Are you sure you want to delete this routine? This action cannot be undone.')) {
                return;
            }
            
            try {
                const response = await fetch(`/school/api/routine/${routineId}`, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.showNotification('Routine deleted successfully!', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    this.showNotification(result.error || 'Failed to delete routine', 'error');
                }
            } catch (error) {
                console.error('Deletion error:', error);
                this.showNotification('An error occurred while deleting routine', 'error');
            }
        },
        
        showSettings() {
            document.getElementById('settings-modal').classList.remove('hidden');
            document.getElementById('settings-modal').classList.add('flex');
        },
        
        closeSettings() {
            document.getElementById('settings-modal').classList.add('hidden');
            document.getElementById('settings-modal').classList.remove('flex');
        },
        
        async saveSettings() {
            try {
                const settings = {
                    prefer_same_teacher_consecutive: document.getElementById('prefer-consecutive').checked,
                    avoid_teacher_duplicates: document.getElementById('avoid-duplicates').checked,
                    balance_subject_distribution: document.getElementById('balance-distribution').checked,
                    respect_preferred_times: document.getElementById('respect-preferences').checked,
                    auto_resolve_conflicts: document.getElementById('auto-resolve').checked,
                    allow_split_periods: document.getElementById('allow-split').checked,
                    max_teacher_daily_periods: parseInt(document.getElementById('max-periods').value),
                    break_between_same_subject: parseInt(document.getElementById('subject-break').value)
                };
                
                const response = await fetch('/school/api/generation-settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(settings)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    this.showNotification('Settings saved successfully!', 'success');
                    this.closeSettings();
                } else {
                    this.showNotification(result.error || 'Failed to save settings', 'error');
                }
            } catch (error) {
                console.error('Settings save error:', error);
                this.showNotification('An error occurred while saving settings', 'error');
            }
        },
        
        showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
            
            // Set color based on type
            if (type === 'success') {
                notification.classList.add('bg-green-500', 'text-white');
            } else if (type === 'error') {
                notification.classList.add('bg-red-500', 'text-white');
            } else {
                notification.classList.add('bg-blue-500', 'text-white');
            }
            
            notification.innerHTML = `
                <div class="flex items-center">
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
                notification.classList.add('translate-x-0');
            }, 100);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }, 5000);
        }
    };
};

// Routine Viewer JavaScript
window.RoutineViewerApp = function() {
    return {
        backToList() {
            window.location.href = '/school/routine-generator';
        },
        
        exportPDF() {
            // Simple print to PDF functionality
            window.print();
        },
        
        printRoutine() {
            window.print();
        },
        
        filterByClass(classId) {
            const allEntries = document.querySelectorAll('[data-class-id]');
            
            if (classId === 'all') {
                allEntries.forEach(entry => {
                    entry.style.display = '';
                });
            } else {
                allEntries.forEach(entry => {
                    if (entry.dataset.classId === classId) {
                        entry.style.display = '';
                    } else {
                        entry.style.display = 'none';
                    }
                });
            }
        },
        
        showEntryDetails(entryId) {
            // Find entry data (you'd need to store this somewhere)
            // For now, show a placeholder
            const modal = document.getElementById('entry-modal');
            const details = document.getElementById('entry-details');
            
            details.innerHTML = `
                <div class="space-y-3">
                    <div>
                        <label class="text-sm font-medium text-gray-500">Class</label>
                        <p class="text-gray-900">Class 10 - Section A</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Subject</label>
                        <p class="text-gray-900">Mathematics</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Teacher</label>
                        <p class="text-gray-900">John Doe</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Time</label>
                        <p class="text-gray-900">09:00 AM - 09:45 AM</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-500">Room</label>
                        <p class="text-gray-900">Room 101</p>
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        },
        
        closeEntryModal() {
            const modal = document.getElementById('entry-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on and initialize appropriate app
    if (window.location.pathname === '/school/routine-generator') {
        window.app = new RoutineGeneratorApp();
    } else if (window.location.pathname === '/school/routine-viewer') {
        window.app = new RoutineViewerApp();
    }
});
