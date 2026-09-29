const fs = require('fs');
let js = fs.readFileSync('assets/js/main.js', 'utf8');

const startStr = '// --- Phase 1B: Certificates ---';
const endStr = '// --- Phase 1C: Tech Stack ---';

const startIdx = js.indexOf(startStr);
const endIdx = js.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const newJs = `// --- Phase 1B: Certificates ---
    const certData = [
        { img: "cert-01.webp", title: "Internet of Things (Elite + Gold)", org: "NPTEL" },
        { img: "cert-02.webp", title: "Programming in Java", org: "NPTEL" },
        { img: "cert-03.webp", title: "Cloud Computing", org: "NPTEL" },
        { img: "cert-04.webp", title: "SnowPro Associate: Platform", org: "Snowflake" },
        { img: "cert-05.webp", title: "Virtual Internship", org: "ServiceNow" },
        { img: "cert-06.webp", title: "Virtual Internship 6.0", org: "Infosys Springboard" },
        { img: "cert-07.webp", title: "Java Foundation", org: "Infosys Springboard" },
        { img: "cert-08.webp", title: "Campus Student Summit Participation", org: "MongoDB" },
        { img: "cert-09.webp", title: "National Level Hackathon Participant", org: "VIBATHON'26" }
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
                col.innerHTML += \`
                    <div class="cert-item" data-src="assets/certificates/\${cert.img}">
                        <div class="cert-fb-issuer">\${cert.org}</div>
                        <div class="cert-fb-title-wrap">
                            <div class="cert-fb-sub">Certificate of Completion</div>
                            <div class="cert-fb-name">Noor Mohamed A</div>
                            <div class="cert-fb-line"></div>
                            <div class="cert-fb-title">\${cert.title}</div>
                        </div>
                        <div class="cert-fb-seal"></div>
                        <img src="assets/certificates/\${cert.img}" alt="\${cert.title}" loading="lazy" onerror="this.style.display='none'">
                    </div>
                \`;
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
                lightboxContent.innerHTML = \`
                    <div class="cert-lightbox-item">
                        \${item.innerHTML}
                    </div>
                \`;
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

    `;
  js = js.substring(0, startIdx) + newJs + js.substring(endIdx);
  fs.writeFileSync('assets/js/main.js', js);
  console.log('JS updated successfully.');
} else {
  console.log('Could not find start/end indices.', startIdx, endIdx);
}
