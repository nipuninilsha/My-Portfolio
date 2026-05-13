/* =============================================
   SCROLL PROGRESS BAR
   Reads how far the user has scrolled and sets
   the width of the top progress bar accordingly.
   e.g. 50% scrolled → bar is 50% wide
   ============================================= */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;  // total scrollable distance
    const pct   = (window.scrollY / total) * 100;                   // percentage scrolled
    if (scrollProgress) scrollProgress.style.width = pct + '%';
});


/* =============================================
   MOBILE MENU TOGGLE
   The hamburger button shows/hides the navbar
   on small screens.
   ============================================= */
const hamburger = document.getElementById('menu-icon');
const navbar    = document.getElementById('navbar');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        // Toggle the "open" class on both the navbar and the hamburger
        const isOpen = navbar.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        // Update accessibility attribute
        hamburger.setAttribute('aria-expanded', isOpen);
    });
}

// Close the mobile menu when any nav link is clicked (after navigating)
document.querySelectorAll('.navbar .nav-link, .navbar .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('open');
        if (hamburger) {
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});


/* =============================================
   HEADER SCROLL + ACTIVE NAV LINK
   Runs on every scroll event:
   1. Adds "scrolled" class to header when user scrolls > 50px
      (makes header slightly shorter)
   2. Shows/hides the scroll-to-top button
   3. Detects which section is currently in view and
      highlights the matching nav link as "active"
   4. Triggers scroll reveal animations for elements
      that have entered the viewport
   ============================================= */
const header    = document.querySelector('.header');
const scrollBtn = document.querySelector('.scroll-top');
const sections  = document.querySelectorAll('section[id]');  // all sections that have an id

window.addEventListener('scroll', () => {
    // 1. Compact header after scrolling 50px
    header.classList.toggle('scrolled', window.scrollY > 50);

    // 2. Show scroll-to-top button after scrolling 450px
    if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 450);

    // 3. Active nav link detection
    const scrollY = window.scrollY;
    sections.forEach(sec => {
        const top    = sec.offsetTop - 120;   // 120px offset accounts for fixed header height
        const height = sec.offsetHeight;
        const id     = sec.getAttribute('id');
        const link   = document.querySelector(`.nav-link[href="#${id}"]`);

        // If the scroll position is inside this section's range, mark its link active
        if (link && scrollY >= top && scrollY < top + height) {
            document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        }
    });

    // 4. Reveal elements that have entered the viewport
    // Elements start invisible (see CSS .reveal, .reveal-left, .reveal-right)
    // Adding "visible" triggers their CSS transition to animate in
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 60)
            el.classList.add('visible');
    });
});


/* =============================================
   SCROLL TO TOP BUTTON
   Smoothly scrolls back to the very top of the page
   ============================================= */
