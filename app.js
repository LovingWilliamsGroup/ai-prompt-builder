// Global state management
const appState = {
    experienceLevel: null,
    selectedPlatform: null,
    currentStep: 1,
    formData: {
        hook: '',
        shotType: '',
        subject: '',
        action: '',
        setting: '',
        cameraMovement: '',
        audio: ''
    },
    generatedPrompts: [],
    savedPrompts: []
};

// Data from the provided JSON
const viralData = {
    shotTypes: [
        "Close-up", "Medium shot", "Wide shot", "Over-the-shoulder",
        "Bird's eye view", "Low angle", "High angle", "Split screen"
    ],
    emotionalHooks: {
        awe: [
            "Mind-blowing transformation of",
            "Incredible before/after showing",
            "Stunning revelation about",
            "Breathtaking moment when"
        ],
        curiosity: [
            "The secret behind",
            "What nobody tells you about",
            "The shocking truth about",
            "You won't believe what happens when"
        ],
        shock: [
            "This will change everything you know about",
            "The most surprising thing about",
            "Nobody expected this outcome",
            "This breaks all the rules of"
        ],
        transformation: [
            "From zero to hero in",
            "Complete makeover of",
            "Revolutionary change in",
            "Dramatic evolution of"
        ]
    },
    subjects: {
        people: [
            "Young entrepreneur", "Wise elderly person", "Everyday hero",
            "Expert craftsperson", "Unlikely teacher"
        ],
        objects: [
            "Ordinary household item", "Forgotten vintage piece",
            "High-tech gadget", "Natural phenomenon", "Artistic creation"
        ]
    },
    actions: [
        "Demonstrates technique", "Reveals hidden feature", "Transforms appearance",
        "Solves complex problem", "Creates something beautiful", "Breaks conventional rule"
    ],
    settings: {
        timePeriods: [
            "1920s Art Deco era", "1950s Americana", "1980s neon aesthetic",
            "Modern minimalist", "Futuristic cyber-punk", "Medieval fantasy"
        ],
        locations: [
            "Cozy home workshop", "Bustling city street", "Serene natural landscape",
            "High-tech laboratory", "Vintage coffee shop", "Dramatic rooftop"
        ]
    },
    cameraMovements: [
        "Smooth dolly push-in", "Gentle pan reveal", "Dynamic rotation around subject",
        "Slow-motion capture", "Time-lapse progression", "Steady focus pull"
    ],
    audioCues: [
        "Upbeat motivational music", "Gentle acoustic background",
        "Dramatic orchestral build", "Modern electronic beats",
        "Natural ambient sounds", "Vintage jazz undertones"
    ]
};

const platformSpecs = {
    tiktok: {
        duration: "15-30 seconds",
        hookTiming: "First 3 seconds",
        focus: "Trend participation, emotional response",
        style: "Authentic, relatable, mobile-optimized",
        tips: "Quick cuts, text overlays, trending audio work best on TikTok. Focus on immediate emotional impact."
    },
    youtube: {
        duration: "Up to 60 seconds",
        hookTiming: "First 5-8 seconds",
        focus: "Educational value, retention optimization",
        style: "Polished but approachable",
        tips: "Clear narration and visual tutorials perform well. Optimize for longer retention curves."
    },
    instagram: {
        duration: "15-90 seconds",
        hookTiming: "First 3-5 seconds",
        focus: "Aesthetic appeal, lifestyle integration",
        style: "Visually striking, brand-consistent",
        tips: "High production value and cohesive aesthetics are key. Use strategic hashtags."
    }
};

const psychologyPrinciples = {
    awe: "Awe triggers sharing behavior by creating a sense of wonder that viewers want to pass along to others.",
    curiosity: "Curiosity creates an information gap that compels viewers to keep watching to satisfy their need to know.",
    shock: "Shock acts as a pattern interrupt, stopping mindless scrolling by presenting unexpected information.",
    transformation: "Transformation content taps into viewers' aspirational desires and shows possibility for change."
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    populateFormOptions();
    setupTooltips();
});

function initializeApp() {
    // Initialize saved prompts display
    displaySavedPrompts();
}

