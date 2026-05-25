/**
 * Suhail - MERN Developer Portfolio JavaScript Logic
 * Premium micro-interactions, responsive listeners, and mock systems
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCursorGlow();
    initCardSpotlight();
    initTerminalTyper();
    initSkillsFilter();
    initContactForm();
    initChatbot();
});

/* -------------------------------------------------------------
 * 1. HEADER SCROLL & MOBILE MENU INTERACTION
 * ------------------------------------------------------------- */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect to shrink nav and add backdrop glass filter
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking on scroll
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Hamburger Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when a navigation item is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });
}

/* -------------------------------------------------------------
 * 2. MOUSE FOLLOWING GLOW ORB (DESKTOP ONLY)
 * ------------------------------------------------------------- */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    
    // Disable on mobile/touch devices for better performance
    if (window.matchMedia('(pointer: coarse)').matches) {
        glow.style.display = 'none';
        return;
    }

    // Set visibility on hover
    document.body.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
    });

    document.body.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });

    // Tracking position smoothly
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        
        // Immediate display on first move
        if (glow.style.opacity === '0') {
            glow.style.opacity = '1';
        }
    });

    // Smooth lerp (linear interpolation) animation loop for lag effect
    function updatePosition() {
        // Calculate difference
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        
        // Add fraction of difference
        currentX += dx * 0.12;
        currentY += dy * 0.12;
        
        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;
        
        requestAnimationFrame(updatePosition);
    }
    updatePosition();
}

/* -------------------------------------------------------------
 * 3. ADVANCED CARD CURSOR SPOTLIGHT EFFECT
 * ------------------------------------------------------------- */
