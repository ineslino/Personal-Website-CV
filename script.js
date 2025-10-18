// Enhanced JavaScript for Inês Lino's Portfolio Website

// Enhanced smooth scroll function with better easing
function smoothScrollTo(targetId, duration = 1000) {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const startPosition = window.pageYOffset;
    const targetPosition = target.offsetTop - 80; // Account for navbar height
    const distance = targetPosition - startPosition;
    const startTime = performance.now();
    
    // Improved easing function for smoother animation
    function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }
    
    function animation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutQuart(progress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Custom Scroll Animation System (replacing AOS)
class CustomScrollAnimations {
    constructor() {
        this.elements = [];
        this.animatedElements = new Set(); // Track which elements have been animated
        this.init();
    }

    init() {
        // Find all elements that should animate
        this.elements = document.querySelectorAll(
            'section, .project-card, .skill-category, .cert-card, .pub-card, .passion-card, .stat-card'
        );

        // Create intersection observer that doesn't unobserve
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                } else if (!entry.isIntersecting && this.animatedElements.has(entry.target)) {
                    // Reset animation when element goes out of view
                    this.resetElement(entry.target);
                    this.animatedElements.delete(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px' // Start animation earlier
        });

        // Observe all elements
        this.elements.forEach(el => {
            this.observer.observe(el);
        });
    }

    resetElement(element) {
        // Reset element to initial state for re-animation
        element.style.animation = '';
        element.style.opacity = '0';
        
        if (element.classList.contains('passion-card') || element.classList.contains('skill-category')) {
            element.style.transform = 'translateY(30px)';
            element.style.filter = 'none';
        } else {
            element.style.transform = 'translateY(40px) scale(0.95)';
            element.style.filter = 'blur(2px)';
        }
    }

    animateElement(element) {
        // Skip already animated elements
        if (this.animatedElements.has(element)) {
            return;
        }
        
        // Mark as animated
        this.animatedElements.add(element);
        
        // Determine animation type based on element
        let animationType = 'fadeInUp';
        let duration = '0.8s';
        
        if (element.classList.contains('project-card')) {
            // Skip animation for project cards to prevent overlap
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.filter = 'none';
            return;
        } else if (element.classList.contains('skill-category')) {
            animationType = 'scaleInRotate';
            duration = '1.0s';
        } else if (element.classList.contains('passion-card')) {
            animationType = 'bounceIn';
            duration = '0.9s';
        } else if (element.classList.contains('skill-item')) {
            animationType = 'slideInFromLeft';
            duration = '0.7s';
        } else if (element.classList.contains('cert-item')) {
            animationType = 'slideInFromRight';
            duration = '0.7s';
        } else if (element.classList.contains('timeline-item')) {
            animationType = 'flipIn';
            duration = '0.8s';
        } else if (element.classList.contains('tech-item')) {
            animationType = 'zoomInGlow';
            duration = '0.6s';
        } else if (element.tagName === 'SECTION') {
            animationType = 'slideUpFade';
            duration = '1.0s';
        } else if (element.classList.contains('hero-title') || element.classList.contains('hero-subtitle')) {
            animationType = 'typewriter';
            duration = '1.2s';
        }
        
        // Apply enhanced animation with better timing and effects
        element.style.animation = `${animationType} ${duration} cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        
        // Add subtle glow effect for certain elements
        if (element.classList.contains('skill-item') || element.classList.contains('cert-item') || element.classList.contains('tech-item')) {
            setTimeout(() => {
                element.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
                setTimeout(() => {
                    element.style.boxShadow = '';
                }, 2000);
            }, 500);
        }
        
        // Add particle effect for special elements
        if (element.classList.contains('hero-title')) {
            this.addParticleEffect(element);
        }
    }
    
    addParticleEffect(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.left = rect.left + Math.random() * rect.width + 'px';
                particle.style.top = rect.top + Math.random() * rect.height + 'px';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = '#6366f1';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '1000';
                particle.style.animation = 'particleFloat 2s ease-out forwards';
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 2000);
            }, i * 100);
        }
    }
}

// Fix navbar text duplication issue - AGGRESSIVE VERSION
function fixNavbarText() {
    const navLogoContainer = document.querySelector('.nav-logo');
    if (!navLogoContainer) return;
    
    // Remove ALL text content first
    const allTextNodes = [];
    const walker = document.createTreeWalker(
        navLogoContainer,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        allTextNodes.push(node);
    }
    
    // Remove all text nodes
    allTextNodes.forEach(textNode => {
        if (textNode.textContent.trim()) {
            textNode.remove();
        }
    });
    
    // Remove any duplicate spans
    const spans = navLogoContainer.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (index > 0) {
            span.remove();
        }
    });
    
    // Ensure we have exactly one span with "Inês Lino"
    const firstSpan = navLogoContainer.querySelector('span');
    if (firstSpan) {
        firstSpan.textContent = 'Inês Lino';
        firstSpan.innerHTML = 'Inês Lino';
    } else {
        // Create span if it doesn't exist
        const span = document.createElement('span');
        span.textContent = 'Inês Lino';
        navLogoContainer.appendChild(span);
    }
    
    // Force remove any pseudo-element content
    const style = document.createElement('style');
    style.textContent = `
        .nav-logo::before,
        .nav-logo::after {
            content: none !important;
            display: none !important;
        }
        .nav-logo span::before,
        .nav-logo span::after {
            content: none !important;
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Initialize custom scroll animations
// Moved to initializeAll()

// DOM Elements
const themeBtn = document.getElementById('themeBtn');
const langBtn = document.getElementById('langBtn');
const hintBtn = document.getElementById('hintBtn');
const contactForm = document.getElementById('contactForm');
const gameModal = document.getElementById('gameModal');
const closeModal = document.querySelector('.close');


// Language Management
let currentLanguage = localStorage.getItem('language') || 'pt';

// Ensure default language is Portuguese
if (!localStorage.getItem('language')) {
    currentLanguage = 'pt';
    localStorage.setItem('language', 'pt');
}

// Language toggle functionality
langBtn.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
});

function updateLanguage() {
    // Update all elements with data attributes
    const allElements = document.querySelectorAll('[data-pt][data-en]');
    allElements.forEach(element => {
        element.textContent = element.dataset[currentLanguage];
    });
    
    // Specifically update skill chips and skill items
    const chips = document.querySelectorAll('.chip[data-pt][data-en]');
    chips.forEach(element => {
        element.textContent = element.dataset[currentLanguage];
    });
    
    const skillItems = document.querySelectorAll('.skill-item span[data-pt][data-en]');
    skillItems.forEach(element => {
        element.textContent = element.dataset[currentLanguage];
    });
    // Normalize certification date prefixes across languages
    document.querySelectorAll('.cert-date').forEach(el => {
        const raw = el.dataset[currentLanguage] || el.textContent;
        const prefix = currentLanguage === 'pt' ? 'Emitido ' : 'Issued ';
        if (raw && !raw.startsWith(prefix)) {
            // Strip any existing known prefixes
            const cleaned = raw.replace(/^Issued\s+/i, '').replace(/^Emitido\s+/i, '');
            el.textContent = `${prefix}${cleaned}`;
        } else if (raw) {
            el.textContent = raw;
        }
    });
    
    // Update placeholder texts
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    if (nameInput) {
        nameInput.placeholder = currentLanguage === 'pt' ? 'O Teu Nome' : 'Your Name';
    }
    if (emailInput) {
        emailInput.placeholder = currentLanguage === 'pt' ? 'O Teu Email' : 'Your Email';
    }
    if (messageInput) {
        messageInput.placeholder = currentLanguage === 'pt' ? 'A Tua Mensagem' : 'Your Message';
    }
    
    // Update language button
    const langSpan = langBtn.querySelector('span');
    if (langSpan) {
        langSpan.textContent = currentLanguage.toUpperCase();
    }
    
    // Update Recruiter Mode content if in recruiter mode
    if (document.body.classList.contains('recruiter')) {
        updateRecruiterContent(currentLanguage);
    }
}

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'dark';

// Initialize theme
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

// Theme toggle functionality
themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add animation effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
});

function updateThemeIcon() {
    const icon = themeBtn.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// No typing effect needed (fixed title)

// Enhanced smooth scrolling for navigation links
function scrollToSection(sectionId) {
    smoothScrollTo(sectionId, 1000); // 1 second duration for navigation
    
    // Track analytics
    if (typeof trackSectionView === 'function') {
        trackSectionView(sectionId);
    }
}

// Add click listeners to navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Tech Showcase Interaction
class TechShowcase {
    constructor() {
        this.techItems = document.querySelectorAll('.tech-item');
        this.activePopup = null;
        this.init();
    }

    init() {
        this.techItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.showTechDetails(item);
            });

            item.addEventListener('mouseenter', () => {
                this.animateItem(item, true);
                this.showTechPopup(item);
            });

            item.addEventListener('mouseleave', () => {
                this.animateItem(item, false);
                // Don't hide popup immediately on mouseleave
            });
            
            // Add random glitch effect (10% chance)
            if (Math.random() < 0.1) {
                this.addGlitchEffect(item);
            }
        });
    }
    
    addGlitchEffect(item) {
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every interval
                item.style.animation = 'codeGlitch 0.3s ease-in-out';
                setTimeout(() => {
                    item.style.animation = '';
                }, 300);
            }
        }, 5000); // Check every 5 seconds
    }

    showTechDetails(item) {
        const tech = item.dataset.tech;
        const techDetails = {
            apigee: {
                name: 'Google Apigee',
                description: currentLanguage === 'pt' ? 
                    'Plataforma de gestão de APIs da Google. Experiência em implementação, governança e otimização de APIs.' :
                    'Google\'s API management platform. Experience in implementation, governance, and API optimization.',
                level: 'Expert'
            },
            aws: {
                name: 'AWS',
                description: currentLanguage === 'pt' ?
                    'Amazon Web Services - Experiência completa em EKS, Lambda, API Gateway, CloudFormation e mais.' :
                    'Amazon Web Services - Complete experience with EKS, Lambda, API Gateway, CloudFormation and more.',
                level: 'Expert'
            },
            kubernetes: {
                name: 'Kubernetes',
                description: currentLanguage === 'pt' ?
                    'Orquestração de containers. Experiência em EKS, ArgoCD, Helm Charts e autoscaling.' :
                    'Container orchestration. Experience with EKS, ArgoCD, Helm Charts and autoscaling.',
                level: 'Expert'
            },
            terraform: {
                name: 'Terraform',
                description: currentLanguage === 'pt' ?
                    'Infrastructure as Code. Experiência em automação de infraestruturas multi-cloud.' :
                    'Infrastructure as Code. Experience in multi-cloud infrastructure automation.',
                level: 'Advanced'
            },
            python: {
                name: 'Python',
                description: currentLanguage === 'pt' ?
                    'Linguagem de programação principal. Experiência em automação, APIs e scripting.' :
                    'Primary programming language. Experience in automation, APIs and scripting.',
                level: 'Advanced'
            },
            argocd: {
                name: 'ArgoCD',
                description: currentLanguage === 'pt' ?
                    'GitOps tool para deployment automatizado. Experiência em integração com GitLab, GitHub.' :
                    'GitOps tool for automated deployment. Experience integrating with GitLab, GitHub.',
                level: 'Advanced'
            }
        };

        const details = techDetails[tech];
        if (details) {
            showNotification(`${details.name} - ${details.description}`, 'info');
            
            // Track analytics
            if (typeof trackTechInteraction === 'function') {
                trackTechInteraction(details.name);
            }
        }
    }

    animateItem(item, isEntering) {
        if (isEntering) {
            item.style.transform = 'translateY(-5px) scale(1.02)';
            item.style.boxShadow = 'var(--shadow-glow)';
        } else {
            item.style.transform = '';
            item.style.boxShadow = '';
        }
    }
}

// Initialize tech showcase
// Moved to initializeAll()

// Skill Bars Animation
class SkillBars {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        // Create intersection observer for skill bars
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBar(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    animateSkillBar(bar) {
        const skillItem = bar.closest('.skill-item');
        const level = skillItem.dataset.level;
        
        setTimeout(() => {
            bar.style.width = `${level}%`;
        }, 200);
    }
}

// Initialize skill bars
// Moved to initializeAll()

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    }
}

// Initialize counter animation
// Moved to initializeAll()

// Enhanced DevOps Game with Levels
class DevOpsDndGame {
    constructor() {
        this.correctOrder = ['build','test','security','deploy','monitor'];
        this.board = document.getElementById('pipelineBoard');
        this.currentLevel = 1;
        this.maxLevel = 3;
        this.score = 0;
        this.currentPhase = 1;
        this.tasks = [];
        this.stages = [];
        this.levelValidated = false; // Track if current level is validated
        
        // New tracking system for detailed results
        this.gameResults = {
            phase1Results: [], // Store results for each level's phase 1
            phase2Results: [], // Store results for each level's phase 2
            totalCorrect: 0,
            totalIncorrect: 0,
            totalQuestions: 0,
            levelDetails: {} // Detailed breakdown per level
        };
        
        this.init();
    }

    init() {
        if (!this.board) return;
        this.updateUI();
        this.enableDragAndDrop();
        this.bindEvents();
        this.generateLevelContent();
        // Shuffle pipeline for level 1
        if (this.currentLevel === 1) {
            this.shufflePipeline();
        }
    }

    updateUI() {
        document.getElementById('currentLevel').textContent = this.currentLevel;
        document.getElementById('currentScore').textContent = this.score;
        
        const nextLevelBtn = document.getElementById('nextLevel');
        // Only show next level button when in phase 2 and level < max
        if (this.currentPhase === 2 && this.currentLevel < this.maxLevel) {
            nextLevelBtn.classList.remove('hidden');
        } else {
            nextLevelBtn.classList.add('hidden');
        }
    }

    generateLevelContent() {
        const levelTasks = {
            1: [
                { key: 'build', label: 'Lint & Build', stage: 'build' },
                { key: 'test', label: 'Unit Tests', stage: 'test' },
                { key: 'security', label: 'SAST/Secrets', stage: 'security' },
                { key: 'deploy', label: 'Blue/Green', stage: 'deploy' },
                { key: 'monitor', label: 'Alerts & Dashboards', stage: 'monitor' }
            ],
            2: [
                { key: 'build', label: 'Code Compilation', stage: 'build' },
                { key: 'test', label: 'Integration Tests', stage: 'test' },
                { key: 'security', label: 'Dependency Scan', stage: 'security' },
                { key: 'deploy', label: 'Canary Deploy', stage: 'deploy' },
                { key: 'monitor', label: 'Health Checks', stage: 'monitor' },
                { key: 'build2', label: 'Docker Build', stage: 'build' },
                { key: 'test2', label: 'E2E Tests', stage: 'test' }
            ],
            3: [
                { key: 'build', label: 'Multi-stage Build', stage: 'build' },
                { key: 'test', label: 'Performance Tests', stage: 'test' },
                { key: 'security', label: 'Container Scan', stage: 'security' },
                { key: 'deploy', label: 'Rolling Deploy', stage: 'deploy' },
                { key: 'monitor', label: 'Metrics Collection', stage: 'monitor' },
                { key: 'build2', label: 'Artifact Signing', stage: 'build' },
                { key: 'test2', label: 'Load Tests', stage: 'test' },
                { key: 'security2', label: 'Penetration Tests', stage: 'security' }
            ]
        };

        this.tasks = levelTasks[this.currentLevel] || levelTasks[1];
        this.updateTips();
        this.renderPhase2();
    }

    updateTips() {
        const tipsList = document.getElementById('tipsList');
        const tips = {
            1: [
                currentLanguage === 'pt' ? '💡 Dica: Security deve sempre vir antes de Deploy para evitar vulnerabilidades em produção.' : '💡 Tip: Security should always come before Deploy to avoid vulnerabilities in production.',
                currentLanguage === 'pt' ? '🔍 Pensa: que fase deve acontecer primeiro - construir o código ou testá-lo?' : '🔍 Think: which phase should happen first - building the code or testing it?'
            ],
            2: [
                currentLanguage === 'pt' ? 'Algumas tarefas podem ir para a mesma fase.' : 'Some tasks can go to the same stage.',
                currentLanguage === 'pt' ? 'Pensa na ordem lógica das operações.' : 'Think about the logical order of operations.'
            ],
            3: [
                currentLanguage === 'pt' ? 'Nível avançado: múltiplas tarefas por fase.' : 'Advanced level: multiple tasks per stage.',
                currentLanguage === 'pt' ? 'Considera dependências entre tarefas.' : 'Consider dependencies between tasks.'
            ]
        };

        tipsList.innerHTML = tips[this.currentLevel].map(tip => `<li>${tip}</li>`).join('');
    }

