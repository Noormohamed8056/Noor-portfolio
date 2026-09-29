const fs = require('fs');
let css = fs.readFileSync('assets/css/main.css', 'utf8');

const startIdx = css.indexOf('/* --- Phase 1B: Certificates --- */');
const endIdx = css.indexOf('/* --- Phase 1C: Tech Stack --- */');

if(startIdx !== -1 && endIdx !== -1) {
  const newCss = `/* --- Phase 1B: Certificates --- */
.cert {
  padding: clamp(5rem, 12vw, 10rem) 0;
  position: relative;
  background-color: #000;
  color: #fff;
  overflow: hidden;
}

.cert-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
}

.cert-header {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.cert-eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--on-dark-soft);
  margin-bottom: 1.5rem;
}

.cert-title {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.cert-desc {
  font-size: 1.1rem;
  line-height: 1.5;
  color: var(--on-dark-soft);
  margin-bottom: 2.5rem;
  max-width: 600px;
}

.cert-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 28px;
  background-color: #ffffff;
  color: #000000;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: var(--radius-pill);
  text-decoration: none;
  transition: transform 0.3s ease;
}

.cert-btn:hover {
  transform: translateY(-4px);
}

.cert-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

/* The Certificate Wall */
.cert-wall-wrap {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  height: 650px;
  position: relative;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
}

.cert-wall {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  height: 100%;
}

.cert-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  will-change: transform;
}

.cert-item {
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  cursor: zoom-in;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem;
  color: #000;
  aspect-ratio: 1.414 / 1; 
  transition: transform 0.3s ease;
}

.cert-item:hover {
  transform: scale(1.02);
}

/* Fallback HTML certificate styling */
.cert-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 4px solid rgba(0,0,0,0.03);
  margin: 8px;
  pointer-events: none;
}

.cert-fb-issuer {
  font-size: 0.65rem;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cert-fb-title-wrap {
  text-align: center;
  margin: 1rem 0;
}

.cert-fb-sub {
  font-size: 0.7rem;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.cert-fb-name {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.2rem;
  color: #111;
  margin-bottom: 0.5rem;
}

.cert-fb-title {
  font-weight: 700;
  font-size: 0.8rem;
  color: #000;
  line-height: 1.2;
}

.cert-fb-line {
  height: 1px;
  background-color: #eee;
  width: 60%;
  margin: 0 auto 0.5rem auto;
}

.cert-fb-seal {
  align-self: flex-end;
  width: 30px;
  height: 30px;
  background-color: var(--accent);
  border-radius: 50%;
  position: relative;
}

.cert-fb-seal::after {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px dashed rgba(255,255,255,0.8);
  border-radius: 50%;
}

.cert-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  border-radius: 8px;
  /* displayed via JS if loaded */
}

/* Lightbox */
.cert-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.cert-lightbox.is-open {
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
}

.cert-lightbox-bg {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.cert-lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 2;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.3s ease;
}

.cert-lightbox-close:hover {
  transform: scale(1.1) rotate(90deg);
}

.cert-lightbox-content {
  position: relative;
  z-index: 1;
  width: 90vw;
  max-width: 1000px;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cert-lightbox-item {
  width: 100%;
  max-height: 100%;
  aspect-ratio: 1.414 / 1;
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3rem;
  color: #000;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  transform: scale(0.95);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease;
}

.cert-lightbox.is-open .cert-lightbox-item {
  transform: scale(1);
  opacity: 1;
}

.cert-lightbox-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
  background-color: #111; 
}

/* Larger fallback styling in lightbox */
.cert-lightbox-item .cert-fb-issuer { font-size: 1rem; }
.cert-lightbox-item .cert-fb-sub { font-size: 1.2rem; }
.cert-lightbox-item .cert-fb-name { font-size: 2.5rem; }
.cert-lightbox-item .cert-fb-title { font-size: 1.8rem; }
.cert-lightbox-item .cert-fb-seal { width: 60px; height: 60px; }

@media (max-width: 991px) {
  .cert-wall {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .cert-wall-wrap {
    height: 500px;
  }
  .cert-wall {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .cert-col {
    gap: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cert-wall-wrap {
    height: auto;
    mask-image: none;
    -webkit-mask-image: none;
    overflow: visible;
  }
  .cert-col {
    transform: none !important;
  }
}
`;
  css = css.substring(0, startIdx) + newCss + css.substring(endIdx);
  fs.writeFileSync('assets/css/main.css', css);
  console.log('Done replacing css');
}
