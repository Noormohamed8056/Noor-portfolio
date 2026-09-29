const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = '</body>\r\n</html>';
const targetStr2 = '</body>\n</html>';

const newStr = `
    <!-- Page Transition Overlay -->
    <div id="page-transition-overlay" style="position: fixed; inset: 0; background: black; z-index: 9999; opacity: 0; pointer-events: none; transition: opacity 0.4s ease;"></div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const btn = document.querySelector('.cert-btn');
            if (btn) {
                // Update href just in case
                btn.href = 'achievements.html';
                btn.removeAttribute('target');
                btn.removeAttribute('rel');
                
                const overlay = document.getElementById('page-transition-overlay');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if(overlay) {
                        overlay.style.pointerEvents = 'auto';
                        overlay.style.opacity = '1';
                        setTimeout(() => {
                            window.location.href = btn.href;
                        }, 400);
                    } else {
                        window.location.href = btn.href;
                    }
                });
            }
        });
    </script>
</body>
</html>`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, newStr);
} else {
    html = html.replace(targetStr2, newStr);
}

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully.');