function setupEventListeners() {
    // Experience level selection
    document.querySelectorAll('.experience-card').forEach(card => {
        card.addEventListener('click', function() {
            selectExperienceLevel(this.dataset.level);
        });
    });

    // Platform selection
    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('click', function() {
            selectPlatform(this.dataset.platform);
        });
    });

    // Form inputs change handlers
    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', updatePreview);
    });
}

function setupTooltips() {
    const tooltip = document.getElementById('tooltip');
    const infoIcons = document.querySelectorAll('.info-icon');

    infoIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function(e) {
            const tooltipText = this.dataset.tooltip;
            if (tooltipText) {
                tooltip.textContent = tooltipText;
                tooltip.classList.remove('hidden');
                positionTooltip(e, tooltip);
            }
        });

        icon.addEventListener('mouseleave', function() {
            tooltip.classList.add('hidden');
        });
    });
}

function positionTooltip(event, tooltip) {
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + window.scrollX + 'px';
    tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
}

function selectExperienceLevel(level) {
    appState.experienceLevel = level;
    
    // Update UI
    document.querySelectorAll('.experience-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-level="${level}"]`).classList.add('selected');
    
    // Show platform selection after a brief delay
    setTimeout(() => {
        showSection('platform-section');
    }, 500);
}

function selectPlatform(platform) {
    appState.selectedPlatform = platform;
    
    // Update UI
    document.querySelectorAll('.platform-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-platform="${platform}"]`).classList.add('selected');
    
    // Update platform tips
    updatePlatformTips();
    
    // Enable builder navigation
    document.querySelector('.nav-btn[onclick="showSection(\'builder-section\')"]').disabled = false;
    
    // Show builder section after a brief delay
    setTimeout(() => {
        showSection('builder-section');
    }, 500);
}

function populateFormOptions() {
    // Populate emotional hooks
    Object.keys(viralData.emotionalHooks).forEach(emotion => {
        const select = document.getElementById(`${emotion}-hooks`);
        viralData.emotionalHooks[emotion].forEach(hook => {
            const option = document.createElement('option');
            option.value = hook;
            option.textContent = hook;
            select.appendChild(option);
        });
    });

    // Populate shot types
    const shotTypeSelect = document.getElementById('shot-type');
    viralData.shotTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        shotTypeSelect.appendChild(option);
    });

    // Populate subjects
    const subjectSelect = document.getElementById('subject');
    Object.values(viralData.subjects).flat().forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });

    // Populate actions
    const actionSelect = document.getElementById('action');
    viralData.actions.forEach(action => {
        const option = document.createElement('option');
        option.value = action;
        option.textContent = action;
        actionSelect.appendChild(option);
    });

    // Populate settings
    const settingSelect = document.getElementById('setting');
    Object.values(viralData.settings).flat().forEach(setting => {
        const option = document.createElement('option');
        option.value = setting;
        option.textContent = setting;
        settingSelect.appendChild(option);
    });

    // Populate camera movements
    const cameraSelect = document.getElementById('camera-movement');
    viralData.cameraMovements.forEach(movement => {
        const option = document.createElement('option');
        option.value = movement;
        option.textContent = movement;
        cameraSelect.appendChild(option);
    });

    // Populate audio cues
    const audioSelect = document.getElementById('audio');
    viralData.audioCues.forEach(cue => {
        const option = document.createElement('option');
        option.value = cue;
        option.textContent = cue;
        audioSelect.appendChild(option);
    });
}

function updatePlatformTips() {
    const tipsContainer = document.getElementById('platform-tips');
    const platformData = platformSpecs[appState.selectedPlatform];
    
    tipsContainer.innerHTML = `
        <h4>${appState.selectedPlatform.toUpperCase()} Optimization Tips</h4>
        <p><strong>Duration:</strong> ${platformData.duration}</p>
        <p><strong>Hook Timing:</strong> ${platformData.hookTiming}</p>
        <p><strong>Focus:</strong> ${platformData.focus}</p>
        <p><strong>Tips:</strong> ${platformData.tips}</p>
    `;
}

function nextStep() {
    const currentStepEl = document.querySelector(`[data-step="${appState.currentStep}"]`);
    const nextStepEl = document.querySelector(`[data-step="${appState.currentStep + 1}"]`);
    
    if (nextStepEl) {
        // Update progress
        currentStepEl.classList.remove('active');
        currentStepEl.classList.add('completed');
        nextStepEl.classList.add('active');
        
        // Update form steps
        document.querySelector(`.form-step[data-step="${appState.currentStep}"]`).classList.remove('active');
        document.querySelector(`.form-step[data-step="${appState.currentStep + 1}"]`).classList.add('active');
        
        appState.currentStep++;
        updatePreview();
    }
}