    renderPhase2() {
        const taskBoard = document.getElementById('taskBoard');
        const stageTargets = document.getElementById('stageTargets');
        
        if (!taskBoard || !stageTargets) return;

        // Clear existing content
        taskBoard.innerHTML = '';
        stageTargets.innerHTML = '';

        // Add tasks
        this.tasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task-item';
            taskEl.textContent = task.label;
            taskEl.setAttribute('draggable', 'true');
            taskEl.dataset.taskKey = task.key;
            taskEl.dataset.correctStage = task.stage;
            taskBoard.appendChild(taskEl);
        });

        // Add stage slots
        this.correctOrder.forEach(stage => {
            const stageEl = document.createElement('div');
            stageEl.className = 'stage-slot';
            stageEl.textContent = stage.toUpperCase();
            stageEl.dataset.stage = stage;
            stageTargets.appendChild(stageEl);
        });

        this.enablePhase2DragAndDrop();
    }

    enableDragAndDrop() {
        let dragged = null;
        this.board.querySelectorAll('.step').forEach(step => {
            step.addEventListener('dragstart', e => {
                dragged = step;
                step.classList.add('active');
                e.dataTransfer.effectAllowed = 'move';
            });
            step.addEventListener('dragend', () => step.classList.remove('active'));
            step.addEventListener('dragover', e => {
                e.preventDefault();
                step.classList.add('drop-target');
            });
            step.addEventListener('dragleave', () => step.classList.remove('drop-target'));
            step.addEventListener('drop', e => {
                e.preventDefault();
                step.classList.remove('drop-target');
                if (!dragged || dragged === step) return;
                // swap nodes
                const a = dragged;
                const b = step;
                const aNext = a.nextSibling === b ? a : a.nextSibling;
                b.parentNode.insertBefore(a, b);
                b.parentNode.insertBefore(b, aNext);
            });
        });
    }

    enablePhase2DragAndDrop() {
        let dragged = null;
        
        document.querySelectorAll('.task-item').forEach(task => {
            task.addEventListener('dragstart', e => {
                dragged = task;
                task.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            task.addEventListener('dragend', () => {
                if (dragged) dragged.classList.remove('dragging');
                dragged = null;
            });
        });

        document.querySelectorAll('.stage-slot').forEach(slot => {
            slot.addEventListener('dragover', e => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            slot.addEventListener('drop', e => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                if (!dragged) return;
                
                const correctStage = dragged.dataset.correctStage;
                const slotStage = slot.dataset.stage;
                
                // Always allow the drop - no immediate validation
                slot.classList.add('completed');
                slot.textContent = `${slotStage.toUpperCase()} ✓ ${dragged.textContent}`;
                dragged.style.display = 'none';
                this.score += 10;
                this.updateUI();
                
                // Track the answer for later validation
                this.trackPhase2Answer(dragged.textContent, correctStage, slotStage);
                
                // Check if all tasks are placed
                const remainingTasks = document.querySelectorAll('.task-item:not([style*="display: none"])').length;
                if (remainingTasks === 0) {
                    this.completePhase2();
                }
            });
        });
    }

    // New tracking functions
    trackPhase1Answer() {
        const order = Array.from(this.board.querySelectorAll('.step')).map(s => s.dataset.step);
        const isCorrect = JSON.stringify(order) === JSON.stringify(this.correctOrder);
        
        this.gameResults.phase1Results.push({
            level: this.currentLevel,
            userOrder: [...order],
            correctOrder: [...this.correctOrder],
            isCorrect: isCorrect
        });
        
        if (isCorrect) {
            this.gameResults.totalCorrect++;
        } else {
            this.gameResults.totalIncorrect++;
        }
        this.gameResults.totalQuestions++;
    }
    
    trackPhase2Answer(taskName, correctStage, userStage) {
        const isCorrect = correctStage === userStage;
        
        this.gameResults.phase2Results.push({
            level: this.currentLevel,
            task: taskName,
            correctStage: correctStage,
            userStage: userStage,
            isCorrect: isCorrect
        });
        
        if (isCorrect) {
            this.gameResults.totalCorrect++;
        } else {
            this.gameResults.totalIncorrect++;
        }
        this.gameResults.totalQuestions++;
    }
    
    bindEvents() {
        const nextLevelBtn = document.getElementById('nextLevel');
        const resetBtn = document.getElementById('resetGame');
        
        nextLevelBtn?.addEventListener('click', () => this.nextLevel());
        resetBtn?.addEventListener('click', () => this.reset());
    }

    validate() {
        // This function is now only used for final validation
        // No immediate feedback, just track the state
        if (this.currentPhase === 1) {
            const order = Array.from(this.board.querySelectorAll('.step')).map(s => s.dataset.step);
            this.levelValidated = JSON.stringify(order) === JSON.stringify(this.correctOrder);
        } else if (this.currentPhase === 2) {
            // Phase 2 is always considered valid for progression
            this.levelValidated = true;
        }
    }

    nextPhase() {
        // Track Phase 1 results before moving to Phase 2
        this.trackPhase1Answer();
        
        this.currentPhase = 2;
        document.getElementById('phase1').classList.add('hidden');
        document.getElementById('phase2').classList.remove('hidden');
        document.getElementById('nextLevel').classList.remove('hidden');
        this.levelValidated = false; // Reset validation for phase 2
        this.updateUI();
        this.generateLevelContent();
        
        const msg = currentLanguage === 'pt' ? 
            '🚀 Fase 2: Configuração do Pipeline!' : 
            '🚀 Phase 2: Pipeline Configuration!';
        showNotification(msg, 'info');
    }

    completePhase2() {
        this.score += 100;
        this.updateUI();
        
        if (this.currentLevel < this.maxLevel) {
            const msg = currentLanguage === 'pt' ? 
                `🎉 Fase 2 completa! Pronto para o Nível ${this.currentLevel + 1}?` : 
                `🎉 Phase 2 complete! Ready for Level ${this.currentLevel + 1}?`;
            showNotification(msg, 'success');
        } else {
            this.completeGame();
        }
    }

    nextLevel() {
        // Always allow progression - no validation required
        // If in phase 1, move to phase 2
        if (this.currentPhase === 1) {
            this.nextPhase();
            return;
        }
        
        // If in phase 2, advance to next level or complete game
        if (this.currentPhase === 2) {
            if (this.currentLevel < this.maxLevel) {
                this.currentLevel++;
                this.currentPhase = 1;
                this.levelValidated = false; // Reset validation for new level
                
                // Reset phases
                document.getElementById('phase1').classList.remove('hidden');
                document.getElementById('phase2').classList.add('hidden');
                
                // Reset pipeline order - shuffle for new level
                this.shufflePipeline();
                
                this.updateUI();
                this.generateLevelContent();
                
                const msg = currentLanguage === 'pt' ? 
                    `🚀 Nível ${this.currentLevel}! Boa sorte!` : 
                    `🚀 Level ${this.currentLevel}! Good luck!`;
                showNotification(msg, 'info');
            } else {
                // Game completed - check if we have any results before showing final results
                const hasAnyResults = this.gameResults.phase1Results.length > 0 || this.gameResults.phase2Results.length > 0;
                if (hasAnyResults) {
                    this.showFinalResults();
                } else {
                    // No results - show message and allow restart
                    const msg = currentLanguage === 'pt' ? 
                        '🎮 Jogo concluído! Mas não há resultados para mostrar. Completa pelo menos uma fase para ver os resultados!' : 
                        '🎮 Game completed! But no results to show. Complete at least one phase to see results!';
                    showNotification(msg, 'info');
                    
                    // Show a simple completion message instead
                    this.showSimpleCompletion();
                }
            }
        }
    }

    showFinalResults() {
        // Check if there are any valid results to show
        const hasPhase1Results = this.gameResults.phase1Results.length > 0;
        const hasPhase2Results = this.gameResults.phase2Results.length > 0;
        
        if (!hasPhase1Results && !hasPhase2Results) {
            // No valid results - show message and don't proceed
            const msg = currentLanguage === 'pt' ? 
                '⚠️ Não há resultados para mostrar. Completa pelo menos uma fase do jogo!' : 
                '⚠️ No results to show. Complete at least one phase of the game!';
            showNotification(msg, 'warning');
            return;
        }
        
        // Calculate final score based on tracked results
        const correctAnswers = this.gameResults.totalCorrect;
        const incorrectAnswers = this.gameResults.totalIncorrect;
        const totalQuestions = this.gameResults.totalQuestions;
        const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
        
        // Generate detailed results HTML
        let detailedResults = '';
        
        // Phase 1 Results
        if (this.gameResults.phase1Results.length > 0) {
            detailedResults += `
                <div style="margin: 1.5rem 0;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">📋 Fase 1 - Ordenação do Pipeline</h3>
            `;
            
            this.gameResults.phase1Results.forEach((result, index) => {
                const status = result.isCorrect ? '✅' : '❌';
                const statusText = result.isCorrect ? 'Correto' : 'Incorreto';
                const statusColor = result.isCorrect ? 'var(--success-color)' : 'var(--error-color)';
                
                detailedResults += `
                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin: 0.5rem 0; border-left: 4px solid ${statusColor};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <strong>Nível ${result.level} ${status}</strong>
                            <span style="color: ${statusColor}; font-weight: 600;">${statusText}</span>
                        </div>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">
                            <div><strong>Sua ordem:</strong> ${result.userOrder.join(' → ')}</div>
                            <div><strong>Ordem correta:</strong> ${result.correctOrder.join(' → ')}</div>
                        </div>
                    </div>
                `;
            });
            
            detailedResults += '</div>';
        }
        
        // Phase 2 Results
        if (this.gameResults.phase2Results.length > 0) {
            detailedResults += `
                <div style="margin: 1.5rem 0;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🎯 Fase 2 - Associação de Tarefas</h3>
            `;
            
            this.gameResults.phase2Results.forEach((result, index) => {
                const status = result.isCorrect ? '✅' : '❌';
                const statusText = result.isCorrect ? 'Correto' : 'Incorreto';
                const statusColor = result.isCorrect ? 'var(--success-color)' : 'var(--error-color)';
                
                detailedResults += `
                    <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin: 0.5rem 0; border-left: 4px solid ${statusColor};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <strong>Nível ${result.level} - ${result.task} ${status}</strong>
                            <span style="color: ${statusColor}; font-weight: 600;">${statusText}</span>
                        </div>
                        <div style="font-size: 0.9rem; color: var(--text-secondary);">
                            <div><strong>Sua resposta:</strong> ${result.userStage}</div>
                            <div><strong>Resposta correta:</strong> ${result.correctStage}</div>
                        </div>
                    </div>
                `;
            });
            
            detailedResults += '</div>';
        }
        
        // Show final results modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--primary-color);">
                    <h2 style="color: var(--primary-color); margin: 0;">🏆 DevOps Challenge - Resultados Finais</h2>
                    <button class="modal-close" style="background: none; border: none; color: var(--text-secondary); font-size: 1.5rem; cursor: pointer; padding: 0.5rem; border-radius: 0.5rem; transition: var(--transition-normal);">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin: 2rem 0;">
                        <div style="font-size: 4rem; margin-bottom: 1rem; font-weight: 700; color: var(--primary-color);">${percentage}%</div>
                        <div style="font-size: 1.3rem; margin-bottom: 2rem; color: var(--text-primary);">
                            ${percentage >= 80 ? '🎉 Excelente trabalho!' : percentage >= 60 ? '👍 Bom trabalho!' : '💪 Continua a praticar!'}
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">
                            <div style="background: rgba(16, 185, 129, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--success-color);">
                                <div style="font-size: 2rem; color: var(--success-color); font-weight: 700;">${correctAnswers}</div>
                                <div style="color: var(--text-primary); font-weight: 600;">Respostas Corretas</div>
                            </div>
                            <div style="background: rgba(239, 68, 68, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--error-color);">
                                <div style="font-size: 2rem; color: var(--error-color); font-weight: 700;">${incorrectAnswers}</div>
                                <div style="color: var(--text-primary); font-weight: 600;">Respostas Incorretas</div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(99, 102, 241, 0.1); padding: 1.5rem; border-radius: 12px; border-left: 4px solid var(--primary-color); margin: 1rem 0;">
                            <div style="font-size: 1.5rem; color: var(--primary-color); font-weight: 700; margin-bottom: 0.5rem;">${this.score} pontos</div>
                            <div style="color: var(--text-primary); font-weight: 600;">Pontuação Final</div>
                        </div>
                    </div>
                    
                    ${detailedResults}
                    
                    <div style="text-align: center; margin-top: 2rem;">
                        <button onclick="this.closest('.modal').remove(); location.reload();" 
                                style="background: var(--gradient-primary); color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: 600; transition: var(--transition-normal); box-shadow: var(--shadow-lg);">
                            🎮 Jogar Novamente
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        
        // Celebration effect
        this.celebrate();
    }

    completeGame() {
        this.celebrate();
        const msg = currentLanguage === 'pt' ? 
            `🏆 Parabéns! Completaste todos os níveis! Pontuação final: ${this.score}` : 
            `🏆 Congratulations! You completed all levels! Final score: ${this.score}`;
        showNotification(msg, 'success');
        
        // Track analytics
        if (typeof trackGamePlay === 'function') {
            trackGamePlay('devops_game', this.score);
        }
    }

    reset() {
        // Don't reset level when called from nextLevel
        if (this.currentPhase === 1) {
            this.currentLevel = 1;
        }
        this.currentPhase = 1;
        this.score = 0;
        this.levelValidated = false; // Reset validation
        
        // Reset game results tracking
        this.gameResults = {
            phase1Results: [],
            phase2Results: [],
            totalCorrect: 0,
            totalIncorrect: 0,
            totalQuestions: 0,
            levelDetails: {}
        };
        
        // Reset phases
        document.getElementById('phase1').classList.remove('hidden');
        document.getElementById('phase2').classList.add('hidden');
        
        // Reset pipeline order - shuffle for level 1
        this.shufflePipeline();
        
        this.updateUI();
        this.generateLevelContent();
    }

    shufflePipeline() {
        const steps = Array.from(this.board.querySelectorAll('.step'));
        const shuffled = this.shuffleArray([...steps]);
        
        // Clear board
        this.board.innerHTML = '';
        
        // Add shuffled steps
        shuffled.forEach(step => this.board.appendChild(step));
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    celebrate() {
        // Enhanced confetti with more emojis
        const emojis = ['🎈','🎉','🚀','🧪','🛡️','🧩','⚡','🔧','📊','🎯','💻','🔒','📈','🎪','🌟'];
        for (let i = 0; i < 80; i++) {
            setTimeout(() => {
                const node = document.createElement('div');
                node.style.cssText = `position: fixed; width: 16px; height: 16px; left: ${Math.random()*100}vw; top: -10px; z-index: 3000; animation: confetti-fall 4s linear forwards; font-size: 16px;`;
                node.textContent = emojis[Math.floor(Math.random()*emojis.length)];
                document.body.appendChild(node);
                setTimeout(() => node.remove(), 4000);
            }, i*30);
        }
    }
}

function playDevOpsGame() {
    gameModal.style.display = 'block';
    new DevOpsDndGame();
}

closeModal.addEventListener('click', () => {
    gameModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === gameModal) {
        gameModal.style.display = 'none';
    }
});

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    const loadingText = currentLanguage === 'pt' ? 
        '<i class="fas fa-spinner fa-spin"></i> A Enviar...' :
        '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    const successText = currentLanguage === 'pt' ?
        '<i class="fas fa-check"></i> Mensagem Enviada!' :
        '<i class="fas fa-check"></i> Message Sent!';
    
    submitBtn.innerHTML = loadingText;
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = successText;
        submitBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 2000);
    }, 1500);
    
    console.log('Form data:', data);
});

// Enhanced Passion Cards with Modal System
class PassionCards {
    constructor() {
        this.cards = document.querySelectorAll('.passion-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            // Click event for modal
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showPassionModal(card);
            });
            
