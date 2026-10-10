import { api } from './api.js';
import { formatINR, showToast, escapeHTML } from './utils.js';
import { auth } from './auth.js';

class CartManager {
  constructor() {
    this.cartData = {
      items: [],
      itemsPrice: 0,
      mrpTotal: 0,
      savings: 0,
      taxPrice: 0,
      shippingPrice: 0,
      discountPrice: 0,
      couponApplied: '',
      totalPrice: 0,
      count: 0
    };
    this.appliedCoupon = localStorage.getItem('desikart_coupon') || '';
    this.guestItems = this.loadGuestItems();

    // Sync guest items when user logs in
    auth.onChange(async (user) => {
      if (user && this.guestItems.length > 0) {
        try {
          for (const item of this.guestItems) {
            await api.addToCart(item.product._id, item.quantity);
          }
          this.guestItems = [];
          localStorage.removeItem('desikart_guest_cart');
        } catch (e) {
          console.warn('Auto-sync guest cart failed:', e);
        }
      }
      this.syncCart();
    });
  }

  loadGuestItems() {
    try {
      const data = localStorage.getItem('desikart_guest_cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveGuestItems() {
    localStorage.setItem('desikart_guest_cart', JSON.stringify(this.guestItems));
    this.calculateGuestCart();
  }

  calculateGuestCart() {
    let itemsPrice = 0;
    let mrpTotal = 0;
    let count = 0;

    for (const item of this.guestItems) {
      const p = item.product;
      const qty = item.quantity;
      itemsPrice += (p.price || 0) * qty;
      mrpTotal += (p.mrp || p.price || 0) * qty;
      count += qty;
    }

    let discountPrice = 0;
    let verifiedCoupon = '';
    const code = (this.appliedCoupon || '').toUpperCase().trim();

    if (code === 'DIWALI50' && itemsPrice >= 299) {
      discountPrice = 50;
      verifiedCoupon = 'DIWALI50';
    } else if (code === 'DESI10' && itemsPrice > 0) {
      discountPrice = Math.min(500, Math.round(itemsPrice * 0.1));
      verifiedCoupon = 'DESI10';
    } else if (code === 'FESTIVE20' && itemsPrice >= 1999) {
      discountPrice = Math.min(1000, Math.round(itemsPrice * 0.2));
      verifiedCoupon = 'FESTIVE20';
    }

    const savings = (mrpTotal - itemsPrice) + discountPrice;
    const shippingPrice = itemsPrice >= 499 || itemsPrice === 0 ? 0 : 49;
    const taxableBase = Math.max(0, itemsPrice - discountPrice);
    const taxPrice = Math.round(taxableBase * 0.18);
    const totalPrice = Math.max(0, taxableBase + taxPrice + shippingPrice);

    this.cartData = {
      items: this.guestItems,
      itemsPrice,
      mrpTotal,
      savings,
      taxPrice,
      shippingPrice,
      discountPrice,
      couponApplied: verifiedCoupon,
      totalPrice,
      count
    };

    this.updateBadges();
    return this.cartData;
  }

  async syncCart() {
    if (!auth.user) {
      this.calculateGuestCart();
      this.renderDrawer();
      return;
    }

    try {
      const data = await api.getCart(this.appliedCoupon);
      this.cartData = data;
      this.appliedCoupon = data.couponApplied || '';
      this.updateBadges();
      this.renderDrawer();
    } catch (err) {
      console.warn('Sync cart failed:', err.message);
    }
  }

  updateBadges() {
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
      b.textContent = this.cartData.count || 0;
    });
  }

