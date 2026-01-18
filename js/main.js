/* ==========================================
   Nina's Notions - Main JavaScript
   ========================================== */

// Mock Data for Products
const PRODUCTS = [
  {
    id: 1,
    name: "Floral Scrapbook Paper Pack",
    price: 12.99,
    category: "paper",
    image: "placeholder",
    description: "Beautiful floral patterns perfect for spring layouts. Includes 24 double-sided sheets.",
    badge: "New"
  },
  {
    id: 2,
    name: "Craft Scissors Set",
    price: 18.50,
    category: "tools",
    image: "placeholder",
    description: "Precision cutting scissors with comfortable grip. Set of 6 decorative edge patterns.",
    badge: null
  },
  {
    id: 3,
    name: "Washi Tape Collection - Pastels",
    price: 9.99,
    category: "embellishments",
    image: "placeholder",
    description: "Set of 10 pastel washi tapes in various widths and patterns.",
    badge: "Popular"
  },
  {
    id: 4,
    name: "Rubber Stamp Kit - Seasons",
    price: 24.99,
    category: "stamps",
    image: "placeholder",
    description: "Four-season stamp collection with 20 detailed designs.",
    badge: null
  },
  {
    id: 5,
    name: "Diamond Art Kit - Sunflower",
    price: 15.99,
    category: "diamond-art",
    image: "placeholder",
    description: "Complete diamond painting kit with premium drills. 12x16 inch canvas.",
    badge: "Sale"
  },
  {
    id: 6,
    name: "Cardstock Variety Pack",
    price: 14.99,
    category: "paper",
    image: "placeholder",
    description: "50 sheets of premium cardstock in 25 colors. Perfect for card making.",
    badge: null
  },
  {
    id: 7,
    name: "Embossing Powder Set",
    price: 22.00,
    category: "embellishments",
    image: "placeholder",
    description: "12 metallic and glitter embossing powders for stunning effects.",
    badge: null
  },
  {
    id: 8,
    name: "Die Cut Machine - Starter",
    price: 89.99,
    category: "tools",
    image: "placeholder",
    description: "Compact die cutting machine perfect for beginners. Includes starter die set.",
    badge: "Best Seller"
  },
  {
    id: 9,
    name: "Valentine Card Kit",
    price: 16.99,
    category: "kits",
    image: "placeholder",
    description: "Make 12 beautiful Valentine cards. All materials included.",
    badge: "Seasonal"
  },
  {
    id: 10,
    name: "Adhesive Runner Refills - 3 Pack",
    price: 11.99,
    category: "adhesives",
    image: "placeholder",
    description: "Permanent adhesive runner refills. Compatible with most runners.",
    badge: null
  },
  {
    id: 11,
    name: "Alcohol Ink Set - Jewel Tones",
    price: 19.99,
    category: "inks",
    image: "placeholder",
    description: "Vibrant jewel-toned alcohol inks. Set of 9 colors.",
    badge: null
  },
  {
    id: 12,
    name: "Porch Leaner Blank - 4ft",
    price: 25.00,
    category: "wood",
    image: "placeholder",
    description: "Unfinished wood porch leaner. Ready for your creative touch.",
    badge: null
  }
];

// Mock Data for Classes
const CLASSES = [
  {
    id: 1,
    name: "Porch Leaner Workshop",
    cost: 50,
    dates: ["01/19/26"],
    sessions: 1,
    description: "We are excited to be partnering with Nina's Notions again to offer a new class! Registration is now open for our Porch Leaner Workshop on Monday, January 19th at 6:00pm. Must be registered through the City of St Johns Recreation Department.",
    link: "https://stjohnsmi.myrec.com"
  },
  {
    id: 2,
    name: "Diamond Art & Social Hour with Sandy - Valentine Gnome",
    cost: 10,
    dates: ["01/21/26"],
    sessions: 1,
    description: "Create a festive Valentine Gnome while relaxing, chatting, and crafting together. All skill levels welcome—come create and connect."
  },
  {
    id: 3,
    name: "Monthly Scrapbooking Workshop",
    cost: 15,
    dates: ["01/21/26", "02/18/26", "03/18/26", "04/15/26"],
    sessions: 1,
    description: "Create a two-page scrapbook layout each month using Nina's Notions equipment—just bring your adhesives. Attend monthly and by Christmas you'll have a beautiful handmade gift for someone special. All skill levels welcome."
  },
  {
    id: 4,
    name: "Cards for Kids",
    cost: 0,
    dates: ["01/22/26", "01/24/26", "01/29/26"],
    sessions: 1,
    description: "Weekly Craft Workshop. Thursdays at 1 PM, starting January 15th. Just bring your creativity! Use Nina's tools, paper, stamps, and dies. Join us weekly for hands-on crafting, fun projects, and a welcoming creative space. All cards collected will be sent to Cards for Kids to brighten a child's day! All skill levels are welcome!"
  }
];

