// achievements.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Page Transition Out
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
        // Fade in page on load
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 100);
    }

    document.querySelectorAll('.back-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.getAttribute('target') === '_blank') return;
            e.preventDefault();
            if(overlay) {
                overlay.style.pointerEvents = 'auto';
                overlay.style.opacity = '1';
                setTimeout(() => {
                    window.location.href = link.href;
                }, 400);
            } else {
                window.location.href = link.href;
            }
        });
    });

    // 2. Setup Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. Certificates Data
    const certData = [
        { id: 1, img: "introduction to internet of things.webp", title: "Internet of Things (Elite + Gold)", org: "NPTEL", category: "Certifications", date: "", desc: "Advanced concepts in IoT, embedded systems, and sensor networks." },
        { id: 2, img: "JAVA PROGRAMMING .webp", title: "Programming in Java", org: "NPTEL", category: "Certifications", date: "", desc: "Comprehensive course on core Java concepts and object-oriented programming." },
        { id: 3, img: "Cloud Computing.webp", title: "Cloud Computing", org: "NPTEL", category: "Certifications", date: "", desc: "Fundamentals of cloud architectures, virtualization, and deployment models." },
        { id: 4, img: "SNOWFLAKE_CERTIFICATION.webp", title: "SnowPro Associate: Platform", org: "Snowflake", category: "Certifications", date: "", desc: "Validated expertise in Snowflake cloud data platform architecture and data warehousing." },
        { id: 5, img: "SERVICE NOW CERTIFICATE.webp", title: "Virtual Internship", org: "ServiceNow", category: "Internships", date: "", desc: "Hands-on experience with ServiceNow development and IT service management." },
        { id: 6, img: "INFOSYS INTERNSHIP.webp", title: "Virtual Internship 6.0", org: "Infosys Springboard", category: "Internships", date: "", desc: "Practical internship focusing on modern web development and software engineering." },
        { id: 7, img: "Salesforce_certificate.webp", title: "Salesforce Certified Associate", org: "Salesforce", category: "Certifications", date: "", desc: "Proven ability to configure and manage Salesforce platforms." },
        { id: 8, img: "python foundation.webp", title: "Python Foundation", org: "Infosys Springboard", category: "Certifications", date: "", desc: "Foundational concepts and best practices in Python software development." },
        { id: 9, img: "Mongodb.webp", title: "Campus Student Summit Participation", org: "MongoDB", category: "Participation & Achievements", date: "", desc: "Participated in MongoDB summit, learning advanced NoSQL database modeling." },
        { id: 10, img: "INFOSYS AI .webp", title: "Artificial Intelligence Foundation", org: "Infosys Springboard", category: "Certifications", date: "", desc: "Foundational concepts in AI and machine learning practical applications." },
        { id: 11, img: "REDHAT.webp", title: "RedHat Administration", org: "RedHat", category: "Certifications", date: "", desc: "System administration, server deployment, and Linux operating systems." },
        { id: 12, img: "NOVITECH INTERNSHIP.webp", title: "Novitech Virtual Internship", org: "Novitech", category: "Internships", date: "", desc: "Applied industry internship focusing on real-world tech stacks." },
        { id: 13, img: "UI PATH.webp", title: "RPA Developer Foundation", org: "UiPath", category: "Certifications", date: "", desc: "Robotic Process Automation, building robust automation workflows." }
    ];

    // Helper: generate HTML fallback
    function generateFallback(cert) {
        return `
            <div class="cert-fb-issuer">${cert.org}</div>
            <div class="cert-fb-title-wrap">
                <div class="cert-fb-sub">Certificate of Completion</div>
                <div class="cert-fb-name">Noor Mohamed A</div>
                <div class="cert-fb-line"></div>
                <div class="cert-fb-title">${cert.title}</div>
            </div>
            <div class="cert-fb-seal"></div>
        `;
    }

    // 4. Hero Morph Animation
    const isMobile = window.innerWidth < 991;

    if (!isMobile) {
        gsap.registerPlugin(ScrollTrigger);

        const floatContainer = document.querySelector('.ach-floating-cards');
        const gridTarget = document.querySelector('.ach-grid-target');
        const heroContent = document.querySelector('.ach-hero-content');
        const heroWrap = document.querySelector('.ach-hero-wrap');

        // Render 9 slots in hidden grid
        let gridHTML = '';
        let floatHTML = '';
        
        certData.forEach((cert, i) => {
            gridHTML += `<div class="ach-grid-slot" id="slot-${i}"></div>`;
            
            // Random initial float positions
            const angle = (Math.random() - 0.5) * 40; // -20 to 20 deg
            const x = (Math.random() - 0.5) * 80; // -40vw to 40vw
            const y = (Math.random() - 0.5) * 60; // -30vh to 30vh
            
            floatHTML += `
                <div class="ach-float-card" id="float-${i}" style="transform: translate(-50%, -50%) rotate(${angle}deg); left: ${50 + x}vw; top: ${50 + y}vh;">
                    ${generateFallback(cert)}
                    <img src="assets/certificates/${cert.img}" alt="" onerror="this.style.display='none'">
                </div>
            `;
        });
        
        gridTarget.innerHTML = gridHTML;
        floatContainer.innerHTML = floatHTML;

        // Reveal floating cards
        gsap.to('.ach-float-card', { opacity: 1, duration: 1, stagger: 0.1, ease: "power2.out", delay: 0.5 });

        // Continuous bobbing animation
        const bobs = [];
        document.querySelectorAll('.ach-float-card').forEach((card, i) => {
            const bob = gsap.to(card, {
                y: "+=20",
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random() * 2
            });
            bobs.push(bob);
        });

        // Setup Scroll Morph Timeline
        let morphTl;
        
        function initMorph() {
            if (morphTl) morphTl.kill();
            
            morphTl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroWrap,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                    onUpdate: (self) => {
                        // Pause bobbing when scrolling, resume when back at top
                        if (self.progress > 0) {
                            bobs.forEach(b => b.pause());
                        } else {
                            bobs.forEach(b => b.play());
                        }
                    }
                }
            });

            // Fade out hero text
            morphTl.to(heroContent, { opacity: 0, y: -50, duration: 0.3 }, 0);

            // Morph cards into grid slots
            document.querySelectorAll('.ach-float-card').forEach((card, i) => {
                const slot = document.getElementById(`slot-${i}`);
                const slotRect = slot.getBoundingClientRect();
                const cardRect = card.getBoundingClientRect();
                
                // Calculate position relative to viewport
                // We want the card to end up EXACTLY over the slot at the end of the scroll.
                // Since floatContainer is position:fixed, we just animate left/top/transform.
                
                // Get absolute viewport target pos at the moment the morph ends (when we hit bottom of heroWrap)
                // Actually, ScrollTrigger pinning makes this tricky if we pin the container.
                // Instead, heroWrap is 180vh. ScrollTrigger scrubs from 0 to 80vh scroll distance.
                // The gridTarget is at the bottom of heroWrap. So at the end of the scrub, gridTarget is in viewport.
                // We need to animate the fixed cards to the position of the slots *relative to the viewport* at that exact final scroll position.
                // Because gridTarget is at the bottom of heroWrap, when scroll reaches "bottom bottom", the gridTarget is at the bottom of the screen.
            });
            
            // A simpler, bulletproof approach: 
            // Instead of animating fixed elements to scrolled elements, we animate the fixed elements' left/top to match a grid layout that we know.
            // We know the gridTarget is 90% wide, max 1200px. It has 3 columns, gap 1.5rem.
            
            // Let's actually use Flip plugin or just calculate offsets.
            // Even easier: Morph the cards to x: 0, y: 0, scale: 1, and change their position to be relative to a container that scrolls.
            
        }
        
        // Wait, since we are constrained to existing GSAP CDNs and no Flip plugin, I will use a different trick:
        // The floating cards are in a fixed container.
        // As we scroll, we animate their `left`, `top`, `width`, `height`, `rotate` to match the bounding rects of the slots.
        // BUT the slots are moving as we scroll!
        // To fix this, we put the `.ach-floating-cards` inside `.ach-grid-target` as absolute elements at the end, and just animate `x`, `y` from their initial floating positions!
        
        // Let's redesign the morph logic inline.
        const floatCards = document.querySelectorAll('.ach-float-card');
        
        // Prepare initial states
        floatCards.forEach((card, i) => {
            // Record original fixed styles
            card.dataset.origLeft = card.style.left;
            card.dataset.origTop = card.style.top;
            card.dataset.origRotate = card.style.transform;
        });

        morphTl = gsap.timeline({
            scrollTrigger: {
                trigger: heroWrap,
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });

        morphTl.to(heroContent, { opacity: 0, scale: 0.9, duration: 0.2 }, 0);

        // We will move the fixed cards to match the slots' screen positions when heroWrap is fully scrolled.
        function getTargetRects() {
            // Scroll to the end of heroWrap temporarily to measure
            const currentScroll = window.scrollY;
            const targetScroll = heroWrap.offsetTop + heroWrap.offsetHeight - window.innerHeight;
            window.scrollTo(0, targetScroll);
            
            const rects = [];
            for (let i = 0; i < 9; i++) {
                rects.push(document.getElementById(`slot-${i}`).getBoundingClientRect());
            }
            
            window.scrollTo(0, currentScroll);
            return rects;
        }

        // Just use a simpler animation: group them into a grid visually in the center of the screen, then un-fix them.
        const gridW = Math.min(window.innerWidth * 0.9, 1200);
        const colW = (gridW - (32 * 2)) / 3; // 2 gaps of 1.5rem (24px) -> let's say 24px gap. (gridW - 48)/3
        const cardW = colW;
        const cardH = colW / 1.414;
        
        floatCards.forEach((card, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const targetX = (window.innerWidth / 2) - (gridW / 2) + (col * (cardW + 24)) + (cardW / 2);
            const targetY = (window.innerHeight * 0.2) + (row * (cardH + 24)) + (cardH / 2); // 20vh from top
            
            morphTl.to(card, {
                left: targetX,
                top: targetY,
                width: cardW,
                height: cardH,
                rotate: 0,
                transform: "translate(-50%, -50%) rotate(0deg)",
                duration: 0.8,
                ease: "power2.inOut"
            }, 0);
        });
        
        // After timeline finishes, hide the fixed cards and show the real grid in Archive, 
        // OR we just rely on the archive section being directly below heroWrap.
        // Actually, to make it perfectly seamless and simple for the user, let's just fade out the fixed cards and fade in the Archive section.
        morphTl.to('.ach-floating-cards', { opacity: 0, duration: 0.2 }, 0.8);
    }

    // 5. Section C: The Archive Logic
    const archiveGrid = document.getElementById('ach-archive-grid');
    const noResults = document.getElementById('ach-no-results');
    const searchInput = document.getElementById('ach-search-input');
    const filterBtns = document.querySelectorAll('.ach-filter-btn');
    const sortBtn = document.getElementById('ach-sort-btn');
    
    let currentFilter = 'All';
    let currentSearch = '';
    let sortAsc = true;

    function renderArchive() {
        // Filter
        let filtered = certData.filter(c => {
            const matchFilter = currentFilter === 'All' || c.category === currentFilter;
            const matchSearch = c.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                                c.org.toLowerCase().includes(currentSearch.toLowerCase());
            return matchFilter && matchSearch;
        });

        // Sort
        filtered.sort((a, b) => {
            return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        });

        // Update counts
        document.getElementById('count-all').innerText = certData.length;
        document.getElementById('count-cert').innerText = certData.filter(c => c.category === 'Certifications').length;
        document.getElementById('count-int').innerText = certData.filter(c => c.category === 'Internships').length;
        document.getElementById('count-part').innerText = certData.filter(c => c.category === 'Participation & Achievements').length;

        // Update stats
        document.getElementById('stat-total').innerText = filtered.length;
        document.getElementById('stat-cert').innerText = filtered.filter(c => c.category === 'Certifications').length;
        document.getElementById('stat-int').innerText = filtered.filter(c => c.category === 'Internships').length;

        if (filtered.length === 0) {
            archiveGrid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        
        let html = '';
        filtered.forEach(c => {
            html += `
                <div class="ach-card">
                    <div class="ach-card-img-wrap">
                        <div class="ach-card-tag">${c.category}</div>
                        <button class="ach-card-preview-btn" data-img="${c.img}" aria-label="Preview"><i class="ph ph-corners-out"></i></button>
                        <div class="ach-card-cred">CREDENTIAL</div>
                        ${c.date ? `<div class="ach-card-date">${c.date}</div>` : ''}
                        
                        <div class="ach-float-card" style="position:absolute; inset:0; width:100%; height:100%; transform:none; opacity:1; padding:2rem; box-shadow:none; border-radius:0;">
                            ${generateFallback(c)}
                        </div>
                        <img src="assets/certificates/${c.img}" alt="${c.title}" loading="lazy" onerror="this.style.display='none'">
                        <div class="ach-card-overlay"></div>
                    </div>
                    <div class="ach-card-body">
                        <h3 class="ach-card-title">${c.title}</h3>
                        <div class="ach-card-org"><i class="ph ph-buildings"></i> ${c.org}</div>
                    </div>
                    <div class="ach-card-footer">
                        <button class="ach-card-expand-btn" aria-expanded="false">Expand Archive <i class="ph ph-caret-down"></i></button>
                        <div class="ach-card-expanded-content">
                            <p class="ach-card-desc">${c.desc}</p>
                            <button class="ach-card-view-btn" data-img="${c.img}">View Certificate</button>
                        </div>
                    </div>
                </div>
            `;
        });

        archiveGrid.innerHTML = html;

        // Bind Expand Events
        archiveGrid.querySelectorAll('.ach-card-expand-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.ach-card');
                const content = card.querySelector('.ach-card-expanded-content');
                const isExpanded = card.classList.contains('is-expanded');
                
                if (isExpanded) {
                    card.classList.remove('is-expanded');
                    btn.setAttribute('aria-expanded', 'false');
                    content.style.height = '0px';
                } else {
                    card.classList.add('is-expanded');
                    btn.setAttribute('aria-expanded', 'true');
                    content.style.height = content.scrollHeight + 'px';
                }
            });
        });

        // Bind Lightbox Events
        archiveGrid.querySelectorAll('.ach-card-preview-btn, .ach-card-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                openLightbox(btn.getAttribute('data-img'), btn.closest('.ach-card'));
            });
        });
    }

    // Lightbox Logic
    const lightbox = document.getElementById('ach-lightbox');
    const lightboxContent = lightbox.querySelector('.cert-lightbox-content');
    
    function openLightbox(imgSrc, cardEl) {
        // Find the fallback HTML from the card
        const fallbackHTML = cardEl.querySelector('.ach-float-card').innerHTML;
        
        lightboxContent.innerHTML = `
            <div class="cert-lightbox-item">
                ${fallbackHTML}
                <img src="assets/certificates/${imgSrc}" onerror="this.style.display='none'">
            </div>
        `;
        
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxContent.innerHTML = ''; }, 400);
    }

    lightbox.querySelector('.cert-lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.cert-lightbox-bg').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });

    // Inputs
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            gsap.to(archiveGrid, { opacity: 0, duration: 0.2, onComplete: () => {
                renderArchive();
                gsap.to(archiveGrid, { opacity: 1, duration: 0.3 });
            }});
        });
    });

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderArchive();
    });

    sortBtn.addEventListener('click', () => {
        sortAsc = !sortAsc;
        sortBtn.innerHTML = sortAsc ? '<i class="ph ph-sort-ascending"></i>' : '<i class="ph ph-sort-descending"></i>';
        renderArchive();
    });

    // Initial render
    renderArchive();
});
