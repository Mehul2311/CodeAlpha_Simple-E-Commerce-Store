export function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Snappy Preloader Fadeout
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hidePreloader = () => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 300);
    };
    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 150);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 150));
      setTimeout(hidePreloader, 400); // Safety timeout
    }
  }

  // 2. Animated Metric Numbers Counters
  const counters = document.querySelectorAll('.counter-num');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
    const suffix = counter.getAttribute('data-suffix') || '';

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let start = 0;
            const step = Math.ceil(target / 40);
            const timer = setInterval(() => {
              start += step;
              if (start >= target) {
                counter.textContent = target.toLocaleString('en-IN') + suffix;
                clearInterval(timer);
              } else {
                counter.textContent = start.toLocaleString('en-IN') + suffix;
              }
            }, 30);
            observer.unobserve(counter);
          }
        });
      }, { threshold: 0.2 });
      observer.observe(counter);
    } else {
      counter.textContent = target.toLocaleString('en-IN') + suffix;
    }
  });

  // 3. Sticky Navbar Blur on Scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 4. Button Ripple Effect
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.btn-primary, .btn-secondary');
    if (!target) return;

    const circle = document.createElement('span');
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    const rect = target.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-circle');

    const ripple = target.getElementsByClassName('ripple-circle')[0];
    if (ripple) ripple.remove();

    target.appendChild(circle);
  });
}
