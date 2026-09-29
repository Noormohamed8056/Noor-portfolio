window.addEventListener('pageshow', (e) => {
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }
    
    const navEntries = performance.getEntriesByType("navigation");
    const isReload = navEntries.length > 0 && navEntries[0].type === "reload";
    
    if (e.persisted || isReload) {
        if (isReload && window.location.hash) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }
        window.scrollTo(0, 0);
        if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
    }
    
    // Clean index.html from URL
    if (window.location.protocol.startsWith('http') && window.location.pathname.endsWith('/index.html')) {
        const newPath = window.location.pathname.replace('/index.html', '/');
        history.replaceState(null, "", newPath + window.location.hash + window.location.search);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Check for reduced motion
    const prefersReducedMotion = false;

    // 2. Register GSAP Plugins
    gsap.registerPlugin(ScrollTrigger);

    // 3. Lenis Setup
    let lenis;
    if (!prefersReducedMotion) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            smooth: true
        });
        window.lenis = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
        
        // Handle scroll reset and lock on load
        const navEntries = performance.getEntriesByType("navigation");
        const isReload = navEntries.length > 0 && navEntries[0].type === "reload";
        
        if (isReload && window.location.hash) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }
        
        if (isReload || !window.location.hash) {
            window.scrollTo(0, 0);
            lenis.scrollTo(0, { immediate: true });
            const progressBar = document.querySelector(".scroll-progress");
            if (progressBar) progressBar.style.transform = "scaleX(0)";
        } else if (window.location.hash) {
            // If there's a hash and it's NOT a reload, scroll to it offset by navbar
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) lenis.scrollTo(target, { offset: -80, immediate: true });
            }, 100);
        }
        
        // Lock scroll while preloader is showing (if preloader exists)
        if (document.querySelector(".preloader")) {
            lenis.stop();
        }
    }

    // 4. Preloader & Ready Sequence
    const loaderCount = document.getElementById("loader-count");
    const preloader = document.querySelector(".preloader");
    
    let isPreloaderDone = false;
    let fontsAreReady = false;
    
    // Check if we can start the stats counter
    function checkAndInitStats() {
        if (isPreloaderDone && fontsAreReady) {
            initStatsCounter();
        }
    }
    
    // Check if we can start the hero entrance
    function checkAndInitHero() {
        if (isPreloaderDone) {
            initSplitHeroEntrance();
        }
    }
    
    // We don't need wordmarksFitted anymore, but we can hook into document load if needed.
    
    // Hide wordmarks immediately to prevent any unstyled/wrong-sized flashes
    document.querySelectorAll('.hero-bg-text').forEach(el => {
        el.style.opacity = '0';
    });
    
    document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
            fontsAreReady = true;
            checkAndInitStats();
            // Call hero init directly if preloader is already done, or it will be called when preloader finishes
            checkAndInitHero();
            
            // Specifically check the actual font family used by the wordmark
            if (document.fonts.check('1em Anton')) {
                if (typeof fitFooterWordmark === 'function') fitFooterWordmark();
            } else {
                document.fonts.load('1em Anton').then(() => {
                    requestAnimationFrame(() => {
                        if (typeof fitFooterWordmark === 'function') fitFooterWordmark();
                    });
                }).catch(() => {
                    if (typeof fitFooterWordmark === 'function') fitFooterWordmark();
                });
            }
        });
    });

    // Preloader 3D Animation Setup
    const preloaderWord = document.querySelector(".preloader-word");
    let preloaderTl = gsap.timeline({ paused: true });
    
    if (preloaderWord) {
        const text = preloaderWord.innerText || "NOOR MOHAMED";
        preloaderWord.innerHTML = '';
        const chars = [];
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement("span");
            span.innerText = char === " " ? "\u00A0" : char;
            span.className = "preloader-char";
            preloaderWord.appendChild(span);
            chars.push(span);
            
            if (!prefersReduced && char !== " ") {
                // Deterministic pseudo-random scatter
                const seed = i * 137.5; 
                const randomX = Math.sin(seed) * 40; 
                const randomY = Math.cos(seed) * 40;
                const randomZ = -150 + Math.sin(seed * 2) * 250;
                const randomRotX = Math.sin(seed * 3) * 50;
                const randomRotY = Math.cos(seed * 3) * 50;
                
                gsap.set(span, {
                    x: randomX,
                    y: randomY,
                    z: randomZ,
                    rotateX: randomRotX,
                    rotateY: randomRotY,
                    opacity: 0.2
                });
            } else if (prefersReduced) {
                gsap.set(span, { opacity: 0 });
            }
        }
        
        if (!prefersReduced) {
            preloaderTl.to(chars, {
                x: 0,
                y: 0,
                z: 0,
                rotateX: 0,
                rotateY: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.04,
                ease: "back.out(1.5)"
            });
        } else {
            preloaderTl.to(chars, { opacity: 1, duration: 1, stagger: 0.04, ease: "power1.inOut" });
        }
    }

    let counter = { value: 0 };
    gsap.to(counter, {
        value: 100,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
            if (loaderCount) loaderCount.innerText = Math.round(counter.value);
            if (preloaderTl) preloaderTl.progress(counter.value / 100);
        },
        onComplete: () => {
            gsap.to(preloader, {
                yPercent: -100,
                duration: 0.9,
                ease: "power3.inOut",
                onComplete: () => {
                    isPreloaderDone = true;
                    if (window.lenis) window.lenis.start();
                    
                    
                    // 1. Immediately and independently reveal the portrait and cards
                    initHeroCards();
                    
                    // 2. Refresh ScrollTrigger unconditionally so other sections (like Certificates) don't break
                    ScrollTrigger.refresh();
                    
                    // 3. Try to start the dependent animations
                    checkAndInitStats();
                    checkAndInitHero();
                }
            });
        }
    });

    // Independent Hero Cards & Portrait Entrance
    function initHeroCards() {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        
        tl.fromTo(".hero-portrait", 
            { scale: 0.92, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2 }, 
            0
        );

        tl.fromTo(".hero-card-left", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 0.2);
        tl.fromTo(".hero-card-right", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 0.2);
    }
    
    // Independent Stats Counter (Waits for fonts)
    let statsRunOnce = false;
    function initStatsCounter() {
        if (statsRunOnce) return;
        statsRunOnce = true;
        
        document.querySelectorAll(".count-up").forEach(el => {
            const target = parseFloat(el.getAttribute("data-target"));
            const decimals = parseInt(el.getAttribute("data-decimals") || 0);
            gsap.to(el, {
                innerHTML: target,
                duration: 2,
                ease: "power2.out",
                snap: { innerHTML: 1 / Math.pow(10, decimals) },
                onUpdate: function() {
                    el.innerHTML = parseFloat(this.targets()[0].innerHTML).toFixed(decimals);
                }
            });
        });
    }

    // Independent Wordmark Entrance & Hover Ripple (Waits for fitWordmarks)
    // Independent Split Hero Entrance
    let heroEntranceRun = false;
    function initSplitHeroEntrance() {
        if (heroEntranceRun) return;
        heroEntranceRun = true;
        
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        const tl = gsap.timeline();
        
        if (prefersReduced) {
            gsap.set('.hero-split-image, .hero-split-eyebrow, .hero-split-heading .split-line, .hero-split-desc, .hero-split-actions, .hero-split-social', {
                opacity: 1,
                y: 0,
                scale: 1
            });
            return;
        }

        // Image fade in
        tl.to('.hero-split-image', {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'power2.out'
        }, 0);
        
        // Staggered text elements
        const elements = [
            '.hero-split-eyebrow',
            ...document.querySelectorAll('.hero-split-heading .split-line'),
            '.hero-split-desc',
            '.hero-split-actions',
            '.hero-split-social'
        ];
        
        tl.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out'
        }, 0.2);
    }

    // 5. Custom Cursor
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorRing = document.querySelector(".cursor-ring");

    if (!prefersReducedMotion && matchMedia('(pointer:fine)').matches) {
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move dot
            gsap.set(cursorDot, { x: mouseX, y: mouseY });
        });

        // Loop for ring trailing effect
        gsap.ticker.add(() => {
            // lerp
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            gsap.set(cursorRing, { x: ringX, y: ringY });
        });

        // Add hover effects for cursor later using event delegation on body
        document.body.addEventListener("mouseover", (e) => {
            const target = e.target;
            if (target.closest("a, button, .cursor-hover")) {
                cursorRing.classList.add("is-link");
            }
            if (target.closest(".project-card")) {
                cursorRing.classList.add("is-view");
                cursorRing.classList.remove("is-link");
            }
        });

        document.body.addEventListener("mouseout", (e) => {
            const target = e.target;
            if (target.closest("a, button, .cursor-hover")) {
                cursorRing.classList.remove("is-link");
            }
            if (target.closest(".project-card")) {
                cursorRing.classList.remove("is-view");
            }
        });
    }

    // 6. Scroll Progress Bar
    const progressBar = document.querySelector(".scroll-progress");
    if (progressBar) {
        gsap.to(progressBar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3
            }
        });
    }

    // 7. Scroll to Top Button
    const scrollTopBtn = document.querySelector(".scroll-top-btn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 600) {
                scrollTopBtn.classList.add("is-visible");
            } else {
                scrollTopBtn.classList.remove("is-visible");
            }
        });

        scrollTopBtn.addEventListener("click", () => {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // 8. Drawer Logic
    const menuBtn = document.querySelector(".menu-btn");
    const drawer = document.querySelector(".drawer");
    const closeBtns = document.querySelectorAll(".drawer-close, .drawer-close-mobile");
    const drawerLinks = document.querySelectorAll(".drawer-link");
    
    let isDrawerOpen = false;
    const drawerTl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut", duration: 0.8 } });

    drawerTl.to(".drawer-left, .drawer-right", {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        stagger: 0.1
    }).from(".drawer-link", {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power3.out"
    }, "-=0.4").from(".drawer-brand, .drawer-socials, .drawer-footer", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out"
    }, "-=0.6");

    function openDrawer() {
        if(isDrawerOpen) return;
        isDrawerOpen = true;
        drawer.classList.add("is-open");
        menuBtn.setAttribute("aria-expanded", "true");
        if(lenis) lenis.stop();
        drawerTl.play();
    }

    function closeDrawer(onComplete) {
        if(!isDrawerOpen) {
            if (typeof onComplete === 'function') onComplete();
            return;
        }
        isDrawerOpen = false;
        menuBtn.setAttribute("aria-expanded", "false");
        drawerTl.reverse().then(() => {
            drawer.classList.remove("is-open");
            if(lenis) lenis.start();
            if (typeof onComplete === 'function') onComplete();
        });
    }

    if(menuBtn) menuBtn.addEventListener("click", openDrawer);
    if(closeBtns) closeBtns.forEach(btn => btn.addEventListener("click", () => closeDrawer()));

    window.addEventListener("keydown", (e) => {
        if(e.key === "Escape" && isDrawerOpen) closeDrawer();
    });

    // Shared scroll function
    function scrollToSection(targetId) {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        
        if (targetId === "#top") {
            if (lenis) lenis.scrollTo(0, { duration: 1.2 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            if (lenis) {
                lenis.scrollTo(targetEl, { offset: -90, duration: 1.2 });
            } else {
                const top = targetEl.getBoundingClientRect().top + window.scrollY - 90;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    }

    // 9. Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            e.preventDefault();
            
            if (isDrawerOpen) {
                closeDrawer(() => {
                    scrollToSection(targetId);
                });
            } else {
                scrollToSection(targetId);
            }
        });
    });

    // 9.5 Active Navbar Links
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = Array.from(document.querySelectorAll('section[id], footer[id]'));
    
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%",
            end: "bottom 50%",
            onToggle: (self) => {
                if(self.isActive) {
                    const id = section.getAttribute('id');
                    navLinks.forEach(link => {
                        if(link.getAttribute('href') === `#${id}`) {
                            link.classList.add('is-active');
                        } else {
                            link.classList.remove('is-active');
                        }
                    });
                }
            }
        });
    });

    // 10. Header Theme Swap Function
    window.checkHeaderTheme = function() {
        const darkSections = document.querySelectorAll('.theme-dark');
        const header = document.querySelector('.site-header');
        if(!header) return;

        darkSections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top 40px",
                end: "bottom 40px",
                onEnter: () => header.classList.add("is-dark"),
                onLeave: () => header.classList.remove("is-dark"),
                onEnterBack: () => header.classList.add("is-dark"),
                onLeaveBack: () => header.classList.remove("is-dark"),
            });
        });
    }

    // 11. Hero Parallax & Scroll effects
    gsap.to(".hero-bg-text-wrap", {
        y: -80,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".hero-portrait-wrap", {
        y: -40,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".hero-card", {
        y: -120,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".hero-tagline", {
        color: "var(--ink)",
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-tagline",
            start: "top 90%",
            end: "bottom 60%",
            scrub: true
        }
    });

    // 12. Manifesto Scrub
    const manifestoText = document.querySelector(".manifesto-text");
    if(manifestoText) {
        const words = manifestoText.innerText.split(" ");
        manifestoText.innerHTML = "";
        words.forEach(word => {
            const span = document.createElement("span");
            span.innerText = word + " ";
            span.className = "manifesto-word";
            manifestoText.appendChild(span);
        });

        gsap.to(manifestoText.querySelectorAll(".manifesto-word"), {
            color: "var(--ink)",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: ".manifesto",
                start: "top 80%",
                end: "bottom 40%",
                scrub: true
            }
        });
    }

    // 13. Generic Reveal System
    document.querySelectorAll("[data-reveal]").forEach(el => {
        gsap.fromTo(el, {
            y: 40, opacity: 0
        }, {
            y: 0, opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            }
        });
    });

    document.querySelectorAll("[data-stagger]").forEach(el => {
        gsap.fromTo(el.children, {
            y: 40, opacity: 0
        }, {
            y: 0, opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            }
        });
    });

    // 14. About Photo Parallax
    gsap.fromTo(".about-photo", {
        yPercent: -8
    }, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
            trigger: ".about-photo-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // 15. Magnetic HIRE ME Button
    const hireMeTextRing = document.querySelector(".hire-me-text-ring");
    if (hireMeTextRing) {
        gsap.to(hireMeTextRing, {
            rotation: 360,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });
    }

    const hireMeBtn = document.querySelector(".hire-me-btn");
    if (hireMeBtn && matchMedia('(pointer:fine)').matches) {
        hireMeBtn.addEventListener("mousemove", (e) => {
            const rect = hireMeBtn.getBoundingClientRect();
            const hx = rect.left + rect.width / 2;
            const hy = rect.top + rect.height / 2;
            const dx = (e.clientX - hx) * 0.4;
            const dy = (e.clientY - hy) * 0.4;
            gsap.to(hireMeBtn, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
        });
        hireMeBtn.addEventListener("mouseleave", () => {
            gsap.to(hireMeBtn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    }

    // 16. Core Expertise Logic (LEGACY - DISABLED)
    function initExpertiseLegacy() {
        const expertiseData = [
            { title: "FRONTEND ENGINEERING", chips: ["React.js", "JavaScript (ES6+)", "HTML5", "CSS3", "Responsive UI"], hue: 0 },
            { title: "BACKEND & DATABASES", chips: ["Java", "Node.js", "REST APIs", "MySQL", "SQL", "Postman"], hue: 60 },
            { title: "AI & MACHINE LEARNING", chips: ["Python", "Machine Learning", "Network-Anomaly Classification", "Cyber-Threat Detection"], hue: 120 },
            { title: "TOOLS, CLOUD & IoT", chips: ["Git", "GitHub", "Cloud Computing", "Internet of Things", "Real-Time Data Communication"], hue: 200 }
        ];

        const expList = document.querySelector(".expertise-list");
        const expMobile = document.querySelector(".expertise-mobile");

        if (expList && expMobile) {
            let desktopHtml = '';
            let mobileHtml = '';

            expertiseData.forEach((item, i) => {
                const num = (i + 1).toString().padStart(2, '0');
                const chipsHtml = item.chips.map(chip => `<span class="exp-chip">${chip}</span>`).join('');
                
                desktopHtml += `
                    <div class="expertise-item ${i === 0 ? 'is-active' : ''}">
                        <div class="exp-index">${num} &rarr;</div>
                        <div class="exp-title">${item.title}</div>
                        <div class="exp-chips">${chipsHtml}</div>
                    </div>
                `;

                mobileHtml += `
                    <div class="mob-exp-item" data-reveal>
                        <div class="mob-exp-capsule">
                            <div class="capsule-blob" style="filter:hue-rotate(${item.hue}deg)"></div>
                        </div>
                        <div class="exp-index">${num} &rarr;</div>
                        <div class="exp-title" style="color:var(--on-dark); font-size:clamp(2rem,6vw,3rem); margin-bottom:1rem;">${item.title}</div>
                        <div class="exp-chips">${chipsHtml}</div>
                    </div>
                `;
            });

            expList.innerHTML = desktopHtml;
            expMobile.innerHTML = mobileHtml;

            // Desktop Pinning & Stepping
            if (window.innerWidth >= 992) {
                const expItems = document.querySelectorAll(".expertise-item");
                const progressDots = document.querySelectorAll(".progress-dot");
                const capsuleBlob = document.querySelector(".expertise-capsule .capsule-blob");
                const capsule = document.querySelector(".expertise-capsule");

                let currentStep = 0;

                ScrollTrigger.create({
                    trigger: ".expertise-pin-area",
                    start: "top 15%",
                    end: "+=300%",
                    pin: true,
                    scrub: true,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const step = Math.min(3, Math.floor(progress * 4));
                        
                        if (step !== currentStep) {
                            // Out with old
                            gsap.to(expItems[currentStep], { y: -40, opacity: 0, visibility: "hidden", duration: 0.4 });
                            progressDots[currentStep].classList.remove("is-active");
                            
                            currentStep = step;
                            
                            // In with new
                            gsap.fromTo(expItems[currentStep], 
                                { y: 40, opacity: 0, visibility: "visible" }, 
                                { y: 0, opacity: 1, duration: 0.4, overwrite: true }
                            );
                            progressDots[currentStep].classList.add("is-active");

                            // Morph capsule
                            const hue = expertiseData[currentStep].hue;
                            gsap.to(capsuleBlob, {
                                filter: `blur(40px) hue-rotate(${hue}deg)`,
                                duration: 0.8
                            });
                            gsap.to(capsule, {
                                rotation: currentStep * 30,
                                duration: 0.8,
                                ease: "power2.inOut"
                            });
                        }
                    }
                });
            }
        }
    }

    // 17. Projects Sticky Stack
    const projectCards = document.querySelectorAll(".project-card");
    if (window.innerWidth >= 992) {
        projectCards.forEach((card, i) => {
            // Set sticky top offset
            card.style.position = "sticky";
            card.style.top = `calc(120px + ${i * 24}px)`;

            // Scale down previous cards as this one scrolls up
            if (i < projectCards.length - 1) {
                gsap.to(card, {
                    scale: 0.94,
                    filter: "brightness(0.6)",
                    ease: "none",
                    scrollTrigger: {
                        trigger: projectCards[i + 1],
                        start: "top 80%",
                        end: "top 20%",
                        scrub: true
                    }
                });
            }
        });
    }

    // 18. Journey Timeline
    gsap.to(".timeline-line-progress", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
            trigger: ".timeline-wrap",
            start: "top center",
            end: "bottom center",
            scrub: true
        }
    });

    // 19. Certification Marquee
    const certs = [
        "NPTEL – Internet of Things (Elite + Gold)", 
        "NPTEL – Programming in Java", 
        "NPTEL – Cloud Computing", 
        "Snowflake – SnowPro Associate: Platform", 
        "ServiceNow – Virtual Internship", 
        "Infosys Springboard – Virtual Internship 6.0", 
        "Salesforce – Salesforce Certified Associate", 
        "Infosys Springboard – Python Foundation", 
        "MongoDB – Campus Student Summit",
        "Infosys Springboard – Artificial Intelligence Foundation",
        "RedHat – RedHat Administration",
        "Novitech – Novitech Virtual Internship",
        "UiPath – RPA Developer Foundation"
    ];

    const track1 = document.querySelector(".track-1");
    const track2 = document.querySelector(".track-2");

    if (track1 && track2) {
        let itemsHtml1 = certs.map(c => `<div class="cert-pill"><i class="ph ph-certificate"></i> ${c}</div>`).join("");
        let itemsHtml2 = [...certs].reverse().map(c => `<div class="cert-pill"><i class="ph ph-certificate"></i> ${c}</div>`).join("");
        
        // Double it for seamless loop
        track1.innerHTML = itemsHtml1 + itemsHtml1;
        track2.innerHTML = itemsHtml2 + itemsHtml2;

        const t1Anim = gsap.to(track1, {
            xPercent: -50,
            repeat: -1,
            duration: 40,
            ease: "linear"
        });

        const t2Anim = gsap.fromTo(track2, {
            xPercent: -50
        }, {
            xPercent: 0,
            repeat: -1,
            duration: 55,
            ease: "linear"
        });

        const certMarquee = document.querySelector(".cert-marquee-wrap");
        certMarquee.addEventListener("mouseenter", () => {
            t1Anim.pause(); t2Anim.pause();
        });
        certMarquee.addEventListener("mouseleave", () => {
            t1Anim.play(); t2Anim.play();
        });
    }

    // 20. Accordion Logic
    const accBtns = document.querySelectorAll(".acc-btn");
    accBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.closest(".acc-item");
            const contentWrap = item.querySelector(".acc-content-wrap");
            const isOpen = item.classList.contains("is-open");
            
            // Close all
            document.querySelectorAll(".acc-item").forEach(otherItem => {
                otherItem.classList.remove("is-open");
                otherItem.querySelector(".acc-btn").setAttribute("aria-expanded", "false");
                const otherWrap = otherItem.querySelector(".acc-content-wrap");
                otherWrap.style.height = "0px";
            });

            // Open clicked if it wasn't open
            if (!isOpen) {
                item.classList.add("is-open");
                btn.setAttribute("aria-expanded", "true");
                contentWrap.style.height = contentWrap.scrollHeight + "px";
            }
        });

        // Initialize heights correctly
        if (!btn.closest(".acc-item").classList.contains("is-open")) {
            btn.closest(".acc-item").querySelector(".acc-content-wrap").style.height = "0px";
        }
    });



    // Call header theme check
    if(window.checkHeaderTheme) window.checkHeaderTheme();
});

