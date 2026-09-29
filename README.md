# Noor Mohamed A — Portfolio

A premium, scroll-animated, single-page portfolio built with vanilla HTML, CSS, JavaScript, GSAP, and Lenis.

## Features
- Smooth scrolling (Lenis)
- Advanced scroll animations (GSAP + ScrollTrigger)
- Hybrid Light/Dark theme switching
- Custom cursor & scroll progress
- Fully responsive

## How to Run Locally
There is no build step. To run the site locally:
1. Open the project folder.
2. Double-click `index.html` to open it in any modern browser.
3. (Optional) Run a local server using VS Code's Live Server or Python (`python -m http.server`).

## Replace These Placeholders
Before making this public, please update the following placeholders in the `assets/` folder:

- [ ] **`assets/images/noor-cutout.png`**: Replace with a transparent PNG cutout of yourself. Recommended width ~1200px. Used in the Hero section.
- [ ] **`assets/images/noor-photo.jpg`**: Replace with a standard photo for the About section.
- [ ] **`assets/images/project-1.jpg`**: Replace with a screenshot for Project 1.
- [ ] **`assets/images/project-2.jpg`**: Replace with a screenshot for Project 2.
- [ ] **`assets/images/og-cover.jpg`**: Replace with an Open Graph social share image.
- [ ] **`assets/files/Noor_Mohamed_Resume.pdf`**: Add your real resume PDF file here.
- [ ] **Live preview links**: Search for `href="#" class="is-placeholder"` in `index.html` and replace `#` with your actual project URLs.
- [ ] **Deployment URL**: In `index.html`, replace `https://your-deployment-url.com` in the JSON-LD `<script>` tag.

*Note: If `noor-cutout.png` or `project` images are missing, the UI will fallback to CSS/SVG styled placeholders or empty spaces temporarily.*

## Customization
### Changing the Accent Color
The primary brand color is electric cobalt. You can change this easily by modifying the CSS variables in `assets/css/main.css`:
```css
:root {
  --accent: #2F5BFF;   /* Primary accent */
  --accent-2: #C6FF3D; /* Lime - used for cursor + scroll-top */
}
```

## How to Deploy
This is a static site, meaning it can be hosted anywhere for free.

**GitHub Pages:**
1. Push this code to a new GitHub repository (e.g., `noor-portfolio`).
2. Go to Repo Settings > Pages.
3. Select `main` branch and `/root` folder. Save.

**Vercel / Netlify:**
1. Sign in to Vercel/Netlify.
2. Click "Add New Project" or "Import from Git".
3. Select your repository.
4. Leave build settings empty (no framework preset, no build command).
5. Click Deploy.
