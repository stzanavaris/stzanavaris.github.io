
/* =========================
   PREMIUM NAVIGATION
   ========================= */

const header = document.querySelector("header");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

function updateNavigation() {

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

    let currentSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
}

window.addEventListener(
    "scroll",
    updateNavigation,
    { passive: true }
);

updateNavigation();

/* =========================
   MOBILE HAMBURGER MENU
   ========================= */

const menuToggle = document.querySelector(".menu-toggle");
const navigationMenu = document.querySelector(".nav-links");

const mobileBreakpoint = window.matchMedia("(max-width: 700px)");

function setMobileMenu(open) {

    if (!menuToggle || !navigationMenu) {
        return;
    }

    menuToggle.classList.toggle("is-open", open);
    navigationMenu.classList.toggle("is-open", open);

    document.body.classList.toggle("mobile-menu-open", open);

    menuToggle.setAttribute("aria-expanded", String(open));

    menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
    );

    if (mobileBreakpoint.matches) {
        if (open) {
            navigationMenu.removeAttribute("inert");
        } else {
            navigationMenu.setAttribute("inert", "");
        }
    } else {
        navigationMenu.removeAttribute("inert");
    }
}

function closeMobileMenu() {
    setMobileMenu(false);
}

function syncMobileMenu() {

    if (!mobileBreakpoint.matches) {
        closeMobileMenu();
        navigationMenu.removeAttribute("inert");
    } else {
        const isOpen = menuToggle.classList.contains("is-open");

        if (!isOpen) {
            navigationMenu.setAttribute("inert", "");
        }
    }
}

if (menuToggle && navigationMenu) {

    menuToggle.addEventListener("click", () => {

        const isOpen = menuToggle.classList.contains("is-open");

        setMobileMenu(!isOpen);
    });

    navLinks.forEach(link => {

        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", event => {

        const isOpen = menuToggle.classList.contains("is-open");

        if (
            isOpen &&
            !navigationMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    mobileBreakpoint.addEventListener("change", syncMobileMenu);

    syncMobileMenu();
}

/* =========================
   MOTION PREFERENCES
   ========================= */

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/* =========================
   REUSABLE TYPING ANIMATION
   ========================= */

function startTyping(element, speed = 85) {

    if (!element || element.dataset.typed === "true") {
        return;
    }

    element.dataset.typed = "true";

    const fullText =
        element.dataset.fullText || element.textContent.trim();

    if (reducedMotion) {
        element.textContent = fullText;
        return;
    }

    element.textContent = "";

    const cursor = document.createElement("span");

    cursor.textContent = "|";
    cursor.setAttribute("aria-hidden", "true");

    cursor.style.display = "inline-block";
    cursor.style.marginLeft = "3px";
    cursor.style.color = "#ffffff";

    cursor.animate(
        [
            { opacity: 1 },
            { opacity: 0 },
            { opacity: 1 }
        ],
        {
            duration: 1000,
            iterations: Infinity
        }
    );

    element.appendChild(cursor);

    let characterIndex = 0;

    function typeCharacter() {

        if (characterIndex < fullText.length) {

            cursor.before(
                document.createTextNode(
                    fullText.charAt(characterIndex)
                )
            );

            characterIndex++;

            setTimeout(typeCharacter, speed);

        } else {

            setTimeout(() => {
                cursor.remove();
            }, 1200);
        }
    }

    typeCharacter();
}

/* =========================
   HOME TYPING ANIMATION
   ========================= */

const homeTypingText = document.getElementById("typing-text");
const oldTypingCursor = document.getElementById("typing-cursor");

if (homeTypingText) {

    if (oldTypingCursor) {
        oldTypingCursor.remove();
    }

    const originalText = homeTypingText.textContent.trim();

    homeTypingText.dataset.fullText = originalText;

    if (!reducedMotion) {
        homeTypingText.textContent = "";
    }

    setTimeout(() => {
        startTyping(homeTypingText, 85);
    }, 450);
}

/* =========================
   SECTION HEADING TYPING
   ========================= */

const sectionHeadings = document.querySelectorAll(".section-title");

sectionHeadings.forEach(heading => {

    heading.dataset.fullText = heading.textContent.trim();

    if (!reducedMotion) {
        heading.textContent = "";
    }
});

if ("IntersectionObserver" in window) {

    const headingObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    startTyping(entry.target, 110);

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    sectionHeadings.forEach(heading => {
        headingObserver.observe(heading);
    });

} else {

    sectionHeadings.forEach(heading => {
        startTyping(heading, 110);
    });
}

/* =========================
   SCROLL REVEAL ANIMATIONS
   ========================= */

const revealElements = document.querySelectorAll(
    ".section-label, " +
    ".about-content p, " +
    ".skill-card, " +
    ".project-card, " +
    ".contact-content > p, " +
    ".contact-btn"
);

if (!reducedMotion && "IntersectionObserver" in window) {

    revealElements.forEach(element => {
        element.classList.add("reveal-ready");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const element = entry.target;

                    let delay = 0;

                    if (element.classList.contains("skill-card")) {

                        const cards = Array.from(
                            document.querySelectorAll(".skill-card")
                        );

                        const index = cards.indexOf(element);

                        delay = (index % 3) * 130;

                    } else if (
                        element.classList.contains("project-card")
                    ) {

                        const cards = Array.from(
                            document.querySelectorAll(".project-card")
                        );

                        const index = cards.indexOf(element);

                        delay = (index % 2) * 180;
                    }

                    element.style.transitionDelay = delay + "ms";

                    element.classList.add("reveal-visible");

                    observer.unobserve(element);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/* =========================
   CUSTOM CURSOR GLOW
   ========================= */

const supportsMouse = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (supportsMouse && !reducedMotion) {

    const cursorDot = document.createElement("div");
    cursorDot.className = "cursor-dot";

    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";

    document.body.appendChild(cursorGlow);
    document.body.appendChild(cursorDot);

    document.body.classList.add("custom-cursor-enabled");

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    let cursorVisible = false;

    document.addEventListener("mousemove", event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.left = mouseX + "px";
        cursorDot.style.top = mouseY + "px";

        if (!cursorVisible) {

            cursorVisible = true;

            cursorDot.style.opacity = "1";
            cursorGlow.style.opacity = "1";

            glowX = mouseX;
            glowY = mouseY;
        }
    });

    document.addEventListener("mouseover", event => {

        const interactiveElement = event.target.closest(
            "a, button, .skill-card, .project-card"
        );

        if (interactiveElement) {
            cursorGlow.classList.add("cursor-hover");
        } else {
            cursorGlow.classList.remove("cursor-hover");
        }
    });

    document.addEventListener("mouseout", event => {

        if (!event.relatedTarget) {

            cursorVisible = false;

            cursorDot.style.opacity = "0";
            cursorGlow.style.opacity = "0";
        }
    });

    function animateCursor() {

        const easing = 0.14;

        glowX += (mouseX - glowX) * easing;
        glowY += (mouseY - glowY) * easing;

        cursorGlow.style.left = glowX + "px";
        cursorGlow.style.top = glowY + "px";

        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}
