document.documentElement.classList.add('has-js');

const header = document.querySelector('#site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (header) {
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
}

if (menuToggle && navLinks) {
    const closeMenu = () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navLinks.classList.contains('open')) {
            closeMenu();
            menuToggle.focus();
        }
    });
    document.addEventListener('click', event => {
        if (navLinks.classList.contains('open') && !header.contains(event.target)) closeMenu();
    });
}

const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealInViewport = () => revealItems.forEach(item => {
        if (item.classList.contains('visible')) return;

        const bounds = item.getBoundingClientRect();
        if (bounds.bottom >= 0 && bounds.top <= window.innerHeight * 1.1) {
            item.classList.add('visible');
            observer.unobserve(item);
        }
    });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    }), { threshold: .12 });
    revealItems.forEach(item => observer.observe(item));
    window.addEventListener('scroll', revealInViewport, { passive: true });
    window.addEventListener('resize', revealInViewport);
    revealInViewport();
} else {
    revealItems.forEach(item => item.classList.add('visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const chakraCard = document.querySelector('#chakra-card');
const chakraPoints = document.querySelectorAll('.chakra-point');

if (chakraCard && chakraPoints.length) {
    const chakraName = chakraCard.querySelector('[data-chakra-name]');
    const chakraNumber = chakraCard.querySelector('[data-chakra-number]');
    const chakraLocation = chakraCard.querySelector('[data-chakra-location]');
    const chakraColor = chakraCard.querySelector('[data-chakra-color]');
    const chakraConcept = chakraCard.querySelector('[data-chakra-concept]');
    const chakraSwatch = chakraCard.querySelector('[data-chakra-swatch]');

    chakraPoints.forEach((point, index) => {
        point.addEventListener('click', () => {
            chakraPoints.forEach(item => item.setAttribute('aria-pressed', String(item === point)));
            chakraNumber.textContent = String(chakraPoints.length - index).padStart(2, '0');
            chakraName.textContent = point.dataset.name;
            chakraLocation.textContent = point.dataset.location;
            chakraColor.textContent = point.dataset.color;
            chakraConcept.textContent = point.dataset.concept;
            chakraSwatch.style.setProperty('--chakra-color', getComputedStyle(point).getPropertyValue('--chakra-color'));
        });
    });

    const selectedChakra = [...chakraPoints].find(point => point.getAttribute('aria-pressed') === 'true');
    if (selectedChakra) chakraSwatch.style.setProperty('--chakra-color', getComputedStyle(selectedChakra).getPropertyValue('--chakra-color'));
}

const serviceSelect = document.querySelector('#contact-service');
const selectedService = new URLSearchParams(window.location.search).get('servicio');
const serviceValues = {
    reiki: 'Reiki',
    registros: 'Registros Akáshicos',
    tarot: 'Tarot',
    oraculos: 'Oráculos'
};

if (serviceSelect && selectedService && serviceValues[selectedService]) {
    serviceSelect.value = serviceValues[selectedService];
}

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm && serviceSelect) {
    const status = contactForm.querySelector('[data-form-status]');

    contactForm.addEventListener('submit', event => {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        const formData = new FormData(contactForm);
        const message = [
            'Hola Priscila, soy ' + formData.get('nombre') + '.',
            'Mi dato de contacto es: ' + formData.get('respuesta') + '.',
            'Me interesa: ' + formData.get('servicio') + '.',
            'Mi consulta: ' + formData.get('mensaje')
        ].join('\n');
        const whatsappUrl = 'https://wa.me/5492944536667?text=' + encodeURIComponent(message);
        const popup = window.open(whatsappUrl, '_blank');

        if (popup) {
            popup.opener = null;
            status.textContent = 'Se abrió WhatsApp en otra pestaña. Revisá el mensaje y elegí si querés enviarlo.';
            return;
        }

        status.replaceChildren(
            document.createTextNode('El navegador bloqueó la nueva pestaña. '),
            Object.assign(document.createElement('a'), {
                href: whatsappUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                textContent: 'Abrir el mensaje de WhatsApp'
            })
        );
    });
}
