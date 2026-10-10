import { api } from './api.js';
import { formatINR, showToast, escapeHTML, formatDateIST } from './utils.js';
import { cart } from './cart.js';
import { wishlist } from './wishlist.js';
import { auth } from './auth.js';

class ProductCatalogue {
  constructor() {
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.currentSort = 'newest';
    this.priceMax = 35000;
    this.page = 1;
    this.limit = 12;
    this.products = [];
    this.totalProducts = 0;
    this.hasMore = false;
    this.activeProduct = null;
    this.activeZoomImg = null;
  }

  init() {
    this.bindCatalogFilters();
  }

  bindCatalogFilters() {
    // Sort dropdown
    const sortSelect = document.getElementById('catalog-sort-select');
    sortSelect?.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.page = 1;
      this.fetchAndRenderCatalog();
    });

    // Price range slider
    const priceSlider = document.getElementById('price-range-slider');
    const priceLabel = document.getElementById('price-slider-value');
    priceSlider?.addEventListener('input', (e) => {
      this.priceMax = Number(e.target.value);
      if (priceLabel) priceLabel.textContent = formatINR(this.priceMax);
    });
    priceSlider?.addEventListener('change', () => {
      this.page = 1;
      this.fetchAndRenderCatalog();
    });

    // Filter reset
    document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
      this.currentCategory = 'All';
      this.searchQuery = '';
      this.currentSort = 'newest';
      this.priceMax = 35000;
      this.page = 1;
      
      const searchInput = document.getElementById('main-search-input');
      if (searchInput) searchInput.value = '';
      if (priceSlider) priceSlider.value = 35000;
      if (priceLabel) priceLabel.textContent = formatINR(35000);
      if (sortSelect) sortSelect.value = 'newest';

      document.querySelectorAll('.category-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-cat') === 'All');
      });

      this.fetchAndRenderCatalog();
    });

    // Load more button
    document.getElementById('btn-load-more')?.addEventListener('click', () => {
      if (this.hasMore) {
        this.page++;
        this.fetchAndRenderCatalog(true);
      }
    });

    // Mobile filter toggle
    document.getElementById('btn-mobile-filter-toggle')?.addEventListener('click', () => {
      document.querySelector('.filter-sidebar')?.classList.add('mobile-open');
    });
    document.getElementById('btn-close-mobile-filter')?.addEventListener('click', () => {
      document.querySelector('.filter-sidebar')?.classList.remove('mobile-open');
    });
  }

  async loadCategoriesBar() {
    try {
      const data = await api.getCategories();
      const categories = [{ name: 'All', count: 24 }, ...data.categories];

      // 1. Home category pills
      const homeContainer = document.getElementById('category-pills-container');
      if (homeContainer) {
        homeContainer.innerHTML = categories.map(c => `
          <button class="category-pill ${c.name === this.currentCategory ? 'active' : ''}" data-cat="${escapeHTML(c.name)}">
            ${c.name === 'All' ? '<i class="fa-solid fa-border-all"></i>' : ''}
            ${escapeHTML(c.name)}
            <span style="opacity: 0.75; font-size: 0.75rem;">(${c.count})</span>
          </button>
        `).join('');

        homeContainer.querySelectorAll('.category-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            this.setCategory(pill.getAttribute('data-cat'));
          });
        });
      }

      // 2. Catalogue top pills
      const catPills = document.getElementById('catalogue-category-pills');
      if (catPills) {
        catPills.innerHTML = categories.map(c => `
          <button class="category-pill ${c.name === this.currentCategory ? 'active' : ''}" data-cat="${escapeHTML(c.name)}">
            ${c.name === 'All' ? '<i class="fa-solid fa-border-all"></i>' : ''}
            ${escapeHTML(c.name)}
            <span style="opacity: 0.75; font-size: 0.75rem;">(${c.count})</span>
          </button>
        `).join('');

        catPills.querySelectorAll('.category-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            this.setCategory(pill.getAttribute('data-cat'));
          });
        });
      }

      // 3. Sidebar radio options
      const sidebarContainer = document.getElementById('sidebar-categories-container');
      if (sidebarContainer) {
        sidebarContainer.innerHTML = categories.map(c => `
          <label class="filter-label" style="display: flex; align-items: center; justify-content: space-between; padding: 4px 0;">
            <span style="display: flex; align-items: center; gap: 8px;">
              <input type="radio" name="cat_filter_radio" value="${escapeHTML(c.name)}" ${c.name === this.currentCategory ? 'checked' : ''} style="accent-color: var(--primary);">
              ${escapeHTML(c.name)}
            </span>
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">(${c.count})</span>
          </label>
        `).join('');

        sidebarContainer.querySelectorAll('input[name="cat_filter_radio"]').forEach(radio => {
          radio.addEventListener('change', (e) => {
            this.setCategory(e.target.value);
          });
        });
      }
    } catch (err) {
      console.warn('Error loading categories:', err);
    }
  }

  setCategory(categoryName) {
    this.currentCategory = categoryName;
    this.page = 1;

    document.querySelectorAll('.category-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-cat') === categoryName);
    });

    document.querySelectorAll('input[name="cat_filter_radio"]').forEach(r => {
      r.checked = (r.value === categoryName);
    });

    if (window.location.hash !== '#products') {
      window.location.hash = '#products';
    } else {
      this.fetchAndRenderCatalog();
    }
  }

  async fetchAndRenderCatalog(append = false) {
    const grid = document.getElementById('catalog-products-grid');
    const countLabel = document.getElementById('catalog-count-label');
    const loadMoreBtn = document.getElementById('btn-load-more');

    if (!grid) return;

    if (!append) {
      grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="product-card">
          <div class="product-card-img-wrap skeleton"></div>
          <div class="product-card-body" style="gap: 8px;">
            <div class="skeleton" style="height: 12px; width: 40%;"></div>
            <div class="skeleton" style="height: 18px; width: 80%;"></div>
            <div class="skeleton" style="height: 14px; width: 30%;"></div>
            <div class="skeleton" style="height: 24px; width: 50%; margin-top: 10px;"></div>
          </div>
        </div>
      `).join('');
    }

    try {
      const params = {
        category: this.currentCategory !== 'All' ? this.currentCategory : undefined,
        search: this.searchQuery || undefined,
        sort: this.currentSort,
        maxPrice: this.priceMax < 35000 ? this.priceMax : undefined,
        page: this.page,
        limit: this.limit
      };

      const data = await api.getProducts(params);
      this.totalProducts = data.pagination.total;
      this.hasMore = data.pagination.hasMore;

      if (append) {
        this.products = [...this.products, ...data.products];
      } else {
        this.products = data.products;
      }

      if (countLabel) {
        countLabel.innerHTML = `Showing <strong>${this.products.length}</strong> of <strong>${this.totalProducts}</strong> handcrafted items`;
      }

      if (this.products.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: var(--border-color); margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 6px;">No products match your search</h3>
            <p style="color: var(--text-muted); margin-bottom: 20px;">Try adjusting your filters or price range.</p>
            <button class="btn btn-primary btn-sm" id="btn-empty-reset">Reset All Filters</button>
          </div>
        `;
        document.getElementById('btn-empty-reset')?.addEventListener('click', () => {
          document.getElementById('btn-reset-filters')?.click();
        });
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
      }

      const cardsHTML = this.products.map(p => this.createProductCardHTML(p)).join('');

      grid.innerHTML = cardsHTML;
      this.attachCardEventListeners(grid);

      if (loadMoreBtn) {
        loadMoreBtn.style.display = this.hasMore ? 'inline-flex' : 'none';
      }
    } catch (err) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--danger);">
          <p>Failed to load products: ${escapeHTML(err.message)}</p>
        </div>
      `;
    }
  }

  createProductCardHTML(p) {
    const isWished = wishlist.isInWishlist(p._id);
    return `
      <div class="product-card" data-id="${p._id}">
        <div class="product-card-img-wrap">
          <img src="${p.images?.[0] || ''}" alt="${escapeHTML(p.title)}" class="product-card-img" loading="lazy">
          ${p.discountPercent > 0 ? `<span class="badge-discount">${p.discountPercent}% OFF</span>` : ''}
          <button class="btn-wishlist ${isWished ? 'active' : ''}" data-id="${p._id}" title="Add to Wishlist">
            <i class="${isWished ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
          </button>
          <div class="quick-view-overlay">
            <button class="btn-quick-view" data-id="${p._id}">
              <i class="fa-solid fa-eye"></i> Quick View
            </button>
          </div>
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${escapeHTML(p.category)}</span>
          <h4 class="product-card-title btn-open-detail" data-id="${p._id}">${escapeHTML(p.title)}</h4>
          <div class="product-card-rating">
            <span class="rating-pill">★ ${p.rating || '4.5'}</span>
            <span class="rating-reviews-count">(${p.numReviews || 0} reviews)</span>
          </div>
          <div class="product-card-pricing">
            <span class="price-current">${formatINR(p.price)}</span>
            ${p.mrp > p.price ? `<span class="price-mrp">${formatINR(p.mrp)}</span>` : ''}
            ${p.discountPercent > 0 ? `<span class="price-save">Save ${formatINR(p.mrp - p.price)}</span>` : ''}
          </div>
          <div class="product-card-actions">
            <button class="btn btn-primary btn-sm btn-card-add-cart" data-id="${p._id}">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachCardEventListeners(container) {
    container.querySelectorAll('.btn-card-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const prod = this.products.find(p => p._id === id);
        cart.addItem(id, 1, btn, prod);
      });
    });

    container.querySelectorAll('.btn-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const prod = this.products.find(p => p._id === id);
        wishlist.toggle(id, btn, prod);
      });
    });

    container.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        this.openQuickView(id);
      });
    });

    container.querySelectorAll('.btn-open-detail').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        window.location.hash = `#product-details?id=${id}`;
      });
    });
  }

  async openQuickView(productId) {
    try {
      const data = await api.getProductById(productId);
      const p = data.product;
      this.activeProduct = p;

      const modal = document.getElementById('quick-view-modal');
      const body = document.getElementById('quick-view-modal-body');
      if (!modal || !body) return;

      body.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px;">
          <div>
            <img src="${p.images?.[0] || ''}" alt="${escapeHTML(p.title)}" style="width: 100%; border-radius: var(--radius-sm); aspect-ratio: 1; object-fit: cover; border: 1px solid var(--border-color);">
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); text-transform: uppercase;">${escapeHTML(p.brand || 'DesiKart')} • ${escapeHTML(p.origin || 'India')}</span>
            <h3 style="font-size: 1.3rem; font-weight: 700; line-height: 1.3;">${escapeHTML(p.title)}</h3>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="rating-pill">★ ${p.rating}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">${p.numReviews} Verified Indian Reviews</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 10px; margin: 8px 0;">
              <span class="price-current" style="font-size: 1.5rem;">${formatINR(p.price)}</span>
              ${p.mrp > p.price ? `<span class="price-mrp" style="font-size: 1rem;">${formatINR(p.mrp)}</span>` : ''}
              ${p.discountPercent > 0 ? `<span class="badge-discount">${p.discountPercent}% OFF</span>` : ''}
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">${escapeHTML(p.description)}</p>
            <div style="margin-top: 14px; display: flex; gap: 10px;">
              <button class="btn btn-primary btn-block btn-qv-add-cart" data-id="${p._id}">
                <i class="fa-solid fa-cart-shopping"></i> Add to Cart
              </button>
              <button class="btn btn-outline btn-qv-full-detail" data-id="${p._id}">
                Details
              </button>
            </div>
          </div>
        </div>
      `;

      body.querySelector('.btn-qv-add-cart')?.addEventListener('click', (e) => {
        modal.classList.remove('active');
        cart.addItem(p._id, 1, e.currentTarget);
      });

      body.querySelector('.btn-qv-full-detail')?.addEventListener('click', () => {
        modal.classList.remove('active');
        window.location.hash = `#product-details?id=${p._id}`;
      });

      modal.classList.add('active');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async renderProductDetailPage(productId) {
    const container = document.getElementById('product-details-view');
    if (!container) return;

    container.innerHTML = `
      <div class="container" style="padding: 60px 20px; text-align: center;">
        <div class="skeleton" style="height: 400px; max-width: 900px; margin: 0 auto; border-radius: var(--radius-md);"></div>
      </div>
    `;

    try {
      const data = await api.getProductById(productId);
      const p = data.product;
      const related = data.related || [];
      this.activeProduct = p;

      const isWished = wishlist.isInWishlist(p._id);
      let selectedImageIndex = 0;

      container.innerHTML = `
        <div class="container" style="padding-top: 30px; padding-bottom: 70px;">
          <!-- Breadcrumb -->
          <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">
            <a href="#home" style="color: inherit; text-decoration: none;">Home</a>
            <span>/</span>
            <a href="#products" style="color: inherit; text-decoration: none;">Catalogue</a>
            <span>/</span>
            <span style="color: var(--text-main); font-weight: 600;">${escapeHTML(p.category)}</span>
          </div>

          <div class="product-detail-grid">
            <!-- Left: Image Gallery with Zoom -->
            <div class="gallery-wrap">
              <div class="gallery-main-img-wrap" id="detail-zoom-container">
                <img src="${p.images?.[0] || ''}" alt="${escapeHTML(p.title)}" id="detail-main-img" class="gallery-main-img">
                ${p.discountPercent > 0 ? `<span class="badge-discount" style="font-size: 0.85rem; padding: 6px 14px;">${p.discountPercent}% OFF FESTIVE DEAL</span>` : ''}
              </div>
              <div class="gallery-thumbs">
                ${p.images?.map((img, idx) => `
                  <div class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
                    <img src="${img}" alt="Thumbnail ${idx + 1}">
                  </div>
                `).join('') || ''}
              </div>
            </div>

            <!-- Right: Product Information & Buy Actions -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <span class="badge-festive" style="margin-bottom: 8px; display: inline-block;">
                  <i class="fa-solid fa-certificate"></i> Authentic • ${escapeHTML(p.origin || 'India')}
                </span>
                <h1 style="font-size: clamp(1.6rem, 2.8vw, 2.2rem); font-weight: 800; line-height: 1.25; margin-bottom: 8px;">
                  ${escapeHTML(p.title)}
                </h1>
                <p style="font-size: 0.88rem; color: var(--text-muted);">
                  Crafted by <strong>${escapeHTML(p.brand || 'DesiKart Artisans')}</strong>
                </p>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="rating-pill" style="font-size: 0.85rem; padding: 4px 10px;">★ ${p.rating} / 5</span>
                <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted);">${p.numReviews} Indian Customer Reviews</span>
                <span style="color: var(--success); font-size: 0.85rem; font-weight: 700;"><i class="fa-solid fa-circle-check"></i> In Stock (${p.stockCount} left)</span>
              </div>

              <!-- Pricing Card -->
              <div style="background: var(--bg-alt); padding: 18px 22px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 4px;">
                  <span class="price-current" style="font-size: 2rem; color: var(--primary);">${formatINR(p.price)}</span>
                  ${p.mrp > p.price ? `<span class="price-mrp" style="font-size: 1.15rem;">MRP ${formatINR(p.mrp)}</span>` : ''}
                  ${p.discountPercent > 0 ? `<span style="color: var(--success); font-weight: 700; font-size: 0.92rem;">Save ${formatINR(p.mrp - p.price)}</span>` : ''}
                </div>
                <span style="font-size: 0.78rem; color: var(--text-muted);">Inclusive of all Indian taxes (GST) • Free delivery on orders over ₹499</span>
              </div>

              <p style="font-size: 1rem; color: var(--text-main); line-height: 1.7;">
                ${escapeHTML(p.description)}
              </p>

              <!-- Highlights -->
              ${p.highlights && p.highlights.length > 0 ? `
                <div style="margin: 8px 0;">
                  <h4 style="font-size: 0.92rem; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Highlights</h4>
                  <ul style="list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    ${p.highlights.map(h => `
                      <li style="font-size: 0.85rem; display: flex; align-items: center; gap: 8px; color: var(--text-main);">
                        <i class="fa-solid fa-check" style="color: var(--success);"></i> ${escapeHTML(h)}
                      </li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}

              <!-- Purchase Controls -->
              <div style="display: flex; gap: 14px; align-items: center; margin-top: 10px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-card); padding: 4px 8px;">
                  <button class="qty-btn" id="pdetail-qty-minus" style="font-size: 1.1rem; width: 34px; height: 34px;">-</button>
                  <span id="pdetail-qty-val" style="padding: 0 16px; font-weight: 700; font-size: 1rem;">1</span>
                  <button class="qty-btn" id="pdetail-qty-plus" style="font-size: 1.1rem; width: 34px; height: 34px;">+</button>
                </div>
                <button class="btn btn-primary btn-lg" id="btn-pdetail-add-cart" style="flex: 1;">
                  <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                </button>
                <button class="btn btn-secondary btn-lg" id="btn-pdetail-buy-now">
                  Buy Now
                </button>
                <button class="icon-btn btn-wishlist ${isWished ? 'active' : ''}" id="btn-pdetail-wishlist" style="width: 50px; height: 50px;" title="Wishlist">
                  <i class="${isWished ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
                </button>
              </div>

              <!-- Trust / Pan-India Delivery Note -->
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px; padding: 14px; background: var(--bg-main); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="text-align: center; font-size: 0.8rem; font-weight: 600;">
                  <i class="fa-solid fa-truck" style="color: var(--primary); display: block; font-size: 1.1rem; margin-bottom: 4px;"></i>
                  Pan-India 3-5 Days
                </div>
                <div style="text-align: center; font-size: 0.8rem; font-weight: 600;">
                  <i class="fa-solid fa-indian-rupee-sign" style="color: var(--gold); display: block; font-size: 1.1rem; margin-bottom: 4px;"></i>
                  Cash on Delivery
                </div>
                <div style="text-align: center; font-size: 0.8rem; font-weight: 600;">
                  <i class="fa-solid fa-rotate-left" style="color: var(--success); display: block; font-size: 1.1rem; margin-bottom: 4px;"></i>
                  7 Days Easy Returns
                </div>
              </div>
            </div>
          </div>

          <!-- Specifications Table -->
          ${p.specifications && Object.keys(p.specifications).length > 0 ? `
            <div style="margin-top: 50px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 28px;">
              <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 20px;">Product Specifications</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
                ${Object.entries(p.specifications).map(([key, val]) => `
                  <div style="display: flex; justify-content: space-between; padding: 10px 14px; background: var(--bg-alt); border-radius: var(--radius-sm);">
                    <span style="font-weight: 600; color: var(--text-muted); font-size: 0.88rem;">${escapeHTML(key)}</span>
                    <span style="font-weight: 700; color: var(--text-main); font-size: 0.88rem;">${escapeHTML(val)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Customer Reviews Section -->
          <div style="margin-top: 50px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 700;">Customer Reviews (${p.reviews?.length || 0})</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Real feedback from verified buyers across India</p>
              </div>
              <button class="btn btn-sm btn-outline" id="btn-toggle-review-form">
                <i class="fa-solid fa-pen"></i> Write a Review
              </button>
            </div>

            <!-- Add Review Form (Hidden by default) -->
            <form id="add-review-form" class="hidden" style="margin-bottom: 30px; background: var(--bg-alt); padding: 20px; border-radius: var(--radius-sm);">
              <h4 style="font-weight: 700; margin-bottom: 14px;">Rate this Product</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label required">Your Rating</label>
                  <select id="review-rating-select" class="form-control" required>
                    <option value="5">⭐⭐⭐⭐⭐ 5 - Shandar! (Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                    <option value="3">⭐⭐⭐ 3 - Good / Average</option>
                    <option value="2">⭐⭐ 2 - Below Expectations</option>
                    <option value="1">⭐ 1 - Not Recommended</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">City</label>
                  <input type="text" id="review-city-input" class="form-control" placeholder="e.g. Mumbai, Pune, Jaipur">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label required">Review Description</label>
                <textarea id="review-comment-input" class="form-control" rows="3" placeholder="Share your experience with fabric, aroma, taste, or delivery..." required></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-sm">Submit Review</button>
            </form>

            <!-- Reviews List -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${p.reviews && p.reviews.length > 0 ? p.reviews.map(r => `
                <div style="padding: 16px; border-bottom: 1px solid var(--border-color);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-weight: 700; font-size: 0.95rem;">${escapeHTML(r.userName)}</span>
                      <span style="font-size: 0.78rem; color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(r.city)}</span>
                      <span class="badge-festive" style="font-size: 0.65rem; background: var(--success);">VERIFIED BUYER</span>
                    </div>
                    <span style="font-size: 0.78rem; color: var(--text-light);">${escapeHTML(r.date)}</span>
                  </div>
                  <div style="color: #f59f00; font-size: 0.85rem; margin-bottom: 6px;">
                    ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
                  </div>
                  <p style="font-size: 0.9rem; color: var(--text-main); line-height: 1.5;">${escapeHTML(r.comment)}</p>
                </div>
              `).join('') : '<p style="color: var(--text-muted);">Be the first to review this product!</p>'}
            </div>
          </div>

          <!-- Related Products Section -->
          ${related.length > 0 ? `
            <div style="margin-top: 60px;">
              <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 24px;">You May Also Like</h3>
              <div class="products-grid">
                ${related.map(rel => this.createProductCardHTML(rel)).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      // Gallery thumbnail switcher and zoom effect
      const mainImg = document.getElementById('detail-main-img');
      const zoomContainer = document.getElementById('detail-zoom-container');

      container.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          container.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
          const idx = parseInt(thumb.getAttribute('data-idx'), 10);
          if (mainImg && p.images[idx]) {
            mainImg.src = p.images[idx];
          }
        });
      });

      // Hover Zoom Interaction
      zoomContainer?.addEventListener('mousemove', (e) => {
        const rect = zoomContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        if (mainImg) {
          mainImg.style.transformOrigin = `${x}% ${y}%`;
          mainImg.style.transform = 'scale(1.8)';
        }
      });
      zoomContainer?.addEventListener('mouseleave', () => {
        if (mainImg) {
          mainImg.style.transform = 'scale(1)';
        }
      });

      // Quantity selector
      let qty = 1;
      const qtyVal = document.getElementById('pdetail-qty-val');
      document.getElementById('pdetail-qty-minus')?.addEventListener('click', () => {
        if (qty > 1) {
          qty--;
          if (qtyVal) qtyVal.textContent = qty;
        }
      });
      document.getElementById('pdetail-qty-plus')?.addEventListener('click', () => {
        if (qty < (p.stockCount || 10)) {
          qty++;
          if (qtyVal) qtyVal.textContent = qty;
        }
      });

      // Add to cart button
      document.getElementById('btn-pdetail-add-cart')?.addEventListener('click', (e) => {
        cart.addItem(p._id, qty, e.currentTarget, p);
      });

      // Buy now button: adds to cart and redirects straight to checkout
      document.getElementById('btn-pdetail-buy-now')?.addEventListener('click', async (e) => {
        await cart.addItem(p._id, qty, e.currentTarget, p);
        window.location.hash = '#checkout';
      });

      // Wishlist toggle
      document.getElementById('btn-pdetail-wishlist')?.addEventListener('click', (e) => {
        wishlist.toggle(p._id, e.currentTarget, p);
      });

      // Review form toggle
      const reviewForm = document.getElementById('add-review-form');
      document.getElementById('btn-toggle-review-form')?.addEventListener('click', () => {
        reviewForm?.classList.toggle('hidden');
      });

      // Review submit
      reviewForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const rating = document.getElementById('review-rating-select').value;
        const comment = document.getElementById('review-comment-input').value.trim();
        const city = document.getElementById('review-city-input').value.trim();

        try {
          const res = await api.addReview(p._id, { rating, comment, city });
          showToast(res.message, 'success');
          this.renderProductDetailPage(p._id);
        } catch (err) {
          showToast(err.message, 'error');
        }
      });

      // Attach card listeners for related products
      this.attachCardEventListeners(container);
    } catch (err) {
      container.innerHTML = `
        <div class="container" style="padding: 60px 20px; text-align: center; color: var(--danger);">
          <h3>Product Not Found</h3>
          <p>${escapeHTML(err.message)}</p>
          <a href="#products" class="btn btn-primary" style="margin-top: 16px;">Browse Catalogue</a>
        </div>
      `;
    }
  }

  async renderFeaturedSection() {
    const container = document.getElementById('featured-products-container');
    if (!container) return;

    try {
      const data = await api.getFeaturedProducts();
      container.innerHTML = data.featured.map(p => this.createProductCardHTML(p)).join('');
      this.attachCardEventListeners(container);
    } catch (err) {
      console.warn('Featured products fetch failed:', err);
    }
  }
}

export const catalog = new ProductCatalogue();