document.addEventListener('DOMContentLoaded', () => {
    // Phase 1A: Core Expertise Animation
    const isMobile = window.innerWidth < 991;
    const prefersReducedMotionNew = false;

    if (!prefersReducedMotionNew) {
        document.querySelectorAll('.xp-row').forEach(row => {
            const media = row.querySelector('.xp-media');
            const img = row.querySelector('.xp-media img');
            const title = row.querySelector('.xp-title');
            const line = row.querySelector('.xp-line');
            const desc = row.querySelector('.xp-desc');
            const chips = row.querySelector('.xp-chips');

            if (title) {
                const words = title.innerText.split(' ');
                title.innerHTML = '';
                words.forEach(word => {
                    const wrap = document.createElement('span');
                    wrap.className = 'xp-title-word-wrap';
                    const inner = document.createElement('span');
                    inner.className = 'xp-title-word';
                    inner.innerText = word;
                    wrap.appendChild(inner);
                    title.appendChild(wrap);
                });
            }

            const titleWords = row.querySelectorAll('.xp-title-word');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: row,
                    start: 'top 75%',
                }
            });

            tl.fromTo(row, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0);
            
            if (media) {
                tl.fromTo(media, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' }, 0.2);
            }

            if (titleWords.length) {
                tl.fromTo(titleWords, 
                    { yPercent: 110, color: '#8a8a8a' }, 
                    { yPercent: 0, color: '#ffffff', duration: 1, stagger: 0.06, ease: 'power3.out' }, 
                    0.3
                );
            }

            if (line) {
                tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, 0.5);
            }
            
            const staggerEls = [];
            if(desc) staggerEls.push(desc);
            if(chips) staggerEls.push(chips);
            
            if (staggerEls.length) {
                tl.fromTo(staggerEls, 
                    { y: 24, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out' }, 
                    0.6
                );
            }

            if (img && !isMobile) {
                gsap.fromTo(img, 
                    { yPercent: -6 }, 
                    { yPercent: 6, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true } }
                );
            }

            row.addEventListener('mouseenter', () => {
                if(media && !isMobile) gsap.to(media, { scale: 1.04, duration: 0.8, ease: 'power3.out' });
            });
            row.addEventListener('mouseleave', () => {
                if(media && !isMobile) gsap.to(media, { scale: 1, duration: 0.8, ease: 'power3.out' });
            });
        });
    }
});

