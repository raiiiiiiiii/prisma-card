/**
 * PrismaX Identity System - Homepage Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.getElementById('siteHeader');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Parallax Orbs
  const orbs = document.querySelectorAll('.bg-orb');
  
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 20;
      const moveX = (x - 0.5) * speed;
      const moveY = (y - 0.5) * speed;
      orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  // 3. Scroll Reveal Animation
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add reveal class to elements
  const revealElements = [
    ...document.querySelectorAll('.feature-card'),
    ...document.querySelectorAll('.role-tile'),
    ...document.querySelectorAll('.step'),
    document.querySelector('.cta-block'),
    document.querySelector('.section-header')
  ];

  revealElements.forEach((el, index) => {
    if(el) {
        el.classList.add('reveal');
        // Add staggered delay based on DOM order
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;
        observer.observe(el);
    }
  });

  // 4. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed header
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 5. 3D Tilt Effect on Hero Card
  const heroCard = document.getElementById('cardMockup');
  const heroVisual = document.getElementById('heroVisual');
  
  if(heroVisual && heroCard) {
      heroVisual.addEventListener('mousemove', (e) => {
          const rect = heroVisual.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;
          
          heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      
      heroVisual.addEventListener('mouseleave', () => {
          heroCard.style.transform = `rotateY(-15deg) rotateX(10deg)`;
      });
  }
});
