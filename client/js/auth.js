import { api } from './api.js';
import { showToast, escapeHTML, INDIAN_STATES } from './utils.js';

class AuthManager {
  constructor() {
    this.user = null;
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.user));
    this.updateNavbarAuthUI();
  }

  async checkAuth() {
    try {
      const data = await api.getMe();
      this.user = data?.authenticated ? data.user : null;
    } catch {
      this.user = null;
    }
    this.notify();
    return this.user;
  }

  async login(email, password) {
    try {
      const data = await api.login({ email, password });
      this.user = data.user;
      this.notify();
      showToast(data.message || `Namaste, ${this.user.name}! 🙏`, 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  }

  async register(name, email, password, phone) {
    try {
      const data = await api.register({ name, email, password, phone });
      this.user = data.user;
      this.notify();
      showToast(data.message || `Welcome to DesiKart, ${this.user.name}! 🙏`, 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  }

  async logout() {
    try {
      await api.logout();
      this.user = null;
      this.notify();
      showToast('Logged out successfully. Alvida, visit again soon!', 'info');
      // If currently on profile/orders/checkout, route to home
      if (window.location.hash.startsWith('#profile') || window.location.hash.startsWith('#checkout') || window.location.hash.startsWith('#orders')) {
        window.location.hash = '#home';
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  updateNavbarAuthUI() {
    const userBtn = document.getElementById('nav-user-btn');
    if (!userBtn) return;

    if (this.user) {
      userBtn.innerHTML = `
        <span class="user-avatar">${escapeHTML(this.user.name.charAt(0).toUpperCase())}</span>
        <span class="user-name">Namaste, ${escapeHTML(this.user.name.split(' ')[0])} 🙏</span>
      `;
      userBtn.title = 'View My Profile';
      userBtn.onclick = () => {
        window.location.hash = '#profile';
      };
    } else {
      userBtn.innerHTML = `
        <i class="fa-solid fa-user"></i>
        <span>Login</span>
      `;
      userBtn.title = 'Login or Register';
      userBtn.onclick = () => {
        this.openAuthModal('login');
      };
    }
  }

  openAuthModal(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    this.switchAuthTab(tab);
    modal.classList.add('active');
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  }

  switchAuthTab(tab) {
    const loginTab = document.getElementById('auth-tab-login');
    const registerTab = document.getElementById('auth-tab-register');
    const loginForm = document.getElementById('auth-login-form');
    const registerForm = document.getElementById('auth-register-form');
    const modalTitle = document.getElementById('auth-modal-title');

    if (tab === 'login') {
      loginTab?.classList.add('active');
      registerTab?.classList.remove('active');
      loginForm?.classList.remove('hidden');
      registerForm?.classList.add('hidden');
      if (modalTitle) modalTitle.textContent = 'Namaste! Sign in to DesiKart';
    } else {
      registerTab?.classList.add('active');
      loginTab?.classList.remove('active');
      registerForm?.classList.remove('hidden');
      loginForm?.classList.add('hidden');
      if (modalTitle) modalTitle.textContent = 'Create your DesiKart Account';
    }
  }

  renderProfileView() {
    const profileView = document.getElementById('profile-view');
    if (!profileView || !this.user) return;

    profileView.innerHTML = `
      <div class="container" style="padding-top: 40px; padding-bottom: 60px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 16px;">
          <div>
            <span class="section-subtitle">Account Details</span>
            <h1 class="section-title">Namaste, ${escapeHTML(this.user.name)} 🙏</h1>
            <p class="section-desc">Manage your profile information and delivery addresses</p>
          </div>
          <button class="btn btn-outline" id="btn-profile-logout">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 32px;" class="profile-grid">
          <!-- Profile Card -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
              <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--gold)); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800;">
                ${escapeHTML(this.user.name.charAt(0).toUpperCase())}
              </div>
              <div>
                <h3 style="font-size: 1.2rem; font-weight: 700;">${escapeHTML(this.user.name)}</h3>
                <span style="font-size: 0.85rem; color: var(--text-muted);">${escapeHTML(this.user.email)}</span>
                <div style="margin-top: 4px;"><span class="badge-festive">${this.user.role === 'admin' ? 'Administrator' : 'Verified Member'}</span></div>
              </div>
            </div>

            <form id="profile-update-form">
              <div class="form-group">
                <label class="form-label required">Full Name</label>
                <input type="text" id="profile-name-input" class="form-control" value="${escapeHTML(this.user.name)}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-control" value="${escapeHTML(this.user.email)}" disabled style="opacity: 0.7;">
                <div class="form-hint">Email cannot be changed for security reasons</div>
              </div>
              <div class="form-group">
                <label class="form-label">Mobile Number (+91)</label>
                <input type="tel" id="profile-phone-input" class="form-control" value="${escapeHTML(this.user.phone || '')}" placeholder="10-digit mobile number">
              </div>
              <button type="submit" class="btn btn-primary btn-block">Save Changes</button>
            </form>
          </div>

          <!-- Saved Addresses -->
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h3 style="font-size: 1.15rem; font-weight: 700;">Saved Delivery Addresses</h3>
              <button class="btn btn-sm btn-outline" id="btn-add-address-modal">
                <i class="fa-solid fa-plus"></i> Add Address
              </button>
            </div>

            <div id="saved-addresses-list" style="display: flex; flex-direction: column; gap: 14px;">
              ${this.user.addresses && this.user.addresses.length > 0 ? this.user.addresses.map(addr => `
                <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 16px; background: var(--bg-main); position: relative;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-weight: 700; font-size: 0.95rem;">${escapeHTML(addr.fullName)}</span>
                      <span class="badge-festive" style="font-size: 0.65rem;">${escapeHTML(addr.addressType || 'Home')}</span>
                      ${addr.isDefault ? '<span style="background: var(--success); color: white; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 700;">DEFAULT</span>' : ''}
                    </div>
                    <button class="btn-delete-address" data-id="${addr._id}" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 0.85rem;" title="Delete address">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                  <p style="font-size: 0.88rem; color: var(--text-main); margin-bottom: 4px;">${escapeHTML(addr.street)}${addr.landmark ? ', ' + escapeHTML(addr.landmark) : ''}</p>
                  <p style="font-size: 0.85rem; color: var(--text-muted);">${escapeHTML(addr.city)}, ${escapeHTML(addr.state)} – <strong>${escapeHTML(addr.pincode)}</strong></p>
                  <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;"><i class="fa-solid fa-phone"></i> +91 ${escapeHTML(addr.phone)}</p>
                </div>
              `).join('') : `
                <div style="text-align: center; padding: 36px 20px; color: var(--text-muted);">
                  <i class="fa-solid fa-map-location-dot" style="font-size: 2.2rem; margin-bottom: 12px; color: var(--primary);"></i>
                  <p>No saved addresses yet. Add an address for faster 1-click checkout.</p>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    document.getElementById('btn-profile-logout')?.addEventListener('click', () => this.logout());

    document.getElementById('profile-update-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('profile-name-input').value.trim();
      const phone = document.getElementById('profile-phone-input').value.trim();
      try {
        const res = await api.updateProfile({ name, phone });
        this.user = { ...this.user, ...res.user };
        this.notify();
        showToast('Profile updated successfully!', 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });

    document.getElementById('btn-add-address-modal')?.addEventListener('click', () => {
      this.openAddressModal();
    });

    document.querySelectorAll('.btn-delete-address').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Are you sure you want to remove this address?')) return;
        try {
          const res = await api.deleteAddress(id);
          this.user.addresses = res.addresses;
          this.renderProfileView();
          showToast('Address removed', 'info');
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    });
  }

  openAddressModal() {
    const modal = document.getElementById('address-modal');
    if (!modal) return;
    
    // Populate state dropdown
    const stateSelect = document.getElementById('addr-state-select');
    if (stateSelect && stateSelect.options.length <= 1) {
      INDIAN_STATES.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st;
        opt.textContent = st;
        stateSelect.appendChild(opt);
      });
    }

    modal.classList.add('active');
  }

  closeAddressModal() {
    const modal = document.getElementById('address-modal');
    if (modal) modal.classList.remove('active');
  }
}

export const auth = new AuthManager();