window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth < 991;
    const prefersReducedMotionNew = false;

    // --- Phase 1B: Certificates ---
    const certData = [
        { img: "introduction to internet of things.webp", title: "Internet of Things (Elite + Gold)", org: "NPTEL" },
        { img: "JAVA PROGRAMMING .webp", title: "Programming in Java", org: "NPTEL" },
        { img: "Cloud Computing.webp", title: "Cloud Computing", org: "NPTEL" },
        { img: "SNOWFLAKE_CERTIFICATION.webp", title: "SnowPro Associate: Platform", org: "Snowflake" },
        { img: "SERVICE NOW CERTIFICATE.webp", title: "Virtual Internship", org: "ServiceNow" },
        { img: "INFOSYS INTERNSHIP.webp", title: "Virtual Internship 6.0", org: "Infosys Springboard" },
        { img: "Salesforce_certificate.webp", title: "Salesforce Certified Associate", org: "Salesforce" },
        { img: "python foundation.webp", title: "Python Foundation", org: "Infosys Springboard" },
        { img: "Mongodb.webp", title: "Campus Student Summit Participation", org: "MongoDB" },
        { img: "INFOSYS AI .webp", title: "Artificial Intelligence Foundation", org: "Infosys Springboard" },
        { img: "REDHAT.webp", title: "RedHat Administration", org: "RedHat" },
        { img: "NOVITECH INTERNSHIP.webp", title: "Novitech Virtual Internship", org: "Novitech" },
        { img: "UI PATH.webp", title: "RPA Developer Foundation", org: "UiPath" }
    ];

    const certCols = [
        document.querySelector('.cert-col-1'),
        document.querySelector('.cert-col-2'),
        document.querySelector('.cert-col-3')
    ];

    if (certCols[0]) {
        // Create 2 copies of certData for the seamless loop
        const totalItems = [...certData, ...certData];

        totalItems.forEach((cert, i) => {
            const colIdx = isMobile ? (i % 2) : (i % 3);
            const col = certCols[colIdx];
            if(col) {
                col.innerHTML += `
                    <div class="cert-item" data-src="assets/certificates/${cert.img}">
                        <div class="cert-fb-issuer">${cert.org}</div>
                        <div class="cert-fb-title-wrap">
                            <div class="cert-fb-sub">Certificate of Completion</div>
                            <div class="cert-fb-name">Noor Mohamed A</div>
                            <div class="cert-fb-line"></div>
                            <div class="cert-fb-title">${cert.title}</div>
                        </div>
                        <div class="cert-fb-seal"></div>
                        <img src="assets/certificates/${cert.img}" alt="${cert.title}" loading="lazy" onerror="this.style.display='none'">
                    </div>
                `;
            }
        });

        // Set up seamless vertical drifting
        if (!prefersReducedMotionNew) {
            certCols.forEach((col, i) => {
                if(!col || (isMobile && i === 2)) return;
                
                // Duplicate column content again inside the column to ensure seamless scroll
                col.innerHTML += col.innerHTML;
                
                let isMiddle = i === 1;
                
                gsap.set(col, { yPercent: isMiddle ? -50 : 0 });
                
                let tl = gsap.to(col, {
                    yPercent: isMiddle ? 0 : -50,
                    ease: "none",
                    duration: isMiddle ? 25 : 30, // slow speed
                    repeat: -1
                });
                
                // Hover slows it down
                const wallWrap = document.querySelector('.cert-wall-wrap');
                if (wallWrap) {
                    wallWrap.addEventListener('mouseenter', () => gsap.to(tl, {timeScale: 0.2, duration: 0.5}));
                    wallWrap.addEventListener('mouseleave', () => gsap.to(tl, {timeScale: 1, duration: 0.5}));
                    
                    ScrollTrigger.create({
                        trigger: wallWrap,
                        start: 'top bottom',
                        end: 'bottom top',
                        onUpdate: (self) => {
                            let vel = self.getVelocity() / 500;
                            vel = Math.max(-2, Math.min(2, vel));
                            if (Math.abs(vel) > 0.5) {
                                gsap.to(tl, {timeScale: 1 + Math.abs(vel), duration: 0.1, overwrite: true, onComplete: () => {
                                    gsap.to(tl, {timeScale: 1, duration: 0.5});
                                }});
                            }
                        }
                    });
                }
            });
        }
        
        // Lightbox
        const lightbox = document.getElementById('cert-lightbox');
        const lightboxContent = lightbox.querySelector('.cert-lightbox-content');
        
        document.querySelectorAll('.cert-item').forEach(item => {
            item.addEventListener('click', () => {
                lightboxContent.innerHTML = `
                    <div class="cert-lightbox-item">
                        ${item.innerHTML}
                    </div>
                `;
                const img = lightboxContent.querySelector('img');
                if (img && img.style.display !== 'none') {
                    img.style.display = 'block';
                }
                
                lightbox.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeBtn = lightbox.querySelector('.cert-lightbox-close');
        const lightboxBg = lightbox.querySelector('.cert-lightbox-bg');
        
        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxContent.innerHTML = ''; }, 400);
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (lightboxBg) lightboxBg.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
        });
    }

    // --- Phase 1C: Tech Stack ---
    const track1 = document.querySelector('.stack-track-1');
    const track2 = document.querySelector('.stack-track-2');

    function buildTrack(track, items) {
        if(!track || !items || !items.length) return;
        let html = '';
        const fullItems = [...items, ...items, ...items, ...items, ...items, ...items]; // Plenty of duplicates
        
        fullItems.forEach(tech => {
            html += `
                <div class="stack-item">
                    <div class="stack-icon-wrapper">${tech.svg}</div>
                    <span class="stack-name">${tech.name}</span>
                </div>
            `;
        });
        track.innerHTML = html;
    }

    buildTrack(track1, typeof stackDataRow1 !== 'undefined' ? stackDataRow1 : []);
    buildTrack(track2, typeof stackDataRow2 !== 'undefined' ? stackDataRow2 : []);

    if (!prefersReducedMotionNew && track1 && track2) {
        const t1 = gsap.to('.stack-track-1', {
            xPercent: -50,
            ease: "none",
            duration: 35,
            repeat: -1
        });
        
        gsap.set('.stack-track-2', { xPercent: -50 });
        const t2 = gsap.to('.stack-track-2', {
            xPercent: 0,
            ease: "none",
            duration: 40,
            repeat: -1
        });

        const wrap = document.querySelector('.stack-marquee-wrap');
        if (wrap) {
            wrap.addEventListener('mouseenter', () => {
                gsap.to([t1, t2], { timeScale: 0.3, duration: 0.5 });
            });
            wrap.addEventListener('mouseleave', () => {
                gsap.to([t1, t2], { timeScale: 1, duration: 0.5 });
            });
        }
    }
});

