export function PrintLayoutEditorHTML() {
    return `
    <div id="print-layout-editor-modal" class="fixed inset-0 z-50 hidden bg-gray-900 bg-opacity-50 overflow-y-auto">
        <div class="min-h-screen px-4 text-center">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span class="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

            <div class="inline-block w-full max-w-5xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div class="flex justify-between items-center pb-4 border-b border-gray-200">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">Print Layout Editor</h3>
                    <div class="flex items-center gap-2">
                         <span id="editor-status" class="text-sm text-green-600 hidden">Saved!</span>
                         <button onclick="window.PrintLayoutEditor.close()" class="text-gray-400 hover:text-gray-500">
                            <span class="sr-only">Close</span>
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 h-[70vh]">
                    <!-- Controls Sidebar -->
                    <div class="md:col-span-4 lg:col-span-3 overflow-y-auto pr-2 space-y-6">
                        
                        <!-- Layout Selection -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Saved Layouts</label>
                            <div class="flex gap-2">
                                <select id="layout-select" onchange="window.PrintLayoutEditor.loadLayout(this.value)" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                    <option value="">-- Select Layout --</option>
                                    <option value="default">Default</option>
                                </select>
                                <button onclick="window.PrintLayoutEditor.promptSave()" class="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 text-sm">Save</button>
                                <button onclick="window.PrintLayoutEditor.deleteLayout()" class="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm">Del</button>
                            </div>
                        </div>

                        <!-- Paper Settings -->
                        <div class="space-y-3">
                            <h4 class="font-medium text-gray-900 border-b pb-1 text-sm">Paper & Orientation</h4>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-xs text-gray-500">Size</label>
                                    <select data-config="paperSize" onchange="window.PrintLayoutEditor.updateConfig('paperSize', this.value)" class="mt-1 block w-full pl-2 pr-8 py-1 text-sm border-gray-300 rounded-md">
                                        <option value="a4">A4</option>
                                        <option value="legal">Legal</option>
                                        <option value="letter">Letter</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-500">Orientation</label>
                                    <select data-config="orientation" onchange="window.PrintLayoutEditor.updateConfig('orientation', this.value)" class="mt-1 block w-full pl-2 pr-8 py-1 text-sm border-gray-300 rounded-md">
                                        <option value="portrait">Portrait</option>
                                        <option value="landscape">Landscape</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500">Margins (mm)</label>
                                <div class="grid grid-cols-4 gap-1 mt-1">
                                    <input type="number" placeholder="T" data-config="marginTop" onchange="window.PrintLayoutEditor.updateConfig('marginTop', this.value)" class="block w-full text-center py-1 text-sm border-gray-300 rounded-md">
                                    <input type="number" placeholder="R" data-config="marginRight" onchange="window.PrintLayoutEditor.updateConfig('marginRight', this.value)" class="block w-full text-center py-1 text-sm border-gray-300 rounded-md">
                                    <input type="number" placeholder="B" data-config="marginBottom" onchange="window.PrintLayoutEditor.updateConfig('marginBottom', this.value)" class="block w-full text-center py-1 text-sm border-gray-300 rounded-md">
                                    <input type="number" placeholder="L" data-config="marginLeft" onchange="window.PrintLayoutEditor.updateConfig('marginLeft', this.value)" class="block w-full text-center py-1 text-sm border-gray-300 rounded-md">
                                </div>
                            </div>
                        </div>

                        <!-- Appearance -->
                        <div class="space-y-3">
                            <h4 class="font-medium text-gray-900 border-b pb-1 text-sm">Appearance</h4>
                            <div>
                                <label class="block text-xs text-gray-500">Font Size Scale (%)</label>
                                <input type="range" min="50" max="150" step="5" data-config="fontScale" oninput="window.PrintLayoutEditor.updateConfig('fontScale', this.value)" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500">Font Family</label>
                                <select data-config="fontFamily" onchange="window.PrintLayoutEditor.updateConfig('fontFamily', this.value)" class="mt-1 block w-full pl-2 pr-8 py-1 text-sm border-gray-300 rounded-md">
                                    <option value="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">System Default</option>
                                    <option value="'Times New Roman', Times, serif">Times New Roman</option>
                                    <option value="'Courier New', Courier, monospace">Courier New</option>
                                    <option value="Georgia, serif">Georgia</option>
                                </select>
                            </div>
                            <div class="flex items-center">
                                <input type="checkbox" id="compact-mode" data-config="compactMode" onchange="window.PrintLayoutEditor.updateConfig('compactMode', this.checked)" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                <label for="compact-mode" class="ml-2 block text-sm text-gray-900">Compact Mode</label>
                            </div>
                             <div class="flex items-center">
                                <input type="checkbox" id="bw-mode" data-config="bwMode" onchange="window.PrintLayoutEditor.updateConfig('bwMode', this.checked)" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                <label for="bw-mode" class="ml-2 block text-sm text-gray-900">Black & White Only</label>
                            </div>
                        </div>

                        <!-- Visibility -->
                        <div class="space-y-3">
                            <h4 class="font-medium text-gray-900 border-b pb-1 text-sm">Content Visibility</h4>
                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <label class="text-sm text-gray-700">Header info</label>
                                    <input type="checkbox" data-config="showHeader" onchange="window.PrintLayoutEditor.updateConfig('showHeader', this.checked)" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                </div>
                                <div class="flex items-center justify-between">
                                    <label class="text-sm text-gray-700">Footer info</label>
                                    <input type="checkbox" data-config="showFooter" onchange="window.PrintLayoutEditor.updateConfig('showFooter', this.checked)" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                </div>
                                <div class="flex items-center justify-between">
                                    <label class="text-sm text-gray-700">Legend / Colors</label>
                                    <input type="checkbox" data-config="showLegend" onchange="window.PrintLayoutEditor.updateConfig('showLegend', this.checked)" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                </div>
                                <div class="flex items-center justify-between">
                                    <label class="text-sm text-gray-700">Empty Slots</label>
                                    <input type="checkbox" data-config="showEmptySlots" onchange="window.PrintLayoutEditor.updateConfig('showEmptySlots', this.checked)" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                                </div>
                            </div>
                        </div>
                        
                        <!-- Custom Text -->
                         <div class="space-y-3">
                            <h4 class="font-medium text-gray-900 border-b pb-1 text-sm">Custom Text</h4>
                            <div>
                                <label class="block text-xs text-gray-500">Custom Title</label>
                                <input type="text" data-config="customTitle" onchange="window.PrintLayoutEditor.updateConfig('customTitle', this.value)" class="block w-full py-1 px-2 text-sm border-gray-300 rounded-md" placeholder="e.g. Final Schedule">
                            </div>
                             <div>
                                <label class="block text-xs text-gray-500">Custom Footer</label>
                                <input type="text" data-config="customFooter" onchange="window.PrintLayoutEditor.updateConfig('customFooter', this.value)" class="block w-full py-1 px-2 text-sm border-gray-300 rounded-md" placeholder="e.g. Approved by Principal">
                            </div>
                        </div>

                    </div>

                    <!-- Preview Area -->
                    <div class="md:col-span-8 lg:col-span-9 bg-gray-100 rounded-lg p-4 overflow-auto flex items-start justify-center" id="preview-container-wrapper">
                         <div id="print-preview-container" class="bg-white shadow-lg transition-all origin-top transform scale-75 origin-top-center">
                            <!-- Preview Content will be cloned here -->
                            <div class="p-8 text-center text-gray-400">Loading Preview...</div>
                         </div>
                    </div>
                </div>
                
                 <div class="mt-5 border-t border-gray-200 pt-4 flex justify-end gap-3">
                     <button type="button" onclick="window.PrintLayoutEditor.close()" class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                        Cancel
                    </button>
                    <button type="button" onclick="window.PrintLayoutEditor.applyAndPrint()" class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none">
                        Print with this Layout
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Dynamic Styles for Print -->
    <style id="print-layout-styles"></style>

    <script>
        window.PrintLayoutEditor = {
            isOpen: false,
            layouts: [],
            currentConfig: {
                paperSize: 'a4',
                orientation: 'landscape',
                marginTop: 10,
                marginRight: 10,
                marginBottom: 10,
                marginLeft: 10,
                fontScale: 100,
                fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                compactMode: false,
                bwMode: false,
                showHeader: true,
                showFooter: true,
                showLegend: true,
                showEmptySlots: true,
                customTitle: '',
                customFooter: ''
            },
            
            init() {
                // Fetch layouts
                 fetch('/school/print-layouts')
                    .then(r => r.json())
                    .then(res => {
                        this.layouts = res.layouts || [];
                        this.renderLayoutOptions();
                    });
            },

            open() {
                document.getElementById('print-layout-editor-modal').classList.remove('hidden');
                this.isOpen = true;
                this.init();
                this.updatePreview();
                // Load default values into inputs
                this.syncInputs();
            },

            close() {
                document.getElementById('print-layout-editor-modal').classList.add('hidden');
                this.isOpen = false;
            },
            
            syncInputs() {
                const c = this.currentConfig;
                for (const [key, value] of Object.entries(c)) {
                    const inputs = document.querySelectorAll('[data-config="' + key + '"]');
                    inputs.forEach(input => {
                        if (input.type === 'checkbox') input.checked = value;
                        else input.value = value;
                    });
                }
            },

            renderLayoutOptions() {
               const startOptions = '<option value="">-- Select Layout --</option><option value="default">Default</option>';
               const opts = this.layouts.map(l => '<option value="' + l.id + '">' + l.name + '</option>').join('');
               document.getElementById('layout-select').innerHTML = startOptions + opts;
            },

            loadLayout(id) {
                if (!id || id === 'default') {
                    // Reset to defaults
                    this.currentConfig = {
                        paperSize: 'a4',
                        orientation: 'landscape',
                        marginTop: 10,
                        marginRight: 10,
                        marginBottom: 10,
                        marginLeft: 10,
                        fontScale: 100,
                        fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                        compactMode: false,
                        bwMode: false,
                        showHeader: true,
                        showFooter: true,
                        showLegend: true,
                        showEmptySlots: true,
                        customTitle: '',
                        customFooter: ''
                    };
                } else {
                    const layout = this.layouts.find(l => String(l.id) === String(id));
                    if (layout) {
                        try {
                            const parsed = JSON.parse(layout.config_json);
                            this.currentConfig = { ...this.currentConfig, ...parsed };
                        } catch (e) {
                            console.error("Failed to parse layout config", e);
                        }
                    }
                }
                this.syncInputs();
                this.updatePreview();
            },

            updateConfig(key, value) {
                // Type conversion
                if (key.startsWith('margin') || key === 'fontScale') value = Number(value);
                
                this.currentConfig[key] = value;
                this.updatePreview();
            },
            
            updatePreview() {
                const container = document.getElementById('print-preview-container');
                const config = this.currentConfig;
                
                // 1. Set Dimensions based on Paper Size
                // A4: 210mm x 297mm. 
                // We'll use CSS aspect ratios or fixed pixels approximating 96dpi.
                // 1mm = 3.78px approximately.
                let widthMm, heightMm;
                if (config.paperSize === 'a4') { widthMm = 210; heightMm = 297; }
                else if (config.paperSize === 'legal') { widthMm = 216; heightMm = 356; }
                else if (config.paperSize === 'letter') { widthMm = 216; heightMm = 279; }
                
                if (config.orientation === 'landscape') {
                    [widthMm, heightMm] = [heightMm, widthMm];
                }

                container.style.width = widthMm + 'mm';
                container.style.height = heightMm + 'mm'; // Fixed height for page representation? Or min-height?
                // For a continuous roll preview (like web), min-height is better, but print pages are fixed.
                // Let's set min-height to simulate one page, but allow overflow for "multi-page" preview look if needed.
                container.style.minHeight = heightMm + 'mm';
                
                // 2. Set Padding (Margins)
                container.style.paddingTop = config.marginTop + 'mm';
                container.style.paddingRight = config.marginRight + 'mm';
                container.style.paddingBottom = config.marginBottom + 'mm';
                container.style.paddingLeft = config.marginLeft + 'mm';
                
                // 3. Clone content from the main routine-viewer
                // We want what's inside 'routine-viewer-app' or the specific tables
                const source = document.getElementById('section-view'); // Or teacher-view depending on what's active
                const teacherView = document.getElementById('teacher-view');
                const isTeacherView = !teacherView.classList.contains('hidden');
                
                let contentToClone;
                if (isTeacherView) contentToClone = teacherView;
                else contentToClone = document.getElementById('section-view');
                
                container.innerHTML = '';
                
                // Header Injection
                if (config.showHeader) {
                    const header = document.createElement('div');
                    header.className = 'mb-4 border-b pb-2';
                    header.innerHTML = '<h1 class="text-2xl font-bold">' + (config.customTitle || 'Class Routine') + '</h1><p class="text-sm text-gray-500">Generated on ' + new Date().toLocaleDateString() + '</p>';
                    container.appendChild(header);
                }

                if (contentToClone) {
                    const cloned = contentToClone.cloneNode(true);
                    cloned.classList.remove('hidden'); // Ensure visible
                    container.appendChild(cloned);
                }
                
                // Footer Injection
                if (config.showFooter) {
                    const footer = document.createElement('div');
                    footer.className = 'mt-4 border-t pt-2 text-center text-sm text-gray-500';
                    footer.innerHTML = config.customFooter || '';
                    container.appendChild(footer);
                }
                
                // 4. Apply Styles (Scale, Font, Colors)
                container.style.fontFamily = config.fontFamily;
                
                // We can use css variables to control font size in the preview
                // The base font size of the app is usually 16px (1rem) or 14px.
                // We can set a font-size on the container.
                // 100% scale = 12px (for print density) maybe?
                const baseSize = 8; // start small because tables are dense
                const scaledSize = baseSize * (config.fontScale / 100);
                container.style.fontSize = scaledSize + 'pt';
                
                // Update table cell padding for compact mode
                if (config.compactMode) {
                    container.querySelectorAll('td, th').forEach(el => el.classList.add('py-0.5', 'px-1'));
                    container.querySelectorAll('td, th').forEach(el => el.classList.remove('py-2', 'px-3'));
                }
                
                // B&W Mode
                if (config.bwMode) {
                   container.classList.add('grayscale');
                   container.querySelectorAll('*').forEach(el => {
                       el.style.backgroundColor = 'transparent';
                       el.style.color = 'black';
                       el.style.borderColor = '#000';
                   });
                } else {
                    container.classList.remove('grayscale');
                }
                
                // Show/Hide Empty Slots
                if (!config.showEmptySlots) {
                     // Logic to hide rows or columns? 
                     // Or just hide the text content "-"?
                     // This is complex for a generic table. 
                     // For now, let's just accept we can't easily re-flow the table structure without re-rendering JS.
                     // A simple approach: hide elements with only "-"
                     container.querySelectorAll('td').forEach(td => {
                         if(td.textContent.trim() === '-') td.style.opacity = '0';
                     });
                }
            },
            
            async promptSave() {
                const name = prompt("Enter a name for this layout:", "My Custom Layout");
                if(!name) return;
                
                try {
                    const res = await fetch('/school/print-layouts', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            action: 'save',
                            name: name,
                            config: this.currentConfig
                        })
                    });
                    const data = await res.json();
                    if(data.success) {
                        this.init(); // Refresh list
                        alert("Layout Saved!");
                    } else {
                        alert("Error: " + data.error);
                    }
                } catch(e) {
                    alert("Network Error");
                }
            },
            
            async deleteLayout() {
                const select = document.getElementById('layout-select');
                const id = select.value;
                if(!id || id === 'default') return;
                
                if(!confirm("Delete this layout?")) return;
                
                 try {
                    const res = await fetch('/school/print-layouts', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            action: 'delete',
                            id: id
                        })
                    });
                     const data = await res.json();
                    if(data.success) {
                        this.init(); // Refresh list
                    } else {
                        alert("Error: " + data.error);
                    }
                } catch(e) {
                    alert("Network Error");
                }
            },

            applyAndPrint() {
                const c = this.currentConfig;
                
                // Generate a style tag content that overrides CSS for @media print
                const styleCss = \`
                    @media print {
                        @page {
                            size: \${c.paperSize} \${c.orientation};
                            margin: 0; /* We handle margins in body/container to allow background colors to print if needed, or set page margins directly */
                        }
                        body { 
                            margin: 0 !important; 
                            padding: 0 !important;
                            background: white !important;
                            font-family: \${c.fontFamily} !important;
                        }
                        
                        /* Hide everything normal */
                        body > * { display: none !important; }
                        
                        /* Show our print specific container */
                        #print-staging-area { 
                            display: block !important; 
                            width: 100% !important;
                            height: 100% !important;
                            position: absolute;
                            top: 0;
                            left: 0;
                            padding-top: \${c.marginTop}mm;
                            padding-right: \${c.marginRight}mm;
                            padding-bottom: \${c.marginBottom}mm;
                            padding-left: \${c.marginLeft}mm;
                            font-size: \${c.fontScale}%;
                        }
                        
                        /* Layout fixes */
                       #print-staging-area table { width: 100%; border-collapse: collapse; }
                       #print-staging-area th, #print-staging-area td { border: 1px solid #ccc; text-align: center; }
                       \${c.compactMode ? '#print-staging-area th, #print-staging-area td { padding: 2px; }' : ''}
                       \${c.bwMode ? '#print-staging-area * { color: black !important; background: transparent !important; border-color: black !important; -webkit-print-color-adjust: exact; }' : ''} 
                       
                       .no-print { display: none !important; }
                    }
                \`;
                
                // Create a staging area for print content if it doesn't exist
                let staging = document.getElementById('print-staging-area');
                if(!staging) {
                    staging = document.createElement('div');
                    staging.id = 'print-staging-area';
                    document.body.appendChild(staging);
                }
                
                // Populate staging with preview content
                // Re-use logic from updatePreview but target the staging area
                const previewContent = document.getElementById('print-preview-container').innerHTML;
                staging.innerHTML = previewContent;
                
                // Inject style
                const styleEl = document.getElementById('print-layout-styles');
                styleEl.textContent = styleCss;
                
                // Print
                window.print();
                
                // Cleanup? Maybe leave it for next time or clear it to save memory.
                // staging.innerHTML = '';
            }
        };
    </script>
    `;
}
