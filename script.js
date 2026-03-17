gsap.registerPlugin(ScrollTrigger);

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ============ MOBILE MENU ============
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    gsap.to(spans[0], { rotation: 45, y: 6.5, duration: 0.3 });
    gsap.to(spans[1], { opacity: 0, duration: 0.2 });
    gsap.to(spans[2], { rotation: -45, y: -6.5, duration: 0.3 });
  } else {
    gsap.to(spans, { rotation: 0, y: 0, opacity: 1, duration: 0.3 });
  }
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  const spans = hamburger.querySelectorAll('span');
  gsap.to(spans, { rotation: 0, y: 0, opacity: 1, duration: 0.3 });
}
window.closeMobileMenu = closeMobileMenu;

// ============ ABOUT/INTRO ENTRANCE ANIMATION ============
// Runs immediately on page load (first section)
const introTL = gsap.timeline({ delay: 0.15 });

introTL
  .fromTo('.about-intro-image', {
    opacity: 0, x: -40
  }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power3.out'
  })
  .fromTo('.about-name-block', {
    opacity: 0, y: 30
  }, {
    opacity: 1, y: 0, duration: 0.75, ease: 'power3.out'
  }, '-=0.55')
  .fromTo('.about-lead', {
    opacity: 0, y: 20
  }, {
    opacity: 1, y: 0, duration: 0.65, ease: 'power3.out'
  }, '-=0.4')
  .fromTo('.about-body', {
    opacity: 0, y: 20
  }, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1
  }, '-=0.35')
  .fromTo('.about-highlights', {
    opacity: 0, y: 16
  }, {
    opacity: 1, y: 0, duration: 0.5, ease: 'power3.out'
  }, '-=0.25')
  .fromTo('.about-actions', {
    opacity: 0, y: 16
  }, {
    opacity: 1, y: 0, duration: 0.5, ease: 'power3.out'
  }, '-=0.2');

// ============ SCROLL REVEAL — section labels ============
gsap.utils.toArray('.reveal-fade').forEach(el => {
  // Skip about section elements (already animated above)
  if (el.closest('#about')) return;
  gsap.fromTo(el,
    { opacity: 0 },
    {
      opacity: 1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' }
    }
  );
});

// ============ SCROLL REVEAL — reveal-up elements ============
document.querySelectorAll('section:not(#about)').forEach(section => {
  const items = section.querySelectorAll('.reveal-up');
  if (!items.length) return;
  gsap.fromTo(items,
    { opacity: 0, y: 44 },
    {
      opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: section, start: 'top 78%', toggleActions: 'play none none reverse' }
    }
  );
});

// ============ SKILL CARDS ============
gsap.fromTo('.skill-category',
  { opacity: 0, y: 36, scale: 0.97 },
  {
    opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.09,
    scrollTrigger: { trigger: '#skills', start: 'top 72%', toggleActions: 'play none none reverse' }
  }
);

// ============ PROJECT CARDS ============
ScrollTrigger.create({
  trigger: '#projects',
  start: 'top 72%',
  onEnter: () => {
    gsap.fromTo('.project-card',
      { opacity: 0, y: 36, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 }
    );
  }
});

// ============ PROJECT FILTERING ============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    gsap.to(projectCards, {
      opacity: 0, y: 16, scale: 0.97, duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        projectCards.forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'flex' : 'none';
        });
        const visible = [...projectCards].filter(c => c.style.display !== 'none');
        gsap.fromTo(visible,
          { opacity: 0, y: 24, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out', stagger: 0.07 }
        );
      }
    });
  });
});

// ============ TESTIMONIALS CAROUSEL ============
const track = document.getElementById('testimonialsTrack');
const dots = document.querySelectorAll('.t-dot');
const prevBtn = document.getElementById('tPrev');
const nextBtn = document.getElementById('tNext');

let currentSlide = 0;
const totalSlides = 4;
let autoplayInterval;

function getCardsVisible() { return window.innerWidth > 900 ? 2 : 1; }

function goToSlide(index) {
  const max = totalSlides - getCardsVisible();
  currentSlide = Math.max(0, Math.min(index, max));
  const cardWidth = track.querySelector('.testimonial-card').offsetWidth;
  gsap.to(track, { x: -(currentSlide * (cardWidth + 24)), duration: 0.65, ease: 'power3.inOut' });
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function nextSlide() { goToSlide(currentSlide >= totalSlides - getCardsVisible() ? 0 : currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide <= 0 ? totalSlides - getCardsVisible() : currentSlide - 1); }

nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); }));

function startAutoplay() { autoplayInterval = setInterval(nextSlide, 10000); }
function resetAutoplay() { clearInterval(autoplayInterval); startAutoplay(); }

ScrollTrigger.create({
  trigger: '#testimonials', start: 'top 70%',
  onEnter: startAutoplay,
  onLeave: () => clearInterval(autoplayInterval),
  onEnterBack: startAutoplay,
  onLeaveBack: () => clearInterval(autoplayInterval)
});

window.addEventListener('resize', () => goToSlide(currentSlide));

// ============ CONTACT FORM ============
// Wait for EmailJS to load
function waitForEmailJS(callback, retries = 0) {
  if (typeof emailjs !== 'undefined') {
    // EmailJS is ready
    emailjs.init({ publicKey: "VqDUYecO21Lc-ZHax" });
    callback();
  } else if (retries < 10) {
    // Retry after 300ms (up to 3 seconds total)
    setTimeout(() => waitForEmailJS(callback, retries + 1), 300);
  }
}

// Initialize EmailJS when page loads
waitForEmailJS(() => {
  console.log('EmailJS initialized successfully');
});

function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  if (!nameInput.value || !emailInput.value || !messageInput.value) {
    gsap.fromTo(btn, { x: 0 }, { x: 8, duration: 0.08, yoyo: true, repeat: 6 });
    return;
  }

  // Show loading state
  const original = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Check if EmailJS is loaded
  if (typeof emailjs === 'undefined') {
    console.error('EmailJS not loaded');
    btn.textContent = 'Error: Service unavailable';
    btn.style.background = '#dc2626';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
    return;
  }

  // Send email via EmailJS
  emailjs.send('service_cw3luzx', 'template_3ao0bku', {
    to_email: 'noorulhudaajmal12@gmail.com',
    from_name: nameInput.value,
    from_email: emailInput.value,
    message: messageInput.value
  }).then(() => {
    btn.textContent = 'Sent! ✓';
    btn.style.background = '#16a34a';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
    }, 3000);
  }).catch((error) => {
    console.error('Email send failed:', error);
    btn.textContent = 'Failed. Try again';
    btn.style.background = '#dc2626';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}
window.handleFormSubmit = handleFormSubmit;

// ============ STAT COUNTER ============
ScrollTrigger.create({
  trigger: '#about', start: 'top 60%',
  onEnter: () => {
    const num = document.querySelector('.about-stat-num');
    if (!num) return;
    gsap.from({ val: 0 }, {
      val: 10, duration: 1.4, ease: 'power2.out',
      onUpdate: function() { num.textContent = Math.round(this.targets()[0].val) + '+'; }
    });
  }
});