// Pure JS Wordmark Sizing for Footer
let isFittingFooter = false;

function fitFooterWordmark() {
    if (isFittingFooter) return;
    
    const container = document.querySelector('.giant-wordmark');
    if (!container) return;
    const span = container.querySelector('span');
    if (!span) return;
    const wrap = container.parentElement;

    isFittingFooter = true;
    requestAnimationFrame(() => {
        // Reset to a measurable state without wrapping
        container.style.fontSize = '10px';
        span.style.display = 'inline-block';
        span.style.width = 'max-content';
        
        // Measure real rendered width
        const textWidth = span.getBoundingClientRect().width || span.scrollWidth;
        const targetWidth = wrap.clientWidth * 0.94; // 94% of container
        
        // Safety check to prevent tiny dot / 10px leftover
        if (!textWidth || !targetWidth || textWidth <= 0 || targetWidth <= 0) {
            console.warn("fitFooterWordmark aborted: Invalid measurement", { textWidth, targetWidth });
            container.style.fontSize = '';
            span.style.display = '';
            span.style.width = '';
            isFittingFooter = false;
            return;
        }
        
        // Calculate exact scale
        let calculatedPx = (targetWidth / textWidth) * 10;
        
        if (isNaN(calculatedPx) || calculatedPx < 20) {
            console.warn("fitFooterWordmark aborted: Size too small or NaN", calculatedPx);
            container.style.fontSize = '';
            span.style.display = '';
            span.style.width = '';
            isFittingFooter = false;
            return;
        }
        
        // Apply and verify
        container.style.fontSize = calculatedPx + 'px';
        
        let attempts = 0;
        let rect = span.getBoundingClientRect();
        while (rect.width > window.innerWidth * 0.98 && attempts < 20) {
            calculatedPx *= 0.98;
            container.style.fontSize = calculatedPx + 'px';
            rect = span.getBoundingClientRect();
            attempts++;
        }
        
        // Restore layout
        span.style.display = '';
        span.style.width = '';
        isFittingFooter = false;
        
        // Force refresh scroll heights to prevent whitespace at bottom
        setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
            if (window.lenis) window.lenis.resize();
        }, 100);
    });
}

