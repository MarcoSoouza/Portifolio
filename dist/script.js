// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.tech-item').forEach(item => {
    observer.observe(item);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// 3D mouse movement effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const hero = document.querySelector('.hero');
    const techItems = document.querySelectorAll('.tech-item');

    if (hero) {
        hero.style.transform = `translateZ(30px) rotateX(${mouseY * 5}deg) rotateY(${mouseX * 5}deg)`;
    }

    techItems.forEach((item, index) => {
        const offset = index * 0.1;
        item.style.transform = `translateZ(20px) rotateX(${mouseY * 2 + offset}deg) rotateY(${mouseX * 2 + offset}deg)`;
    });
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateZ(30px) translateY(${rate * 0.1}px)`;
    }
});
