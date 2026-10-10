import { api } from './api.js';
import { formatINR, formatDateIST, showToast, escapeHTML } from './utils.js';
import { auth } from './auth.js';

class OrdersManager {
  constructor() {
    this.orders = [];
  }

  async renderOrdersView() {
    const container = document.getElementById('orders-view');
    if (!container) return;

    if (!auth.user) {
      container.innerHTML = `
        <div class="container" style="padding: 60px 20px; text-align: center;">
          <i class="fa-solid fa-box-archive" style="font-size: 3rem; color: var(--border-color); margin-bottom: 16px;"></i>
          <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">Please Login to View Orders</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Track your deliveries and view past invoices.</p>
          <button class="btn btn-primary" id="btn-orders-login">Login / Register</button>
        </div>
      `;
      document.getElementById('btn-orders-login')?.addEventListener('click', () => {
        auth.openAuthModal('login');
      });
      return;
    }

    container.innerHTML = `
      <div class="container" style="padding-top: 40px; padding-bottom: 70px;">
        <div class="section-header">
          <div>
            <span class="section-subtitle">Purchase History</span>
            <h1 class="section-title">My Orders 📦</h1>
            <p class="section-desc">Track Pan-India live delivery status, view invoices, or cancel eligible orders</p>
          </div>
        </div>

        <div id="orders-list-container" style="display: flex; flex-direction: column; gap: 24px;">
          <div class="skeleton" style="height: 180px; border-radius: var(--radius-md);"></div>
          <div class="skeleton" style="height: 180px; border-radius: var(--radius-md);"></div>
        </div>
      </div>
    `;

    try {
      const data = await api.getMyOrders();
      this.orders = data.orders || [];
      const listContainer = document.getElementById('orders-list-container');
      if (!listContainer) return;

      if (this.orders.length === 0) {
        listContainer.innerHTML = `
          <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 50px 20px; text-align: center;">
            <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--border-color); margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 6px;">No orders found yet</h3>
            <p style="color: var(--text-muted); margin-bottom: 20px;">You haven't placed any orders with DesiKart yet.</p>
            <a href="#products" class="btn btn-primary">Start Shopping</a>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = this.orders.map(order => this.renderOrderCardHTML(order)).join('');
      this.attachOrderListeners(listContainer);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  renderOrderCardHTML(order) {
    const isCancelled = order.orderStatus === 'Cancelled';
    const isDelivered = order.orderStatus === 'Delivered';
    const canCancel = order.orderStatus === 'Placed' || order.orderStatus === 'Packed';

    const steps = ['Placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
    const currentStepIndex = steps.indexOf(order.orderStatus);

    return `
      <div class="order-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
        <!-- Order Header -->
        <div style="padding: 16px 24px; background: var(--bg-alt); border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">ORDER ID</div>
            <strong style="color: var(--primary); font-size: 1rem;">${escapeHTML(order.orderId)}</strong>
          </div>
          <div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">PLACED ON</div>
            <span style="font-weight: 600; font-size: 0.9rem;">${formatDateIST(order.createdAt)}</span>
          </div>
          <div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">TOTAL AMOUNT</div>
            <strong style="font-size: 1rem;">${formatINR(order.totalPrice)}</strong>
          </div>
          <div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">STATUS</div>
            <span class="badge-festive" style="background: ${isCancelled ? 'var(--danger)' : isDelivered ? 'var(--success)' : 'var(--primary)'};">
              ${escapeHTML(order.orderStatus.toUpperCase())}
            </span>
          </div>
        </div>

        <div style="padding: 24px;">
          <!-- Timeline -->
          ${!isCancelled ? `
            <div class="timeline" style="margin: 10px 0 30px;">
              ${steps.map((st, idx) => {
                const isCompleted = idx < currentStepIndex || isDelivered;
                const isActive = idx === currentStepIndex && !isDelivered;
                let icon = 'fa-receipt';
                if (st === 'Packed') icon = 'fa-box-open';
                if (st === 'Shipped') icon = 'fa-truck-fast';
                if (st === 'Out for delivery') icon = 'fa-motorcycle';
                if (st === 'Delivered') icon = 'fa-house-chimney';

                return `
                  <div class="timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                    <div class="timeline-dot"><i class="fa-solid ${icon}"></i></div>
                    <span class="timeline-label">${st}</span>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div style="background: var(--danger-light); color: var(--danger); padding: 12px 18px; border-radius: var(--radius-sm); margin-bottom: 20px; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-circle-xmark" style="font-size: 1.2rem;"></i>
              This order has been cancelled. Any prepaid amount will be refunded within 3-5 business days.
            </div>
          `}

          <!-- Order Items -->
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            ${order.items.map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 10px; background: var(--bg-main); border-radius: var(--radius-sm);">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <img src="${item.image}" alt="${escapeHTML(item.title)}" style="width: 52px; height: 52px; object-fit: cover; border-radius: 6px;">
                  <div>
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); line-height: 1.3;">${escapeHTML(item.title)}</h4>
                    <span style="font-size: 0.82rem; color: var(--text-muted);">Quantity: ${item.quantity} • ${formatINR(item.price)} each</span>
                  </div>
                </div>
                <span style="font-weight: 800; font-size: 0.95rem;">${formatINR(item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>

          <!-- Bottom bar with Shipping info and Cancel button -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; padding-top: 16px; border-top: 1px solid var(--border-color);">
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              <strong>Delivery Address:</strong> ${escapeHTML(order.shippingAddress.fullName)}, ${escapeHTML(order.shippingAddress.city)}, ${escapeHTML(order.shippingAddress.state)} (${escapeHTML(order.shippingAddress.pincode)})
            </div>

            <div style="display: flex; gap: 12px; align-items: center;">
              ${canCancel ? `
                <button class="btn btn-sm btn-outline btn-cancel-order" data-id="${order.orderId}" style="border-color: var(--danger); color: var(--danger);">
                  <i class="fa-solid fa-ban"></i> Cancel Order
                </button>
              ` : ''}
              <button class="btn btn-sm btn-outline btn-view-invoice" data-id="${order.orderId}">
                <i class="fa-solid fa-file-invoice"></i> View Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachOrderListeners(container) {
    container.querySelectorAll('.btn-cancel-order').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orderId = btn.getAttribute('data-id');
        if (!confirm(`Are you sure you want to cancel order ${orderId}?`)) return;

        try {
          const res = await api.cancelOrder(orderId);
          showToast(res.message, 'info');
          this.renderOrdersView();
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    });

    container.querySelectorAll('.btn-view-invoice').forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        const order = this.orders.find(o => o.orderId === orderId);
        if (order) this.showReceiptModal(order);
      });
    });
  }

  showReceiptModal(order) {
    const modal = document.getElementById('receipt-modal');
    const body = document.getElementById('receipt-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="border: 2px dashed var(--border-color); padding: 24px; border-radius: var(--radius-sm); font-family: monospace; background: var(--bg-main);">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-family: var(--font-festive); color: var(--primary); font-size: 1.8rem; margin-bottom: 2px;">DesiKart</h2>
          <p style="font-size: 0.78rem;">PAN-INDIA ARTISAN & FESTIVE COMMERCE</p>
          <p style="font-size: 0.75rem; color: var(--text-muted);">GSTIN: 27AABCD1234F1Z8 • Tax Invoice / Bill of Supply</p>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 16px;">
          <div>
            <strong>Invoice To:</strong><br>
            ${escapeHTML(order.shippingAddress.fullName)}<br>
            ${escapeHTML(order.shippingAddress.street)}<br>
            ${escapeHTML(order.shippingAddress.city)}, ${escapeHTML(order.shippingAddress.state)} - ${escapeHTML(order.shippingAddress.pincode)}<br>
            Phone: +91 ${escapeHTML(order.shippingAddress.phone)}
          </div>
          <div style="text-align: right;">
            <strong>Order ID:</strong> ${escapeHTML(order.orderId)}<br>
            <strong>Date:</strong> ${formatDateIST(order.createdAt)}<br>
            <strong>Payment:</strong> ${escapeHTML(order.paymentMethod)}<br>
            <strong>Status:</strong> ${escapeHTML(order.paymentStatus)}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin-bottom: 16px;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-color); text-align: left;">
              <th style="padding: 6px 0;">Item Description</th>
              <th style="padding: 6px 0; text-align: center;">Qty</th>
              <th style="padding: 6px 0; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 8px 0;">${escapeHTML(item.title)}</td>
                <td style="padding: 8px 0; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px 0; text-align: right;">${formatINR(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.82rem; text-align: right;">
          <div>Items Subtotal: ${formatINR(order.itemsPrice)}</div>
          <div>GST (18% included): ${formatINR(order.taxPrice)}</div>
          <div>Pan-India Shipping: ${order.shippingPrice === 0 ? 'FREE' : formatINR(order.shippingPrice)}</div>
          ${order.discountPrice > 0 ? `<div>Discount: - ${formatINR(order.discountPrice)}</div>` : ''}
          <div style="font-size: 1rem; font-weight: bold; border-top: 1px solid var(--border-color); padding-top: 6px; margin-top: 4px;">
            Total Paid: ${formatINR(order.totalPrice)}
          </div>
        </div>

        <div style="text-align: center; margin-top: 24px; font-size: 0.75rem; color: var(--text-muted);">
          Dhanyavaad for shopping on DesiKart! Made with ❤ in India 🙏
        </div>
      </div>
    `;

    modal.classList.add('active');
  }
}

export const orders = new OrdersManager();