if (scrollBtn) {
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* =============================================
   TYPING ANIMATION — HOME SECTION
   Cycles through the "roles" array, typing and
   deleting each string one character at a time.
   The text is inserted into the .multiple-text span.
   ============================================= */
const roles = ["Software Engineer","Web Developer","UI/UX Designer","Problem Solver","Full Stack Developer","Creative Thinker"];
const homeTypingEl = document.querySelector('.multiple-text');

if (homeTypingEl) {
    let rIdx     = 0;       // which role in the array we're currently on
    let cIdx     = 0;       // how many characters are currently visible
    let deleting = false;   // are we currently deleting or typing?

    (function typeHome() {
        const cur = roles[rIdx];

        // Add or remove one character from the text
        homeTypingEl.textContent = deleting ? cur.slice(0, cIdx - 1) : cur.slice(0, cIdx + 1);
        deleting ? cIdx-- : cIdx++;

        if (!deleting && cIdx === cur.length) {
            // Finished typing — pause for 1.6s then start deleting
            deleting = true;
            setTimeout(typeHome, 1600);
            return;
        }
        if (deleting && cIdx === 0) {
            // Finished deleting — move to next role
            deleting = false;
            rIdx = (rIdx + 1) % roles.length;
        }

        // Typing is slower (100ms/char), deleting is faster (60ms/char)
        setTimeout(typeHome, deleting ? 60 : 100);
    })();
}


/* =============================================
   TYPING ANIMATION — ABOUT SECTION
   Same typing logic as above but with a different
   set of roles and slightly different timing.
   Updates the .multiple-text-about span.
   ============================================= */
const aboutRoles    = ["Web Developer","UI/UX Designer","Front-End Developer","Creative Coder"];
const aboutTypingEl = document.querySelector('.multiple-text-about');

if (aboutTypingEl) {
    let aIdx      = 0;      // current role index
    let aChar     = 0;      // current character count
    let aDeleting = false;  // typing or deleting

    (function typeAbout() {
        const cur = aboutRoles[aIdx];

        aboutTypingEl.textContent = aDeleting ? cur.substring(0, aChar - 1) : cur.substring(0, aChar + 1);
        aDeleting ? aChar-- : aChar++;

        if (!aDeleting && aChar === cur.length) {
            // Pause 1.5s after fully typing the role
            aDeleting = true;
            setTimeout(typeAbout, 1500);
            return;
        }
        if (aDeleting && aChar === 0) {
            // Move to next role after full deletion
            aDeleting = false;
            aIdx = (aIdx + 1) % aboutRoles.length;
        }

        // About section typing slightly slower (120ms) / delete slightly slower (80ms)
        setTimeout(typeAbout, aDeleting ? 80 : 120);
    })();
}


/* =============================================
   ABOUT IMAGE SWAP
   When the user hovers over the about photo,
   it switches to a second image.
   When they move away, it switches back.
   ============================================= */
const aboutImg = document.getElementById('about-me-image');
if (aboutImg) {
    aboutImg.addEventListener('mouseenter', () => { aboutImg.src = 'assets/images/about2.jpeg'; });
    aboutImg.addEventListener('mouseleave', () => { aboutImg.src = 'assets/images/about1.jpeg'; });
}


/* =============================================
   CONTACT FORM FEEDBACK
   When the form is submitted:
   1. Prevents the default page reload
   2. Changes the button text to "Sent ✓" and turns it green
   3. After 3 seconds, resets the button and clears the form
   ============================================= */
const contactForm = document.querySelector('.contact form');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();  // stop the browser from reloading the page
        const btn  = contactForm.querySelector('input[type="submit"]');
        const orig = btn.value;

        // Show success state
        btn.value            = 'Sent ✓';
        btn.style.background = 'linear-gradient(262deg,#10b981,#059669)';  // green gradient
        btn.style.transform  = 'scale(0.98)';

        // Reset back to normal after 3 seconds
        setTimeout(() => {
            btn.value            = orig;
            btn.style.background = '';
            btn.style.transform  = '';
            contactForm.reset();  // clear all form fields
        }, 3000);
    });
}


/* =============================================
   CURSOR-REACTIVE BACKGROUND SYSTEM
   Two parts:
   A) #page-bg — full-screen fixed background that changes
      gradient colour based on which section is visible.
   B) #cursor-glow — a soft blurred circle that smoothly
      follows the mouse cursor across the screen.
   ============================================= */
const pageBg     = document.getElementById('page-bg');
const cursorGlow = document.getElementById('cursor-glow');

