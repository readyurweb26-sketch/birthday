// ═══ Disable right-click & devtools keys ═══
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && e.keyCode == 73)) return false;
};

// ========== CUSTOMIZATION ==========
const CUSTOM_BG_IMAGE = "images/background.png";
const CUSTOM_PERSON_IMAGE = "https://picsum.photos/id/169/560/700";
const BIRTHDAY_WISH = "🎂 Happy Birthday Bipasha 🎉💖";
const BACKGROUND_MUSIC_URL = "audio/soulprodmusic-happy-birthday-220024.mp3";
const FIREWORK_SOUND_URL = "audio/firework-cracker.mp3";

// Apply background image to the hero only — each year below gets its own background
const heroPanelEl = document.getElementById('hero');
if (heroPanelEl) heroPanelEl.style.backgroundImage = `url(${CUSTOM_BG_IMAGE})`;

// Person image
const personImg = document.getElementById('personImg');
personImg.src = CUSTOM_PERSON_IMAGE;
personImg.onerror = () => personImg.src = "https://via.placeholder.com/560x700?text=Birthday+Star";

// ========== CANVAS & FIREWORK FUNCTIONS (defined early) ==========
const canvas = document.getElementById('effectsCanvas');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let stars = [];
let particles = [];
let hearts = [];

function createStar() {
    return {
        x: Math.random() * w,
        y: Math.random() * h * 0.3,
        len: 50 + Math.random() * 100,
        vx: -2 - Math.random() * 6,
        vy: 2 + Math.random() * 5,
        opacity: 0.5 + Math.random() * 0.5
    };
}

for (let i = 0; i < 4; i++) stars.push(createStar());

for (let i = 0; i < 15; i++) {
    hearts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 10 + Math.random() * 16,
        speedY: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.5,
        text: ['❤️','✨','🌟','💫','🎀'][Math.floor(Math.random()*5)]
    });
}

function createFirework(x, y) {
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 3 + Math.random() * 6,
            color: `hsl(${Math.random()*360},90%,70%)`,
            life: 1,
            decay: 0.015 + Math.random() * 0.02
        });
    }
}

function createFireworkAtRandom() {
    const x = Math.random() * w;
    const y = Math.random() * h * 0.6 + 50;
    createFirework(x, y);
}

