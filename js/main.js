const header = document.querySelector('#site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const revealItems = document.querySelectorAll('.reveal');

if (header) {
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }));
}

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    }), { threshold: .12 });
    revealItems.forEach(item => observer.observe(item));
} else {
    revealItems.forEach(item => item.classList.add('visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
