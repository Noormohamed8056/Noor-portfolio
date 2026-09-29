const fs = require('fs');
const logos = JSON.parse(fs.readFileSync('scratch_logos.json', 'utf8'));

// Format SVG strings to remove newlines and keep viewBox
const cleanSvg = (svgStr) => {
  if (!svgStr) return '';
  let cleaned = svgStr.replace(/<!--[\s\S]*?-->/g, '').replace(/<\?xml.*?\?>/g, '').replace(/[\r\n\t]+/g, ' ').replace(/>\s+</g, '><').trim();
  cleaned = cleaned.replace(/width=".*?"/, 'width="32"').replace(/height=".*?"/, 'height="32"');
  if(!cleaned.includes('width=')) {
    cleaned = cleaned.replace('<svg ', '<svg width="32" height="32" ');
  }
  return cleaned;
};

const jsSvg = cleanSvg(logos.js);
const javaSvg = cleanSvg(logos.java);
const pythonSvg = cleanSvg(logos.python);
const html5Svg = cleanSvg(logos.html5);
const css3Svg = cleanSvg(logos.css3);
const reactSvg = cleanSvg(logos.react);
const nodejsSvg = cleanSvg(logos.nodejs);
const mysqlSvg = cleanSvg(logos.mysql);
const gitSvg = cleanSvg(logos.git);
// GitHub should be light grey/white for black background
let githubSvg = cleanSvg(logos.github).replace(/fill=".*?"/g, ''); // strip fills
githubSvg = githubSvg.replace(/<path /g, '<path fill="#e0e0e0" ');

const postmanSvg = cleanSvg(logos.postman);

let iconsFile = fs.readFileSync('assets/js/icons.js', 'utf8');

// Replace standard ones
iconsFile = iconsFile.replace(/(name:\s*"Java",\s*svg:\s*`).*?(`)/, '$1' + javaSvg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"JavaScript",\s*svg:\s*`).*?(`)/, '$1' + jsSvg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"Python",\s*svg:\s*`).*?(`)/, '$1' + pythonSvg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"HTML5",\s*svg:\s*`).*?(`)/, '$1' + html5Svg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"CSS3",\s*svg:\s*`).*?(`)/, '$1' + css3Svg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"React\.js",\s*svg:\s*`).*?(`)/, '$1' + reactSvg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"Node\.js",\s*svg:\s*`).*?(`)/, '$1' + nodejsSvg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"MySQL",\s*svg:\s*`).*?(`)/, '$1' + mysqlSvg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"Git",\s*svg:\s*`).*?(`)/, '$1' + gitSvg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"GitHub",\s*svg:\s*`).*?(`)/, '$1' + githubSvg + '$2');
iconsFile = iconsFile.replace(/(name:\s*"Postman",\s*svg:\s*`).*?(`)/, '$1' + postmanSvg + '$2');

fs.writeFileSync('assets/js/icons.js', iconsFile);
console.log('Icons updated successfully.');
