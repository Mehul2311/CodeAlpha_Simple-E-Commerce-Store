class ApiClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const config = {
      ...options,
      headers,
      credentials: 'include' // sends httpOnly cookies
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      if (!options.silent) {
        console.warn(`API Notice on [${options.method || 'GET'} ${endpoint}]:`, err.message);
      }
      throw err;
    }
  }

  // Auth
  register(userData) {
    return this.request('/auth/register', { method: 'POST', body: userData });
  }

  login(credentials) {
    return this.request('/auth/login', { method: 'POST', body: credentials });
  }

  logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  getMe() {
    return this.request('/auth/me', { silent: true });
  }

  updateProfile(profileData) {
    return this.request('/auth/profile', { method: 'PUT', body: profileData });
  }

  addAddress(addressData) {
    return this.request('/auth/addresses', { method: 'POST', body: addressData });
  }

  deleteAddress(addressId) {
    return this.request(`/auth/addresses/${addressId}`, { method: 'DELETE' });
  }

  // Products
  getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return this.request(`/products?${query.toString()}`);
  }

  getProductById(id) {
    return this.request(`/products/${id}`);
  }

  getFeaturedProducts() {
    return this.request('/products/featured');
  }

  getCategories() {
    return this.request('/products/categories');
  }

  addReview(productId, reviewData) {
    return this.request(`/products/${productId}/reviews`, { method: 'POST', body: reviewData });
  }

  // Cart
  getCart(coupon = '') {
    const query = coupon ? `?coupon=${encodeURIComponent(coupon)}` : '';
    return this.request(`/cart${query}`);
  }

  addToCart(productId, quantity = 1) {
    return this.request('/cart/add', { method: 'POST', body: { productId, quantity } });
  }

  updateCartQty(productId, quantity) {
    return this.request('/cart/update', { method: 'PUT', body: { productId, quantity } });
  }

  removeFromCart(productId) {
    return this.request(`/cart/${productId}`, { method: 'DELETE' });
  }

  applyCoupon(code) {
    return this.request('/cart/coupon', { method: 'POST', body: { code } });
  }

  // Orders
  createOrder(orderData) {
    return this.request('/orders', { method: 'POST', body: orderData });
  }

  getMyOrders() {
    return this.request('/orders/my');
  }

  getOrderById(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  cancelOrder(orderId) {
    return this.request(`/orders/${orderId}/cancel`, { method: 'PUT' });
  }

  // Wishlist
  getWishlist() {
    return this.request('/users/wishlist');
  }

  toggleWishlist(productId) {
    return this.request('/users/wishlist/toggle', { method: 'POST', body: { productId } });
  }
}

export const api = new ApiClient();