            // Hover event for sparkle effect (15% chance)
            card.addEventListener('mouseenter', () => {
                if (Math.random() < 0.15) {
                    this.triggerPassionSparkle(card);
                }
            });
        });
    }

    showPassionModal(card) {
        // Prevent multiple modals
        const existingModal = document.querySelector('.passion-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const passion = card.dataset.passion;
        const iconElement = card.querySelector('i');
        const iconClass = iconElement.className;
        const titleElement = card.querySelector('h4');
        // Remove emojis from title for modal (keep only text after emoji)
        const titleText = titleElement.textContent.replace(/^[^\w\s]*\s*/, '');
        
        const summary = card.querySelector('p').textContent;
        const details = card.querySelector('.passion-details').textContent;

        const modal = document.createElement('div');
        modal.className = 'passion-modal';
        modal.innerHTML = `
            <div class="passion-modal-content">
                <div class="passion-modal-header">
                    <div class="passion-modal-title">
                        <i class="${iconClass}"></i>
                        <span>${titleText}</span>
                    </div>
                    <button class="passion-modal-close" onclick="this.closest('.passion-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="passion-modal-summary">
                    ${summary}
                </div>
                
                <div class="passion-modal-details">
                    ${details}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close modal with Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg(`passion_${passion}`);
        }
    }
    
    triggerPassionSparkle(element) {
        // Prevent multiple sparkles on the same element
        if (element.classList.contains('sparkling')) {
            return;
        }
        
        // Ensure element is visible before applying animation
        if (element.style.display === 'none' || element.style.visibility === 'hidden') {
            return;
        }
        
        element.classList.add('sparkling');
        
        // Store original styles to restore later
        const originalTransform = element.style.transform;
        const originalBoxShadow = element.style.boxShadow;
        
        // Enhanced sparkle effect with glow
        element.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6)';
        element.style.transform = 'scale(1.1) rotate(5deg)';
        
        // Add particle sparkles around the element
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.position = 'absolute';
                sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
                sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
                sparkle.style.fontSize = '18px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';
                sparkle.style.animation = 'particleFloat 2s ease-out forwards';
                sparkle.style.filter = 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))';
                document.body.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 2000);
            }, i * 100);
        }
        
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            element.style.animation = 'glowPulse 1.5s ease-in-out';
        });
        
        setTimeout(() => {
            element.style.animation = '';
            element.style.transform = originalTransform;
            element.style.boxShadow = originalBoxShadow;
            element.classList.remove('sparkling');
        }, 1500);
        
        const message = currentLanguage === 'pt' ?
            '✨ Passion Sparkle! Brilho especial! ✨' :
            '✨ Passion Sparkle! Special shine! ✨';
        showNotification(message, 'info');
    }
}

// Initialize passion cards
// Moved to initializeAll()

// Movie Quotes Animation System
class MovieQuotesAnimation {
    constructor() {
        this.quoteElement = document.querySelector('.movie-quote');
        this.currentQuoteIndex = 0;
        this.quotes = [
            { movie: 'Gladiator', quote: 'What we do in life echoes in eternity.', emoji: '⚔️' },
            { movie: 'Interstellar', quote: 'Love is the one thing we are capable of perceiving that transcends time and space.', emoji: '🌌' },
            { movie: 'Whiplash', quote: 'Not quite my tempo.', emoji: '🥁' },
            { movie: 'Game of Thrones', quote: 'Winter is coming.', emoji: '🐉' },
            { movie: 'Dead Poets Society', quote: 'I stand upon my desk to remind myself that we must constantly look at things in a different way.', emoji: '📚' }
        ];
        this.init();
    }

    init() {
        if (this.quoteElement) {
            this.quoteElement.addEventListener('click', () => {
                this.cycleQuote();
            });
        }
    }

    cycleQuote() {
        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
        const currentQuote = this.quotes[this.currentQuoteIndex];
        
        // Update quote text
        const quoteText = currentLanguage === 'pt' ? 
            `"${currentQuote.quote}" — ${currentQuote.movie}` :
            `"${currentQuote.quote}" — ${currentQuote.movie}`;
        
        this.quoteElement.textContent = quoteText;
        
        // Update emoji
        this.quoteElement.style.setProperty('--movie-emoji', `"${currentQuote.emoji}"`);
        
        // Add special animation
        this.quoteElement.classList.add('movie-quote-active');
        
        // Trigger movie effect based on current quote
        this.triggerMovieEffect(currentQuote.movie);
        
        // Remove active class after animation
        setTimeout(() => {
            this.quoteElement.classList.remove('movie-quote-active');
        }, 2000);
    }

    triggerMovieEffect(movie) {
        const effects = {
            'Interstellar': 'interstellarEffect',
            'Whiplash': 'whiplashEffect',
            'Game of Thrones': 'gameOfThronesEffect'
        };
        
        const effectId = effects[movie];
        if (effectId) {
            const effect = document.getElementById(effectId);
            if (effect) {
                effect.style.opacity = '0.3';
                setTimeout(() => {
                    effect.style.opacity = '0';
                }, 2000);
            }
        }
    }
}

// Initialize movie quotes animation
// Moved to initializeAll()

// Enhanced Project Cards with Modal System
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                this.showProjectModal(card);
            });
        });
    }

    showProjectModal(card) {
        const project = card.dataset.project;
        const iconElement = card.querySelector('.project-header i');
        const iconClass = iconElement.className;
        const titleElement = card.querySelector('.project-header h3');
        const titleText = titleElement.textContent;
        const sectorTag = card.querySelector('.sector-tag');
        const sectorText = sectorTag ? sectorTag.textContent : '';
        const summaryElement = card.querySelector('p');
        const summaryText = summaryElement.textContent;
        const techStackElement = card.querySelector('.project-tech');
        const techStackItems = Array.from(techStackElement.querySelectorAll('span')).map(span => span.textContent);
        const impactElement = card.querySelector('.project-impact');
        const impactText = impactElement.textContent;
        
        // Track analytics
        if (typeof trackProjectView === 'function') {
            trackProjectView(titleText);
        }
        
        // Get bullet points if they exist
        const subitemsElement = card.querySelector('.project-subitems');
        let bulletPoints = '';
        if (subitemsElement) {
            const listItems = Array.from(subitemsElement.querySelectorAll('li')).map(li => li.innerHTML);
            bulletPoints = listItems.map(item => `<li>${item}</li>`).join('');
        }

        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="project-modal-content">
                <div class="project-modal-header">
                    <div class="project-modal-title">
                        <i class="${iconClass}"></i>
                        <h3>${titleText}</h3>
                    </div>
                    <button class="project-modal-close" onclick="this.closest('.project-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="project-modal-summary">
                    ${summaryText}
                </div>
                
                ${bulletPoints ? `
                <div class="project-modal-details">
                    <h4>📋 ${currentLanguage === 'pt' ? 'Detalhes do Projeto:' : 'Project Details:'}</h4>
                    <ul>
                        ${bulletPoints}
                    </ul>
                </div>
                ` : ''}
                
                <div class="project-modal-tech">
                    <h4>🛠️ ${currentLanguage === 'pt' ? 'Tecnologias Utilizadas:' : 'Technologies Used:'}</h4>
                    <div class="project-modal-tech-stack">
                        ${techStackItems.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="project-modal-impact">
                    <strong>🚀 ${currentLanguage === 'pt' ? 'Impacto:' : 'Impact:'}</strong><br>
                    ${impactText.replace(/^Impacto:\s*/, '').replace(/^Impact:\s*/, '')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close modal with Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}

// Initialize project cards
// Moved to initializeAll()

// Mark truncated project descriptions to show a proper read-more hint only when needed
function getNumericPx(value, fallback) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
}

function markTruncatedDescriptions() {
    console.log('Starting markTruncatedDescriptions');
    
    // First, clean up all existing indicators
    document.querySelectorAll('.read-more-indicator').forEach(indicator => {
        indicator.remove();
    });
    
    // Remove truncated class from all paragraphs
    document.querySelectorAll('.project-card p').forEach(p => {
        p.classList.remove('truncated');
        p.removeAttribute('data-read-more');
    });
    
    // Force immediate application for the two specific cards
    const telecomCard = document.querySelector('[data-project="telecom-apigee"] p');
    const bankingCard = document.querySelector('[data-project="banking-platform"] p');
    
    console.log('Telecom card found:', !!telecomCard);
    console.log('Banking card found:', !!bankingCard);
    
    if (telecomCard) {
        console.log('Telecom card text:', telecomCard.textContent.substring(0, 50) + '...');
        console.log('Telecom card computed styles:', {
            display: getComputedStyle(telecomCard).display,
            webkitLineClamp: getComputedStyle(telecomCard).webkitLineClamp,
            overflow: getComputedStyle(telecomCard).overflow
        });
        
        telecomCard.classList.add('truncated');
        telecomCard.setAttribute('data-read-more', '… Saber mais');
    }
    
    if (bankingCard) {
        console.log('Banking card text:', bankingCard.textContent.substring(0, 50) + '...');
        console.log('Banking card computed styles:', {
            display: getComputedStyle(bankingCard).display,
            webkitLineClamp: getComputedStyle(bankingCard).webkitLineClamp,
            overflow: getComputedStyle(bankingCard).overflow
        });
        
        bankingCard.classList.add('truncated');
        bankingCard.setAttribute('data-read-more', '… Saber mais');
    }
}

// Moved to initializeAll()
// Run again when the page fully loads (fonts/layout settle)
window.addEventListener('load', () => setTimeout(markTruncatedDescriptions, 50));
window.addEventListener('resize', () => {
    clearTimeout(window.__truncateTimer);
    window.__truncateTimer = setTimeout(markTruncatedDescriptions, 150);
});

// Recalculate after language toggle updates text (langBtn exists globally)
// Moved to initializeAll()

// Enhanced Publication Cards with Link System
class PublicationCards {
    constructor() {
        this.cards = document.querySelectorAll('.pub-card[data-publication-link]');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                this.openPublication(card);
            });
            
            // Add cursor pointer style
            card.style.cursor = 'pointer';
        });
    }

    openPublication(card) {
        const link = card.dataset.publicationLink;
        if (link) {
            // Open in new tab
            window.open(link, '_blank', 'noopener,noreferrer');
            
            // Show notification
            const message = currentLanguage === 'pt' ? 
                '📄 Abrindo publicação no IEEE...' : 
                '📄 Opening publication on IEEE...';
            showNotification(message, 'info');
        }
    }
}

// Initialize publication cards
// Moved to initializeAll()

// Enhanced Movie/Series Effects System
class MovieEffects {
    constructor() {
        this.effects = {
            interstellar: document.getElementById('interstellarEffect'),
            whiplash: document.getElementById('whiplashEffect'),
            gameOfThrones: document.getElementById('gameOfThronesEffect')
        };
        this.activeEffect = null;
        this.hoverTimeout = null;
        this.init();
    }

    init() {
        this.bindMovieReferences();
        this.bindHoverEffects();
    }

    bindMovieReferences() {
        // Only elements explicitly marked with data-movie trigger effects
        document.querySelectorAll('[data-movie]').forEach(el => {
            const type = el.dataset.movie;
            el.addEventListener('click', () => {
                this.triggerEffect(type);
            });
        });
    }

    bindHoverEffects() {
        // Enhanced hover effects with better timing control
        document.querySelectorAll('[data-movie]').forEach(el => {
            const type = el.dataset.movie;
            
            el.addEventListener('mouseenter', () => {
                // Clear any existing timeout
                if (this.hoverTimeout) {
                    clearTimeout(this.hoverTimeout);
                }
                
                // Small delay to prevent accidental triggers
                this.hoverTimeout = setTimeout(() => {
                    this.triggerEffect(type, true); // true = hover mode
                }, 300);
            });
            
            el.addEventListener('mouseleave', () => {
                // Clear timeout if mouse leaves before delay
                if (this.hoverTimeout) {
                    clearTimeout(this.hoverTimeout);
                    this.hoverTimeout = null;
                }
                
                // Fade out effect more smoothly
                this.fadeOutEffect();
            });
        });
    }

    triggerEffect(effectName, isHover = false) {
        // Prevent multiple effects from overlapping
        if (this.activeEffect && this.activeEffect !== effectName) {
            this.clearActiveEffect();
        }
        
        const effect = this.effects[effectName];
        if (effect && !this.activeEffect) {
            this.activeEffect = effectName;
            effect.style.opacity = '0.3'; // Much more subtle
            
            // Shorter duration for hover, longer for click
            const duration = isHover ? 1000 : 2000;
            
            setTimeout(() => {
                this.fadeOutEffect();
            }, duration);

            // Show notification only on click, not hover
            if (!isHover) {
                const messages = {
                    interstellar: {
                        pt: "🌌 'Love is the one thing we're capable of perceiving that transcends time and space.' - Interstellar",
                        en: "🌌 'Love is the one thing we're capable of perceiving that transcends time and space.' - Interstellar"
                    },
                    whiplash: {
                        pt: "🥁 'Not quite my tempo.' - Whiplash",
                        en: "🥁 'Not quite my tempo.' - Whiplash"
                    },
                    gameOfThrones: {
                        pt: "🐉 'Winter is coming.' - Game of Thrones",
                        en: "🐉 'Winter is coming.' - Game of Thrones"
                    }
                };
                
                const message = messages[effectName][currentLanguage];
                showNotification(message, 'info');
            }
        }
    }

    fadeOutEffect() {
        if (this.activeEffect) {
            const effect = this.effects[this.activeEffect];
            if (effect) {
                effect.style.transition = 'opacity 0.8s ease-out';
                effect.style.opacity = '0';
                
                setTimeout(() => {
                    effect.style.transition = 'opacity 0.5s ease';
                    this.activeEffect = null;
                }, 800);
            }
        }
    }

    clearActiveEffect() {
        Object.values(this.effects).forEach(effect => {
            effect.style.opacity = '0';
        });
        this.activeEffect = null;
    }
}

// Initialize movie effects
// Moved to initializeAll()

// Notification System
function showNotification(message, type = 'info', isEasterEgg = false) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    let className = 'notification';
    
    // Add easter egg class if it's an easter egg notification
    if (isEasterEgg) {
        className += ' easter-egg';
    }
    
    // Add type class
    if (type === 'success') className += ' success';
    if (type === 'error') className += ' error';
    if (type === 'warning') className += ' warning';
    
    notification.className = className;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, isEasterEgg ? 6000 : 4000); // Easter eggs stay longer
}

// Subtle Easter Egg Notification System
function showEasterEggIndicator(message, type = 'corner') {
    // Remove existing indicators
    const existingIndicators = document.querySelectorAll('.easter-egg-indicator, .easter-egg-corner');
    existingIndicators.forEach(indicator => indicator.remove());
    
    const indicator = document.createElement('div');
    indicator.className = type === 'corner' ? 'easter-egg-corner' : 'easter-egg-indicator';
    indicator.textContent = message;
    
    document.body.appendChild(indicator);
    
    // Trigger animation
    setTimeout(() => {
        indicator.classList.add('show');
    }, 10);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        indicator.classList.remove('show');
        setTimeout(() => {
            indicator.remove();
        }, 300);
    }, 3000);
}

// Floating emoji effect
function createFloatingEmoji(emoji, x, y) {
    const floatElement = document.createElement('div');
    floatElement.className = 'easter-egg-float';
    floatElement.textContent = emoji;
    floatElement.style.left = x + 'px';
    floatElement.style.top = y + 'px';
    
    document.body.appendChild(floatElement);
    
    setTimeout(() => {
        floatElement.remove();
    }, 2000);
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections
// Moved to initializeAll()

// Enhanced CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes confetti-fall {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes floatDown {
        0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes logoSpin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    @keyframes titleGlow {
        0% { 
            text-shadow: 0 0 5px var(--primary-color);
            transform: scale(1);
        }
        50% { 
            text-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--secondary-color);
            transform: scale(1.02);
        }
        100% { 
            text-shadow: 0 0 5px var(--primary-color);
            transform: scale(1);
        }
    }
    
    @keyframes techGlitch {
        0% { transform: translateX(0); }
        20% { transform: translateX(-2px); }
        40% { transform: translateX(2px); }
        60% { transform: translateX(-1px); }
        80% { transform: translateX(1px); }
        100% { transform: translateX(0); }
    }
    
    @keyframes passionSparkle {
        0% { 
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
        }
        25% { 
            transform: scale(1.05) rotate(5deg);
            filter: brightness(1.2);
        }
        50% { 
            transform: scale(1.1) rotate(-5deg);
            filter: brightness(1.4);
        }
        75% { 
            transform: scale(1.05) rotate(5deg);
            filter: brightness(1.2);
        }
        100% { 
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
        }
    }
    
    .devops-pipeline-effect {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        gap: 1rem;
        z-index: 3000;
        pointer-events: none;
    }
    
    .pipeline-step {
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-weight: bold;
        animation: pipelineFlow 0.5s ease-in-out;
    }
    
    @keyframes pipelineFlow {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.1) rotate(180deg); opacity: 1; }
        100% { transform: scale(1) rotate(360deg); opacity: 1; }
    }
    
    .vinyl-effect, .cooking-effect, .gaming-effect {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        z-index: 3000;
        pointer-events: none;
        animation: centerSpin 2s ease-in-out;
    }
    
    @keyframes centerSpin {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2) rotate(180deg); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0; }
    }
    
    .error {
        animation: shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Toggle theme with Ctrl/Cmd + T
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        themeBtn.click();
    }
    
    // Toggle language with Ctrl/Cmd + L
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        langBtn.click();
    }
    
    // Close modals with Escape
    if (e.key === 'Escape') {
        // Close all types of modals
        const allModals = document.querySelectorAll('.modal, .passion-modal, .project-modal, .easter-egg-modal');
        allModals.forEach(modal => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
            }
            modal.remove();
        });
        
        // Close passion popups
        const popups = document.querySelectorAll('.passion-popup');
        popups.forEach(popup => popup.remove());
    }
    
    // Start game with Ctrl/Cmd + G
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        playDevOpsGame();
    }
});

// Performance optimization: Lazy load images
// Moved to initializeAll()

// Enhanced Easter Eggs System
class EasterEggsSystem {
    constructor() {
        this.activeEggs = new Set();
        this.konamiCode = [];
        this.devOpsCode = [];
        this.musicCode = [];
        this.cookingCode = [];
        this.gamingCode = [];
        
        // New easter egg arrays
        this.reactCode = [];
        this.dockerCode = [];
        this.kubernetesCode = [];
        this.awsCode = [];
        this.gitCode = [];
        this.legoCode = [];
        this.cinemaCode = [];
        
        this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.devOpsSequence = ['KeyD', 'KeyE', 'KeyV', 'KeyO', 'KeyP'];
        this.musicSequence = ['KeyM', 'KeyU', 'KeyS', 'KeyI', 'KeyC'];
        this.cookingSequence = ['KeyC', 'KeyO', 'KeyO', 'KeyK'];
        this.gamingSequence = ['KeyG', 'KeyA', 'KeyM', 'KeyE'];
        
        // New creative easter eggs
        this.reactSequence = ['KeyR', 'KeyE', 'KeyA', 'KeyC', 'KeyT'];
        this.dockerSequence = ['KeyD', 'KeyO', 'KeyC', 'KeyK', 'KeyE', 'KeyR'];
        this.kubernetesSequence = ['KeyK', 'KeyU', 'KeyB', 'KeyE'];
        this.awsSequence = ['KeyA', 'KeyW', 'KeyS'];
        this.gitSequence = ['KeyG', 'KeyI', 'KeyT'];
        this.legoSequence = ['KeyL', 'KeyE', 'KeyG', 'KeyO'];
        this.cinemaSequence = ['KeyC', 'KeyI', 'KeyN', 'KeyE', 'KeyM', 'KeyA'];
        // New fun codes
        this.surfCode = [];
        this.gardenCode = [];
        this.apigeeCode = [];
        this.surfSequence = ['KeyS','KeyU','KeyR','KeyF'];
        this.gardenSequence = ['KeyG','KeyA','KeyR','KeyD','KeyE','KeyN'];
        this.apigeeSequence = ['KeyA','KeyP','KeyI','KeyG','KeyE','KeyE'];
        
        console.log('🎯 EasterEggsSystem initialized');
        console.log('🎮 Available Easter Eggs:');
        console.log('  🎵 Konami Code (↑↑↓↓←→←→BA)');
        console.log('  🚀 DevOps Code (DEVOPS)');
        console.log('  🎵 Music Code (MUSIC)');
        console.log('  🍳 Cooking Code (COOK)');
        console.log('  🎮 Gaming Code (GAME)');
        console.log('  ⚛️ React Code (REACT)');
        console.log('  🐳 Docker Code (DOCKER)');
        console.log('  ☸️ Kubernetes Code (KUBE)');
        console.log('  ☁️ AWS Code (AWS)');
        console.log('  📝 Git Code (GIT)');
        console.log('  🧱 Lego Code (LEGO)');
        console.log('  🎬 Cinema Code (MOVIE)');
        console.log('  🏄 Surf Code (SURF)');
        console.log('  🌱 Garden Code (GARDEN)');
        console.log('  🌧️ Apigee Code (APIGEE)');
        console.log('  🎯 Click logo for spin effect');
        console.log('  ✨ Click title for glow effect');
        console.log('  🎬 Click movie quotes to cycle');
        console.log('  🎵 Hover tech items for glitch');
        console.log('  ✨ Hover passion cards for sparkle');
        this.init();
    }

    init() {
        this.bindKonamiCode();
        this.bindDevOpsCode();
        this.bindMusicCode();
        this.bindCookingCode();
        this.bindGamingCode();
        
        // New creative easter eggs
        this.bindReactCode();
        this.bindDockerCode();
        this.bindKubernetesCode();
        this.bindAWSCode();
        this.bindGitCode();
        this.bindLegoCode();
        this.bindCinemaCode();
        
        // Additional creative easter eggs
        this.bindSurfCode();
        this.bindGardenCode();
        this.bindApigeeCode();
        
        this.bindSpecialClicks();
        this.bindHoverEggs();
        this.bindConsoleEggs();
    }

    bindKonamiCode() {
        document.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.code); // Debug log
            this.konamiCode.push(e.code);
            if (this.konamiCode.length > this.konamiSequence.length) {
                this.konamiCode.shift();
            }
            
            console.log('Konami sequence:', this.konamiCode.join(',')); // Debug log
            
            if (this.konamiCode.join(',') === this.konamiSequence.join(',')) {
                console.log('Konami Code activated!'); // Debug log
                this.triggerRainbowEffect();
                const message = currentLanguage === 'pt' ?
                    '🎵 Konami Code Ativado! Encontraste o segredo musical! 🎵' :
                    '🎵 Konami Code Activated! You found the musical secret! 🎵';
                showEasterEggIndicator('Konami Code!', 'corner');
                this.konamiCode = [];
            }
        });
    }

    bindDevOpsCode() {
        document.addEventListener('keydown', (e) => {
            console.log('DevOps key pressed:', e.code);
            this.devOpsCode.push(e.code);
            if (this.devOpsCode.length > this.devOpsSequence.length) {
                this.devOpsCode.shift();
            }
            
            console.log('DevOps sequence:', this.devOpsCode.join(','));
            
            if (this.devOpsCode.join(',') === this.devOpsSequence.join(',')) {
                console.log('DevOps Code activated!');
                this.triggerDevOpsEffect();
                const message = currentLanguage === 'pt' ?
                    '🚀 Código DevOps Ativado! Pipeline em ação! 🚀' :
                    '🚀 DevOps Code Activated! Pipeline in action! 🚀';
                showEasterEggIndicator('DevOps Code!', 'corner');
                this.devOpsCode = [];
            }
        });
    }

    bindMusicCode() {
        document.addEventListener('keydown', (e) => {
            console.log('Music key pressed:', e.code);
            this.musicCode.push(e.code);
            if (this.musicCode.length > this.musicSequence.length) {
                this.musicCode.shift();
            }
            
            console.log('Music sequence:', this.musicCode.join(','));
            
            if (this.musicCode.join(',') === this.musicSequence.join(',')) {
                console.log('Music Code activated!');
                this.triggerMusicEffect();
                const message = currentLanguage === 'pt' ?
                    '🎵 Código Musical Ativado! Vinis a girar! 🎵' :
                    '🎵 Music Code Activated! Vinyls spinning! 🎵';
                showEasterEggIndicator('Music Code!', 'corner');
                this.musicCode = [];
            }
        });
    }

    bindCookingCode() {
        document.addEventListener('keydown', (e) => {
            console.log('Cooking key pressed:', e.code);
            this.cookingCode.push(e.code);
            if (this.cookingCode.length > this.cookingSequence.length) {
                this.cookingCode.shift();
            }
            
            console.log('Cooking sequence:', this.cookingCode.join(','));
            
            if (this.cookingCode.join(',') === this.cookingSequence.join(',')) {
                console.log('Cooking Code activated!');
                this.triggerCookingEffect();
                const message = currentLanguage === 'pt' ?
                    '🍳 Código Culinário Ativado! Magia na cozinha! 🍳' :
                    '🍳 Cooking Code Activated! Kitchen magic! 🍳';
                showEasterEggIndicator('Cooking Code!', 'corner');
                this.cookingCode = [];
            }
        });
    }

    bindGamingCode() {
        document.addEventListener('keydown', (e) => {
            console.log('Gaming key pressed:', e.code);
            this.gamingCode.push(e.code);
            if (this.gamingCode.length > this.gamingSequence.length) {
                this.gamingCode.shift();
            }
            
            console.log('Gaming sequence:', this.gamingCode.join(','));
            
            if (this.gamingCode.join(',') === this.gamingSequence.join(',')) {
                console.log('Gaming Code activated!');
                this.triggerGamingEffect();
                const message = currentLanguage === 'pt' ?
                    '🎮 Código Gaming Ativado! Level up! 🎮' :
                    '🎮 Gaming Code Activated! Level up! 🎮';
                showEasterEggIndicator('Gaming Code!', 'corner');
                this.gamingCode = [];
            }
        });
    }

    // New creative easter eggs
    bindReactCode() {
        document.addEventListener('keydown', (e) => {
            console.log('React key pressed:', e.code);
            this.reactCode.push(e.code);
            if (this.reactCode.length > this.reactSequence.length) {
                this.reactCode.shift();
            }
            
            if (this.reactCode.join(',') === this.reactSequence.join(',')) {
                console.log('React Code activated!');
                this.triggerReactEffect();
                const message = currentLanguage === 'pt' ?
                    '⚛️ React Ativado! Componentes a renderizar! ⚛️' :
                    '⚛️ React Activated! Components rendering! ⚛️';
                showEasterEggIndicator('React Code!', 'corner');
                this.reactCode = [];
            }
        });
    }

    bindDockerCode() {
        document.addEventListener('keydown', (e) => {
            console.log('Docker key pressed:', e.code);
            this.dockerCode.push(e.code);
            if (this.dockerCode.length > this.dockerSequence.length) {
                this.dockerCode.shift();
            }
            
            if (this.dockerCode.join(',') === this.dockerSequence.join(',')) {
                console.log('Docker Code activated!');
                this.triggerDockerEffect();
                const message = currentLanguage === 'pt' ?
                    '🐳 Docker Ativado! Containers a navegar! 🐳' :
                    '🐳 Docker Activated! Containers sailing! 🐳';
                showEasterEggIndicator('Docker Code!', 'corner');
                this.dockerCode = [];
            }
        });
    }

    bindKubernetesCode() {
        document.addEventListener('keydown', (e) => {
            console.log('Kubernetes key pressed:', e.code);
            this.kubernetesCode.push(e.code);
            if (this.kubernetesCode.length > this.kubernetesSequence.length) {
                this.kubernetesCode.shift();
            }
            
            if (this.kubernetesCode.join(',') === this.kubernetesSequence.join(',')) {
                console.log('Kubernetes Code activated!');
                this.triggerKubernetesEffect();
                const message = currentLanguage === 'pt' ?
                    '☸️ Kubernetes Ativado! Pods a escalar! ☸️' :
                    '☸️ Kubernetes Activated! Pods scaling! ☸️';
                showEasterEggIndicator('Kubernetes Code!', 'corner');
                this.kubernetesCode = [];
            }
        });
    }

    bindAWSCode() {
        document.addEventListener('keydown', (e) => {
            console.log('AWS key pressed:', e.code);
            this.awsCode.push(e.code);
            if (this.awsCode.length > this.awsSequence.length) {
                this.awsCode.shift();
            }
            
            if (this.awsCode.join(',') === this.awsSequence.join(',')) {
                console.log('AWS Code activated!');
                this.triggerAWSEffect();
                const message = currentLanguage === 'pt' ?
                    '☁️ AWS Ativado! Cloud computing! ☁️' :
                    '☁️ AWS Activated! Cloud computing! ☁️';
                showEasterEggIndicator('AWS Code!', 'corner');
                this.awsCode = [];
            }
        });
    }

    bindGitCode() {
        document.addEventListener('keydown', (e) => {
            console.log('Git key pressed:', e.code);
            this.gitCode.push(e.code);
            if (this.gitCode.length > this.gitSequence.length) {
                this.gitCode.shift();
            }
            
            if (this.gitCode.join(',') === this.gitSequence.join(',')) {
                console.log('Git Code activated!');
                this.triggerGitEffect();
                const message = currentLanguage === 'pt' ?
                    '📝 Git Ativado! Commits a voar! 📝' :
                    '📝 Git Activated! Commits flying! 📝';
                showEasterEggIndicator('Git Code!', 'corner');
                this.gitCode = [];
            }
        });
    }

    bindLegoCode() {
        document.addEventListener('keydown', (e) => {
            console.log('Lego key pressed:', e.code);
            this.legoCode.push(e.code);
            if (this.legoCode.length > this.legoSequence.length) {
                this.legoCode.shift();
            }
            
            if (this.legoCode.join(',') === this.legoSequence.join(',')) {
                console.log('Lego Code activated!');
                this.triggerLegoEffect();
                const message = currentLanguage === 'pt' ?
                    '🧱 Lego Ativado! Peças a construir! 🧱' :
                    '🧱 Lego Activated! Building blocks! 🧱';
                showEasterEggIndicator('Lego Code!', 'corner');
                this.legoCode = [];
            }
        });
    }

    bindCinemaCode() {
        document.addEventListener('keydown', (e) => {
            console.log('Cinema key pressed:', e.code);
            this.cinemaCode.push(e.code);
            if (this.cinemaCode.length > this.cinemaSequence.length) {
                this.cinemaCode.shift();
            }
            
            if (this.cinemaCode.join(',') === this.cinemaSequence.join(',')) {
                console.log('Cinema Code activated!');
                this.triggerCinemaEffect();
                const message = currentLanguage === 'pt' ?
                    '🎬 Cinema Ativado! Filmes a projetar! 🎬' :
                    '🎬 Cinema Activated! Movies projecting! 🎬';
                showEasterEggIndicator('Cinema Code!', 'corner');
                this.cinemaCode = [];
            }
        });
    }

    bindSurfCode() {
        document.addEventListener('keydown', (e) => {
            this.surfCode.push(e.code);
            if (this.surfCode.length > this.surfSequence.length) this.surfCode.shift();
            if (this.surfCode.join(',') === this.surfSequence.join(',')) {
                console.log('Surf Code activated!');
                this.triggerSurfMode();
                showEasterEggIndicator('Surf Mode!', 'corner');
                this.surfCode = [];
            }
        });
    }
    bindGardenCode() {
        document.addEventListener('keydown', (e) => {
            this.gardenCode.push(e.code);
            if (this.gardenCode.length > this.gardenSequence.length) this.gardenCode.shift();
            if (this.gardenCode.join(',') === this.gardenSequence.join(',')) {
                console.log('Garden Code activated!');
                this.triggerGardenBloom();
                showEasterEggIndicator('Garden Bloom!', 'corner');
                this.gardenCode = [];
            }
        });
    }
    bindApigeeCode() {
        document.addEventListener('keydown', (e) => {
            this.apigeeCode.push(e.code);
            if (this.apigeeCode.length > this.apigeeSequence.length) this.apigeeCode.shift();
            if (this.apigeeCode.join(',') === this.apigeeSequence.join(',')) {
                console.log('Apigee Code activated!');
                this.triggerApigeeRain();
                showEasterEggIndicator('Apigee Rain!', 'corner');
                this.apigeeCode = [];
            }
        });
    }

    bindSpecialClicks() {
        // Click on logo 5 times for special effect
        let logoClicks = 0;
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.addEventListener('click', () => {
                logoClicks++;
                if (logoClicks === 5) {
                    this.triggerLogoEffect();
                    logoClicks = 0;
                }
                setTimeout(() => logoClicks = 0, 2000); // Reset after 2 seconds
            });
        }

        // Triple click on hero title
        let titleClicks = 0;
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.addEventListener('click', () => {
                titleClicks++;
                if (titleClicks === 3) {
                    this.triggerTitleEffect();
                    titleClicks = 0;
                }
                setTimeout(() => titleClicks = 0, 2000);
            });
        }
    }

    bindHoverEggs() {
        // Special hover effects for tech items
        document.querySelectorAll('.tech-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (Math.random() < 0.1) { // 10% chance
                    this.triggerTechGlitch(item);
                }
            });
        });

        // Passion cards are handled by PassionCards class
    }

    bindConsoleEggs() {
        // Console easter egg
        console.log(`
🎵 Bem-vindo ao Portfolio da Inês Lino! 🎵

🚀 Funcionalidades:
- Sistema bilingue (PT/EN)
- Pop-ups de hobbies sem sobreposição
- Tecnologias reais (Google Apigee, AWS, etc.)
- Experiência atualizada com dados do LinkedIn
- Certificações e publicações
- Logo melhorado
- Efeitos hover para filmes/séries

🎯 Easter Eggs Disponíveis:
- Konami Code: ↑↑↓↓←→←→BA (Rainbow Effect)
- DevOps Code: DEVOP (Pipeline Animation)
- Music Code: MUSIC (Vinyl Collection)
- Cooking Code: COOK (Recipe Unlock)
- Gaming Code: GAME (Level Up)
- React Code: REACT (Components Rendering)
- Docker Code: DOCKER (Containers Sailing)
- Kubernetes Code: KUBE (Pods Scaling)
- AWS Code: AWS (Cloud Computing)
- Git Code: GIT (Commits Flying)
- Lego Code: LEGO (Building Blocks)
- Cinema Code: CINEMA (Movies Projecting)
- Logo Click x5: Special Animation
- Hero Title x3: Title Effect
- Random Tech Glitch: 10% chance on hover
- Random Passion Sparkle: 15% chance on hover

Como música, DevOps é sobre harmonia e ritmo.
Cada deploy é uma nota na sinfonia do software.

🎸 Música + 🍳 Culinária + ⚙️ DevOps + 🎬 Cinema = Harmonia Perfeita

Construído com ❤️ e muito ☕

Experimenta os códigos secretos para surpresas especiais!

🧪 TESTE: Digite 'testEasterEggs()' no console para testar todos os easter eggs!
        `);
        
        // Add test function to window for debugging
        window.testEasterEggs = () => {
            console.log('🧪 Testing all easter eggs...');
            this.triggerDevOpsEffect();
            setTimeout(() => this.triggerMusicEffect(), 1000);
            setTimeout(() => this.triggerCookingEffect(), 2000);
            setTimeout(() => this.triggerGamingEffect(), 3000);
            setTimeout(() => this.triggerRainbowEffect(), 4000);
            
            // New creative easter eggs
            setTimeout(() => this.triggerReactEffect(), 5000);
            setTimeout(() => this.triggerDockerEffect(), 6000);
            setTimeout(() => this.triggerKubernetesEffect(), 7000);
            setTimeout(() => this.triggerAWSEffect(), 8000);
            setTimeout(() => this.triggerGitEffect(), 9000);
            setTimeout(() => this.triggerLegoEffect(), 10000);
            setTimeout(() => this.triggerCinemaEffect(), 11000);
            
            console.log('✅ All easter eggs tested!');
        };
    }

    triggerRainbowEffect() {
        document.body.style.animation = 'rainbow 3s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
        
        // Add floating vinyl records
        this.createFloatingElements(['💿', '💿', '💿', '💿', '💿'], 20);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('konami_code');
        }
    }

    triggerDevOpsEffect() {
        // Create pipeline animation
        const pipeline = document.createElement('div');
        pipeline.className = 'devops-pipeline-effect';
        pipeline.innerHTML = `
            <div class="pipeline-step">BUILD</div>
            <div class="pipeline-step">TEST</div>
            <div class="pipeline-step">SECURITY</div>
            <div class="pipeline-step">DEPLOY</div>
            <div class="pipeline-step">MONITOR</div>
        `;
        
        document.body.appendChild(pipeline);
        
        setTimeout(() => {
            pipeline.remove();
        }, 3000);
        
        // Add floating DevOps emojis
        this.createFloatingElements(['🚀', '⚙️', '🔧', '📊', '🛡️'], 15);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('devops_code');
        }
    }

    triggerMusicEffect() {
        // Existing lightweight effect
        const vinyl = document.createElement('div');
        vinyl.className = 'vinyl-effect';
        vinyl.innerHTML = '🖤';
        document.body.appendChild(vinyl);
        setTimeout(() => vinyl.remove(), 2000);

        // Advanced: WebAudio visualizer overlay (non-blocking, self-cleans)
        this.showMusicVisualizerOverlay(3500);
        // Vinyl turntable overlay
        this.showTurntableOverlay(3500);

        // Floating vinyls
        this.createFloatingElements(['🖤', '🖤', '🖤', '🖤', '🖤'], 20);

        if (typeof trackEasterEgg === 'function') { trackEasterEgg('music_code'); }
    }

    triggerCookingEffect() {
        // Create cooking animation
        const cooking = document.createElement('div');
        cooking.className = 'cooking-effect';
        cooking.innerHTML = '🍳';
        
        document.body.appendChild(cooking);
        
        setTimeout(() => {
            cooking.remove();
        }, 2000);
        
        // Add floating cooking emojis
        this.createFloatingElements(['🍳', '🥘', '🍲', '🥗', '🧄', '🧅', '🌶️'], 20);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('cooking_code');
        }
    }

    triggerGamingEffect() {
        // Create gaming animation
        const gaming = document.createElement('div');
        gaming.className = 'gaming-effect';
        gaming.innerHTML = '🎮';
        
        document.body.appendChild(gaming);
        
        setTimeout(() => {
            gaming.remove();
        }, 2000);
        
        // Add floating gaming emojis
        this.createFloatingElements(['🎮', '🕹️', '🎯', '🏆', '⭐', '💎', '🔮'], 18);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('gaming_code');
        }
    }

    // New creative trigger effects
    triggerReactEffect() {
        // Create React component animation
        const react = document.createElement('div');
        react.className = 'react-effect';
        react.innerHTML = '⚛️';
        
        document.body.appendChild(react);
        
        setTimeout(() => {
            react.remove();
        }, 2000);
        
        // Add floating React elements
        this.createFloatingElements(['⚛️', '⚛️', '⚛️', '⚛️', '⚛️'], 15);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('react_code');
        }
    }

    triggerDockerEffect() {
        // Create Docker whale animation
        const docker = document.createElement('div');
        docker.className = 'docker-effect';
        docker.innerHTML = '🐳';
        
        document.body.appendChild(docker);
        
        setTimeout(() => {
            docker.remove();
        }, 2000);
        
        // Add floating Docker containers
        this.createFloatingElements(['🐳', '📦', '📦', '📦', '📦'], 20);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('docker_code');
        }
    }

    triggerKubernetesEffect() {
        // Create Kubernetes wheel animation
        const k8s = document.createElement('div');
        k8s.className = 'kubernetes-effect';
        k8s.innerHTML = '☸️';
        
        document.body.appendChild(k8s);
        
        setTimeout(() => {
            k8s.remove();
        }, 2000);
        
        // Add floating Kubernetes pods
        this.createFloatingElements(['☸️', '☸️', '☸️', '☸️', '☸️'], 18);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('kubernetes_code');
        }
    }

    triggerAWSEffect() {
        // Create AWS cloud animation
        const aws = document.createElement('div');
        aws.className = 'aws-effect';
        aws.innerHTML = '☁️';
        
        document.body.appendChild(aws);
        
        setTimeout(() => {
            aws.remove();
        }, 2000);
        
        // Add floating AWS services
        this.createFloatingElements(['☁️', '☁️', '☁️', '☁️', '☁️'], 25);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('aws_code');
        }
    }

    triggerGitEffect() {
        // Create Git commit animation
        const git = document.createElement('div');
        git.className = 'git-effect';
        git.innerHTML = '📝';
        
        document.body.appendChild(git);
        
        setTimeout(() => {
            git.remove();
        }, 2000);
        
        // Add floating Git commits
        this.createFloatingElements(['📝', '📝', '📝', '📝', '📝'], 22);
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('git_code');
        }
    }

    triggerLegoEffect() {
        // Existing lightweight effect
        const lego = document.createElement('div');
        lego.className = 'lego-effect';
        lego.innerHTML = '🧱';
        document.body.appendChild(lego);
        setTimeout(() => lego.remove(), 2000);

        // Advanced: try 3D Lego overlay (graceful fallback)
        this.showLegoOverlay3D(4000);

        // Floating bricks
        this.createFloatingElements(['🧱', '🧱', '🧱', '🧱', '🧱'], 16);

        if (typeof trackEasterEgg === 'function') { trackEasterEgg('lego_code'); }
    }

    triggerCinemaEffect() {
        // Existing lightweight effect
        const cinema = document.createElement('div');
        cinema.className = 'cinema-effect';
        cinema.innerHTML = '🎬';
        document.body.appendChild(cinema);
        setTimeout(() => cinema.remove(), 2000);

        // Advanced: film-burn overlay (pure CSS, self-cleans)
        this.showFilmBurnOverlay(1200);

        // Floating cinema icons
        this.createFloatingElements(['🎬', '🎬', '🎬', '🎬', '🎬'], 20);

        if (typeof trackEasterEgg === 'function') { trackEasterEgg('cinema_code'); }
    }

    // ============ Advanced Overlays (non-blocking, self-cleaning) ============
    showMusicVisualizerOverlay(lifetimeMs = 3000) {
        try {
            const overlay = document.createElement('div');
            overlay.className = 'visualizer-overlay';
            const canvas = document.createElement('canvas');
            overlay.appendChild(canvas);
            document.body.appendChild(overlay);

            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            function resize() {
                canvas.width = Math.floor(window.innerWidth * dpr);
                canvas.height = Math.floor(window.innerHeight * dpr);
            }
            resize();
            const onResize = () => resize();
            window.addEventListener('resize', onResize);

            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            const actx = new AudioContextClass();
            const analyser = actx.createAnalyser();
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // Generate audio safely (no mic needed): low-volume oscillator + gain
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 220;
            gain.gain.value = 0.0001; // inaudible
            osc.connect(gain).connect(analyser).connect(actx.destination);
            osc.start();

            let rafId = null;
            const bars = Math.min(64, bufferLength);
            function render() {
                analyser.getByteFrequencyData(dataArray);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const width = canvas.width;
                const height = canvas.height;
                const barWidth = (width / bars) * 0.8;
                const gap = (width / bars) * 0.2;
                for (let i = 0; i < bars; i++) {
                    const v = dataArray[i] / 255;
                    const barHeight = v * (height * 0.35);
                    const x = i * (barWidth + gap);
                    const y = height - barHeight - (height * 0.1);
                    const hue = 250 + i * 1.2; // purple/blue
                    ctx.fillStyle = `hsla(${hue}, 85%, 60%, 0.9)`;
                    ctx.fillRect(x, y, barWidth, barHeight);
                }
                rafId = requestAnimationFrame(render);
            }
            render();

            setTimeout(() => {
                cancelAnimationFrame(rafId);
                try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch(_) {}
                try { actx.close(); } catch(_) {}
                window.removeEventListener('resize', onResize);
                overlay.remove();
            }, lifetimeMs);
        } catch (err) {
            // Fallback: ignore silently to avoid breaking UX
            console.warn('Visualizer overlay failed:', err);
        }
    }

    // Turntable overlay for music
    showTurntableOverlay(lifetimeMs = 3500) {
        const wrap = document.createElement('div');
        wrap.className = 'turntable-overlay';
        wrap.innerHTML = `
            <div class="turntable">
                <div class="platter"><div class="vinyl-disc"></div></div>
                <div class="tonearm"></div>
                <div class="turntable-label">INÊS LINO • VINYL</div>
            </div>`;
        document.body.appendChild(wrap);
        setTimeout(() => wrap.remove(), lifetimeMs);
    }

    triggerSurfMode(duration = 6000) {
        const overlay = document.createElement('div');
        overlay.className = 'surf-overlay';
        overlay.innerHTML = `<div class="surf-wave"></div><div class="surf-wave"></div><div class="surf-wave"></div><div class="surf-wave"></div>`;
        document.body.appendChild(overlay);
        document.documentElement.classList.add('cursor-surf');
        setTimeout(() => { overlay.remove(); document.documentElement.classList.remove('cursor-surf'); }, duration);
    }

    triggerGardenBloom() {
        const flowers = ['🌸','🌼','🌺','🌻','🌷','🍀'];
        const bees = ['🐝'];
        for (let i = 0; i < 24; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.className = Math.random() < 0.15 ? 'garden-bee' : 'garden-flower';
                el.textContent = Math.random() < 0.15 ? bees[0] : flowers[Math.floor(Math.random()*flowers.length)];
                el.style.left = Math.random()*100 + 'vw';
                el.style.top = (60 + Math.random()*35) + 'vh';
                el.style.fontSize = (18 + Math.random()*18) + 'px';
                el.style.opacity = '0';
                document.body.appendChild(el);
                el.animate([
                    { transform: 'translateY(10px) scale(0.8)', opacity: 0 },
                    { transform: 'translateY(0) scale(1)', opacity: 1 }
                ], { duration: 500, fill: 'forwards', easing: 'ease-out' });
                setTimeout(() => el.remove(), 4500);
            }, i*80);
        }
    }

    triggerApigeeRain() {
        const icons = ['🧩','🔐','⚙️','📈','🛰️'];
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const d = document.createElement('div');
                d.className = 'apigee-drop';
                d.textContent = icons[i % icons.length];
                d.style.left = Math.random()*100 + 'vw';
                d.style.transform = `translateY(0) rotate(${(Math.random()*90-45).toFixed(0)}deg)`;
                document.body.appendChild(d);
                setTimeout(() => d.remove(), 2600);
            }, i*50);
        }
    }

    showFilmBurnOverlay(lifetimeMs = 1200) {
        const overlay = document.createElement('div');
        overlay.className = 'film-burn-overlay';
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), lifetimeMs + 50);
    }

    showLegoOverlay3D(lifetimeMs = 4000) {
        // Attempt dynamic three.js load; fallback gracefully if blocked
        const existing = document.querySelector('script[data-three="1"]');
        const ensureThree = () => new Promise((resolve, reject) => {
            if (window.THREE) return resolve(window.THREE);
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/three@0.155.0/build/three.min.js';
            s.async = true;
            s.crossOrigin = 'anonymous';
            s.dataset.three = '1';
            s.onload = () => resolve(window.THREE);
            s.onerror = reject;
            document.head.appendChild(s);
        });

        ensureThree().then((THREE) => {
            const overlay = document.createElement('div');
            overlay.className = 'lego-overlay';
            overlay.style.pointerEvents = 'none';
            const canvas = document.createElement('canvas');
            overlay.appendChild(canvas);
            document.body.appendChild(overlay);

            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio || 1);
            renderer.setSize(window.innerWidth, window.innerHeight);
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.set(0, 2.2, 5);

            const light = new THREE.DirectionalLight(0xffffff, 1.0);
            light.position.set(2, 5, 3);
            scene.add(light);
            scene.add(new THREE.AmbientLight(0xffffff, 0.6));

            // Simple Lego-like brick geometry (studs approximated)
            const brickMaterial = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.1, roughness: 0.6 });
            const group = new THREE.Group();
            scene.add(group);

            function makeBrick(w = 2, h = 1, d = 1, color = 0xf59e0b) {
                const mat = brickMaterial.clone();
                mat.color.setHex(color);
                const geom = new THREE.BoxGeometry(w, h, d);
                const mesh = new THREE.Mesh(geom, mat);
                // studs
                const studGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 20);
                const studMat = new THREE.MeshStandardMaterial({ color: mat.color });
                const studs = new THREE.Group();
                const cols = Math.max(1, Math.round(w));
                const rows = Math.max(1, Math.round(d));
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        const stud = new THREE.Mesh(studGeom, studMat);
                        stud.position.set(-w/2 + 0.5 + i, h/2 + 0.08, -d/2 + 0.5 + j);
                        studs.add(stud);
                    }
                }
                const brick = new THREE.Group();
                brick.add(mesh);
                brick.add(studs);
                return brick;
            }

            const palette = [0xf59e0b, 0x10b981, 0x6366f1, 0xef4444, 0x8b5cf6];
            for (let i = 0; i < 12; i++) {
                const w = [2, 3, 4][Math.floor(Math.random() * 3)];
                const d = [1, 2][Math.floor(Math.random() * 2)];
                const color = palette[i % palette.length];
                const brick = makeBrick(w, 0.6, d, color);
                brick.position.set((Math.random() - 0.5) * 4, Math.random() * 2 - 1, (Math.random() - 0.5) * 3);
                brick.rotation.set(Math.random() * 0.5, Math.random() * 2, Math.random() * 0.5);
                group.add(brick);
            }

            let rafId = null;
            function animate() {
                group.rotation.y += 0.01;
                renderer.render(scene, camera);
                rafId = requestAnimationFrame(animate);
            }
            animate();

            function onResize() {
                const w = window.innerWidth, h = window.innerHeight;
                renderer.setSize(w, h);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            }
            window.addEventListener('resize', onResize);

            setTimeout(() => {
                cancelAnimationFrame(rafId);
                window.removeEventListener('resize', onResize);
                renderer.dispose();
                overlay.remove();
            }, lifetimeMs);
        }).catch(() => {
            // Fallback: confetti of bricks only
            this.createFloatingElements(['🧱','🧱','🧱','🧱'], 20);
        });
    }

    triggerLogoEffect() {
        const logo = document.querySelector('.nav-logo');
        logo.style.animation = 'logoSpin 1s ease-in-out';
        setTimeout(() => {
            logo.style.animation = '';
        }, 1000);
        
        showEasterEggIndicator('Logo Master!', 'corner');
        createFloatingEmoji('🎯', event.clientX, event.clientY);
    }

    triggerTitleEffect() {
        const title = document.querySelector('.hero-title');
        title.style.animation = 'titleGlow 2s ease-in-out';
        setTimeout(() => {
            title.style.animation = '';
        }, 2000);
        
        showEasterEggIndicator('Title Power!', 'corner');
        createFloatingEmoji('✨', event.clientX, event.clientY);
    }

    triggerTechGlitch(element) {
        // Prevent multiple glitches on the same element
        if (element.classList.contains('glitching')) {
            return;
        }
        
        element.classList.add('glitching');
        
        // Apply glitch animation to the entire element
        element.style.animation = 'techGlitch 0.8s ease-in-out';
        
        // Apply glitch effect to text
        const textElement = element.querySelector('span');
        if (textElement) {
            textElement.style.animation = 'techGlitchText 0.8s ease-in-out';
        }
        
        // Create glitch particles effect
        this.createGlitchParticles(element);
        
        // Reset after animation
        setTimeout(() => {
            element.style.animation = '';
            element.classList.remove('glitching');
            if (textElement) {
                textElement.style.animation = '';
            }
        }, 800);
        
        const message = currentLanguage === 'pt' ?
            '⚡ Tech Glitch! Sistema corrompido! ⚡' :
            '⚡ Tech Glitch! System corrupted! ⚡';
        showNotification(message, 'warning');
        
        // Track analytics
        if (typeof trackEasterEgg === 'function') {
            trackEasterEgg('tech_glitch');
        }
    }

    createGlitchParticles(element) {
        const rect = element.getBoundingClientRect();
        const particles = ['⚡', '💥', '🔥', '⚡', '💥'];
        
        particles.forEach((particle, index) => {
            setTimeout(() => {
                const particleEl = document.createElement('div');
                particleEl.textContent = particle;
                particleEl.style.position = 'fixed';
                particleEl.style.left = rect.left + Math.random() * rect.width + 'px';
                particleEl.style.top = rect.top + Math.random() * rect.height + 'px';
                particleEl.style.fontSize = '1.5rem';
                particleEl.style.pointerEvents = 'none';
                particleEl.style.zIndex = '9999';
                particleEl.style.animation = 'fadeInScale 0.3s ease forwards';
                
                document.body.appendChild(particleEl);
                
                // Remove particle after animation
                setTimeout(() => {
                    particleEl.remove();
                }, 1000);
            }, index * 100);
        });
    }

    createFloatingElements(emojis, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const element = document.createElement('div');
                element.style.cssText = `
                    position: fixed;
                    width: 30px;
                    height: 30px;
                    left: ${Math.random() * 100}vw;
                    top: -30px;
                    z-index: 3000;
                    animation: floatDown 3s linear forwards;
                    font-size: 24px;
                    pointer-events: none;
                `;
                element.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                document.body.appendChild(element);
                
                setTimeout(() => element.remove(), 3000);
            }, i * 100);
        }
    }
}

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Master initialization function
function initializeAll() {
    // Fix navbar text duplication first
    fixNavbarText();
    
    // Initialize all systems in correct order with performance optimization
    requestAnimationFrame(() => {
        new CustomScrollAnimations();
        new TechShowcase();
        new SkillBars();
        new CounterAnimation();
        new PassionCards();
        new MovieQuotesAnimation();
        new ProjectCards();
        new PublicationCards();
        new MovieEffects();
        new EasterEggsSystem();
        new TimelineAnimations();
    });
    // Command Palette & Recruiter Mode wiring
    setupCommandPalette();
    setupRecruiterMode();
    
    // Count projects delivered and update stat dynamically
    const projectsDelivered = document.querySelectorAll('.projects .project-card').length;
    const statEl = Array.from(document.querySelectorAll('.stat-label'))
        .find(el => el.dataset.pt === 'Projetos Entregues');
    if (statEl) {
        const numberEl = statEl.previousElementSibling;
        if (numberEl && numberEl.classList.contains('stat-number')) {
            numberEl.dataset.target = String(projectsDelivered);
            numberEl.textContent = '0';
        }
    }
    
    // Easter egg hint button functionality
    if (hintBtn) {
        hintBtn.addEventListener('click', () => {
            showEasterEggModal();
        });
    }
    
    // Mark truncated descriptions
    markTruncatedDescriptions();
    
    // Setup timeline scroll controls
    const timelineScroll = document.querySelector('.timeline-scroll');
    const prevBtn = document.querySelector('.timeline-scroll-btn.prev');
    const nextBtn = document.querySelector('.timeline-scroll-btn.next');
    
    if (timelineScroll && prevBtn && nextBtn) {
        const updateButtons = () => {
            const scrollLeft = timelineScroll.scrollLeft;
            const maxScroll = timelineScroll.scrollWidth - timelineScroll.clientWidth;
            
            prevBtn.disabled = scrollLeft <= 0;
            nextBtn.disabled = scrollLeft >= maxScroll - 10;
        };
        
        updateButtons();
        timelineScroll.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
    }
    
    // Language toggle updates
    const langBtnEl = document.getElementById('langBtn');
    if (langBtnEl) {
        langBtnEl.addEventListener('click', () => {
            setTimeout(markTruncatedDescriptions, 50);
            updateLanguage(); // Add this to ensure language update
        });
    }
    
    // Resize observer for project cards
    const ro = new ResizeObserver(() => {
        clearTimeout(window.__truncateTimer);
        window.__truncateTimer = setTimeout(markTruncatedDescriptions, 60);
    });
    document.querySelectorAll('.project-card').forEach(card => ro.observe(card));
    
    // Optimized lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Use requestAnimationFrame for better performance
                requestAnimationFrame(() => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
                });
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before image comes into view
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Optimized scroll animations observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('fade-in-up');
                });
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        scrollObserver.observe(section);
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAll);

// Additional fix for navbar text after page load
window.addEventListener('load', () => {
    setTimeout(fixNavbarText, 100);
});

// Continuous fix for navbar text - run every 500ms for first 5 seconds
let fixAttempts = 0;
const maxAttempts = 10;
const fixInterval = setInterval(() => {
    fixNavbarText();
    fixAttempts++;
    if (fixAttempts >= maxAttempts) {
        clearInterval(fixInterval);
    }
}, 500);

// Command Palette Implementation
function setupCommandPalette() {
    const root = document.getElementById('cmdk');
    const input = document.getElementById('cmdk-input');
    const list = document.getElementById('cmdk-list');
    if (!root || !input || !list) return;

    const items = [
        { label: 'Go: Home', action: () => scrollToSection('home'), meta: 'section' },
        { label: 'Go: About', action: () => scrollToSection('about'), meta: 'section' },
        { label: 'Go: Skills', action: () => scrollToSection('skills'), meta: 'section' },
        { label: 'Go: Experience', action: () => scrollToSection('experience'), meta: 'section' },
        { label: 'Go: Projects', action: () => scrollToSection('projects'), meta: 'section' },
        { label: 'Go: Publications', action: () => scrollToSection('publications'), meta: 'section' },
        { label: 'Go: Certifications', action: () => scrollToSection('certifications'), meta: 'section' },
        { label: 'Go: Testimonials', action: () => scrollToSection('testimonials'), meta: 'section' },
        { label: 'Toggle: Theme', action: () => document.getElementById('themeBtn')?.click(), meta: 'toggle' },
        { label: 'Toggle: Language', action: () => document.getElementById('langBtn')?.click(), meta: 'toggle' },
        { label: 'Toggle: Recruiter Mode', action: () => document.getElementById('recruiterToggle')?.click(), meta: 'toggle' },
    ];

    let filtered = items;
    let selected = 0;

    function render() {
        list.innerHTML = '';
        filtered.forEach((it, idx) => {
            const el = document.createElement('div');
            el.className = 'cmdk-item';
            el.setAttribute('role', 'option');
            el.setAttribute('aria-selected', String(idx === selected));
            el.textContent = it.label;
            const meta = document.createElement('span');
            meta.className = 'meta';
            meta.textContent = it.meta;
            el.appendChild(meta);
            el.addEventListener('click', () => { it.action(); hide(); });
            list.appendChild(el);
        });
    }

    function show() {
        root.setAttribute('aria-hidden', 'false');
        input.value = '';
        filtered = items;
        selected = 0;
        render();
        setTimeout(() => input.focus(), 0);
    }
    function hide() { root.setAttribute('aria-hidden', 'true'); }

    input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        filtered = items.filter(i => i.label.toLowerCase().includes(q));
        selected = 0;
        render();
    });

    root.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { hide(); }
        if (e.key === 'ArrowDown') { selected = Math.min(selected + 1, filtered.length - 1); render(); e.preventDefault(); }
        if (e.key === 'ArrowUp') { selected = Math.max(selected - 1, 0); render(); e.preventDefault(); }
        if (e.key === 'Enter') { filtered[selected]?.action(); hide(); }
    });
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const open = root.getAttribute('aria-hidden') === 'false';
            open ? hide() : show();
        }
        if (e.key === '?' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { show(); }
    });
}

// Recruiter Mode Implementation
function setupRecruiterMode() {
    const btn = document.getElementById('recruiterToggle');
    if (!btn) return;
    const key = 'recruiter-mode';
    
    function apply(v) { 
        document.body.classList.toggle('recruiter', v); 
        btn.setAttribute('aria-pressed', String(v));
        
        // Add/remove banner
        const existingBanner = document.querySelector('.recruiter-banner');
        if (v && !existingBanner) {
            const banner = document.createElement('div');
            banner.className = 'recruiter-banner';
            banner.innerHTML = '📄 Recruiter Mode: One-page summary for quick scanning • All sections visible • Click button to toggle';
            document.body.appendChild(banner);
            
            // Populate recruiter summary with real data
            populateRecruiterSummary();
            
            // Initialize recruiter language button immediately
            initRecruiterLanguageButton();
        } else if (!v && existingBanner) {
            existingBanner.remove();
        }
    }
    
    apply(false); // Always start in normal mode
    
    btn.addEventListener('click', () => {
        const next = !(document.body.classList.contains('recruiter'));
        apply(next);
        localStorage.setItem(key, next ? '1' : '0');
        
        // Show notification
        const message = next ? 
            '📄 Recruiter Mode ON: One-page summary activated' : 
            '🎨 Recruiter Mode OFF: Full experience restored';
        showNotification(message, 'info');
    });
}

// Helper function to determine if words should be combined
function shouldCombineWords(word, nextWord) {
    if (!nextWord) return false;
    
    const compoundTechs = [
        'TM Forum APIs',
        'API Gateway', 
        'AWS Image Builder',
        'Cluster Autoscaler',
        'Windows Scheduled Tasks',
        'AWS Cloudformation',
        'AWS S3',
        'Google Apigee',
        'AWS CloudWatch',
        'AWS EKS',
        'AWS EC2',
        'AWS VPC',
        'AWS ALB',
        'AWS EFS',
        'Google Cloud',
        'Microsoft Azure',
        'Kubernetes Engine',
        'Docker Compose',
        'GitHub Actions',
        'Jenkins Pipeline',
        'Terraform Cloud',
        'Ansible Playbook',
        'Prometheus Grafana',
        'Elastic Stack',
        'Apache Kafka',
        'Redis Cluster',
        'MongoDB Atlas',
        'PostgreSQL Database',
        'MySQL Database',
        'Node.js',
        'React.js',
        'Vue.js',
        'Angular.js',
        'Express.js',
        'Spring Boot',
        'Django Framework',
        'Flask Framework',
        'Laravel Framework',
        'Symfony Framework',
        'Ruby on Rails',
        'ASP.NET',
        'Entity Framework',
        'Hibernate ORM',
        'JPA Specification',
        'REST API',
        'GraphQL API',
        'SOAP API',
        'gRPC API',
        'WebSocket API',
        'OAuth 2.0',
        'JWT Token',
        'OpenID Connect',
        'SAML Authentication',
        'LDAP Directory',
        'Active Directory',
        'Single Sign-On',
        'Multi-Factor Authentication',
        'Certificate Authority',
        'SSL/TLS',
        'HTTPS Protocol',
        'HTTP/2',
        'WebSocket Protocol',
        'TCP/IP',
        'UDP Protocol',
        'DNS Resolution',
        'Load Balancer',
        'Reverse Proxy',
        'CDN Network',
        'Edge Computing',
        'Serverless Functions',
        'Microservices Architecture',
        'Event-Driven Architecture',
        'CQRS Pattern',
        'Event Sourcing',
        'Domain-Driven Design',
        'Test-Driven Development',
        'Behavior-Driven Development',
        'Continuous Integration',
        'Continuous Deployment',
        'Continuous Delivery',
        'Infrastructure as Code',
        'Configuration Management',
        'Secret Management',
        'Container Orchestration',
        'Service Mesh',
        'API Management',
        'Service Discovery',
        'Circuit Breaker',
        'Bulkhead Pattern',
        'Retry Pattern',
        'Timeout Pattern',
        'Rate Limiting',
        'Throttling Mechanism',
        'Caching Strategy',
        'Database Sharding',
        'Read Replicas',
        'Write-Ahead Logging',
        'ACID Properties',
        'CAP Theorem',
        'BASE Properties',
        'Eventual Consistency',
        'Strong Consistency',
        'Distributed Systems',
        'Consensus Algorithm',
        'Leader Election',
        'Split-Brain Problem',
        'Network Partitioning',
        'Byzantine Fault Tolerance',
        'Paxos Algorithm',
        'Raft Algorithm',
        'Gossip Protocol',
        'Vector Clocks',
        'Lamport Timestamps',
        'CRDTs',
        'Event Streaming',
        'Message Queues',
        'Pub/Sub Pattern',
        'Event Bus',
        'Command Query',
        'Saga Pattern',
        'Two-Phase Commit',
        'Three-Phase Commit',
        'Distributed Transactions',
        'Compensating Transactions',
        'Outbox Pattern',
        'Inbox Pattern',
        'Idempotency Key',
        'Idempotent Operations',
        'Idempotent Design',
        'Idempotent API',
        'Idempotent Service',
        'Idempotent Function',
        'Idempotent Method',
        'Idempotent Request',
        'Idempotent Response',
        'Idempotent Handler',
        'Idempotent Controller',
        'Idempotent Repository',
        'Idempotent Database',
        'Idempotent Storage',
        'Idempotent Cache',
        'Idempotent Queue',
        'Idempotent Stream',
        'Idempotent Event',
        'Idempotent Message',
        'Idempotent Command',
        'Idempotent Query',
        'Idempotent Mutation',
        'Idempotent Operation',
        'Idempotent Action',
        'Idempotent Task',
        'Idempotent Job',
        'Idempotent Process',
        'Idempotent Workflow',
        'Idempotent Pipeline',
        'Idempotent Chain',
        'Idempotent Sequence',
        'Idempotent Series',
        'Idempotent Batch',
        'Idempotent Group',
        'Idempotent Set',
        'Idempotent Collection',
        'Idempotent Array',
        'Idempotent List',
        'Idempotent Map',
        'Idempotent Dictionary',
        'Idempotent Hash',
        'Idempotent Table',
        'Idempotent Record',
        'Idempotent Entry',
        'Idempotent Item',
        'Idempotent Element',
        'Idempotent Component',
        'Idempotent Module'
    ];
    
    // Check if current word + next word forms a compound technology
    const combined = `${word} ${nextWord}`;
    return compoundTechs.some(tech => tech.toLowerCase().includes(combined.toLowerCase()));
}

// Populate recruiter summary with real data from the page
function populateRecruiterSummary() {
    // Prevent multiple executions
    if (document.getElementById('recruiterSkills').children.length > 0) {
        return; // Already populated
    }
    
    // Get hero information
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    
    // Name is already set correctly in HTML, no need to override
    // Title is already set correctly in HTML, no need to override
    
    // Populate skills - separate main skills from improvement areas
    const skillsContainer = document.getElementById('recruiterSkills');
    const skillItems = document.querySelectorAll('.skill-item');
    skillsContainer.innerHTML = '';
    
    // Get improvement area skills to exclude them
    const improvementSkills = document.querySelectorAll('.skill-category:last-child .skill-item');
    const improvementSkillTexts = Array.from(improvementSkills).map(skill => skill.textContent.trim());
    
    // Additional skills to exclude (they are in areas of improvement)
    const additionalExcludeSkills = ['Machine Learning', 'Cibersegurança', 'TypeScript', 'Ansible'];
    improvementSkillTexts.push(...additionalExcludeSkills);
    
    // Collect all unique skills to avoid duplicates
    const allSkills = new Set();
    
    // Add main technical skills (exclude improvement areas)
    skillItems.forEach(skill => {
        const skillText = skill.textContent.trim();
        if (!improvementSkillTexts.includes(skillText)) {
            allSkills.add(skillText);
        }
    });
    
    // Add Docker and other missing tools (only if not already present)
    const additionalSkills = ['Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux', 'Bash', 'Terraform', 'Jenkins'];
    additionalSkills.forEach(skill => {
        allSkills.add(skill);
    });
    
    // Create skill tags for unique skills
    Array.from(allSkills).sort().forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'recruiter-skill';
        skillTag.textContent = skill;
        
        // Add translation attributes if the original skill has them
        const originalSkill = document.querySelector(`.chip[data-en="${skill}"], .chip[data-pt="${skill}"]`);
        if (originalSkill && originalSkill.hasAttribute('data-en') && originalSkill.hasAttribute('data-pt')) {
            skillTag.setAttribute('data-en', originalSkill.getAttribute('data-en'));
            skillTag.setAttribute('data-pt', originalSkill.getAttribute('data-pt'));
            console.log('Added translation attributes to technical skill:', skill, 'en:', originalSkill.getAttribute('data-en'), 'pt:', originalSkill.getAttribute('data-pt'));
        } else {
            console.log('No translation attributes found for technical skill:', skill);
        }
        
        skillsContainer.appendChild(skillTag);
    });
    
    // Add soft skills section - use real soft skills from the page
    const softSkillsContainer = document.createElement('div');
    softSkillsContainer.innerHTML = '<h4 style="margin: 1rem 0 0.5rem 0; color: var(--text-secondary); font-size: 0.9rem;">Soft Skills</h4>';
    
    // Get real soft skills from the page
    const softSkillsChips = document.querySelectorAll('.skill-category:last-child .chip');
    const softSkillsDiv = document.createElement('div');
    softSkillsDiv.style.display = 'flex';
    softSkillsDiv.style.flexWrap = 'wrap';
    softSkillsDiv.style.gap = '0.5rem';
    
    softSkillsChips.forEach(chip => {
        const skillTag = document.createElement('span');
        skillTag.className = 'recruiter-skill';
        skillTag.style.background = 'var(--secondary-color)';
        skillTag.textContent = chip.textContent.trim();
        
        // Add translation attributes if the original chip has them
        if (chip.hasAttribute('data-en') && chip.hasAttribute('data-pt')) {
            skillTag.setAttribute('data-en', chip.getAttribute('data-en'));
            skillTag.setAttribute('data-pt', chip.getAttribute('data-pt'));
            console.log('Added translation attributes to soft skill:', chip.textContent.trim(), 'en:', chip.getAttribute('data-en'), 'pt:', chip.getAttribute('data-pt'));
        } else {
            console.log('No translation attributes found for soft skill:', chip.textContent.trim());
        }
        
        softSkillsDiv.appendChild(skillTag);
    });
    
    softSkillsContainer.appendChild(softSkillsDiv);
    skillsContainer.parentNode.appendChild(softSkillsContainer);
    
    // Add areas of improvement section
    const improvementContainer = document.createElement('div');
    improvementContainer.innerHTML = '<h4 style="margin: 1rem 0 0.5rem 0; color: var(--text-secondary); font-size: 0.9rem;">Areas of Development</h4>';
    
    const improvementAreas = ['Artificial Intelligence', 'Machine Learning', 'Cibersegurança', 'Ansible', 'TypeScript', 'DevSecOps'];
    const improvementDiv = document.createElement('div');
    improvementDiv.style.display = 'flex';
    improvementDiv.style.flexWrap = 'wrap';
    improvementDiv.style.gap = '0.5rem';
    
    improvementAreas.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'recruiter-skill';
        skillTag.style.background = 'var(--accent-color)';
        skillTag.textContent = skill;
        
        // Add translation attributes if the original skill has them
        const originalSkill = document.querySelector(`.skill-item span[data-en="${skill}"], .skill-item span[data-pt="${skill}"]`);
        if (originalSkill && originalSkill.hasAttribute('data-en') && originalSkill.hasAttribute('data-pt')) {
            skillTag.setAttribute('data-en', originalSkill.getAttribute('data-en'));
            skillTag.setAttribute('data-pt', originalSkill.getAttribute('data-pt'));
            console.log('Added translation attributes to improvement skill:', skill, 'en:', originalSkill.getAttribute('data-en'), 'pt:', originalSkill.getAttribute('data-pt'));
        } else {
            console.log('No translation attributes found for improvement skill:', skill);
        }
        
        improvementDiv.appendChild(skillTag);
    });
    
    improvementContainer.appendChild(improvementDiv);
    skillsContainer.parentNode.appendChild(improvementContainer);
    
    // Populate certifications with badge links
    const certsContainer = document.getElementById('recruiterCertifications');
    certsContainer.innerHTML = '';

    // Certification data with badge links
    const certifications = [
        {
            title: 'AWS Certified Cloud Practitioner',
            date: '2024',
            badgeUrl: 'https://www.credly.com/badges/8c3319ec-b823-476d-ae8d-2e670e822621/public_url'
        },
        {
            title: 'AWS Certified Developer - Associate',
            date: '2024',
            badgeUrl: 'https://www.credly.com/badges/d4f2ca43-9306-4132-bed6-13212a4a2fd0/public_url'
        },
        {
            title: 'Deploy and Manage Apigee X Skill Badge',
            date: '2024',
            badgeUrl: 'https://www.credly.com/badges/bb93c258-a0ac-4a6a-9e8e-70f00f0a8ece/public_url'
        },
        {
            title: 'Develop and Secure APIs with Apigee X Skill Badge',
            date: '2024',
            badgeUrl: 'https://www.credly.com/badges/f857c1f3-9f92-4de9-abd4-0113d5652640/public_url'
        },
        {
            title: 'GitOps Fundamentals',
            date: '2024',
            badgeUrl: 'https://www.credly.com/badges/c5b6217d-2985-4e58-b195-03f676e8105a/public_url'
        },
        {
            title: 'HashiCorp Certified: Terraform Associate (002)',
            date: '2024',
            badgeUrl: 'https://www.credly.com/badges/ba202b71-93c3-4440-a225-c0ca66482367/public_url'
        },
        {
            title: 'Implement DevOps Workflows in Google Cloud Skill Badge',
            date: '2024',
            badgeUrl: 'https://www.credly.com/badges/006dfff1-09d6-4672-9ac1-934763a0af6e/public_url'
        },
        {
            title: 'Use Machine Learning APIs on Google Cloud Skill Badge',
            date: '2024',
            badgeUrl: 'https://www.credly.com/badges/565cf827-507c-44fb-ab7b-db209e165e77/public_url'
        },
        {
            title: 'EF SET English Certificate - C2 Proficient (80/100)',
            date: '2021',
            badgeUrl: 'https://cert.efset.org/gLxaRV'
        }
    ];

    certifications.forEach(cert => {
        const certItem = document.createElement('div');
        certItem.className = 'experience-item';

        // Create clickable title with badge link
        const titleDiv = document.createElement('div');
        titleDiv.className = 'experience-title';
        
        const titleLink = document.createElement('a');
        titleLink.href = cert.badgeUrl;
        titleLink.target = '_blank';
        titleLink.rel = 'noopener noreferrer';
        titleLink.textContent = cert.title;
        titleLink.style.color = 'var(--primary-color)';
        titleLink.style.textDecoration = 'none';
        titleLink.style.fontWeight = '600';
        
        titleDiv.appendChild(titleLink);
        certItem.appendChild(titleDiv);

        // Add date
        const dateDiv = document.createElement('div');
        dateDiv.className = 'experience-date';
        dateDiv.textContent = cert.date;
        certItem.appendChild(dateDiv);

        // Add badge icon
        const badgeIcon = document.createElement('div');
        badgeIcon.style.marginTop = '0.5rem';
        const badgeText = currentLanguage === 'pt' ? 'Ver Badge' : 'View Badge';
        badgeIcon.innerHTML = '🏆 <a href="' + cert.badgeUrl + '" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: none; font-size: 0.8rem;">' + badgeText + '</a>';
        certItem.appendChild(badgeIcon);

        certsContainer.appendChild(certItem);
    });
    
    // Populate experience
    const expContainer = document.getElementById('recruiterExperience');
    const timelineItems = document.querySelectorAll('.timeline-item-horizontal');
    expContainer.innerHTML = '';
    
    console.log('Found timeline items:', timelineItems.length); // Debug log
    
           // Define experience data with bilingual information
           const experienceData = [
               {
                   title: {
                       pt: 'Senior API Platform Engineer & DevOps Engineer',
                       en: 'Senior API Platform Engineer & DevOps Engineer'
                   },
                   company: 'MagicBeans',
                   date: {
                       pt: 'Abr 2024 - Presente · 1 ano 7 meses',
                       en: 'Apr 2024 - Present · 1 yr 7 mos'
                   },
                   description: {
                       pt: 'Lidero uma squad num projeto de gestão de APIs em larga escala para uma empresa de telecomunicações latino-americana, implementando e governando APIs no Google Apigee sob padrões TM Forum Open API. Defini melhores práticas, modelos de governação e regras de compliance entre ambientes. Atuo como líder técnica num projeto de interoperabilidade digital governamental, orientando arquitetura, design e desenvolvimento de APIs para modernizar e automatizar integração de serviços, melhorando fiabilidade e observabilidade em sistemas do setor público. Presto suporte especializado para empresa de aviação em AWS API Gateway, otimizando arquitetura de APIs, melhorando performance e segurança, e resolvendo bottlenecks de integração. Contribuo para design de soluções e propostas pré-vendas, definindo estratégias de adoção de API management e DevOps alinhadas com objetivos de negócio e melhores práticas da indústria.',
                       en: 'Leading a squad in a large-scale API Management project for a Latin American telecommunications company, implementing and governing APIs in Google Apigee under TM Forum Open API standards. Defined best practices, governance models, and compliance rules across environments. Acting as technical lead in a government digital interoperability project, guiding API architecture, design, and development to modernize and automate service integration, enhancing reliability and observability across public sector systems. Providing specialized support for an aviation company on AWS API Gateway, optimizing API architecture, improving performance and security posture, and resolving integration bottlenecks. Contributing to solution design and pre-sales proposals, defining API management and DevOps adoption strategies aligned with business goals and industry best practices.'
                   }
               },
               {
                   title: {
                       pt: 'DevOps Engineer',
                       en: 'DevOps Engineer'
                   },
                   company: 'MagicBeans',
                   date: {
                       pt: 'Fev 2021 - Abr 2024 · 3 anos 3 meses',
                       en: 'Feb 2021 - Apr 2024 · 3 yrs 3 mos'
                   },
                   description: {
                       pt: 'Ajudei clientes a migrar infraestruturas on-premises para AWS Cloud, permitindo-lhes aproveitar escalabilidade, segurança e custo-efetividade. Desenvolvi scripts PowerShell para automação de backups de ficheiros para buckets S3. Construí infraestruturas desde o zero na cloud usando serviços AWS e melhores práticas com Infrastructure as Code (Terraform e AWS CloudFormation). Implementei soluções de autoscaling Kubernetes com Karpenter e AWS EKS Cluster Autoscaler para minimizar custos e usar recursos eficientemente. Integrei ferramentas GitOps como ArgoCD, permitindo aos developers fazer deploy do código nas suas plataformas VCS (GitLab, GitHub, BitBucket) e sincronizar automaticamente mudanças no cluster Kubernetes. Desenvolvi uma solução abrangente de AMI factory usando AWS Image Builder, Lambda Functions, SNS, AWS SDK e CDK, automatizando o ciclo de vida das AMIs com melhores práticas de patch management, compliance e version control.',
                       en: 'Helped clients migrate on-premises infrastructures to AWS Cloud, enabling them to leverage scalability, security and cost-effectiveness. Developed PowerShell scripts for automation of file backups to S3 buckets. Built infrastructures from scratch in the cloud using AWS services and best practices with Infrastructure as Code (Terraform and AWS CloudFormation). Implemented Kubernetes autoscaling mechanisms with Karpenter and AWS EKS Cluster Autoscaler to minimize costs and efficiently use needed resources. Enhanced Kubernetes cluster deployments by integrating GitOps tools, such as ArgoCD, enabling developers to deploy their code on their VCS platform (GitLab, GitHub, BitBucket) and automatically synchronize changes in the Kubernetes cluster. Developed a comprehensive AMI factory solution using AWS Image Builder, Lambda Functions, SNS, AWS SDK and CDK, streamlining the creation, management, and deployment of Amazon Machine Images (AMIs) to ensure consistency, security, and efficiency across environments.'
                   }
               },
               {
                   title: {
                       pt: 'Software QA Tester',
                       en: 'Software QA Tester'
                   },
                   company: {
                       pt: 'Freelance (uTest)',
                       en: 'Freelance (uTest)'
                   },
                   date: {
                       pt: 'Fev 2020 - Out 2021 · Remoto',
                       en: 'Feb 2020 - Oct 2021 · Remote'
                   },
                   description: {
                       pt: 'Testes funcionais, exploratórios e de regressão em web/mobile. Depuração de rede com Charles Proxy; relatórios de bugs reproduzíveis com logs/HAR.',
                       en: 'Functional, exploratory and regression testing on web/mobile. Network debugging with Charles Proxy; reproducible bug reports with logs/HAR.'
                   }
               }
           ];

           experienceData.forEach(exp => {
               const expItem = document.createElement('div');
               expItem.className = 'experience-item';

               // Add title
               const titleDiv = document.createElement('div');
               titleDiv.className = 'experience-title';
               titleDiv.setAttribute('data-pt', exp.title.pt);
               titleDiv.setAttribute('data-en', exp.title.en);
               titleDiv.textContent = exp.title[currentLanguage];
               expItem.appendChild(titleDiv);

               // Add company
               const companyDiv = document.createElement('div');
               companyDiv.className = 'experience-company';
               companyDiv.style.fontWeight = '600';
               companyDiv.style.color = 'var(--primary-color)';
               companyDiv.style.marginBottom = '0.3rem';
               if (typeof exp.company === 'object') {
                   companyDiv.setAttribute('data-pt', exp.company.pt);
                   companyDiv.setAttribute('data-en', exp.company.en);
                   companyDiv.textContent = exp.company[currentLanguage];
               } else {
                   companyDiv.textContent = exp.company;
               }
               expItem.appendChild(companyDiv);

               // Add date
               const dateDiv = document.createElement('div');
               dateDiv.className = 'experience-date';
               dateDiv.setAttribute('data-pt', exp.date.pt);
               dateDiv.setAttribute('data-en', exp.date.en);
               dateDiv.textContent = exp.date[currentLanguage];
               expItem.appendChild(dateDiv);

               // Add description
               const descDiv = document.createElement('div');
               descDiv.className = 'experience-description';
               descDiv.style.fontSize = '0.85rem';
               descDiv.style.color = 'var(--text-secondary)';
               descDiv.style.marginTop = '0.5rem';
               descDiv.setAttribute('data-pt', exp.description.pt);
               descDiv.setAttribute('data-en', exp.description.en);
               descDiv.textContent = exp.description[currentLanguage];
               expItem.appendChild(descDiv);

               expContainer.appendChild(expItem);
           });
    
    // Populate projects with bilingual data
    const projectsContainer = document.getElementById('recruiterProjects');
    projectsContainer.innerHTML = '';
    
    // Define projects data with bilingual information
    const projectsData = [
        {
            title: {
                pt: 'Gestão e Implementação de APIs Telecom',
                en: 'Telecom API Management & Implementation'
            },
            description: {
                pt: 'Lidero uma squad num projeto de gestão de APIs em larga escala para uma empresa de telecomunicações latino-americana, implementando e governando APIs no Google Apigee sob padrões TM Forum Open API. Defini melhores práticas, modelos de governação e regras de compliance entre ambientes, padronizando APIs para facilitar integração de clientes com os sistemas da empresa.',
                en: 'Leading a squad in a large-scale API Management project for a Latin American telecommunications company, implementing and governing APIs in Google Apigee under TM Forum Open API standards. Defined best practices, governance models, and compliance rules across environments, standardizing APIs to enable clients ease of integration with company systems.'
            },
            tech: ['Google Apigee', 'TM Forum APIs', 'Bitbucket', 'AWS']
        },
        {
            title: {
                pt: 'Interoperabilidade no Setor Público',
                en: 'Public Sector Interoperability'
            },
            description: {
                pt: 'Atuo como líder técnica num projeto de interoperabilidade digital governamental, orientando arquitetura, design e desenvolvimento de APIs para modernizar e automatizar integração de serviços, melhorando fiabilidade e observabilidade em sistemas do setor público. Contribuo para design de soluções e propostas pré-vendas, definindo estratégias de adoção de API management alinhadas com objetivos de negócio.',
                en: 'Acting as technical lead in a government digital interoperability project, guiding API architecture, design, and development to modernize and automate service integration, enhancing reliability and observability across public sector systems. Contributing to solution design and pre-sales proposals, defining API management adoption strategies aligned with business goals.'
            },
            tech: ['Google Apigee', 'Terraform', 'ArgoCD', 'Observability']
        },
        {
            title: {
                pt: 'Suporte AWS API Gateway',
                en: 'AWS API Gateway Support'
            },
            description: {
                pt: 'Presto suporte especializado para empresa de aviação em AWS API Gateway, otimizando arquitetura de APIs, melhorando performance e segurança, e resolvendo bottlenecks de integração. Contribuo para design de soluções e propostas pré-vendas, definindo estratégias de adoção de DevOps alinhadas com objetivos de negócio e melhores práticas da indústria.',
                en: 'Providing specialized support for an aviation company on AWS API Gateway, optimizing API architecture, improving performance and security posture, and resolving integration bottlenecks. Contributing to solution design and pre-sales proposals, defining DevOps adoption strategies aligned with business goals and industry best practices.'
            },
            tech: ['AWS API Gateway', 'Terraform', 'Azure DevOps', 'Python']
        },
        {
            title: {
                pt: 'Migração de Infraestrutura On-Premises para AWS Cloud',
                en: 'On-Premises to AWS Cloud Infrastructure Migration'
            },
            description: {
                pt: 'Entrega end‑to‑end na banca: migração de on‑prem para AWS, workloads Docker migrados para Kubernetes, GitOps para EKS, pipeline de AMIs e estratégia de autoscaling. Desenvolvi uma solução abrangente de AMI factory usando AWS Image Builder, Lambda Functions, SNS, AWS SDK e CDK, automatizando o ciclo de vida das AMIs com melhores práticas de patch management, compliance e version control.',
                en: 'End-to-end delivery in banking: on‑prem to AWS migration, Docker workloads migrated to Kubernetes, GitOps to EKS, AMI pipeline and autoscaling strategy. Developed a comprehensive AMI factory solution using AWS Image Builder, Lambda Functions, SNS, AWS SDK and CDK, streamlining the creation, management, and deployment of Amazon Machine Images (AMIs) to ensure consistency, security, and efficiency across environments.'
            },
            tech: ['ArgoCD', 'Helm', 'EKS', 'GitLab CI', 'AWS Image Builder', 'Lambda', 'CDK', 'Karpenter', 'Cluster Autoscaler']
        },
        {
            title: {
                pt: 'Automação de Backups S3',
                en: 'S3 Backup Automation'
            },
            description: {
                pt: 'Automatizei backups de ficheiros para S3 com scripts PowerShell, desenvolvendo soluções para empresa industrial que permitiram backups fiáveis e recuperação assegurada, melhorando a eficiência operacional e reduzindo riscos de perda de dados.',
                en: 'Automated file backups to S3 using PowerShell scripts for industrial company, developing solutions that enabled reliable backups and ensured recovery, improving operational efficiency and reducing data loss risks.'
            },
            tech: ['PowerShell', 'AWS S3', 'Windows Scheduled Tasks']
        },
        {
            title: {
                pt: 'Migração de ERP para a Cloud',
                en: 'ERP Cloud Migration'
            },
            description: {
                pt: 'Migrei de Azure para AWS com desenho de CIDR para VPC/subnets, dimensionamento de EC2, EFS para ficheiros, Application Load Balancer para distribuição de carga e CloudWatch para logging. Implementei ambientes seguros e reprodutíveis usando Infrastructure as Code.',
                en: 'Migration from Azure to AWS with VPC/subnet CIDR design, EC2 sizing, EFS for file storage, Application Load Balancer for traffic distribution, and CloudWatch for logging. Implemented secure, repeatable environments using Infrastructure as Code.'
            },
            tech: ['Terraform', 'AWS', 'VPC/Subnets', 'EC2', 'EFS', 'ALB', 'CloudWatch']
        },
        {
            title: {
                pt: 'Infraestrutura AWS FinTech de Raiz',
                en: 'FinTech AWS Infrastructure from Scratch'
            },
            description: {
                pt: 'Desenhei e provisionei landing zones e stacks de aplicações em AWS com Terraform e AWS CloudFormation, seguindo boas práticas de segurança e compliance. Implementei IaC padronizado, onboarding mais rápido e governação reforçada para cliente FinTech.',
                en: 'Designed and provisioned AWS landing zones and app stacks using Terraform and AWS CloudFormation following security and compliance best practices. Implemented standardized IaC, faster onboarding, and stronger governance for FinTech client.'
            },
            tech: ['Terraform', 'AWS CloudFormation', 'AWS', 'Networking']
        }
    ];
    
    projectsData.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        // Add title
        const titleDiv = document.createElement('div');
        titleDiv.className = 'project-title';
        titleDiv.setAttribute('data-pt', project.title.pt);
        titleDiv.setAttribute('data-en', project.title.en);
        titleDiv.textContent = project.title[currentLanguage];
        projectItem.appendChild(titleDiv);
        
        // Add tech stack
        const techDiv = document.createElement('div');
        techDiv.className = 'project-tech';
        techDiv.style.display = 'flex';
        techDiv.style.flexWrap = 'wrap';
        techDiv.style.gap = '0.3rem';
        techDiv.style.marginBottom = '0.5rem';
        
        project.tech.forEach(techItem => {
            const techTag = document.createElement('span');
            techTag.className = 'recruiter-skill';
            techTag.style.fontSize = '0.75rem';
            techTag.style.padding = '0.2rem 0.5rem';
            techTag.style.margin = '0.1rem';
            techTag.style.borderRadius = '12px';
            techTag.textContent = techItem;
            techDiv.appendChild(techTag);
        });
        
        projectItem.appendChild(techDiv);
        
        // Add description
        const descDiv = document.createElement('div');
        descDiv.className = 'project-description';
        descDiv.style.fontSize = '0.85rem';
        descDiv.style.color = 'var(--text-secondary)';
        descDiv.style.marginTop = '0.5rem';
        descDiv.setAttribute('data-pt', project.description.pt);
        descDiv.setAttribute('data-en', project.description.en);
        descDiv.textContent = project.description[currentLanguage];
        projectItem.appendChild(descDiv);
        
        projectsContainer.appendChild(projectItem);
    });
    
    // Populate contact information
    const contactContainer = document.getElementById('recruiterContact');
    if (contactContainer) {
        contactContainer.innerHTML = '';
        
        // Create contact items
        const contactItems = [
            {
                icon: 'fab fa-linkedin',
                text: 'LinkedIn',
                url: 'https://www.linkedin.com/in/ines-fv-lino/',
                color: '#0077b5'
            },
            {
                icon: 'fab fa-github',
                text: 'GitHub',
                url: 'https://github.com/ineslino',
                color: '#333'
            }
        ];
        
        contactItems.forEach(item => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.style.display = 'flex';
            contactItem.style.alignItems = 'center';
            contactItem.style.gap = '0.75rem';
            contactItem.style.marginBottom = '1rem';
            contactItem.style.padding = '0.75rem';
            contactItem.style.background = 'rgba(255, 255, 255, 0.05)';
            contactItem.style.borderRadius = '8px';
            contactItem.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            contactItem.style.transition = 'all 0.3s ease';
            
            // Add hover effect
            contactItem.addEventListener('mouseenter', () => {
                contactItem.style.background = 'rgba(255, 255, 255, 0.1)';
                contactItem.style.transform = 'translateX(5px)';
            });
            
            contactItem.addEventListener('mouseleave', () => {
                contactItem.style.background = 'rgba(255, 255, 255, 0.05)';
                contactItem.style.transform = 'translateX(0)';
            });
            
            // Create icon
            const iconDiv = document.createElement('div');
            iconDiv.innerHTML = `<i class="${item.icon}" style="color: ${item.color}; font-size: 1.2rem;"></i>`;
            contactItem.appendChild(iconDiv);
            
            // Create text/link
            if (item.url) {
                const link = document.createElement('a');
                link.href = item.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = item.text;
                link.style.color = 'white';
                link.style.textDecoration = 'none';
                link.style.fontWeight = '500';
                link.style.flex = '1';
                
                link.addEventListener('mouseenter', () => {
                    link.style.textDecoration = 'underline';
                });
                
                link.addEventListener('mouseleave', () => {
                    link.style.textDecoration = 'none';
                });
                
                contactItem.appendChild(link);
            } else {
                const textDiv = document.createElement('div');
                textDiv.textContent = item.text;
                textDiv.style.color = 'white';
                textDiv.style.fontWeight = '500';
                textDiv.style.flex = '1';
                contactItem.appendChild(textDiv);
            }
            
            contactContainer.appendChild(contactItem);
        });
    }
    
    // Initialize language for recruiter mode
    updateRecruiterContent(currentLanguage);
}

// Direct function for recruiter language toggle (called by onclick)
function toggleRecruiterLanguageDirect() {
    console.log('=== RECRUITER LANGUAGE TOGGLE START ===');
    console.log('Initial currentLanguage:', currentLanguage);
    
    // Toggle language
    currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
    localStorage.setItem('language', currentLanguage);
    
    console.log('New currentLanguage:', currentLanguage);
    
    // CRITICAL: Update button text FIRST, before any other operations
    const button = document.getElementById('recruiterLangText');
    console.log('Button element:', button);
    
    if (button) {
        const newText = currentLanguage.toUpperCase();
        console.log('Setting button text to:', newText);
        
        // Force immediate update
        button.textContent = newText;
        button.innerHTML = newText;
        
        console.log('Button text after setting:', button.textContent);
    }
    
    // Update recruiter content (this might fail, but button is already updated)
    try {
        updateRecruiterContent(currentLanguage);
    } catch (error) {
        console.error('Error updating recruiter content:', error);
        // Button is already updated, so we're good
    }
    
    console.log('=== RECRUITER LANGUAGE TOGGLE END ===');
}

// Initialize recruiter language button
function initRecruiterLanguageButton() {
    console.log('=== INIT RECRUITER LANGUAGE BUTTON ===');
    console.log('currentLanguage at init:', currentLanguage);
    
    const langText = document.getElementById('recruiterLangText');
    console.log('Button element at init:', langText);
    
    if (langText) {
        const initialText = currentLanguage.toUpperCase();
        console.log('Setting initial button text to:', initialText);
        langText.textContent = initialText;
        console.log('Button text after init:', langText.textContent);
    }
    
    console.log('=== INIT RECRUITER LANGUAGE BUTTON END ===');
}

// Recruiter Mode Language Toggle - Simplified to use main updateLanguage function
function toggleRecruiterLanguage(lang) {
    // Update global language
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update all content using the main updateLanguage function
    updateLanguage();
    
    // Update recruiter specific content
    updateRecruiterContent(lang);
    
    // Update recruiter language button if it exists
    const recruiterLangBtn = document.getElementById('recruiterLangBtn');
    if (recruiterLangBtn) {
        const langSpan = recruiterLangBtn.querySelector('span');
        if (langSpan) {
            langSpan.textContent = lang.toUpperCase();
        }
    }
}

// Update recruiter content based on language
function updateRecruiterContent(lang) {
    // Update section titles
    const sections = {
        'recruiterSkills': lang === 'pt' ? '🔧 Competências Técnicas' : '🔧 Technical Skills',
        'recruiterCertifications': lang === 'pt' ? '🏆 Certificações' : '🏆 Certifications',
        'recruiterExperience': lang === 'pt' ? '💼 Experiência Profissional' : '💼 Professional Experience',
        'recruiterProjects': lang === 'pt' ? '🚀 Projetos Principais' : '🚀 Key Projects',
        'recruiterLanguages': lang === 'pt' ? '🌍 Idiomas' : '🌍 Languages',
        'recruiterContact': lang === 'pt' ? '📞 Informações de Contacto' : '📞 Contact Information'
    };
    
    Object.entries(sections).forEach(([id, text]) => {
        try {
            const sectionElement = document.querySelector(`#${id}`);
            if (sectionElement && sectionElement.parentNode) {
                const element = sectionElement.parentNode.querySelector('h3');
                if (element) {
                    element.textContent = text;
                }
            }
        } catch (error) {
            console.log(`Could not update section ${id}:`, error);
            // Continue with other sections
        }
    });
    
    // Update soft skills title
    const recruiterSkillsElement = document.querySelector('#recruiterSkills');
    if (recruiterSkillsElement && recruiterSkillsElement.parentNode) {
        const softSkillsTitle = recruiterSkillsElement.parentNode.querySelector('h4');
        if (softSkillsTitle) {
            softSkillsTitle.textContent = lang === 'pt' ? 'Soft Skills' : 'Soft Skills';
        }
    }
    
    // Update areas of development title
    if (recruiterSkillsElement && recruiterSkillsElement.parentNode) {
        const improvementTitle = recruiterSkillsElement.parentNode.querySelectorAll('h4')[1];
        if (improvementTitle) {
            improvementTitle.textContent = lang === 'pt' ? 'Áreas de Desenvolvimento' : 'Areas of Development';
        }
    }
    
    // Update recruiter skills tags
    const recruiterSkillsContainer = document.getElementById('recruiterSkills');
    if (recruiterSkillsContainer) {
        // Update all skill tags in recruiter mode
        const skillTags = recruiterSkillsContainer.querySelectorAll('.recruiter-skill[data-en][data-pt]');
        console.log('Found recruiter skill tags:', skillTags.length);
        skillTags.forEach(tag => {
            console.log('Translating tag:', tag.textContent, 'to:', tag.dataset[lang]);
            tag.textContent = tag.dataset[lang];
        });
    }
    
    // Update areas of development tags - they are added after the skills container
    const allRecruiterSkills = recruiterSkillsContainer?.parentNode?.querySelectorAll('.recruiter-skill[data-en][data-pt]');
    console.log('Found all recruiter skills:', allRecruiterSkills?.length);
    if (allRecruiterSkills) {
        allRecruiterSkills.forEach(tag => {
            console.log('Translating all recruiter tag:', tag.textContent, 'to:', tag.dataset[lang]);
            tag.textContent = tag.dataset[lang];
        });
    }
    
    
    // Update badge links text
    const badgeLinks = document.querySelectorAll('#recruiterCertifications a[href*="credly"]');
    badgeLinks.forEach(link => {
        if (link.textContent.includes('Ver Badge')) {
            link.textContent = lang === 'pt' ? 'Ver Badge' : 'View Badge';
        }
    });
    
    // Update languages header
    const languagesHeader = document.getElementById('recruiterHeaderLanguages');
    if (languagesHeader) {
        languagesHeader.textContent = lang === 'pt' ? 
            '🇵🇹 Português (Nativo) • 🇬🇧 Inglês (C2) • 🇪🇸 Espanhol (Profissional)' :
            '🇵🇹 Portuguese (Native) • 🇬🇧 English (C2) • 🇪🇸 Spanish (Professional)';
    }
    
    // Update CV download button
    const cvDownloadBtn = document.getElementById('recruiterCVDownload');
    if (cvDownloadBtn) {
        cvDownloadBtn.textContent = lang === 'pt' ? '📄 Descarregar CV (PDF)' : '📄 Download CV (PDF)';
    }
    
    // Update experience descriptions
    const experienceDescriptions = document.querySelectorAll('#recruiterExperience .experience-description');
    experienceDescriptions.forEach((desc, index) => {
        const descriptions = [
            {
                pt: 'Lidero uma squad num projeto de gestão de APIs em larga escala para uma empresa de telecomunicações latino-americana, implementando e governando APIs no Google Apigee sob padrões TM Forum Open API. Defini melhores práticas, modelos de governação e regras de compliance entre ambientes. Atuo como líder técnica num projeto de interoperabilidade digital governamental, orientando arquitetura, design e desenvolvimento de APIs para modernizar e automatizar integração de serviços, melhorando fiabilidade e observabilidade em sistemas do setor público. Presto suporte especializado para empresa de aviação em AWS API Gateway, otimizando arquitetura de APIs, melhorando performance e segurança, e resolvendo bottlenecks de integração.',
                en: 'Leading a squad in a large-scale API Management project for a Latin American telecommunications company, implementing and governing APIs in Google Apigee under TM Forum Open API standards. Defined best practices, governance models, and compliance rules across environments. Acting as technical lead in a government digital interoperability project, guiding API architecture, design, and development to modernize and automate service integration, enhancing reliability and observability across public sector systems. Providing specialized support for an aviation company on AWS API Gateway, optimizing API architecture, improving performance and security posture, and resolving integration bottlenecks.'
            },
            {
                pt: 'Ajudei clientes a migrar infraestruturas on-premises para AWS Cloud, permitindo-lhes aproveitar escalabilidade, segurança e custo-efetividade. Desenvolvi scripts PowerShell para automação de backups de ficheiros para buckets S3. Construí infraestruturas desde o zero na cloud usando serviços AWS e melhores práticas com Infrastructure as Code (Terraform e AWS CloudFormation). Implementei soluções de autoscaling Kubernetes com Karpenter e AWS EKS Cluster Autoscaler para minimizar custos e usar recursos eficientemente. Integrei ferramentas GitOps como ArgoCD, permitindo aos developers fazer deploy do código nas suas plataformas VCS e sincronizar automaticamente mudanças no cluster Kubernetes.',
                en: 'Helped clients migrate on-premises infrastructures to AWS Cloud, enabling them to leverage scalability, security and cost-effectiveness. Developed PowerShell scripts for automation of file backups to S3 buckets. Built infrastructures from scratch in the cloud using AWS services and best practices with Infrastructure as Code (Terraform and AWS CloudFormation). Implemented Kubernetes autoscaling mechanisms with Karpenter and AWS EKS Cluster Autoscaler to minimize costs and efficiently use needed resources. Enhanced Kubernetes cluster deployments by integrating GitOps tools, such as ArgoCD, enabling developers to deploy their code on their VCS platform and automatically synchronize changes in the Kubernetes cluster.'
            },
            {
                pt: 'Testes funcionais, exploratórios e de regressão em web/mobile. Depuração de rede com Charles Proxy; relatórios de bugs reproduzíveis com logs/HAR.',
                en: 'Functional, exploratory and regression testing on web/mobile. Network debugging with Charles Proxy; reproducible bug reports with logs/HAR.'
            }
        ];
        
        if (descriptions[index]) {
            desc.textContent = descriptions[index][lang];
        }
    });
    
    // Update project descriptions
    const projectDescriptions = document.querySelectorAll('#recruiterProjects .project-description');
    projectDescriptions.forEach((desc, index) => {
        // Use the data attributes that were set when creating the project items
        if (desc.hasAttribute('data-pt') && desc.hasAttribute('data-en')) {
            desc.textContent = desc.dataset[lang];
        }
    });
    
    // Button text is handled by toggleRecruiterLanguageDirect function
}

