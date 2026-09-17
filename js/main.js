/**
 * DMAS Lite - Core Client Application Logic
 * Pure ES6+ Vanilla JavaScript - Zero Bloat, Instant Performance
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initServiceTabs();
  initEstimator();
  initCaseStudyFilters();
  initFaqAccordion();
  initContactForm();
  initStatCounters();

  // Initialize Lucide Icons if loaded
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeToggleMobileBtn = document.getElementById('themeToggleMobile');
  const html = document.documentElement;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('dmas_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    // default to dark if not specified, but respect explicit preference
    if (savedTheme === 'light') {
      html.classList.add('light');
    }
  }

  function toggleTheme() {
    const isLight = html.classList.toggle('light');
    localStorage.setItem('dmas_theme', isLight ? 'light' : 'dark');
    updateThemeIcons();
  }

  function updateThemeIcons() {
    const isLight = html.classList.contains('light');
    const icons = document.querySelectorAll('.theme-icon-sun, .theme-icon-moon');
    icons.forEach(icon => {
      if (icon.classList.contains('theme-icon-sun')) {
        icon.classList.toggle('hidden', !isLight);
      }
      if (icon.classList.contains('theme-icon-moon')) {
        icon.classList.toggle('hidden', isLight);
      }
    });
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);
  updateThemeIcons();
}

/* ==========================================================================
   2. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  function toggleMenu() {
    const isExpanded = mobileMenu.classList.toggle('hidden');
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
  }

  toggleBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Smooth ScrollSpy & Sticky Nav Blur
   ========================================================================== */
function initScrollSpy() {
  const nav = document.getElementById('mainNav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 30) {
      nav.classList.add('shadow-lg', 'bg-slate-900/90');
    } else {
      nav.classList.remove('shadow-lg');
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-blue-500', 'font-semibold');
            link.classList.remove('text-slate-300');
          } else {
            link.classList.remove('text-blue-500', 'font-semibold');
            link.classList.add('text-slate-300');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   4. Services Filter Tabs & Inquiry Pre-fill
   ========================================================================== */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      tabBtns.forEach(b => {
        b.classList.remove('active-tab', 'bg-blue-600', 'text-white');
        b.classList.add('bg-slate-800/80', 'text-slate-300');
      });

      btn.classList.add('active-tab', 'bg-blue-600', 'text-white');
      btn.classList.remove('bg-slate-800/80', 'text-slate-300');

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Service Inquiry CTA hooks
  document.querySelectorAll('.inquire-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service-name');
      const serviceType = btn.getAttribute('data-service-type'); // dev | marketing | staffing
      
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Check corresponding service checkbox
      if (serviceType) {
        const checkbox = document.getElementById(`service-${serviceType}`);
        if (checkbox) checkbox.checked = true;
      }

      // Fill in message field
      const msgField = document.getElementById('contactMessage');
      if (msgField && serviceName) {
        msgField.value = `Hi, I am interested in learning more about your ${serviceName} services. Please share relevant case studies and availability.`;
        msgField.focus();
      }
    });
  });
}

/* ==========================================================================
   5. Interactive Project Cost & Scope Estimator
   ========================================================================== */
