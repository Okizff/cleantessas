/**
 * FreshNest Cleaning - SEO Enhanced SPA Routing & Dynamic Metadata Controller
 * Location: Austin, Texas
 */

document.addEventListener('DOMContentLoaded', () => {

  // Configuration for URLs, Page Metadata, Titles, Descriptions & Canonical Links
  const siteDomain = 'https://example.com';

  const routes = {
    home: {
      path: '/',
      hash: '#home',
      title: 'FreshNest Cleaning | Professional Cleaning Services in Austin, TX',
      description: 'Trusted residential & commercial cleaning services in Austin, Texas. Routine house cleaning, deep cleans, move-in/out & office care. Request a free quote!',
      elementId: 'page-home'
    },
    services: {
      path: '/services',
      hash: '#services',
      title: 'Cleaning Services in Austin, TX | FreshNest Cleaning',
      description: 'Explore professional cleaning services in Austin, TX. Regular house cleaning from $120, deep cleans from $200, move-in/out from $250 & office cleaning.',
      elementId: 'page-services'
    },
    about: {
      path: '/about',
      hash: '#about',
      title: 'About FreshNest Cleaning | Austin Cleaning Company',
      description: 'Learn about FreshNest Cleaning, Austin\'s trusted local cleaning company. Dedicated to attention to detail, reliability, and healthy spaces.',
      elementId: 'page-about'
    },
    contact: {
      path: '/contact',
      hash: '#contact',
      title: 'Contact FreshNest Cleaning | Get a Free Quote in Austin, TX',
      description: 'Contact FreshNest Cleaning for a free quote on residential or commercial cleaning in Austin, Texas. Call +1 (512) 555-0147 or request online.',
      elementId: 'page-contact'
    }
  };

  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const pageSections = document.querySelectorAll('.page-section');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  // Dynamic Metadata Sync Function
  function updateMetadata(route) {
    document.title = route.title;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', route.description);

    // Canonical
    let canonical = document.getElementById('canonicalUrl');
    const fullUrl = siteDomain + (route.path === '/' ? '' : route.path);
    if (canonical) canonical.setAttribute('href', fullUrl);

    // OpenGraph & Twitter Cards
    const ogTitle = document.getElementById('ogTitle');
    const ogDesc = document.getElementById('ogDescription');
    const twTitle = document.getElementById('twitterTitle');
    const twDesc = document.getElementById('twitterDescription');

    if (ogTitle) ogTitle.setAttribute('content', route.title);
    if (ogDesc) ogDesc.setAttribute('content', route.description);
    if (twTitle) twTitle.setAttribute('content', route.title);
    if (twDesc) twDesc.setAttribute('content', route.description);
  }

  // Core Navigation Function
  function navigateTo(pageKey, pushState = true) {
    if (!routes[pageKey]) pageKey = 'home';
    const targetRoute = routes[pageKey];

    // Hide all pages
    pageSections.forEach(section => section.classList.remove('active'));

    // Show selected page
    const activeSection = document.getElementById(targetRoute.elementId);
    if (activeSection) {
      activeSection.classList.add('active');
    }

    // Update Meta & Head Tags
    updateMetadata(targetRoute);

    // Update active nav link states
    navLinks.forEach(link => {
      if (link.dataset.page === pageKey) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close Mobile Drawer if open
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }

    // History API Management
    if (pushState) {
      // Use clean URL if on actual web server, fallback graciously
      const targetUrl = window.location.protocol.startsWith('http') ? targetRoute.path : targetRoute.hash;
      history.pushState({ page: pageKey }, '', targetUrl);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle Clicks Across Nav Links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (link) {
      e.preventDefault();
      const pageKey = link.dataset.page;
      navigateTo(pageKey, true);
    }
  });

  // Handle Browser Back / Forward Buttons
  window.addEventListener('popstate', (e) => {
    let pageKey = 'home';
    if (e.state && e.state.page) {
      pageKey = e.state.page;
    } else {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      if (path === '/services' || hash === 'services') pageKey = 'services';
      else if (path === '/about' || hash === 'about') pageKey = 'about';
      else if (path === '/contact' || hash === 'contact') pageKey = 'contact';
    }
    navigateTo(pageKey, false);
  });

  // Resolve Initial Route on Load
  function resolveInitialRoute() {
    const path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');
    if (path === '/services' || hash === 'services') return 'services';
    if (path === '/about' || hash === 'about') return 'about';
    if (path === '/contact' || hash === 'contact') return 'contact';
    return 'home';
  }

  navigateTo(resolveInitialRoute(), false);

  // Mobile Drawer Toggle
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Tabs Switcher on Contact Page
  const tabQuoteBtn = document.getElementById('tabQuoteBtn');
  const tabContactBtn = document.getElementById('tabContactBtn');
  const formQuote = document.getElementById('formQuote');
  const formContact = document.getElementById('formContact');
  const successAlert = document.getElementById('formSuccessAlert');

  if (tabQuoteBtn && tabContactBtn) {
    tabQuoteBtn.addEventListener('click', () => {
      tabQuoteBtn.classList.add('active');
      tabQuoteBtn.setAttribute('aria-selected', 'true');
      tabContactBtn.classList.remove('active');
      tabContactBtn.setAttribute('aria-selected', 'false');

      formQuote.classList.remove('hidden-form');
      formQuote.classList.add('active-form');
      formContact.classList.add('hidden-form');
      formContact.classList.remove('active-form');
      if (successAlert) successAlert.classList.add('hidden');
    });

    tabContactBtn.addEventListener('click', () => {
      tabContactBtn.classList.add('active');
      tabContactBtn.setAttribute('aria-selected', 'true');
      tabQuoteBtn.classList.remove('active');
      tabQuoteBtn.setAttribute('aria-selected', 'false');

      formContact.classList.remove('hidden-form');
      formContact.classList.add('active-form');
      formQuote.classList.add('hidden-form');
      formQuote.classList.remove('active-form');
      if (successAlert) successAlert.classList.add('hidden');
    });
  }

  // Form Validation & Handling
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleInputValidation(inputElement, isError) {
    const group = inputElement.closest('.form-group');
    if (group) {
      if (isError) group.classList.add('has-error');
      else group.classList.remove('has-error');
    }
  }

  if (formQuote) {
    formQuote.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('quoteName');
      const email = document.getElementById('quoteEmail');
      const property = document.getElementById('quoteProperty');
      const service = document.getElementById('quoteService');

      if (!name.value.trim()) { handleInputValidation(name, true); isValid = false; }
      else { handleInputValidation(name, false); }

      if (!email.value.trim() || !validateEmail(email.value)) { handleInputValidation(email, true); isValid = false; }
      else { handleInputValidation(email, false); }

      if (!property.value) { handleInputValidation(property, true); isValid = false; }
      else { handleInputValidation(property, false); }

      if (!service.value) { handleInputValidation(service, true); isValid = false; }
      else { handleInputValidation(service, false); }

      if (isValid) {
        const btn = formQuote.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');

        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        btn.disabled = true;

        setTimeout(() => {
          btnText.classList.remove('hidden');
          btnLoader.classList.add('hidden');
          btn.disabled = false;

          formQuote.reset();
          document.getElementById('successTitle').innerText = 'Quote Request Received!';
          document.getElementById('successMessage').innerText = 'Thank you for reaching out! A FreshNest team member will review your details and email your estimate shortly.';
          successAlert.classList.remove('hidden');
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1000);
      }
    });
  }

  if (formContact) {
    formContact.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const message = document.getElementById('contactMessage');

      if (!name.value.trim()) { handleInputValidation(name, true); isValid = false; }
      else { handleInputValidation(name, false); }

      if (!email.value.trim() || !validateEmail(email.value)) { handleInputValidation(email, true); isValid = false; }
      else { handleInputValidation(email, false); }

      if (!message.value.trim()) { handleInputValidation(message, true); isValid = false; }
      else { handleInputValidation(message, false); }

      if (isValid) {
        const btn = formContact.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');

        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        btn.disabled = true;

        setTimeout(() => {
          btnText.classList.remove('hidden');
          btnLoader.classList.add('hidden');
          btn.disabled = false;

          formContact.reset();
          document.getElementById('successTitle').innerText = 'Message Sent!';
          document.getElementById('successMessage').innerText = 'Thank you for contacting FreshNest Cleaning. We will respond within 24 business hours.';
          successAlert.classList.remove('hidden');
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 1000);
      }
    });
  }

  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => handleInputValidation(input, false));
  });

});