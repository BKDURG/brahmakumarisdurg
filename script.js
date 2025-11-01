// Mobile menu functionality
(function() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-navigation');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;

    function toggleMenu() {
        const isOpen = mainNav.classList.toggle('is-open');
        toggleButton.classList.toggle('is-open');
        toggleButton.setAttribute('aria-expanded', isOpen);
        body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 767 && mainNav.classList.contains('is-open')) {
            toggleMenu();
        }
    });
})();

// Daily Quotes
(function() {
    const quotes = [
        { text: "The soul who has realized God becomes like a lotus flower in a muddy pond – untouched by the impurity around it.", author: "Brahma Baba" },
        { text: "When you change, the whole world changes. The key to world peace is within each individual.", author: "Dadi Janki" },
        { text: "Meditation is not just a practice, it's a way of life. It's the journey from the head to the heart.", author: "Dadi Gulzar" },
        { text: "The power of silence is greater than the power of words. In silence, we connect with the Supreme.", author: "Brahma Kumaris" },
        { text: "Your thoughts create your reality. Think positive, speak positive, and act positive.", author: "Sister Shivani" },
        { text: "The greatest service you can do to humanity is to awaken your own consciousness.", author: "Brahma Baba" },
        { text: "True spirituality is not about renouncing the world, but about bringing divine qualities into your worldly life.", author: "Dadi Prakashmani" },
        { text: "When you remember God, you remember your true self – a being of peace, love, and joy.", author: "Brahma Kumaris" },
        { text: "The present moment is the only reality. Live it with awareness and gratitude.", author: "Sister Jayanti" },
        { text: "Your character is your destiny. Cultivate virtues and watch your life transform.", author: "Brahma Baba" }
    ];

    let currentQuoteIndex = 0;
    const quoteText = document.getElementById('dailyQuote');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const refreshBtn = document.getElementById('refreshQuote');

    function displayQuote() {
        const quote = quotes[currentQuoteIndex];
        if (quoteText) quoteText.textContent = `"${quote.text}"`;
        if (quoteAuthor) quoteAuthor.textContent = `- ${quote.author}`;
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            displayQuote();
        });
    }

    // Auto-refresh quote daily
    setInterval(() => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        displayQuote();
    }, 86400000); // 24 hours
})();

// Tab functionality for Events and Gallery
(function() {
    // Events tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // Gallery tabs
    const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
    const galleryContents = document.querySelectorAll('.gallery-content');

    galleryTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const galleryId = btn.getAttribute('data-gallery');
            
            galleryTabBtns.forEach(b => b.classList.remove('active'));
            galleryContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetContent = document.getElementById(galleryId);
            if (targetContent) targetContent.classList.add('active');
        });
    });
})();

// Gallery Modal
(function() {
    const modal = document.getElementById('imageModal');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && modalImage) {
                modalImage.setAttribute('src', img.getAttribute('src'));
                modalImage.setAttribute('alt', img.getAttribute('alt'));
                modal.classList.add('active');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
})();

// Form submissions
(function() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            alert(`Thank you, ${name}! Your message has been received. We will get back to you soon.`);
            this.reset();
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with email: ${email}. You will now receive our daily spiritual thoughts and event updates.`);
            this.reset();
        });
    }
})();

// Smooth scrolling for navigation links
(function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

// Animation on scroll
(function() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.event-card, .gallery-item, .contact-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animation
    document.querySelectorAll('.event-card, .gallery-item, .contact-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
})();

// Preloader functionality
(function() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.progress-bar');
    const percentText = document.querySelector('.loading-percent');
    
    if (!preloader) return;
    
    let progress = 0;
    const interval = setInterval(function() {
        if (progress < 90) {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            
            if (percentText) {
                percentText.textContent = Math.floor(progress) + '%';
            }
        } else {
            clearInterval(interval);
        }
    }, 300);
    
    function hidePreloader() {
        if (progressBar) {
            progressBar.style.width = '100%';
        }
        
        if (percentText) {
            percentText.textContent = '100%';
        }
        
        setTimeout(function() {
            preloader.classList.add('fade-out');
            
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    }
    
    window.addEventListener('load', function() {
        clearInterval(interval);
        hidePreloader();
    });
    
    // Fallback: hide preloader after maximum 5 seconds
    setTimeout(function() {
        if (preloader.style.display !== 'none') {
            clearInterval(interval);
            hidePreloader();
        }
    }, 5000);
})();