(function() {
  'use strict';
  
  function init() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger) {
      hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        const isOpen = hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (mobileMenu) mobileMenu.classList.toggle('open', isOpen);
      });
    }
    
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
      link.addEventListener('click', function() {
        if (hamburger) {
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
        if (mobileMenu) mobileMenu.classList.remove('open');
      });
    });
    
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', function() {
      const scrollTop = window.scrollY;
      if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
      }
      if (navbar) navbar.classList.toggle('scrolled', scrollTop > 50);
    });
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js');
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
