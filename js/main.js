// ===== DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", function () {
    initLoader();
    initCursor();
    initNavbar();
    initScrollAnimations();
    initParallax();
    initBackToTop();
    initSmoothScroll();
});

// ===== LOADER =====
function initLoader() {
    const loader = document.getElementById("loader");
    const loaderText = document.querySelector(".loader__text");

    // Simulate loading time
    setTimeout(() => {
        loader.classList.add("loader--hidden");

        setTimeout(() => {
            loader.style.display = "none";

            // Start hero animations after loader
            animateHero();
        }, 500);

    }, 2000);

    // Animate loader text
    let dots = 0;

    setInterval(() => {
        dots = (dots + 1) % 4;
        loaderText.textContent = "Kyoda.Dev" + ".".repeat(dots);
    }, 500);
}

// ===== CURSOR (ghost / fine pointer only) =====
function initCursor() {

    const cursor = document.querySelector(".cursor");
    const cursorFollower = document.querySelector(".cursor-follower");

    if (!cursor || !cursorFollower) {
        return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        cursor.style.display = "none";
        cursorFollower.style.display = "none";
        return;
    }

    if (!window.matchMedia("(pointer: fine)").matches) {
        cursor.style.display = "none";
        cursorFollower.style.display = "none";
        return;
    }

    document.body.classList.add("has-custom-cursor");

    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    let followerX = 0;
    let followerY = 0;

    let hovering = false;

    const interactiveSelector = [
        "a",
        "button",
        "input",
        "textarea",
        "select",
        ".project-card",
        ".skill-card",
        ".info-card",
        ".contact-link",
        ".exp-card",
        ".nav__hamburger",
    ].join(", ");

    document.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        const hit = e.target.closest(interactiveSelector);

        hovering = Boolean(hit);

        if (hovering) {
            document.body.classList.add("cursor--hover");
        } else {
            document.body.classList.remove("cursor--hover");
        }

    });

    function updateCursor() {

        cursorX += (mouseX - cursorX) * 0.22;
        cursorY += (mouseY - cursorY) * 0.22;

        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        const dotScale = hovering ? 0.4 : 1;
        const ringScale = hovering ? 1.85 : 1;

        cursor.style.transform =
            `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) scale(${dotScale})`;

        cursorFollower.style.transform =
            `translate(${followerX}px, ${followerY}px) translate(-50%, -50%) scale(${ringScale})`;

        requestAnimationFrame(updateCursor);
    }

    requestAnimationFrame(updateCursor);
}

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelector(".nav__links");
    const hamburger = document.querySelector(".nav__hamburger");
    const links = document.querySelectorAll(".nav__link");

    // Sticky navbar with blur effect
    window.addEventListener("scroll", () => {

        if (window.scrollY > 100) {
            navbar.classList.add("navbar--scrolled");
        } else {
            navbar.classList.remove("navbar--scrolled");
        }

    });

    // Mobile menu toggle
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("nav__links--open");
        hamburger.classList.toggle("nav__hamburger--open");
    });

    // Close mobile menu on link click
    links.forEach((link) => {

        link.addEventListener("click", () => {
            navLinks.classList.remove("nav__links--open");
            hamburger.classList.remove("nav__hamburger--open");
        });

    });

    // Active link on scroll
    const sections = document.querySelectorAll("section[id]");

    function setActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach((section) => {

            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (
                scrollY >= sectionTop &&
                scrollY < sectionTop + sectionHeight
            ) {

                links.forEach((link) => {

                    link.classList.remove("nav__link--active");

                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("nav__link--active");
                    }

                });
            }

        });
    }

    window.addEventListener("scroll", setActiveLink);
    setActiveLink();
}

// ===== HERO ANIMATIONS =====
function animateHero() {
    const elements = document.querySelectorAll(".hero .reveal-up");

    elements.forEach((el, index) => {

        setTimeout(() => {
            el.classList.add("reveal-up--visible");
        }, index * 200);

    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-up--visible");
            }

        });

    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal-up");

    revealElements.forEach((el) => {
        observer.observe(el);
    });

    // Fade in animations
    const fadeObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in--visible");
            }

        });

    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-in");

    fadeElements.forEach((el) => {
        fadeObserver.observe(el);
    });

    // Skill bars animation
    const skillObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                const skillCard = entry.target;
                const fill = skillCard.querySelector(".skill-bar__fill");
                const width = skillCard.dataset.skill;

                fill.style.width = `${width}%`;
            }

        });

    }, {
        threshold: 0.5,
    });

    const skillCards = document.querySelectorAll(".skill-card");

    skillCards.forEach((card) => {
        skillObserver.observe(card);
    });
}

// ===== PARALLAX =====
function initParallax() {

    const parallaxElements = document.querySelectorAll(
        ".hero__blob, .hero__grid"
    );

    window.addEventListener("scroll", () => {

        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;

        parallaxElements.forEach((el) => {
            el.style.transform = `translateY(${rate * 0.1}px)`;
        });

    });
}

// ===== BACK TO TOP =====
function initBackToTop() {

    const backToTopBtn = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {
            backToTopBtn.classList.add("back-to-top--visible");
        } else {
            backToTopBtn.classList.remove("back-to-top--visible");
        }

    });

    backToTopBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {

        link.addEventListener("click", (e) => {

            e.preventDefault();

            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                // Account for navbar height
                const offsetTop = targetElement.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                });

            }

        });

    });
}

// ===== UTILITIES =====
function debounce(func, wait) {

    let timeout;

    return function executedFunction(...args) {

        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);
    };
}

// ===== PERFORMANCE OPTIMIZATION =====
function throttle(func, limit) {

    let inThrottle;

    return function () {

        const args = arguments;
        const context = this;

        if (!inThrottle) {

            func.apply(context, args);

            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
            }, limit);

        }
    };
}