function prevStep() {
    const currentStepEl = document.querySelector(`[data-step="${appState.currentStep}"]`);
    const prevStepEl = document.querySelector(`[data-step="${appState.currentStep - 1}"]`);
    
    if (prevStepEl && appState.currentStep > 1) {
        // Update progress
        currentStepEl.classList.remove('active');
        prevStepEl.classList.remove('completed');
        prevStepEl.classList.add('active');
        
        // Update form steps
        document.querySelector(`.form-step[data-step="${appState.currentStep}"]`).classList.remove('active');
        document.querySelector(`.form-step[data-step="${appState.currentStep - 1}"]`).classList.add('active');
        
        appState.currentStep--;
        updatePreview();
    }
}

function updatePreview() {
    // Collect current form data
    const hook = getSelectedHook();
    const shotType = document.getElementById('shot-type').value;
    const subject = document.getElementById('subject').value;
    const action = document.getElementById('action').value;
    const setting = document.getElementById('setting').value;
    const cameraMovement = document.getElementById('camera-movement').value;
    const audio = document.getElementById('audio').value;
    
    // Build preview prompt
    const promptParts = [];
    if (hook) promptParts.push(hook);
    if (shotType) promptParts.push(shotType);
    if (subject) promptParts.push(subject);
    if (action) promptParts.push(action);
    if (setting) promptParts.push(setting);
    if (cameraMovement) promptParts.push(cameraMovement);
    if (audio) promptParts.push(audio);
    
    const previewContainer = document.getElementById('prompt-preview');
    if (promptParts.length > 0) {
        previewContainer.innerHTML = promptParts.join(', ');
    } else {
        previewContainer.innerHTML = '<p class="preview-placeholder">Your prompt will appear here as you make selections...</p>';
    }
    
    // Update psychology explanation
    updatePsychologyExplanation(hook);
}

function getSelectedHook() {
    const hooks = ['awe-hooks', 'curiosity-hooks', 'shock-hooks', 'transformation-hooks'];
    for (let hookId of hooks) {
        const value = document.getElementById(hookId).value;
        if (value) {
            // Store which emotion type was selected
            appState.formData.hookType = hookId.replace('-hooks', '');
            return value;
        }
    }
    return '';
}

function updatePsychologyExplanation(hook) {
    const explanationContainer = document.getElementById('psychology-explanation');
    
    if (hook && appState.formData.hookType) {
        const principle = psychologyPrinciples[appState.formData.hookType];
        explanationContainer.innerHTML = `
            <h4>${appState.formData.hookType.charAt(0).toUpperCase() + appState.formData.hookType.slice(1)} Hook Psychology</h4>
            <p>${principle}</p>
            <p><strong>Selected:</strong> "${hook}"</p>
        `;
    } else {
        explanationContainer.innerHTML = '<p>Make selections above to see the psychological principles at work...</p>';
    }
}

function generatePrompts() {
    const variationCount = parseInt(document.getElementById('variation-count').value);
    const basePrompt = document.getElementById('prompt-preview').textContent;
    
    if (!basePrompt || basePrompt.includes('Your prompt will appear')) {
        alert('Please complete all form steps before generating prompts.');
        return;
    }
    
    appState.generatedPrompts = [];
    
    // Generate variations by mixing different elements
    for (let i = 0; i < variationCount; i++) {
        const variation = createPromptVariation(basePrompt, i);
        appState.generatedPrompts.push(variation);
    }
    
    displayGeneratedPrompts();
    
    // Enable results navigation
    document.querySelector('.nav-btn[onclick="showSection(\'results-section\')"]').disabled = false;
    
    // Show results section
    showSection('results-section');
}