function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.len, s.y + s.len * 0.3);
        ctx.strokeStyle = `rgba(255,255,200,${s.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        s.x += s.vx;
        s.y += s.vy;
        if (s.x + s.len < 0 || s.y > h) Object.assign(s, createStar());
    });
    hearts.forEach(h => {
        ctx.font = `${h.size}px Arial`;
        ctx.fillStyle = `rgba(255,255,255,${h.opacity})`;
        ctx.fillText(h.text, h.x, h.y);
        h.y -= h.speedY;
        if (h.y < -30) { h.y = h + 30; h.x = Math.random() * w; }
    });
    for (let i = particles.length-1; i >= 0; i--) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) particles.splice(i,1);
    }
    requestAnimationFrame(animate);
}
animate();

// ========== DECISION: SHOULD WE RUN THE COUNTDOWN? ==========
const referrer = document.referrer;
const cameFromInternalPage =
    referrer.includes('year2021.html') ||
    referrer.includes('year2022.html') ||
    referrer.includes('year2023.html') ||
    referrer.includes('year2024.html') ||
    referrer.includes('year2025.html') ||
    referrer.includes('year2026.html') ||
    referrer.includes('year2027.html') ||
    referrer.includes('guide.html');

// Detect how the page was loaded
const navEntry = performance.getEntriesByType('navigation')[0];
const navType = navEntry ? navEntry.type : 'navigate'; // 'navigate', 'reload', 'back_forward'

// Show countdown ONLY if it's a fresh visit (no internal referrer) and (first load OR manual refresh)
const showCountdown = !cameFromInternalPage && (navType === 'navigate' || navType === 'reload');

if (!showCountdown) {
    // Skip countdown: hide overlay, show card instantly
    document.getElementById('countdownOverlay').classList.add('hidden');
    const birthdayCard = document.getElementById('birthdayCard');
    birthdayCard.classList.add('visible');
    // Guide button: always blink
    setTimeout(triggerGuideAnimation, 500);
} else {
    // ========== COUNTDOWN & HERO ENTRANCE (first time or manual refresh) ==========
    const countdownOverlay = document.getElementById('countdownOverlay');
    const countdownNumber = document.getElementById('countdownNumber');
    const birthdayCard = document.getElementById('birthdayCard');
    const fireworkAudio = document.getElementById('fireworkSound');

    if (fireworkAudio) {
        fireworkAudio.volume = 0.5;
        fireworkAudio.load();
    }

    let count = 3;

    function playFireworkSound() {
        if (fireworkAudio) {
            fireworkAudio.currentTime = 0;
            fireworkAudio.play().catch(() => {});
        }
    }

    function countdownStep() {
        if (count > 0) {
            countdownNumber.textContent = count;
            countdownNumber.style.animation = 'none';
            void countdownNumber.offsetWidth;
            countdownNumber.style.animation = 'countZoom 0.9s ease-out';

            createFireworkAtRandom();
            playFireworkSound();

            count--;
            setTimeout(countdownStep, 900);
        } else {
            // Final burst
            createFireworkAtRandom();
            playFireworkSound();

            setTimeout(() => {
                countdownOverlay.classList.add('hidden');
                setTimeout(() => {
                    birthdayCard.classList.add('visible');
                    // Trigger guide animation after card appears
                    setTimeout(triggerGuideAnimation, 1000);
                }, 300);
            }, 400);
        }
    }

    countdownStep();
}

// ========== CARD TRANSPARENCY ==========
const cardContainer = document.querySelector('.birthday-container');
const transparencySlider = document.getElementById('brightnessSlider');
cardContainer.style.backgroundColor = 'rgba(20, 10, 20, 0.45)';
transparencySlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    const alpha = Math.min(1, Math.max(0.1, val));
    cardContainer.style.backgroundColor = `rgba(20, 10, 20, ${alpha})`;
});

// ========== TYPEWRITER & ROTATING MESSAGES ==========
const wishElement = document.getElementById('wishTextDisplay');
function typeWriter() {
    wishElement.innerHTML = '';
    let idx = 0;
    const interval = setInterval(() => {
        if (idx < BIRTHDAY_WISH.length) {
            wishElement.innerHTML += BIRTHDAY_WISH[idx];
            idx++;
        } else {
            clearInterval(interval);
            setTimeout(typeWriter, 2500);
        }
    }, 70);
}
setTimeout(typeWriter, 3000);

const messages = ["Today is your day 🎂", "You are loved 💖", "Make a wish 🌠", "Let's celebrate 🎉"];
let msgIdx = 0;
const rotatingMsg = document.getElementById('rotatingMessage');
setInterval(() => {
    rotatingMsg.style.opacity = '0';
    setTimeout(() => {
        msgIdx = (msgIdx + 1) % messages.length;
        rotatingMsg.innerText = messages[msgIdx];
        rotatingMsg.style.opacity = '1';
    }, 500);
}, 3500);

// ========== YEARS DATA & TIMELINE ==========
const YEARS_DATA = [
    { year: 2021, message: "🎈 2021: The journey began with beautiful smiles!" },
    { year: 2022, message: "🌟 2022: Danced under fairy lights, ate delicious cake." },
    { year: 2023, message: "🍰 2023: Candles glowed, dreams took flight." },
    { year: 2024, message: "🎉 2024: Adventures, hugs, sweetest vibes." },
    { year: 2025, message: "💖 2025: Present magic! Health, success, cake." },
    { year: 2026, message: "🌈 2026: Another wonderful trip around the sun!" },
    { year: 2027, message: "✨ 2027: More joy, more cake, beautiful memories!" }
];

let currentYear = null;
let autoCycleInterval;
const timelineContainer = document.getElementById('yearTimeline');
const yearMessageText = document.getElementById('yearMessageText');

function buildTimeline() {
    timelineContainer.innerHTML = '';
    YEARS_DATA.forEach(data => {
        const circle = document.createElement('div');
        circle.className = 'year-circle';
        if (data.year === currentYear) circle.classList.add('active');
        circle.innerText = data.year;
        circle.setAttribute('data-year', data.year);
        const preview = document.createElement('div');
        preview.className = 'year-preview';
        preview.innerText = data.message.substring(0, 25) + '...';
        circle.appendChild(preview);
        circle.addEventListener('click', (e) => {
            const year = parseInt(e.currentTarget.getAttribute('data-year'));
            navigateToYear(year);
        });
        timelineContainer.appendChild(circle);
    });
}

function navigateToYear(year) {
    currentYear = year;
    const data = YEARS_DATA.find(y => y.year === year);
    yearMessageText.innerText = data.message;
    buildTimeline();
    const overlay = document.getElementById('pageTransition');
    overlay.style.opacity = '1';
    setTimeout(() => {
        window.location.href = `year${year}.html`;
    }, 500);
}

function autoCycleYears() {
    if (currentYear === null) {
        currentYear = 2026;
        yearMessageText.innerText = YEARS_DATA.find(y => y.year === 2026).message;
        buildTimeline();
    }
    autoCycleInterval = setInterval(() => {
        const currentIdx = YEARS_DATA.findIndex(y => y.year === currentYear);
        const nextIdx = (currentIdx + 1) % YEARS_DATA.length;
        currentYear = YEARS_DATA[nextIdx].year;
        yearMessageText.innerText = YEARS_DATA[nextIdx].message;
        buildTimeline();
    }, 4000);
}

setTimeout(() => {
    autoCycleYears();
}, 3500);

timelineContainer.addEventListener('mouseenter', () => clearInterval(autoCycleInterval));
timelineContainer.addEventListener('mouseleave', () => {
    autoCycleInterval = setInterval(() => {
        const currentIdx = YEARS_DATA.findIndex(y => y.year === currentYear);
        const nextIdx = (currentIdx + 1) % YEARS_DATA.length;
        currentYear = YEARS_DATA[nextIdx].year;
        yearMessageText.innerText = YEARS_DATA[nextIdx].message;
        buildTimeline();
    }, 4000);
});

// ========== MUSIC BUTTON ==========
const audio = document.getElementById('bgAudio');
audio.src = BACKGROUND_MUSIC_URL;
audio.volume = 0.2;
let musicPlaying = false;
const musicBtn = document.getElementById('musicToggleBtn');
const musicLabel = document.getElementById('musicLabel');
const visualizerBars = document.getElementById('visualizerBars');

musicBtn.addEventListener('click', () => {
    if (musicPlaying) {
        audio.pause();
        musicLabel.innerText = 'Music Off';
        visualizerBars.style.display = 'none';
    } else {
        audio.play().catch(e => console.log(e));
        musicLabel.innerText = 'Music On';
        visualizerBars.style.display = 'flex';
    }
    musicPlaying = !musicPlaying;
});

// ========== GUIDE BUTTON ANIMATION ==========
const guideBtn = document.getElementById('guideBtn');
guideBtn.addEventListener('click', () => {
    window.location.href = 'guide.html';
});

function triggerGuideAnimation() {
    const alreadyPlayed = sessionStorage.getItem('guideAnimationPlayed');
    // referrer is already defined above
    const cameFromInternal =
        referrer.includes('year2021.html') ||
        referrer.includes('year2022.html') ||
        referrer.includes('year2023.html') ||
        referrer.includes('year2024.html') ||
        referrer.includes('year2025.html') ||
        referrer.includes('year2026.html') ||
        referrer.includes('year2027.html') ||
        referrer.includes('guide.html');

    if (cameFromInternal || alreadyPlayed) {
        // Just ensure the blinking class is present
        guideBtn.classList.add('blink-blue');
        return;
    }

    // First time on this domain (no internal referrer) → full clone animation
    const clone = document.createElement('button');
    clone.className = 'guide-button-clone';
    clone.textContent = guideBtn.textContent.trim();
    document.body.appendChild(clone);

    const overlay = document.createElement('div');
    overlay.className = 'guide-overlay';
    document.body.appendChild(overlay);

    guideBtn.style.visibility = 'hidden';

    setTimeout(() => {
        clone.remove();
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 400);
        guideBtn.style.visibility = 'visible';
        guideBtn.classList.add('blink-blue');
        sessionStorage.setItem('guideAnimationPlayed', 'true');
    }, 1500);
}

// ========== LOVE LETTER MODAL ==========
const loveModal = document.getElementById('loveModal');
document.getElementById('loveLetterBtn').addEventListener('click', () => {
    loveModal.style.display = 'flex';
    createPetals();
});
document.getElementById('closeLoveModal').addEventListener('click', () => {
    loveModal.style.display = 'none';
});
loveModal.addEventListener('click', (e) => {
    if (e.target === loveModal) loveModal.style.display = 'none';
});

function createPetals() {
    const content = document.querySelector('.love-modal-content');
    document.querySelectorAll('.petal').forEach(p => p.remove());
    for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.top = '-10px';
        petal.style.animationDelay = Math.random() * 0.5 + 's';
        content.appendChild(petal);
    }
}

// ========== CANDLE BLOW ==========
const cakeOverlay = document.getElementById('cakeOverlay');
const candleFlame = document.getElementById('candleFlame');
cakeOverlay.addEventListener('click', () => {
    if (candleFlame.style.display === 'none') return;
    candleFlame.style.display = 'none';
    for (let i = 0; i < 30; i++) {
        createConfettiParticle(cakeOverlay);
    }
    setTimeout(() => {
        candleFlame.style.display = 'block';
    }, 4000);
});

function createConfettiParticle(originEl) {
    const rect = originEl.getBoundingClientRect();
    const x = rect.left + rect.width/2;
    const y = rect.top;
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px; width: 8px; height: 8px;
        background: hsl(${Math.random()*360},80%,60%); pointer-events: none;
        border-radius: 2px; z-index: 500;
        transition: all 1.5s ease-out;
    `;
    document.body.appendChild(particle);
    requestAnimationFrame(() => {
        particle.style.transform = `translate(${(Math.random()-0.5)*200}px, ${-200-Math.random()*200}px) rotate(${Math.random()*720}deg)`;
        particle.style.opacity = '0';
    });
    setTimeout(() => particle.remove(), 1600);
}

