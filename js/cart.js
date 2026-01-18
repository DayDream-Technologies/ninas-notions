/* ==========================================
   Nina's Notions - Shopping Cart
   ========================================== */

class ShoppingCart {
  constructor() {
    this.items = [];
    this.storageKey = 'ninasNotionsCart';
    this.loadFromStorage();
    this.init();
  }

  init() {
    this.renderCartIcon();
    this.createCartPanel();
    this.bindEvents();
    this.updateCartCount();
  }

  // Load cart from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.items = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading cart:', e);
      this.items = [];
    }
  }

  // Save cart to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }

  // Add item to cart
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }

    this.saveToStorage();
    this.updateCartCount();
    this.renderCartItems();
  }

  // Remove item from cart
  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
    this.updateCartCount();
    this.renderCartItems();
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
        this.updateCartCount();
        this.renderCartItems();
      }
    }
  }

  // Clear cart
  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.updateCartCount();
    this.renderCartItems();
  }

  // Get cart total
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get total item count
  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Update cart count badge
  updateCartCount() {
    const badge = document.querySelector('.cart-icon__badge');
    if (badge) {
      const count = this.getItemCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // Render cart icon in header
  renderCartIcon() {
    const cartIconContainer = document.querySelector('.cart-icon');
    if (cartIconContainer) {
      cartIconContainer.innerHTML = `
        <button class="cart-icon__btn" aria-label="Open shopping cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="cart-icon__badge" style="display: none;">0</span>
        </button>
      `;
    }
  }

  // Create cart slide-out panel
  createCartPanel() {
    // Check if panel already exists
    if (document.querySelector('.cart-panel')) return;

    const panel = document.createElement('div');
    panel.className = 'cart-panel';
    panel.innerHTML = `
      <div class="cart-panel__header">
        <h2 class="cart-panel__title">Your Cart</h2>
        <button class="cart-panel__close" aria-label="Close cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="cart-panel__items"></div>
      <div class="cart-panel__footer">
        <div class="cart-panel__total">
          <span>Subtotal:</span>
          <span class="cart-panel__total-amount">$0.00</span>
        </div>
        <button class="btn btn--primary btn--full cart-panel__checkout">
          Proceed to Checkout
        </button>
        <button class="btn btn--secondary btn--full btn--small mt-sm cart-panel__clear">
          Clear Cart
        </button>
      </div>
    `;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    this.renderCartItems();
  }

  // Render cart items in panel
  renderCartItems() {
    const itemsContainer = document.querySelector('.cart-panel__items');
    const totalElement = document.querySelector('.cart-panel__total-amount');
    
    if (!itemsContainer) return;

    if (this.items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-panel__empty">
          <p>Your cart is empty</p>
          <a href="shop.html" class="btn btn--primary">Start Shopping</a>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = this.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__image placeholder-image"></div>
          <div class="cart-item__details">
            <h4 class="cart-item__name">${item.name}</h4>
            <p class="cart-item__price">${window.utils ? window.utils.formatPrice(item.price) : '$' + item.price.toFixed(2)}</p>
            <div class="cart-item__quantity">
              <button class="cart-item__qty-btn" data-action="decrease" data-id="${item.id}">−</button>
              <span class="cart-item__qty-value">${item.quantity}</span>
              <button class="cart-item__qty-btn" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `).join('');
    }

    if (totalElement) {
      const total = this.getTotal();
      totalElement.textContent = window.utils ? window.utils.formatPrice(total) : '$' + total.toFixed(2);
    }
  }

  // Bind all event listeners
  bindEvents() {
    // Open cart panel
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cart-icon__btn')) {
        this.openCart();
      }
    });

    // Close cart panel
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cart-panel__close') || e.target.closest('.cart-overlay')) {
        this.closeCart();
      }
    });

    // Quantity buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-item__qty-btn');
      if (btn) {
        const productId = parseInt(btn.dataset.id);
        const item = this.items.find(i => i.id === productId);
        if (item) {
          const newQty = btn.dataset.action === 'increase' 
            ? item.quantity + 1 
            : item.quantity - 1;
          this.updateQuantity(productId, newQty);
        }
      }
    });

    // Remove item
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.cart-item__remove');
      if (btn) {
        const productId = parseInt(btn.dataset.id);
        this.removeItem(productId);
        if (window.utils) {
          window.utils.showToast('Item removed from cart', 'info');
        }
      }
    });

    // Clear cart
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cart-panel__clear')) {
        this.clearCart();
        if (window.utils) {
          window.utils.showToast('Cart cleared', 'info');
        }
      }
    });

    // Checkout
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cart-panel__checkout')) {
        if (this.items.length === 0) {
          if (window.utils) {
            window.utils.showToast('Your cart is empty', 'error');
          }
        } else {
          if (window.utils) {
            window.utils.showToast('Checkout coming soon! Thank you for shopping with us.', 'info');
          }
        }
      }
    });

    // Close with escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCart();
      }
    });
  }

  // Open cart panel
  openCart() {
    const panel = document.querySelector('.cart-panel');
    const overlay = document.querySelector('.cart-overlay');
    if (panel && overlay) {
      panel.classList.add('is-open');
      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close cart panel
  closeCart() {
    const panel = document.querySelector('.cart-panel');
    const overlay = document.querySelector('.cart-overlay');
    if (panel && overlay) {
      panel.classList.remove('is-open');
      overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }
}

// Cart-specific styles (injected)
const cartStyles = `
  .cart-icon {
    position: relative;
  }

  .cart-icon__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    transition: background-color var(--transition-fast);
  }

  .cart-icon__btn:hover {
    background-color: var(--color-cream);
  }

  .cart-icon__badge {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: var(--color-primary);
    color: white;
    font-size: 11px;
    font-weight: 600;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cart-overlay {
    position: fixed;
    inset: 0;
    background: rgba(58, 53, 48, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
    z-index: 998;
  }

  .cart-overlay.is-active {
    opacity: 1;
    visibility: visible;
  }

  .cart-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 400px;
    height: 100%;
    background: white;
    box-shadow: var(--shadow-xl);
    transform: translateX(100%);
    transition: transform var(--transition-base);
    z-index: 999;
    display: flex;
    flex-direction: column;
  }

  .cart-panel.is-open {
    transform: translateX(0);
  }

  .cart-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-lg);
    border-bottom: 1px solid var(--color-light-gray);
  }

  .cart-panel__title {
    font-size: var(--text-xl);
    margin: 0;
  }

  .cart-panel__close {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color var(--transition-fast);
  }

  .cart-panel__close:hover {
    background-color: var(--color-cream);
  }

  .cart-panel__items {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-md);
  }

  .cart-panel__empty {
    text-align: center;
    padding: var(--space-2xl);
    color: var(--color-medium-gray);
  }

  .cart-panel__empty p {
    margin-bottom: var(--space-lg);
  }

  .cart-panel__footer {
    padding: var(--space-lg);
    border-top: 1px solid var(--color-light-gray);
    background: var(--color-cream);
  }

  .cart-panel__total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-md);
    font-size: var(--text-lg);
    font-weight: 600;
  }

  .cart-panel__total-amount {
    color: var(--color-primary);
    font-size: var(--text-xl);
  }

  .cart-item {
    display: grid;
    grid-template-columns: 60px 1fr auto;
    gap: var(--space-md);
    padding: var(--space-md);
    border-bottom: 1px solid var(--color-light-gray);
    align-items: start;
  }

  .cart-item__image {
    width: 60px;
    height: 60px;
    border-radius: var(--border-radius);
  }

  .cart-item__name {
    font-size: var(--text-sm);
    font-weight: 500;
    margin-bottom: var(--space-xs);
  }

  .cart-item__price {
    font-size: var(--text-sm);
    color: var(--color-primary);
    margin-bottom: var(--space-sm);
  }

  .cart-item__quantity {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .cart-item__qty-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--color-light-gray);
    font-size: var(--text-sm);
    transition: background-color var(--transition-fast);
  }

  .cart-item__qty-btn:hover {
    background: var(--color-primary-light);
  }

  .cart-item__qty-value {
    font-weight: 500;
    min-width: 20px;
    text-align: center;
  }

  .cart-item__remove {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--color-medium-gray);
    transition: all var(--transition-fast);
  }

  .cart-item__remove:hover {
    background: var(--color-error);
    color: white;
  }

  /* Toast notifications */
  .toast {
    position: fixed;
    bottom: var(--space-xl);
    right: var(--space-xl);
    background: var(--color-charcoal);
    color: white;
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    gap: var(--space-md);
    box-shadow: var(--shadow-lg);
    transform: translateY(100px);
    opacity: 0;
    transition: all var(--transition-base);
    z-index: 1000;
  }

  .toast.is-visible {
    transform: translateY(0);
    opacity: 1;
  }

  .toast--success {
    background: var(--color-success);
  }

  .toast--error {
    background: var(--color-error);
  }

  .toast--info {
    background: var(--color-accent);
  }

  .toast__close {
    font-size: var(--text-xl);
    line-height: 1;
    opacity: 0.8;
    transition: opacity var(--transition-fast);
  }

  .toast__close:hover {
    opacity: 1;
  }

  @media (max-width: 480px) {
    .cart-panel {
      max-width: 100%;
    }

    .toast {
      left: var(--space-md);
      right: var(--space-md);
      bottom: var(--space-md);
    }
  }
`;

// Inject cart styles
const styleSheet = document.createElement('style');
styleSheet.textContent = cartStyles;
document.head.appendChild(styleSheet);

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
  window.cart = new ShoppingCart();
});