function initEstimator() {
  const serviceSelect = document.getElementById('estServiceType');
  const scaleInput = document.getElementById('estScale');
  const scaleLabel = document.getElementById('estScaleLabel');
  const speedInput = document.getElementById('estSpeed');
  const speedLabel = document.getElementById('estSpeedLabel');

  const priceOutput = document.getElementById('estPriceOutput');
  const timelineOutput = document.getElementById('estTimelineOutput');
  const applyBtn = document.getElementById('estApplyBtn');

  if (!serviceSelect || !scaleInput || !speedInput || !priceOutput) return;

  const basePricing = {
    software: {
      mvp: { min: 4500, max: 8000, weeks: '3-5 weeks' },
      growth: { min: 10000, max: 22000, weeks: '6-10 weeks' },
      enterprise: { min: 25000, max: 60000, weeks: '12-20 weeks' }
    },
    marketing: {
      mvp: { min: 1800, max: 3500, weeks: 'Monthly Retainer' },
      growth: { min: 4000, max: 8500, weeks: 'Monthly Retainer' },
      enterprise: { min: 10000, max: 25000, weeks: 'Quarterly Campaign' }
    },
    staffing: {
      mvp: { min: 3200, max: 6000, weeks: '1-2 Specialists' },
      growth: { min: 7500, max: 15000, weeks: 'Dedicated Pod (3-5)' },
      enterprise: { min: 18000, max: 45000, weeks: 'Custom Department' }
    },
    bundle: {
      mvp: { min: 8000, max: 15000, weeks: 'Full Setup (4-6 wks)' },
      growth: { min: 18000, max: 38000, weeks: 'Scale & Growth (8-14 wks)' },
      enterprise: { min: 45000, max: 95000, weeks: 'Enterprise Transformation' }
    }
  };

  const scaleNames = ['Starter / MVP', 'Growth & Scaling', 'Full Enterprise'];
  const speedNames = ['Standard Pace', 'Accelerated Sprint', 'High-Priority Fast Track'];

  function recalculate() {
    const service = serviceSelect.value || 'software';
    const scaleIdx = parseInt(scaleInput.value, 10);
    const speedIdx = parseInt(speedInput.value, 10);

    const scaleKey = scaleIdx === 0 ? 'mvp' : scaleIdx === 1 ? 'growth' : 'enterprise';
    scaleLabel.textContent = scaleNames[scaleIdx];
    speedLabel.textContent = speedNames[speedIdx];

    const data = basePricing[service][scaleKey];
    let multiplier = 1 + (speedIdx * 0.18); // slight acceleration factor

    const finalMin = Math.round((data.min * multiplier) / 100) * 100;
    const finalMax = Math.round((data.max * multiplier) / 100) * 100;

    priceOutput.textContent = `$${finalMin.toLocaleString()} - $${finalMax.toLocaleString()}`;
    timelineOutput.textContent = data.weeks;
  }

  serviceSelect.addEventListener('change', recalculate);
  scaleInput.addEventListener('input', recalculate);
  speedInput.addEventListener('input', recalculate);
  recalculate();

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      const service = serviceSelect.value;
      if (service === 'software' || service === 'marketing' || service === 'staffing') {
        const chk = document.getElementById(`service-${service}`);
        if (chk) chk.checked = true;
      } else if (service === 'bundle') {
        ['software', 'marketing', 'staffing'].forEach(s => {
          const chk = document.getElementById(`service-${s}`);
          if (chk) chk.checked = true;
        });
      }

      const msgField = document.getElementById('contactMessage');
      if (msgField) {
        msgField.value = `Hi, I ran your Project Estimator for "${serviceSelect.options[serviceSelect.selectedIndex].text}" at "${scaleNames[parseInt(scaleInput.value, 10)]}" level (Estimated Range: ${priceOutput.textContent}). I'd like to discuss kickstarting this project.`;
      }
    });
  }
}

/* ==========================================================================
   6. Case Study Category Filters
   ========================================================================== */
function initCaseStudyFilters() {
  const filterBtns = document.querySelectorAll('.case-filter-btn');
  const caseCards = document.querySelectorAll('.case-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('bg-slate-700', 'text-white', 'border-blue-500');
        b.classList.add('bg-slate-800/60', 'text-slate-400');
      });

      btn.classList.add('bg-slate-700', 'text-white', 'border-blue-500');
      btn.classList.remove('bg-slate-800/60', 'text-slate-400');

      caseCards.forEach(card => {
        const itemCat = card.getAttribute('data-case-type');
        if (filter === 'all' || itemCat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      faqItems.forEach(other => {
        const oc = other.querySelector('.faq-content');
        const oi = other.querySelector('.faq-icon');
        if (oc) oc.classList.add('hidden');
        if (oi) oi.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ==========================================================================
   8. Contact Form Handling & Feedback Modal
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('agencyContactForm');
  const modal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalSummary = document.getElementById('modalLeadSummary');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const company = document.getElementById('contactCompany')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();
    const budget = document.getElementById('contactBudget')?.value;

    const checkedServices = [];
    ['software', 'marketing', 'staffing'].forEach(s => {
      const chk = document.getElementById(`service-${s}`);
      if (chk && chk.checked) {
        checkedServices.push(s === 'software' ? 'Software Development' : s === 'marketing' ? 'Digital Marketing' : 'Staffing Solutions');
      }
    });

    if (!name || !email) {
      alert('Please provide your name and email address.');
      return;
    }

    // Populate Modal Summary
    if (modalSummary) {
      modalSummary.innerHTML = `
        <div class="space-y-1 text-left bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 text-xs text-slate-300">
          <div><strong class="text-white">Client:</strong> ${name} ${company ? `(${company})` : ''}</div>
          <div><strong class="text-white">Email:</strong> ${email}</div>
          <div><strong class="text-white">Services:</strong> ${checkedServices.length > 0 ? checkedServices.join(', ') : 'General Inquiry'}</div>
          <div><strong class="text-white">Budget Range:</strong> ${budget || 'Flexible'}</div>
        </div>
      `;
    }

    // Show modal
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    form.reset();
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }
}

/* ==========================================================================
   9. Animated Stat Counters
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = target / 40;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.textContent = Math.ceil(count) + suffix;
              setTimeout(updateCount, 30);
            } else {
              counter.textContent = target + suffix;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}