// Each section has its own background gradient + glow colour.
// These are applied to #page-bg and #cursor-glow respectively.
const sectionThemes = {
    home: {
        bg:   'linear-gradient(145deg, #ffffff 0%, #f0e8ff 45%, #f9f0ff 100%)',
        glow: 'radial-gradient(circle, rgba(185,0,252,0.18) 0%, rgba(134,55,204,0.10) 50%, transparent 80%)'
    },
    about: {
        bg:   'linear-gradient(160deg, #f8f4ff 0%, #f0e8ff 50%, #fff0fd 100%)',
        glow: 'radial-gradient(circle, rgba(134,55,204,0.20) 0%, rgba(9,9,224,0.08) 55%, transparent 80%)'
    },
    skills: {
        bg:   'linear-gradient(135deg, #ffffff 0%, #eee8ff 40%, #f5f0ff 100%)',
        glow: 'radial-gradient(circle, rgba(9,9,224,0.15) 0%, rgba(185,0,252,0.10) 55%, transparent 80%)'
    },
    education: {
        bg:   'linear-gradient(150deg, #f8f5ff 0%, #ede5ff 45%, #fdf8ff 100%)',
        glow: 'radial-gradient(circle, rgba(107,0,187,0.18) 0%, rgba(134,55,204,0.10) 55%, transparent 80%)'
    },
    projects: {
        bg:   'linear-gradient(140deg, #ffffff 0%, #f2e8ff 40%, #fff0fe 100%)',
        glow: 'radial-gradient(circle, rgba(185,0,252,0.22) 0%, rgba(9,9,224,0.09) 55%, transparent 80%)'
    },
    activities: {
        bg:   'linear-gradient(160deg, #f9f5ff 0%, #eee6ff 50%, #fef5ff 100%)',
        glow: 'radial-gradient(circle, rgba(134,55,204,0.22) 0%, rgba(185,0,252,0.10) 55%, transparent 80%)'
    },
    gallery: {
        bg:   'linear-gradient(145deg, #f5f0ff 0%, #ece4ff 45%, #faf5ff 100%)',
        glow: 'radial-gradient(circle, rgba(9,9,224,0.18) 0%, rgba(107,0,187,0.12) 55%, transparent 80%)'
    },
    contact: {
        bg:   'linear-gradient(155deg, #ffffff 0%, #f0e8ff 45%, #fdf0ff 100%)',
        glow: 'radial-gradient(circle, rgba(185,0,252,0.20) 0%, rgba(134,55,204,0.10) 55%, transparent 80%)'
    }
};

// Set initial background and glow when the page first loads
if (pageBg)     pageBg.style.background     = sectionThemes.home.bg;
if (cursorGlow) cursorGlow.style.background = sectionThemes.home.glow;

let currentSection = 'home';

// Current rendered position of the glow (updated each animation frame)
let glowX = window.innerWidth  / 2;
let glowY = window.innerHeight / 2;
// Target position = where the actual mouse cursor is right now
let targetX = glowX;
let targetY = glowY;
let rafId   = null;

// Linear interpolation helper — smoothly moves "a" towards "b" by factor "t"
function lerp(a, b, t) { return a + (b - a) * t; }

// Animation loop — runs every frame, moves the glow 8% closer to the cursor each frame
// This creates a smooth "lagging behind" trailing effect
function animateGlow() {
    glowX = lerp(glowX, targetX, 0.08);
    glowY = lerp(glowY, targetY, 0.08);
    if (cursorGlow) {
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top  = glowY + 'px';
    }
    rafId = requestAnimationFrame(animateGlow);  // schedule next frame
}
animateGlow();  // start the animation loop immediately

// Update the glow target position whenever the mouse moves
window.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
});

// Fade the glow in when mouse enters the window
document.addEventListener('mouseenter', () => { if (cursorGlow) cursorGlow.style.opacity = '0.55'; });
// Fade the glow out when mouse leaves the window
document.addEventListener('mouseleave', () => { if (cursorGlow) cursorGlow.style.opacity = '0'; });

// IntersectionObserver watches all sections and fires when one becomes 25% visible.
// When a new section enters view, the page background and glow colour update.
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;  // ignore sections that are leaving, not entering
        const id = entry.target.getAttribute('id');
        if (!id || id === currentSection) return;  // skip if it's the same section
        const theme = sectionThemes[id];
        if (!theme) return;

        currentSection = id;

        // Transition the page background (CSS handles the smooth 1.1s crossfade)
        if (pageBg)     pageBg.style.background     = theme.bg;
        // Transition the cursor glow colour
        if (cursorGlow) cursorGlow.style.background = theme.glow;
    });
}, {
    threshold: 0.25,                          // fire when 25% of the section is visible
    rootMargin: '-60px 0px -60px 0px'         // shrink the trigger zone slightly top and bottom
});

