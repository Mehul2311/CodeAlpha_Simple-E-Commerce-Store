import { auth } from './auth.js';
import { cart } from './cart.js';
import { wishlist } from './wishlist.js';
import { catalog } from './products.js';
import { checkout } from './checkout.js';
import { orders } from './orders.js';
import { initAnimations } from './animations.js';
import { debounce, showToast } from './utils.js';

class DesiKartApp {
  constructor() {
    this.currentView = 'home';
  }

  async init() {
    this.setupTheme();
    this.setupLanguage();
    this.setupRouter();
    this.setupSearch();
    this.setupAuthModals();
    this.setupNavigation();

    // Initialize Animations (Lenis, GSAP, Cursor, Ripple)
    initAnimations();

    // Check user auth state and sync dependencies
    await auth.checkAuth();
    await Promise.all([
      cart.syncCart(),
      wishlist.syncWishlist(),
      catalog.loadCategoriesBar(),
      catalog.renderFeaturedSection()
    ]);

    catalog.init();

    // Initial Route
    this.handleRoute();
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('desikart_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    toggleBtn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('desikart_theme', next);
      this.updateThemeIcon(next);
    });
  }

  updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle-btn i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  setupLanguage() {
    let currentLang = localStorage.getItem('desikart_lang') || 'en';
    const langBtn = document.getElementById('lang-toggle-btn');
    const updateLangUI = () => {
      if (langBtn) {
        langBtn.textContent = currentLang === 'en' ? 'हिन्दी' : 'English';
      }
      document.querySelectorAll('[data-en]').forEach(el => {
        const enText = el.getAttribute('data-en');
        const hiText = el.getAttribute('data-hi');
        el.textContent = currentLang === 'hi' && hiText ? hiText : enText;
      });
    };

    updateLangUI();

    langBtn?.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'hi' : 'en';
      localStorage.setItem('desikart_lang', currentLang);
      updateLangUI();
      showToast(currentLang === 'hi' ? 'भाषा: हिन्दी सेट की गई 🙏' : 'Language set to English', 'info');
    });
  }

  setupSearch() {
    const searchInputs = [
      document.getElementById('nav-search-input'),
      document.getElementById('main-search-input')
    ];

    searchInputs.forEach(input => {
      if (!input) return;
      input.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim();
        catalog.searchQuery = query;
        catalog.page = 1;

        if (window.location.hash !== '#products') {
          window.location.hash = '#products';
        } else {
          catalog.fetchAndRenderCatalog();
        }
      }, 350));
    });
  }

  setupNavigation() {
    // Nav cart button
    document.getElementById('nav-cart-btn')?.addEventListener('click', () => {
      cart.openDrawer();
    });
    document.getElementById('cart-drawer-close')?.addEventListener('click', () => {
      cart.closeDrawer();
    });
    document.getElementById('cart-drawer-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'cart-drawer-backdrop') {
        cart.closeDrawer();
      }
    });

    // Mobile Drawer Toggle
    const mobileDrawer = document.getElementById('mobile-drawer');
    document.getElementById('btn-mobile-menu')?.addEventListener('click', () => {
      mobileDrawer?.classList.add('active');
    });
    document.getElementById('btn-close-mobile-drawer')?.addEventListener('click', () => {
      mobileDrawer?.classList.remove('active');
    });
    mobileDrawer?.addEventListener('click', (e) => {
      if (e.target.id === 'mobile-drawer') {
        mobileDrawer.classList.remove('active');
      }
    });
  }

  setupAuthModals() {
    // Modal Close buttons
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          el.closest('.modal-backdrop')?.classList.remove('active');
        }
      });
    });

    // Tab switcher in Auth Modal
    document.getElementById('auth-tab-login')?.addEventListener('click', () => {
      auth.switchAuthTab('login');
    });
    document.getElementById('auth-tab-register')?.addEventListener('click', () => {
      auth.switchAuthTab('register');
    });

    // Demo Fill Buttons
    document.getElementById('btn-fill-aarav')?.addEventListener('click', () => {
      const email = document.getElementById('login-email');
      const pass = document.getElementById('login-password');
      if (email) email.value = 'aarav@desikart.in';
      if (pass) pass.value = 'Password@123';
    });
    document.getElementById('btn-fill-priya')?.addEventListener('click', () => {
      const email = document.getElementById('login-email');
      const pass = document.getElementById('login-password');
      if (email) email.value = 'priya@desikart.in';
      if (pass) pass.value = 'Password@123';
    });

    // Login Form
    document.getElementById('auth-login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const success = await auth.login(email, password);
      if (success) {
        auth.closeAuthModal();
        await Promise.all([cart.syncCart(), wishlist.syncWishlist()]);
      }
    });

    // Register Form
    document.getElementById('auth-register-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const password = document.getElementById('reg-password').value;
      const success = await auth.register(name, email, password, phone);
      if (success) {
        auth.closeAuthModal();
        await Promise.all([cart.syncCart(), wishlist.syncWishlist()]);
      }
    });

    // Add Address Modal Form
    document.getElementById('modal-address-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pincode = document.getElementById('m-addr-pin').value.trim();
      if (!/^[1-9][0-9]{5}$/.test(pincode)) {
        showToast('Please enter a valid 6-digit Indian PIN code', 'error');
        return;
      }

      const addressData = {
        fullName: document.getElementById('m-addr-name').value.trim(),
        phone: document.getElementById('m-addr-phone').value.trim(),
        street: document.getElementById('m-addr-street').value.trim(),
        landmark: document.getElementById('m-addr-landmark').value.trim(),
        city: document.getElementById('m-addr-city').value.trim(),
        state: document.getElementById('addr-state-select').value,
        pincode,
        addressType: document.querySelector('input[name="m-addr-type"]:checked')?.value || 'Home',
        isDefault: document.getElementById('m-addr-default')?.checked || false
      };

      try {
        const res = await auth.addAddress(addressData);
        auth.user.addresses = res.addresses;
        auth.closeAddressModal();
        auth.renderProfileView();
        showToast('Address saved successfully!', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  setupRouter() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  handleRoute() {
    const hash = window.location.hash || '#home';
    const [route, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');

    // Close any open mobile drawer
    document.getElementById('mobile-drawer')?.classList.remove('active');

    // Update active nav-links
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === route);
    });

    // Hide all view sections
    const views = [
      'home-view',
      'products-view',
      'product-details-view',
      'checkout-view',
      'orders-view',
      'profile-view',
      'wishlist-view',
      'order-success-view',
      'not-found-view'
    ];

    views.forEach(v => {
      const el = document.getElementById(v);
      if (el) el.style.display = 'none';
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Switch view
    switch (route) {
      case '#home': {
        const v = document.getElementById('home-view');
        if (v) v.style.display = 'block';
        break;
      }

      case '#products': {
        const v = document.getElementById('products-view');
        if (v) v.style.display = 'block';
        catalog.fetchAndRenderCatalog();
        break;
      }

      case '#product-details': {
        const v = document.getElementById('product-details-view');
        if (v) v.style.display = 'block';
        const prodId = params.get('id');
        if (prodId) {
          catalog.renderProductDetailPage(prodId);
        } else {
          window.location.hash = '#products';
        }
        break;
      }

      case '#checkout': {
        const v = document.getElementById('checkout-view');
        if (v) v.style.display = 'block';
        checkout.renderCheckoutView();
        break;
      }

      case '#orders': {
        const v = document.getElementById('orders-view');
        if (v) v.style.display = 'block';
        orders.renderOrdersView();
        break;
      }

      case '#profile': {
        const v = document.getElementById('profile-view');
        if (v) v.style.display = 'block';
        auth.renderProfileView();
        break;
      }

      case '#wishlist': {
        const v = document.getElementById('wishlist-view');
        if (v) v.style.display = 'block';
        wishlist.renderWishlistView();
        break;
      }

      case '#order-success': {
        const v = document.getElementById('order-success-view');
        if (v) v.style.display = 'block';
        const orderId = params.get('id');
        if (orderId) {
          checkout.renderOrderSuccessView(orderId);
        } else {
          window.location.hash = '#orders';
        }
        break;
      }

      default: {
        const v = document.getElementById('not-found-view');
        if (v) v.style.display = 'block';
        break;
      }
    }
  }
}

// Instantiate and start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new DesiKartApp();
  app.init();
});