// Mouse sparkle trail
document.addEventListener('mousemove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-trail';
    sparkle.innerText = '✨';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
});

// Initialize Lucide icons
lucide.createIcons();


/* ══════════════════════════════════════════════════════════════════
   PREMIUM LANDING-PAGE MODULE (additive only — nothing above this
   line was altered; every original function keeps its exact behavior)

   Adds: fixed glass navbar with scrollspy, per-year full-page panels
   (own photo, own copy, own "Click Me" → navigateToYear()), a mobile
   hamburger menu that hides itself once a year is chosen, a scroll
   progress rail, and scroll-reveal entrance animation per section.
   ══════════════════════════════════════════════════════════════════ */
(function premiumLanding() {

    // Distinct accent-color duo + a placeholder photo id per year, purely
    // presentational — swap images/<year>.jpg in later with zero code changes.
    // ─── EDIT HERE: set each year's own background + card image ───
    // bg   = full-page background for that year's section
    // card = the small framed photo shown next to the text
    // Point these at whatever files you actually have — any folder/name works.
    const YEAR_IMAGES = {
        2021: { bg: 'images/2021.jpg', card: 'images/1.jpg' },
        2022: { bg: 'images/2022.jpg', card: 'images/2022.jpg' },
        2023: { bg: 'images/2023.jpg', card: 'images/4.jpg' },
        2024: { bg: 'images/2024.jpg', card: 'images/2024.jpg' },
        2025: { bg: 'images/2025.jpg', card: 'images/6.jpg' },
        2026: { bg: 'images/2026.jpg', card: 'images/2026.jpg' },
        2027: { bg: 'images/2027.jpg', card: 'images/10.jpg' }
    };

    const YEAR_THEME = {
        2021: { a: '#ff6b6b', b: '#ffd93d', pic: 1027 },
        2022: { a: '#a0e7e5', b: '#3a86ff', pic: 1041 },
        2023: { a: '#8338ec', b: '#ff6b6b', pic: 1062 },
        2024: { a: '#ffb347', b: '#ff4d6d', pic: 1074 },
        2025: { a: '#ff4d6d', b: '#ffd700', pic: 1084 },
        2026: { a: '#3a86ff', b: '#a0e7e5', pic: 1080 },
        2027: { a: '#ffd700', b: '#8338ec', pic: 1069 }
    };

    const yearsScroll = document.getElementById('yearsScroll');
    const navLinks = document.getElementById('navLinks');
    const mobileMenuLinks = document.getElementById('mobileMenuLinks');
    const glassNav = document.getElementById('glassNav');
    const scrollProgressFill = document.getElementById('scrollProgressFill');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // ---------- Build the desktop nav pills + mobile menu links ----------
    YEARS_DATA.forEach(data => {
        const pill = document.createElement('button');
        pill.className = 'nav-pill';
        pill.type = 'button';
        pill.dataset.year = data.year;
        pill.textContent = data.year;
        pill.addEventListener('click', () => scrollToYear(data.year));
        navLinks.appendChild(pill);

        const mLink = document.createElement('button');
        mLink.className = 'mobile-menu-link';
        mLink.type = 'button';
        mLink.dataset.year = data.year;
        mLink.textContent = `${data.year} — ${data.message.replace(/^[^\s]+\s/, '')}`;
        mLink.addEventListener('click', () => {
            scrollToYear(data.year);
            closeMobileMenu();
            hideHamburger();
        });
        mobileMenuLinks.appendChild(mLink);
    });

    // ---------- Build the full-page year panels ----------
    YEARS_DATA.forEach((data, idx) => {
        const theme = YEAR_THEME[data.year] || { a: '#ff6b6b', b: '#ffd93d', pic: 1000 + idx };

        const panel = document.createElement('section');
        panel.className = 'year-panel' + (idx % 2 === 1 ? ' reverse' : '');
        panel.id = `year-${data.year}`;
        panel.dataset.year = data.year;
        panel.dataset.bigYear = data.year;
        panel.style.setProperty('--yr-a', theme.a);
        panel.style.setProperty('--yr-b', theme.b);

        const imgs = YEAR_IMAGES[data.year] || { bg: `images/${data.year}.jpg`, card: `images/${data.year}.jpg` };

        panel.innerHTML = `
            <div class="year-panel-inner">
                <div class="year-panel-media">
                    <div class="year-photo-frame">
                        <img class="year-photo" loading="lazy"
                             src="${imgs.card}"
                             alt="Birthday memory from ${data.year}">
                        <div class="year-photo-badge">${data.year}</div>
                    </div>
                </div>
                <div class="year-panel-copy">
                    <div class="year-eyebrow">Chapter ${idx + 1} of ${YEARS_DATA.length}</div>
                    <h2 class="year-title">${data.year}</h2>
                    <p class="year-desc">${data.message}</p>
                    <button class="year-click-btn" type="button" data-year="${data.year}">
                        Click Me <i data-lucide="arrow-right"></i>
                    </button>
                </div>
            </div>
        `;

        // Give this year its own full-bleed background right away
        panel.style.backgroundImage = `url(${imgs.bg})`;

        // Fallback placeholder if a path above is wrong/missing — keeps the
        // small framed photo AND the full-bleed background in sync
        const img = panel.querySelector('.year-photo');
        img.onload = () => { panel.style.backgroundImage = `url(${imgs.bg})`; };
        img.onerror = () => {
            img.onerror = null;
            const fallback = `https://picsum.photos/id/${theme.pic}/900/1200`;
            img.src = fallback;
            panel.style.backgroundImage = `url(${fallback})`;
        };

        // Click Me reuses the ORIGINAL navigateToYear() untouched
        panel.querySelector('.year-click-btn').addEventListener('click', () => navigateToYear(data.year));

        yearsScroll.appendChild(panel);
    });

    // Re-render Lucide icons for the newly injected markup
    if (window.lucide) lucide.createIcons();

    // ---------- Smooth-scroll to a year's section ----------
    function scrollToYear(year) {
        const target = document.getElementById(`year-${year}`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ---------- Fixed navbar: glass intensifies on scroll + progress rail ----------
    function onScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        glassNav.classList.toggle('scrolled', scrollTop > 30);

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgressFill.style.width = `${pct}%`;

        // Hamburger re-appears once user scrolls back near the top / hero
        if (scrollTop < 120) showHamburger();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- Scrollspy: highlight nav pill + mobile link for the active year ----------
    const allPanels = Array.from(document.querySelectorAll('.year-panel'));
    const navPills = Array.from(navLinks.querySelectorAll('.nav-pill'));
    const mobileLinks = Array.from(mobileMenuLinks.querySelectorAll('.mobile-menu-link'));

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const year = entry.target.dataset.year;
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                navPills.forEach(p => p.classList.toggle('active', p.dataset.year === year));
                mobileLinks.forEach(l => l.classList.toggle('active', l.dataset.year === year));
            }
        });
    }, { threshold: 0.35 });

    allPanels.forEach(panel => spy.observe(panel));

    // ---------- Hamburger menu (mobile) ----------
    function toggleMobileMenu() {
        const willOpen = !mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open', willOpen);
        hamburgerBtn.classList.toggle('open', willOpen);
        hamburgerBtn.setAttribute('aria-expanded', String(willOpen));
    }
    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    function hideHamburger() { hamburgerBtn.classList.add('hidden-nav'); }
    function showHamburger() { hamburgerBtn.classList.remove('hidden-nav'); }

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Brand / logo always scrolls back to hero and restores the hamburger
    document.getElementById('navBrand').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
        showHamburger();
    });

    // Scroll cue in the hero jumps to the first year
    const scrollCue = document.getElementById('scrollCue');
    if (scrollCue && YEARS_DATA.length) {
        scrollCue.style.cursor = 'pointer';
        scrollCue.addEventListener('click', () => scrollToYear(YEARS_DATA[0].year));
    }

})();