function initCardSpotlight() {
    const cards = document.querySelectorAll('.cursor-spotlight');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Get local coordinates inside the card container
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set local CSS variables for radial gradient positioning
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* -------------------------------------------------------------
 * 4. FLOATING DEV TERMINAL AUTO-TYPING SIMULATION
 * ------------------------------------------------------------- */
function initTerminalTyper() {
    const container = document.querySelector('.typing-container');
    if (!container) return;

    // The code structure we want to type out dynamically
    const codeString = `  console.log("MERN Stack initialized.");\r\n  console.log("Welcome to Suhail's Devspace!");\r\n}`;
    let charIndex = 0;
    
    // We start with line 10 already containing "function initPortfolio() {"
    // Create cursor elements
    const textNode = document.createElement('span');
    textNode.className = 'code-string';
    textNode.style.color = '#38bdf8'; // Cyan color matching JS code style
    
    const cursor = document.createElement('span');
    cursor.className = 'code-cursor';
    
    container.innerHTML = '';
    container.innerHTML = `<span class="line-num">10</span><span class="code-keyword">function</span> <span class="code-function">initPortfolio</span>() {`;
    
    const targetLine = document.createElement('div');
    targetLine.className = 'code-line';
    targetLine.style.paddingLeft = '15px';
    
    const lineNum = document.createElement('span');
    lineNum.className = 'line-num';
    lineNum.innerText = '11';
    
    targetLine.appendChild(lineNum);
    targetLine.appendChild(textNode);
    targetLine.appendChild(cursor);
    container.after(targetLine);

    function typeCode() {
        if (charIndex < codeString.length) {
            const char = codeString.charAt(charIndex);
            
            if (char === '\n') {
                // Break into a new line representation
                cursor.remove();
                
                const nextLine = document.createElement('div');
                nextLine.className = 'code-line';
                nextLine.style.paddingLeft = '15px';
                
                const nextLineNum = document.createElement('span');
                nextLineNum.className = 'line-num';
                nextLineNum.innerText = (parseInt(lineNum.innerText) + 1).toString();
                
                const nextTextNode = document.createElement('span');
                
                // Styles color based on content typed
                if (charIndex > 50) {
                    nextTextNode.className = 'code-operator';
                } else {
                    nextTextNode.className = 'code-string';
                    nextTextNode.style.color = '#34d399'; // green string
                }
                
                nextLine.appendChild(nextLineNum);
                nextLine.appendChild(nextTextNode);
                nextLine.appendChild(cursor);
                
                targetLine.after(nextLine);
                
                // Reassign variables for typing onwards
                lineNum.innerText = nextLineNum.innerText;
                textNode.className = nextTextNode.className;
                
                // Trick to bind textNode reference
                const closureNode = nextTextNode;
                
                charIndex++;
                setTimeout(() => typeCodeInternal(closureNode, nextLine), 150);
            } else if (char === '\r') {
                // skip carriage return
                charIndex++;
                typeCode();
            } else {
                textNode.textContent += char;
                charIndex++;
                setTimeout(typeCode, 50);
            }
        } else {
            // Once typing finishes, let cursor blink on the final curly brace
            cursor.className = 'code-cursor';
        }
    }

    function typeCodeInternal(currNode, currLine) {
        if (charIndex < codeString.length) {
            const char = codeString.charAt(charIndex);
            
            if (char === '\n') {
                cursor.remove();
                
                const nextLine = document.createElement('div');
                nextLine.className = 'code-line';
                nextLine.style.paddingLeft = '0px'; // final closing bracket needs no indent
                
                const nextLineNum = document.createElement('span');
                nextLineNum.className = 'line-num';
                nextLineNum.innerText = (parseInt(lineNum.innerText) + 1).toString();
                
                const nextTextNode = document.createElement('span');
                nextTextNode.className = 'code-operator'; // for closing brace
                
                nextLine.appendChild(nextLineNum);
                nextLine.appendChild(nextTextNode);
                nextLine.appendChild(cursor);
                
                currLine.after(nextLine);
                
                lineNum.innerText = nextLineNum.innerText;
                
                charIndex++;
                setTimeout(() => typeCodeInternal(nextTextNode, nextLine), 150);
            } else {
                currNode.textContent += char;
                charIndex++;
                setTimeout(() => typeCodeInternal(currNode, currLine), 50);
            }
        } else {
            cursor.className = 'code-cursor';
        }
    }

    // Start typing after initial loading delay
    setTimeout(typeCode, 1500);
}

/* -------------------------------------------------------------
 * 5. SKILLS Dynamic FILTRATION
 * ------------------------------------------------------------- */
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active category
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            skillCards.forEach(card => {
                const tags = card.getAttribute('data-tags').split(' ');

                if (category === 'all' || tags.includes(category)) {
                    // Show item
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide item with transition
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.85)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* -------------------------------------------------------------
 * 6. CONTACT FORM VALIDATION & SIMULATION
 * ------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    const messageInput = document.getElementById('user-message');
    const successOverlay = document.getElementById('form-success');
    const closeSuccessBtn = document.getElementById('btn-close-success');
    const copyEmailBtn = document.getElementById('btn-copy-email');

    // Handle Form Submit Validation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // 1. Validate Name
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'name-error');
            isFormValid = false;
        } else {
            hideError(nameInput, 'name-error');
        }

        // 2. Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'email-error');
            isFormValid = false;
        } else {
            hideError(emailInput, 'email-error');
        }

        // 3. Validate Message
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'message-error');
            isFormValid = false;
        } else {
            hideError(messageInput, 'message-error');
        }

        if (isFormValid) {
            // Form is valid! Simulating sending API
            const submitBtn = document.getElementById('btn-submit');
            const submitText = submitBtn.querySelector('span');
            
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';
            submitText.innerText = 'Sending message...';

            setTimeout(() => {
                // Show success modal overlay after simulation delay
                successOverlay.classList.add('show');
                
                // Reset submit button state
                submitBtn.style.pointerEvents = 'auto';
                submitBtn.style.opacity = '1';
                submitText.innerText = 'Send Message';
                
                // Clear form fields
                form.reset();
            }, 1500);
        }
    });

    // Close success overlay
    closeSuccessBtn.addEventListener('click', () => {
        successOverlay.classList.remove('show');
    });

    // Utility details copying email to clipboard
    copyEmailBtn.addEventListener('click', () => {
        const emailAddress = document.getElementById('email-value').innerText;
        
        navigator.clipboard.writeText(emailAddress).then(() => {
            // Success Feedback animations
            copyEmailBtn.classList.add('copied');
            // Change SVG content temporarily
            const originalIcon = copyEmailBtn.innerHTML;
            copyEmailBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            
            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                copyEmailBtn.innerHTML = originalIcon;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    // Helper functions
    function showError(input, errorId) {
        const parent = input.closest('.form-group');
        parent.classList.add('invalid');
    }

    function hideError(input, errorId) {
        const parent = input.closest('.form-group');
        parent.classList.remove('invalid');
    }

    // Dynamic field clearance on key presses
    const inputs = [nameInput, emailInput, messageInput];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const parent = input.closest('.form-group');
            if (parent.classList.contains('invalid')) {
                parent.classList.remove('invalid');
            }
        });
    });
}

/* -------------------------------------------------------------
 * 7. FLOATING 24/7 AI CHATBOT FUNCTIONALITY
 * ------------------------------------------------------------- */
function initChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const container = document.getElementById('chatbot-container');
    const closeBtn = document.getElementById('bot-close');
    const chatForm = document.getElementById('chatbot-input-form');
    const chatInput = document.getElementById('chatbot-input');
    const messageArea = document.getElementById('chatbot-messages');
    const promptChips = document.querySelectorAll('.prompt-chip');
    const toggleIcon = toggleBtn.querySelector('.chat-toggle-icon');
    const closeIcon = toggleBtn.querySelector('.chat-close-icon');

    // Smart responses database
    const responseDb = {
        skills: "Suhail is a specialized Full-Stack MERN Developer. His core expertise includes: React.js (Frontend library), Node.js (Runtime system), Express.js (REST APIs framework), and MongoDB (Database schema design). He also uses Redux Toolkit, WebSockets, HTML5, CSS3, and Tailwind CSS!",
        about: "Suhail is an experienced Full-Stack Developer specializing in crafting robust MERN stack applications. He loves optimizing backend database systems, building scalable middleware APIs, and creating responsive, pixel-perfect user interfaces.",
        projects: "Suhail has engineered several premium projects: \n1. NexaCart – An enterprise-level MERN E-Commerce engine with JWT, Stripe payments, and admin dashboards. \n2. SyncWave – A real-time chat workspace built with React & Socket.io for immediate collaboration. \n3. InsightDB – An AI analytics dashboard connected to OpenAI API.",
        hire: "You can hire Suhail by emailing him directly at suhailbinsidheek@gmail.com, or by using the contact form on the portfolio page. He is currently available for full-time MERN developer roles and freelance collaborations!",
        hello: "Hi there! I'm Suhail's AI Assistant. Ask me anything about his MERN skills, projects, or how to hire him!",
        contact: "To contact Suhail, you can send him an email at suhailbinsidheek@gmail.com or fill out the contact form below. You can also connect with him on LinkedIn, GitHub, or Instagram!",
        resume: "To request Suhail's resume, please send an email to suhailbinsidheek@gmail.com or submit a request via the contact form on this page!"
    };

    // Toggle chatbot window open/close
    function toggleChat() {
        container.classList.toggle('open');
        const isOpen = container.classList.contains('open');
        
        if (isOpen) {
            toggleIcon.classList.remove('active');
            closeIcon.classList.add('active');
            // Auto focus on input when chat opens
            setTimeout(() => chatInput.focus(), 200);
        } else {
            toggleIcon.classList.add('active');
            closeIcon.classList.remove('active');
        }
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Scroll messages area to the bottom
    function scrollToBottom() {
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // Append message to chat panel
    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Handle newlines as breaks in response text
        contentDiv.innerHTML = text.replace(/\n/g, '<br>');
        
        msgDiv.appendChild(contentDiv);
        messageArea.appendChild(msgDiv);
        scrollToBottom();
        return msgDiv;
    }

    // Get response based on keywords in query
    function getBotResponse(userMessage) {
        const msg = userMessage.toLowerCase().trim();
        
        if (msg.includes('skill') || msg.includes('react') || msg.includes('node') || msg.includes('mongo') || msg.includes('express') || msg.includes('stack')) {
            return responseDb.skills;
        } else if (msg.includes('project') || msg.includes('work') || msg.includes('build') || msg.includes('nexacart') || msg.includes('syncwave') || msg.includes('insightdb')) {
            return responseDb.projects;
        } else if (msg.includes('hire') || msg.includes('job') || msg.includes('career') || msg.includes('freelance') || msg.includes('position')) {
            return responseDb.hire;
        } else if (msg.includes('who is') || msg.includes('about') || msg.includes('journey') || msg.includes('experience')) {
            return responseDb.about;
        } else if (msg.includes('contact') || msg.includes('email') || msg.includes('social') || msg.includes('linkedin') || msg.includes('github') || msg.includes('instagram')) {
            return responseDb.contact;
        } else if (msg.includes('resume') || msg.includes('cv')) {
            return responseDb.resume;
        } else if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey') || msg.startsWith('hi')) {
            return responseDb.hello;
        }
        
        return "I'm Suhail's AI bot! For specific MERN stack technical assessments or to discuss joining your team, please contact Suhail directly at suhailbinsidheek@gmail.com, or fill out the form on this page.";
    }

    // Process user message submission
    function handleMessageSubmit(text) {
        if (!text.trim()) return;
        
        // 1. Render User Message
        appendMessage('user', text);
        
        // 2. Clear input
        chatInput.value = '';
        
        // 3. Render pulsing typing bubble
        const typingBubble = appendMessage('bot', `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `);
        
        // 4. Simulate bot thinking and type response
        setTimeout(() => {
            // Remove typing bubble
            typingBubble.remove();
            
            // Generate and render actual response
            const botAnswer = getBotResponse(text);
            appendMessage('bot', botAnswer);
        }, 1000);
    }

    // Handle Form Submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleMessageSubmit(chatInput.value);
    });

    // Handle Quick prompt chip clicks
    promptChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const promptText = chip.getAttribute('data-prompt');
            handleMessageSubmit(promptText);
        });
    });
}
