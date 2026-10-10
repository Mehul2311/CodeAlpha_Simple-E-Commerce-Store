import { api } from './api.js';
import { formatINR, showToast, escapeHTML } from './utils.js';
import { auth } from './auth.js';
import { cart } from './cart.js';

class WishlistManager {
  constructor() {
    this.items = [];
    this.itemIds = new Set();
    this.guestItems = this.loadGuestWishlist();

    auth.onChange(async (user) => {
      if (user && this.guestItems.length > 0) {
        for (const item of this.guestItems) {
          try {
            await api.toggleWishlist(item._id);
          } catch {}
        }
        this.guestItems = [];
        localStorage.removeItem('desikart_guest_wishlist');
      }
      this.syncWishlist();
    });
  }

  loadGuestWishlist() {
    try {
      const data = localStorage.getItem('desikart_guest_wishlist');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveGuestWishlist() {
    localStorage.setItem('desikart_guest_wishlist', JSON.stringify(this.guestItems));
    this.itemIds = new Set(this.guestItems.map(item => item._id));
    this.updateBadges();
  }

  async syncWishlist() {
    if (!auth.user) {
      this.items = this.guestItems;
      this.itemIds = new Set(this.items.map(item => item._id));
      this.updateBadges();
      return;
    }

    try {
      const data = await api.getWishlist();
      this.items = data.wishlist || [];
      this.itemIds = new Set(this.items.map(item => item._id));
      this.updateBadges();
    } catch (err) {
      console.warn('Sync wishlist failed:', err.message);
    }
  }

  isInWishlist(productId) {
    return this.itemIds.has(productId);
  }

  updateBadges() {
    const badges = document.querySelectorAll('.wishlist-count-badge');
    badges.forEach(b => {
      b.textContent = this.itemIds.size;
    });
  }

  async toggle(productId, buttonElement = null, productObj = null) {
    if (auth.user) {
      try {
        const data = await api.toggleWishlist(productId);
        if (data.inWishlist) {
          this.itemIds.add(productId);
        } else {
          this.itemIds.delete(productId);
          this.items = this.items.filter(item => item._id !== productId);
        }

        this.updateBadges();

        if (buttonElement) {
          buttonElement.classList.toggle('active', data.inWishlist);
          const icon = buttonElement.querySelector('i');
          if (icon) {
            icon.className = data.inWishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
          }
        }

        showToast(data.message, 'success');

        if (window.location.hash === '#wishlist') {
          this.renderWishlistView();
        }
      } catch (err) {
        showToast(err.message, 'error');
      }
      return;
    }

    // Guest Wishlist
    try {
      const idx = this.guestItems.findIndex(item => item._id === productId);
      let inWishlist = false;

      if (idx > -1) {
        this.guestItems.splice(idx, 1);
        inWishlist = false;
      } else {
        let p = productObj;
        if (!p) {
          const res = await api.getProductById(productId);
          p = res.product;
        }
        if (p) {
          this.guestItems.push(p);
          inWishlist = true;
        }
      }

      this.saveGuestWishlist();

      if (buttonElement) {
        buttonElement.classList.toggle('active', inWishlist);
        const icon = buttonElement.querySelector('i');
        if (icon) {
          icon.className = inWishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        }
      }

      showToast(inWishlist ? 'Added to your wishlist ❤️' : 'Removed from wishlist', 'success');

      if (window.location.hash === '#wishlist') {
        this.renderWishlistView();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async renderWishlistView() {
    const container = document.getElementById('wishlist-view');
    if (!container) return;

    await this.syncWishlist();

    const displayItems = auth.user ? this.items : this.guestItems;

    if (displayItems.length === 0) {
      container.innerHTML = `
        <div class="container" style="padding: 60px 20px; text-align: center;">
          <i class="fa-regular fa-heart" style="font-size: 3.5rem; color: var(--border-color); margin-bottom: 16px;"></i>
          <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">Your Wishlist is Empty</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Explore our catalogue and click the heart icon to save products.</p>
          <a href="#products" class="btn btn-primary">Browse Catalogue</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="container" style="padding-top: 40px; padding-bottom: 60px;">
        <div class="section-header">
          <div>
            <span class="section-subtitle">Saved Items</span>
            <h1 class="section-title">My Wishlist (${displayItems.length}) ❤️</h1>
            <p class="section-desc">Handcrafted sarees, authentic spices, and festive items you love</p>
          </div>
        </div>

        <div class="products-grid">
          ${displayItems.map(p => `
            <div class="product-card" data-id="${p._id}">
              <div class="product-card-img-wrap">
                <img src="${p.images?.[0] || ''}" alt="${escapeHTML(p.title)}" class="product-card-img">
                <button class="btn-wishlist active" data-id="${p._id}" title="Remove from wishlist">
                  <i class="fa-solid fa-heart"></i>
                </button>
              </div>
              <div class="product-card-body">
                <span class="product-card-category">${escapeHTML(p.category)}</span>
                <h4 class="product-card-title btn-open-detail" data-id="${p._id}">${escapeHTML(p.title)}</h4>
                <div class="product-card-pricing">
                  <span class="price-current">${formatINR(p.price)}</span>
                  <span class="price-mrp">${formatINR(p.mrp)}</span>
                  <span class="price-save">${p.discountPercent}% OFF</span>
                </div>
                <div class="product-card-actions">
                  <button class="btn btn-primary btn-sm btn-wishlist-add-cart" data-id="${p._id}">
                    <i class="fa-solid fa-cart-shopping"></i> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Event listeners
    container.querySelectorAll('.btn-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.toggle(id, btn);
      });
    });

    container.querySelectorAll('.btn-wishlist-add-cart').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const prod = displayItems.find(item => item._id === id);
        await cart.addItem(id, 1, btn, prod);
        await this.toggle(id);
      });
    });

    container.querySelectorAll('.btn-open-detail').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        window.location.hash = `#product-details?id=${id}`;
      });
    });
  }
}

export const wishlist = new WishlistManager();