function createPromptVariation(basePrompt, index) {
    const variations = {
        shotTypes: viralData.shotTypes,
        subjects: Object.values(viralData.subjects).flat(),
        actions: viralData.actions,
        settings: Object.values(viralData.settings).flat(),
        cameraMovements: viralData.cameraMovements,
        audioCues: viralData.audioCues
    };
    
    // Create a variation by randomly selecting different elements
    const hook = getSelectedHook();
    const shotType = variations.shotTypes[Math.floor(Math.random() * variations.shotTypes.length)];
    const subject = variations.subjects[Math.floor(Math.random() * variations.subjects.length)];
    const action = variations.actions[Math.floor(Math.random() * variations.actions.length)];
    const setting = variations.settings[Math.floor(Math.random() * variations.settings.length)];
    const camera = variations.cameraMovements[Math.floor(Math.random() * variations.cameraMovements.length)];
    const audio = variations.audioCues[Math.floor(Math.random() * variations.audioCues.length)];
    
    return {
        id: Date.now() + index,
        text: `${hook} ${shotType} ${subject} ${action} in ${setting}, ${camera}, ${audio}`,
        platform: appState.selectedPlatform,
        hookType: appState.formData.hookType
    };
}

function displayGeneratedPrompts() {
    const container = document.getElementById('prompt-results');
    document.getElementById('selected-platform').textContent = appState.selectedPlatform.toUpperCase();
    
    container.innerHTML = appState.generatedPrompts.map(prompt => `
        <div class="prompt-card">
            <div class="prompt-text">${prompt.text}</div>
            <div class="prompt-actions">
                <button class="btn btn--sm btn--outline" onclick="copyPrompt('${prompt.id}')">
                    Copy
                </button>
                <button class="btn btn--sm btn--secondary" onclick="savePrompt('${prompt.id}')">
                    Save
                </button>
            </div>
        </div>
    `).join('');
}

function copyPrompt(promptId) {
    const prompt = appState.generatedPrompts.find(p => p.id == promptId);
    if (prompt) {
        navigator.clipboard.writeText(prompt.text).then(() => {
            // Visual feedback
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.style.background = 'var(--color-success)';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 1500);
        });
    }
}

function savePrompt(promptId) {
    const prompt = appState.generatedPrompts.find(p => p.id == promptId);
    if (prompt && !appState.savedPrompts.find(sp => sp.id === prompt.id)) {
        appState.savedPrompts.push({
            ...prompt,
            savedAt: new Date().toISOString()
        });
        
        // Note: Prompts are saved in memory only (no persistent storage in sandbox)
        
        // Visual feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Saved!';
        button.style.background = 'var(--color-success)';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1500);
        
        displaySavedPrompts();
    }
}

function displaySavedPrompts() {
    const container = document.getElementById('saved-prompts');
    
    if (appState.savedPrompts.length === 0) {
        container.innerHTML = '<p>No saved prompts yet. Generate and save prompts from the builder to see them here.</p>';
        return;
    }
    
    container.innerHTML = appState.savedPrompts.map(prompt => `
        <div class="saved-prompt">
            <div class="prompt-text">${prompt.text}</div>
            <div class="prompt-actions">
                <button class="btn btn--sm btn--outline" onclick="copyPrompt('${prompt.id}')">
                    Copy
                </button>
                <button class="btn btn--sm btn--secondary" onclick="deletePrompt('${prompt.id}')">
                    Delete
                </button>
            </div>
            <small style="color: var(--color-text-secondary); margin-top: var(--space-8); display: block;">
                Platform: ${prompt.platform.toUpperCase()} • Saved: ${new Date(prompt.savedAt).toLocaleDateString()}
            </small>
        </div>
    `).join('');
}

function deletePrompt(promptId) {
    appState.savedPrompts = appState.savedPrompts.filter(p => p.id != promptId);
    displaySavedPrompts();
}

function generateMore() {
    // Reset to generation step
    showSection('builder-section');
    appState.currentStep = 4;
    
    // Update UI to show step 4
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < 3) step.classList.add('completed');
        if (index === 3) step.classList.add('active');
    });
    
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector('[data-step="4"]').classList.add('active');
}

function exportPrompts() {
    if (appState.generatedPrompts.length === 0) {
        alert('No prompts to export. Generate prompts first.');
        return;
    }
    
    const exportData = {
        platform: appState.selectedPlatform,
        generatedAt: new Date().toISOString(),
        prompts: appState.generatedPrompts.map(p => p.text)
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `viral-prompts-${appState.selectedPlatform}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show target section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}