// Easter Egg Hint Modal
function showEasterEggModal() {
    const modal = document.createElement('div');
    modal.className = 'easter-egg-modal';
    modal.innerHTML = `
        <div class="easter-egg-modal-content">
            <div class="easter-egg-modal-header">
                <h3>🎯 Easter Eggs Disponíveis</h3>
                <button class="easter-egg-modal-close" onclick="this.closest('.easter-egg-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="easter-egg-modal-body">
                <div class="easter-egg-category">
                    <h4>⌨️ Códigos de Teclado</h4>
                    <div class="easter-egg-list">
                        <div class="easter-egg-item">
                            <span class="code">↑↑↓↓←→←→BA</span>
                            <span class="description">Konami Code - Efeito rainbow</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">DEVOPS</span>
                            <span class="description">Animação de pipeline DevOps</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">MUSIC</span>
                            <span class="description">Efeito de vinis girando</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">COOK</span>
                            <span class="description">Efeito culinário</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">GAME</span>
                            <span class="description">Efeito gaming</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">REACT</span>
                            <span class="description">Efeito React</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">DOCKER</span>
                            <span class="description">Efeito Docker</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">KUBE</span>
                            <span class="description">Efeito Kubernetes</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">AWS</span>
                            <span class="description">Efeito AWS</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">GIT</span>
                            <span class="description">Efeito Git</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">LEGO</span>
                            <span class="description">Efeito Lego 3D</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">MOVIE</span>
                            <span class="description">Efeito cinema</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">SURF</span>
                            <span class="description">Modo surf</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">GARDEN</span>
                            <span class="description">Efeito jardim</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">APIGEE</span>
                            <span class="description">Chuva de APIs</span>
                        </div>
                    </div>
                </div>
                
                <div class="easter-egg-category">
                    <h4>🖱️ Interações Especiais</h4>
                    <div class="easter-egg-list">
                        <div class="easter-egg-item">
                            <span class="code">Logo x5</span>
                            <span class="description">Clique 5 vezes no logo</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">Título x3</span>
                            <span class="description">Clique 3 vezes no título principal</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">Hover Tech</span>
                            <span class="description">10% chance de glitch nos tech items</span>
                        </div>
                        <div class="easter-egg-item">
                            <span class="code">Hover Passion</span>
                            <span class="description">15% chance de sparkle nos passion cards</span>
                        </div>
                    </div>
                </div>
                
                <div class="easter-egg-tip">
                    <i class="fas fa-lightbulb"></i>
                    <span>Dica: Digite os códigos em qualquer lugar da página!</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close modal with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Console easter egg
console.log(`
🎵 Bem-vindo ao Portfolio da Inês Lino! 🎵

🚀 Funcionalidades:
- Sistema bilingue (PT/EN)
- Pop-ups de hobbies sem sobreposição
- Tecnologias reais (Google Apigee, AWS, etc.)
- Experiência atualizada com dados do LinkedIn
- Certificações e publicações
- Logo melhorado
- Efeitos hover para filmes/séries

Como música, DevOps é sobre harmonia e ritmo.
Cada deploy é uma nota na sinfonia do software.

🎸 Música + 🍳 Culinária + ⚙️ DevOps + 🎬 Cinema = Harmonia Perfeita

Construído com ❤️ e muito ☕

Experimenta o Konami Code para uma surpresa! ↑↑↓↓←→←→BA
`);

// Enhanced Timeline Scroll Control
function scrollTimeline(direction) {
    const timelineScroll = document.querySelector('.timeline-scroll');
    const timelineItems = document.querySelectorAll('.timeline-item-horizontal');
    const itemWidth = timelineItems[0]?.offsetWidth || 380;
    const gap = 32; // 2rem gap between items
    const scrollAmount = itemWidth + gap; // scroll by one item width + gap
    
    if (direction === 'left') {
        timelineScroll.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else {
        timelineScroll.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Enhanced Timeline Animation System
class TimelineAnimations {
    constructor() {
        this.timelineSection = document.querySelector('.experience');
        this.timelineCards = document.querySelectorAll('.timeline-item-horizontal');
        this.init();
    }

    init() {
        if (!this.timelineSection) return;
        
        // Create intersection observer for timeline section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTimelineCards();
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        observer.observe(this.timelineSection);
    }

    animateTimelineCards() {
        this.timelineCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animationPlayState = 'running';
            }, index * 150); // Stagger animation
        });
    }
}

// Initialize timeline scroll controls and animations
// Moved to initializeAll()