// Start observing all sections
document.querySelectorAll('section[id]').forEach(sec => sectionObserver.observe(sec));


/* =============================================
   FLOATING PARTICLE CANVAS BACKGROUND
   Creates an HTML5 canvas overlaid on the page.
   Draws 25 small floating dots that move slowly.
   Draws faint connecting lines between nearby dots.
   This adds a subtle animated "network" effect.
   ============================================= */
(function initParticles() {
    // Create a full-screen canvas and insert it as the first child of body
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4;';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    // Resize canvas when the window size changes
    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    // Possible colours for the particles (blue, purple, magenta)
    const colors = ['rgba(9,9,224,', 'rgba(134,55,204,', 'rgba(185,0,252,'];

    // Create 25 particles with random positions, speeds, colours, and sizes
    const particles = Array.from({ length: 25 }, () => ({
        x: Math.random() * W,      // random starting x position
        y: Math.random() * H,      // random starting y position
        r: Math.random() * 2.5 + 0.7,              // radius: 0.7 to 3.2
        vx: (Math.random() - 0.5) * 0.35,          // x velocity: -0.175 to +0.175
        vy: (Math.random() - 0.5) * 0.35,          // y velocity: -0.175 to +0.175
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.1          // opacity: 0.1 to 0.55
    }));

    // Draw loop — clears and redraws every animation frame
    (function draw() {
        ctx.clearRect(0, 0, W, H);

        // Draw connecting lines between particles closer than 160px
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    // Closer particles → more opaque line
                    ctx.strokeStyle = `rgba(134,55,204,${(1 - dist / 160) * 0.1})`;
                    ctx.lineWidth   = 1;
                    ctx.stroke();
                }
            }
        }

        // Draw and move each particle
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();

            // Move particle by its velocity
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges (reverse velocity when hitting a wall)
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        });

        requestAnimationFrame(draw);  // schedule next frame
    })();
})();


/* =============================================
   CARD STAGGER DELAYS
   Adds progressively increasing transition delays
   to each card so they animate in one by one
   instead of all at once.
   ============================================= */
// Project cards: 0s, 0.1s, 0.2s …
document.querySelectorAll('.assignment-card').forEach((c, i) => c.style.transitionDelay = `${i * 0.1}s`);
// Activity cards: 0s, 0.08s, 0.16s …
document.querySelectorAll('.activity-card').forEach((c, i)  => c.style.transitionDelay = `${i * 0.08}s`);


/* =============================================
   SCROLL REVEAL — INITIAL CHECK ON PAGE LOAD
   Runs once when the DOM is ready.
   Triggers reveal animations for any elements
   that are already visible without scrolling
   (e.g. elements in the home section).
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        // If the element's top is already within the viewport, make it visible immediately
        if (el.getBoundingClientRect().top < window.innerHeight - 60)
            el.classList.add('visible');
    });
});


/* =============================================
   GALLERY — TOUCH SUPPORT
   On desktop, the gallery expands photos on hover.
   On touch screens (mobile/tablet), hover doesn't work,
   so we use "touchstart" to activate the expand effect instead.
   Only one photo can be "active" at a time.
   ============================================= */
document.querySelectorAll('.gallery-grid .box').forEach(box => {
    box.addEventListener('touchstart', () => {
        // Remove "touch-active" from all boxes first
        document.querySelectorAll('.gallery-grid .box').forEach(b => b.classList.remove('touch-active'));
        // Add it to the tapped box
        box.classList.add('touch-active');
    }, { passive: true });  // passive: true improves scroll performance on touch devices
});
