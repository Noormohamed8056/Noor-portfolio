const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const certStart = html.indexOf('<!-- Phase 1B: Certificates -->');
const certEnd = html.indexOf('<!-- Phase 1C: Tech Stack -->');

if (certStart !== -1 && certEnd !== -1) {
  const newHTML = `<!-- Phase 1B: Certificates -->
                <section class="cert theme-dark">
                    <div class="cert-container">
                        <div class="cert-header" data-reveal>
                            <div class="cert-eyebrow">CERTIFICATIONS & ACHIEVEMENTS</div>
                            <h2 class="cert-title">Learning Backed by Global Certifications.</h2>
                            <p class="cert-desc">Certifications in Java, IoT, Cloud, Data Platforms and Full-Stack Development from NPTEL, Infosys, Snowflake, ServiceNow and MongoDB.</p>
                            <a href="https://linkedin.com/in/noor-mohamed07/details/certifications/" target="_blank" rel="noopener noreferrer" class="cert-btn cursor-hover">
                                View All Achievements <span class="btn-arrow">&rarr;</span>
                            </a>
                        </div>
                        
                        <div class="cert-wall-wrap">
                            <div class="cert-wall" id="cert-wall-grid">
                                <div class="cert-col cert-col-1"></div>
                                <div class="cert-col cert-col-2"></div>
                                <div class="cert-col cert-col-3"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="cert-lightbox" class="cert-lightbox" role="dialog" aria-modal="true" aria-hidden="true">
                        <div class="cert-lightbox-bg cursor-hover"></div>
                        <button class="cert-lightbox-close cursor-hover" aria-label="Close lightbox"><i class="ph ph-x"></i></button>
                        <div class="cert-lightbox-content"></div>
                    </div>
                </section>

                `;
  html = html.substring(0, certStart) + newHTML + html.substring(certEnd);
  fs.writeFileSync('index.html', html);
  console.log('HTML updated');
}
