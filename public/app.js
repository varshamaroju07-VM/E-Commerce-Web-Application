const API_BASE = '/api';

const appState = {
  user: JSON.parse(localStorage.getItem('novaCartUser') || 'null'),
  token: localStorage.getItem('novaCartToken') || '',
  cart: JSON.parse(localStorage.getItem('novaCart') || '[]'),
  products: [],
  orders: [],
  selectedTab: 'catalog'
};

const root = document.getElementById('root');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function saveCart() {
  localStorage.setItem('novaCart', JSON.stringify(appState.cart));
}

function saveAuth() {
  localStorage.setItem('novaCartUser', JSON.stringify(appState.user));
  localStorage.setItem('novaCartToken', appState.token);
}

async function apiCall(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (appState.token) {
    headers.Authorization = `Bearer ${appState.token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function render() {
  root.innerHTML = `
    <header class="topbar">
      <div class="container navbar">
        <a class="brand" href="#">
          <span class="brand-mark">N</span>
          <span>NovaCart</span>
        </a>
        <nav class="nav-links">
          <a href="#catalog">Catalog</a>
          <a href="#about">Why us</a>
          <a href="#admin">Admin</a>
        </nav>
        <div class="nav-actions">
          ${appState.user ? `
            <span class="muted">Hi, ${appState.user.name}</span>
            <button class="btn btn-ghost" id="logoutBtn">Logout</button>
          ` : `
            <button class="btn btn-secondary" id="loginBtn">Login</button>
            <button class="btn btn-primary" id="signupBtn">Sign up</button>
          `}
          <button class="btn btn-primary" id="cartBtn">Cart (${appState.cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
        </div>
      </div>
    </header>

    <main class="container">
      <section class="hero">
        <div class="hero-shell">
          <div class="hero-copy">
            <span class="eyebrow">New season arrivals</span>
            <h1>Upgrade your everyday essentials.</h1>
            <p>Discover premium tech, lifestyle products, and trending accessories designed for modern living.</p>
            <div class="hero-actions">
              <button class="btn btn-primary" id="shopNowBtn">Shop now</button>
              <button class="btn btn-ghost" id="browseDealsBtn">Browse deals</button>
            </div>
          </div>
          <div class="hero-card">
            <div class="product-spotlight">
              <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80" alt="Featured product" />
              <div class="product-meta">
                <span class="tag">Best Seller</span>
                <span class="price-badge">$149.99</span>
              </div>
              <strong>Aero Wireless Headphones</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" class="section">
        <div class="section-heading">
          <h2>Featured collection</h2>
          <span class="muted">Curated for premium modern living</span>
        </div>
        <div class="card-grid" id="productGrid"></div>
      </section>

      <section class="section auth-shell">
        <div class="form-card" id="loginCard">
          <h3>Login</h3>
          <div class="input-group">
            <label>Email</label>
            <input id="loginEmail" type="email" placeholder="you@example.com" />
          </div>
          <div class="input-group">
            <label>Password</label>
            <input id="loginPassword" type="password" placeholder="••••••••" />
          </div>
          <button class="btn btn-primary" id="doLoginBtn" style="width:100%;">Login to account</button>
          <p class="muted">Demo admin: admin@store.com / admin123</p>
        </div>

        <div class="form-card" id="checkoutCard">
          <h3>Checkout</h3>
          <div class="input-group">
            <label>Full address</label>
            <textarea id="addressInput" rows="4" placeholder="123 Market Street, Downtown"></textarea>
          </div>
          <div class="input-group">
            <label>Payment method</label>
            <select id="paymentInput">
              <option>Card</option>
              <option>Cash on Delivery</option>
              <option>UPI</option>
            </select>
          </div>
          <button class="btn btn-primary" id="placeOrderBtn" style="width:100%;">Complete order</button>
        </div>
      </section>

      <section id="admin" class="section admin-grid">
        <div class="form-card">
          <h3>Add product</h3>
          <div class="input-group">
            <label>Name</label>
            <input id="productName" placeholder="Product name" />
          </div>
          <div class="input-group">
            <label>Category</label>
            <input id="productCategory" placeholder="Electronics" />
          </div>
          <div class="input-group">
            <label>Price</label>
            <input id="productPrice" type="number" step="0.01" placeholder="99.99" />
          </div>
          <div class="input-group">
            <label>Stock</label>
            <input id="productStock" type="number" placeholder="12" />
          </div>
          <div class="input-group">
            <label>Image URL</label>
            <input id="productImage" placeholder="https://..." />
          </div>
          <div class="input-group">
            <label>Description</label>
            <textarea id="productDescription" rows="3" placeholder="Great product description..."></textarea>
          </div>
          <button class="btn btn-primary" id="createProductBtn" style="width:100%;">Save product</button>
        </div>

        <div class="form-card">
          <h3>Order tracking</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="ordersTableBody"></tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  `;

  bindEvents();
  renderProducts();
  renderOrders();
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = appState.products.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <div class="product-content">
        <div class="product-meta">
          <span class="tag">${product.category}</span>
          <span class="rating">★ ${product.rating}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <span class="price">${formatCurrency(product.price)}</span>
          <button class="btn btn-primary" data-add-product="${product._id}">Add to cart</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderOrders() {
  const table = document.getElementById('ordersTableBody');
  if (!table) return;

  if (!appState.orders.length) {
    table.innerHTML = '<tr><td colspan="3" class="muted">No orders yet.</td></tr>';
    return;
  }

  table.innerHTML = appState.orders.map(order => `
    <tr>
      <td>#${order._id.slice(-6)}</td>
      <td><span class="status-pill">${order.status}</span></td>
      <td>${formatCurrency(order.total)}</td>
    </tr>
  `).join('');
}

function bindEvents() {
  document.getElementById('loginBtn')?.addEventListener('click', () => {
    const email = document.getElementById('loginEmail')?.value || 'admin@store.com';
    const password = document.getElementById('loginPassword')?.value || 'admin123';
    if (email && password) {
      doLogin(email, password);
    }
  });

  document.getElementById('signupBtn')?.addEventListener('click', async () => {
    const name = prompt('Enter your full name');
    const email = prompt('Enter your email');
    const password = prompt('Create a password');
    if (!name || !email || !password) return;

    try {
      const result = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      appState.user = result.user;
      appState.token = result.token;
      saveAuth();
      render();
    } catch (error) {
      alert(error.message);
    }
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    appState.user = null;
    appState.token = '';
    saveAuth();
    render();
  });

  document.getElementById('shopNowBtn')?.addEventListener('click', () => {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('browseDealsBtn')?.addEventListener('click', () => {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('cartBtn')?.addEventListener('click', () => {
    if (!appState.cart.length) {
      alert('Your cart is empty. Add products to continue.');
      return;
    }

    const subtotal = appState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 12.99;
    const total = subtotal + shipping;

    const summary = `Cart summary\n\n${appState.cart.map(item => `${item.name} x${item.quantity}`).join('\n')}\n\nSubtotal: ${formatCurrency(subtotal)}\nShipping: ${formatCurrency(shipping)}\nTotal: ${formatCurrency(total)}`;
    alert(summary);
  });

  document.getElementById('doLoginBtn')?.addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    doLogin(email, password);
  });

  document.getElementById('placeOrderBtn')?.addEventListener('click', async () => {
    if (!appState.user) {
      alert('Please log in first to checkout.');
      return;
    }

    if (!appState.cart.length) {
      alert('Your cart is empty.');
      return;
    }

    const address = document.getElementById('addressInput').value.trim();
    const paymentMethod = document.getElementById('paymentInput').value;

    if (!address) {
      alert('Please enter delivery address');
      return;
    }

    try {
      const result = await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: appState.cart.map(item => ({ productId: item._id, quantity: item.quantity })),
          address,
          paymentMethod
        })
      });

      appState.orders.unshift(result);
      appState.cart = [];
      saveCart();
      render();
      alert(`Order placed successfully! #${result._id.slice(-6)}`);
    } catch (error) {
      alert(error.message);
    }
  });

  document.getElementById('createProductBtn')?.addEventListener('click', async () => {
    if (!appState.user || appState.user.role !== 'admin') {
      alert('Only admins can create products.');
      return;
    }

    const payload = {
      name: document.getElementById('productName').value.trim(),
      category: document.getElementById('productCategory').value.trim(),
      price: Number(document.getElementById('productPrice').value),
      stock: Number(document.getElementById('productStock').value),
      image: document.getElementById('productImage').value.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      description: document.getElementById('productDescription').value.trim()
    };

    if (!payload.name || !payload.category || !payload.price || !payload.stock) {
      alert('Please complete all required fields');
      return;
    }

    try {
      const product = await apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      appState.products.unshift(product);
      renderProducts();
      alert('Product added successfully');
    } catch (error) {
      alert(error.message);
    }
  });

  document.querySelectorAll('[data-add-product]').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-add-product');
      const product = appState.products.find(item => item._id === productId);
      if (!product) return;

      const existing = appState.cart.find(item => item._id === productId);
      if (existing) {
        existing.quantity += 1;
      } else {
        appState.cart.push({ ...product, quantity: 1 });
      }
      saveCart();
      render();
    });
  });
}

async function doLogin(email, password) {
  try {
    const result = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    appState.user = result.user;
    appState.token = result.token;
    saveAuth();
    render();
  } catch (error) {
    alert(error.message);
  }
}

async function initializeApp() {
  try {
    const products = await apiCall('/products');
    appState.products = products;

    if (appState.token && appState.user) {
      try {
        const me = await apiCall('/auth/me');
        appState.user = me.user;
      } catch (error) {
        appState.user = null;
        appState.token = '';
        saveAuth();
      }
    }

    if (appState.token) {
      try {
        const orders = await apiCall('/orders/my-orders');
        appState.orders = orders;
      } catch (error) {
        appState.orders = [];
      }
    } else {
      appState.orders = [];
    }
  } catch (error) {
    appState.products = [];
    appState.orders = [];
  }

  render();
}

initializeApp();