// Utility Functions
const utils = {
  // Format currency
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  },

  // Create element with classes and attributes
  createElement(tag, className, attributes = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    Object.entries(attributes).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    return el;
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Get URL parameter
  getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  // Show toast notification
  showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__message">${message}</span>
      <button class="toast__close" aria-label="Close notification">&times;</button>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    // Auto remove
    const autoRemove = setTimeout(() => removeToast(toast), 4000);

    // Close button
    toast.querySelector('.toast__close').addEventListener('click', () => {
      clearTimeout(autoRemove);
      removeToast(toast);
    });

    function removeToast(el) {
      el.classList.remove('is-visible');
      setTimeout(() => el.remove(), 300);
    }
  }
};

// Product rendering functions
const productRenderer = {
  // Create a product card
  createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'card product-card';
    card.innerHTML = `
      ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
      <div class="card__image placeholder-image" data-product-id="${product.id}"></div>
      <div class="card__body">
        <h3 class="card__title">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <p class="card__description">${product.description}</p>
        <p class="card__price">${utils.formatPrice(product.price)}</p>
        <div class="product-card__actions">
          <button class="btn btn--primary btn--small add-to-cart-btn" data-product-id="${product.id}">
            Add to Cart
          </button>
          <a href="product.html?id=${product.id}" class="btn btn--secondary btn--small">
            View Details
          </a>
        </div>
      </div>
    `;
    return card;
  },

  // Render products to a container
  renderProducts(container, products = PRODUCTS, limit = null) {
    if (!container) return;
    container.innerHTML = '';
    
    const productsToRender = limit ? products.slice(0, limit) : products;
    productsToRender.forEach(product => {
      container.appendChild(this.createProductCard(product));
    });

    // Add event listeners for add to cart buttons
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        const product = PRODUCTS.find(p => p.id === productId);
        if (product && window.cart) {
          window.cart.addItem(product);
          utils.showToast(`${product.name} added to cart!`, 'success');
        }
      });
    });
  },

  // Get product by ID
  getProductById(id) {
    return PRODUCTS.find(p => p.id === parseInt(id));
  },

  // Filter products by category
  filterByCategory(category) {
    if (!category || category === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === category);
  }
};