  async addItem(productId, quantity = 1, triggerElement = null, productObj = null) {
    if (triggerElement) {
      this.animateFlyToCart(triggerElement);
    }

    if (auth.user) {
      try {
        const data = await api.addToCart(productId, quantity);
        this.cartData = data;
        this.updateBadges();
        this.renderDrawer();
        showToast(data.message || 'Item added to your cart! 🛍️', 'success');
        this.openDrawer();
      } catch (err) {
        showToast(err.message, 'error');
      }
      return;
    }

    // Guest Cart support
    try {
      let product = productObj;
      if (!product) {
        const res = await api.getProductById(productId);
        product = res.product;
      }

      if (!product) {
        showToast('Product not found', 'error');
        return;
      }

      const existing = this.guestItems.find(i => i.product._id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.guestItems.push({
          product,
          quantity
        });
      }

      this.saveGuestItems();
      this.renderDrawer();
      showToast(`${product.title} added to cart! 🛍️`, 'success');
      this.openDrawer();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async updateQuantity(productId, quantity) {
    const qty = Number(quantity);

    if (auth.user) {
      try {
        const data = await api.updateCartQty(productId, qty);
        this.cartData = data;
        this.updateBadges();
        this.renderDrawer();
      } catch (err) {
        showToast(err.message, 'error');
      }
      return;
    }

    // Guest Cart
    if (qty <= 0) {
      this.guestItems = this.guestItems.filter(i => i.product._id !== productId);
    } else {
      const item = this.guestItems.find(i => i.product._id === productId);
      if (item) item.quantity = qty;
    }
    this.saveGuestItems();
    this.renderDrawer();
  }

  async removeItem(productId) {
    if (auth.user) {
      try {
        const data = await api.removeFromCart(productId);
        this.cartData = data;
        this.updateBadges();
        this.renderDrawer();
        showToast('Item removed from cart', 'info');
      } catch (err) {
        showToast(err.message, 'error');
      }
      return;
    }

    // Guest Cart
    this.guestItems = this.guestItems.filter(i => i.product._id !== productId);
    this.saveGuestItems();
    this.renderDrawer();
    showToast('Item removed from cart', 'info');
  }

  async applyCouponCode(code) {
    const upperCode = (code || '').toUpperCase().trim();
    this.appliedCoupon = upperCode;
    localStorage.setItem('desikart_coupon', upperCode);

    if (auth.user) {
      try {
        const data = await api.applyCoupon(upperCode);
        this.appliedCoupon = data.couponApplied;
        this.cartData = data;
        this.renderDrawer();
        showToast(data.message, 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
      return;
    }

    // Guest coupon
    this.calculateGuestCart();
    this.renderDrawer();
    if (this.cartData.couponApplied) {
      showToast(`Coupon ${upperCode} applied! Savings of ${formatINR(this.cartData.discountPrice)}`, 'success');
    } else {
      showToast('Coupon code not applicable for this cart amount', 'error');
    }
  }

  animateFlyToCart(sourceEl) {
    const targetCart = document.getElementById('nav-cart-btn');
    if (!sourceEl || !targetCart) return;

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetCart.getBoundingClientRect();

    const flyingImg = document.createElement('div');
    flyingImg.className = 'flying-cart-img';
    flyingImg.innerHTML = `<i class="fa-solid fa-bag-shopping" style="font-size: 24px; color: var(--primary);"></i>`;
    flyingImg.style.background = '#fff';
    flyingImg.style.display = 'flex';
    flyingImg.style.alignItems = 'center';
    flyingImg.style.justifyContent = 'center';
    flyingImg.style.left = `${sourceRect.left + sourceRect.width / 2 - 25}px`;
    flyingImg.style.top = `${sourceRect.top + sourceRect.height / 2 - 25}px`;

    document.body.appendChild(flyingImg);

    requestAnimationFrame(() => {
      flyingImg.style.left = `${targetRect.left + 5}px`;
      flyingImg.style.top = `${targetRect.top + 5}px`;
      flyingImg.style.transform = 'scale(0.3)';
      flyingImg.style.opacity = '0.3';
    });

    setTimeout(() => {
      flyingImg.remove();
      this.updateBadges();
    }, 450);
  }

  openDrawer() {
    const drawerBackdrop = document.getElementById('cart-drawer-backdrop');
    if (drawerBackdrop) {
      this.renderDrawer();
      drawerBackdrop.classList.add('active');
    }
  }

  closeDrawer() {
    const drawerBackdrop = document.getElementById('cart-drawer-backdrop');
    if (drawerBackdrop) {
      drawerBackdrop.classList.remove('active');
    }
  }

  renderDrawer() {
    const container = document.getElementById('cart-items-container');
    const footerContainer = document.getElementById('cart-drawer-footer');
    if (!container || !footerContainer) return;

    if (!this.cartData.items || this.cartData.items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-basket-shopping" style="font-size: 2.8rem; margin-bottom: 14px; color: var(--border-color);"></i>
          <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">Your cart is empty</h4>
          <p style="font-size: 0.88rem; margin-bottom: 20px;">Explore authentic sarees, spices, handicrafts, and more!</p>
          <button class="btn btn-primary btn-sm" id="btn-explore-shop">Start Shopping</button>
        </div>
      `;
      document.getElementById('btn-explore-shop')?.addEventListener('click', () => {
        this.closeDrawer();
        window.location.hash = '#products';
      });
      footerContainer.style.display = 'none';
      return;
    }

    footerContainer.style.display = 'flex';

    container.innerHTML = `
      <div class="cart-items-list">
        ${this.cartData.items.map(item => {
          const p = item.product;
          if (!p) return '';
          return `
            <div class="cart-item-card" data-id="${p._id}">
              <img src="${p.images?.[0] || ''}" alt="${escapeHTML(p.title)}" class="cart-item-img">
              <div class="cart-item-details">
                <span class="cart-item-title">${escapeHTML(p.title)}</span>
                <span class="cart-item-price">${formatINR(p.price)}</span>
                <div class="cart-qty-ctrl">
                  <button class="qty-btn btn-cart-minus" data-id="${p._id}" data-qty="${item.quantity - 1}">-</button>
                  <span class="qty-num">${item.quantity}</span>
                  <button class="qty-btn btn-cart-plus" data-id="${p._id}" data-qty="${item.quantity + 1}">+</button>
                </div>
              </div>
              <button class="btn-remove-item" data-id="${p._id}" style="background: none; border: none; color: var(--danger); cursor: pointer; padding: 6px;" title="Remove">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Render footer calculations
    const freeDeliveryThreshold = 499;
    const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - this.cartData.itemsPrice);

    footerContainer.innerHTML = `
      <!-- Free Delivery Progress -->
      <div style="background: var(--bg-alt); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.82rem; margin-bottom: 4px;">
        ${remainingForFreeDelivery === 0 ? `
          <div style="color: var(--success); font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-truck-fast"></i> Yay! You unlocked FREE Pan-India Delivery!
          </div>
        ` : `
          <div style="color: var(--text-main); font-weight: 500;">
            Add <strong style="color: var(--primary);">${formatINR(remainingForFreeDelivery)}</strong> more for <strong>FREE Delivery</strong>!
          </div>
        `}
      </div>

      <!-- Coupon Bar -->
      <div class="coupon-box">
        <input type="text" id="cart-coupon-input" class="coupon-input" placeholder="Coupon (e.g. DIWALI50)" value="${this.appliedCoupon}">
        <button class="btn btn-sm btn-outline" id="btn-apply-coupon">Apply</button>
      </div>
      ${this.cartData.couponApplied ? `
        <div style="font-size: 0.78rem; color: var(--success); font-weight: 600; display: flex; align-items: center; justify-content: space-between;">
          <span>Applied: ${this.cartData.couponApplied}</span>
          <span>- ${formatINR(this.cartData.discountPrice)}</span>
        </div>
      ` : ''}

      <!-- Bill Breakup -->
      <div class="cart-bill-row">
        <span>Subtotal (${this.cartData.count} items)</span>
        <span>${formatINR(this.cartData.itemsPrice)}</span>
      </div>
      <div class="cart-bill-row">
        <span>GST (18% inclusive/breakup)</span>
        <span>${formatINR(this.cartData.taxPrice)}</span>
      </div>
      <div class="cart-bill-row">
        <span>Pan-India Delivery</span>
        <span>${this.cartData.shippingPrice === 0 ? '<strong style="color: var(--success);">FREE</strong>' : formatINR(this.cartData.shippingPrice)}</span>
      </div>
      ${this.cartData.savings > 0 ? `
        <div class="cart-bill-row" style="color: var(--success); font-weight: 600;">
          <span>Total Savings</span>
          <span>- ${formatINR(this.cartData.savings)}</span>
        </div>
      ` : ''}
      <div class="cart-bill-row total">
        <span>Total Payable</span>
        <span style="color: var(--primary);">${formatINR(this.cartData.totalPrice)}</span>
      </div>

      <button class="btn btn-primary btn-block btn-lg" id="btn-proceed-checkout" style="margin-top: 6px;">
        Proceed to Checkout <i class="fa-solid fa-arrow-right"></i>
      </button>
    `;

    // Event listeners inside drawer
    container.querySelectorAll('.btn-cart-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const qty = parseInt(btn.getAttribute('data-qty'), 10);
        this.updateQuantity(id, qty);
      });
    });

    container.querySelectorAll('.btn-cart-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const qty = parseInt(btn.getAttribute('data-qty'), 10);
        this.updateQuantity(id, qty);
      });
    });

    container.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.removeItem(id);
      });
    });

    document.getElementById('btn-apply-coupon')?.addEventListener('click', () => {
      const code = document.getElementById('cart-coupon-input').value.trim();
      if (code) this.applyCouponCode(code);
    });

    document.getElementById('btn-proceed-checkout')?.addEventListener('click', () => {
      this.closeDrawer();
      window.location.hash = '#checkout';
    });
  }
}

export const cart = new CartManager();
