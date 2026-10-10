import { api } from './api.js';
import { formatINR, showToast, escapeHTML, INDIAN_STATES, triggerConfetti } from './utils.js';
import { auth } from './auth.js';
import { cart } from './cart.js';

class CheckoutManager {
  constructor() {
    this.selectedAddress = null;
    this.selectedPayment = 'Cash on Delivery';
  }

  async renderCheckoutView() {
    const container = document.getElementById('checkout-view');
    if (!container) return;

    if (!auth.user) {
      container.innerHTML = `
        <div class="container" style="padding: 60px 20px; text-align: center; max-width: 540px; margin: 0 auto;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 18px;">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 8px;">Sign In to Complete Checkout</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 0.95rem;">
            Please sign in to save your delivery address, track orders live, and complete payment.
          </p>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <button class="btn btn-primary btn-lg" id="btn-checkout-quick-demo">
              <i class="fa-solid fa-bolt"></i> Instant 1-Click Demo Login (Aarav Mehta)
            </button>
            <button class="btn btn-outline" id="btn-checkout-login">
              Custom Login / New Account
            </button>
          </div>
        </div>
      `;
      document.getElementById('btn-checkout-quick-demo')?.addEventListener('click', async () => {
        const ok = await auth.login('aarav@desikart.in', 'Password@123');
        if (ok) this.renderCheckoutView();
      });
      document.getElementById('btn-checkout-login')?.addEventListener('click', () => {
        auth.openAuthModal('login');
      });
      return;
    }

    await cart.syncCart();

    if (!cart.cartData.items || cart.cartData.items.length === 0) {
      container.innerHTML = `
        <div class="container" style="padding: 60px 20px; text-align: center;">
          <i class="fa-solid fa-cart-arrow-down" style="font-size: 3.5rem; color: var(--border-color); margin-bottom: 16px;"></i>
          <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">Your Cart is Empty</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Please add items to your cart before proceeding to checkout.</p>
          <a href="#products" class="btn btn-primary">Browse DesiKart Catalogue</a>
        </div>
      `;
      return;
    }

    const userAddresses = auth.user.addresses || [];
    const defaultAddr = userAddresses.find(a => a.isDefault) || userAddresses[0] || null;
    this.selectedAddress = defaultAddr;

    container.innerHTML = `
      <div class="container" style="padding-top: 30px; padding-bottom: 70px;">
        <div class="section-header" style="margin-bottom: 24px;">
          <div>
            <span class="section-subtitle">Secure Pan-India Checkout</span>
            <h1 class="section-title">Complete Your Order 🛍️</h1>
            <p class="section-desc">Fast, encrypted, and trusted delivery across 28 states & 8 UTs</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 36px;" class="checkout-layout">
          <!-- Left Column: Shipping & Payment -->
          <div style="display: flex; flex-direction: column; gap: 28px;">
            <!-- Step 1: Delivery Address -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                <h3 style="font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                  <span style="width: 28px; height: 28px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">1</span>
                  Delivery Address (India)
                </h3>
              </div>

              <!-- Saved Addresses List (if any) -->
              ${userAddresses.length > 0 ? `
                <div style="margin-bottom: 20px;">
                  <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 10px; text-transform: uppercase;">Choose Saved Address</span>
                  <div style="display: flex; flex-direction: column; gap: 10px;" id="checkout-saved-addresses">
                    ${userAddresses.map((addr, idx) => `
                      <label style="border: 1px solid ${this.selectedAddress?._id === addr._id ? 'var(--primary)' : 'var(--border-color)'}; border-radius: var(--radius-sm); padding: 14px; background: ${this.selectedAddress?._id === addr._id ? 'var(--primary-light)' : 'var(--bg-main)'}; cursor: pointer; display: flex; gap: 12px; align-items: flex-start;">
                        <input type="radio" name="selected_shipping_address" value="${addr._id}" ${this.selectedAddress?._id === addr._id ? 'checked' : ''} style="margin-top: 4px; accent-color: var(--primary);">
                        <div style="flex: 1;">
                          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <strong>${escapeHTML(addr.fullName)}</strong>
                            <span class="badge-festive" style="font-size: 0.65rem;">${escapeHTML(addr.addressType || 'Home')}</span>
                            <span style="font-size: 0.82rem; color: var(--text-muted);">+91 ${escapeHTML(addr.phone)}</span>
                          </div>
                          <p style="font-size: 0.85rem; color: var(--text-main); margin-bottom: 2px;">${escapeHTML(addr.street)}${addr.landmark ? ', ' + escapeHTML(addr.landmark) : ''}</p>
                          <p style="font-size: 0.85rem; color: var(--text-muted);">${escapeHTML(addr.city)}, ${escapeHTML(addr.state)} – <strong>${escapeHTML(addr.pincode)}</strong></p>
                        </div>
                      </label>
                    `).join('')}
                  </div>
                </div>
                <div style="text-align: right; margin-bottom: 14px;">
                  <button type="button" class="btn btn-sm btn-outline" id="btn-toggle-new-address-form">
                    <i class="fa-solid fa-plus"></i> Or Add New Address
                  </button>
                </div>
              ` : ''}

              <!-- New Address Form (Shown if no saved address or user clicks Add) -->
              <div id="checkout-new-address-container" class="${userAddresses.length > 0 ? 'hidden' : ''}">
                <form id="checkout-new-address-form">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                    <div class="form-group">
                      <label class="form-label required">Full Name</label>
                      <input type="text" id="chk-name" class="form-control" placeholder="Recipient's Name" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label required">Mobile Number</label>
                      <input type="tel" id="chk-phone" class="form-control" placeholder="10-digit mobile number" pattern="[6-9][0-9]{9}" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label required">Flat / House No. / Building / Street</label>
                    <input type="text" id="chk-street" class="form-control" placeholder="e.g. 402, Shivam Enclave, M.G. Road" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Landmark (Optional)</label>
                    <input type="text" id="chk-landmark" class="form-control" placeholder="e.g. Near Metro Station / Opposite Temple">
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
                    <div class="form-group">
                      <label class="form-label required">PIN Code (6 digits)</label>
                      <input type="text" id="chk-pincode" class="form-control" placeholder="e.g. 400001" maxlength="6" pattern="[1-9][0-9]{5}" required>
                      <div class="form-error" id="chk-pincode-error">Invalid 6-digit Indian PIN code</div>
                    </div>
                    <div class="form-group">
                      <label class="form-label required">City / District</label>
                      <input type="text" id="chk-city" class="form-control" placeholder="e.g. Mumbai, Bengaluru" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label required">State</label>
                      <select id="chk-state" class="form-control" required>
                        <option value="">Select State</option>
                        ${INDIAN_STATES.map(s => `<option value="${s}">${s}</option>`).join('')}
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Address Type</label>
                    <div style="display: flex; gap: 16px;">
                      <label><input type="radio" name="chk-addr-type" value="Home" checked> Home (All day delivery)</label>
                      <label><input type="radio" name="chk-addr-type" value="Work"> Work (10 AM - 6 PM)</label>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary btn-sm" style="margin-top: 4px;">
                    Save and Deliver to this Address
                  </button>
                </form>
              </div>
            </div>

            <!-- Step 2: Payment Options -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px;">
              <h3 style="font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 10px; margin-bottom: 18px;">
                <span style="width: 28px; height: 28px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">2</span>
                Payment Options (Simulated & Encrypted)
              </h3>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                <!-- COD Option -->
                <label style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 16px; background: var(--bg-main); cursor: pointer; display: flex; gap: 14px; align-items: flex-start;">
                  <input type="radio" name="payment_method" value="Cash on Delivery" checked style="margin-top: 4px; accent-color: var(--primary);">
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <strong>Cash on Delivery (COD)</strong>
                      <span class="badge-festive" style="background: var(--success); font-size: 0.7rem;">NO EXTRA FEE</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Pay with cash or UPI QR scanner upon delivery to your doorstep.</p>
                  </div>
                </label>

                <!-- UPI Option -->
                <label style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 16px; background: var(--bg-main); cursor: pointer; display: flex; gap: 14px; align-items: flex-start;">
                  <input type="radio" name="payment_method" value="UPI" style="margin-top: 4px; accent-color: var(--primary);">
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <strong>UPI Instant Pay</strong>
                      <span style="font-size: 0.78rem; font-weight: 700; color: #145da0;">GPay • PhonePe • Paytm • BHIM</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Instant confirmation with zero transaction surcharge.</p>
                    <div id="upi-details-box" class="hidden" style="margin-top: 10px; padding: 10px; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                      <input type="text" id="upi-vpa-input" class="form-control" placeholder="Enter UPI ID (e.g. mobile@okhdfcbank)" value="aarav@okaxis">
                    </div>
                  </div>
                </label>

                <!-- Card Option -->
                <label style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 16px; background: var(--bg-main); cursor: pointer; display: flex; gap: 14px; align-items: flex-start;">
                  <input type="radio" name="payment_method" value="Card" style="margin-top: 4px; accent-color: var(--primary);">
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <strong>Debit / Credit Card</strong>
                      <span style="font-size: 0.78rem; font-weight: 700; color: #d48806;">RuPay • Visa • Mastercard</span>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Demo mode enabled: 100% simulated safe testing.</p>
                    <div id="card-details-box" class="hidden" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                      <input type="text" class="form-control" placeholder="Card Number (Demo: 4532 •••• •••• 8821)" value="4532 9821 0023 8821">
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <input type="text" class="form-control" placeholder="MM/YY" value="12/28">
                        <input type="password" class="form-control" placeholder="CVV" maxlength="3" value="842">
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Right Column: Order Summary & Place Order Button -->
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 24px; position: sticky; top: calc(var(--navbar-height) + 20px);">
              <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
                Order Summary (${cart.cartData.count} items)
              </h3>

              <!-- Cart items preview -->
              <div style="display: flex; flex-direction: column; gap: 12px; max-height: 220px; overflow-y: auto; margin-bottom: 18px; padding-right: 4px;">
                ${cart.cartData.items.map(item => `
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: 0.85rem;">
                    <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                      <img src="${item.product?.images?.[0] || ''}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
                      <div>
                        <div style="font-weight: 600; line-height: 1.2;">${escapeHTML(item.product?.title || '')}</div>
                        <span style="color: var(--text-muted); font-size: 0.78rem;">Qty: ${item.quantity}</span>
                      </div>
                    </div>
                    <span style="font-weight: 700;">${formatINR(item.product?.price * item.quantity)}</span>
                  </div>
                `).join('')}
              </div>

              <!-- Price breakdown -->
              <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; padding-top: 14px; border-top: 1px dashed var(--border-color); margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                  <span>Items Subtotal</span>
                  <span>${formatINR(cart.cartData.itemsPrice)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                  <span>GST (18% inclusive)</span>
                  <span>${formatINR(cart.cartData.taxPrice)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                  <span>Pan-India Delivery</span>
                  <span>${cart.cartData.shippingPrice === 0 ? '<strong style="color: var(--success);">FREE</strong>' : formatINR(cart.cartData.shippingPrice)}</span>
                </div>
                ${cart.cartData.discountPrice > 0 ? `
                  <div style="display: flex; justify-content: space-between; color: var(--success); font-weight: 600;">
                    <span>Coupon Discount (${cart.appliedCoupon})</span>
                    <span>- ${formatINR(cart.cartData.discountPrice)}</span>
                  </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800; color: var(--text-main); padding-top: 12px; border-top: 1px solid var(--border-color);">
                  <span>Total Amount</span>
                  <span style="color: var(--primary);">${formatINR(cart.cartData.totalPrice)}</span>
                </div>
              </div>

              <!-- Delivery estimate note -->
              <div style="background: var(--bg-alt); padding: 12px; border-radius: var(--radius-sm); font-size: 0.82rem; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-calendar-check" style="color: var(--primary); font-size: 1.1rem;"></i>
                <div>
                  <strong>Estimated Delivery:</strong> 3 – 5 Business Days via Express BlueDart / Delhivery
                </div>
              </div>

              <button class="btn btn-primary btn-block btn-lg" id="btn-place-order">
                Confirm & Place Order <i class="fa-solid fa-lock"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    const newAddressContainer = document.getElementById('checkout-new-address-container');
    document.getElementById('btn-toggle-new-address-form')?.addEventListener('click', () => {
      newAddressContainer?.classList.toggle('hidden');
    });

    // Saved address radio change
    document.querySelectorAll('input[name="selected_shipping_address"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const id = e.target.value;
        this.selectedAddress = userAddresses.find(a => a._id === id);
        this.renderCheckoutView();
      });
    });

    // New address form submission
    document.getElementById('checkout-new-address-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pincode = document.getElementById('chk-pincode').value.trim();
      const pinErr = document.getElementById('chk-pincode-error');

      if (!/^[1-9][0-9]{5}$/.test(pincode)) {
        pinErr?.classList.add('show');
        return;
      }
      pinErr?.classList.remove('show');

      const addressData = {
        fullName: document.getElementById('chk-name').value.trim(),
        phone: document.getElementById('chk-phone').value.trim(),
        street: document.getElementById('chk-street').value.trim(),
        landmark: document.getElementById('chk-landmark').value.trim(),
        city: document.getElementById('chk-city').value.trim(),
        state: document.getElementById('chk-state').value,
        pincode,
        addressType: document.querySelector('input[name="chk-addr-type"]:checked')?.value || 'Home',
        isDefault: true
      };

      try {
        const res = await api.addAddress(addressData);
        auth.user.addresses = res.addresses;
        this.selectedAddress = res.addresses[res.addresses.length - 1];
        showToast('Address saved successfully!', 'success');
        this.renderCheckoutView();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });

    // Payment method selector
    const upiBox = document.getElementById('upi-details-box');
    const cardBox = document.getElementById('card-details-box');
    document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedPayment = e.target.value;
        upiBox?.classList.toggle('hidden', this.selectedPayment !== 'UPI');
        cardBox?.classList.toggle('hidden', this.selectedPayment !== 'Card');
      });
    });

    // Place Order Action
    document.getElementById('btn-place-order')?.addEventListener('click', async () => {
      await this.handlePlaceOrder();
    });
  }

  async handlePlaceOrder() {
    if (!this.selectedAddress) {
      showToast('Please select or add a delivery address with a valid 6-digit PIN code.', 'error');
      return;
    }

    const placeBtn = document.getElementById('btn-place-order');
    if (placeBtn) {
      placeBtn.disabled = true;
      placeBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...`;
    }

    try {
      const orderData = {
        shippingAddress: this.selectedAddress,
        paymentMethod: this.selectedPayment,
        couponCode: cart.appliedCoupon,
        paymentDetails: {
          upiId: this.selectedPayment === 'UPI' ? (document.getElementById('upi-vpa-input')?.value || 'aarav@okaxis') : undefined,
          cardLast4: this.selectedPayment === 'Card' ? '8821' : undefined
        }
      };

      const res = await api.createOrder(orderData);
      triggerConfetti();
      showToast(res.message, 'success');

      // Clear local cart state
      await cart.syncCart();

      // Navigate to order confirmation
      window.location.hash = `#order-success?id=${res.order.orderId}`;
    } catch (err) {
      showToast(err.message, 'error');
      if (placeBtn) {
        placeBtn.disabled = false;
        placeBtn.innerHTML = `Confirm & Place Order <i class="fa-solid fa-lock"></i>`;
      }
    }
  }

  async renderOrderSuccessView(orderId) {
    const container = document.getElementById('order-success-view');
    if (!container) return;

    try {
      const data = await api.getOrderById(orderId);
      const order = data.order;

      container.innerHTML = `
        <div class="container container-sm" style="padding-top: 50px; padding-bottom: 70px;">
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 40px; text-align: center; box-shadow: var(--shadow-md);">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--success-light); color: var(--success); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 20px;">
              <i class="fa-solid fa-check"></i>
            </div>
            <span class="badge-festive" style="background: var(--success); font-size: 0.82rem; margin-bottom: 12px; display: inline-block;">
              ORDER CONFIRMED 🎉
            </span>
            <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 8px;">Badhaai Ho! Order Placed Successfully</h1>
            <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 24px;">
              Thank you for supporting authentic Indian artisans. Your order ID is <strong style="color: var(--primary);">${escapeHTML(order.orderId)}</strong>
            </p>

            <!-- Order Timeline -->
            <div class="timeline" style="margin: 36px 0;">
              <div class="timeline-step completed">
                <div class="timeline-dot"><i class="fa-solid fa-receipt"></i></div>
                <span class="timeline-label">Placed</span>
                <span class="timeline-time">${formatDateIST(order.createdAt)}</span>
              </div>
              <div class="timeline-step active">
                <div class="timeline-dot"><i class="fa-solid fa-box-open"></i></div>
                <span class="timeline-label">Packed</span>
                <span class="timeline-time">In Progress</span>
              </div>
              <div class="timeline-step">
                <div class="timeline-dot"><i class="fa-solid fa-truck-fast"></i></div>
                <span class="timeline-label">Shipped</span>
                <span class="timeline-time">Soon</span>
              </div>
              <div class="timeline-step">
                <div class="timeline-dot"><i class="fa-solid fa-house-chimney"></i></div>
                <span class="timeline-label">Delivered</span>
                <span class="timeline-time">${escapeHTML(order.estimatedDelivery)}</span>
              </div>
            </div>

            <!-- Summary Card -->
            <div style="background: var(--bg-alt); padding: 20px; border-radius: var(--radius-md); text-align: left; margin-bottom: 28px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 0.88rem;">
                <div>
                  <span style="color: var(--text-muted); display: block;">Delivering To:</span>
                  <strong>${escapeHTML(order.shippingAddress.fullName)}</strong>
                  <p>${escapeHTML(order.shippingAddress.street)}, ${escapeHTML(order.shippingAddress.city)}, ${escapeHTML(order.shippingAddress.state)} – ${escapeHTML(order.shippingAddress.pincode)}</p>
                </div>
                <div>
                  <span style="color: var(--text-muted); display: block;">Payment:</span>
                  <strong>${escapeHTML(order.paymentMethod)} (${order.paymentStatus})</strong>
                  <p>Total Paid: <strong style="color: var(--primary); font-size: 1.1rem;">${formatINR(order.totalPrice)}</strong></p>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
              <a href="#orders" class="btn btn-primary">
                <i class="fa-solid fa-box"></i> View All Orders
              </a>
              <a href="#products" class="btn btn-outline">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `
        <div class="container" style="padding: 60px 20px; text-align: center; color: var(--danger);">
          <p>Order not found: ${escapeHTML(err.message)}</p>
          <a href="#products" class="btn btn-primary">Return to Shop</a>
        </div>
      `;
    }
  }
}

export const checkout = new CheckoutManager();
