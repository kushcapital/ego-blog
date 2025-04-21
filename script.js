// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const scrollTopBtn = document.getElementById('scrollTop');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-list a');
    
    // Theme handling functions
    const themeHandler = {
        // Initialize theme based on localStorage or system preference
        init: function() {
            const savedTheme = localStorage.getItem('theme');
            
            if (savedTheme) {
                // Apply saved theme preference
                document.documentElement.classList.toggle('dark', savedTheme === 'dark');
                document.documentElement.classList.toggle('light', savedTheme === 'light');
            } else {
                // Check system preference if no saved theme
                const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', prefersDark);
                document.documentElement.classList.toggle('light', !prefersDark);
            }
        },
        
        // Toggle theme with smooth transition
        toggle: function() {
            // Disable button temporarily to prevent rapid clicks
            themeToggleBtn.disabled = true;
            
            // Show transition overlay
            document.documentElement.classList.add('theme-transition');
            
            // Short delay before theme change
            setTimeout(() => {
                // Toggle dark/light classes
                document.documentElement.classList.toggle('dark');
                document.documentElement.classList.toggle('light', !document.documentElement.classList.contains('dark'));
                
                // Save preference to localStorage
                localStorage.setItem('theme', 
                    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
                );
                
                // Remove transition class after animation completes
                setTimeout(() => {
                    document.documentElement.classList.remove('theme-transition');
                    themeToggleBtn.disabled = false;
                }, 1000);
            }, 150);
        }
    };
    
    // Scroll handling functions
    const scrollHandler = {
        // Show/hide scroll-to-top button based on scroll position
        updateScrollButton: function() {
            scrollTopBtn.classList.toggle('active', window.scrollY > 300);
        },
        
        // Scroll to top with smooth animation
        scrollToTop: function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        
        // Handle smooth scrolling for anchor links
        setupSmoothScrolling: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (!targetElement) return;
                    
                    // Calculate position with offset for fixed headers
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offset = 80;
                    
                    window.scrollTo({
                        top: targetPosition - offset,
                        behavior: 'smooth'
                    });

                    // Update navigation active state
                    navLinks.forEach(link => {
                        link.classList.remove('nav-active');
                    });
                    this.classList.add('nav-active');
                });
            });
        },
        
        // Update active navigation based on scroll position
        updateActiveNavOnScroll: function() {
            // Get current scroll position
            let scrollPosition = window.scrollY;
            
            // Check which section is currently in view
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all navigation items
                    navLinks.forEach(link => {
                        link.classList.remove('nav-active');
                        
                        // Add active class to the current section's navigation item
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('nav-active');
                        }
                    });
                }
            });
        }
    };
    
    // Mobile navigation handling
    const mobileNavHandler = {
        createMobileNav: function() {
            // Skip if already created
            if (document.getElementById('mobile-nav-toggle')) return;
            
            // Create mobile navigation toggle button
            const mobileNavToggle = document.createElement('button');
            mobileNavToggle.id = 'mobile-nav-toggle';
            mobileNavToggle.className = 'md:hidden fixed top-4 left-4 z-50 p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg bg-black/70 border border-white/20 text-white hover:bg-black/90';
            mobileNavToggle.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            mobileNavToggle.style.display = 'none';
            document.querySelector('header').appendChild(mobileNavToggle);
            
            const navList = document.querySelector('.nav-list');
            
            // Toggle navigation visibility
            mobileNavToggle.addEventListener('click', function() {
                navList.classList.toggle('mobile-open');
                
                // Toggle icon
                const icon = this.querySelector('i');
                if (navList.classList.contains('mobile-open')) {
                    icon.className = 'fas fa-times text-xl';
                    navList.style.display = 'flex';
                    setTimeout(() => {
                        navList.style.transform = 'translateY(0)';
                        navList.style.opacity = '1';
                    }, 10);
                } else {
                    icon.className = 'fas fa-bars text-xl';
                    navList.style.transform = 'translateY(-20px)';
                    navList.style.opacity = '0';
                    setTimeout(() => {
                        if (!navList.classList.contains('mobile-open')) {
                            navList.style.display = 'none';
                        }
                    }, 300);
                }
            });
            
            // Apply responsive styles
            const styleForMobile = () => {
                // Always make navigation visible
                navList.style.display = 'flex';
                
                if (window.innerWidth < 768) {
                    // Show mobile toggle on small screens
                    mobileNavToggle.style.display = 'block';
                    
                    // Apply mobile styles
                    navList.style.position = 'relative';
                    navList.style.top = 'auto';
                    navList.style.left = 'auto';
                    navList.style.transform = 'none';
                    navList.style.opacity = '1';
                    navList.style.flexDirection = 'column';
                    navList.style.width = '90%';
                    navList.style.maxWidth = '300px';
                    navList.style.margin = '0 auto';
                    navList.style.zIndex = '100';
                    navList.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                } else {
                    // Hide toggle on larger screens
                    mobileNavToggle.style.display = 'none';
                    
                    // Reset to desktop styles
                    navList.style.position = 'relative';
                    navList.style.top = 'auto';
                    navList.style.left = 'auto';
                    navList.style.transform = 'none';
                    navList.style.opacity = '1';
                    navList.style.flexDirection = 'row';
                    navList.style.width = 'fit-content';
                    navList.style.maxWidth = 'none';
                    navList.classList.remove('mobile-open');
                }
            };
            
            // Run on load and resize
            styleForMobile();
            window.addEventListener('resize', styleForMobile);
        }
    };
    
    // Handle section animations on scroll
    const animationHandler = {
        setupSectionAnimations: function() {
            const fadeInOptions = {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px"
            };
            
            const fadeInOnScroll = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    
                    entry.target.classList.add('appear');
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    fadeInOnScroll.unobserve(entry.target);
                });
            }, fadeInOptions);
            
            sections.forEach(section => {
                // Initially set opacity and position
                section.style.opacity = "0";
                section.style.transform = "translateY(30px)";
                section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
                fadeInOnScroll.observe(section);
            });
        },
        
        // Lazy load images for performance
        setupLazyLoading: function() {
            const images = document.querySelectorAll('img');
            
            const imageOptions = {
                threshold: 0.1,
                rootMargin: "0px 0px 200px 0px" // Load images before they enter viewport
            };
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (!src) return;
                    
                    img.src = src;
                    img.removeAttribute('data-src');
                    
                    // Fade in effect
                    img.style.opacity = "0";
                    setTimeout(() => {
                        img.style.transition = "opacity 0.5s ease-in-out";
                        img.style.opacity = "1";
                    }, 100);
                    
                    observer.unobserve(img);
                });
            }, imageOptions);
            
            images.forEach(img => {
                // Only process images that have data-src attribute or no src attribute
                if (img.getAttribute('data-src') || !img.src) {
                    // If there's no data-src but there is a src, store the original src as data-src
                    if (!img.getAttribute('data-src') && img.src) {
                        img.setAttribute('data-src', img.src);
                        // Use tiny SVG placeholder
                        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                        imageObserver.observe(img);
                    } else if (img.getAttribute('data-src')) {
                        // Handle images that already have data-src set
                        imageObserver.observe(img);
                    }
                }
                // Images without data-src and with src are left as-is to show immediately
            });
        }
    };
    
    // Initialize all features
    function init() {
        // Theme initialization
        themeHandler.init();
        
        // Event listeners
        themeToggleBtn.addEventListener('click', themeHandler.toggle);
        window.addEventListener('scroll', function() {
            scrollHandler.updateScrollButton();
            scrollHandler.updateActiveNavOnScroll();
        });
        scrollTopBtn.addEventListener('click', scrollHandler.scrollToTop);
        
        // Setup features
        scrollHandler.setupSmoothScrolling();
        mobileNavHandler.createMobileNav();
        animationHandler.setupSectionAnimations();
        
        // Initially highlight active navigation item based on URL hash
        if (window.location.hash) {
            const activeNavLink = document.querySelector(`.nav-list a[href="${window.location.hash}"]`);
            if (activeNavLink) {
                navLinks.forEach(link => link.classList.remove('nav-active'));
                activeNavLink.classList.add('nav-active');
            }
        } else {
            // Default to first nav item if no hash
            navLinks[0].classList.add('nav-active');
        }
        
        // Delay lazy loading to prioritize critical content
        setTimeout(animationHandler.setupLazyLoading, 100);
        
        // Handle resize events (debounced)
        window.addEventListener('resize', function() {
            clearTimeout(window.resizeTimer);
            window.resizeTimer = setTimeout(() => {
                // Any refresh logic for responsive elements
            }, 250);
        });
    }
    
    // Start initialization
    init();
});