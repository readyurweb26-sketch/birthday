// ═══ Disable right-click & devtools keys ═══
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && e.keyCode == 73)) return false;
};

// ========== CUSTOMIZATION ==========
const CUSTOM_BG_IMAGE = "images/background.png";
const CUSTOM_PERSON_IMAGE = "images/1.jpg";
const BIRTHDAY_WISH = "🎂 Happy Birthday Bipasha 🎉💖";
const BACKGROUND_MUSIC_URL = "audio/soulprodmusic-happy-birthday-220024.mp3";
const FIREWORK_SOUND_URL = "audio/firework-cracker.mp3";

// Apply background image
document.body.style.backgroundImage = `url(${CUSTOM_BG_IMAGE})`;

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