// Class rendering functions
const classRenderer = {
  // Create a class card
  createClassCard(classItem) {
    const isFree = classItem.cost === 0;
    const card = document.createElement('article');
    card.className = 'card class-card';
    
    let datesHtml = '';
    if (classItem.dates.length > 1) {
      datesHtml = `
        <div class="class-card__dates">
          <label for="date-${classItem.id}" class="form-label">Select Date:</label>
          <select id="date-${classItem.id}" class="class-card__date-select">
            ${classItem.dates.map(date => `<option value="${date}">${date} - 1 session</option>`).join('')}
          </select>
        </div>
      `;
    } else {
      datesHtml = `<p class="class-card__dates"><strong>Date:</strong> ${classItem.dates[0]}</p>`;
    }

    card.innerHTML = `
      <div class="card__body">
        <h3 class="card__title">${classItem.name}</h3>
        <div class="class-card__meta">
          <span class="class-card__meta-item">
            <strong>Cost:</strong> ${isFree ? '<span class="badge badge--free">Free</span>' : utils.formatPrice(classItem.cost)}
          </span>
        </div>
        ${datesHtml}
        <p class="card__description">${classItem.description}</p>
        <button class="btn btn--accent register-btn" data-class-id="${classItem.id}">
          Register Now
        </button>
      </div>
    `;
    return card;
  },

  // Render classes to a container
  renderClasses(container, classes = CLASSES, limit = null) {
    if (!container) return;
    container.innerHTML = '';
    
    const classesToRender = limit ? classes.slice(0, limit) : classes;
    classesToRender.forEach(classItem => {
      container.appendChild(this.createClassCard(classItem));
    });

    // Add event listeners for register buttons
    container.querySelectorAll('.register-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const classId = parseInt(e.target.dataset.classId);
        const classItem = CLASSES.find(c => c.id === classId);
        if (classItem) {
          utils.showToast(`Registration for "${classItem.name}" submitted! We'll contact you shortly.`, 'success');
        }
      });
    });
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  // Render products if container exists
  const productsGrid = document.querySelector('[data-products-grid]');
  if (productsGrid) {
    const limit = productsGrid.dataset.limit ? parseInt(productsGrid.dataset.limit) : null;
    productRenderer.renderProducts(productsGrid, PRODUCTS, limit);
  }

  // Render classes if container exists
  const classesGrid = document.querySelector('[data-classes-grid]');
  if (classesGrid) {
    const limit = classesGrid.dataset.limit ? parseInt(classesGrid.dataset.limit) : null;
    classRenderer.renderClasses(classesGrid, CLASSES, limit);
  }

  // Product detail page
  const productDetail = document.querySelector('[data-product-detail]');
  if (productDetail) {
    const productId = utils.getUrlParam('id');
    const product = productRenderer.getProductById(productId);
    if (product) {
      renderProductDetail(product, productDetail);
    }
  }
});

// Render product detail page
function renderProductDetail(product, container) {
  container.innerHTML = `
    <div class="product-detail__gallery">
      <div class="product-detail__image placeholder-image"></div>
    </div>
    <div class="product-detail__info">
      <nav class="breadcrumbs">
        <span class="breadcrumbs__item">
          <a href="index.html" class="breadcrumbs__link">Home</a>
        </span>
        <span class="breadcrumbs__item">
          <a href="shop.html" class="breadcrumbs__link">Shop</a>
        </span>
        <span class="breadcrumbs__item">
          <span class="breadcrumbs__current">${product.name}</span>
        </span>
      </nav>
      ${product.badge ? `<span class="badge badge--primary mb-md">${product.badge}</span>` : ''}
      <h1 class="product-detail__title">${product.name}</h1>
      <p class="product-detail__price">${utils.formatPrice(product.price)}</p>
      <p class="product-detail__description">${product.description}</p>
      <div class="product-detail__actions">
        <div class="quantity-selector">
          <button class="quantity-selector__btn" data-action="decrease">−</button>
          <input type="number" class="quantity-selector__input" value="1" min="1" max="99" id="quantity">
          <button class="quantity-selector__btn" data-action="increase">+</button>
        </div>
        <button class="btn btn--primary btn--large add-to-cart-detail" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    </div>
  `;

  // Quantity selector functionality
  const quantityInput = container.querySelector('#quantity');
  container.querySelectorAll('.quantity-selector__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      let value = parseInt(quantityInput.value);
      if (btn.dataset.action === 'increase' && value < 99) {
        quantityInput.value = value + 1;
      } else if (btn.dataset.action === 'decrease' && value > 1) {
        quantityInput.value = value - 1;
      }
    });
  });

  // Add to cart
  container.querySelector('.add-to-cart-detail').addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    if (window.cart) {
      for (let i = 0; i < quantity; i++) {
        window.cart.addItem(product);
      }
      utils.showToast(`${quantity} × ${product.name} added to cart!`, 'success');
    }
  });
}

// Export for use in other modules
window.PRODUCTS = PRODUCTS;
window.CLASSES = CLASSES;
window.utils = utils;
window.productRenderer = productRenderer;
window.classRenderer = classRenderer;