// Wait for fonts to settle, then size, then check again
document.fonts.ready.then(() => {
    fitFooterWordmark();
    setTimeout(() => fitFooterWordmark(), 300);
});

// Debounced resize handler
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        fitFooterWordmark();
    }, 150);
});

// Pre-decode large expertise images to prevent scroll jank, then refresh once
window.addEventListener('load', () => {
    const images = Array.from(document.querySelectorAll('.xp-media img'));
    Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return img.decode().catch(() => {});
    })).then(() => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        if (window.lenis) window.lenis.resize();
    });
});

// Footer Heading Word Rotator
(function() {
    const words = document.querySelectorAll(".rotator-word");
    if (words.length > 0 && typeof gsap !== 'undefined') {
        let currentIndex = 0;
        
        // Initial setup
        gsap.set(words, { yPercent: 100, opacity: 0, filter: "blur(4px)", color: "#888" });
        gsap.set(words[0], { yPercent: 0, opacity: 1, filter: "blur(0px)", color: "#ffffff" });

        setInterval(() => {
            const currentWord = words[currentIndex];
            const nextIndex = (currentIndex + 1) % words.length;
            const nextWord = words[nextIndex];

            const tl = gsap.timeline();
            
            // Current word slides up, fades out, blurs, goes gray
            tl.to(currentWord, {
                yPercent: -100,
                opacity: 0,
                filter: "blur(4px)",
                color: "#888",
                duration: 0.6,
                ease: "power2.inOut"
            }, 0);

            // Next word slides up from below, fades in, unblurs, goes white
            tl.fromTo(nextWord, {
                yPercent: 100,
                opacity: 0,
                filter: "blur(4px)",
                color: "#888"
            }, {
                yPercent: 0,
                opacity: 1,
                filter: "blur(0px)",
                color: "#ffffff",
                duration: 0.6,
                ease: "power2.inOut"
            }, 0);

            currentIndex = nextIndex;
        }, 2500);
    }
})();