/* ══════════════════════════════════════════════════════════════════
   FIRST-PARTY ANALYTICS + FOOTER CREDIT MODULE (additive only —
   nothing above this line was altered; every original function
   keeps its exact behavior)

   Backend: Google Apps Script Web App writing to Google Sheets
   (see code.gs). Set your deployment URL in ENDPOINT below.

   Tracks: permanent first-party visitor ID (cookie + localStorage),
   session ID/duration, new vs returning, pageviews, referrer + UTM
   params, approximate country/region/city + timezone (via a public
   keyless IP-lookup call — no permission prompt), browser/OS/device
   type, screen/viewport size, language, clicks, scroll depth, and
   page performance timings (load time, DCL, FCP, LCP, CLS, TTI).
   Also injects the small fixed "Made with ❤️ by Laddoo Padduu"
   footer. Fully wrapped/defensive — never throws, never blocks
   rendering, and boots on idle so it can't compete with the
   entrance animations above.
   ══════════════════════════════════════════════════════════════════ */
/*!
 * Laddoo Analytics — first-party, privacy-respecting site analytics.
 * Backend: Google Apps Script Web App (see code.gs).
 * Loaded independently of script.js / style.css. Does not read, modify,
 * or depend on any element used by the existing birthday-page code.
 * Everything below is wrapped, defensive, and fails silently so a
 * network hiccup or blocked request can never break the page.
 */
(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────────
  // Set window.__LADDOO_ANALYTICS_ENDPOINT__ to your Apps Script deployment
  // URL (ends in /exec) before this script loads — see index.html.
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbweXpJmPkxEsIJyIBfOYSWE06B5GoXxRj98mImkOOS6PmoddUS-iS9voFR3XrI9sK0g/exec'; // ← paste your Apps Script Web App URL here
  var COOKIE_VISITOR = '_lp_vid';
  var SESSION_STORAGE_KEY = '_lp_session';
  var GEO_STORAGE_KEY = '_lp_geo';
  var SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 min of inactivity = new session
  var FLUSH_INTERVAL_MS = 10000;
  var SCROLL_THRESHOLDS = [25, 50, 75, 100];
  // Public, keyless, HTTPS IP-geolocation lookup — no browser permission
  // prompt involved (this is a plain network request, not the Geolocation API).
  var GEO_LOOKUP_URL = 'https://ipapi.co/json/';

  if (!ENDPOINT || ENDPOINT.indexOf('YOUR_DEPLOYMENT_ID') !== -1) return; // not configured yet

  // ── Small first-party storage helpers (cookie + localStorage fallback) ──
  function setCookie(name, value, days) {
    try {
      var expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = name + '=' + encodeURIComponent(value) +
        '; expires=' + expires + '; path=/; SameSite=Lax' +
        (location.protocol === 'https:' ? '; Secure' : '');
    } catch (e) {}
  }

  function getCookie(name) {
    try {
      var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    } catch (e) {
      return null;
    }
  }

  function lsGet(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function lsSet(key, value) { try { window.localStorage.setItem(key, value); } catch (e) {} }

  function uuidv4() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // ── Resolve (or create) the permanent, first-party visitor ID ──
  function getOrCreateVisitorId() {
    var id = getCookie(COOKIE_VISITOR) || lsGet(COOKIE_VISITOR);
    if (!id) id = uuidv4();
    setCookie(COOKIE_VISITOR, id, 730); // 2 years, refreshed every visit
    lsSet(COOKIE_VISITOR, id);
    return id;
  }

  // ── Session handling (sliding 30-minute idle window) ──
  function getOrCreateSession() {
    var raw = null;
    try { raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY); } catch (e) {}
    var now = Date.now();
    var session = raw ? JSON.parse(raw) : null;
    var isNew = false;

    if (!session || now - session.lastActivity > SESSION_IDLE_TIMEOUT_MS) {
      session = { id: uuidv4(), startedAt: now, lastActivity: now };
      isNew = true;
    } else {
      session.lastActivity = now;
    }

    try { window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session)); } catch (e) {}
    return { session: session, isNew: isNew };
  }

  // ── Lightweight UA parsing (no external library available in Apps Script) ──
  function parseUserAgent(ua) {
    ua = ua || navigator.userAgent || '';
    var browserName = 'Unknown', browserVersion = 'Unknown';
    var patterns = [
      ['Edg', 'Edge'], ['OPR', 'Opera'], ['Chrome', 'Chrome'],
      ['CriOS', 'Chrome'], ['Firefox', 'Firefox'], ['FxiOS', 'Firefox'],
      ['Safari', 'Safari']
    ];
    for (var i = 0; i < patterns.length; i++) {
      var token = patterns[i][0];
      if (ua.indexOf(token) !== -1) {
        var m = ua.match(new RegExp(token + '\\/([0-9.]+)'));
        browserName = patterns[i][1];
        browserVersion = m ? m[1] : 'Unknown';
        break;
      }
    }

    var osName = 'Unknown', osVersion = 'Unknown';
    if (/Windows NT ([0-9.]+)/.test(ua)) { osName = 'Windows'; osVersion = RegExp.$1; }
    else if (/Mac OS X ([0-9_]+)/.test(ua)) { osName = 'macOS'; osVersion = RegExp.$1.replace(/_/g, '.'); }
    else if (/Android ([0-9.]+)/.test(ua)) { osName = 'Android'; osVersion = RegExp.$1; }
    else if (/OS ([0-9_]+) like Mac OS X/.test(ua)) { osName = 'iOS'; osVersion = RegExp.$1.replace(/_/g, '.'); }
    else if (/Linux/.test(ua)) { osName = 'Linux'; }

    var deviceType = 'desktop';
    if (/iPad|Tablet/i.test(ua)) deviceType = 'tablet';
    else if (/Mobi|Android.*Mobile|iPhone/i.test(ua)) deviceType = 'mobile';

    return { browserName: browserName, browserVersion: browserVersion, osName: osName, osVersion: osVersion, deviceType: deviceType };
  }

  // ── Client-side IP geolocation (no permission prompt — just a network call) ──
  function getGeo(callback) {
    try {
      var cached = window.sessionStorage.getItem(GEO_STORAGE_KEY);
      if (cached) return callback(JSON.parse(cached));
    } catch (e) {}

    fetch(GEO_LOOKUP_URL, { credentials: 'omit' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        var geo = {
          country: (data && data.country_name) || 'Unknown',
          region: (data && data.region) || 'Unknown',
          city: (data && data.city) || 'Unknown',
          timezone: (data && data.timezone) || ((Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Unknown')
        };
        try { window.sessionStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(geo)); } catch (e) {}
        callback(geo);
      })
      .catch(function () {
        callback({ country: 'Unknown', region: 'Unknown', city: 'Unknown', timezone: (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Unknown' });
      });
  }

  // ── UTM params (first-touch) ──
  function getUtmParams() {
    try {
      var params = new URLSearchParams(window.location.search);
      return {
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
        utmContent: params.get('utm_content') || '',
        utmTerm: params.get('utm_term') || ''
      };
    } catch (e) {
      return { utmSource: '', utmMedium: '', utmCampaign: '', utmContent: '', utmTerm: '' };
    }
  }

  function getClientContext(geo) {
    var utm = getUtmParams();
    var ua = parseUserAgent(navigator.userAgent);
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return {
      country: geo.country, region: geo.region, city: geo.city, timezone: geo.timezone,
      browserName: ua.browserName, browserVersion: ua.browserVersion,
      osName: ua.osName, osVersion: ua.osVersion, deviceType: ua.deviceType,
      language: navigator.language || '',
      screenResolution: screen.width + 'x' + screen.height,
      screenWidth: screen.width, screenHeight: screen.height,
      viewportWidth: window.innerWidth, viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      referrer: document.referrer || '',
      connectionType: conn && conn.effectiveType ? conn.effectiveType : '',
      onlineStatus: navigator.onLine !== false,
      utmSource: utm.utmSource, utmMedium: utm.utmMedium, utmCampaign: utm.utmCampaign,
      utmContent: utm.utmContent, utmTerm: utm.utmTerm
    };
  }

  // ── Networking: batched, non-blocking, resilient. Apps Script web apps
  // don't handle CORS preflight well, so requests use text/plain — a
  // "simple request" the browser sends without a preflight OPTIONS call. ──
  var eventBuffer = [];
  var state = {};

  function send(payload, useBeacon) {
    if (!ENDPOINT) return;
    try {
      var body = JSON.stringify(payload);
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain;charset=utf-8' }));
        return;
      }
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: body,
        keepalive: true,
        credentials: 'omit'
      }).catch(function () {});
    } catch (e) {}
  }

  function flush(useBeacon) {
    if (!eventBuffer.length) return;
    var batch = eventBuffer.splice(0, eventBuffer.length);
    getGeo(function (geo) {
      send({
        visitorId: state.visitorId,
        sessionId: state.sessionId,
        eventType: 'custom',
        pageUrl: location.href,
        isNewSession: false,
        client: getClientContext(geo),
        events: batch
      }, useBeacon);
    });
  }

  function trackPageview() {
    getGeo(function (geo) {
      send({
        visitorId: state.visitorId,
        sessionId: state.sessionId,
        eventType: 'pageview',
        pageUrl: location.href,
        isNewSession: state.isNewSession,
        client: getClientContext(geo),
        events: [{ type: 'pageview' }]
      }, false);
    });
  }

  function queueEvent(evt) {
    eventBuffer.push(evt);
    if (eventBuffer.length >= 20) flush(false);
  }

  // ── Scroll depth ──
  var scrollFired = {};
  function onScroll() {
    try {
      var doc = document.documentElement;
      var scrollTop = window.pageYOffset || doc.scrollTop;
      var height = (doc.scrollHeight - doc.clientHeight) || 1;
      var pct = Math.min(100, Math.round((scrollTop / height) * 100));
      SCROLL_THRESHOLDS.forEach(function (t) {
        if (pct >= t && !scrollFired[t]) {
          scrollFired[t] = true;
          queueEvent({ type: 'scroll_depth', scrollDepth: t });
        }
      });
    } catch (e) {}
  }

  // ── Click tracking (delegated) ──
  function onClick(e) {
    try {
      var el = e.target.closest && e.target.closest('a, button, [role="button"]');
      if (!el) return;
      var label = (el.getAttribute('aria-label') || el.textContent || el.id || el.tagName)
        .toString().trim().slice(0, 100);
      queueEvent({ type: 'click', clickTarget: label });
    } catch (err) {}
  }

  // ── Performance metrics (native browser Performance APIs only) ──
  function collectPerformance() {
    try {
      var nav = performance.getEntriesByType('navigation')[0];
      var perf = {
        type: 'performance',
        loadTimeMs: nav ? Math.round(nav.loadEventEnd) : undefined,
        domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd) : undefined
      };

      var paintEntries = performance.getEntriesByType('paint');
      var fcp = paintEntries.find(function (p) { return p.name === 'first-contentful-paint'; });
      if (fcp) perf.fcpMs = Math.round(fcp.startTime);

      if (window.PerformanceObserver) {
        try {
          var lcpObserver = new PerformanceObserver(function (list) {
            var entries = list.getEntries();
            var last = entries[entries.length - 1];
            if (last) queueEvent({ type: 'performance', lcpMs: Math.round(last.startTime) });
          });
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

          var clsValue = 0;
          var clsObserver = new PerformanceObserver(function (list) {
            list.getEntries().forEach(function (entry) {
              if (!entry.hadRecentInput) clsValue += entry.value;
            });
          });
          clsObserver.observe({ type: 'layout-shift', buffered: true });

          window.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') {
              queueEvent({ type: 'performance', cls: Math.round(clsValue * 1000) / 1000 });
            }
          }, { once: true });
        } catch (obsErr) {}
      }

      if (nav) perf.ttiMs = Math.round(nav.loadEventEnd); // practical TTI stand-in
      queueEvent(perf);
    } catch (e) {}
  }

  function trackSessionEnd() {
    var duration = Date.now() - state.sessionStartedAt;
    queueEvent({ type: 'session_end', sessionDurationMs: duration });
    flush(true);
  }

  // ── Footer (additive DOM injection only — touches nothing else) ──
  function injectFooter() {
    try {
      if (document.getElementById('laddoo-credit-footer')) return;
      var style = document.createElement('style');
      style.textContent =
        '#laddoo-credit-footer{position:fixed;right:12px;bottom:10px;z-index:9999;' +
        'font-family:"Nunito",system-ui,sans-serif;font-size:11px;font-weight:600;' +
        'color:rgba(255,255,255,0.75);background:rgba(20,10,20,0.35);' +
        'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);' +
        'padding:5px 10px;border-radius:20px;border:1px solid rgba(255,255,255,0.15);' +
        'pointer-events:none;user-select:none;letter-spacing:.2px;' +
        'box-shadow:0 4px 14px rgba(0,0,0,0.25);}' +
        '@media (max-width:480px){#laddoo-credit-footer{font-size:10px;padding:4px 8px;right:8px;bottom:8px;}}';
      document.head.appendChild(style);

      var footer = document.createElement('div');
      footer.id = 'laddoo-credit-footer';
      footer.textContent = 'Made with \u2764\uFE0F by Laddoo Padduu';
      document.body.appendChild(footer);
    } catch (e) {}
  }

  // ── Boot ──
  function init() {
    state.visitorId = getOrCreateVisitorId();
    var sessionInfo = getOrCreateSession();
    state.sessionId = sessionInfo.session.id;
    state.isNewSession = sessionInfo.isNew;
    state.sessionStartedAt = sessionInfo.session.startedAt;

    trackPageview();
    collectPerformance();

    window.addEventListener('scroll', throttle(onScroll, 300), { passive: true });
    document.addEventListener('click', onClick, { passive: true });

    setInterval(function () { flush(false); }, FLUSH_INTERVAL_MS);

    window.addEventListener('pagehide', trackSessionEnd);
    window.addEventListener('beforeunload', trackSessionEnd);

    injectFooter();
  }

  function throttle(fn, wait) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= wait) { last = now; fn.apply(this, arguments); }
    };
  }

  function schedule(fn) {
    if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: 2000 });
    else setTimeout(fn, 200);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    schedule(init);
  } else {
    document.addEventListener('DOMContentLoaded', function () { schedule(init); });
  }
})();